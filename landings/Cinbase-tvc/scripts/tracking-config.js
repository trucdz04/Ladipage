/* tracking-config.js — CinBase landing (thị trường VN, khách doanh nghiệp)
   Điền các giá trị thật trước khi deploy. Để placeholder {{...}} thì tracking chạy ở chế độ "log-only". */
window.CINAI_CONFIG = {
  PIXEL_ID: "2215508219251213",                              // Meta Pixel ID (CinAI/CinBase)
  N8N_WEBHOOK: "https://n8n.halcion.vn/webhook/cinai-track", // webhook n8n: CAPI + ghi Lark
  NURTURE_WEBHOOK: "https://n8n.halcion.vn/webhook/cinai-nurture", // webhook n8n: đẩy lead vào chuỗi email nurture (lưu Lark + gửi mail)
  MAIN_DOMAIN: "{{MAIN_DOMAIN}}",      // website chính CinBase (điền khi có, vd: https://cinbase.vn)
  PRICING_URL: "{{PRICING_URL}}",      // trang báo giá/liên hệ trên web chính (nếu có)
  ROOT_COOKIE: "{{ROOT_COOKIE}}",      // domain set _fbc first-party (để trống khi chạy localhost)
  CURRENCY: "VND",
  DEBUG: true                          // true = log event ra console (đặt false khi production)
};
