/* Dedicated account screens. Passwords are sent only to the configured auth service. */
(() => {
  'use strict';
  const tr = (en, ms) => window.ScholarkuI18n.language === 'bm' ? ms : en;
  let busy = false;
  const googleIcon = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.36z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.13H3.07v2.59A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.41 13.91a6 6 0 0 1 0-3.82V7.5H3.07a10 10 0 0 0 0 9z"/><path fill="#EA4335" d="M12 5.96c1.47 0 2.79.51 3.83 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.5l3.34 2.59C7.2 7.72 9.4 5.96 12 5.96z"/></svg>';
  function render() {
    const signup = location.hash.split('?')[0] === '#/signup';
    return `<section class="account-page"><div class="account-shell">
      <aside class="account-story"><a href="#/" class="account-wordmark">scholar<span>ku.</span></a><div><span class="account-eyebrow">${tr('YOUR NEXT CHAPTER','BAB SETERUSNYA ANDA')}</span><h1>${tr('Big dreams.<br>A place to begin.','Impian besar.<br>Di sini bermulanya.')}</h1><p>${tr('Find the funding, experience and people that help you move forward.','Temui pembiayaan, pengalaman dan komuniti untuk membantu anda maju.')}</p><div class="account-journey"><span>01 <b>${tr('Discover scholarships','Terokai biasiswa')}</b></span><span>02 <b>${tr('Find your internship','Cari latihan industri anda')}</b></span><span>03 <b>${tr('Build your future','Bina masa hadapan anda')}</b></span></div></div><small>${tr('Built for students in Malaysia.','Dibangunkan untuk pelajar di Malaysia.')}</small></aside>
      <div class="account-form-panel"><a class="account-back" href="#/">← ${tr('Back to ScholarKu','Kembali ke ScholarKu')}</a><div class="account-form-inner"><p class="account-eyebrow">${tr('MAKE YOUR NEXT MOVE','MULAKAN LANGKAH SETERUSNYA')}</p><h2>${signup?tr('Create your account','Cipta akaun anda'):tr('Welcome back.','Selamat kembali.')}</h2><p class="account-subtitle">${signup?tr('One account. More opportunities.','Satu akaun. Lebih banyak peluang.'):tr('Log in to continue your journey.','Log masuk untuk meneruskan perjalanan anda.')}</p>
      <button type="button" class="account-google" data-account-google>${googleIcon}<span>${tr('Continue with Google','Teruskan dengan Google')}</span></button><div class="account-divider"><span>${tr('or use your email','atau gunakan e-mel anda')}</span></div>
      <form id="account-form" data-mode="${signup?'signup':'login'}"><div class="field"><label for="account-name">${tr('Full name','Nama penuh')}</label><input id="account-name" name="name" autocomplete="name" required maxlength="120" placeholder="${tr('Enter your full name','Masukkan nama penuh anda')}" /></div><div class="field"><label for="account-email">${tr('Email','E-mel')}</label><input id="account-email" name="email" type="email" autocomplete="email" required placeholder="${tr('Enter your email','Masukkan e-mel anda')}" /></div><div class="field"><label for="account-password">${tr('Password','Kata laluan')}</label><div class="account-password"><input id="account-password" name="password" type="password" autocomplete="${signup?'new-password':'current-password'}" ${signup?'minlength="8"':''} required placeholder="${signup?tr('At least 8 characters','Sekurang-kurangnya 8 aksara'):tr('Enter your password','Masukkan kata laluan anda')}" /><button type="button" data-account-password aria-label="${tr('Show password','Tunjukkan kata laluan')}">${tr('Show','Tunjuk')}</button></div></div>${signup?`<div class="field"><label for="account-role">${tr('I am a','Saya seorang')}</label><select id="account-role" name="role"><option value="student">${tr('Student','Pelajar')}</option><option value="employer">${tr('Employer','Majikan')}</option></select></div>`:''}<p id="account-message" role="status" aria-live="polite" hidden></p><button class="account-submit" type="submit">${signup?tr('Create account','Cipta akaun'):tr('Log in','Log masuk')} <span aria-hidden="true">→</span></button></form>
      <p class="account-switch">${signup?tr('Already have an account?','Sudah mempunyai akaun?'):tr('New to ScholarKu?','Baharu di ScholarKu?')} <a href="${signup?'#/login':'#/signup'}">${signup?tr('Log in','Log masuk'):tr('Create an account','Cipta akaun')}</a></p><p class="account-privacy">${tr('Your Google password is entered only on Google’s own sign-in page.','Kata laluan Google anda hanya dimasukkan di halaman log masuk Google.')} <a href="#/trust">${tr('Privacy & safety','Privasi & keselamatan')}</a></p></div></div></div></section>`;
  }
  function message(text, success = false) {
    const el = document.getElementById('account-message');
    if (el) { el.textContent = text; el.hidden = false; el.className = success ? 'account-message success' : 'account-message error'; el.scrollIntoView({block:'nearest'}); }
  }
  function setBusy(value) {
    busy = value;
    document.querySelectorAll('#account-form button[type="submit"], [data-account-google]').forEach(el => { el.disabled = value; el.setAttribute('aria-busy', String(value)); });
  }
  function unavailable() { message(tr('Account sign-in is not available yet. Please contact the site owner to activate it.','Log masuk akaun belum tersedia. Sila hubungi pemilik laman untuk mengaktifkannya.')); }
  async function finish() { document.dispatchEvent(new Event('scholarku:authenticated')); }
  document.addEventListener('submit', async e => {
    if (e.target.id !== 'account-form') return;
    e.preventDefault();
    if (busy) return;
    if (!window.API.enabled) return unavailable();
    const form = e.target, fields = new FormData(form);
    const name = String(fields.get('name') || '').trim(), email = String(fields.get('email') || '').trim(), password = String(fields.get('password') || '');
    if (!name) return message(tr('Please enter your full name.','Sila masukkan nama penuh anda.'));
    setBusy(true);
    try {
      if (form.dataset.mode === 'signup') {
        const result = await window.API.signUp(email, password, name, fields.get('role'));
        form.querySelector('[name="password"]').value = '';
        if (result?.access_token) { await window.API.signIn(email, password); await finish(); }
        else message(tr('Account created. Check your email to confirm your address, then log in.','Akaun dicipta. Semak e-mel untuk mengesahkan alamat anda, kemudian log masuk.'), true);
      } else { await window.API.signIn(email, password); form.querySelector('[name="password"]').value = ''; await finish(); }
    } catch (err) {
      const detail = String(err.message || '').toLowerCase();
      if (detail.includes('email not confirmed')) message(tr('Confirm your email address before logging in. Check your inbox.','Sahkan alamat e-mel sebelum log masuk. Semak peti masuk anda.'));
      else if (detail.includes('invalid login credentials')) message(tr('Your email or password is incorrect. Please try again.','E-mel atau kata laluan tidak betul. Sila cuba lagi.'));
      else message(form.dataset.mode === 'signup'
        ? tr('Unable to create your account. Check your details and try again.','Tidak dapat mencipta akaun anda. Semak maklumat anda dan cuba lagi.')
        : tr('Unable to sign in. Check your details and try again.','Tidak dapat log masuk. Semak maklumat anda dan cuba lagi.'));
    }
    finally { setBusy(false); }
  });
  document.addEventListener('click', async e => {
    const show = e.target.closest('[data-account-password]');
    if (show) { const input = document.getElementById('account-password'); const visible = input.type === 'password'; input.type = visible ? 'text' : 'password'; show.textContent = visible ? tr('Hide','Sembunyi') : tr('Show','Tunjuk'); show.setAttribute('aria-label', visible ? tr('Hide password','Sembunyikan kata laluan') : tr('Show password','Tunjukkan kata laluan')); }
    if (!e.target.closest('[data-account-google]') || busy) return;
    if (!window.API.enabled) return unavailable();
    setBusy(true);
    try { await window.API.signInWithGoogle(); await finish(); }
    catch { message(tr('Google sign-in did not finish. Allow the sign-in popup and try again.','Log masuk Google tidak selesai. Benarkan tetingkap log masuk dan cuba lagi.')); }
    finally { setBusy(false); }
  });
  window.ScholarkuAuth = {render};
})();
