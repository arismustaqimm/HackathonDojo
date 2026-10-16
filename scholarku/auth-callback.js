(() => {
  'use strict';
  const url = new URL(location.href);
  if (url.searchParams.get('pending') === '1') return;
  const malay = localStorage.getItem('sk-language') === 'bm';
  document.documentElement.lang = malay ? 'ms' : 'en';
  const status = document.getElementById('oauth-status');
  status.textContent = malay ? 'Melengkapkan log masuk selamat anda…' : 'Completing your secure sign-in…';
  window.API.completeGoogleSignIn(url).then(() => {
    history.replaceState(null, '', location.pathname);
    status.textContent = malay ? 'Berjaya log masuk. Anda boleh menutup tetingkap ini.' : 'You are signed in. You can close this window.';
    if (window.opener && !window.opener.closed) { window.opener.postMessage({type: 'scholarku:google-complete'}, location.origin); window.close(); }
    else location.replace('/#/dashboard');
  }).catch(error => {
    history.replaceState(null, '', location.pathname);
    const detail = String(error.message || 'Google sign-in failed').slice(0, 300);
    status.textContent = (malay ? 'Log masuk tidak dapat diselesaikan: ' : 'Sign-in could not be completed: ') + detail;
    document.getElementById('oauth-return').hidden = false;
    if (window.opener && !window.opener.closed) window.opener.postMessage({type: 'scholarku:google-error', message: detail}, location.origin);
  });
})();
