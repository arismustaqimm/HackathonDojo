(() => {
  "use strict";
  const { tr, esc, title } = window.SK;
  const { sectors, sectorFor } = window.SCHOLARKU_CAREER_GUIDANCE;
  const funding = [
    ...window.SCHOLARKU_FUNDING,
    ...window.SCHOLARKU_PROVIDER_SCHOLARSHIPS,
  ];
  const slug = (name) =>
    name
      .toLocaleLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const careers = Object.entries(window.SCHOLARKU_CAREERS).flatMap(
    ([kind, rows]) =>
      rows.map((x) => ({
        ...x,
        id: slug(x.org),
        kind,
        sector: sectorFor(x.org),
      })),
  );
  let query = "",
    category = "all",
    sector = "All",
    page = 1,
    current = "";
  function saved() {
    try {
      const list = JSON.parse(localStorage.getItem("sk-saved-links") || "[]");
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }
  const key = (item) => item.kind + ":" + item.org;
  const link = (item) =>
    item.kind === "scholarships"
      ? "#/funding/" + item.id
      : `#/careers/${item.kind}/${item.id}`;
  function items() {
    return [
      ...careers,
      ...funding.map((x) => ({
        ...x,
        programmeKind: x.kind,
        kind: "scholarships",
        sector: "funding",
      })),
    ];
  }
  function card(item) {
    const isFunding = item.kind === "scholarships",
      guide = sectors[item.sector],
      isSaved = saved().includes(key(item));
    const role = isFunding
      ? tr(...item.name)
      : tr(
          item.kind === "graduates"
            ? "Graduate careers portal"
            : "Internship careers portal",
          item.kind === "graduates"
            ? "Portal kerjaya graduan"
            : "Portal kerjaya latihan industri",
        );
    return `<article class="sk-card"><div class="sk-card-head"><span class="sk-monogram" aria-hidden="true">${esc(
      item.org
        .split(/\s+/)
        .map((s) => s[0])
        .slice(0, 2)
        .join(""),
    )}</span><div class="sk-org"><h3>${esc(item.org)}</h3><p>${esc(role)}</p></div><button class="sk-save" aria-label="${tr("Save listing", "Simpan senarai")}" aria-pressed="${isSaved}" data-op-save="${esc(key(item))}">${isSaved ? "♥" : "♡"}</button></div><div class="sk-tags"><span class="sk-pill green">${isFunding ? esc(tr(...item.programmeKind)) : tr("Career directory", "Direktori kerjaya")}</span><span class="sk-pill blue">${isFunding ? tr("Scholarship & aid", "Biasiswa & bantuan") : esc(tr(...guide.label))}</span></div><p class="sk-note">${esc(isFunding ? tr(...item.summary) : tr(...guide.roles))}</p>${isFunding ? `<p class="card-funding-benefit">${esc(tr(...item.benefits))}</p>` : ""}<dl class="sk-dates"><div><dt>${tr("Opening", "Tarikh buka")}</dt><dd>${isFunding ? esc(tr(...item.opening)) : tr("Check the current intake", "Semak pengambilan terkini")}</dd></div><div><dt>${tr("Closing", "Tarikh tutup")}</dt><dd>${isFunding ? esc(tr(...item.closing)) : tr("Not confirmed — check employer", "Belum disahkan — semak dengan majikan")}</dd></div></dl><div class="sk-card-actions"><a class="sk-apply" href="${link(item)}">${tr("Details & application guide", "Butiran & panduan permohonan")} →</a><a class="official-short-link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${tr("Visit official provider", "Lawati penyedia rasmi")}">${tr("Official site", "Laman rasmi")} ${window.SK.externalIcon}</a></div></article>`;
  }
  function rows() {
    return items().filter(
      (x) =>
        (category === "all" || x.kind === category) &&
        (sector === "All" || x.sector === sector) &&
        (
          x.org +
          " " +
          (x.name ? tr(...x.name) : "") +
          " " +
          (sectors[x.sector] ? tr(...sectors[x.sector].label) : "")
        )
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()),
    );
  }
  function results() {
    const filtered = rows(),
      pages = Math.max(1, Math.ceil(filtered.length / 10));
    page = Math.max(1, Math.min(page, pages));
    const first = filtered.length ? (page - 1) * 10 + 1 : 0,
      last = Math.min(page * 10, filtered.length);
    return `<p class="sk-results" role="status">${tr("Showing", "Memaparkan")} ${first}–${last} ${tr("of", "daripada")} ${filtered.length} ${tr("opportunities and provider pages", "peluang dan laman penyedia")}</p><div class="sk-grid">${
      filtered.length
        ? filtered
            .slice((page - 1) * 10, page * 10)
            .map(card)
            .join("")
        : `<p>${tr("No matching results. Try another search.", "Tiada hasil yang sepadan. Cuba carian lain.")}</p>`
    }</div><nav class="sk-pagination" aria-label="${tr("Results pages", "Halaman hasil carian")}"><button data-op-page="${page - 1}" ${page === 1 ? "disabled" : ""}>← ${tr("Previous", "Sebelumnya")}</button>${Array.from({ length: pages }, (_, i) => `<button data-op-page="${i + 1}" ${page === i + 1 ? 'aria-current="page"' : ""}>${i * 10 + 1}–${Math.min((i + 1) * 10, filtered.length)}</button>`).join("")}<button data-op-page="${page + 1}" ${page === pages ? "disabled" : ""}>${tr("Next", "Seterusnya")} →</button></nav>`;
  }
  function render(kind = "all") {
    const route = location.hash.split("?")[0];
    if (route !== current) {
      query = "";
      sector = "All";
      page = 1;
      category = kind;
      current = route;
    }
    const heading =
      kind === "internships"
        ? tr("Internships & early careers.", "Latihan industri & kerjaya awal.")
        : kind === "graduates"
          ? tr("Your graduate journey.", "Perjalanan kerjaya graduan anda.")
          : kind === "scholarships"
            ? tr(
                "Scholarships & student support.",
                "Biasiswa & sokongan pelajar.",
              )
            : tr(
                "Explore your next opportunity.",
                "Terokai peluang seterusnya.",
              );
    return `<section class="sk-page opportunity-directory"><div class="sk-container"><div class="sk-kicker">${tr("UNDERSTAND. PREPARE. APPLY.", "FAHAMI. BERSEDIA. MOHON.")}</div><h1>${heading}</h1><p class="sk-sub">${tr("Understand what each pathway involves, what to prepare and how to apply through the official provider.", "Fahami setiap laluan, persediaan yang diperlukan dan cara memohon melalui penyedia rasmi.")}</p><div class="sk-tabs">${[
      ["all", "Explore all", "Terokai semua", "#/explore"],
      ["internships", "Internships", "Latihan industri", "#/internships"],
      ["graduates", "Graduate programmes", "Program graduan", "#/graduates"],
      [
        "scholarships",
        "Scholarships & aid",
        "Biasiswa & bantuan",
        "#/scholarships",
      ],
    ]
      .map(
        ([id, en, ms, url]) =>
          `<a href="${url}" ${kind === id ? 'aria-current="page"' : ""}>${tr(en, ms)}</a>`,
      )
      .join(
        "",
      )}</div><div class="sk-alert">${tr("Career pages are directories, not confirmed vacancies. Preparation notes are general guidance. Funding amounts, eligibility and dates must be checked against the provider’s current announcement.", "Laman kerjaya ialah direktori, bukan pengesahan kekosongan. Nota persediaan ialah panduan umum. Amaun pembiayaan, kelayakan dan tarikh perlu disemak dengan pengumuman semasa penyedia.")}</div><div class="sk-controls"><label class="sk-search"><span aria-hidden="true">⌕</span><input id="sk-query" value="${esc(query)}" aria-label="${tr("Search opportunities", "Cari peluang")}" placeholder="${tr("Search company, programme or field…", "Cari syarikat, program atau bidang…")}"/></label><select id="op-sector" aria-label="${tr("Field", "Bidang")}"><option value="All">${tr("All fields", "Semua bidang")}</option>${Object.entries(
      sectors,
    )
      .map(
        ([id, guide]) =>
          `<option value="${id}" ${sector === id ? "selected" : ""}>${esc(tr(...guide.label))}</option>`,
      )
      .join(
        "",
      )}<option value="funding" ${sector === "funding" ? "selected" : ""}>${tr("Scholarships & student aid", "Biasiswa & bantuan pelajar")}</option></select></div><div id="sk-list">${results()}</div></div></section>`;
  }
  const fact = (label, value) =>
    `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`;
  function detail(kind, id) {
    if (kind === "funding")
      return fundingDetail(funding.find((x) => x.id === id));
    const item = careers.find((x) => x.kind === kind && x.id === id);
    if (!item) return missing();
    const guide = sectors[item.sector];
    return (
      title(
        tr("APPLICATION GUIDE", "PANDUAN PERMOHONAN"),
        item.org,
        tr(...guide.label),
      ) +
      `<div class="container page-content"><a class="text-link" href="#/${item.kind}">← ${tr("Back to directory", "Kembali ke direktori")}</a><div class="detail-layout mt-18"><article class="panel opportunity-prose"><h2>${tr("Understand this pathway", "Fahami laluan ini")}</h2><p>${tr("This is the employer’s career portal. Use it to find actual openings, then read the role-specific requirements before applying. ScholarKu does not confirm an active vacancy from a portal link alone.", "Ini ialah portal kerjaya majikan. Gunakannya untuk mencari kekosongan sebenar, kemudian baca syarat khusus jawatan sebelum memohon. ScholarKu tidak mengesahkan kekosongan aktif hanya berdasarkan pautan portal.")}</p><h3>${tr("Roles and fields to explore", "Peranan dan bidang untuk diterokai")}</h3><p>${esc(tr(...guide.roles))}</p><p class="small-note">${tr("These are sector examples, not a list of advertised positions at this company.", "Ini ialah contoh sektor, bukan senarai jawatan yang diiklankan oleh syarikat ini.")}</p><h3>${tr("What to prepare", "Persediaan yang diperlukan")}</h3><p>${esc(tr(...guide.prepare))}</p><ul><li>${tr("An up-to-date CV with education, projects, skills and your available dates.", "CV terkini dengan pendidikan, projek, kemahiran dan tarikh anda tersedia.")}</li><li>${tr("Your academic transcript and a university placement letter, if the actual vacancy requests them.", "Transkrip akademik dan surat penempatan universiti, jika diminta dalam iklan sebenar.")}</li><li>${tr("A portfolio or work sample when relevant. Remove private information and explain your contribution.", "Portfolio atau contoh kerja jika berkaitan. Padam maklumat peribadi dan jelaskan sumbangan anda.")}</li></ul><h3>${tr("Check your eligibility before spending time applying", "Semak kelayakan sebelum meluangkan masa memohon")}</h3><p>${tr("Confirm the required degree or major, current study stage, academic threshold, citizenship/work authorisation and placement duration. These are vacancy-specific; do not assume every company accepts every field or year of study.", "Sahkan ijazah atau bidang, peringkat pengajian, tahap akademik, kewarganegaraan/kebenaran bekerja dan tempoh penempatan. Syarat mengikut iklan; jangan anggap semua syarikat menerima setiap bidang atau tahun pengajian.")}</p><h3>${tr("Apply step by step", "Mohon langkah demi langkah")}</h3><ol><li>${tr("Open the official careers portal below.", "Buka portal kerjaya rasmi di bawah.")}</li><li>${item.kind === "graduates" ? tr("Search for graduate, trainee, associate or early-career programmes and choose the relevant country.", "Cari program graduan, pelatih, associate atau kerjaya awal dan pilih negara berkaitan.") : tr("Search for internship, intern or student placement and choose the relevant country.", "Cari internship, intern atau penempatan pelajar dan pilih negara berkaitan.")}</li><li>${tr("Read the full posting. Record its job reference, closing date, location, duration and requested documents.", "Baca iklan penuh. Catat nombor rujukan, tarikh tutup, lokasi, tempoh dan dokumen yang diminta.")}</li><li>${tr("Tailor your CV and submit through the official application system.", "Sesuaikan CV dan hantar melalui sistem permohonan rasmi.")}</li><li>${tr("Keep your application confirmation and track follow-up dates. Never pay an unknown recruiter to apply.", "Simpan pengesahan permohonan dan jejaki tarikh susulan. Jangan bayar perekrut tidak dikenali untuk memohon.")}</li></ol><a class="btn btn-primary" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${tr("Open official careers portal", "Buka portal kerjaya rasmi")} ${window.SK.externalIcon}</a><h3>${tr("Need help preparing?", "Perlukan bantuan persediaan?")}</h3><p><a class="text-link" href="#/mentors">${tr("Explore CV reviews and mentoring", "Terokai semakan CV dan bimbingan")}</a> · <a class="text-link" href="#/scholarships">${tr("Find funding and travel support", "Cari pembiayaan dan sokongan perjalanan")}</a></p></article><aside class="panel opportunity-facts"><h2>${tr("Before you apply", "Sebelum memohon")}</h2><dl>${fact(tr("Opportunity type", "Jenis peluang"), item.kind === "graduates" ? tr("Graduate career directory", "Direktori kerjaya graduan") : tr("Internship career directory", "Direktori kerjaya latihan industri"))}${fact(tr("Opening / closing dates", "Tarikh buka / tutup"), tr("Not confirmed — see the actual posting", "Belum disahkan — rujuk iklan sebenar"))}${fact(tr("Duration", "Tempoh"), tr("Vacancy-specific; align with your study calendar", "Mengikut iklan; selaraskan dengan kalendar pengajian"))}${fact(tr("Allowance / salary", "Elaun / gaji"), tr("Not listed here; confirm with the employer", "Tidak disenaraikan di sini; sahkan dengan majikan"))}${fact(tr("Location & work arrangement", "Lokasi & aturan kerja"), tr("Check office/site, travel and remote-work details", "Semak pejabat/tapak, perjalanan dan aturan kerja jarak jauh"))}${fact(tr("Contract / obligations", "Kontrak / kewajipan"), tr("Read the actual offer before accepting", "Baca tawaran sebenar sebelum menerima"))}</dl><p class="small-note">${tr("The official source is linked for your own verification. This guide does not guarantee employment or eligibility.", "Sumber rasmi dipautkan untuk pengesahan anda. Panduan ini tidak menjamin pekerjaan atau kelayakan.")}</p></aside></div></div>`
    );
  }
  function fundingDetail(item) {
    if (!item) return missing();
    return (
      title(
        tr("FUND YOUR NEXT STEP", "BIAYAI LANGKAH SETERUSNYA"),
        tr(...item.name),
        item.org,
      ) +
      `<div class="container page-content"><a class="text-link" href="#/scholarships">← ${tr("Scholarships & student support", "Biasiswa & sokongan pelajar")}</a><div class="detail-layout mt-18"><article class="panel opportunity-prose"><div class="alert info">${tr("Source status: programme details and dates require official confirmation. Some information below was supplied for this project and has not been independently verified.", "Status sumber: butiran program dan tarikh memerlukan pengesahan rasmi. Sebahagian maklumat di bawah diberi untuk projek ini dan belum disahkan secara bebas.")}</div><h2>${tr("What this supports", "Sokongan yang disediakan")}</h2><p>${esc(tr(...item.summary))}</p><h3>${tr("Funding & coverage", "Pembiayaan & perlindungan")}</h3><p>${esc(tr(...item.benefits))}</p><h3>${tr("Eligibility", "Kelayakan")}</h3><p>${esc(tr(...item.eligibility))}</p><h3>${tr("How to apply", "Cara memohon")}</h3><ol>${item.steps.map((step) => `<li>${esc(tr(...step))}</li>`).join("")}</ol><h3>${tr("Notes & tips", "Nota & tip")}</h3><p>${esc(tr(...item.tips))}</p><div class="inline-row"><a class="btn btn-primary" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${tr("Official programme website", "Laman program rasmi")} ${window.SK.externalIcon}</a>${item.admissions ? `<a class="btn btn-outline" href="${esc(item.admissions)}" target="_blank" rel="noopener noreferrer">${tr("Admissions portal", "Portal kemasukan")} ${window.SK.externalIcon}</a>` : ""}</div><p class="small-note">${tr("Information reviewed for this project on 16 October 2026; official pages could not be fetched from this environment. Confirm current terms before making a financial decision.", "Maklumat disemak untuk projek ini pada 16 Oktober 2026; laman rasmi tidak dapat dicapai dari persekitaran ini. Sahkan syarat semasa sebelum membuat keputusan kewangan.")}</p></article><aside class="panel opportunity-facts"><h2>${tr("Programme snapshot", "Ringkasan program")}</h2><dl>${[
        [tr("Opening", "Tarikh buka"), item.opening],
        [tr("Deadline", "Tarikh akhir"), item.closing],
        [tr("Destination", "Destinasi"), item.destination],
        [tr("Bond / obligation", "Ikatan / kewajipan"), item.bond],
        [tr("Entry level", "Peringkat kemasukan"), item.level],
        [
          tr("Eligible qualifications", "Kelayakan akademik"),
          item.qualifications,
        ],
        [tr("Fields of study", "Bidang pengajian"), item.fields],
      ]
        .map(([label, value]) => fact(label, tr(...value)))
        .join(
          "",
        )}</dl><p>${tr("Eligibility depends on official programme rules, not an assumption based on ethnicity.", "Kelayakan bergantung pada peraturan rasmi program, bukan andaian berdasarkan kaum.")}</p></aside></div></div>`
    );
  }
  function missing() {
    return title(
      tr("OPPORTUNITY", "PELUANG"),
      tr("Listing not found", "Peluang tidak ditemui"),
      tr(
        "Return to Explore to find a current directory entry.",
        "Kembali ke Teroka untuk mencari entri direktori semasa.",
      ),
    );
  }
  document.addEventListener("input", (e) => {
    if (
      e.target.id === "sk-query" &&
      e.target.closest(".opportunity-directory")
    ) {
      query = e.target.value;
      page = 1;
      document.getElementById("sk-list").innerHTML = results();
    }
  });
  document.addEventListener("change", (e) => {
    if (e.target.id === "op-sector") {
      sector = e.target.value;
      page = 1;
      document.getElementById("sk-list").innerHTML = results();
    }
  });
  document.addEventListener("click", (e) => {
    const button = e.target.closest("[data-op-page]");
    if (button && !button.disabled) {
      page = Number(button.dataset.opPage);
      document.getElementById("sk-list").innerHTML = results();
      document.getElementById("sk-query").focus();
    }
    const save = e.target.closest("[data-op-save]");
    if (save) {
      const old = saved(),
        id = save.dataset.opSave,
        next = old.includes(id) ? old.filter((x) => x !== id) : [...old, id];
      localStorage.setItem("sk-saved-links", JSON.stringify(next));
      save.textContent = next.includes(id) ? "♥" : "♡";
      save.setAttribute("aria-pressed", String(next.includes(id)));
    }
  });
  window.ScholarkuOpportunities = {
    render,
    detail,
    scholarshipCount: funding.length,
    items,
    savedCount: () =>
      items().filter((item) => saved().includes(key(item))).length,
    savedPage: () =>
      `<p class="muted">${tr("Saved career and funding pages are stored in this browser.", "Laman kerjaya dan pembiayaan yang disimpan berada dalam pelayar ini.")}</p><div class="sk-grid">${items()
        .filter((item) => saved().includes(key(item)))
        .map(card)
        .join("")}</div>`,
  };
})();
