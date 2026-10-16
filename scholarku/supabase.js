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
  window.API = { enabled, rest, rpc, signIn, signUp, signOut, uploadPrivate, signedUrl, userId, get session() { return session; } };
})();
