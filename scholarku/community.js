/* Authenticated, membership-gated conversations. Empty rooms stay empty until people post. */
(() => {
  "use strict";
  const { tr, esc, signedIn, date, notify, showDialog, message, title } =
    window.SK;
  const rooms = [
    {
      id: "tech",
      emoji: "💻",
      name: ["Code & Coffee MY", "Code & Coffee MY"],
      desc: [
        "Software development, hackathons and student projects.",
        "Pembangunan perisian, hackathon dan projek pelajar.",
      ],
      channels: ["general", "projects", "hackathons", "skill-exchange"],
    },
    {
      id: "scholars",
      emoji: "🎓",
      name: ["Scholarship Seekers", "Pencari Biasiswa"],
      desc: [
        "Funding applications, interviews and study opportunities.",
        "Permohonan pembiayaan, temu duga dan peluang pengajian.",
      ],
      channels: ["general", "applications", "interviews"],
    },
    {
      id: "cyber",
      emoji: "🛡️",
      name: ["SOC & Cyber Defence", "SOC & Pertahanan Siber"],
      desc: [
        "Discuss security operations, incident response and defensive security careers.",
        "Bincangkan operasi keselamatan, respons insiden dan kerjaya pertahanan siber.",
      ],
      channels: ["general", "soc-careers", "incident-response", "ctf-learning"],
    },
    {
      id: "design",
      emoji: "🎨",
      name: ["Creators & Designers", "Pencipta & Pereka"],
      desc: [
        "Design portfolios, user research and creative practice.",
        "Portfolio reka bentuk, penyelidikan pengguna dan amalan kreatif.",
      ],
      channels: ["general", "portfolio-feedback", "opportunities"],
    },
    {
      id: "finance",
      emoji: "📊",
      name: ["Finance & Investment Circle", "Komuniti Kewangan & Pelaburan"],
      desc: [
        "Financial analysis, investment banking and early-career finance.",
        "Analisis kewangan, perbankan pelaburan dan kerjaya awal kewangan.",
      ],
      channels: [
        "general",
        "investment-banking",
        "quant-research",
        "interviews",
      ],
    },
    {
      id: "ai",
      emoji: "🤖",
      name: ["Data & AI Malaysia", "Data & AI Malaysia"],
      desc: [
        "Data science, machine learning, analytics and responsible AI.",
        "Sains data, pembelajaran mesin, analitik dan AI bertanggungjawab.",
      ],
      channels: ["general", "data-science", "machine-learning", "projects"],
    },
  ];
  const names = {
    general: ["General", "Umum"],
    projects: ["Projects", "Projek"],
    hackathons: ["Hackathons", "Hackathon"],
    "skill-exchange": ["Skill exchange", "Pertukaran kemahiran"],
    applications: ["Applications", "Permohonan"],
    interviews: ["Interviews", "Temu duga"],
    "soc-careers": ["SOC careers", "Kerjaya SOC"],
    "incident-response": ["Incident response", "Respons insiden"],
    "ctf-learning": ["CTF learning", "Pembelajaran CTF"],
    "portfolio-feedback": ["Portfolio feedback", "Maklum balas portfolio"],
    opportunities: ["Opportunities", "Peluang"],
    "investment-banking": ["Investment banking", "Perbankan pelaburan"],
    "quant-research": ["Quantitative research", "Penyelidikan kuantitatif"],
    "data-science": ["Data science", "Sains data"],
    "machine-learning": ["Machine learning", "Pembelajaran mesin"],
  };
  let generation = 0,
    timer = null,
    active = null;
  const drafts = new Map(),
    lastChannels = new Map();
  const route = () => location.hash.slice(1).split("?")[0] || "/";
  const name = (room) => tr(...room.name);
  const channelName = (slug) => tr(...(names[slug] || [slug, slug]));
  const unavailable = () =>
    tr(
      "Community service is unavailable. Your draft has not been sent. Please try again later.",
      "Perkhidmatan komuniti tidak tersedia. Draf anda belum dihantar. Sila cuba lagi nanti.",
    );
  function render(path) {
    const room = rooms.find((r) => r.id === path.split("/")[2]);
    if (!room)
      return (
        title(
          tr("LEARN TOGETHER", "BELAJAR BERSAMA"),
          tr("Find your community", "Cari komuniti anda"),
          tr(
            "Join a topic, meet other members and share what you know.",
            "Sertai topik, temui ahli lain dan kongsi pengetahuan anda.",
          ),
        ) +
        `<div class="container page-content"><p class="muted">${tr("Conversations are written by signed-in members. New communities begin with no members or messages.", "Perbualan ditulis oleh ahli yang log masuk. Komuniti baharu bermula tanpa ahli atau mesej.")}</p><div class="community-catalogue grid-3">${rooms.map((r) => `<article class="server-card live-community-card"><span class="community-emoji" aria-hidden="true">${r.emoji}</span><h2>${esc(name(r))}</h2><p>${esc(tr(...r.desc))}</p><p class="small-note" data-community-stat="${r.id}">${tr("Member count unavailable", "Bilangan ahli belum tersedia")}</p><button class="btn btn-primary" data-community-open="${r.id}">${tr("Join community", "Sertai komuniti")}</button></article>`).join("")}</div><p data-community-error class="live-message error" hidden></p></div>`
      );
    return (
      title(
        tr("YOUR COMMUNITY", "KOMUNITI ANDA"),
        `${room.emoji} ${name(room)}`,
        tr(...room.desc),
      ) +
      `<div class="container page-content"><div class="inline-row justify-between mb-20"><a href="#/community" class="text-link">← ${tr("All communities", "Semua komuniti")}</a><button class="btn btn-outline btn-sm" data-community-leave="${room.id}" hidden>${tr("Leave community", "Keluar komuniti")}</button></div><div id="live-community-root" data-room="${room.id}"><div class="empty"><p>${tr("Checking your membership…", "Menyemak keahlian anda…")}</p></div></div></div>`
    );
  }
  function stop() {
    generation++;
    clearInterval(timer);
    timer = null;
    active = null;
  }
  function storeDraft() {
    if (active) {
      const input = document.getElementById("community-message");
      if (input) drafts.set(active.room.id + "/" + active.channel, input.value);
    }
  }
  function roomMarkup(room, channel) {
    return `<div class="server-layout live-chat-layout"><aside class="server-channels"><strong class="channel-title">${tr("CHANNELS", "SALURAN")}</strong>${room.channels.map((c) => `<button type="button" class="channel ${channel === c ? "active" : ""}" data-live-channel="${c}"># ${esc(channelName(c))}</button>`).join("")}</aside><section class="chat-pane"><div class="chat-top"># ${esc(channelName(channel))}<span class="small-note" id="community-sync" role="status">${tr("Connecting…", "Menyambung…")}</span></div><div class="chat-messages" id="live-messages" role="log" aria-live="polite" aria-relevant="additions text"></div><form class="chat-compose" id="live-chat-form"><label class="sr-only" for="community-message">${tr("Community message", "Mesej komuniti")}</label><input id="community-message" name="message" maxlength="2000" autocomplete="off" required placeholder="${tr("Write a message…", "Tulis mesej…")}" /><button class="btn btn-primary" type="submit">${tr("Send", "Hantar")}</button></form><p class="chat-error" data-live-message role="status" hidden></p></section></div>`;
  }
  async function loadStats(gen) {
    if (!window.API.enabled) return;
    try {
      const rows = await window.API.rpc("community_stats");
      if (gen !== generation) return;
      for (const r of rows || []) {
        const el = document.querySelector(
          `[data-community-stat="${r.community_id}"]`,
        );
        if (el)
          el.textContent = `${r.member_count} ${tr("members", "ahli")} · ${r.message_count} ${tr("messages", "mesej")}`;
      }
      if (signedIn()) {
        const memberships = await window.API.rest("community_memberships", {
          select: "community_id",
          filters: "user_id=eq." + window.API.userId(),
        });
        if (gen !== generation) return;
        for (const m of memberships || []) {
          const button = document.querySelector(
            `[data-community-open="${m.community_id}"]`,
          );
          if (button)
            button.textContent = tr("Enter community", "Masuk komuniti");
        }
      }
    } catch {
      if (gen !== generation) return;
      const el = document.querySelector("[data-community-error]");
      if (el) {
        el.hidden = false;
        el.textContent = tr(
          "Community membership is not available yet. Please try again later.",
          "Keahlian komuniti belum tersedia. Sila cuba lagi nanti.",
        );
      }
    }
  }
  async function membership(room) {
    if (!signedIn()) return false;
    const rows = await window.API.rest("community_memberships", {
      select: "community_id",
      filters: `community_id=eq.${room.id}&user_id=eq.${window.API.userId()}`,
    });
    return Boolean(rows?.length);
  }
  function confirmJoin(room) {
    if (!signedIn()) {
      location.hash = "#/login";
      return;
    }
    const dialog = showDialog(
      "community-enrolment",
      `<form id="join-community-form" data-room="${room.id}"><h2>${tr("Join", "Sertai")} ${esc(name(room))}?</h2><p>${esc(tr(...room.desc))}</p><p>${tr("Your profile name will appear beside your messages. Be respectful, avoid sharing private details and report abusive messages. No messages will be sent until you write them.", "Nama profil anda akan dipaparkan bersama mesej. Hormati orang lain, elakkan berkongsi maklumat peribadi dan laporkan mesej berunsur penderaan. Tiada mesej dihantar sehingga anda menulisnya.")}</p><p data-live-message role="status" hidden></p><div class="dialog-actions"><button type="button" class="btn btn-outline" data-close-dialog>${tr("Cancel", "Batal")}</button><button type="submit" class="btn btn-primary">${tr("Confirm & join", "Sahkan & sertai")}</button></div></form>`,
    );
    dialog
      .querySelector("[data-close-dialog]")
      .addEventListener("click", () => dialog.close());
  }
  async function enter(room, gen) {
    const root = document.getElementById("live-community-root");
    if (!root) return;
    if (!signedIn()) {
      root.innerHTML = `<div class="empty"><h2>${tr("Sign in to join the conversation", "Log masuk untuk menyertai perbualan")}</h2><p>${tr("Only enrolled members can read or send messages.", "Hanya ahli berdaftar boleh membaca atau menghantar mesej.")}</p><a class="btn btn-primary" href="#/login">${tr("Log in", "Log masuk")}</a></div>`;
      return;
    }
    try {
      const joined = await membership(room);
      if (gen !== generation) return;
      if (!joined) {
        root.innerHTML = `<div class="empty"><h2>${tr("Join before entering", "Sertai sebelum masuk")}</h2><p>${tr("Confirm enrolment to read and take part in this community.", "Sahkan penyertaan untuk membaca dan menyertai komuniti ini.")}</p><button class="btn btn-primary" data-community-open="${room.id}">${tr("Join community", "Sertai komuniti")}</button></div>`;
        return;
      }
      const leave = document.querySelector("[data-community-leave]");
      if (leave) leave.hidden = false;
      const channel = room.channels.includes(lastChannels.get(room.id))
        ? lastChannels.get(room.id)
        : room.channels[0];
      active = { room, channel, signature: "", sending: false, loading: false };
      root.innerHTML = roomMarkup(room, channel);
      const input = document.getElementById("community-message");
      input.value = drafts.get(room.id + "/" + channel) || "";
      input.focus({ preventScroll: true });
      await refreshMessages(gen, true);
      if (gen === generation)
        timer = setInterval(() => {
          if (!document.hidden) refreshMessages(gen);
        }, 3000);
    } catch {
      if (gen !== generation) return;
      root.innerHTML = `<div class="empty"><p>${unavailable()}</p><button class="btn btn-outline" data-community-retry>${tr("Retry", "Cuba lagi")}</button></div>`;
    }
  }
  async function refreshMessages(gen, forceBottom = false) {
    if (gen !== generation || !active) return;
    if (active.loading) {
      if (forceBottom) active.refreshAgain = true;
      return;
    }
    const context = active;
    context.loading = true;
    try {
      const rows = await window.API.rest("community_messages", {
        select: "id,community_id,channel,user_id,author_name,body,created_at",
        filters: `community_id=eq.${context.room.id}&channel=eq.${context.channel}`,
        order: "created_at.desc,id.desc",
        limit: 100,
      });
      if (gen !== generation || context !== active) return;
      const box = document.getElementById("live-messages");
      if (!box) return;
      const signature = JSON.stringify(rows);
      if (signature !== context.signature) {
        const nearBottom =
          box.scrollHeight - box.scrollTop - box.clientHeight < 100;
        context.signature = signature;
        box.innerHTML = rows.length
          ? [...rows]
              .reverse()
              .map(
                (m) =>
                  `<article class="chat-message" data-message-id="${esc(m.id)}"><span class="chat-avatar" aria-hidden="true">${esc(m.author_name.slice(0, 2).toUpperCase())}</span><div class="message-copy"><strong>${esc(m.author_name)}</strong><time datetime="${esc(m.created_at)}">${esc(date(m.created_at))}</time><p data-no-translate>${esc(m.body)}</p><button type="button" class="message-action" ${m.user_id === window.API.userId() ? `data-message-delete="${esc(m.id)}"` : `data-message-report="${esc(m.id)}"`}>${m.user_id === window.API.userId() ? tr("Delete", "Padam") : tr("Report", "Laporkan")}</button></div></article>`,
              )
              .join("")
          : `<div class="chat-empty"><h3>${tr("Start the conversation", "Mulakan perbualan")}</h3><p>${tr("No messages yet. Introduce yourself or ask a thoughtful question.", "Belum ada mesej. Perkenalkan diri atau ajukan soalan yang bernas.")}</p></div>`;
        if (forceBottom || nearBottom) box.scrollTop = box.scrollHeight;
      }
      const status = document.getElementById("community-sync");
      if (status)
        status.textContent = tr(
          "Updates every 3 seconds",
          "Dikemas kini setiap 3 saat",
        );
    } catch {
      if (gen !== generation || context !== active) return;
      const status = document.getElementById("community-sync");
      if (status)
        status.textContent = tr(
          "Connection lost — retrying",
          "Sambungan terputus — mencuba semula",
        );
    } finally {
      context.loading = false;
      if (context.refreshAgain && context === active && gen === generation) {
        context.refreshAgain = false;
        refreshMessages(gen, true);
      }
    }
  }
  document.addEventListener("scholarku:render", () => {
    storeDraft();
    stop();
    document.getElementById("community-enrolment")?.close();
    const current = route();
    if (!current.startsWith("/community")) return;
    const gen = generation;
    const room = rooms.find((r) => r.id === current.split("/")[2]);
    if (room) enter(room, gen);
    else loadStats(gen);
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && active) refreshMessages(generation);
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "community-message") storeDraft();
  });
  document.addEventListener("submit", async (e) => {
    if (e.target.id === "join-community-form") {
      e.preventDefault();
      const form = e.target,
        room = rooms.find((r) => r.id === form.dataset.room);
      const button = form.querySelector('[type="submit"]');
      button.disabled = true;
      try {
        await window.API.rpc("join_community", { p_community_id: room.id });
        form.closest("dialog").close();
        if (route() === "/community/" + room.id) window.scholarkuRender();
        else location.hash = "#/community/" + room.id;
      } catch {
        message(
          form,
          tr(
            "Unable to join. Please try again.",
            "Tidak dapat menyertai. Sila cuba lagi.",
          ),
        );
        button.disabled = false;
      }
      return;
    }
    if (e.target.id !== "live-chat-form") return;
    e.preventDefault();
    if (!active || active.sending || !signedIn()) return;
    const input = document.getElementById("community-message"),
      body = input.value.trim();
    if (!body) return;
    const context = active,
      gen = generation;
    context.sending = true;
    const button = e.target.querySelector("button");
    button.disabled = true;
    input.readOnly = true;
    const pending =
      context.pendingMessage?.body === body
        ? context.pendingMessage
        : { id: crypto.randomUUID(), body };
    context.pendingMessage = pending;
    try {
      try {
        await window.API.rest("community_messages", {
          method: "POST",
          body: {
            id: pending.id,
            community_id: context.room.id,
            channel: context.channel,
            user_id: window.API.userId(),
            body,
          },
        });
      } catch (error) {
        const existing = await window.API.rest("community_messages", {
          select: "id",
          filters: "id=eq." + pending.id,
        });
        if (!existing?.length) throw error;
      }
      if (gen !== generation || context !== active) return;
      context.pendingMessage = null;
      input.value = "";
      drafts.delete(context.room.id + "/" + context.channel);
      document.querySelector(".chat-error").hidden = true;
      await refreshMessages(gen, true);
    } catch (error) {
      if (gen === generation)
        message(
          e.target.parentElement,
          /Please wait before sending/.test(error.message || "")
            ? tr(
                "You are sending messages too quickly. Wait a few seconds and try again.",
                "Anda menghantar mesej terlalu cepat. Tunggu beberapa saat dan cuba lagi.",
              )
            : unavailable(),
        );
    } finally {
      context.sending = false;
      if (gen === generation) {
        button.disabled = false;
        input.readOnly = false;
        input.focus({ preventScroll: true });
      }
    }
  });
  document.addEventListener("click", async (e) => {
    const open = e.target.closest("[data-community-open]");
    if (open) {
      const room = rooms.find((r) => r.id === open.dataset.communityOpen);
      open.disabled = true;
      try {
        if (await membership(room)) location.hash = "#/community/" + room.id;
        else confirmJoin(room);
      } catch {
        notify(unavailable());
      } finally {
        open.disabled = false;
      }
      return;
    }
    const channel = e.target.closest("[data-live-channel]");
    if (channel && active) {
      storeDraft();
      const room = active.room;
      generation++;
      const gen = generation;
      clearInterval(timer);
      active = {
        room,
        channel: channel.dataset.liveChannel,
        signature: "",
        sending: false,
        loading: false,
      };
      lastChannels.set(room.id, active.channel);
      document.getElementById("live-community-root").innerHTML = roomMarkup(
        room,
        active.channel,
      );
      const input = document.getElementById("community-message");
      input.value = drafts.get(room.id + "/" + active.channel) || "";
      input.focus({ preventScroll: true });
      await refreshMessages(gen, true);
      if (gen === generation)
        timer = setInterval(() => {
          if (!document.hidden) refreshMessages(gen);
        }, 3000);
      return;
    }
    if (e.target.closest("[data-community-retry]")) {
      window.scholarkuRender();
      return;
    }
    const leave = e.target.closest("[data-community-leave]");
    if (
      leave &&
      confirm(
        tr(
          "Leave this community? Your previous messages will remain.",
          "Keluar daripada komuniti ini? Mesej terdahulu anda akan kekal.",
        ),
      )
    ) {
      try {
        await window.API.rest("community_memberships", {
          method: "DELETE",
          filters: `community_id=eq.${leave.dataset.communityLeave}&user_id=eq.${window.API.userId()}`,
        });
        location.hash = "#/community";
      } catch {
        notify(unavailable());
      }
      return;
    }
    const remove = e.target.closest("[data-message-delete]");
    if (remove && confirm(tr("Delete your message?", "Padam mesej anda?"))) {
      try {
        await window.API.rest("community_messages", {
          method: "DELETE",
          filters: "id=eq." + remove.dataset.messageDelete,
        });
        await refreshMessages(generation);
      } catch {
        notify(unavailable());
      }
      return;
    }
    const report = e.target.closest("[data-message-report]");
    if (report) {
      const reason = prompt(
        tr(
          "Describe the concern (at least 5 characters).",
          "Terangkan masalah (sekurang-kurangnya 5 aksara).",
        ),
      );
      if (!reason || reason.trim().length < 5) return;
      try {
        await window.API.rest("community_reports", {
          method: "POST",
          body: {
            message_id: report.dataset.messageReport,
            user_id: window.API.userId(),
            reason: reason.trim(),
          },
        });
        notify(
          tr(
            "Report submitted for administrator review.",
            "Laporan dihantar untuk semakan pentadbir.",
          ),
        );
      } catch {
        notify(
          tr(
            "Unable to submit the report. It may already be reported.",
            "Tidak dapat menghantar laporan. Mesej ini mungkin telah dilaporkan.",
          ),
        );
      }
    }
  });
  window.ScholarkuCommunity = { render, rooms };
})();
