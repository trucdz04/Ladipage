/* ============================================================
   tracking-config.js — cấu hình tracking 4 lớp (Pha 7)
   Điền giá trị thật trước khi deploy. KHÔNG hardcode secret/token.
   ============================================================ */
window.TRACKING_CONFIG = {
  // Meta Pixel ID (trang nguồn dùng 1636932644396730 — thay bằng pixel của bạn)
  PIXEL_ID: "YOUR_PIXEL_ID",
  // Webhook n8n nhận sự kiện server-side (CAPI) + lead-magnet + Lark
  // Template hạ tầng: automation/n8n/cinai-satellite-tracking.workflow.json
  N8N_WEBHOOK: "https://YOUR_N8N_HOST/webhook/sendfame-tracking",
  // Trang chính (CTA cross-domain trỏ về đây)
  MAIN_DOMAIN: "https://sendfame.com",
  // Cookie gốc để set _fbc first-party cross-subdomain
  ROOT_COOKIE: ".sendfame.com",
  // Bật/tắt khi dev
  ENABLED: false,
};
