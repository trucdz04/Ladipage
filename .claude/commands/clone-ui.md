---
description: Clone một component/giao diện từ URL theo hướng pixel-perfect — PHÂN TÍCH trước, CLONE sau, mỗi lần một phần.
---

# /clone-ui — Clone giao diện (pixel-perfect)

URL + phần cần clone (vd "header", "pricing card"): **$ARGUMENTS**

## Nguyên tắc vàng
**"Một prompt = một phần; phân tích trước, clone sau."**
KHÔNG clone cả trang một lần. Mỗi lần chỉ một component.

## Quy trình
### Giai đoạn 1 — PHÂN TÍCH (không viết code UI vội)
1. `mcp-chrome-power-user`: `navigate_page` → `take_snapshot` → `take_screenshot` phần cần clone.
2. Dùng **firecrawl** `firecrawl_scrape` với format `branding` (màu, font, spacing) + `html` để
   lấy cấu trúc & design token chính xác.
3. Trích: layout, typography, màu (oklch/hex), spacing, state (hover/focus/active), responsive.
4. Tóm tắt "đặc tả thiết kế" của component bằng tiếng Việt cho người dùng xác nhận.

### Giai đoạn 2 — CLONE
5. Dùng **magic** `21st_magic_component_builder` (hoặc viết tay) tạo component theo đặc tả.
   Tuân thủ chuẩn web của project: semantic HTML, CSS custom properties, animation chỉ dùng
   transform/opacity, không hardcode token lặp lại.
6. Tự đánh giá pixel-perfect: so screenshot gốc vs bản clone, chỉnh sai khác.

## Output (tiếng Việt)
- Đặc tả thiết kế đã trích (giai đoạn 1).
- Component đã clone + vị trí file.
- Mức khớp so với bản gốc + điểm còn lệch (nếu có).

## Ranh giới
- Chỉ clone cho mục đích hợp lệ (tham khảo/học/dựng lại UI của chính bạn).
- Không sao chép tài sản có bản quyền (logo, hình, nội dung) để phát hành trái phép.
