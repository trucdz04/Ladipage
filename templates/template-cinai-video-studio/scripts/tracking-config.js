/* ============================================================
   tracking-config.js — cấu hình tracking 4 lớp (Pha 7)
   Điền giá trị thật trước khi deploy. KHÔNG hardcode secret/token.
   ============================================================ */
window.TRACKING_CONFIG = {
  // Meta Pixel ID của CinAI — thay bằng pixel thật trước khi deploy
  PIXEL_ID: "{{PIXEL_ID}}",
  // Webhook n8n nhận sự kiện server-side (CAPI) + lead-magnet + Lark
  // Template hạ tầng: automation/n8n/cinai-satellite-tracking.workflow.json
  N8N_WEBHOOK: "{{N8N_WEBHOOK}}",
  // Trang chính (CTA cross-domain trỏ về đây)
  MAIN_DOMAIN: "https://cinai.tv",
  // Cookie gốc để set _fbc first-party cross-subdomain
  ROOT_COOKIE: ".cinai.tv",
  // Bật/tắt khi dev
  ENABLED: false,
};
