# SYSTEM X-RAY — bản clone AI Radar

- Stack: HTML, CSS, JavaScript tĩnh; chạy bằng server Node trong `serve.cjs`.
- Luồng dữ liệu: mảng `newsItems`/`toolSets` trong `scripts/main.js` → tạo card DOM → hiển thị. Không có API và DB.
- Hành vi: menu mobile mở/đóng; dropdown desktop; tab đổi 20/10 công cụ; theme được lưu vào localStorage; form email báo trạng thái demo.
- Kênh bên ngoài: font Google Fonts và liên kết đến website công cụ. Không gửi email, không tracking.
- Cấu trúc responsive: 2 cột tin/công cụ ở desktop; 1 cột ở tablet/mobile; 4→2→1 thẻ video theo chiều rộng.
