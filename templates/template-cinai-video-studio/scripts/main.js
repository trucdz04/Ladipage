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
  const MODELS = [
    { logo: "assets/cinai/logos/bytedance.svg",   maker: "ByteDance",         grad: "linear-gradient(135deg,#0b1f3a,#1aa7c0)", name: "Seedance 2.0", desc: "CinAI's flagship cinematic engine — multi-shot sequences, native audio sync, and crisp 2K output." },
    { logo: "assets/cinai/logos/kuaishou.svg",    maker: "Kuaishou",          grad: "linear-gradient(135deg,#3a0d12,#ff5a1f)", name: "Kling V3 Pro", desc: "Professional-grade motion and multi-shot storytelling, up to 15-second clips with consistent characters." },
    { logo: "assets/cinai/logos/google.svg",      maker: "Google DeepMind",   grad: "linear-gradient(135deg,#0b1f3a,#4285f4)", name: "Veo 3.1", desc: "Google DeepMind's Veo — fast, budget-friendly clips with dialogue and ambient sound baked in." },
    { logo: "assets/cinai/logos/minimax.svg",     maker: "MiniMax",           grad: "linear-gradient(135deg,#2a1148,#ff5c39)", name: "Hailuo (MiniMax)", desc: "Rapid text- and image-to-video generation, great for quick social and ad iterations." },
    { logo: "assets/cinai/logos/googlegemini.svg",maker: "Google Gemini",     grad: "linear-gradient(135deg,#1b2a6b,#9b72cb,#d96570)", name: "Nano Banana", desc: "Lightning-fast image model for product shots and reference frames before you animate." },
    { logo: "assets/cinai/logos/openai.svg",      maker: "OpenAI",            grad: "linear-gradient(135deg,#05231a,#10a37f)", name: "GPT Image 2", desc: "Premium prompt-to-image model for storyboards, key art, and on-brand visual concepts." },
    { logo: "assets/cinai/logos/googlegemini.svg",maker: "Google Gemini",     grad: "linear-gradient(135deg,#1b2a6b,#4285f4,#9b72cb)", name: "Gemini Omni", desc: "All-in-one multimodal model for blending image, motion, and audio in a single workflow." },
    { logo: "assets/cinai/logos/anthropic.svg",   maker: "Anthropic",         grad: "linear-gradient(135deg,#2b150d,#d97757)", name: "Opus 4.8", desc: "Reasoning model that scripts, plans, and orchestrates your creative pipeline end to end." },
  ];

  const FAQ = [
    { q: "What is CinAI.tv?", a: "CinAI.tv is an AI video and workflow studio. You can connect 100+ AI models, automate creative pipelines, and remix community templates to turn any idea, image, or prompt into a finished video." },
    { q: "Which AI models can I use?", a: "CinAI connects 100+ models including Seedance 2.0, Kling, Veo 3.1, Hailuo, GPT Image 2, Nano Banana, Omni, and Opus 4.8 — pick the right model for each step of your pipeline, all in one place." },
    { q: "How long does it take to generate a video?", a: "Most clips are ready within 30-60 seconds depending on the model, resolution, and length. Longer or higher-resolution renders take a little more time, and you'll be notified the moment yours is ready." },
    { q: "Can I automate my creative workflow?", a: "Yes. CinAI lets you build reusable pipelines that chain models together — script, image, motion, and audio — so you can run an entire creative process automatically and share it as a template." },
    { q: "How do I get the best results?", a: "Write detailed prompts describing the motion, style, and scene you want, and start from a clean high-quality image for image-to-video. The more context you give, the closer the output matches your vision." },
    { q: "Can I use the videos commercially?", a: "Yes — videos you generate on CinAI are yours to use for personal or commercial projects including social media, ads, websites, and client work. See our terms for full licensing details." },
  ];

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
    wrap.innerHTML = MODELS.map(function (m) {
      return '<article class="model-tile reveal">' +
        '<div class="thumb model-thumb" style="background:' + m.grad + '">' +
        '<img class="thumb-logo" src="' + m.logo + '" alt="" loading="lazy" />' +
        '<span class="thumb-maker" aria-hidden="true">' + m.maker + '</span></div>' +
        '<div class="body"><h3>' + m.name + '</h3><p>' + m.desc + '</p>' +
        '<div class="model-foot"><a class="model-readmore" href="' + CINAI + '" target="_blank" rel="noopener" data-cta="model">Read more' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a></div>' +
        '</div></article>';
    }).join("");
    observeReveal(wrap.querySelectorAll(".reveal"));
  }

  function renderFaq() {
    const wrap = document.getElementById("faq-wrap");
    if (!wrap) return;
    wrap.innerHTML = FAQ.map(function (f) {
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
    observeReveal(document.querySelectorAll(".reveal"));
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
