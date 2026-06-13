/* tracking.js — CinAI.tv landing (Meta Pixel + CAPI qua n8n, dedup event_id, CTA passthrough)
   Phụ thuộc: scripts/tracking-config.js (window.CINAI_CONFIG). An toàn khi để placeholder {{...}}. */
(() => {
  'use strict';
  const CFG = window.CINAI_CONFIG || {};
  const isSet = (v) => typeof v === 'string' && v && v.indexOf('{{') === -1;
  const log = (...a) => { if (CFG.DEBUG) console.log('[cinai-track]', ...a); };

  /* ---------- cookie + attribution helpers ---------- */
  const getCookie = (n) => { const m = document.cookie.match('(^|;)\\s*' + n + '\\s*=\\s*([^;]+)'); return m ? m.pop() : ''; };
  const setCookie = (n, v, days) => {
    const d = new Date(); d.setTime(d.getTime() + (days || 90) * 864e5);
    let dom = '';
    if (isSet(CFG.ROOT_COOKIE)) dom = '; domain=' + CFG.ROOT_COOKIE;
    try { document.cookie = `${n}=${v}; expires=${d.toUTCString()}; path=/${dom}; SameSite=Lax`; } catch (_) {}
  };
  const qs = new URLSearchParams(location.search);
  const fbclid = qs.get('fbclid') || '';
  // build _fbc from fbclid (Meta format) if missing
  let fbc = getCookie('_fbc');
  if (!fbc && fbclid) { fbc = `fb.1.${Date.now()}.${fbclid}`; setCookie('_fbc', fbc, 90); }
  const fbp = getCookie('_fbp');

  const attribution = () => ({
    source: qs.get('utm_source') || '', campaign: qs.get('utm_campaign') || '',
    adset: qs.get('utm_medium') || qs.get('adset') || '', ad: qs.get('utm_content') || qs.get('ad') || '',
    term: qs.get('utm_term') || '', placement: qs.get('placement') || '',
    fbclid, fbp, fbc, landing_page_url: location.href,
  });

  /* ---------- event_id (dedup Browser ↔ CAPI) ---------- */
  let _seq = 0;
  const newEventId = (name) => `${name}.${Date.now()}.${(++_seq)}.${Math.floor(performance.now())}`;

  /* ---------- Meta Pixel base ---------- */
  if (isSet(CFG.PIXEL_ID)) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', CFG.PIXEL_ID);
    log('Pixel init', CFG.PIXEL_ID);
  } else { log('Pixel ID chưa cấu hình — log-only mode'); }

  /* ---------- core: cinaiTrack(name, params) → fbq + n8n (cùng event_id) ---------- */
  const STANDARD = { PageView: 'PageView', ViewContent: 'ViewContent', Lead: 'Lead', LeadSubmit: 'Lead', InitiateCheckout: 'InitiateCheckout', Purchase: 'Purchase' };
  window.cinaiTrack = (name, params) => {
    const event_id = newEventId(name);
    const payload = Object.assign({ event_name: name, event_id, timestamp: Date.now() }, attribution(), params || {});
    log('event', name, payload);
    // Browser Pixel
    if (window.fbq) {
      const std = STANDARD[name];
      const fbParams = { event_id };
      if (params && params.value) { fbParams.value = params.value; fbParams.currency = CFG.CURRENCY || 'USD'; }
      if (std) window.fbq('track', std, fbParams, { eventID: event_id });
      else window.fbq('trackCustom', name, fbParams, { eventID: event_id });
    }
    // Server (CAPI qua n8n) — cùng event_id để dedup
    if (isSet(CFG.N8N_WEBHOOK)) {
      try {
        navigator.sendBeacon
          ? navigator.sendBeacon(CFG.N8N_WEBHOOK, new Blob([JSON.stringify(payload)], { type: 'application/json' }))
          : fetch(CFG.N8N_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true });
      } catch (_) {}
    }
  };

  /* ---------- auto: PageView + ViewContent ---------- */
  window.cinaiTrack('PageView');
  window.cinaiTrack('ViewContent', { content_name: 'cinai_landing' });

  /* ---------- scroll depth 25/50/75 ---------- */
  const depthFired = {};
  const onScroll = () => {
    const h = document.documentElement;
    const p = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    [25, 50, 75].forEach((d) => { if (p >= d && !depthFired[d]) { depthFired[d] = 1; window.cinaiTrack('Scroll' + d); } });
    if (Object.keys(depthFired).length >= 3) removeEventListener('scroll', onScroll);
  };
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- bind [data-track] clicks ---------- */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (!el) return;
    const name = el.getAttribute('data-track');
    const extra = {};
    for (const a of el.attributes) {
      if (a.name.startsWith('data-') && !['data-track', 'data-reveal'].includes(a.name)) {
        extra[a.name.replace('data-', '').replace(/-/g, '_')] = a.value;
      }
    }
    window.cinaiTrack(name, extra);
  }, true);

  /* ---------- CTA passthrough: nối utm/fbclid/fbp/fbc sang cinai.tv ---------- */
  const passthroughKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
  const decorate = (url) => {
    try {
      const u = new URL(url, location.href);
      passthroughKeys.forEach((k) => { const v = qs.get(k); if (v && !u.searchParams.has(k)) u.searchParams.set(k, v); });
      if (fbp) u.searchParams.set('fbp', fbp);
      if (fbc) u.searchParams.set('fbc', fbc);
      return u.toString();
    } catch (_) { return url; }
  };
  const decorateAll = () => {
    document.querySelectorAll('a[data-cta]').forEach((a) => {
      let href = a.getAttribute('href') || '';
      if (isSet(CFG.PRICING_URL)) href = href.replace('{{PRICING_URL}}', CFG.PRICING_URL);
      if (isSet(CFG.MAIN_DOMAIN)) href = href.replace('{{MAIN_DOMAIN}}', CFG.MAIN_DOMAIN);
      if (/^https?:\/\//.test(href) && /cinai\.tv/.test(href)) href = decorate(href);
      a.setAttribute('href', href);
    });
  };
  if (document.readyState !== 'loading') decorateAll();
  else document.addEventListener('DOMContentLoaded', decorateAll);
})();
