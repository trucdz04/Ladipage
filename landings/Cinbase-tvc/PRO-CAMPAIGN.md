# CinAI Pro campaign — 2026-10-01

Trang `index.html` đã chuyển từ dịch vụ sản xuất TVC sang bán gói nền tảng CinAI Pro, theo artwork và yêu cầu mới của chủ repo.

- Pro: 25 USD/tháng (brief mới được ưu tiên so với bảng giá cũ $29 trong `templates/_shared/`). Không đổi bảng giá các landing khác.
- Hai quyền lợi trong artwork: Gemini Omni 1.1 Flash và Veo 3.1 Lite không giới hạn.
- Voucher giảm 50%, chương trình giới hạn 100 voucher. Không có bộ đếm giả, không tự suy ra giá 12,50 USD hay kỳ áp dụng.
- 500 workflow và hơn 4.000 skill là số liệu người dùng cung cấp. Khi khảo sát, Explore hiển thị 1.143 skills; cần xác nhận phạm vi tổng kho/tài nguyên bổ sung trước khi public.
- CTA dùng `https://cinai.tv/signup?plan=pro` theo đường dẫn của repo. Chưa kiểm chứng checkout có nhận đúng campaign/voucher; chưa triển khai backend coupon.

## Media

Cập nhật theo phản hồi: hai video capsule của hero, ba hero card và bảy tab tools đã thay bằng media thật của skill trên Explore. Gồm MotionRiseAI Commercial Advert Creator, AI Avatar, Cinematic 3D Animation Director, Music Video, Drama Video, Interactive Drama, Subtitle Localize. Tên, tác giả và URL nguồn lưu tại `assets/explore-skills/sources.json`; MP4/poster được tải local, đã kiểm tra phát cả bảy video. Không thay media của các section khác trong lượt sửa này.

`assets/cinai-explore-tour.webm`: video quay thật trang Explore, 1440×900, khoảng 19 giây; đi qua phần đầu, kho Skills, Remake, Game Ads, Explainer và Cinematic. Không có giọng đọc hoặc nhạc. `assets/cinai-explore-poster.jpg` là screenshot trang thật.

## Triển khai

Giữ template CinBase TVC gốc từ commit `6a337f6`: `styles/tokens.css`, `styles/global.css`, `scripts/main.js`, `scripts/i18n.js`. Chỉ chỉnh nội dung các section theo `PLAN-PRO-ON-ORIGINAL.md` và thêm section Explore. Không đổi hệ màu, font hoặc bố cục tổng thể. Bản redesign trước được lưu riêng ở `archive/pro-redesign.html`; pro.css/pro.js chỉ dành cho bản lưu đó.

Các MP4 cũ trong `assets/media/` không có trong checkout này. Trang giữ poster gốc và ghi lại đường dẫn thiếu trong comment thay vì phát sinh request 404; hiệu ứng hover/sticky/tabs vẫn giữ. Video Explore 19 giây hoạt động bình thường.

Kiểm tra local: 375/768/1440 px, menu mobile, hero hover, tabs tools/guided, FAQ, phát video Explore, CTA signup/UTM, chuyển VI/EN, validation form. Không có lỗi JavaScript hoặc request 4xx ở lượt QA cuối; còn cảnh báo Tailwind CDN của template gốc. Form chỉ là preview trên localhost, không gửi CRM/email. Backend nhận lead/voucher production chưa được kiểm chứng.

Link local: http://localhost:8101/?v=pro-template

Giữ tracking Pixel/CAPI hiện có khi phục vụ trên domain thật. Localhost tắt gửi sự kiện ra dịch vụ thật; UTM được nối sang CTA Pro. Chưa deploy.
