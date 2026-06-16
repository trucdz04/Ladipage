/* tracking-config.js — CinAI Studio landing QC (song ngữ VI/EN, chạy VN + quốc tế)
   Giá trị thật đã verified với n8n live (memory cinbase-tracking-deploy).
   Để placeholder {{...}} thì tracking chạy "log-only". */
window.CINAI_CONFIG = {
  PIXEL_ID: "2215508219251213",                              // Meta Pixel ID (CinAI)
  N8N_WEBHOOK: "https://n8n.halcion.vn/webhook/cinai-track", // webhook n8n: CAPI + ghi Lark (active)
  MAIN_DOMAIN: "https://cinai.tv",                           // web chính — CTA cross-domain trỏ về
  PRICING_URL: "https://cinai.tv/pricing",                   // trang giá trên web chính
  // ROOT_COOKIE: chỉ đặt ".cinai.tv" NẾU landing host trên subdomain cinai.tv.
  // Khác domain → để trống (đã có passthrough utm/fbclid/_fbp/_fbc qua URL).
  ROOT_COOKIE: "",
  CURRENCY: "USD",
  DEBUG: true                                                // ĐẶT false khi production
};
