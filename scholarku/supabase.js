/* Zero-dependency Supabase REST/Auth adapter. Supabase enforces access via SQL RLS. */
(() => {
  const c = window.SCHOLARKU_CONFIG || {};
  const enabled = Boolean(c.SUPABASE_URL && c.SUPABASE_ANON_KEY);
  const root = (c.SUPABASE_URL || '').replace(/\/$/, '');
  const key = c.SUPABASE_ANON_KEY || '';
  let session = null;
  try { session = JSON.parse(localStorage.getItem('scholarku.auth') || 'null'); } catch {}
  function getAccess() { return session?.access_token || key; }
  async function request(path, options = {}, auth = true) {
    if (!enabled) throw new Error('Live backend is not configured');
    const headers = { apikey: key, Authorization: 'Bearer ' + (auth ? getAccess() : key), ...options.headers };
    if (options.body && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
    let res = await fetch(root + path, { ...options, headers });
    if (res.status === 401 && session?.refresh_token && auth) {
      try { await refresh(); headers.Authorization = 'Bearer ' + getAccess(); res = await fetch(root + path, { ...options, headers }); } catch {}
    }
    const txt = await res.text();
    let data; try { data = txt ? JSON.parse(txt) : null; } catch { data = txt; }
    if (!res.ok) throw new Error(data?.msg || data?.error_description || data?.message || `Request failed (${res.status})`);
    return data;
  }
  function saveSession(data) {
    session = data?.access_token ? data : null;
    if (session) localStorage.setItem('scholarku.auth', JSON.stringify(session));
    else localStorage.removeItem('scholarku.auth');
    return session;
  }
  async function refresh() {
    const data = await request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: session.refresh_token }) }, false);
    return saveSession(data);
  }
  async function signIn(email, password) {
    return saveSession(await request('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) }, false));
  }
  async function signUp(email, password, name, role = 'student') {
    return await request('/auth/v1/signup', { method: 'POST', body: JSON.stringify({ email, password, data: { full_name: name, desired_role: role === 'employer' ? 'employer' : 'student' } }) }, false);
  }
  // Google OAuth uses PKCE. No Google secret or password belongs in this frontend.
  function reloadSession() {
    try { session = JSON.parse(localStorage.getItem('scholarku.auth') || 'null'); } catch { session = null; }
    return session;
  }
  const oauthKey = state => 'scholarku.oauth.' + state;
  const base64url = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  async function completeGoogleSignIn(url) {
    if (!enabled || url.origin !== location.origin || url.pathname !== '/auth-callback.html') throw new Error('Invalid sign-in destination');
    const state = url.searchParams.get('state');
    const raw = state && localStorage.getItem(oauthKey(state));
    if (!raw) throw new Error('Sign-in request expired');
    localStorage.removeItem(oauthKey(state));
    const pending = JSON.parse(raw);
    if (Date.now() - pending.created > 5 * 60 * 1000) throw new Error('Sign-in request expired. Please try again.');
    if (url.searchParams.has('error')) throw new Error((url.searchParams.get('error_description') || url.searchParams.get('error')).slice(0, 300));
    if (!url.searchParams.get('code')) throw new Error('Google did not return an authorization code. Check the Supabase redirect URL settings.');
    const data = await request('/auth/v1/token?grant_type=pkce', {
      method: 'POST', body: JSON.stringify({auth_code: url.searchParams.get('code'), code_verifier: pending.verifier})
    }, false);
    if (!data?.access_token || !data?.user?.id) throw new Error('Invalid authentication response');
    return saveSession(data);
  }
  function signInWithGoogle() {
    if (!enabled) return Promise.reject(new Error('Account sign-in is not configured'));
    const popup = window.open('/auth-callback.html?pending=1', 'scholarku-google', 'popup,width=520,height=680');
    if (!popup) return Promise.reject(new Error('Allow the sign-in popup to continue'));
    return new Promise((resolve, reject) => {
      const state = crypto.randomUUID();
      const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
      let ended = false;
      function cleanup(error) {
        if (ended) return;
        ended = true;
        clearInterval(poll); clearTimeout(timeout);
        window.removeEventListener('message', receive);
        localStorage.removeItem(oauthKey(state));
        // Leave failures visible instead of hiding the reason in a closed window.
        if (!error && !popup.closed) popup.close();
        if (error) reject(error); else resolve(reloadSession());
      }
      function receive(event) {
        if (event.origin !== location.origin || event.source !== popup) return;
        if (event.data?.type === 'scholarku:google-complete') {
          if (reloadSession()?.access_token) cleanup(); else cleanup(new Error('No authenticated session received'));
        } else if (event.data?.type === 'scholarku:google-error') cleanup(new Error(String(event.data.message || 'Google sign-in failed').slice(0, 300)));
      }
      window.addEventListener('message', receive);
      const poll = setInterval(() => { if (popup.closed) cleanup(new Error('Sign-in window closed')); }, 500);
      const timeout = setTimeout(() => cleanup(new Error('Sign-in request expired')), 5 * 60 * 1000);
      (async () => {
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
        if (ended) return;
        localStorage.setItem(oauthKey(state), JSON.stringify({verifier, created: Date.now()}));
        const redirect = new URL('/auth-callback.html', location.origin); redirect.searchParams.set('state', state);
        const url = new URL(root + '/auth/v1/authorize');
        url.search = new URLSearchParams({provider: 'google', redirect_to: redirect.href, code_challenge: base64url(new Uint8Array(digest)), code_challenge_method: 's256', prompt: 'select_account'}).toString();
        popup.location.href = url.href;
      })().catch(cleanup);
    });
  }
  async function signOut() {
    try { if (session) await request('/auth/v1/logout', { method: 'POST' }); } catch {}
    saveSession(null);
  }
  async function rest(table, { method = 'GET', select = '*', filters = '', body, single = false, order = '', onConflict = '' } = {}) {
    const q = new URLSearchParams();
    if (method === 'GET') q.set('select', select);
    if (order) q.set('order', order);
    if (onConflict) q.set('on_conflict', onConflict);
    const suffix = [q.toString(), filters.replace(/^&/, '')].filter(Boolean).join('&');
    const headers = {};
    if (method === 'POST' || method === 'PATCH') headers.Prefer = 'return=representation' + (onConflict ? ',resolution=merge-duplicates' : '');
    if (single) headers.Accept = 'application/vnd.pgrst.object+json';
    return request(`/rest/v1/${table}${suffix ? '?' + suffix : ''}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  }
  async function rpc(name, args = {}) { return request('/rest/v1/rpc/' + name, { method: 'POST', body: JSON.stringify(args) }); }
  async function uploadPrivate(bucket, path, file) {
    const safe = encodeURIComponent(path).replace(/%2F/g, '/');
    return request(`/storage/v1/object/${bucket}/${safe}`, { method: 'POST', body: file, headers: { 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'false' } });
  }
  async function signedUrl(bucket, path) {
    return request(`/storage/v1/object/sign/${bucket}/${path}`, { method: 'POST', body: JSON.stringify({ expiresIn: 60 }) });
  }
  function userId() { if (!session?.access_token) return null; try { return JSON.parse(atob(session.access_token.split('.')[1])).sub || null; } catch { return null; } }
  window.API = { enabled, rest, rpc, signIn, signUp, signInWithGoogle, completeGoogleSignIn, signOut, uploadPrivate, signedUrl, userId, get session() { return session; } };
})();
