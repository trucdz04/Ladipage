---
description: Dựng hạ tầng đo lường Meta Ads 4 lớp (Browser Pixel + Server CAPI + EMQ + Dedup) cho landing/SaaS, gồm lead-magnet — chạy skill meta-tracking, nối n8n + Lark. Báo cáo + KPI tiếng Việt.
---

# /tracking-setup — Dựng tracking Meta 4 lớp cho SaaS

Domain/sản phẩm cần dựng tracking (kèm Pixel ID, app chính, mục tiêu nếu có): **$ARGUMENTS**

## Nhiệm vụ
Kích hoạt skill **`meta-tracking`** để thiết lập đo lường sạch theo **4 lớp** cho luồng
Ads → Landing → CTA → App chính → Đăng ký/Thanh toán (hoặc lead-magnet).

## Cách làm
1. Nếu thiếu thông tin (landing domain, app chính, Pixel ID, mục tiêu), hỏi lại ngắn gọn.
2. Nêu 1 dòng: "Tôi sẽ chạy skill `meta-tracking` cho <domain>."
3. Theo 6 bước trong skill: PLAN → BROWSER → SERVER/CAPI → EMQ → DEDUP+CROSS-DOMAIN → TEST+KPI.
   - Nhúng Pixel + `tracking.js` (xem `references/client-setup.md`).
   - Nối webhook n8n template + backend (xem `references/server-capi-emq-dedup.md`).
4. Báo cáo bằng **tiếng Việt phi kỹ thuật**: sơ đồ luồng dữ liệu → cấu hình → KPI (EMQ, LPV%,
   Bounce, dedup, CAPI coverage) → trạng thái → phase tiếp.

## Liên quan
- Dựng cả landing + tracking → `/clone-template <url>` (gọi `meta-tracking` ở Pha 7).
- Workflow backend: [`automation/n8n/`](../../automation/n8n/README.md).
- Debug 1 trang đang chạy → `/inspect-site <url>`.
