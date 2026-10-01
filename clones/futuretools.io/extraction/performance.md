# Performance nguồn

- Trang nguồn dùng Next.js/Turbopack, nhiều script `_next/static/chunks` và font Syne/Plus Jakarta Sans.
- Ảnh tin được tải từ nhiều domain ngoài; ảnh ở các section dưới có dấu hiệu lazy loading.
- Chưa ghi trace Core Web Vitals chuẩn, nên LCP/INP/CLS: **KHÔNG CHẮC CHẮN**.
- Clone tĩnh dùng HTML/CSS/JS nhỏ, không cần runtime Next.js. Ảnh nguồn có bản quyền được thay bằng hình CSS/monogram.
