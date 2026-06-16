/* ============================================================
   tracking.js — đo lường Meta 4 lớp (Browser Pixel + Server CAPI
   qua n8n + EMQ + Deduplication). Theo skill meta-tracking.
   Tự bắn: ViewContent (load) · Lead (submit form data-track-lead)
   · Click_CTA (nút data-cta, chuyển fbclid/utm sang MAIN_DOMAIN).
   ============================================================ */
(function () {
  "use strict";
  var CFG = window.TRACKING_CONFIG || {};
  if (!CFG.ENABLED) {
    console.info("[tracking] DISABLED (set TRACKING_CONFIG.ENABLED=true + điền PIXEL_ID/N8N_WEBHOOK để bật).");
  }

  /* ---------- helpers ---------- */
  function uuid() {
    return "evt-" + Math.random().toString(16).slice(2) + "-" + (window.performance ? Math.round(performance.now()) : 0);
  }
  function getParam(name) {
    return new URLSearchParams(location.search).get(name) || "";
  }
  function getCookie(name) {
    var m = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
    return m ? m.pop() : "";
  }
  function setCookie(name, value, days) {
    var d = new Date(); d.setTime(d.getTime() + days * 864e5);
    var domain = CFG.ROOT_COOKIE ? ";domain=" + CFG.ROOT_COOKIE : "";
    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/" + domain;
  }

  // _fbc first-party từ fbclid (EMQ ↑)
  function ensureFbc() {
    var fbclid = getParam("fbclid");
    if (fbclid && !getCookie("_fbc")) {
      setCookie("_fbc", "fb.1." + Date.now() + "." + fbclid, 90);
    }
  }

  /* ---------- 1) Meta Pixel base (Browser layer) ---------- */
  function loadPixel() {
    if (!CFG.ENABLED || !CFG.PIXEL_ID || CFG.PIXEL_ID === "YOUR_PIXEL_ID") return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", CFG.PIXEL_ID);
  }

  /* ---------- 2) Server layer (CAPI qua n8n) — cùng event_id → dedup ---------- */
  function sendServer(eventName, eventId, custom) {
    if (!CFG.ENABLED || !CFG.N8N_WEBHOOK || /YOUR_N8N_HOST/.test(CFG.N8N_WEBHOOK)) return;
    var payload = {
      event: eventName,
      event_id: eventId,             // dedup với Pixel
      event_source_url: location.href,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
      fbclid: getParam("fbclid"),
      utm: {
        source: getParam("utm_source"), medium: getParam("utm_medium"),
        campaign: getParam("utm_campaign"), content: getParam("utm_content"), term: getParam("utm_term"),
      },
      custom: custom || {},
      ts: Date.now(),
    };
    try {
      navigator.sendBeacon
        ? navigator.sendBeacon(CFG.N8N_WEBHOOK, new Blob([JSON.stringify(payload)], { type: "application/json" }))
        : fetch(CFG.N8N_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true });
    } catch (e) { /* không chặn UI */ }
  }

  function track(eventName, custom, userData) {
    var eventId = uuid();
    if (window.fbq) window.fbq("track", eventName, custom || {}, { eventID: eventId });
    sendServer(eventName, eventId, Object.assign({}, custom, userData));
    return eventId;
  }

  /* ---------- 3) Sự kiện tự bắn ---------- */
  // ViewContent khi load
  function fireViewContent() {
    track("ViewContent", { content_name: "AI Video Generator", content_category: "landing" });
  }

  // Lead khi submit form data-track-lead (lead-magnet / signup)
  function wireLeadForms() {
    document.querySelectorAll("[data-track-lead]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = (form.querySelector('input[type="email"]') || {}).value || "";
        track("Lead", { content_name: form.getAttribute("data-track-lead") || "signup" }, { email: email });
        // n8n sẽ gửi tài liệu (lead-magnet) + lưu Lark + CAPI CompleteRegistration
        form.reset();
        alert("Cảm ơn! (demo) — n8n sẽ gửi tài liệu & lưu khách. Bật TRACKING_CONFIG.ENABLED để chạy thật.");
      });
    });
  }

  // Click_CTA: nối fbclid/utm/fbp/fbc sang MAIN_DOMAIN
  function wireCTAs() {
    document.querySelectorAll("[data-cta]").forEach(function (el) {
      el.addEventListener("click", function () {
        var params = ["fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
          .map(function (k) { var v = getParam(k); return v ? k + "=" + encodeURIComponent(v) : ""; })
          .filter(Boolean);
        var fbp = getCookie("_fbp"), fbc = getCookie("_fbc");
        if (fbp) params.push("_fbp=" + fbp);
        if (fbc) params.push("_fbc=" + fbc);
        track("Click_CTA", { cta: el.getAttribute("data-cta"), dest: CFG.MAIN_DOMAIN, query: params.join("&") });
      });
    });
  }

  /* ---------- INIT ---------- */
  ensureFbc();
  loadPixel();
  document.addEventListener("DOMContentLoaded", function () {
    fireViewContent();
    wireLeadForms();
    wireCTAs();
  });
})();
