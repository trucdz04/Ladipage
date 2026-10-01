# Đối chiếu nguồn ↔ clone

Kiểm tra local ngày 01/10/2026 ở 320, 375, 768, 1024 và 1440px.

## CRITICAL

- Không có lỗi vỡ layout hay cuộn ngang tại các breakpoint đã đo.

## MAJOR

- Nội dung, tên thương hiệu, ảnh và logo đã đổi sang mẫu AI Radar vì không tái sử dụng tài sản của nguồn. Do đó đây là clone bố cục/phong cách, không phải bản sao pixel.
- Clone không có backend newsletter và trang bài viết thật; form hiện thông báo demo, thẻ review cần nối bài viết trước khi xuất bản.
- Nguồn có modal đăng ký tự hiện trên mobile; clone dùng CTA trực tiếp trong hero và cuối trang.

## MINOR

- Thumbnail là hình tạo bằng CSS/monogram thay cho ảnh nguồn.
- Font tải từ Google Fonts; nếu offline sẽ dùng font hệ thống.
- Một số khoảng cách/độ cao card khác nguồn do nội dung tiếng Việt có độ dài khác.

## Kiểm tra hành vi

- Menu mobile mở và đóng sau khi chọn link.
- Tab `Nên thử` hiển thị 10 công cụ, `aria-selected=true`.
- Theme đổi sang sáng.
- Form demo hiển thị thông báo không thu email.
- Chrome DevTools sau khi thêm favicon: không có console error.
