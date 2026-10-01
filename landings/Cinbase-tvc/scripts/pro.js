/* Dedicated Pro campaign. Source offer: user-provided campaign artwork. */
(() => {
  'use strict';
  const config = window.CINAI_CONFIG || (window.CINAI_CONFIG = {});
  config.CURRENCY = 'USD';
  config.MAIN_DOMAIN = 'https://cinai.tv';
  config.PRICING_URL = 'https://cinai.tv/signup?plan=pro';
  config.DEBUG = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  if (config.DEBUG) {
    config.PIXEL_ID = '';
    config.N8N_WEBHOOK = '';
    config.NURTURE_WEBHOOK = '';
  }
  const attribution = new URLSearchParams(location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
  document.querySelectorAll('[data-pro-signup]').forEach((link) => {
    link.dataset.cta = 'pro-signup';
    link.dataset.track = 'Click_CTA';
    link.dataset.contentName = 'cinai_pro_25';
    const target = new URL(link.href);
    keys.forEach((key) => { if (attribution.has(key)) target.searchParams.set(key, attribution.get(key)); });
    link.href = target.toString();
  });
  document.querySelectorAll('.faq-list details').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) document.querySelectorAll('.faq-list details').forEach((other) => { if (other !== item) other.open = false; });
    });
  });
})();
