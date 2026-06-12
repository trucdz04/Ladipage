---
description: Clone cả một template/landing page từ URL (pixel-perfect, tái tạo được) — chạy skill clone-template, điều phối MCP + agent + /clone-ui. Phân tích trước, clone từng section sau.
---

# /clone-template — Clone cả một template/landing page

URL cần clone (kèm tuỳ chọn stack/section nếu có): **$ARGUMENTS**

## Nhiệm vụ
Kích hoạt skill **`clone-template`** để clone TOÀN BỘ trang (không chỉ một component) theo trục
**EXTRACT → X-RAY → BUILD → VERIFY**: TRÍCH XUẤT toàn bộ + xuất `SYSTEM-XRAY.md` TRƯỚC, rồi mới code.

## Cách làm
1. Nếu thiếu URL trong `$ARGUMENTS`, hỏi lại ngắn gọn.
2. Nêu 1 dòng: "Tôi sẽ chạy skill `clone-template` cho <url> vì cần dựng lại cả trang."
3. Theo đúng pipeline Pha 0–7 trong skill, tuân thủ nguyên tắc vàng
   *"một prompt = một phần; TRÍCH XUẤT trước, CODE sau"*:
   - **Pha 0**: chốt bản đồ section + stack nhận diện với người dùng.
   - **Pha 1–2**: trích xuất hết (DOM/hành vi/logic) → xuất `SYSTEM-XRAY.md` (9 phần) — **CỔNG trước khi code**.
   - **Pha 3–5**: chốt design → scaffold → build từng section/component (reuse architecture).
   - **Pha 6–7**: QA + COMPARE LOOP + a11y/perf/seo → báo cáo.
4. Báo cáo bằng **tiếng Việt phi kỹ thuật** (tổng quan → bản đồ section → hành vi & hiệu năng →
   lệch phân loại → đề xuất → trạng thái → phase tiếp).

## Liên quan
- Một component đơn lẻ → `/clone-ui <url> <phần>`.
- Chỉ xem/debug → `/inspect-site <url>`.
- Audit lỗi/bảo mật/hiệu năng → `/audit-site <url>`.
