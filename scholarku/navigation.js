/* Compact disclosure menus: no hover-only controls, works with keyboard and touch. */
(() => {
  'use strict';
  const tr = (en, ms) => window.ScholarkuI18n.language === 'bm' ? ms : en;
  const arrow = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>';
  const items = [
    ['/explore','PLAN','RANCANG','Explore opportunities','Terokai peluang','Find your next direction','Cari hala tuju seterusnya','teal'],
    ['/scholarships','FUND','BIAYA','Scholarships','Biasiswa','Find funding for your future','Cari pembiayaan masa hadapan','orange'],
    ['/internships','LAUNCH','MULA','Internships','Latihan industri','Build experience that matters','Bina pengalaman bermakna','blue'],
    ['/graduates','GROW','MAJU','Graduate programmes','Program graduan','Take your first career step','Mulakan langkah kerjaya anda','purple'],
    ['/community','CONNECT','HUBUNG','Community','Komuniti','Meet your student community','Temui komuniti pelajar anda','teal'],
    ['/mentors','LEARN','BELAJAR','Mentorship','Bimbingan mentor','Learn from experience','Belajar daripada pengalaman','blue'],
    ['/employers','HIRE','REKRUT','For employers','Untuk majikan','Find your next great intern','Temui pelatih berbakat anda','orange']
  ];
  function render(path, loggedIn) {
    return `<header class="site-header compact-header"><div class="container header-inner">
      <button id="sk-theme-toggle" class="sk-toggle" type="button"></button>
      <a class="logo" href="#/" aria-label="${tr('Scholarku home','Laman utama Scholarku')}">scholar<span class="dot">ku.</span></a>
      <div class="nav-disclosure"><button id="explore-toggle" class="disclosure-trigger" type="button" aria-expanded="false" aria-controls="explore-menu"><span class="nav-dots" aria-hidden="true"><i></i><i></i><i></i></span>${tr('Explore','Teroka')}${arrow}</button>
      <nav id="explore-menu" class="explore-menu" aria-label="${tr('Explore ScholarKu','Terokai ScholarKu')}" hidden>${items.map(([url,enK,msK,en,ms,enD,msD,color])=>`<a class="explore-option ${color}" href="#${url}" ${path===url?'aria-current="page"':''}><span class="explore-dot" aria-hidden="true"></span><span class="explore-option-copy"><span class="explore-option-title"><b>${tr(enK,msK)}</b><strong>${tr(en,ms)}</strong>${path===url?`<small>${tr('HERE','DI SINI')}</small>`:''}</span><span class="explore-option-description">${tr(enD,msD)}</span></span></a>`).join('')}</nav></div>
      <div class="header-actions"><div class="language-disclosure"><button id="sk-lang" class="disclosure-trigger language-trigger" type="button" aria-expanded="false" aria-controls="language-menu" aria-label="${tr('Choose language','Pilih bahasa')}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/></svg><span>${window.ScholarkuI18n.language==='bm'?'BM':'EN'}</span>${arrow}</button><div id="language-menu" class="language-menu" hidden><button type="button" data-language="en" aria-pressed="${window.ScholarkuI18n.language==='en'}">English <span>${window.ScholarkuI18n.language==='en'?'✓':''}</span></button><button type="button" data-language="bm" aria-pressed="${window.ScholarkuI18n.language==='bm'}">Bahasa Melayu <span>${window.ScholarkuI18n.language==='bm'?'✓':''}</span></button></div></div>
      ${loggedIn?`<a class="account-header-button" href="#/dashboard" aria-label="${tr('My dashboard','Papan pemuka saya')}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg><span>${tr('Account','Akaun')}</span></a><button class="header-signout" data-act="logout" type="button" aria-label="${tr('Log out','Log keluar')}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 4H4v16h5m6-12 4 4-4 4m-7-4h11"/></svg></button>`:`<a href="#/login" class="account-header-button"><span>${tr('Log in','Log masuk')}</span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>`}</div></div></header>`;
  }
  function closeMenus() {
    for (const id of ['explore-toggle','sk-lang']) { const button = document.getElementById(id); if (!button) continue; button.setAttribute('aria-expanded','false'); document.getElementById(button.getAttribute('aria-controls')).hidden = true; }
  }
  document.addEventListener('click', e => {
    const trigger = e.target.closest('#explore-toggle,#sk-lang');
    if (trigger) { const open = trigger.getAttribute('aria-expanded') !== 'true'; closeMenus(); trigger.setAttribute('aria-expanded', String(open)); document.getElementById(trigger.getAttribute('aria-controls')).hidden = !open; return; }
    const language = e.target.closest('[data-language]');
    if (language) {
      const form = document.getElementById('account-form');
      const fields = form ? [...form.elements].filter(el => el.name).map(el => [el.name, el.value]) : [];
      if (language.dataset.language !== window.ScholarkuI18n.language) window.ScholarkuI18n.toggle();
      window.scholarkuRender();
      // Keep unfinished account details in the form, never in browser storage.
      for (const [name, value] of fields) { const input = document.getElementById('account-form')?.elements.namedItem(name); if (input) input.value = value; }
      document.getElementById('sk-lang')?.focus(); return;
    }
    if (!e.target.closest('.nav-disclosure,.language-disclosure')) closeMenus();
    if (e.target.closest('#explore-menu a')) closeMenus();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { const active = document.querySelector('.compact-header [aria-expanded="true"]'); closeMenus(); active?.focus(); }
    if (e.key === 'ArrowDown' && e.target.matches('#explore-toggle,#sk-lang')) { e.preventDefault(); const button=e.target; closeMenus(); button.setAttribute('aria-expanded','true'); const menu=document.getElementById(button.getAttribute('aria-controls')); menu.hidden=false; menu.querySelector('a,button')?.focus(); }
  });
  document.addEventListener('focusin', e => { if (!e.target.closest('.nav-disclosure,.language-disclosure')) closeMenus(); });
  window.ScholarkuNavigation = {render};
})();
