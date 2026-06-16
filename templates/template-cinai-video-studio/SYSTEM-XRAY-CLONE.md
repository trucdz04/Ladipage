# SYSTEM X-RAY — BẢN CLONE (sendfame.com clone tĩnh)

> X-quang bản clone vừa dựng, đối chiếu với `SYSTEM-XRAY.md` (nguồn). 9 phần, tiếng Việt.

1. **Giải thích hệ thống** — Landing tĩnh 1 trang tái dựng UI "AI Video Generator". HTML/CSS/JS thuần, không backend. Mục tiêu giống nguồn: trưng bày + dẫn đăng ký (CTA gated → modal).
2. **Bản đồ hệ thống** — Đủ 10 khối 00→09 + login modal, khớp 1-1 với nguồn (xem index.html theo comment section).
3. **Luồng thực thi** — `UI → (client state JS) → KHÔNG CÓ API/Backend/DB`. CTA gated mở modal. Pha 7 thêm `tracking.js → N8N_WEBHOOK` (CAPI/Lead/Lark). Khớp nguồn (nguồn public cũng không lộ backend).
4. **Luồng agent/tool** — KHÔNG CÓ (giống nguồn).
5. **ERD** — KHÔNG CÓ DB. Content model trong `scripts/main.js` (COMMUNITY/MODELS/FAQ) + PanelState trong bộ nhớ phiên. Khớp "content model" của nguồn.
6. **Bản đồ API** — Chỉ `N8N_WEBHOOK` (POST) ở Pha 7. Khớp (nguồn ẩn API sau auth).
7. **Vấn đề + vì sao** — Không phát sinh lỗi mới (console sạch). MINOR: vài media remote (CDN nguồn chặn hotlink) → thumbnail model thay placeholder; showcase/community video phụ thuộc CDN. Không có nút thắt CWV mới.
8. **Lộ trình rebuild** — Đã thực hiện: tokens→scaffold→build 00→09→wiring→verify. Còn lại: điền config tracking + thay asset hợp lệ → deploy.
9. **Flowchart CRUD mẫu** — PanelState: init → tương tác → update state → render class active → CTA gated → mở modal (giống nguồn, không CRUD DB).
