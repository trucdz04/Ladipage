# xray-diff.md — Đối chiếu SYSTEM-XRAY (nguồn) ↔ SYSTEM-XRAY-CLONE

| Phần X-Ray | Trạng thái | Phân loại |
|------------|-----------|-----------|
| 1 Giải thích hệ thống | Tương đương | — |
| 2 Bản đồ hệ thống (20 khối) | Tương đương | — |
| 3 Luồng thực thi | Tương đương (bỏ tracking/checkout) | có chủ đích |
| 4 Luồng agent/tool | KHÔNG CÓ ↔ KHÔNG CÓ | — |
| 5 ERD | KHÔNG CÓ ↔ KHÔNG CÓ | — |
| 6 Bản đồ API | Tĩnh local + Vimeo (bỏ checkout/tracking) | có chủ đích |
| 7 Vấn đề | Clone không phát sinh lỗi mới; sửa 404 poster | MINOR (đã xử lý) |
| 8 Lộ trình rebuild | Hoàn tất 1→6 | — |
| 9 Flowchart CRUD | Tương đương | — |

## Lệch còn lại (đều có chủ đích, không phải lỗi)
- Tracking 4 lớp / Pixel / Google Ads: **bỏ** (user chọn không tracking).
- Checkout FastSpring: **bỏ** → CTA trỏ in-page `#pricing`/`#buynow`.
- Social-proof widget: **bỏ** (3rd-party).

→ **PASS**: 2 báo cáo tương đương về cấu trúc & data flow.
