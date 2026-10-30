# Checklist chỉnh sửa Cinbase TVC theo nhịp bố cục TVCAI

> Mục tiêu: học cách TVCAI dẫn dắt người xem từ bằng chứng trực quan đến hành động, nhưng giữ định vị Cinbase là chương trình đào tạo AI B2B. Không sao chép nội dung, tài sản hoặc nhận diện của TVCAI.

## Trạng thái triển khai — 07/10/2026

- [x] Viết lại local bằng HTML/CSS/JS thuần; gỡ Tailwind CDN và chat widget cũ.
- [x] Dựng hero cinematic 12 tác phẩm, poster local, pause/play và chỉ tải video active.
- [x] Thêm 24 Skill thật từ 10 danh mục; ảnh local, filter và rail responsive.
- [x] Rút trang về 12 section theo nhịp bằng chứng → phương pháp → phạm vi → CTA.
- [x] Tách giá nền tảng CinAI và báo giá đào tạo; giữ disclaimer ưu đãi.
- [x] Kiểm tra Chrome/Playwright ở 375 px và 1440 px; không overflow ngang.
- [x] Lighthouse desktop: Accessibility 100, Best Practices 100, SEO 100, Agentic Browsing 100; performance trace LCP 275 ms, CLS 0,02 trên local.
- [ ] Cần chủ doanh nghiệp xác nhận: domain/canonical, pháp nhân, quyền sử dụng media, quy mô lớp, lịch học, phạm vi bàn giao và điều khoản ưu đãi trước deploy.
- [ ] Cần chạy lại Lighthouse/network trên hosting production; local preview đã đạt toàn bộ 4 nhóm 100 điểm nhưng không thay thế kiểm thử hạ tầng thật.

## 1. Mục tiêu và nguyên tắc

- [ ] Giữ đúng đối tượng chính: quản lý doanh nghiệp, đội marketing/sales/truyền thông và đơn vị đào tạo.
- [ ] Xác định mục tiêu chuyển đổi chính: đăng ký buổi khảo sát/tư vấn đào tạo.
- [ ] Xác định CTA phụ: xem chương trình mẫu hoặc nhận checklist/tài liệu miễn phí.
- [ ] Giữ tối đa 11–12 section chính.
- [ ] Mỗi section chỉ trả lời một câu hỏi của người mua.
- [ ] Dùng bằng chứng thật; không tạo case study, số liệu, logo hoặc khan hiếm giả.
- [ ] Không sao chép copy, media hoặc nhận diện của TVCAI.
- [ ] Giữ stack HTML/CSS/JS tĩnh hiện tại nếu không có yêu cầu đổi framework.

## 2. Dữ liệu cần chốt trước khi sửa

### Offer B2B

- [ ] Chốt người ra quyết định và người trực tiếp tham gia học.
- [ ] Chốt quy mô lớp tối thiểu/tối đa.
- [ ] Chốt số buổi, thời lượng và hình thức học.
- [ ] Chốt các module bắt buộc và module tùy chọn.
- [ ] Chốt đầu ra bàn giao: SOP, template, checklist duyệt, bài thực hành, tài liệu nội bộ.
- [ ] Chốt lịch/kênh hỗ trợ sau đào tạo.
- [ ] Chốt phạm vi phí đào tạo.
- [ ] Chốt phí tài khoản nền tảng và credit riêng.
- [ ] Chốt nguyên tắc báo giá nếu chưa có giá niêm yết.
- [ ] Chốt điều kiện ưu đãi 1.000 suất, ba tháng giảm 50% và hai tháng tặng.
- [ ] Chốt pháp nhân, thông tin xuất hóa đơn và điều khoản hợp đồng.

### Bằng chứng

- [ ] Xác minh hồ sơ giảng viên/chuyên gia.
- [ ] Xác minh số dự án hoặc số doanh nghiệp đã đào tạo.
- [ ] Xin quyền sử dụng logo khách hàng/đối tác.
- [ ] Chuẩn bị ít nhất một case study có đầu vào, quy trình và kết quả đo được.
- [ ] Chuẩn bị testimonial có tên, vai trò và đơn vị rõ ràng.
- [ ] Xác minh quyền sử dụng toàn bộ video/ảnh xuất hiện trên landing.
- [ ] Ghi nhãn rõ media nào là demo nền tảng, media nào là kết quả đào tạo.

## 3. Cấu trúc section mục tiêu

### 01 — Header

- [ ] Logo Cinbase rõ và dẫn về đầu trang.
- [ ] Chỉ giữ 4–5 mục điều hướng quan trọng.
- [ ] CTA chính thống nhất: `Đăng ký tư vấn đào tạo`.
- [ ] Header mobile không che nội dung hoặc gây tràn ngang.
- [ ] Announcement bar chỉ hiển thị ưu đãi đã được phê duyệt.

### 02 — Hero + video chứng minh

- [ ] H1 nói rõ đối tượng và kết quả trong 5 giây.
- [ ] Subheadline giải thích phương pháp bằng một đến hai câu.
- [ ] Có một CTA chính và một CTA phụ.
- [ ] Chỉ tải và phát một video nền tại một thời điểm; rail còn lại dùng poster đến khi được chọn.
- [ ] Video có poster, nút phát, phụ đề hoặc nội dung thay thế.
- [ ] Không dùng số liệu hoặc lời hứa chưa được xác minh.

### 03 — Các đầu việc có thể đưa vào đào tạo

- [ ] Chọn 3–5 đầu việc gần với nhu cầu doanh nghiệp.
- [ ] Ưu tiên marketing, nội dung bán hàng và truyền thông nội bộ.
- [ ] Mỗi đầu việc có đầu vào, đầu ra và người duyệt.
- [ ] Không biến section thành thư viện skill dài.

### 04 — Vấn đề hiện tại

- [ ] Nêu rõ tình trạng “có công cụ nhưng chưa có cách làm chung”.
- [ ] Phân biệt vấn đề công cụ, quy trình và quản trị chất lượng.
- [ ] Dùng ngôn ngữ của người quản lý: thời gian, chi phí, người duyệt, bàn giao.
- [ ] Không phóng đại hoặc dùng nỗi sợ thiếu căn cứ.

### 05 — Vấn đề → phương pháp Cinbase

- [ ] Dùng bố cục đối chiếu hai cột dễ quét.
- [ ] Mỗi vấn đề có một cách xử lý tương ứng.
- [ ] Làm rõ Cinbase đào tạo đội ngũ, không thay thế toàn bộ nhân sự/hệ thống.
- [ ] Đặt CTA tư vấn sau section nếu người đọc đã hiểu cơ chế.

### 06 — Quy trình đào tạo bốn bước (conversion hinge)

- [ ] Bước 1: khảo sát công việc và dữ liệu được phép sử dụng.
- [ ] Bước 2: học và thực hành trên brief thật.
- [ ] Bước 3: chuẩn hóa thành SOP, template và checklist duyệt.
- [ ] Bước 4: đội ngũ tự vận hành và đánh giá kết quả.
- [ ] Mỗi bước có đầu vào, hoạt động và đầu ra.
- [ ] Đây là section nổi bật nhất về thị giác và nội dung.
- [ ] Tabs/accordion hoạt động bằng chuột và bàn phím.

### 07 — Đầu ra doanh nghiệp nhận được

- [ ] Liệt kê rõ tài liệu bàn giao.
- [ ] Nêu cách người quản lý kiểm tra đầu ra.
- [ ] Nêu cách đo thời gian, lượt thử, credit và tỷ lệ được duyệt.
- [ ] Phân biệt “kết quả kỳ vọng” với “cam kết hợp đồng”.
- [ ] Gộp nội dung trùng từ section `features` và `outcomes` hiện tại.

### 08 — Chương trình/module mẫu

- [ ] Chia nội dung theo công việc thay vì liệt kê quá nhiều bài lẻ.
- [ ] Mỗi module có mục tiêu, bài thực hành và đầu ra.
- [ ] Cho biết phần nào bắt buộc, phần nào tùy nhu cầu.
- [ ] Cho phép tải/xem chương trình mẫu nếu tài liệu đã được duyệt.
- [ ] Không dùng số lượng bài học như bằng chứng duy nhất về giá trị.

### 09 — Bằng chứng và năng lực

- [ ] Có hồ sơ giảng viên/chuyên gia đã xác minh.
- [ ] Có case study hoặc bằng chứng dự án thật.
- [ ] Có logo/press mention chỉ khi được phép sử dụng.
- [ ] Video demo nền tảng được ghi nhãn, không gọi là kết quả học viên.
- [ ] Nếu chưa có social proof B2B, ghi rõ là thiếu và không dựng placeholder giả.

### 10 — Phù hợp/không phù hợp

- [ ] Nêu rõ doanh nghiệp nào nên tham gia.
- [ ] Nêu rõ trường hợp chưa phù hợp.
- [ ] Đề cập yêu cầu về thời gian thực hành, dữ liệu và người duyệt.
- [ ] Dùng section này để tự sàng lọc lead.

### 11 — Phạm vi chương trình và báo giá

- [ ] Đổi tên `Pricing` nếu chưa có giá niêm yết.
- [ ] Tách phí đào tạo, phí nền tảng và credit.
- [ ] Nêu yếu tố ảnh hưởng đến báo giá.
- [ ] Trình bày rõ số người, số buổi, đầu ra và hỗ trợ.
- [ ] Ghi đầy đủ điều kiện voucher; không để người đọc hiểu là giảm 50% cả năm.
- [ ] CTA chính dẫn tới tư vấn/báo giá.
- [ ] CTA tài liệu miễn phí chỉ là phương án phụ.

### 12 — FAQ + CTA cuối + footer

- [ ] FAQ xử lý chi phí, trình độ đầu vào, dữ liệu, credit, hỗ trợ và quyền sử dụng.
- [ ] FAQ không lặp lại nguyên văn các section trước.
- [ ] CTA cuối nhắc lại kết quả và bước tiếp theo.
- [ ] Hotline, email và pháp nhân chính xác.
- [ ] Footer phân biệt Cinbase, CinAI Explore và tài liệu cộng đồng.

## 4. Nội dung cần gộp hoặc loại bỏ

- [ ] Loại section `models` nếu chỉ đóng vai trò spacer/nhãn.
- [ ] Gộp hero cards, skill tabs, Explore highlight và gallery thành một khối ứng dụng thực tế.
- [ ] Gộp “Đào tạo để đội ngũ làm lại được” với “Đánh giá bằng việc đội ngũ làm được”.
- [ ] Không lặp CTA Explore ở quá nhiều section.
- [ ] Chuyển “500 workflow/4.000 skill” xuống dưới offer hoặc thành CTA phụ.
- [ ] Ghi rõ tài liệu miễn phí không đồng nghĩa với quyền lợi Pro/đào tạo.
- [ ] Giảm carousel nếu nội dung có thể trình bày bằng grid/card.
- [ ] Loại mọi nội dung Pro cũ còn sót không liên quan offer B2B.

## 5. Copywriting và CRO

- [ ] Giữ chiến lược GC1: Learn → Feel → Do, ưu tiên lý trí.
- [ ] Hero bắt đầu từ kết quả của khách hàng, không bắt đầu bằng “Chúng tôi”.
- [ ] Mỗi câu có thông tin cụ thể hoặc lý do tồn tại.
- [ ] Tránh “toàn diện”, “đột phá”, “chuyên nghiệp”, “đảm bảo doanh số” nếu không có bằng chứng.
- [ ] CTA chính xuất hiện ít nhất ba lần.
- [ ] CTA chính dùng cùng một nhãn hoặc cùng một ý định xuyên suốt trang.
- [ ] Có ít nhất một micro-CTA ít rủi ro: xem chương trình mẫu/nhận checklist.
- [ ] Có risk reversal rõ: phạm vi khảo sát, xác nhận báo giá, dữ liệu được phép dùng.
- [ ] Người lạ hiểu offer trong 30 giây.
- [ ] Có một người độc lập review CRO sau khi hoàn thành copy.

## 6. UI và responsive

- [ ] Giữ hệ màu và nhận diện Cinbase, không sao chép TVCAI.
- [ ] Chuẩn hóa container, section spacing và type scale.
- [ ] Giảm số kiểu card và kiểu nền không cần thiết.
- [ ] Nếu dùng video làm nền hero, phải có gradient trái/đáy đủ mạnh để copy và CTA luôn dễ đọc.
- [ ] Nội dung quan trọng không phụ thuộc animation mới xuất hiện.
- [ ] CTA có vùng chạm tối thiểu 44×44px.
- [ ] Không có text quá nhỏ hoặc contrast thấp.
- [ ] Không tràn ngang ở 320px.
- [ ] Kiểm tra viewport 320, 375, 768, 1024 và 1440px.
- [ ] Curriculum, bảng phạm vi và FAQ đọc tốt trên mobile.
- [ ] Tôn trọng `prefers-reduced-motion`.

## 7. Media và hiệu năng

- [ ] Mọi ảnh có `width`, `height` hoặc `aspect-ratio`.
- [ ] Mọi ảnh nội dung có `alt` phù hợp.
- [ ] Mỗi video có poster.
- [ ] Chỉ video hero được ưu tiên tải.
- [ ] Video dưới fold lazy-load hoặc chỉ gán nguồn khi gần viewport.
- [ ] Không autoplay nhiều video cùng lúc.
- [ ] Có nút play/pause/mute rõ ràng.
- [ ] Nén WebP/AVIF và video ở bitrate phù hợp.
- [ ] Không dùng tài nguyên bên thứ ba không rõ quyền sử dụng.
- [ ] LCP mobile nằm trong ngưỡng chấp nhận trước khi chạy quảng cáo.
- [ ] CLS không bị ảnh/video làm dịch chuyển layout.

## 8. SEO

- [ ] Chỉ có một `h1`.
- [ ] `h1` tập trung vào “đào tạo AI cho doanh nghiệp”.
- [ ] `h2` phản ánh đúng thứ tự section.
- [ ] Title và meta description khớp search intent B2B.
- [ ] Canonical trỏ về URL sạch, không chứa `fbclid`/UTM.
- [ ] Open Graph image và metadata chính xác.
- [ ] Có favicon và theme color.
- [ ] Cân nhắc schema `Service`, `Course`, `Organization` và `FAQPage`.
- [ ] Structured data dùng đúng dữ liệu nhìn thấy trên trang.
- [ ] `robots.txt` và sitemap phù hợp production.
- [ ] Không tuyên bố xếp hạng SEO khi chưa có dữ liệu.

## 9. Tracking và lead flow

- [ ] Cấu hình GA4 production.
- [ ] Cấu hình Meta Pixel production.
- [ ] `PageView` và `ViewContent` không bắn trùng.
- [ ] CTA tư vấn có event riêng.
- [ ] CTA tài liệu miễn phí có event riêng.
- [ ] CTA Explore có event riêng.
- [ ] Giữ UTM/fbclid khi chuyển sang form hoặc CRM.
- [ ] Test form đến đúng CRM/sheet/email nhận lead.
- [ ] Không hiển thị “đã nhận yêu cầu” nếu backend chưa xác nhận.
- [ ] Kiểm tra deduplication nếu dùng Browser Pixel + CAPI.
- [ ] Có người phụ trách phản hồi lead và SLA nội bộ.
- [ ] Đặt lịch review dữ liệu sau 7 ngày chạy traffic.

## 10. Kỹ thuật

- [ ] Gỡ Tailwind CDN khỏi production build.
- [ ] Giữ hoặc gom CSS vào hệ token hiện có.
- [ ] Không làm hỏng `scripts/main.js`, tabs, FAQ và anchors hiện tại.
- [ ] Không ghi secret/API key vào repo.
- [ ] Tracking config chỉ đọc biến/cấu hình được phép công khai.
- [ ] Không có request 4xx/5xx.
- [ ] Không có lỗi JavaScript trên console.
- [ ] Không có mixed content hoặc CSP violation chặn tài nguyên chính.
- [ ] Tất cả link ngoài dùng URL đúng và thuộc tính an toàn phù hợp.
- [ ] Tel/mailto/Zalo hoạt động trên thiết bị thật.

## 11. Quy trình triển khai

### Pha 1 — Chốt brief và dữ liệu

- [ ] Hoàn thành toàn bộ mục 2.
- [ ] Chốt CTA chính/phụ.
- [ ] Chốt bằng chứng được phép công bố.

### Pha 2 — Cấu trúc và copy

- [ ] Chốt sitemap một trang và thứ tự section.
- [ ] Viết copy theo từng section, không viết toàn trang trong một lượt.
- [ ] Review fact và CRO.

### Pha 3 — Build desktop

- [ ] Dựng theo thứ tự section.
- [ ] Kiểm tra từng section trước khi chuyển tiếp.
- [ ] Giữ design token và component có thể tái sử dụng.

### Pha 4 — Mobile và accessibility

- [ ] Điều chỉnh layout theo các breakpoint mục tiêu.
- [ ] Test keyboard, focus, reduced motion và contrast.

### Pha 5 — SEO, tracking và hiệu năng

- [ ] Hoàn thành mục 7–10.
- [ ] Không kích hoạt dịch vụ ngoài khi chưa được yêu cầu.

### Pha 6 — QA và duyệt xuất bản

- [ ] Chụp screenshot desktop/mobile.
- [ ] Kiểm tra console và network.
- [ ] Kiểm tra toàn bộ CTA, tab, FAQ, anchor và media.
- [ ] Chạy Lighthouse SEO/accessibility/best practices.
- [ ] Test lead flow end-to-end.
- [ ] Người phụ trách kinh doanh duyệt offer và điều khoản.
- [ ] Người phụ trách thương hiệu duyệt copy và media.
- [ ] Chỉ deploy khi tất cả mục chặn bên dưới đã hoàn tất.

## 12. Các mục chặn xuất bản

- [ ] Giá/phạm vi chương trình B2B đã được duyệt.
- [ ] Điều kiện voucher đã được duyệt bằng văn bản.
- [ ] Có quyền sử dụng media và logo.
- [ ] Bằng chứng khách hàng/case study đã được xác minh.
- [ ] Form và nơi nhận lead đã test thành công.
- [ ] GA4/Pixel/CAPI được cấu hình đúng theo phạm vi yêu cầu.
- [ ] Không còn Tailwind CDN trong production.
- [ ] Không có lỗi console/network chặn luồng chính.
- [ ] Desktop và mobile đều đạt QA.

## 13. Tiêu chí hoàn thành

- [ ] Landing còn tối đa 12 section chính.
- [ ] Một CTA chính xuyên suốt trang.
- [ ] Conversion hinge nổi bật và giải thích được cơ chế đào tạo.
- [ ] Không còn nội dung trùng lặp giữa skill, Explore và tài nguyên miễn phí.
- [ ] Offer B2B đủ thông tin để người quản lý quyết định bước tiếp theo.
- [ ] Có bằng chứng thật hoặc ghi rõ phần bằng chứng còn thiếu.
- [ ] SEO, performance, accessibility và tracking đã được kiểm tra.
- [ ] Trạng thái cuối: `OK` hoặc `BLOCKED` kèm lý do cụ thể.
