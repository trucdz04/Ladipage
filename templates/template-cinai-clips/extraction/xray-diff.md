# Đối chiếu X-RAY: bản CLONE ↔ nguồn (autoclips.app)

So sánh `SYSTEM-XRAY.md` (nguồn) với bản clone vừa dựng. Phân loại lệch: Critical / Major / Minor.

| Phần X-Ray | Nguồn | Clone | Kết luận |
|------------|-------|-------|----------|
| (1) Giải thích hệ thống | Landing marketing, CTA → app chính | Giống hệt | ✅ Tương đương |
| (2) Bản đồ hệ thống | 26 khối, client-render, asset CDN | 25 section + footer, asset CDN giữ nguyên | ✅ Tương đương |
| (3) Luồng thực thi | UI-only, không API/Backend/DB | UI-only, không API/Backend/DB | ✅ Tương đương |
| (4) Agent/Tool | KHÔNG CÓ | KHÔNG CÓ | ✅ Tương đương |
| (5) ERD | KHÔNG CÓ DB; data tĩnh nhúng UI | Data tĩnh nhúng HTML/JS | ✅ Tương đương |
| (6) Bản đồ API | Chỉ GET asset tĩnh | Chỉ GET asset tĩnh (CDN) | ✅ Tương đương |
| (7) Vấn đề | 74 video autoplay nghẽn load | **Đã VÁ**: lazy-load qua IntersectionObserver | ✅ Clone tốt hơn nguồn |
| (8) Lộ trình rebuild | thứ tự 00→26 | dựng đúng thứ tự | ✅ Tương đương |
| (9) Flowchart ROI | công thức 4 slider | **khớp công thức tuyệt đối** | ✅ Tương đương |

## Kiểm chứng logic động (DIFF & GATE — PASS)
| Component | Nguồn | Clone | Khớp |
|-----------|-------|-------|------|
| ROI mặc định | $900/mo · 31.03x | $900/mo · 31.03x · $0.97/video | ✅ |
| ROI kéo max | (công thức) | 90 video · 4.5M views · 22.5K sales · $4,500,000/mo | ✅ |
| Pricing tháng | 29/59/99/199/(Ultra) | 29/59/99/199/399 | ✅ (Ultra ước tính*) |
| Pricing năm | 23/47/79/159/(Ultra) | 23/47/79/159/319 | ✅ (Ultra ước tính*) |
| FAQ accordion | single-open | mở mục 3 → đóng mục 1 | ✅ |
| Nav mobile | hamburger overlay | overlay full-screen + CTA | ✅ |

\* **Gói Ultra**: nguồn cắt dữ liệu khi trích (text truncated sau Enterprise) → giá Ultra ($319/$399, 150k credits, x10 account) là **ƯỚC TÍNH HỢP LÝ**, không phải số liệu trace được. Đánh dấu MINOR — cần xác minh nếu publish.

## Lệch còn lại
- **MINOR**: gói Ultra dùng số ước tính (xem trên).
- **MINOR**: avatar/logo creator dùng placeholder chữ-cái (chính sách bản quyền), không phải ảnh thật.
- **MINOR**: nội dung video trên CDN giữ link gốc (không tải về) — phụ thuộc CDN `zayathemes.b-cdn.net` còn sống.
- **MINOR**: pipeline "Step N of 6" của section Automations dựng dạng stepper tĩnh, không auto-advance theo timer như bản gốc.

➡️ **Kết luận: 2 báo cáo TƯƠNG ĐƯƠNG về cấu trúc & data flow. Không phát sinh lỗi/nút thắt mới (còn vá được nút thắt performance của nguồn). PASS.**
