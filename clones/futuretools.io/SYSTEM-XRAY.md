# SYSTEM X-RAY — futuretools.io

## 1. Trang làm gì
Trang chủ tổng hợp tin, danh sách công cụ AI, video, bài phân tích và thu hút đăng ký newsletter.

## 2. Bản đồ section
Header → hero/email → tin AI + bảng top tools → video → bài phân tích → lead magnet/email → footer.

## 3. Luồng quan sát
Người xem mở trang → đọc thẻ tin/công cụ → theo liên kết hoặc đổi tab. Form email xuất hiện ở hero và cuối trang. Endpoint nhận email và hệ lưu trữ **KHÔNG CHẮC CHẮN** từ quan sát công khai.

## 4. Agent / tool
**KHÔNG CÓ** agent flow quan sát được trên trang chủ.

## 5. Database
**KHÔNG CHẮC CHẮN**: không có quyền truy cập backend; không dựng ERD suy đoán.

## 6. API
Không xác minh được API nội bộ. Các tin/card trỏ ra URL bài gốc; cấu trúc backend **KHÔNG CHẮC CHẮN**.

## 7. Vấn đề liên quan khi tái tạo
- Tin biến động theo ngày nên chép nguyên văn sẽ lỗi thời.
- Ảnh, logo và nội dung nguồn thuộc bên khác; bản clone dùng nội dung mẫu nguyên bản.
- Modal đăng ký tự bật trên mobile có thể che nội dung.

## 8. Lộ trình rebuild
Tạo token → dựng section → nối tab/menu/theme/form demo → kiểm tra responsive → bổ sung CMS/API khi có nguồn dữ liệu thật.

## 9. Luồng clone tĩnh
Mở trang → đọc dữ liệu mẫu trong JS → render card → click tab đổi danh sách. Nhập email → kiểm tra định dạng → hiện thông báo demo; **không có** lưu DB hay gửi email.
