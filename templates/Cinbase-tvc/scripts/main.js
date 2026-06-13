/* main.js — tương tác UI cho bản clone mstudio.ai (Pha 5)
   Theo extraction/behavior-map.md: reveal · header scroll · tabs · FAQ · carousel · sticky VFL · lazy video · marquee. */
(() => {
  'use strict';
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
    // stagger children
    document.querySelectorAll('[data-stagger]').forEach((grid) => {
      [...grid.querySelectorAll('[data-reveal]')].forEach((c, i) => { c.style.animationDelay = (i * 80) + 'ms'; });
    });
  }

  /* ---------- 2. Header: scrolled bg + hide-on-scroll-down / show-on-scroll-up ---------- */
  const header = document.getElementById('site-header');
  if (header) {
    let lastY = window.scrollY;
    let ticking = false;
    const REVEAL_AT_TOP = 90; // luôn hiện khi gần đỉnh
    const update = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      const goingDown = y > lastY;
      if (y > REVEAL_AT_TOP && goingDown) {
        header.classList.add('header-hidden');   // cuộn xuống → ẩn
      } else {
        header.classList.remove('header-hidden'); // cuộn lên / gần đỉnh → hiện
      }
      lastY = y;
      ticking = false;
    };
    update();
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  /* ---------- 3. Tabs (tools + guided) ---------- */
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    if (group.getAttribute('role') !== 'tablist') return;
    const key = group.dataset.tabs;
    const tabs = [...group.querySelectorAll('[role="tab"]')];
    const panels = [...document.querySelectorAll(`[role="tabpanel"][data-tabs="${key}"]`)];
    const select = (idx) => {
      tabs.forEach((t, i) => t.setAttribute('aria-selected', i === idx ? 'true' : 'false'));
      panels.forEach((p, i) => {
        p.hidden = i !== idx;
        const v = p.querySelector('video');
        if (!v) return;
        if (i === idx) { if (v.dataset.loaded !== '1') { v.load(); v.dataset.loaded = '1'; } tryPlay(v); }
        else v.pause();
      });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', (ev) => {
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
          ev.preventDefault();
          const next = (i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
          tabs[next].focus(); select(next);
        }
      });
    });
  });

  /* ---------- 3b. Hero feature cards (accordion mở rộng khi hover/focus) ---------- */
  const heroCards = [...document.querySelectorAll('[data-hero-card]')];
  if (heroCards.length) {
    const activate = (idx) => {
      heroCards.forEach((c, i) => {
        const on = i === idx;
        c.classList.toggle('is-active', on);
        const v = c.querySelector('video');
        if (v) {
          if (on) { if (v.dataset.loaded !== '1') { v.load(); v.dataset.loaded = '1'; } const p = v.play(); if (p && p.catch) p.catch(() => {}); }
          else { v.pause(); }
        }
      });
    };
    heroCards.forEach((card, i) => {
      card.addEventListener('mouseenter', () => activate(i));
      card.addEventListener('focusin', () => activate(i));
    });
    activate(0); // card đầu mở mặc định
  }

  /* ---------- 4. FAQ accordion (single-open) ---------- */
  const faqWrap = document.querySelector('[data-faq]');
  if (faqWrap) {
    const items = [...faqWrap.querySelectorAll('.faq-item')];
    items.forEach((item) => {
      const btn = item.querySelector('button');
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', () => {
        const open = item.getAttribute('aria-expanded') === 'true';
        items.forEach((it) => { it.setAttribute('aria-expanded', 'false'); it.querySelector('button').setAttribute('aria-expanded', 'false'); });
        if (!open) { item.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  /* ---------- 5. Horizontal carousel ---------- */
  const track = document.querySelector('[data-carousel]');
  if (track) {
    const step = () => Math.min(track.clientWidth * 0.8, 400);
    const prev = document.querySelector('[data-car-prev]');
    const next = document.querySelector('[data-car-next]');
    prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  /* ---------- 6. Vertical Feature List (sticky: lens xoay + số trượt liên tục + panel crossfade) ---------- */
  const vfl = document.querySelector('[data-vfl]');
  if (vfl) {
    const panels = [...vfl.querySelectorAll('[data-vfl-panel]')];
    const nums = [...vfl.querySelectorAll('.vfl-num')];
    const lens = vfl.querySelector('[data-vfl-lens]');
    const N = panels.length;
    const STEP = 360 / N;       // 72° giữa các số
    const RADIUS = 375;         // bán kính vòng số: NẰM NGOÀI rìa lens (lens bán kính ~320px)
    const norm = (a) => { a = a % 360; if (a > 180) a -= 360; if (a < -180) a += 360; return a; };
    let current = -1;

    const playActive = (v) => {
      const go = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
      if (v.dataset.loaded !== '1') { v.load(); v.dataset.loaded = '1'; }
      if (v.readyState >= 2) go(); else v.addEventListener('canplay', go, { once: true });
    };
    const setActive = (idx) => {
      if (idx === current) return;
      current = idx;
      panels.forEach((p, i) => {
        const on = i === idx;
        p.classList.toggle('is-active', on);
        const v = p.querySelector('video');
        if (v) { if (on) playActive(v); else v.pause(); }
      });
    };
    const onScroll = () => {
      const r = vfl.getBoundingClientRect();
      const total = vfl.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-r.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;        // 0..1 liên tục
      // vòng xoay: số i nằm ở góc (i*72 - progress*(N-1)*72); active = số gần 0° (3 giờ)
      const ringRot = -progress * (N - 1) * STEP;
      if (lens) lens.style.transform = `translate(-50%,-50%) rotate(${ringRot}deg)`;
      let best = 0, bestAbs = 999;
      nums.forEach((n, i) => {
        const deg = norm(ringRot + i * STEP);
        const rad = deg * Math.PI / 180;
        const x = RADIUS * Math.cos(rad), y = RADIUS * Math.sin(rad);
        n.style.transform = `translate(-50%,-50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        n.style.opacity = (0.2 + 0.8 * Math.max(0, Math.cos(rad))).toFixed(2); // sáng ở phải, mờ ở trái
        n.style.zIndex = Math.cos(rad) > 0 ? 2 : 1;
        const ab = Math.abs(deg);
        if (ab < bestAbs) { bestAbs = ab; best = i; }
      });
      setActive(best);
    };
    const mq = matchMedia('(min-width: 1024px)');
    if (mq.matches) { onScroll(); addEventListener('scroll', onScroll, { passive: true }); }
    else { panels.forEach((p) => p.classList.add('is-active')); }
    mq.addEventListener && mq.addEventListener('change', () => location.reload());
  }

  /* ---------- 7. Lazy video play/pause on viewport ---------- */
  function tryPlay(v) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
  const vids = [...document.querySelectorAll('video[data-lazy-video]')].filter(v => !v.closest('[data-hero-card]'));
  if (vids.length) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) {
          if (v.dataset.loaded !== '1') { v.load(); v.dataset.loaded = '1'; }
          if (!v.closest('[hidden]')) tryPlay(v);
        } else { v.pause(); }
      });
    }, { threshold: 0.25 });
    vids.forEach((v) => vio.observe(v));
  }

  /* ---------- 8. Mobile nav toggle (simple) ---------- */
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const nav = document.querySelector('header nav');
      if (nav) nav.classList.toggle('hidden');
    });
  }

  /* ---------- 8b. Announcement bar close ---------- */
  const annClose = document.getElementById('announcement-close');
  const annBar = document.getElementById('announcement-bar');
  if (annClose && annBar && header) {
    annClose.addEventListener('click', () => {
      annBar.style.display = 'none';
      header.style.top = '0';
    });
  }

  /* ---------- 8c. Term toggle (ma trận cam kết 1/6/12 tháng) ---------- */
  const termToggle = document.querySelector('[data-term-toggle]');
  if (termToggle) {
    const opts = [...termToggle.querySelectorAll('.term-opt')];
    const applyTerm = (term) => {
      document.querySelectorAll('[data-price]').forEach((p) => {
        const val = p.dataset['m' + term];
        if (val) p.textContent = val;
      });
      document.querySelectorAll('[data-anchor]').forEach((a) => {
        const val = a.dataset['a' + term];
        if (val) { a.textContent = val; a.style.display = ''; }
        else { a.style.display = 'none'; }
      });
      document.querySelectorAll('[data-term-suffix]').forEach((s) => { s.textContent = 'cam kết ' + term + ' tháng'; });
      const note = document.querySelector('[data-term-note]');
      if (note) note.textContent = 'Giá/video khi cam kết ' + term + ' tháng';
    };
    opts.forEach((opt) => {
      opt.addEventListener('click', () => {
        const term = opt.dataset.term; // 1 | 6 | 12
        opts.forEach((o) => {
          const active = o === opt;
          o.classList.toggle('is-active', active);
          o.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        applyTerm(term);
        if (window.cinaiTrack) window.cinaiTrack('SelectTerm', { term });
      });
    });
  }

  /* ---------- 8d. Lead magnet form ---------- */
  const leadForm = document.querySelector('[data-lead-form]');
  if (leadForm) {
    let started = false;
    const fire = (name, extra) => { if (window.cinaiTrack) window.cinaiTrack(name, extra || {}); };
    leadForm.addEventListener('focusin', () => { if (!started) { started = true; fire('LeadFormStart'); } }, { once: false });
    const indSel = leadForm.querySelector('[name="industry"]');
    const goalSel = leadForm.querySelector('[name="goal"]');
    indSel && indSel.addEventListener('change', () => fire('SelectIndustry', { industry: indSel.value }));
    goalSel && goalSel.addEventListener('change', () => fire('SelectGoal', { goal: goalSel.value }));
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        email: (leadForm.querySelector('[name="email"]') || {}).value || '',
        industry: indSel ? indSel.value : '',
        goal: goalSel ? goalSel.value : '',
        source: 'landing', landing_page_url: location.href, timestamp: Date.now(),
      };
      const btn = leadForm.querySelector('[type="submit"]');
      const ok = leadForm.querySelector('[data-lead-success]');
      if (btn) { btn.disabled = true; btn.textContent = 'Đang gửi…'; }
      fire('LeadSubmit', data);
      const url = leadForm.getAttribute('data-webhook');
      const done = () => { leadForm.querySelector('[data-lead-fields]')?.setAttribute('hidden', ''); if (ok) ok.hidden = false; };
      if (url && url.indexOf('{{') === -1) {
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          .then(done).catch(done);
      } else { setTimeout(done, 600); } // placeholder webhook → just show success
    });
  }

  /* ---------- 9. Chat widget placeholder ---------- */
  const chat = document.getElementById('chat-widget');
  if (chat) chat.addEventListener('click', () => alert('Khung chat (placeholder) — gắn công cụ chat thật khi triển khai.'));
})();
