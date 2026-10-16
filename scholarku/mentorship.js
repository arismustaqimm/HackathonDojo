(() => {
  "use strict";
  const { tr, esc, signedIn, date, notify, showDialog, message, title } =
    window.SK;
  const replyDrafts = new Map();
  let people = [...window.SCHOLARKU_MENTORS],
    query = "",
    field = "All",
    generation = 0,
    timer = null,
    signature = "";
  const statuses = {
    waiting_for_mentor: [
      "Waiting for mentor enrolment",
      "Menunggu pendaftaran mentor",
    ],
    submitted: ["Submitted", "Dihantar"],
    accepted: ["Accepted", "Diterima"],
    declined: ["Declined", "Ditolak"],
    completed: ["Completed", "Selesai"],
    cancelled: ["Cancelled", "Dibatalkan"],
  };
  const disciplines = {
    All: ["All disciplines", "Semua bidang"],
    Finance: ["Finance", "Kewangan"],
    Cybersecurity: ["Cybersecurity & SOC", "Keselamatan siber & SOC"],
    "Data & AI": ["Data & AI", "Data & AI"],
    "Engineering leadership": [
      "Engineering leadership",
      "Kepimpinan kejuruteraan",
    ],
    "Software & AI": ["Software & AI", "Perisian & AI"],
    "Finance & software": ["Finance & software", "Kewangan & perisian"],
  };
  const path = () => location.hash.slice(1).split("?")[0];
  const role = (p) =>
    window.ScholarkuI18n.language === "bm" && p.role_ms
      ? p.role_ms
      : p.role_title;
  const bio = (p) =>
    window.ScholarkuI18n.language === "bm" && p.bio_ms ? p.bio_ms : p.bio;
  function cards() {
    const selected = people.filter(
      (p) =>
        (field === "All" || p.discipline === field) &&
        (
          p.name +
          " " +
          p.role_title +
          " " +
          p.bio +
          " " +
          (p.role_ms || "") +
          " " +
          (p.bio_ms || "")
        )
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()),
    );
    return `<p class="muted" role="status">${selected.length} ${tr("public professional profiles", "profil profesional awam")}</p><div class="grid-3 mentor-directory">${selected
      .map(
        (p) =>
          `<article class="mentor-card live-mentor-card"><div class="mentor-avatar">${esc(
            p.name
              .split(" ")
              .map((x) => x[0])
              .slice(0, 2)
              .join(""),
          )}</div><span class="badge teal">${esc(tr(...(disciplines[p.discipline] || [p.discipline, p.discipline])))}</span><h2>${esc(p.name)}</h2><p class="mentor-role">${esc(role(p))}</p><p>${esc(bio(p))}</p><p class="mentor-availability ${p.profile_status === "enrolled" ? "enrolled" : ""}">${p.profile_status === "enrolled" ? tr("Participating mentor", "Mentor berdaftar") : p.profile_status === "unavailable" ? tr("Not accepting requests", "Tidak menerima permohonan") : tr("Public reference · not enrolled", "Rujukan awam · belum berdaftar")}</p><a class="text-link" href="${esc(p.source_url)}" target="_blank" rel="noopener noreferrer">${tr("Public profile & source", "Profil awam & sumber")} ${window.SK.externalIcon}</a><div class="mentor-actions"><button class="btn btn-primary" data-mentor-request="${esc(p.id)}" data-request-type="cv_review" ${p.profile_status === "unavailable" ? "disabled" : ""}>${tr("Request CV review", "Mohon semakan CV")}</button><button class="btn btn-outline" data-mentor-request="${esc(p.id)}" data-request-type="session" ${p.profile_status === "unavailable" ? "disabled" : ""}>${tr("Request a session", "Mohon sesi")}</button></div></article>`,
      )
      .join(
        "",
      )}</div>${!selected.length ? `<div class="empty">${tr("No matching profiles. Try another field or keyword.", "Tiada profil yang sepadan. Cuba bidang atau kata kunci lain.")}</div>` : ""}`;
  }
  function render(current) {
    if (current === "/mentors/requests")
      return (
        title(
          tr("MENTORSHIP", "BIMBINGAN MENTOR"),
          tr("My mentoring requests", "Permohonan bimbingan saya"),
          tr(
            "Track your own requests and, if you are an enrolled mentor, respond to students.",
            "Jejaki permohonan anda dan, jika anda mentor berdaftar, berikan respons kepada pelajar.",
          ),
        ) +
        `<div class="container page-content"><a class="text-link" href="#/mentors">← ${tr("Find a mentor", "Cari mentor")}</a><div id="mentor-requests-list" class="mt-18"><p>${tr("Loading requests…", "Memuatkan permohonan…")}</p></div></div>`
      );
    return (
      title(
        tr("LEARN FROM EXPERIENCE", "BELAJAR DARIPADA PENGALAMAN"),
        tr(
          "Find guidance for your next step",
          "Cari bimbingan untuk langkah seterusnya",
        ),
        tr(
          "Explore finance, SOC and security, data science, software and engineering leadership.",
          "Terokai kewangan, SOC dan keselamatan, sains data, perisian serta kepimpinan kejuruteraan.",
        ),
      ) +
      `<div class="container page-content"><div class="inline-row justify-between mb-20"><p class="muted">${tr("Choose a person, then request a CV review or a mentoring session.", "Pilih individu, kemudian mohon semakan CV atau sesi bimbingan.")}</p><a class="btn btn-outline" href="#/mentors/requests">${tr("My requests", "Permohonan saya")}</a></div><div class="alert info mb-20">${tr("Public profiles are sourced references. People shown as “not enrolled” have not agreed to provide mentoring through ScholarKu. Requests to them are held as private expressions of interest; CVs are not shared until they enrol.", "Profil awam ialah rujukan bersumber. Individu yang ditanda “belum berdaftar” belum bersetuju menjadi mentor melalui ScholarKu. Permohonan kepada mereka disimpan sebagai pernyataan minat peribadi; CV tidak dikongsi sehingga mereka berdaftar.")}</div><div class="filter-bar"><label class="sr-only" for="mentor-search">${tr("Search mentors", "Cari mentor")}</label><input id="mentor-search" placeholder="${tr("Search name, role or niche…", "Cari nama, peranan atau bidang khusus…")}" value="${esc(query)}"/><label class="sr-only" for="mentor-field">${tr("Discipline", "Bidang")}</label><select id="mentor-field">${Object.entries(
        disciplines,
      )
        .map(
          ([key, label]) =>
            `<option value="${key}" ${field === key ? "selected" : ""}>${esc(tr(...label))}</option>`,
        )
        .join(
          "",
        )}</select></div><div id="mentor-results">${cards()}</div></div>`
    );
  }
  function requestDialog(mentor, type) {
    if (!signedIn()) {
      location.hash = "#/login";
      return;
    }
    const dialog = showDialog(
      "mentor-request-dialog",
      `<form id="mentorship-request-form" data-mentor="${esc(mentor.id)}"><h2>${tr("Ask", "Mohon bantuan daripada")} ${esc(mentor.name)}</h2><p>${esc(role(mentor))}</p><div class="request-types"><label><input type="radio" name="request_type" value="cv_review" ${type === "cv_review" ? "checked" : ""}/>${tr("CV review", "Semakan CV")}</label><label><input type="radio" name="request_type" value="session" ${type === "session" ? "checked" : ""}/>${tr("Mentoring session", "Sesi bimbingan")}</label></div><div class="field"><label for="mentor-topic">${tr("What would you like help with?", "Apakah bantuan yang anda perlukan?")}</label><textarea id="mentor-topic" name="topic" required minlength="10" maxlength="2000" placeholder="${tr("Describe your goal and the feedback you need…", "Terangkan matlamat dan maklum balas yang anda perlukan…")}"></textarea></div><div class="field" id="mentor-cv-field" ${type === "cv_review" ? "" : "hidden"}><label for="mentor-cv">${tr("Upload your CV — PDF, maximum 5 MB", "Muat naik CV anda — PDF, maksimum 5 MB")}</label><input type="file" id="mentor-cv" name="cv" accept="application/pdf,.pdf" ${type === "cv_review" ? "required" : ""}/><small>${tr("Stored privately. Access is limited to you and the selected mentor after enrolment.", "Disimpan secara peribadi. Akses terhad kepada anda dan mentor yang dipilih selepas pendaftaran.")}</small></div><div class="alert info">${mentor.profile_status === "enrolled" ? tr("This request will appear in the selected mentor’s ScholarKu inbox. A session is arranged only after acceptance.", "Permohonan ini akan dipaparkan dalam peti masuk ScholarKu mentor yang dipilih. Sesi diatur hanya selepas diterima.") : tr("This person has not enrolled. Your interest will be saved as waiting for mentor enrolment. No invitation, booking or CV is sent to their public profile.", "Individu ini belum berdaftar. Minat anda disimpan sebagai menunggu pendaftaran mentor. Tiada jemputan, tempahan atau CV dihantar ke profil awam mereka.")}</div><label class="request-consent"><input type="checkbox" required name="consent"/>${tr("I agree to share this request and attached CV with the selected mentor if they join ScholarKu.", "Saya bersetuju berkongsi permohonan dan CV yang dilampirkan dengan mentor yang dipilih jika mereka menyertai ScholarKu.")}</label><p data-live-message role="status" hidden></p><div class="dialog-actions"><button type="button" class="btn btn-outline" data-close-dialog>${tr("Cancel", "Batal")}</button><button class="btn btn-primary" type="submit">${tr("Submit request", "Hantar permohonan")}</button></div></form>`,
    );
    dialog
      .querySelector("[data-close-dialog]")
      .addEventListener("click", () => dialog.close());
  }
  async function loadDirectory(gen) {
    if (!window.API.enabled) return;
    try {
      const rows = await window.API.rest("mentors", {
        select: "*",
        order: "name.asc",
      });
      if (gen !== generation) return;
      if (rows?.length) {
        people = rows.map((row) => ({
          ...window.SCHOLARKU_MENTORS.find((p) => p.id === row.id),
          ...row,
        }));
        const list = document.getElementById("mentor-results");
        if (list) list.innerHTML = cards();
      }
    } catch {
      /* Public references remain browseable; request writes still require the live service. */
    }
  }
  function replyMarkup(r, recipient) {
    return `${r.mentor_reply ? `<div class="mentor-feedback"><h3>${tr("Mentor feedback / arrangements", "Maklum balas mentor / pengaturan")}</h3><p data-no-translate>${esc(r.mentor_reply)}</p></div>` : ""}${recipient && r.status !== "cancelled" ? `<form class="mentor-reply-form" data-request-id="${esc(r.id)}"><div class="field"><label for="reply-${esc(r.id)}">${tr("CV feedback or session arrangements", "Maklum balas CV atau pengaturan sesi")}</label><textarea id="reply-${esc(r.id)}" name="reply" maxlength="5000" required>${esc(replyDrafts.get(r.id) ?? r.mentor_reply ?? "")}</textarea></div><p data-live-message role="status" hidden></p><button class="btn btn-primary" type="submit">${tr("Save reply", "Simpan respons")}</button></form>` : ""}`;
  }
  async function loadRequests(gen) {
    const root = document.getElementById("mentor-requests-list");
    if (!root) return;
    if (!signedIn()) {
      root.innerHTML = `<div class="empty"><p>${tr("Log in to see your private requests.", "Log masuk untuk melihat permohonan peribadi anda.")}</p><a class="btn btn-primary" href="#/login">${tr("Log in", "Log masuk")}</a></div>`;
      return;
    }
    try {
      const [rows, mentors] = await Promise.all([
        window.API.rest("mentorship_requests", {
          select: "*",
          order: "created_at.desc",
          limit: 100,
        }),
        window.API.rest("mentors", {
          select: "id,name,linked_user_id,profile_status",
        }),
      ]);
      if (gen !== generation) return;
      const serialized = JSON.stringify([rows, mentors]);
      if (signature === serialized) return;
      signature = serialized;
      const focusedForm = document.activeElement?.closest(".mentor-reply-form");
      const focusedId = focusedForm?.dataset.requestId;
      const caret = focusedId ? document.activeElement.selectionStart : null;
      root.innerHTML = rows.length
        ? rows
            .map((r) => {
              const mentor = mentors.find((m) => m.id === r.mentor_id);
              const own = r.user_id === window.API.userId(),
                recipient =
                  !own && mentor?.linked_user_id === window.API.userId();
              return `<article class="panel mentor-request-row"><div class="inline-row justify-between"><h2>${esc(own ? mentor?.name || r.mentor_id : r.requester_name)}</h2><span class="badge">${esc(tr(...(statuses[r.status] || [r.status, r.status])))}</span></div><p><strong>${r.request_type === "cv_review" ? tr("CV review", "Semakan CV") : tr("Mentoring session", "Sesi bimbingan")}</strong> · ${esc(date(r.created_at))}</p><p data-no-translate>${esc(r.topic)}</p><div class="inline-row">${r.cv_path ? `<button class="btn btn-outline" data-mentor-cv="${esc(r.cv_path)}">${tr("View CV", "Lihat CV")}</button>` : ""}${own && ["waiting_for_mentor", "submitted", "accepted"].includes(r.status) ? `<button class="btn btn-outline" data-request-status="cancelled" data-request-id="${esc(r.id)}">${tr("Cancel request", "Batalkan permohonan")}</button>` : ""}${recipient && ["waiting_for_mentor", "submitted"].includes(r.status) ? `<button class="btn btn-primary" data-request-status="accepted" data-request-id="${esc(r.id)}">${tr("Accept", "Terima")}</button><button class="btn btn-outline" data-request-status="declined" data-request-id="${esc(r.id)}">${tr("Decline", "Tolak")}</button>` : ""}${recipient && r.status === "accepted" ? `<button class="btn btn-primary" data-request-status="completed" data-request-id="${esc(r.id)}">${tr("Mark completed", "Tandakan selesai")}</button>` : ""}</div>${replyMarkup(r, recipient)}</article>`;
            })
            .join("")
        : `<div class="empty"><h2>${tr("No requests yet", "Belum ada permohonan")}</h2><a href="#/mentors" class="btn btn-primary">${tr("Explore mentors", "Terokai mentor")}</a></div>`;
      for (const form of root.querySelectorAll(".mentor-reply-form")) {
        if (replyDrafts.has(form.dataset.requestId))
          form.elements.reply.value = replyDrafts.get(form.dataset.requestId);
      }
      if (focusedId) {
        const input = document.getElementById("reply-" + focusedId);
        if (input) {
          input.focus({ preventScroll: true });
          input.setSelectionRange(caret, caret);
        }
      }
    } catch {
      if (gen === generation)
        root.innerHTML = `<div class="empty"><p>${tr("Mentoring requests are unavailable. Please try again later.", "Permohonan bimbingan tidak tersedia. Sila cuba lagi nanti.")}</p></div>`;
    }
  }
  async function summary() {
    const counter = document.getElementById("mentor-request-count");
    if (!counter) return;
    try {
      if (!signedIn()) return;
      const rows = await window.API.rest("mentorship_requests", {
        select: "id",
        filters: "user_id=eq." + window.API.userId(),
      });
      if (document.getElementById("mentor-request-count") === counter)
        counter.textContent = rows.length;
    } catch {
      counter.textContent = "—";
    }
  }
  document.addEventListener("scholarku:render", () => {
    generation++;
    clearInterval(timer);
    timer = null;
    signature = "";
    document.getElementById("mentor-request-dialog")?.close();
    const gen = generation;
    if (path() === "/mentors") loadDirectory(gen);
    if (path() === "/mentors/requests") {
      loadRequests(gen);
      timer = setInterval(() => {
        if (!document.hidden) loadRequests(gen);
      }, 10000);
    }
    summary();
  });
  document.addEventListener("input", (e) => {
    const reply = e.target.closest(".mentor-reply-form");
    if (reply && e.target.name === "reply")
      replyDrafts.set(reply.dataset.requestId, e.target.value);
    if (e.target.id === "mentor-search") {
      query = e.target.value;
      document.getElementById("mentor-results").innerHTML = cards();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && path() === "/mentors/requests")
      loadRequests(generation);
  });
  document.addEventListener("change", (e) => {
    if (e.target.id === "mentor-field") {
      field = e.target.value;
      document.getElementById("mentor-results").innerHTML = cards();
    }
    if (
      e.target.name === "request_type" &&
      e.target.closest("#mentorship-request-form")
    ) {
      const cv = e.target.value === "cv_review";
      document.getElementById("mentor-cv-field").hidden = !cv;
      document.getElementById("mentor-cv").required = cv;
    }
  });
  document.addEventListener("click", async (e) => {
    const button = e.target.closest("[data-mentor-request]");
    if (button) {
      const mentor = people.find((p) => p.id === button.dataset.mentorRequest);
      if (mentor) requestDialog(mentor, button.dataset.requestType);
      return;
    }
    const status = e.target.closest("[data-request-status]");
    if (status) {
      status.disabled = true;
      try {
        await window.API.rest("mentorship_requests", {
          method: "PATCH",
          filters: "id=eq." + status.dataset.requestId,
          body: { status: status.dataset.requestStatus },
        });
        signature = "";
        await loadRequests(generation);
      } catch {
        notify(
          tr(
            "Unable to update this request. Please try again.",
            "Tidak dapat mengemas kini permohonan ini. Sila cuba lagi.",
          ),
        );
        status.disabled = false;
      }
      return;
    }
    const cv = e.target.closest("[data-mentor-cv]");
    if (cv) {
      const popup = window.open("about:blank", "_blank");
      if (!popup) {
        notify(
          tr(
            "Allow document popups and try again.",
            "Benarkan tetingkap dokumen dan cuba lagi.",
          ),
        );
        return;
      }
      popup.opener = null;
      try {
        const signed = await window.API.signedUrl(
          "mentor-cvs",
          cv.dataset.mentorCv,
        );
        const link = signed.signedURL || signed.signedUrl;
        if (!link) throw new Error("No document URL");
        const origin = new URL(window.SCHOLARKU_CONFIG.SUPABASE_URL).origin;
        const url = new URL(
          link.startsWith("https://") ? link : origin + "/storage/v1" + link,
        );
        if (url.origin !== origin) throw new Error("Unexpected document host");
        popup.location.replace(url.href);
      } catch {
        popup.close();
        notify(
          tr(
            "This CV is unavailable or you do not have access.",
            "CV ini tidak tersedia atau anda tiada akses.",
          ),
        );
      }
    }
  });
  document.addEventListener("submit", async (e) => {
    if (e.target.matches(".mentor-reply-form")) {
      e.preventDefault();
      const form = e.target,
        button = form.querySelector("button");
      button.disabled = true;
      try {
        await window.API.rest("mentorship_requests", {
          method: "PATCH",
          filters: "id=eq." + form.dataset.requestId,
          body: { mentor_reply: form.elements.reply.value.trim() },
        });
        replyDrafts.delete(form.dataset.requestId);
        signature = "";
        await loadRequests(generation);
        notify(
          tr("Reply saved for the student.", "Respons disimpan untuk pelajar."),
        );
      } catch {
        message(
          form,
          tr(
            "Unable to save your reply. Your draft is retained.",
            "Tidak dapat menyimpan respons. Draf anda dikekalkan.",
          ),
        );
        button.disabled = false;
      }
      return;
    }
    if (e.target.id !== "mentorship-request-form") return;
    e.preventDefault();
    const form = e.target;
    if (form.dataset.sending === "true") return;
    if (!signedIn()) {
      message(form, tr("Please log in again.", "Sila log masuk semula."));
      return;
    }
    const type = new FormData(form).get("request_type"),
      topic = form.elements.topic.value.trim();
    if (topic.length < 10) return;
    form.dataset.sending = "true";
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    let file = null,
      path = null;
    if (type === "cv_review") {
      file = form.elements.cv.files[0];
      let header = "";
      try {
        if (file) header = await file.slice(0, 5).text();
      } catch {}
      if (
        !file ||
        file.type !== "application/pdf" ||
        file.size > 5242880 ||
        file.size < 5 ||
        header !== "%PDF-"
      ) {
        message(
          form,
          tr(
            "Choose a valid PDF CV no larger than 5 MB.",
            "Pilih CV PDF yang sah dan tidak melebihi 5 MB.",
          ),
        );
        form.dataset.sending = "false";
        submit.disabled = false;
        return;
      }
    }
    const requestId = crypto.randomUUID();
    try {
      if (file) {
        message(
          form,
          tr(
            "Uploading your CV privately…",
            "Memuat naik CV anda secara peribadi…",
          ),
          "info",
        );
        path = window.API.userId() + "/" + crypto.randomUUID() + ".pdf";
        await window.API.uploadPrivate("mentor-cvs", path, file);
      }
      message(
        form,
        tr("Submitting your request…", "Menghantar permohonan anda…"),
        "info",
      );
      const result = await window.API.rest("mentorship_requests", {
        method: "POST",
        body: {
          id: requestId,
          user_id: window.API.userId(),
          mentor_id: form.dataset.mentor,
          request_type: type,
          topic,
          cv_path: path,
        },
      });
      form.closest("dialog").close();
      notify(
        result?.[0]?.status === "waiting_for_mentor"
          ? tr(
              "Interest saved privately, waiting for mentor enrolment.",
              "Minat disimpan secara peribadi, menunggu pendaftaran mentor.",
            )
          : tr(
              "Request submitted to the mentor.",
              "Permohonan dihantar kepada mentor.",
            ),
      );
      location.hash = "#/mentors/requests";
    } catch (error) {
      let existing;
      try {
        existing = await window.API.rest("mentorship_requests", {
          select: "id",
          filters: "id=eq." + requestId,
        });
      } catch {
        message(
          form,
          tr(
            "Submission could not be confirmed. Check My requests before trying again. Your CV remains private.",
            "Penghantaran tidak dapat disahkan. Semak Permohonan saya sebelum mencuba semula. CV anda kekal peribadi.",
          ),
        );
        return;
      }
      if (existing?.length) {
        form.closest("dialog").close();
        location.hash = "#/mentors/requests";
        return;
      }
      if (!error.status || error.status >= 500) {
        message(
          form,
          tr(
            "Submission could not be confirmed. Check My requests before trying again. Your CV remains private.",
            "Penghantaran tidak dapat disahkan. Semak Permohonan saya sebelum mencuba semula. CV anda kekal peribadi.",
          ),
        );
        return;
      }
      if (path) {
        try {
          await window.API.removePrivate("mentor-cvs", path);
        } catch {}
      }
      message(
        form,
        tr(
          "Unable to submit your request. Please try again later.",
          "Tidak dapat menghantar permohonan. Sila cuba lagi nanti.",
        ),
      );
      submit.disabled = false;
      form.dataset.sending = "false";
    }
  });
  window.ScholarkuMentorship = { render };
})();
