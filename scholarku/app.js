/* SCHOLARKU — student opportunity directories and Supabase-backed student workflows.
   Community and mentoring features are implemented in their dedicated modules. */
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const icons = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    chev: '<path d="m9 18 6-6-6-6"/>',
    spark:
      '<path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z"/>',
    cap: '<path d="m2 10 10-5 10 5-10 5-10-5Zm4 2.5V18c4 2.7 8 2.7 12 0v-5.5M22 10v7"/>',
    brief:
      '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
    trophy:
      '<path d="M8 21h8m-4-4v4M7 3h10v8a5 5 0 0 1-10 0V3ZM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4"/>',
    users:
      '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2H3Zm14-14a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5"/>',
    code: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-14-3 20"/>',
    mentor:
      '<rect x="2" y="4" width="20" height="15" rx="2"/><path d="M8 22h8m-4-3v3m-5-11 3 3 6-6"/>',
    bookmark: '<path d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18l-7-5-7 5V4Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    shield:
      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    close: '<path d="M5 5 19 19M19 5 5 19"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
    message:
      '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 10 10 0 0 1-4-.9L3 21l1.9-5.5A9 9 0 0 1 3 11.5 9 9 0 0 1 12 3a9 9 0 0 1 9 8.5Z"/>',
    book: '<path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16H5a2 2 0 0 1-2-2V5Zm0 13a3 3 0 0 1 3-3h15"/>',
    bolt: '<path d="m13 2-10 12h8l-1 8 11-12h-8l0-8Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2H4Z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 10h18c0-2-3-3-3-10Zm-8 13h4"/>',
    clipboard:
      '<rect x="5" y="5" width="14" height="17" rx="2"/><rect x="9" y="2" width="6" height="5" rx="1"/><path d="M8 12h8m-8 4h8"/>',
    filter: '<path d="M4 5h16L14 12v6l-4 2v-8L4 5Z"/>',
    send: '<path d="m22 2-7 20-4-9-9-4 20-7ZM11 13l11-11"/>',
    star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/>',
    external: '<path d="M14 4h6v6m0-6-9 9M20 14v6H4V4h6"/>',
    file: '<path d="M6 2h9l5 5v15H6V2Zm9 0v5h5M9 12h8m-8 4h8"/>',
    building:
      '<rect x="4" y="3" width="16" height="19" rx="1"/><path d="M9 22v-5h6v5M8 7h2m4 0h2M8 12h2m4 0h2"/>',
    logout: '<path d="M10 4H4v16h6m5-12 4 4-4 4m-11-4h15"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    play: '<path d="m8 5 11 7-11 7V5Z"/>',
    refresh:
      '<path d="M20 7v5h-5M4 17v-5h5m10-2a7 7 0 0 0-12-4L4 12m16 0-3 6a7 7 0 0 1-12-4"/>',
    gift: '<rect x="3" y="9" width="18" height="13" rx="2"/><path d="M12 9v13M3 13h18M12 9C2 9 5 1 9 4c2 1 3 5 3 5Zm0 0c10 0 7-8 3-5-2 1-3 5-3 5Z"/>',
    video:
      '<rect x="2" y="5" width="14" height="14" rx="2"/><path d="m16 9 6-4v14l-6-4"/>',
    lock: '<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>',
  };
  const ic = (name, size = 18) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.spark}</svg>`;
  const h = (x) =>
    String(x ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const attr = h;
  const initials = (n) =>
    (n || "SK")
      .split(" ")
      .slice(0, 2)
      .map((x) => x[0])
      .join("")
      .toUpperCase();
  const defaults = {
    saved: [],
    applications: [],
    messages: {},
    posts: [],
    meetings: [],
    profile: {
      name: "",
      institution: "",
      field: "",
      state: "",
      skills: "",
    },
    org: {
      name: "Demo Campus Innovations",
      industry: "Technology",
      location: "Selangor",
      website: "",
      registration: "",
    },
    verification: "Not submitted",
    roles: "guest",
    isDemo: true,
    opportunityAdds: [],
  };
  let store;
  try {
    store = {
      ...defaults,
      ...JSON.parse(localStorage.getItem("scholarku.demo") || "{}"),
    };
  } catch {
    store = { ...defaults };
  }
  const persist = () =>
    localStorage.setItem("scholarku.demo", JSON.stringify(store));
  let state = {
    route: parseRoute(),
    search: "",
    type: "All",
    field: "All Fields",
    location: "All Locations",
    mode: "Any Mode",
    industry: "All Industries",
    companyType: "All Types",
    contract: "Any Contract",
    level: "All Levels",
    channel: "general",
    role: "student",
    modal: "",
    authMode: "signup",
    mobile: false,
    liveProfile: null,
    liveOpps: [],
    liveApplications: [],
    liveSaved: [],
    liveOrgs: [],
    liveVerification: [],
    loading: false,
  };
  function parseRoute() {
    return decodeURI((location.hash || "#/").slice(1)).split("?")[0] || "/";
  }
  const route = (p) => {
    location.hash = "#" + p;
    state.route = p;
    state.mobile = false;
    window.scrollTo(0, 0);
    render();
  };
  const allOp = () => (API.enabled ? state.liveOpps.map(normalise) : []);
  function normalise(o) {
    const org = state.liveOrgs.find((x) => x.id === o.organization_id);
    return {
      id: o.id,
      type: o.kind || "Internship",
      title: o.title,
      org: org?.name || "Organization",
      brand: initials(org?.name),
      color: "#edeaff",
      ink: "#6246ea",
      industry: org?.industry || "Technology",
      location: o.location_state || "Malaysia",
      mode: o.work_mode || "On-site",
      field: o.field || "All Fields",
      level: o.education_level || "Undergraduate",
      allowance: o.allowance || "Not specified",
      category: org?.category || "Company",
      contract: o.contract_type || "Not specified",
      duration: o.duration || "Not specified",
      status: o.is_demo ? "Demo" : o.status || "Published",
      details: o.description || "",
      skills: o.skills || [],
      verified: org?.verification_status === "approved" && !o.is_demo,
      organization_id: o.organization_id,
      external_url: o.external_url || "",
    };
  }
  function currentRole() {
    return API.enabled ? state.liveProfile?.role || "guest" : store.roles;
  }
  function isLoggedIn() {
    return API.enabled ? Boolean(API.session) : store.roles !== "guest";
  }
  function isSaved(id) {
    return API.enabled && !String(id).startsWith("o")
      ? state.liveSaved.some((s) => s.opportunity_id === id)
      : store.saved.includes(id);
  }
  const toast = (txt) => {
    const el = $("#toast");
    el.textContent = txt;
    el.hidden = false;
    clearTimeout(window.__toast);
    window.__toast = setTimeout(() => (el.hidden = true), 3800);
  };
  function btn(action, label, kind = "primary", extra = "") {
    return `<button class="btn btn-${kind}" data-act="${action}" ${extra}>${label}</button>`;
  }
  function header() {
    return window.ScholarkuNavigation.render(state.route, isLoggedIn());
  }
  function footer() {
    const { tr } = window.SK;
    return `<footer class="site-footer"><div class="container"><div class="footer-main"><div><a class="logo" href="#/">scholar<span class="dot">ku.</span></a><p>${tr("Scholarships, career pathways, mentoring and communities for students in Malaysia.", "Biasiswa, laluan kerjaya, bimbingan dan komuniti untuk pelajar di Malaysia.")}</p></div><div class="footer-col"><h4>${tr("Discover", "Teroka")}</h4><a href="#/scholarships">${tr("Scholarships & aid", "Biasiswa & bantuan")}</a><a href="#/internships">${tr("Internships", "Latihan industri")}</a><a href="#/graduates">${tr("Graduate programmes", "Program graduan")}</a></div><div class="footer-col"><h4>${tr("Connect", "Berhubung")}</h4><a href="#/community">${tr("Communities", "Komuniti")}</a><a href="#/mentors">${tr("Mentorship", "Bimbingan mentor")}</a><a href="#/mentors/requests">${tr("My mentoring requests", "Permohonan bimbingan saya")}</a></div><div class="footer-col"><h4>${tr("Your account", "Akaun anda")}</h4><a href="#/dashboard">${tr("My dashboard", "Papan pemuka saya")}</a><a href="#/trust">${tr("Privacy & sources", "Privasi & sumber")}</a></div></div><div class="footer-bottom"><span>${tr("© 2026 ScholarKu. Confirm programme terms with the official provider.", "© 2026 ScholarKu. Sahkan syarat program dengan penyedia rasmi.")}</span><span>${tr("Built for Malaysian students 🇲🇾", "Dibangunkan untuk pelajar Malaysia 🇲🇾")}</span></div></div></footer>`;
  }
  function home() {
    return window.ScholarkuHome.render();
  }
  function pageHero(kicker, title, desc) {
    return `<section class="page-hero"><div class="container"><div class="eyebrow">${kicker}</div><div class="page-heading"><h1>${title}</h1><p>${desc}</p></div></div></section>`;
  }
  const unique = (key) =>
    [
      ...new Set(
        allOp()
          .map((o) => o[key])
          .filter(Boolean),
      ),
    ].sort();
  function explorePage(preset) {
    let list = allOp();
    if (preset)
      list = list.filter(
        (o) =>
          o.type === preset ||
          (preset === "Internship" && o.type === "Graduate Programme"),
      );
    if (state.type !== "All" && !preset)
      list = list.filter((o) => o.type === state.type);
    if (state.search.trim()) {
      const q = state.search.toLowerCase();
      list = list.filter(
        (o) =>
          Object.values(o).some(
            (v) => typeof v === "string" && v.toLowerCase().includes(q),
          ) || (o.skills || []).join(" ").toLowerCase().includes(q),
      );
    }
    if (state.field !== "All Fields")
      list = list.filter(
        (o) => o.field === state.field || o.field === "All Fields",
      );
    if (state.location !== "All Locations")
      list = list.filter(
        (o) =>
          o.location === state.location ||
          o.location === "Malaysia-wide" ||
          o.mode === "Remote",
      );
    if (state.mode !== "Any Mode")
      list = list.filter((o) => o.mode === state.mode);
    if (state.industry !== "All Industries")
      list = list.filter((o) => o.industry === state.industry);
    if (state.companyType !== "All Types")
      list = list.filter((o) => o.category === state.companyType);
    if (state.level !== "All Levels")
      list = list.filter(
        (o) => o.level === state.level || o.level === "All Levels",
      );
    if (state.contract !== "Any Contract")
      list = list.filter((o) => o.contract === state.contract);
    const title =
      preset === "Internship"
        ? "Internships & graduate programmes"
        : preset === "Scholarship"
          ? "Find your scholarship"
          : "Explore opportunities";
    return (
      pageHero(
        "THE NEXT STEP STARTS HERE",
        title,
        "Scholarships, internships, graduate programmes, workshops and competitions — in one convenient place.",
      ) +
      `<div class="container page-content">${!preset ? `<div class="page-subnav">${["All", "Internship", "Graduate Programme", "Scholarship", "Competition", "Workshop"].map((x) => `<button class="tab ${state.type === x ? "active" : ""}" data-type="${x}">${x}</button>`).join("")}</div>` : ""}<div class="filter-bar">${ic("search", 19)}<input id="filter-search" aria-label="Search listings" placeholder="Search title, provider, skills..." value="${attr(state.search)}" /><select id="filter-field" aria-label="Field of study"><option>All Fields</option>${unique(
        "field",
      )
        .filter((x) => x !== "All Fields")
        .map(
          (x) =>
            `<option ${state.field === x ? "selected" : ""}>${h(x)}</option>`,
        )
        .join(
          "",
        )}</select><select id="filter-location" aria-label="Location"><option>All Locations</option>${unique(
        "location",
      )
        .map(
          (x) =>
            `<option ${state.location === x ? "selected" : ""}>${h(x)}</option>`,
        )
        .join(
          "",
        )}</select><select id="filter-mode" aria-label="Work arrangement"><option>Any Mode</option>${unique(
        "mode",
      )
        .map(
          (x) =>
            `<option ${state.mode === x ? "selected" : ""}>${h(x)}</option>`,
        )
        .join("")}</select>${
        preset === "Internship"
          ? `<select id="filter-company" aria-label="Organization category"><option>All Types</option>${["MNC", "SME", "GLC", "Startup", "Firm"].map((x) => `<option ${state.companyType === x ? "selected" : ""}>${x}</option>`).join("")}</select><select id="filter-contract" aria-label="Graduate programme contract"><option>Any Contract</option><option>With contract</option><option>No contract</option></select><select id="filter-level" aria-label="Education level"><option>All Levels</option>${unique(
              "level",
            )
              .filter((x) => x !== "All Levels")
              .map(
                (x) =>
                  `<option ${state.level === x ? "selected" : ""}>${h(x)}</option>`,
              )
              .join("")}</select>`
          : ""
      }<button class="btn btn-outline btn-sm" data-act="reset-filters">${ic("refresh", 15)} Reset</button></div><div class="inline-row justify-between mb-20"><p class="muted">Showing <strong>${list.length}</strong> opportunities</p><span class="demo-tag">Sample listings clearly labelled</span></div>${list.length ? `<div class="grid-3">${list.map(opportunityCard).join("")}</div>` : empty("No matching opportunities", "Try a different keyword, location or field.", "reset-filters", "Clear filters")}</div>`
    );
  }
  function empty(title, desc, action, label) {
    return `<div class="empty">${ic("search", 27)}<h3>${title}</h3><p>${desc}</p>${action ? btn(action, label, "outline") : ""}</div>`;
  }
  function detailPage(id) {
    const o = allOp().find((x) => String(x.id) === id);
    if (!o)
      return (
        pageHero(
          "OPPORTUNITY",
          "Listing not found",
          "This opportunity may have been removed.",
        ) +
        `<div class="container page-content"><a class="text-link" href="#/explore">← Back to explore</a></div>`
      );
    return (
      pageHero(
        o.type.toUpperCase(),
        "Opportunity details",
        "Review the provider, eligibility and important information before applying.",
      ) +
      `<div class="container page-content"><div class="detail-layout"><article class="panel"><div class="inline-row mb-20"><span class="brand-avatar" style="background:${attr(o.color)};color:${attr(o.ink)}">${h(o.brand)}</span><div><div class="badge">${h(o.type)}</div><div class="company-line" style="margin:8px 0 0">${h(o.org)} ${o.verified ? `<span class="verified">${ic("shield", 13)} Verified by Scholarku review</span>` : ""}</div></div></div><h2 style="font-size:28px;margin-bottom:7px">${h(o.title)}</h2><div class="detail-meta"><span>${ic("pin", 15)} ${h(o.location)}</span><span>${ic("brief", 15)} ${h(o.mode)}</span><span>${ic("cap", 15)} ${h(o.field)}</span></div>${o.status === "Demo" ? `<div class="alert mb-20"><strong>Demonstration listing:</strong> This opportunity and organization are fictional. It is not an active vacancy, scholarship or event, and no application will be sent to an employer.</div>` : ""}<hr class="divider-line"><h3>About this opportunity</h3><p>${h(o.details)}</p><h3>Relevant skills & areas</h3><div class="chiplist">${(o.skills || []).map((x) => `<span class="chip">${h(x)}</span>`).join("")}</div><h3>Eligibility & requirements</h3><p>Field: ${h(o.field)}<br>Education: ${h(o.level || "Refer to official provider")}<br>Always verify exact requirements through the organizer's official channels.</p><div class="detail-actions">${btn("apply:" + o.id, o.type === "Internship" ? "Apply for internship" : "Express interest")}<button class="btn btn-outline" data-save="${attr(o.id)}">${ic("bookmark", 16)} ${isSaved(o.id) ? "Saved" : "Save for later"}</button>${o.status !== "Demo" ? btn("report:" + o.id, "Report listing", "outline") : ""}</div></article><aside><div class="panel"><h2>Opportunity snapshot</h2><div class="facts"><div class="fact">${ic("building", 20)}<div><small>Organization</small><strong>${h(o.org)}</strong></div></div><div class="fact">${ic("pin", 20)}<div><small>Location</small><strong>${h(o.location)}</strong></div></div><div class="fact">${ic("brief", 20)}<div><small>Arrangement</small><strong>${h(o.mode)}</strong></div></div><div class="fact">${ic("calendar", 20)}<div><small>Duration</small><strong>${h(o.duration || "Not specified")}</strong></div></div>${o.type === "Graduate Programme" ? `<div class="fact">${ic("file", 20)}<div><small>Contract status</small><strong>${h(o.contract || "Not specified")}</strong></div></div>` : ""}<div class="fact">${ic("gift", 20)}<div><small>Allowance</small><strong>${h(o.allowance || "Not specified")}</strong></div></div><div class="fact">${ic("shield", 20)}<div><small>Verification status</small><strong>${o.verified ? "Reviewed & approved" : "Not independently verified"}</strong></div></div></div></div><div class="alert info mt-18">Never pay an application fee to an unknown recruiter or share sensitive personal details outside a trusted hiring process.</div></aside></div></div>`
    );
  }
  function communityPage() {
    return window.ScholarkuCommunity.render("/community");
  }
  function serverPage(id) {
    return window.ScholarkuCommunity.render("/community/" + id);
  }
  function mentorPage() {
    return window.ScholarkuMentorship.render(state.route);
  }
  function trustPage() {
    const { tr, title } = window.SK;
    return (
      title(
        tr("PRIVACY & SOURCES", "PRIVASI & SUMBER"),
        tr(
          "Know what you share. Know your sources.",
          "Fahami perkongsian anda. Kenali sumber anda.",
        ),
        tr(
          "Clear information about mentoring, communities and opportunity data.",
          "Maklumat jelas tentang bimbingan, komuniti dan data peluang.",
        ),
      ) +
      `<div class="container page-content"><article class="panel opportunity-prose"><h2>${tr("Your CV stays private", "CV anda kekal peribadi")}</h2><p>${tr("CVs are uploaded to private storage. Only you and the selected participating mentor can access a mentoring CV. Requests to public references wait until the mentor enrols; no CV is sent to a public profile. Document links expire after one minute.", "CV dimuat naik ke storan peribadi. Hanya anda dan mentor berdaftar yang dipilih boleh mengakses CV bimbingan. Permohonan kepada rujukan awam menunggu pendaftaran mentor; tiada CV dihantar ke profil awam. Pautan dokumen luput selepas satu minit.")}</p><h2>${tr("Real conversations", "Perbualan sebenar")}</h2><p>${tr("Community rooms require sign-in and confirmed membership. Messages show the author’s account profile name and are visible to enrolled members. New rooms start empty. You can delete your messages and report abuse; leaving a room does not delete earlier messages.", "Ruang komuniti memerlukan log masuk dan pengesahan keahlian. Mesej memaparkan nama profil akaun penulis dan boleh dilihat ahli berdaftar. Ruang baharu bermula kosong. Anda boleh memadam mesej sendiri dan melaporkan penderaan; keluar komuniti tidak memadam mesej terdahulu.")}</p><h2>${tr("Public profiles and enrolment", "Profil awam dan pendaftaran")}</h2><p>${tr("A public professional profile is a discovery reference, not a claim of partnership or availability. Participating mentors must agree to join and have their account linked after an identity check. Public job descriptions are not employment endorsements.", "Profil profesional awam ialah rujukan penemuan, bukan dakwaan kerjasama atau ketersediaan. Mentor yang menyertai perlu bersetuju dan akaun mereka dipautkan selepas semakan identiti. Penerangan pekerjaan awam bukan pengesahan pekerjaan.")}</p><h2>${tr("Career and funding sources", "Sumber kerjaya dan pembiayaan")}</h2><p>${tr("Provider portals do not establish current vacancies or scholarship intakes. General preparation guidance is separate from confirmed role requirements. User-supplied amounts and deadlines are labelled for official confirmation. Never pay an unknown recruiter or rely on an old intake deadline.", "Portal penyedia tidak membuktikan kekosongan atau pengambilan biasiswa semasa. Panduan persediaan umum berbeza daripada syarat jawatan yang disahkan. Amaun dan tarikh yang diberi pengguna ditanda untuk pengesahan rasmi. Jangan bayar perekrut tidak dikenali atau bergantung pada tarikh pengambilan lama.")}</p></article></div>`
    );
  }
  function dashboardPage() {
    const r = currentRole();
    if (r === "guest")
      return (
        pageHero(
          "YOUR SPACE",
          "Your student dashboard",
          "Save opportunities and monitor your applications.",
        ) +
        `<div class="container page-content">${empty("Create your student space", "Log in to see your personalized dashboard.", "signup", "Join Scholarku")}</div>`
      );
    const tab = state.dashTab || "overview";
    const apps = API.enabled ? state.liveApplications : store.applications;
    const saved = Array(window.ScholarkuOpportunities.savedCount());
    const title =
      state.liveProfile?.full_name || store.profile.name || "Student";
    return (
      pageHero(
        "STUDENT SPACE",
        `Hi, ${h(title.split(" ")[0])} 👋`,
        "Your progress, opportunities, and next steps — all together.",
      ) +
      `<div class="container page-content"><div class="dashboard-layout"><aside class="dash-sidebar">${[
        ["overview", "book", "Overview"],
        ["applications", "clipboard", "My applications"],
        ["saved", "bookmark", "Saved opportunities"],
        ["profile", "user", "My profile"],
      ]
        .map(
          ([t, i, l]) =>
            `<button class="dash-link ${tab === t ? "active" : ""}" data-dash="${t}">${ic(i, 17)} ${l}</button>`,
        )
        .join(
          "",
        )}<a class="dash-link" href="#/mentors/requests">${ic("calendar", 17)} Mentor requests</a><hr class="divider-line"><button class="dash-link" data-act="logout">${ic("logout", 17)} Switch / log out</button></aside><div>${
        tab === "overview"
          ? `<div class="stat-grid"><div class="stat-card"><div><strong>${saved.length}</strong><small>Saved opportunities</small></div>${ic("bookmark", 21)}</div><div class="stat-card"><div><strong>${apps.length}</strong><small>Applications sent</small></div>${ic("clipboard", 21)}</div><div class="stat-card"><div><strong id="mentor-request-count">—</strong><small><a href="#/mentors/requests">Mentor requests</a></small></div>${ic("calendar", 21)}</div></div><div class="panel"><div class="inline-row justify-between mb-20"><h2 style="margin:0">Your next step</h2><span class="badge teal">Keep growing</span></div><p>Explore new opportunities, connect with students, and prepare for your next application.</p><div class="inline-row">${btn("internships", "Explore internships")}${btn("community", "Community", "outline")}</div></div><div class="panel mt-18"><h2>Recent applications</h2>${applicationTable(apps.slice(0, 5))}</div>`
          : tab === "applications"
            ? `<div class="panel"><h2>My applications</h2>${applicationTable(apps)}</div>`
            : tab === "saved"
              ? `<div><div class="section-heading"><div><h2>Saved opportunities</h2><p>${window.SK.tr("Your saved career and funding pages.", "Laman kerjaya dan pembiayaan anda yang disimpan.")}</p></div></div>${
                  saved.length
                    ? window.ScholarkuOpportunities.savedPage()
                    : empty(
                        "Nothing saved yet",
                        "Bookmark opportunities while browsing.",
                        "explore",
                        "Discover opportunities",
                      )
                }</div>`
              : profileForm()
      }</div></div></div>`
    );
  }
  function applicationTable(apps) {
    if (!apps.length)
      return `<div class="empty" style="padding:30px"><h3>No applications yet</h3><p>Submitted internship applications will appear here.</p><a class="text-link" href="#/internships">Explore internships ${ic("arrow", 14)}</a></div>`;
    return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Opportunity</th><th>Status</th><th>Action</th></tr></thead><tbody>${apps
      .map((a) => {
        const o = allOp().find((x) => x.id === (a.opportunity_id || a.id));
        return `<tr><td><strong>${h(o?.title || "Internship")}</strong><br><span class="small-note">${h(o?.org || "Employer")}</span></td><td><span class="badge ${a.status === "Withdrawn" ? "gray" : "teal"}">${h(a.status || "Submitted")}</span></td><td>${a.status !== "Withdrawn" ? `<button class="btn btn-outline btn-sm" data-withdraw="${attr(a.id)}">Withdraw</button>` : "—"}</td></tr>`;
      })
      .join("")}</tbody></table></div>`;
  }
  function profileForm() {
    const p = API.enabled
      ? {
          name: state.liveProfile?.full_name || "",
          institution: state.liveProfile?.institution || "",
          field: state.liveProfile?.field || "",
          state: state.liveProfile?.location_state || "",
          skills: (state.liveProfile?.skills || []).join(", "),
        }
      : store.profile;
    return `<div class="panel"><h2>Student profile</h2><p>A stronger profile helps you keep track of your goals and preferred fields.</p><form id="profile-form" class="form-grid"><div class="field"><label>Full name</label><input name="name" required value="${attr(p.name)}" /></div><div class="field"><label>Institution</label><input name="institution" required value="${attr(p.institution)}" /></div><div class="field"><label>Field of study</label><input name="field" required value="${attr(p.field)}" /></div><div class="field"><label>Preferred location</label><input name="state" value="${attr(p.state)}" /></div><div class="field wide"><label>Skills (comma separated)</label><input name="skills" value="${attr(p.skills)}" /></div><div class="wide"><button class="btn btn-primary" type="submit">Save profile</button></div></form></div>`;
  }

  function modalContent() {
    if (state.modal === "post")
      return popup(
        "Share your milestone",
        "Let other students know what you learned or achieved.",
        `<form id="post-form"><div class="field"><label>Post title</label><input name="title" maxlength="90" required placeholder="I finished my first hackathon!" /></div><div class="field"><label>Tell your story</label><textarea name="content" maxlength="1000" required placeholder="What did you learn? How can others get involved?"></textarea></div><button class="btn btn-primary" type="submit">Publish sample post ${ic("send", 15)}</button></form>`,
      );
    if (state.modal.startsWith("apply:")) {
      const o = allOp().find((x) => x.id === state.modal.split(":")[1]);
      return popup(
        "Apply to " + h(o?.title || "internship"),
        o?.status === "Demo"
          ? "This is a sample listing. You can save it but cannot send an application to a fictional employer."
          : "Submit your application. Your résumé will be stored privately for the employer to review.",
        o?.status === "Demo"
          ? `<div class="alert">Fictional demo vacancies are not accepting real applications. This protects you from submitting personal documents to a non-existent company.</div><div class="inline-row mt-18"><button class="btn btn-primary" data-save="${attr(o.id)}">Save this sample instead</button></div>`
          : `<form id="apply-form"><input type="hidden" name="opportunity_id" value="${attr(o.id)}"><div class="field"><label>Short cover note</label><textarea name="cover_note" placeholder="Why are you a good fit?" required></textarea></div><div class="field"><label>Upload CV (PDF; max 5MB)</label><input name="cv" type="file" accept="application/pdf" required /></div><button class="btn btn-primary" type="submit">Submit application</button></form>`,
      );
    }
    if (state.modal.startsWith("report:"))
      return popup(
        "Report suspicious listing",
        "Reports are reviewed by authorized administrators.",
        `<form id="report-form"><input type="hidden" name="opportunity_id" value="${attr(state.modal.split(":")[1])}"><div class="field"><label>Reason</label><textarea name="reason" required placeholder="Explain what looks suspicious..."></textarea></div><button class="btn btn-primary">Submit report</button></form>`,
      );
    return "";
  }
  function popup(title, sub, content) {
    return `<div class="auth-modal-bg" id="modal-overlay" role="presentation"><div class="modal ${state.modal === "new-listing" ? "wide-modal" : ""}" role="dialog" aria-modal="true" aria-labelledby="popup-title"><button class="modal-x" data-act="close" aria-label="Close">${ic("close", 17)}</button><h2 id="popup-title">${title}</h2><p>${sub}</p>${content}</div></div>`;
  }
  async function syncLive() {
    if (!API.enabled) return;
    try {
      const [organizations, opportunities] = await Promise.all([
        API.rest("organizations", {
          select:
            "id,owner_id,name,industry,category,location_state,website,registration_number,verification_status",
        }),
        API.rest("opportunities", {
          select: "*",
          filters: "status=eq.published",
          order: "created_at.desc",
        }),
      ]);
      state.liveOrgs = organizations || [];
      state.liveOpps = opportunities || [];
      if (API.session && API.userId()) {
        const [profile, applications, saved, requests] = await Promise.all([
          API.rest("profiles", { filters: "id=eq." + API.userId() }),
          API.rest("applications", { select: "*" }),
          API.rest("saved_opportunities", { select: "opportunity_id" }),
          API.rest("organization_verification_requests", {
            select: "*",
            order: "created_at.desc",
          }),
        ]);
        state.liveProfile = profile?.[0] || null;
        state.liveApplications = applications || [];
        state.liveSaved = saved || [];
        state.liveVerification = requests || [];
      } else {
        state.liveProfile = null;
        state.liveApplications = [];
        state.liveSaved = [];
        state.liveVerification = [];
      }
    } catch (err) {
      console.warn("Live database sync failed", err);
      toast("Live data unavailable: " + err.message);
    }
  }
  window.scholarkuRender = render;
  function render() {
    state.route = parseRoute();
    if (
      state.route === "/assessments" ||
      state.route.startsWith("/assessment/")
    ) {
      location.replace("#/explore");
      return;
    }
    const p = state.route;
    let main;
    if (p === "/") main = home();
    else if (p === "/explore")
      main = window.ScholarkuOpportunities.render("all");
    else if (p === "/internships")
      main = window.ScholarkuOpportunities.render("internships");
    else if (p === "/graduates")
      main = window.ScholarkuOpportunities.render("graduates");
    else if (p === "/scholarships")
      main = window.ScholarkuOpportunities.render("scholarships");
    else if (p.startsWith("/funding/"))
      main = window.ScholarkuOpportunities.detail("funding", p.split("/")[2]);
    else if (p.startsWith("/careers/"))
      main = window.ScholarkuOpportunities.detail(
        p.split("/")[2],
        p.split("/")[3],
      );
    else if (p.startsWith("/opportunity/")) main = detailPage(p.slice(13));
    else if (p === "/community") main = communityPage();
    else if (p.startsWith("/community/")) main = serverPage(p.split("/")[2]);
    else if (p === "/login" || p === "/signup")
      main = window.ScholarkuAuth.render();
    else if (p.startsWith("/mentors")) main = mentorPage();
    else if (p === "/dashboard" || p === "/profile") main = dashboardPage();
    else if (p === "/employers" || p === "/admin") {
      location.replace("#/explore");
      return;
    } else if (p === "/trust") main = trustPage();
    else main = home();
    $("#app").innerHTML =
      header() +
      `<main id="main-content">${main}</main>` +
      footer() +
      (state.modal ? modalContent() : "");
    document.dispatchEvent(new Event("scholarku:render"));
    if (p.startsWith("/community/")) {
      const box = $("#chat-messages");
      if (box) box.scrollTop = box.scrollHeight;
    }
  }
  function openAuth(mode = "login", role = "student") {
    state.modal = "";
    state.authMode = mode;
    state.role = role;
    route(mode === "signup" ? "/signup" : "/login");
  }
  async function saveOpportunity(id) {
    if (!isLoggedIn()) {
      openAuth();
      return;
    }
    try {
      if (API.enabled && !id.startsWith("o") && !id.startsWith("demo-")) {
        if (isSaved(id)) {
          await API.rest("saved_opportunities", {
            method: "DELETE",
            filters: "opportunity_id=eq." + id,
          });
          toast("Removed from shortlist");
        } else {
          await API.rest("saved_opportunities", {
            method: "POST",
            body: { opportunity_id: id, user_id: API.userId() },
          });
          toast("Saved to your shortlist");
        }
        await syncLive();
      } else {
        store.saved = store.saved.includes(id)
          ? store.saved.filter((x) => x !== id)
          : [...store.saved, id];
        persist();
        toast(
          store.saved.includes(id)
            ? "Saved to your shortlist"
            : "Removed from shortlist",
        );
      }
      state.modal = "";
      render();
    } catch (err) {
      toast(err.message);
    }
  }
  async function review(reqId, decision) {
    const reason = window.prompt(
      `Reason for ${decision} decision (recorded in the audit trail):`,
      decision === "approve"
        ? "Evidence reviewed and accepted"
        : "Evidence incomplete or inconsistent",
    );
    if (reason === null || !reason.trim()) return;
    try {
      if (API.enabled) {
        await API.rpc("review_verification", {
          p_request_id: reqId,
          p_decision: decision === "approve" ? "approved" : "rejected",
          p_reason: reason,
        });
        await syncLive();
      } else {
        store.verification = decision === "approve" ? "Approved" : "Rejected";
        persist();
      }
      toast(
        (decision === "approve" ? "Approved" : "Rejected") +
          (API.enabled ? " and logged" : " — demo decision only"),
      );
      render();
    } catch (err) {
      toast(err.message);
    }
  }
  async function withdraw(id) {
    if (!confirm("Withdraw this application?")) return;
    try {
      if (API.enabled) {
        await API.rest("applications", {
          method: "PATCH",
          filters: "id=eq." + id,
          body: { status: "Withdrawn" },
        });
        await syncLive();
      } else {
        const a = store.applications.find((x) => x.id === id);
        if (a) a.status = "Withdrawn";
        persist();
      }
      toast("Application withdrawn");
      render();
    } catch (err) {
      toast(err.message);
    }
  }
  function act(name) {
    if (name === "mobile") {
      state.mobile = !state.mobile;
      render();
      return;
    }
    if (name === "close") {
      state.modal = "";
      render();
      return;
    }
    if (name === "login" || name === "signup") {
      openAuth(name);
      return;
    }
    if (
      [
        "dashboard",
        "explore",
        "internships",
        "graduates",
        "community",
      ].includes(name)
    ) {
      route("/" + (name === "dashboard" ? "dashboard" : name));
      return;
    }
    if (name === "reset-filters") {
      Object.assign(state, {
        search: "",
        type: "All",
        field: "All Fields",
        location: "All Locations",
        mode: "Any Mode",
        industry: "All Industries",
        companyType: "All Types",
        contract: "Any Contract",
        level: "All Levels",
      });
      render();
      return;
    }
    if (name === "logout") {
      if (API.enabled) {
        API.signOut().then(() => {
          syncLive().then(() => {
            toast("Signed out");
            route("/");
          });
        });
      } else {
        store.roles = "guest";
        persist();
        toast("Demo session ended");
        route("/");
      }
      return;
    }
    if (name === "post") {
      if (!isLoggedIn()) return openAuth();
      state.modal = "post";
      render();
      return;
    }
    if (name === "voice-notice") {
      toast(
        "Voice calls need a real-time voice provider. Text chat is available in this demo.",
      );
      return;
    }
    if (name.startsWith("apply:")) {
      if (!isLoggedIn()) return openAuth();
      if (currentRole() !== "student") return toast("Only students can apply");
      state.modal = name;
      render();
      return;
    }
    if (name.startsWith("report:")) {
      state.modal = name;
      render();
      return;
    }
  }
  function asForm(f) {
    return Object.fromEntries(new FormData(f).entries());
  }
  async function formSubmit(e) {
    const form = e.target;
    if (!form.id) return;
    e.preventDefault();
    const d = asForm(form);
    try {
      if (form.id === "hero-search") {
        state.search = (d.query || "").trim();
        state.type = "All";
        route("/explore");
        return;
      }
      if (form.id === "profile-form") {
        const skills = d.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        store.profile = {
          name: d.name,
          institution: d.institution,
          field: d.field,
          state: d.state,
          skills: d.skills,
        };
        persist();
        if (API.enabled) {
          await API.rest("profiles", {
            method: "PATCH",
            filters: "id=eq." + API.userId(),
            body: {
              full_name: d.name,
              institution: d.institution,
              field: d.field,
              location_state: d.state,
              skills,
            },
          });
          await syncLive();
        }
        toast("Student profile updated");
        render();
        return;
      }
      if (form.id === "post-form") {
        store.posts.push({
          id: "p" + Date.now(),
          name: state.liveProfile?.full_name || store.profile.name || "Student",
          initial: initials(store.profile.name),
          title: d.title,
          content: d.content,
          type: "Achievement",
        });
        persist();
        state.modal = "";
        toast("Achievement shared in demo community");
        route("/community");
        return;
      }

      if (form.id === "apply-form") {
        if (!API.enabled)
          throw new Error("Live application unavailable in demo mode");
        const o = allOp().find((x) => x.id === d.opportunity_id);
        if (o?.status === "Demo")
          throw new Error("This is only a sample vacancy");
        const file = form.querySelector("[name=cv]").files[0];
        if (
          !file ||
          file.type !== "application/pdf" ||
          file.size > 5 * 1024 * 1024
        )
          throw new Error("CV must be a PDF under 5MB");
        const existing = state.liveApplications.find(
          (a) =>
            a.opportunity_id === d.opportunity_id && a.status !== "Withdrawn",
        );
        if (existing) throw new Error("You have already applied");
        const path = API.userId() + "/" + crypto.randomUUID() + ".pdf";
        await API.uploadPrivate("resumes", path, file);
        await API.rest("applications", {
          method: "POST",
          body: {
            opportunity_id: d.opportunity_id,
            user_id: API.userId(),
            cover_note: d.cover_note,
            cv_path: path,
            status: "Submitted",
          },
        });
        await syncLive();
        state.modal = "";
        toast("Application submitted securely");
        route("/dashboard");
        return;
      }
      if (form.id === "report-form") {
        if (!API.enabled)
          throw new Error("Reporting requires the live backend");
        await API.rest("reports", {
          method: "POST",
          body: {
            opportunity_id: d.opportunity_id,
            user_id: API.userId(),
            reason: d.reason,
          },
        });
        state.modal = "";
        toast("Report submitted");
        render();
        return;
      }
    } catch (err) {
      toast(err.message || "Something went wrong");
      console.error(err);
    }
  }

  document.addEventListener("submit", formSubmit);
  document.addEventListener("click", async (e) => {
    const target = e.target.closest(
      "[data-act],[data-nav],[data-type],[data-save],[data-search],[data-dash],[data-channel],[data-book],[data-review],[data-withdraw],[data-demo-role],[data-role],[data-auth-mode],[data-cv],[data-evidence]",
    );
    if (!target) {
      if (e.target.id === "modal-overlay") {
        state.modal = "";
        render();
      }
      return;
    }
    if (target.tagName === "A" && target.hasAttribute("data-auth-mode"))
      e.preventDefault();
    if (target.dataset.cv || target.dataset.evidence) {
      try {
        const cv = Boolean(target.dataset.cv);
        let path = target.dataset.cv;
        if (!cv) {
          const docs = await API.rest("verification_evidence", {
            filters: "request_id=eq." + target.dataset.evidence,
          });
          path = docs?.[0]?.path;
          if (!path) throw new Error("No supporting document uploaded");
        }
        const signed = await API.signedUrl(
          cv ? "resumes" : "verification-evidence",
          path,
        );
        const link = signed.signedURL || signed.signedUrl;
        if (!link) throw new Error("No document URL received");
        const url = link.startsWith("https://")
          ? link
          : window.SCHOLARKU_CONFIG.SUPABASE_URL.replace(/\/$/, "") +
            "/storage/v1" +
            link;
        window.open(url, "_blank", "noopener,noreferrer");
      } catch (err) {
        toast(err.message);
      }
      return;
    }
    if (target.dataset.act) {
      act(target.dataset.act);
      return;
    }
    if (target.dataset.nav) {
      route(target.dataset.nav);
      return;
    }
    if (target.dataset.type) {
      state.type = target.dataset.type;
      render();
      return;
    }
    if (target.dataset.save) {
      await saveOpportunity(target.dataset.save);
      return;
    }
    if (target.dataset.search) {
      state.search = target.dataset.search;
      state.type = "All";
      route("/explore");
      return;
    }
    if (target.dataset.dash) {
      state.dashTab = target.dataset.dash;
      render();
      return;
    }
    if (target.dataset.review) {
      const [decision, id] = target.dataset.review.split(":");
      await review(id, decision);
      return;
    }
    if (target.dataset.withdraw) {
      await withdraw(target.dataset.withdraw);
      return;
    }
    if (target.dataset.demoRole) {
      store.roles = target.dataset.demoRole;
      persist();
      state.modal = "";
      state.dashTab = "overview";
      toast("Switched to " + store.roles + " demonstration role");
      route(
        store.roles === "employer"
          ? "/employers"
          : store.roles === "admin"
            ? "/admin"
            : "/dashboard",
      );
      return;
    }
    if (target.dataset.role) {
      state.role = target.dataset.role;
      render();
      return;
    }
    if (target.dataset.authMode) {
      state.authMode = target.dataset.authMode;
      render();
      return;
    }
  });
  document.addEventListener("change", async (e) => {
    const fieldMap = {
      "filter-field": "field",
      "filter-location": "location",
      "filter-mode": "mode",
      "filter-company": "companyType",
      "filter-contract": "contract",
      "filter-level": "level",
    };
    if (fieldMap[e.target.id]) {
      state[fieldMap[e.target.id]] = e.target.value;
      render();
      return;
    }
    if (e.target.matches("[data-status]")) {
      const id = e.target.dataset.status,
        val = e.target.value;
      try {
        if (API.enabled) {
          await API.rest("applications", {
            method: "PATCH",
            filters: "id=eq." + id,
            body: { status: val },
          });
          await syncLive();
        } else {
          const a = store.applications.find((x) => x.id === id);
          if (a) a.status = val;
          persist();
        }
        toast("Application status updated");
        render();
      } catch (err) {
        toast(err.message);
      }
    }
  });
  let searchDebounce;
  document.addEventListener("input", (e) => {
    if (e.target.id !== "filter-search") return;
    clearTimeout(searchDebounce);
    const input = e.target;
    searchDebounce = setTimeout(() => {
      state.search = input.value;
      const pos = input.selectionStart;
      render();
      const field = $("#filter-search");
      field?.focus();
      field?.setSelectionRange(pos, pos);
    }, 350);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.modal) {
      state.modal = "";
      render();
    }
  });
  window.addEventListener("hashchange", () => {
    state.mobile = false;
    window.scrollTo(0, 0);
    render();
  });

  document.addEventListener("scholarku:authenticated", async () => {
    await syncLive();
    state.modal = "";
    route("/dashboard");
  });
  if (!location.hash) location.hash = "#/";
  render();
  if (API.enabled)
    syncLive().then(() => {
      if (["/dashboard", "/profile"].includes(state.route)) render();
    });
})();
