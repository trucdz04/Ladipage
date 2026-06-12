---
description: Dựng chuỗi email nuôi dưỡng lead tự động trên n8n (ngay → +1d → +3d → hàng tuần, giờ vàng 9:00, dừng khi đã đăng ký) kéo traffic về app chính; nội dung sửa trên Lark. Chạy skill lead-nurture.
---

# /nurture-setup — Dựng chuỗi email nuôi dưỡng lead

Sản phẩm/đích kéo về + landing tặng quà (kèm campaign/quà nếu có): **$ARGUMENTS**

## Nhiệm vụ
Kích hoạt skill **`lead-nurture`** để dựng/triển khai chuỗi email tự động kéo lead lạnh quay lại
app chính (đăng ký/mua), nội dung cập nhật trên **Lark**.

## Cách làm
1. Nếu thiếu thông tin (app đích, landing, quà/lead-magnet, mục tiêu chiến dịch), hỏi lại ngắn gọn.
2. Nêu 1 dòng: "Tôi sẽ chạy skill `lead-nurture` cho <sản phẩm>."
3. Theo skill: blueprint n8n (Webhook → Lark Save → Lark Get Content → Email 0 → Wait/IF → Email 1/2/3)
   dùng template [`automation/n8n/cinai-nurture-sequence.workflow.json`](../../automation/n8n/cinai-nurture-sequence.workflow.json)
   + hướng dẫn [`NURTURE-README.md`](../../automation/n8n/NURTURE-README.md).
4. Trả đủ 3 phần (tiếng Việt): **Blueprint n8n** · **Kịch bản email 4 mốc (Subject/Body/CTA+UTM)** ·
   **Chiến lược tối ưu** (chống spam, SPF/DKIM/DMARC, đo lường).

## Liên quan
- Tracking Pixel/CAPI cho landing → `/tracking-setup` (skill `meta-tracking`).
- Clone landing → `/clone-template <url>`.
