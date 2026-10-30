# SYSTEM X-RAY — CinBase TVC sau khi tái cấu trúc

Ngày kiểm chứng: **2026-10-07**  
Trang local: `http://127.0.0.1:4173/landings/Cinbase-tvc/index.html`

Tài liệu này mô tả bản triển khai hiện tại và đối chiếu với bằng chứng TVCAI trong `SYSTEM-XRAY-TVCAI.md`. Đây là bản chuyển hệ thống bố cục/hành vi sang thương hiệu CinBase, không phải bản sao nội dung hay tài sản của TVCAI.

## 1. Hệ thống làm gì?

Landing giới thiệu chương trình đào tạo sản xuất TVC bằng AI cho doanh nghiệp. Luồng thuyết phục:

`xem tác phẩm → khám phá Skill thật → nhận ra vấn đề vận hành → xem nền tảng → hiểu chương trình/quy trình → tách rõ phí → đọc FAQ → liên hệ`

Mục tiêu chính là CTA tư vấn đào tạo. CTA phụ đưa người xem sang CinAI Skills/Explore hoặc cộng đồng Zalo.

## 2. Bản đồ hệ thống

```text
[Announcement + Header]
          |
          v
[Hero 12 tác phẩm + rail]
          |
          v
[24 Skills + 10 bộ lọc]
          |
          v
[Vấn đề/Giải pháp] -> [CinAI tour]
          |
          v
[Đầu ra chương trình] -> [4 chặng] -> [4 lớp năng lực]
          |
          v
[Phù hợp/Không phù hợp] -> [Platform/B2B pricing]
          |
          v
[Zalo resource] -> [FAQ] -> [Phone/Email CTA]
```

Stack: HTML semantic, CSS thuần với custom properties, JavaScript thuần; không Tailwind CDN, không framework và không chat widget.

## 3. Luồng thực thi

1. Trình duyệt tải HTML, token CSS, global CSS và script local.
2. Poster hero và card Skill lấy từ asset local.
3. Hero chỉ gắn `src` cho video đang active; slide ẩn bị pause và tháo `src`.
4. Autoplay/chuyển slide chỉ chạy khi hero trong viewport, tab đang visible, người dùng chưa pause và hệ điều hành không yêu cầu reduced motion.
5. Filter Skill chỉ ẩn/hiện 24 card HTML sẵn có; không gọi API lúc runtime.
6. Process tabs và FAQ đổi state client-side; không gửi dữ liệu ra ngoài.
7. `tracking.js` ở localhost tự tắt Pixel/webhook theo `tracking-config.js`.

## 4. Luồng agent/tool

- Landing không chạy AI agent trực tiếp: **KHÔNG CÓ**.
- Người dùng được điều hướng sang CinAI để dùng Skill/nền tảng.
- Logic nội bộ `agent → model/tool → result` của CinAI: **KHÔNG CHẮC CHẮN**, không suy diễn trong landing.

## 5. ERD

Landing tĩnh, không có database: **KHÔNG CÓ ERD**.

24 Skill là snapshot công khai tại `extraction/tvcai-refresh/skills-catalog.json`, không phải bản sao database CinAI.

## 6. Bản đồ API và tài nguyên ngoài

| Mục | Runtime landing | Ghi chú |
|---|---|---|
| CinAI public Skills API | Không gọi | Chỉ dùng lúc extraction; snapshot lưu local |
| Hero MP4 | Có, theo yêu cầu | Tối đa một video hero có `src` tại một thời điểm |
| Google Fonts | Có | Inter, Manrope, Playfair Display |
| CinAI tour WEBM | Asset local | `preload="metadata"`, có controls |
| Meta Pixel / n8n | Tắt ở localhost | File tracking hiện hữu được giữ nguyên |
| Form/CRM | Không có | CTA dùng điện thoại/email/Zalo |

## 7. Vấn đề đã xử lý và rủi ro còn lại

- **CRITICAL — đã xử lý:** không còn nội dung ẩn vĩnh viễn nếu JavaScript không chạy; reveal là progressive enhancement.
- **MAJOR — đã xử lý:** đổi hero slide không còn kéo dọc cả trang; rail chỉ cuộn ngang.
- **MAJOR — đã xử lý:** 12 poster hero được lưu local, giảm tải poster từ khoảng 44 MB xuống khoảng 0,76 MB.
- **MAJOR — đã xử lý:** bổ sung pause/play, reduced motion động và chỉ tải video active.
- **MINOR — còn lại:** video tour local khoảng 4,8 MB nhưng chỉ preload metadata; cần đo lại khi triển khai qua CDN thật.
- **MINOR — còn lại:** số lượng/lượt dùng Skill là snapshot ngày 07/10/2026, có thể thay đổi trên CinAI.

## 8. Lộ trình rebuild đã thực hiện

1. Audit runtime TVCAI ở desktop/mobile và lưu DOM/network evidence.
2. Chốt token, section map, interaction map và hướng chuyển đổi thương hiệu.
3. Lấy 24 Skill từ endpoint công khai, tải card artwork về local.
4. Viết lại semantic HTML và design system CSS thuần.
5. Viết lại controller hero/filter/process/menu/FAQ.
6. Chạy local server, Chrome DevTools, Playwright và Lighthouse.
7. Lưu screenshot kiểm chứng và `extraction/tvcai-refresh/xray-diff.md`.

## 9. Luồng tương tác mẫu

### Hero

```text
click Next / pager / thumbnail
  -> normalize index
  -> pause + unload slide cũ
  -> activate slide mới
  -> gắn src + play nếu đủ điều kiện
  -> đồng bộ pager, thumbnail và live label
```

### Skill filter

```text
click category
  -> cập nhật aria-pressed
  -> đặt hidden cho card không khớp
  -> cập nhật số lượng
  -> reset scrollLeft rail
```

### Tư vấn

```text
CTA nội trang -> #contact
  -> người dùng tự chọn gọi điện hoặc email
  -> không có form, không có ghi dữ liệu tự động
```
