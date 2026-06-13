# Templates — kho landing/template đã clone

Thư mục lưu trữ các template clone để dễ quản lý & tái sử dụng. Mỗi template là 1 thư mục con chạy độc lập (HTML/CSS/JS tĩnh).

## Danh sách template

| Tên | Thư mục | Nguồn gốc | Mô tả |
|-----|---------|-----------|-------|
| **Template Studio** | `template-studio/` | clone mstudio.ai → rebrand **CinAI.tv** (EN) | Landing SaaS dark-luxury **tiếng Anh**: hero serif + pill video, sticky lens, bento, Pro/Plus pricing, lead-magnet form, tracking Meta 4 lớp. |
| **Template TVC** | `template-tvc/` | bản **tiếng Việt** của template-studio | Y hệt Template Studio nhưng toàn bộ nội dung **tiếng Việt cho thị trường VN** (giá nhấn "79K/ngày"). Font serif nhấn đổi sang **Playfair Display** để hiển thị đủ dấu tiếng Việt. |
| **Template Cartoon** | `template-cartoon/` | clone **toonbee.ai** (EN) | Landing **sales/VSL** bán phần mềm AI tạo video hoạt hình: 20 section, theme ấm + motif tổ ong, headline highlight vàng (font **Wendy One**), FAQ accordion, Swiper, lazy-load, pricing $97. Đã gỡ tracking/checkout. |

## Cách chạy 1 template (local)
```bash
cd templates/template-studio
npx -y serve -l 8099 .
# mở http://localhost:8099
```

## Quy ước
- Mỗi template tự chứa: `index.html`, `styles/`, `scripts/`, `assets/`, và (nếu có) `SYSTEM-XRAY.md` / `extraction/` để tham chiếu khi dựng lại.
- Khi clone template mới → tạo thư mục con mới ở đây, thêm 1 dòng vào bảng trên.
- Placeholder cần điền trước deploy (nếu template có tracking): `{{PIXEL_ID}}`, `{{N8N_WEBHOOK}}` trong `scripts/tracking-config.js`.
