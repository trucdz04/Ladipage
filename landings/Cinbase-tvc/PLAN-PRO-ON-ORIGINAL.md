# Kế hoạch chỉnh CinBase TVC gốc để tập trung bán CinAI Pro

Trạng thái: đã được người dùng duyệt và triển khai trên template gốc ngày 01/10/2026. Bản local đã kiểm tra ở 375, 768 và 1440 px; chưa deploy.

## Cơ sở và phạm vi

- Template chuẩn: `landings/Cinbase-tvc/index.html` tại commit `6a337f6` của repo, cùng `styles/tokens.css`, `styles/global.css`, `scripts/main.js`, `scripts/i18n.js`.
- Bản index hiện tại là bản thiết kế lại không đúng ý người dùng; không dùng nó làm cơ sở triển khai tiếp.
- Giữ cấu trúc trang dài, màu nền tối/vàng kem, font, spacing, kiểu nút/card, hero căn giữa có video capsule, ba thẻ hero hover, sticky crossfade ngành nghề, tabs quy trình, marquee video, FAQ, mobile menu.
- Ảnh người dùng cung cấp là nguồn nội dung offer, không phải yêu cầu đổi toàn trang sang xanh lime.
- Tập trung bán gói Pro 25 USD/tháng. Quyền lợi theo brief: Gemini Omni 1.1 Flash và Veo 3.1 Lite không giới hạn; 500 workflow; hơn 4.000 skill; voucher giảm 50%, giới hạn chương trình 100 voucher.
- Không tự suy ra giá sau voucher, kỳ áp dụng, số voucher còn lại, quà tặng miễn phí hoặc quyền lợi ngoài brief.

## Bảng thay đổi từng section

| Section gốc | Giữ nguyên | Nội dung hiện tại | Đề xuất chỉnh / thêm |
|---|---|---|---|
| 00 Announcement | Thanh thông báo, nút đóng, màu vàng kem | Tặng demo, từ 79.000đ/video | “CinAI Pro 25 USD/tháng — tặng voucher giảm 50%, giới hạn 100 voucher.” Nút “Xem ưu đãi Pro” đến `#pricing`. |
| 01 Header | Logo CinBase, nav pill, menu mobile, vị trí nút | Dịch vụ / Ngành nghề / Xem báo giá / Nhận tư vấn | Giữ thương hiệu template; nhãn “Tính năng”, “Ứng dụng”, “Gói Pro”; CTA chính “Đăng ký CinAI Pro”, phụ “Xem gói Pro”. |
| 02 Hero | Căn giữa, headline hai hàng xen video capsule, nền glow | “Cả một hãng phim AI cho doanh nghiệp / TVC & video marketing chuẩn điện ảnh” | “Cả một studio AI trong gói Pro / Tạo ảnh & video chỉ 25 USD/tháng”. Mô tả nêu hai model không giới hạn và kho workflow/skill. |
| Hero CTA | Hai nút hiện có | Nhận video demo / Xem bảng giá & cam kết | “Đăng ký CinAI Pro” đến trang đăng ký; “Xem nền tảng hoạt động” đến video Explore. Không mở form demo cho nút đăng ký. |
| Hero stats | Hàng bốn chỉ số và logo mạng xã hội | −80%, X3, −70%, 500+ video/tháng | 25 USD/tháng / 500 workflow / 4.000+ skill / 2 model không giới hạn. Không dùng số “500” như số video. |
| Ba hero card | Video, poster, hover accordion, liên kết preview workflow | TVC quảng cáo / Video bán hàng & social / Video thương hiệu & đào tạo | Giữ ba nhóm ứng dụng; đổi văn phong từ thuê sản xuất sang tự tạo nội dung trên CinAI; CTA “Khám phá workflow” hoặc “Xem quyền lợi Pro”. |
| 02c Problem | Bố cục hai cột so sánh | Dịch vụ CinBase giải quyết chi phí quay/lỗi kỹ thuật | “Bạn muốn làm nội dung, không muốn bắt đầu lại từ đầu.” So sánh tự ghép công cụ với điểm bắt đầu bằng workflow và skill. Bỏ cam kết hiệu suất không có bằng chứng áp dụng cho gói mới. |
| 03 Models strip | Logo strip, kích thước, cách trình bày | Engine AI + nền tảng xuất bản | Nhấn tên hai model thuộc quyền lợi Pro. Phân biệt logo hệ sinh thái với quyền lợi được bao gồm, tránh hiểu tất cả model đều unlimited. |
| 04 Tools overview | Tabs/card và media hiện có | “Một pipeline, đủ mọi định dạng video” | “Một gói Pro, nhiều cách tạo nội dung.” Bổ sung hai badge tên model không giới hạn bằng kiểu badge hiện có. |
| Mới: Explore highlight | Dùng container, surface, border, font của template | Chưa có video quay Explore | Thêm một section gọn ngay sau Tools overview, trước sticky ngành nghề. Heading “Xem CinAI hoạt động ngay trên trình duyệt”; video 19 giây đã quay, poster thật, controls, playsinline, preload metadata; liên kết mở Explore. |
| 05 Use cases | Toàn bộ sticky crossfade, 5 ngành, video nền | Mô tả thuê sản xuất theo ngành | Chỉnh mô tả thành tình huống người dùng tự tạo với nền tảng; giữ ngành E-commerce, F&B, BĐS, Beauty, Giáo dục. CTA về Explore/Pro, không hứa giao video thuê. |
| 05b Ba trụ cột | Grid ba card và icon | Nhất quán nhân vật / Biến thể hàng loạt / Thư viện Workflow | “500 workflow”, “Hơn 4.000 skill”, “Hai model không giới hạn”; mỗi card giải thích ngắn lợi ích, dùng thành phần có sẵn. |
| 06 Platform features | Bento grid, media, hiệu ứng | Pipeline tự động, dịch vụ, các engine và Base/Lark | Giữ phần kịch bản/storyboard và quy trình làm video; cập nhật card phù hợp sang hai model của offer. Card Base/Lark đổi nội dung giới thiệu Explore/kho skill để không kéo sang dịch vụ khác. Không gán các tính năng nền tảng thành quyền lợi Pro nếu chưa xác minh. |
| 07 Quy trình | Tabs ba bước, panel và media | Quy trình sản xuất khép kín | “Chọn workflow/skill → Mô tả ý tưởng → Tạo và tinh chỉnh”. Chỉ sửa label, mô tả tương ứng, giữ cơ chế tab. |
| 08 Marquee video | Tất cả media, bố cục cuộn, pause/lazy behavior | Kết quả CinBase sản xuất + nhận demo | Giữ mô tả nguồn video đúng sự thật; dùng làm ví dụ ứng dụng, không tuyên bố mọi video đều từ hai model Pro. CTA “Khám phá CinAI Explore”. |
| 09 ROI/proof | Bố cục so sánh, card số liệu | Giảm chi phí/thời gian, tăng hiệu suất dịch vụ | Chuyển thành “Bạn nhận được gì trong gói Pro?”; so sánh nhu cầu với quyền lợi cụ thể, không giữ KPI dịch vụ như cam kết của thuê bao. |
| 10 Pricing | Section `#pricing`, surface/glow-card, kiểu danh sách và khối giá | Gói Cơ Bản/Nâng Cao theo video, cam kết dài hạn, combo số lượng; khối self-serve $49 | Tái sử dụng khối self-serve hiện có làm offer chính Pro $25/tháng. Bố cục quyền lợi bên trái, giá + CTA bên phải. Hai card cũ chuyển thành chi tiết hai model, không còn giá thuê sản xuất. Các card combo chuyển thành 500 workflow / 4.000+ skill / voucher 50%. |
| 10a Cam kết | Ba ô thông tin và icon | Duyệt trước khi sản xuất / VAT / bản quyền thương mại | “Xem nền tảng trước”, “Kiểm tra quyền lợi gói”, “Xem điều kiện voucher”. Không chuyển cam kết dịch vụ hoặc giấy phép nhạc sang gói Pro khi chưa có xác nhận. |
| 10b Lead form | Section hai cột, kiểu input, hình quy trình | Nhận báo giá + tặng 1.000 workflow | Luồng chính là đăng ký Pro; form phụ đổi thành “Cần hướng dẫn chọn workflow?” và nút “Nhận tư vấn gói Pro”. Không hứa cấp voucher/quà qua email nếu backend chưa hỗ trợ. Đồng bộ thông báo thành công. |
| 11 FAQ | Accordion, layout hai cột, animation | Giá video, sản xuất, hợp đồng, VAT | Các câu về giá $25, hai model unlimited, workflow/skill, voucher, xem trước Explore và cách đăng ký. Không tự thêm trial, hoàn tiền hoặc tự động áp mã. |
| 12 Final CTA | Khối CTA hiện có | Book demo, 79.000đ/video | “Bắt đầu tạo nội dung với CinAI Pro — 25 USD/tháng.” Nhắc 500 workflow và 4.000+ skill. CTA chính đăng ký, phụ xem quyền lợi. |
| 13 Marquee text | Chạy chữ và phong cách | Thông điệp dịch vụ hiện có | Thay nhãn phù hợp: CinAI Pro / 500 workflow / 4.000+ skill / Gemini Omni 1.1 Flash / Veo 3.1 Lite. |
| 14 Footer | Bố cục, logo CinBase, hotline/email | Báo giá TVC, cam kết tháng, dịch vụ khác | Điều hướng về tính năng/Pro/Explore/FAQ; copy tập trung gói Pro, giữ thông tin hỗ trợ sẵn có. |
| Demo modal + gift popup | Component giao diện nếu phù hợp | Nhận demo / tặng 1.000 workflow | Modal tư vấn vẫn là luồng phụ. Popup quà cũ chuyển thành thông báo ưu đãi dẫn về `#pricing`; không tự gửi chuỗi quà 1.000 workflow. |
| Metadata + i18n | Hạ tầng SEO và chuyển ngôn ngữ | Title/description/bản dịch bán dịch vụ | Đồng bộ nội dung offer mới, bỏ giá 79.000đ, $49 và quyền lợi dịch vụ mâu thuẫn trong nội dung của chiến dịch. |

## Những chỉnh sửa kỹ thuật cần đi cùng copy

1. `main.js` đang bắt toàn bộ `a[data-cta="consult"]` để mở modal. Nút đăng ký Pro dùng `data-cta="pro-signup"`; chỉ nút tư vấn dùng `consult`.
2. Form inline/modal/popup có payload `gift: '1000_workflow_templates'` và tự gọi nurture. Khi đổi form sang tư vấn, phải bỏ việc ghi danh vào chuỗi quà cũ; giữ luồng lead phù hợp hiện có. Không tự sửa/activate n8n production.
3. `i18n.js` dùng mapping chuỗi; cập nhật cùng HTML để ngôn ngữ thứ hai không hiển thị nội dung bán TVC cũ.
4. Giữ tracking hiện có cho production, phân biệt nhấp CTA với mua hàng. Giá/currency của chiến dịch dùng USD; kiểm tra passthrough UTM. Local test không gửi email hoặc dữ liệu test ra CRM.
5. Không mang `styles/pro.css` hoặc toàn bộ `scripts/pro.js` của bản thiết kế lại vào template gốc. Chỉ tái sử dụng video và poster đã quay.

## Trình tự triển khai sau duyệt

1. Lưu bản thiết kế lại ở thư mục archive riêng, giữ video/poster dùng lại. Kiểm tra worktree để không ghi đè sửa đổi khác.
2. Phục hồi index gốc từ đúng commit đã chọn; không reset toàn repo. Chụp desktop/mobile baseline và ghi nhận media thiếu nếu có.
3. Chỉnh nhóm hero/header/CTA/stats, đối chiếu giao diện gốc.
4. Chỉnh nhóm tính năng/workflow/skill và thêm video Explore bằng component gốc.
5. Chỉnh pricing/FAQ/form/popup/footer; đồng bộ JS, i18n và tracking liên quan.
6. Kiểm tra ở 375, 768, 1440 px: nav mobile, hero accordion, sticky ngành nghề, tabs, marquee, FAQ, form validation, video Explore, CTA đến đúng đích. Không gửi form production để thử.
7. Bàn giao link local và danh sách chính xác section đã sửa. Chưa deploy.

## Thông tin chưa xác nhận

- Explore lúc khảo sát hiển thị 1.143 skills, khác số hơn 4.000 skill do người dùng cung cấp. Bản nội dung đề xuất giữ số trong brief; cần xác định tổng kho hay tài nguyên bổ sung trước public.
- Voucher 50% chưa rõ tháng đầu/toàn kỳ/sản phẩm nào; giữ dưới dạng ưu đãi riêng, không tính giá sau giảm hoặc bộ đếm còn lại.
- CTA `https://cinai.tv/signup?plan=pro` lấy từ repo; cần kiểm tra trang đích có áp dụng đúng offer $25 và cơ chế nhận voucher khi triển khai chiến dịch thật.
