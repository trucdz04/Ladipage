---
description: Điều phối tác vụ web — tự chọn skill/agent phù hợp (inspect / extract / clone / audit) dựa trên yêu cầu + URL.
---

# /web — Bộ điều phối tác vụ web

Yêu cầu người dùng (kèm URL nếu có): **$ARGUMENTS**

## Nhiệm vụ
Đọc yêu cầu trên và **tự chọn đúng hướng xử lý**, theo nguyên tắc vàng
*"một prompt = một phần; phân tích trước, hành động sau"*:

| Ý định của người dùng | Hành động |
|----------------------|-----------|
| "xem / phân tích / debug trang này" | Gọi agent **mcp-chrome-power-user** (inspect realtime) |
| "lấy nội dung / dữ liệu / bài viết" | Dùng **firecrawl** (`firecrawl_scrape`/`firecrawl_extract`) |
| "tìm kiếm / nghiên cứu chủ đề" | Dùng **firecrawl** (`firecrawl_search`) |
| "clone / sao chép giao diện / component" | Chạy quy trình `/clone-ui` |
| "audit / kiểm tra lỗi-bảo mật-hiệu năng" | Chạy quy trình `/audit-site` |
| "test luồng người dùng" | Gọi agent **qa-automation-agent** (playwright) |
| "tự động hoá / nối workflow" | Gọi agent **mcp-n8n-integrator** |

## Cách làm
1. Xác định ý định + URL từ `$ARGUMENTS`. Nếu thiếu URL, hỏi lại ngắn gọn.
2. Nêu 1 dòng: "Tôi sẽ dùng <agent/skill> vì <lý do>."
3. Thực hiện, rồi báo cáo bằng **tiếng Việt phi kỹ thuật** (tổng quan → phát hiện → đề xuất).
