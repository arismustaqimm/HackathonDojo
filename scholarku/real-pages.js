(() => {
  "use strict";
  const tr = (en, bm) => (window.ScholarkuI18n.language === "bm" ? bm : en);
  const internships = window.SCHOLARKU_CAREERS.internships;
  function home() {
    return `<section class="sk-home"><div class="sk-container"><div class="sk-hero"><div class="sk-kicker">${tr("ONE PLATFORM. MORE POSSIBILITIES.", "SATU PLATFORM. LEBIH PELUANG.")}</div><h1>${tr("Find Your", "Cari Peluang")}<br><em>${tr("Next Opportunity.", "Masa Depan.")}</em></h1><p>${tr("Scholarships first. The careers, communities and mentorship that follow — built for Malaysian students.", "Biasiswa, kerjaya, komuniti dan bimbingan — khas untuk pelajar Malaysia.")}</p><form id="sk-home-search" class="sk-home-search"><input name="q" placeholder="${tr("Search internships or scholarships...", "Cari latihan industri atau biasiswa...")}"/><button type="submit">${tr("Search", "Cari")} →</button></form><div class="sk-quicklinks"><a href="#/scholarships">CIMB</a><a href="#/scholarships">JPA</a><a href="#/scholarships">Maybank</a><a href="#/internships">BNM</a><a href="#/internships">Cisco</a><a href="#/internships">Deloitte</a></div><span class="sk-down">⌄</span></div><div class="sk-trio"><a href="#/community" class="sk-tile teal"><span>CONNECT</span><strong>${tr("Community", "Komuniti")}</strong><b>6</b><p>${tr("Find peers, mentors and like-minded student builders.", "Temui rakan dan mentor dalam bidang anda.")}</p><small>${tr("Join communities", "Sertai komuniti")} →</small></a><a href="#/scholarships" class="sk-tile orange"><span>FUND</span><strong>${tr("Scholarships", "Biasiswa")}</strong><b>${window.ScholarkuOpportunities.scholarshipCount}</b><p>${tr("Explore Malaysian funding providers and official application information.", "Terokai penyedia biasiswa dan maklumat rasmi.")}</p><small>${tr("Browse scholarships", "Lihat biasiswa")} →</small></a><a href="#/internships" class="sk-tile blue"><span>LAUNCH</span><strong>${tr("Internships", "Latihan Industri")}</strong><b>${internships.length}</b><p>${tr("Explore official career destinations for internships and graduate pathways.", "Terokai laman kerjaya rasmi dan program graduan.")}</p><small>${tr("Browse internships", "Lihat latihan industri")} →</small></a></div></div></section><section class="sk-bottom"><div class="sk-container"><h2>${tr("Discover. Prepare. Connect. Grow.", "Teroka. Bersedia. Berhubung. Maju.")}</h2><p>${tr("Real provider links. No invented application windows or vacancy counts.", "Pautan penyedia sebenar. Tiada tarikh atau jumlah kekosongan rekaan.")}</p><div class="sk-bottom-links"><a href="#/mentors">${tr("Mentorship", "Mentor")} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></a><a href="#/community">${tr("Student Connect", "Komuniti Pelajar")} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></a></div></div></section>`;
  }

  function applyTheme() {
    const dark = localStorage.getItem("sk-theme") !== "light";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    const button = document.getElementById("sk-theme-toggle");
    if (button) {
      button.textContent = dark ? "☀" : "☾";
      button.setAttribute(
        "aria-label",
        dark
          ? tr("Switch to light mode", "Tukar kepada mod cerah")
          : tr("Switch to dark mode", "Tukar kepada mod gelap"),
      );
      button.setAttribute("aria-pressed", String(dark));
    }
    document.querySelector('meta[name="theme-color"]').content = dark
      ? "#0d1b2d"
      : "#ffffff";
  }

  window.ScholarkuHome = { render: home };
  function update() {
    const main = document.getElementById("main-content");
    if (!main) return;
    const path = location.hash.split("?")[0] || "#/";
    document.body.classList.toggle(
      "sk-theme",
      [
        "#/",
        "#/explore",
        "#/internships",
        "#/graduates",
        "#/scholarships",
      ].includes(path) ||
        path.startsWith("#/funding/") ||
        path.startsWith("#/careers/"),
    );
    if (path === "#/") main.innerHTML = home();
    applyTheme();
    window.ScholarkuI18n.translate(document.getElementById("app"));
    window.ScholarkuI18n.translate(document.getElementById("toast"));
  }
  document.addEventListener("scholarku:render", update);
  document.addEventListener("click", (e) => {
    if (e.target.closest("#sk-theme-toggle")) {
      localStorage.setItem(
        "sk-theme",
        document.documentElement.dataset.theme === "dark" ? "light" : "dark",
      );
      applyTheme();
    }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id === "sk-home-search") {
      e.preventDefault();
      const value = new FormData(e.target).get("q") || "";
      location.hash = "#/internships";
      setTimeout(() => {
        const input = document.getElementById("sk-query");
        if (input) {
          input.value = value;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }, 0);
    }
  });
  update();
})();
