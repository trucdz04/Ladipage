/* tracking-config.js — CinBase landing (thị trường VN, khách doanh nghiệp)
   Điền các giá trị thật trước khi deploy. Để placeholder {{...}} thì tracking chạy ở chế độ "log-only". */
window.CINAI_CONFIG = {
  PIXEL_ID: "{{PIXEL_ID}}",            // Meta Pixel ID
  N8N_WEBHOOK: "{{N8N_WEBHOOK}}",      // webhook n8n: nhận event (CAPI) + lead tư vấn
  MAIN_DOMAIN: "{{MAIN_DOMAIN}}",      // website chính CinBase (vd: https://cinbase.vn)
  PRICING_URL: "{{PRICING_URL}}",      // trang báo giá/liên hệ trên web chính (nếu có)
  ROOT_COOKIE: "{{ROOT_COOKIE}}",      // domain set _fbc first-party (vd: .cinbase.vn)
  CURRENCY: "VND",
  DEBUG: true                          // true = log event ra console
};
