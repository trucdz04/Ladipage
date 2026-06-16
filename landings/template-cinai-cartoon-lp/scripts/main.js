/* main.js — CinAI lean LP interactions
   KISS: pricing toggle · FAQ accordion · scroll-triggered countdown · reveal-on-scroll.
   No dependencies. Animate transform/opacity only. */
(function () {
  "use strict";

  /* ---------- 1. Pricing Monthly/Yearly toggle ---------- */
  function initBillingToggle() {
    var sw = document.getElementById("billing-switch");
    if (!sw) return;
    var labels = document.querySelectorAll(".toggle-label");

    var plans = document.getElementById("plans");

    function apply(period) {
      var yearly = period === "yearly";
      sw.setAttribute("aria-checked", String(yearly));
      labels.forEach(function (l) {
        l.classList.toggle("active", l.getAttribute("data-period") === period);
      });
      document.querySelectorAll("[data-monthly][data-yearly]").forEach(function (el) {
        var val = el.getAttribute(yearly ? "data-yearly" : "data-monthly");
        if (val != null) el.textContent = val;
      });
      // Drive anchored old-price + save-pill visibility (only in yearly)
      if (plans) plans.setAttribute("data-billing", period);
    }

    sw.addEventListener("click", function () {
      apply(sw.getAttribute("aria-checked") === "true" ? "monthly" : "yearly");
    });
    apply("yearly"); // default Yearly (showcase $19/$39)
  }

  /* ---------- 2. FAQ accordion ---------- */
  function initFaq() {
    document.querySelectorAll(".faq-q").forEach(function (btn) {
      var item = btn.closest(".faq-item");
      var ans = item.querySelector(".faq-a");
      btn.addEventListener("click", function () {
        var open = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
        ans.style.maxHeight = open ? ans.scrollHeight + "px" : null;
      });
    });
  }

  /* ---------- 3. Countdown (kích hoạt khi cuộn tới pricing) ---------- */
  function initCountdown() {
    var el = document.getElementById("countdown");
    var pricing = document.getElementById("pricing");
    if (!el || !pricing) return;

    var DURATION_MS = 47 * 60 * 60 * 1000; // 47h founder window
    var KEY = "cinai_lp_deadline";
    var started = false;

    function pad(n) { return n < 10 ? "0" + n : "" + n; }

    function tick(deadline) {
      var diff = deadline - Date.now();
      if (diff <= 0) { el.textContent = "00:00:00"; return false; }
      var h = Math.floor(diff / 3.6e6);
      var m = Math.floor((diff % 3.6e6) / 6e4);
      var s = Math.floor((diff % 6e4) / 1e3);
      el.textContent = pad(h) + ":" + pad(m) + ":" + pad(s);
      return true;
    }

    function start() {
      if (started) return;
      started = true;
      var deadline = Number(sessionStorage.getItem(KEY));
      if (!deadline || isNaN(deadline) || deadline < Date.now()) {
        deadline = Date.now() + DURATION_MS;
        try { sessionStorage.setItem(KEY, String(deadline)); } catch (e) { /* ignore */ }
      }
      tick(deadline);
      var id = setInterval(function () { if (!tick(deadline)) clearInterval(id); }, 1000);
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { start(); io.disconnect(); } });
      }, { threshold: 0.25 });
      io.observe(pricing);
    } else {
      start();
    }
  }

  /* ---------- 4. Reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 5. Lead-magnet form (email -> n8n webhook -> nurture) ---------- */
  function initLeadForm() {
    var form = document.getElementById("lead-form");
    if (!form) return;
    var msg = document.getElementById("lead-msg");
    var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    function setMsg(text, type) { msg.textContent = text; msg.className = "lead-msg " + (type || ""); }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Honeypot: nếu bot điền field ẩn -> bỏ qua im lặng
      if (form.company && form.company.value) return;

      var email = (form.email.value || "").trim();
      var name = (form.name.value || "").trim();
      if (!EMAIL_RE.test(email)) {
        form.email.setAttribute("aria-invalid", "true");
        setMsg("Please enter a valid email address.", "error");
        form.email.focus();
        return;
      }
      form.email.removeAttribute("aria-invalid");

      var btn = form.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = "Sending…";

      var CFG = window.CINAI_CONFIG || {};
      var GIFT = "1000_workflow_templates";

      // (1) TRACKING — Lead qua cinaiTrack (Browser Pixel + Server CAPI cùng event_id để dedup, + Lark).
      try {
        if (typeof window.cinaiTrack === "function") {
          window.cinaiTrack("Lead", { email: email, name: name, content_name: GIFT });
        } else if (window.fbq) {
          window.fbq("track", "Lead", { content_name: GIFT });
        }
      } catch (e2) { /* noop */ }
      try { (window.dataLayer = window.dataLayer || []).push({ event: "lead", form: GIFT }); } catch (e3) { /* noop */ }

      // (2) NURTURE — enroll vào chuỗi email (webhook n8n riêng). Placeholder/{{}} -> demo mode (không gọi mạng).
      var nurture = CFG.NURTURE_WEBHOOK || form.getAttribute("data-webhook") || "";
      var isPlaceholder = !nurture || nurture.indexOf("{{") !== -1;
      var body = JSON.stringify({
        name: name, email: email, gift: GIFT, campaign: "nurture_default",
        source: "lead-magnet-1000-templates", page: location.href
      });
      var request = isPlaceholder
        ? Promise.resolve()
        : fetch(nurture, { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: body, keepalive: true });

      request
        .then(function () {
          var fields = form.querySelector(".lead-fields");
          var fine = form.querySelector(".lead-fineprint");
          if (fields) fields.style.display = "none";
          if (fine) fine.style.display = "none";
          setMsg("Check your inbox — your 1,000 templates are on the way. 🎬", "success");
        })
        .catch(function () {
          btn.disabled = false;
          btn.innerHTML = original;
          setMsg("Something went wrong. Please try again.", "error");
        });
    });
  }

  /* ---------- init ---------- */
  function init() {
    initBillingToggle();
    initFaq();
    initCountdown();
    initReveal();
    initLeadForm();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
