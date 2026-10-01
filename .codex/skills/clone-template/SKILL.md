---
name: clone-template
description: Phân tích và tái tạo toàn bộ landing page từ một URL, gồm design tokens, nội dung, responsive, tương tác và kiểm chứng trực quan. Dùng khi cần dựng lại cả trang; không dùng cho một component đơn lẻ hoặc chỉ audit trang.
---

# Clone toàn bộ landing page

Tái tạo một landing page theo bằng chứng quan sát được từ trang nguồn. Tách rõ hai giai đoạn: trích xuất trước, triển khai sau. Báo cáo cho người dùng bằng tiếng Việt.

## Kết quả cần có

- Bản đồ section và stack nguồn.
- `extraction/` chứa bằng chứng về token, nội dung, hành vi và performance cần thiết.
- `SYSTEM-XRAY.md` mô tả trang nguồn trước khi code.
- Bản triển khai trong `clones/<domain>/`, dùng asset hợp lệ và chạy được tại local.
- Ảnh kiểm chứng đa breakpoint và `extraction/xray-diff.md` ghi phần còn lệch.

## Phạm vi

Dùng skill này khi người dùng muốn clone hoặc tái tạo toàn bộ trang. Nếu chỉ cần:

- một component: phân tích và triển khai component đó trực tiếp;
- debug/audit: dùng `chrome-devtools` và chỉ báo cáo phát hiện;
- nội dung có cấu trúc: dùng `firecrawl` nếu trình duyệt không đủ;
- tracking: dùng `$meta-tracking`.

## Quy trình

### 1. Recon và lập bản đồ

Mở URL bằng `chrome-devtools`, chụp toàn trang, đọc DOM/accessibility tree và nhận diện section. Xác định stack nguồn từ HTML, script và dấu hiệu runtime. Chốt stack đích theo repo hoặc yêu cầu người dùng; không tự thêm framework nếu HTML/CSS/JS tĩnh đã đủ.

Ghi bản đồ section, viewport mục tiêu và những phần tương tác. Nếu lựa chọn stack hoặc phạm vi còn có thể làm thay đổi lớn kết quả, trình bày giả định trước khi build.

### 2. Trích xuất bằng chứng

Tạo `extraction/` trong thư mục clone và chỉ thu thập dữ liệu cần cho trang hiện tại:

- `tokens-raw.md`: màu, font, spacing, radius, shadow, breakpoint;
- `content.md`: heading, body, CTA, pricing và nội dung cần giữ;
- `behavior-map.md`: click, hover, scroll, modal, tab, carousel, form;
- `animations.md`: transition/keyframe, duration và easing quan trọng;
- `performance.md`: LCP/INP/CLS hoặc nút thắt quan sát được;
- `logic-<component>.md`: input → state → render cho component động.

Dùng `firecrawl` cho scrape/map có cấu trúc khi hữu ích. Dùng `chrome-devtools` cho computed styles, network, runtime và performance. Đọc [behavior-extraction.md](references/behavior-extraction.md) khi trang có tương tác hoặc animation đáng kể; đọc [mcp-compare-loop.md](references/mcp-compare-loop.md) khi phải tái tạo logic động.

Không thu thập token, cookie, dữ liệu cá nhân hoặc payload nhạy cảm vào artifact.

### 3. System X-Ray

Trước khi triển khai, tổng hợp bằng chứng thành `SYSTEM-XRAY.md`. Đọc [system-xray-prompt.md](references/system-xray-prompt.md) khi cần cấu trúc 9 phần đầy đủ.

Chỉ mô tả điều quan sát hoặc truy vết được. Đánh dấu `KHÔNG CHẮC CHẮN` cho suy luận; ghi `KHÔNG CÓ` cho backend, DB hoặc agent flow không tồn tại. Không tạo ERD/API giả cho landing tĩnh.

### 4. Thiết kế và scaffold

Tạo output tại `clones/<domain>/` hoặc vị trí người dùng chỉ định. Tái sử dụng convention hiện có trong repo:

```text
clones/<domain>/
├── SYSTEM-XRAY.md
├── SYSTEM-XRAY-CLONE.md
├── extraction/
├── index.html
├── styles/
├── scripts/
└── assets/
```

Chuẩn hóa token thành CSS custom properties. Tải hoặc tái sử dụng asset chỉ khi quyền sử dụng phù hợp; với logo, ảnh hoặc nội dung có bản quyền của bên khác, dùng placeholder cho bản phát hành công khai.

### 5. Build theo section

Triển khai lần lượt từng section để giới hạn phạm vi sai lệch. Với mỗi section:

1. Dựng semantic HTML và responsive layout từ token chung.
2. Tái tạo hành vi từ `behavior-map.md`/`logic-*.md`; không sao chép script bị minify hoặc mã không rõ giấy phép.
3. Chụp section ở viewport liên quan, so với nguồn và chỉnh sai khác rõ ràng trước khi chuyển tiếp.

Dùng MCP `magic` khi component phức tạp thực sự hưởng lợi từ gợi ý UI, nhưng giữ design system và asset của repo làm nguồn chính.

### 6. Verify

Dùng Playwright cho luồng người dùng và screenshot tại các breakpoint phù hợp; mặc định cân nhắc 320, 375, 768, 1024 và 1440. Dùng `chrome-devtools` để kiểm console, network và performance.

Với component động, chạy vòng so sánh trong [mcp-compare-loop.md](references/mcp-compare-loop.md). Ghi khác biệt vào `extraction/xray-diff.md` theo mức:

- `CRITICAL`: vỡ layout, thiếu section, hỏng flow chính;
- `MAJOR`: sai hành vi, typography, màu hoặc spacing dễ nhận thấy;
- `MINOR`: sai khác nhỏ không chặn sử dụng.

Tạo `SYSTEM-XRAY-CLONE.md` khi phạm vi đủ lớn để đối chiếu cấu trúc và data flow. Không tuyên bố “pixel-perfect” nếu chưa có ảnh/bằng chứng so sánh.

### 7. Tracking khi được yêu cầu

Tracking không mặc định nằm trong mọi bản clone. Khi người dùng yêu cầu, dùng `$meta-tracking` và đọc [tracking-integration.md](references/tracking-integration.md). Không tự kích hoạt workflow n8n, Pixel, CAPI hoặc ghi dữ liệu Lark/Meta ngoài phạm vi đã được giao.

## Báo cáo hoàn tất

Nêu ngắn gọn:

1. Trang/section đã tái tạo và stack đích.
2. File chính đã tạo hoặc sửa.
3. Kiểm tra đã chạy và breakpoint đã đối chiếu.
4. Lỗi còn lại theo `CRITICAL / MAJOR / MINOR`.
5. Trạng thái `OK` hoặc `BLOCKED` cùng cấu hình còn thiếu.
