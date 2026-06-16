/* tracking-config.js — CinAI Cartoon LP (creators/KOL, EN, USD)
   Điền giá trị thật trước khi deploy. Để placeholder {{...}} thì phần đó chạy "log-only". */
window.CINAI_CONFIG = {
  PIXEL_ID: "2215508219251213",                              // Meta Pixel ID (CinAI)
  N8N_WEBHOOK: "https://n8n.halcion.vn/webhook/cinai-track", // webhook n8n: CAPI + ghi Lark (server layer)
  NURTURE_WEBHOOK: "https://n8n.halcion.vn/webhook/cinai-nurture", // webhook nurture: enroll + email sequence
  MAIN_DOMAIN: "https://cinai.tv",     // website chính (CTA passthrough utm/fbclid/fbp/fbc)
  PRICING_URL: "{{PRICING_URL}}",      // trang giá trên web chính (nếu có)
  ROOT_COOKIE: "{{ROOT_COOKIE}}",      // domain set _fbc first-party (để trống khi localhost)
  CURRENCY: "USD",
  DEBUG: true                          // true = log event ra console (đặt false khi production)
};
