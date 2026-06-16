/* tracking-config.js — CinAI Video Studio landing QC (chạy VN + quốc tế)
   Giá trị thật đã verified với n8n live (xem memory cinbase-tracking-deploy).
   Để placeholder {{...}} thì tracking chạy "log-only" (không bắn). */
window.CINAI_CONFIG = {
  PIXEL_ID: "2215508219251213",                              // Meta Pixel ID (CinAI)
  N8N_WEBHOOK: "https://n8n.halcion.vn/webhook/cinai-track", // webhook n8n: CAPI + ghi Lark (active)
  MAIN_DOMAIN: "https://cinai.tv",                           // web chính — CTA cross-domain trỏ về
  PRICING_URL: "https://cinai.tv/pricing",                   // trang giá trên web chính
  // ROOT_COOKIE: chỉ đặt ".cinai.tv" NẾU landing host trên subdomain cinai.tv (vd go.cinai.tv)
  // để _fbp/_fbc first-party dùng chung. Khác domain → để trống, đã có passthrough qua URL.
  ROOT_COOKIE: "",
  CURRENCY: "USD",                                           // giá hiển thị USD (cả VN + quốc tế)
  DEBUG: true                                                // true = log event ra console. ĐẶT false khi production.
};
