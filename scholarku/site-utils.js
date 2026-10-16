(() => {
  "use strict";
  const tr = (en, ms) => (window.ScholarkuI18n.language === "bm" ? ms : en);
  const esc = (value) =>
    String(value ?? "").replace(
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
  const signedIn = () =>
    Boolean(window.API.enabled && window.API.session && window.API.userId());
  const date = (value) =>
    value
      ? new Intl.DateTimeFormat(
          window.ScholarkuI18n.language === "bm" ? "ms-MY" : "en-MY",
          { dateStyle: "medium", timeStyle: "short" },
        ).format(new Date(value))
      : "";
  function notify(text) {
    const el = document.getElementById("toast");
    el.textContent = text;
    el.hidden = false;
    clearTimeout(window.__toast);
    window.__toast = setTimeout(() => (el.hidden = true), 4500);
  }
  function showDialog(id, content) {
    document.getElementById(id)?.remove();
    const el = document.createElement("dialog");
    el.id = id;
    el.className = "live-dialog";
    el.innerHTML = content;
    document.body.append(el);
    el.addEventListener("close", () => el.remove(), { once: true });
    el.showModal();
    return el;
  }
  function message(container, text, kind = "error") {
    const el = container.querySelector("[data-live-message]");
    if (el) {
      el.textContent = text;
      el.className = "live-message " + kind;
      el.hidden = false;
    }
  }
  const title = (eyebrow, heading, description) =>
    `<section class="page-hero"><div class="container"><div class="eyebrow">${esc(eyebrow)}</div><div class="page-heading"><h1>${esc(heading)}</h1><p>${esc(description)}</p></div></div></section>`;
  const externalIcon =
    '<svg class="external-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>';
  window.SK = {
    tr,
    esc,
    signedIn,
    date,
    notify,
    showDialog,
    message,
    title,
    externalIcon,
  };
})();
