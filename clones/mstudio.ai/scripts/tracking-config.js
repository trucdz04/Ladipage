/* tracking-config.js — CinAI.tv landing
   Điền các giá trị thật trước khi deploy. Để placeholder {{...}} thì tracking chạy ở chế độ "log-only". */
window.CINAI_CONFIG = {
  PIXEL_ID: "{{PIXEL_ID}}",            // Meta Pixel ID
  N8N_WEBHOOK: "{{N8N_WEBHOOK}}",      // webhook n8n: nhận event (CAPI) + lead
  MAIN_DOMAIN: "https://cinai.tv",     // website chính
  PRICING_URL: "https://cinai.tv/pricing",
  ROOT_COOKIE: ".cinai.tv",            // domain set _fbc first-party (cross-subdomain)
  CURRENCY: "USD",
  DEBUG: true                          // true = log event ra console
};
