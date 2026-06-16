/* ============================================================
   main.js — wiring tương tác cho clone sendfame.com
   (theo extraction/behavior-map.md + logic-generator-panel.md)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- DATA (content model — SYSTEM-XRAY.md phần 5) ---------- */
  // ar = tỉ lệ khung (tạo bố cục masonry nhiều cao-thấp như bản gốc:
  // mix dọc 3/4, ngang 4/3, rộng 16/9). Mọi tile autoplay nên luôn có nội dung.
  // Phân phối round-robin vào 4 cột (item i → cột i%cols), nên lề trên mọi cột bằng nhau.
  // ar đa dạng (dọc 3/4, ngang 16/9, 4/3) tạo masonry cao-thấp như bản gốc.
  const COMMUNITY = [
    { v: "https://cdn.higgsfield.ai/user_2woJMxSXFH2QGGlMdyBq7q6ld4K/01c77eeb-fe4a-4abf-9e0a-d1d1a7ac350f_min.mp4", p: "https://wsrv.nl/?url=https%3A%2F%2Fd2ol7oe51mr4n9.cloudfront.net%2Fanon_user_id%2Fa38e09dc-3bbb-48d3-937d-2191966c114d.jpg&w=320&output=webp", ar: "3 / 4" },
    { v: "https://videos.sendfame.com/boxing.mp4", p: "https://videos.sendfame.com/boxing-poster.png", ar: "16 / 9" },
    { v: "https://videos.sendfame.com/monster-fight.mp4", p: "https://videos.sendfame.com/monster-fight-poster.png", ar: "16 / 9" },
    { v: "https://videos.sendfame.com/5a800de4-df16-447f-bd4f-56b92214d311_min.mp4", p: "https://videos.sendfame.com/monster-medium.jpeg", ar: "3 / 4" },
    { v: "https://videos.sendfame.com/monster-fight.mp4", p: "https://videos.sendfame.com/monster-fight-poster.png", ar: "4 / 3" },
    { v: "https://videos.sendfame.com/boxing.mp4", p: "https://videos.sendfame.com/boxing-poster.png", ar: "4 / 3" },
    { v: "https://cdn.higgsfield.ai/user_2woJMxSXFH2QGGlMdyBq7q6ld4K/01c77eeb-fe4a-4abf-9e0a-d1d1a7ac350f_min.mp4", p: "https://wsrv.nl/?url=https%3A%2F%2Fd2ol7oe51mr4n9.cloudfront.net%2Fanon_user_id%2Fa38e09dc-3bbb-48d3-937d-2191966c114d.jpg&w=320&output=webp", ar: "3 / 4" },
    { v: "https://videos.sendfame.com/5a800de4-df16-447f-bd4f-56b92214d311_min.mp4", p: "https://videos.sendfame.com/monster-medium.jpeg", ar: "16 / 9" },
    { v: "https://videos.sendfame.com/boxing.mp4", p: "https://videos.sendfame.com/boxing-poster.png", ar: "4 / 3" },
    { v: "https://videos.sendfame.com/monster-fight.mp4", p: "https://videos.sendfame.com/monster-fight-poster.png", ar: "3 / 4" },
    { v: "https://videos.sendfame.com/5a800de4-df16-447f-bd4f-56b92214d311_min.mp4", p: "https://videos.sendfame.com/monster-medium.jpeg", ar: "4 / 3" },
    { v: "https://videos.sendfame.com/boxing.mp4", p: "https://videos.sendfame.com/boxing-poster.png", ar: "16 / 9" },
  ];

  // NOTE: thumbnail thương hiệu bên thứ ba → placeholder gradient (chính sách asset).
  // Thay bằng ảnh hợp lệ của bạn trước khi phát hành nếu cần.
  const MODELS = [
    { hue: 265, name: "Veo 3.1 Lite", desc: "Google DeepMind's faster, budget-tier Veo option: 8-second clips with dialogue and ambient sound baked in." },
    { hue: 200, name: "Kling V3 Pro", desc: "Professional-grade AI video by Kuaishou with cinematic motion and multi-shot sequences up to 15 seconds." },
    { hue: 320, name: "Seedance 2.0", desc: "Quad-modal input, multi-shot cinematic sequences, perfect audio sync in 8+ languages, 2K resolution." },
    { hue: 20, name: "Grok Imagine Video", desc: "Creative AI video by xAI with imaginative results, native audio sync, and 8 aspect ratios." },
    { hue: 160, name: "Hailuo AI (MiniMax)", desc: "MiniMax's flagship text- and image-to-video model series, known for rapid generation." },
    { hue: 190, name: "Kling AI", desc: "AI video suite by Kuaishou, focused on character animation and motion consistency." },
    { hue: 285, name: "Kling 2.6 Motion Control", desc: "Transfer movement from a reference video onto any character image in one pass." },
    { hue: 240, name: "Kling 3.0 Motion Control", desc: "The biggest upgrade to AI motion transfer yet. Pro and Standard quality tiers available." },
  ];

  const FAQ = [
    { q: "What is an AI video generator?", a: "An AI video generator uses machine learning to create videos from text prompts or images. You provide a description or upload an image, and the AI produces a short video clip with motion, animation, and effects applied automatically." },
    { q: "How long does it take to generate a video?", a: "Most videos are generated within 30-60 seconds depending on the complexity and resolution. Higher resolution or longer clips may take a bit more time. You will be notified as soon as your video is ready." },
    { q: "What kinds of videos can I create?", a: "You can create a wide variety of videos — animated scenes, product showcases, social media clips, artistic visualizations, talking head animations, and more. The AI supports different styles and motion types to fit your creative needs." },
    { q: "How do I get the best results?", a: "Write detailed, specific prompts describing the motion, style, and scene you want. For image-to-video, use clear high-quality images. The more context you give the AI, the closer the output will match your vision." },
    { q: "What resolutions and formats are supported?", a: "We support multiple resolutions up to 720p HD. Generated videos can be downloaded in standard formats like MP4. Lower resolutions process faster while higher resolutions provide better visual quality." },
    { q: "Can I use the generated videos commercially?", a: "Yes, videos you generate are yours to use for personal or commercial purposes including social media, ads, websites, and presentations. Check our terms of service for full licensing details." },
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
        return '<div class="v-card" style="aspect-ratio:' + c.ar + '">' +
          '<video autoplay loop muted playsinline preload="metadata" ' +
          (c.p ? 'poster="' + c.p + '" ' : "") + 'src="' + c.v + '"></video></div>';
      }).join("") + '</div>';
    }).join("");
  }

  function renderModels() {
    const wrap = document.getElementById("model-grid");
    if (!wrap) return;
    wrap.innerHTML = MODELS.map(function (m) {
      var bg = "background:radial-gradient(120% 120% at 30% 20%, hsl(" + m.hue + " 65% 28%), hsl(" + ((m.hue + 35) % 360) + " 60% 10%) 75%, #050505);";
      return '<article class="model-tile reveal">' +
        '<div class="thumb model-thumb" style="' + bg + '"><span class="thumb-name" aria-hidden="true">' + m.name + '</span></div>' +
        '<div class="body"><h3>' + m.name + '</h3><p>' + m.desc + '</p>' +
        '<div class="model-foot"><a class="model-readmore" href="#" data-cta="model">Read more' +
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
