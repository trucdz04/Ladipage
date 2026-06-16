/* ============================================================
   main.js — wiring tương tác cho template CinAI.tv (AI Video & Workflow Studio)
   (theo extraction/behavior-map.md + logic-generator-panel.md)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- DATA (content model — SYSTEM-XRAY.md phần 5) ---------- */
  // Link đích chung — đưa khách sang ứng dụng CinAI.tv
  var CINAI = "https://cinai.tv";
  var CINAI_APP = "https://cinai.tv/login";

  // Community = video demo CinAI (tải local, hợp bản quyền). Click tile → mở CinAI.tv.
  // ar tạo bố cục masonry cao-thấp; round-robin 4 cột nên lề trên các cột bằng nhau.
  const COMMUNITY = [
    { v: "assets/media/cinai-tvc.mp4", ar: "3 / 4" },
    { v: "assets/media/cinai-banhang.mp4", ar: "16 / 9" },
    { v: "assets/media/cinai-beauty.mp4", ar: "16 / 9" },
    { v: "assets/media/cinai-bds.mp4", ar: "3 / 4" },
    { v: "assets/media/cinai-ecommerce.mp4", ar: "4 / 3" },
    { v: "assets/media/cinai-fnb.mp4", ar: "4 / 3" },
    { v: "assets/media/cinai-giaoduc.mp4", ar: "3 / 4" },
    { v: "assets/media/cinai-thuonghieu.mp4", ar: "16 / 9" },
    { v: "assets/media/vid-1.mp4", ar: "4 / 3" },
    { v: "assets/media/vid-2.mp4", ar: "3 / 4" },
    { v: "assets/media/vid-3.mp4", ar: "16 / 9" },
    { v: "assets/media/vid-4.mp4", ar: "4 / 3" },
  ];

  // Model = các model AI mà CinAI.tv kết nối chính thức ("Connect 100+ AI models").
  // Thumbnail = logo hãng chính thức trên nền gradient thương hiệu. Read more → CinAI.tv.
  // Mô tả (desc) lấy theo ngôn ngữ từ window.CinaiI18n.modelDesc(name).
  const MODELS = [
    { logo: "assets/cinai/logos/bytedance.svg",   maker: "ByteDance",         grad: "linear-gradient(135deg,#0b1f3a,#1aa7c0)", name: "Seedance 2.0" },
    { logo: "assets/cinai/logos/kuaishou.svg",    maker: "Kuaishou",          grad: "linear-gradient(135deg,#3a0d12,#ff5a1f)", name: "Kling V3 Pro" },
    { logo: "assets/cinai/logos/google.svg",      maker: "Google DeepMind",   grad: "linear-gradient(135deg,#0b1f3a,#4285f4)", name: "Veo 3.1" },
    { logo: "assets/cinai/logos/minimax.svg",     maker: "MiniMax",           grad: "linear-gradient(135deg,#2a1148,#ff5c39)", name: "Hailuo (MiniMax)" },
    { logo: "assets/cinai/logos/googlegemini.svg",maker: "Google Gemini",     grad: "linear-gradient(135deg,#1b2a6b,#9b72cb,#d96570)", name: "Nano Banana" },
    { logo: "assets/cinai/logos/openai.svg",      maker: "OpenAI",            grad: "linear-gradient(135deg,#05231a,#10a37f)", name: "GPT Image 2" },
    { logo: "assets/cinai/logos/googlegemini.svg",maker: "Google Gemini",     grad: "linear-gradient(135deg,#1b2a6b,#4285f4,#9b72cb)", name: "Gemini Omni" },
    { logo: "assets/cinai/logos/anthropic.svg",   maker: "Anthropic",         grad: "linear-gradient(135deg,#2b150d,#d97757)", name: "Opus 4.8" },
  ];

  // Helper i18n an toàn (nếu i18n.js chưa nạp thì fallback văn bản gốc).
  var I18N = window.CinaiI18n || {
    lang: "en",
    modelDesc: function () { return ""; },
    faq: function () { return []; },
    t: function () { return ""; },
  };

  /* ---------- RENDER ---------- */
  function renderCommunity() {
    const wrap = document.getElementById("community-grid");
    if (!wrap) return;
    var cols = window.matchMedia("(min-width:1024px)").matches ? 4
             : window.matchMedia("(min-width:640px)").matches ? 2 : 1;
    var columns = [];
    for (var i = 0; i < cols; i++) columns.push([]);
    COMMUNITY.forEach(function (c, idx) { columns[idx % cols].push(c); });
    wrap.innerHTML = columns.map(function (col) {
      return '<div class="community-col">' + col.map(function (c) {
        return '<a class="v-card" href="' + CINAI + '" target="_blank" rel="noopener" style="aspect-ratio:' + c.ar + '">' +
          '<video autoplay loop muted playsinline preload="metadata" src="' + c.v + '"></video></a>';
      }).join("") + '</div>';
    }).join("");
  }

  function renderModels() {
    const wrap = document.getElementById("model-grid");
    if (!wrap) return;
    var readMore = I18N.t("models.readmore") || "Read more";
    wrap.innerHTML = MODELS.map(function (m) {
      return '<article class="model-tile reveal">' +
        '<div class="thumb model-thumb" style="background:' + m.grad + '">' +
        '<img class="thumb-logo" src="' + m.logo + '" alt="" loading="lazy" />' +
        '<span class="thumb-maker" aria-hidden="true">' + m.maker + '</span></div>' +
        '<div class="body"><h3>' + m.name + '</h3><p>' + I18N.modelDesc(m.name) + '</p>' +
        '<div class="model-foot"><a class="model-readmore" href="' + CINAI + '" target="_blank" rel="noopener" data-cta="model">' + readMore +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a></div>' +
        '</div></article>';
    }).join("");
    observeReveal(wrap.querySelectorAll(".reveal"));
  }

  function renderFaq() {
    const wrap = document.getElementById("faq-wrap");
    if (!wrap) return;
    wrap.innerHTML = I18N.faq().map(function (f) {
      return '<details class="faq-item"><summary class="faq-q">' + f.q +
        '<svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></summary>' +
        '<div class="faq-a">' + f.a + "</div></details>";
    }).join("");
  }

  /* ---------- PANEL: single-select groups ---------- */
  function wireSingleSelect(selector, attr) {
    document.querySelectorAll(selector).forEach(function (group) {
      group.querySelectorAll("[" + attr + "]").forEach(function (item) {
        item.addEventListener("click", function () {
          group.querySelectorAll("[" + attr + "]").forEach(function (i) { i.setAttribute(attr, "false"); });
          item.setAttribute(attr, "true");
        });
      });
    });
  }

  function wireTabs() {
    const tablist = document.querySelector('[role="tablist"]');
    if (!tablist) return;
    const tabs = tablist.querySelectorAll('[role="tab"]');
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
        tab.setAttribute("aria-selected", "true");
        // Tab "Text to Video" ẩn dropzone upload
        const dz = document.querySelector('[data-tab-panel="image"]');
        if (dz) dz.style.display = /Text to Video/.test(tab.textContent) ? "none" : "flex";
      });
    });
  }

  /* ---------- MODAL ---------- */
  function wireModal() {
    const modal = document.getElementById("login-modal");
    if (!modal) return;
    let lastFocus = null;
    function open(e) {
      if (e) e.preventDefault();
      lastFocus = document.activeElement;
      modal.classList.add("is-open");
      const f = modal.querySelector("input, button");
      if (f) f.focus();
    }
    function close() { modal.classList.remove("is-open"); if (lastFocus) lastFocus.focus(); }
    document.querySelectorAll("[data-open-modal]").forEach(function (el) { el.addEventListener("click", open); });
    modal.querySelectorAll("[data-close-modal]").forEach(function (el) { el.addEventListener("click", close); });
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    window.__openLoginModal = open;
  }

  /* ---------- Header dropdown a11y ---------- */
  function wireDropdowns() {
    document.querySelectorAll(".has-menu > button").forEach(function (btn) {
      const parent = btn.parentElement;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const open = parent.matches(":hover") || btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
      });
    });
  }

  /* ---------- Mobile menu: hamburger mở/đóng panel xổ xuống (<900px) ---------- */
  function wireMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;
    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    toggle.addEventListener("click", function () {
      setOpen(!menu.classList.contains("is-open"));
    });
    // chọn link xong thì đóng menu
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    // Esc đóng menu
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    // về desktop (≥900px) thì đảm bảo menu đóng
    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width:900px)").matches) setOpen(false);
    });
  }

  /* ---------- Float CTA: hiện nút góc phải khi cuộn qua header ---------- */
  function wireFloatCta() {
    const cta = document.getElementById("float-cta");
    if (!cta) return;
    const header = document.querySelector(".header");
    const threshold = header ? header.offsetHeight : 80;
    function update() {
      const show = window.scrollY > threshold;
      cta.classList.toggle("is-visible", show);
      cta.setAttribute("aria-hidden", String(!show));
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- PRICING: toggle Monthly / Yearly ---------- */
  function wireBilling() {
    const grid = document.getElementById("pricing-grid");
    const opts = document.querySelectorAll(".billing-toggle .bt-opt");
    if (!grid || !opts.length) return;

    function setBilling(mode) {
      grid.setAttribute("data-billing-state", mode);
      opts.forEach(function (o) {
        var on = o.getAttribute("data-billing") === mode;
        o.classList.toggle("is-active", on);
        o.setAttribute("aria-pressed", String(on));
      });
      // đổi số tiền hiển thị theo gói
      grid.querySelectorAll(".pc-amount").forEach(function (el) {
        var v = el.getAttribute("data-price-" + mode);
        if (v) el.textContent = v;
      });
      // đổi "giá gốc" gạch ngang theo gói (minh hoạ ưu đãi 56%)
      grid.querySelectorAll(".pc-anchor").forEach(function (el) {
        var v = el.getAttribute("data-anchor-" + mode);
        if (v) el.textContent = v;
      });
      // hiện đúng dòng ghi chú chu kỳ thanh toán
      grid.querySelectorAll("[data-billnote-monthly]").forEach(function (el) {
        el.style.display = mode === "monthly" ? "block" : "none";
      });
      grid.querySelectorAll("[data-billnote-yearly]").forEach(function (el) {
        el.style.display = mode === "yearly" ? "block" : "none";
      });
    }

    opts.forEach(function (o) {
      o.addEventListener("click", function () { setBilling(o.getAttribute("data-billing")); });
    });
    // mặc định Yearly (theo source-of-truth cinai-pricing.json)
    setBilling(grid.getAttribute("data-billing-state") || "yearly");
  }

  /* ---------- Scroll reveal ---------- */
  function observeReveal(nodes) {
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-visible"); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderCommunity();
    renderModels();
    renderFaq();
    wireSingleSelect('[role="radiogroup"]', "aria-checked");
    wireSingleSelect('[role="group"]', "aria-pressed");
    wireTabs();
    wireModal();
    wireDropdowns();
    wireMobileMenu();
    wireFloatCta();
    wireBilling();
    observeReveal(document.querySelectorAll(".reveal"));

    // Đổi ngôn ngữ → render lại nội dung động (Models/FAQ) theo ngôn ngữ mới.
    document.addEventListener("cinai:langchange", function () {
      renderModels();
      renderFaq();
    });
    // số cột masonry đổi theo breakpoint → render lại (debounce)
    var rT;
    var lastCols = window.matchMedia("(min-width:1024px)").matches ? 4 : window.matchMedia("(min-width:640px)").matches ? 2 : 1;
    window.addEventListener("resize", function () {
      clearTimeout(rT);
      rT = setTimeout(function () {
        var cols = window.matchMedia("(min-width:1024px)").matches ? 4 : window.matchMedia("(min-width:640px)").matches ? 2 : 1;
        if (cols !== lastCols) { lastCols = cols; renderCommunity(); }
      }, 200);
    });
  });
})();
