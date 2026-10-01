/* tracking-config.js — CinBase landing (thị trường VN, khách doanh nghiệp)
   Điền các giá trị thật trước khi deploy. Để placeholder {{...}} thì tracking chạy ở chế độ "log-only". */
window.CINAI_CONFIG = {
  PIXEL_ID: "2215508219251213",                              // Meta Pixel ID (CinAI/CinBase)
  N8N_WEBHOOK: "https://n8n.halcion.vn/webhook/cinai-track", // webhook n8n: CAPI + ghi Lark
  NURTURE_WEBHOOK: "", // webhook n8n: đẩy lead vào chuỗi email nurture (lưu Lark + gửi mail)
  MAIN_DOMAIN: "https://cinai.tv",      // website chính CinBase (điền khi có, vd: https://cinbase.vn)
  PRICING_URL: "https://cinai.tv/signup?plan=pro",      // trang báo giá/liên hệ trên web chính (nếu có)
  ROOT_COOKIE: "{{ROOT_COOKIE}}",      // domain set _fbc first-party (để trống khi chạy localhost)
  CURRENCY: "USD",
  DEBUG: true                          // true = log event ra console (đặt false khi production)
};
// Local previews never send test data to Meta, CRM or email automations.
if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
  Object.assign(window.CINAI_CONFIG, { PIXEL_ID: '', N8N_WEBHOOK: '', NURTURE_WEBHOOK: '' });
}
