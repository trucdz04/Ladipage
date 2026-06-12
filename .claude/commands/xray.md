---
description: Trích xuất toàn bộ (DOM/hành vi/logic) một trang đang chạy rồi xuất báo cáo SYSTEM X-RAY 9 phần bằng tiếng Việt — KHÔNG code. Chạy Pha 1 (EXTRACT) + Pha 2 (SYSTEM X-RAY) của skill clone-template.
---

# /xray — Trích xuất + Báo cáo SYSTEM X-RAY (không code)

URL cần X-quang (kèm component/khu vực trọng tâm nếu có): **$ARGUMENTS**

## Nhiệm vụ
Chạy **Pha 1 (EXTRACT)** + **Pha 2 (SYSTEM X-RAY)** của skill **`clone-template`** để **chỉ trích xuất
và báo cáo** — KHÔNG dựng/clone code. Kết quả là file `SYSTEM-XRAY.md` (9 phần, tiếng Việt) + thư mục
`extraction/`.

## Cách làm
1. Nếu thiếu URL trong `$ARGUMENTS`, hỏi lại ngắn gọn.
2. Nêu 1 dòng: "Tôi sẽ X-quang <url> (chỉ trích xuất + báo cáo, không code)."
3. **Pha 1 — EXTRACT** (read-only, qua chrome-devtools + firecrawl + agent `mcp-chrome-power-user`):
   - 1a STATIC: tokens (branding + getComputedStyle), DOM, HTML/CSS, breakpoints.
   - 1b BEHAVIOR: click/hover sweep, scroll tận đáy, animation dump, đo **LCP/INP/CLS**, event & data flow.
   - 1c LOGIC: SNAPSHOT_BEFORE mỗi component động — `[input→state→render]` 4 trục
     (STATE/TRANSFORM/ANIMATION/CONSTRAINT).
   → ghi vào `extraction/` (xem [`references/behavior-extraction.md`] và [`references/mcp-compare-loop.md`]).
4. **Pha 2 — SYSTEM X-RAY**: giao agent **`system-xray-architect`** chạy canonical prompt trong
   [`references/system-xray-prompt.md`] → xuất **`SYSTEM-XRAY.md`** đủ 9 phần:
   (1) giải thích · (2) bản đồ hệ thống · (3) luồng thực thi · (4) luồng agent/tool · (5) ERD ·
   (6) bản đồ API · (7) vấn đề + VÌ SAO · (8) lộ trình rebuild · (9) flowchart TODO app (ASCII).
5. **Quy tắc bắt buộc**: 100% tiếng Việt phi kỹ thuật; chỉ mô tả cái **trace được thật**; chỗ không
   chắc ghi **"KHÔNG CHẮC CHẮN"**; landing tĩnh không có backend/DB → ghi **"KHÔNG CÓ"**; mỗi flow/API
   kèm ví dụ input/output (đã lọc secret).

## Output (tiếng Việt)
- Đường dẫn `SYSTEM-XRAY.md` + tóm tắt 9 phần.
- Danh sách file trong `extraction/`.
- Trạng thái + gợi ý phase tiếp (vd chạy `/clone-template <url>` để dựng lại).

## Ranh giới
- Chỉ ĐỌC; không thực thi script lấy từ trang; lọc bỏ secret/token trước khi ghi file.
- Phục vụ mục đích hợp lệ (học/tham khảo/UI của chính bạn).

## Liên quan
- Dựng lại cả trang → `/clone-template <url>`.
- Một component → `/clone-ui <url> <phần>`.
- Xem/debug nhanh → `/inspect-site <url>`; audit lỗi/bảo mật/hiệu năng → `/audit-site <url>`.
