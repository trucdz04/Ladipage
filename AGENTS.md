# Hướng dẫn Codex cho repo LadiPage

Repo này chứa landing page tĩnh, template tái sử dụng, bản clone tham chiếu và workflow n8n phục vụ marketing cho CinAI.

## Cấu trúc chính

- `landings/`: các landing đang phát triển hoặc đã QC.
- `templates/`: template tái sử dụng; giá CinAI lấy từ `templates/_shared/cinai-pricing.md` và `.json`.
- `clones/`: bản tái tạo từ website tham chiếu cùng bằng chứng trong `extraction/`.
- `automation/n8n/`: workflow tracking và nurture; đọc README tương ứng trước khi sửa workflow.
- `.codex/skills/`: quy trình chuyên biệt Codex có thể tự chọn hoặc được gọi bằng `$skill-name`.

## Quy ước làm việc

- Trao đổi và báo cáo cho người dùng bằng tiếng Việt rõ ràng; code, tên biến và cấu hình giữ theo chuẩn kỹ thuật của file hiện có.
- Giữ nguyên hành vi khi refactor nếu người dùng không yêu cầu thay đổi. Không deploy, kích hoạt workflow, gửi email hoặc sửa dữ liệu dịch vụ bên ngoài nếu chưa được yêu cầu rõ.
- Không ghi secret vào repo. MCP nhận secret từ biến môi trường được liệt kê trong `.env.example`.
- Tôn trọng thay đổi đang có trong worktree; không xóa hoặc hoàn tác phần không thuộc nhiệm vụ.
- Với lỗi/audit, phân loại `CRITICAL`, `MAJOR`, `MINOR` và nêu bằng chứng, nguyên nhân, cách xử lý.

## Chọn skill

- `$landing-prompt`: chuẩn hóa brief/prompt cho landing page.
- `$fcb-copywriting`: chiến lược nội dung, cấu trúc section và copy theo FCB/CRO.
- `$clone-template`: phân tích và tái tạo toàn bộ landing page từ URL.
- `$meta-tracking`: Pixel, CAPI, EMQ, deduplication và tracking cross-domain.
- `$lead-nurture`: chuỗi email nurture bằng n8n và Lark.

Có thể gọi skill bằng `$tên-skill`; với yêu cầu tự nhiên, Codex tự chọn skill phù hợp. Không dùng các slash command trong `.claude/commands/` như thể chúng là lệnh Codex.

## MCP

- Dùng `chrome-devtools` để inspect/debug runtime và performance; dùng `playwright` cho luồng người dùng và ảnh đa breakpoint.
- Dùng `firecrawl` khi cần scrape/map nội dung có cấu trúc; không gọi nếu trình duyệt hiện có đã đủ.
- Dùng `n8n`, `meta-ads` và `lark` ở chế độ đọc/validate trước. Mọi thao tác ghi lên dịch vụ thật cần nằm trong phạm vi người dùng đã yêu cầu.
- Dùng `magic` khi cần sinh hoặc tinh chỉnh component UI; ưu tiên hệ thiết kế và asset sẵn có của repo.

## Kiểm tra

Repo không có một test runner chung. Sau thay đổi, chạy kiểm tra nhỏ nhất phù hợp với khu vực đã sửa: mở landing bằng local server, kiểm console/network, và dùng Playwright ở các breakpoint liên quan. Với workflow n8n, validate JSON/workflow trước khi import hoặc activate.

Khi hoàn tất, báo cáo ngắn: phần đã đổi, kiểm tra đã chạy, trạng thái `OK` hoặc `BLOCKED`, và rủi ro/cấu hình còn thiếu.
