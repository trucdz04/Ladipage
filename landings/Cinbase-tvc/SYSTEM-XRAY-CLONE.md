# SYSTEM-XRAY-CLONE — bản CLONE mstudio.ai (đối chiếu Pha 6)

> X-quang bản clone vừa dựng (`file:///.../clones/mstudio.ai/index.html`), so 9 phần với `SYSTEM-XRAY.md` (nguồn).

## 1. Giải thích hệ thống
Giống nguồn: **landing page tĩnh** giới thiệu nền tảng làm phim AI "M Studio", nhiệm vụ = thuyết phục + đẩy bấm nút.
Khác: nút điều hướng trỏ `#` (placeholder) thay vì trang thật; bỏ toàn bộ tracking; chat = nút placeholder.

## 2. Bản đồ hệ thống
**Đủ 15 khối + chat** y như nguồn: 00 announcement · 01 header · 02 hero · 03 clients · 04 tools · 05 vertical sticky ·
06 features · 07 guided · 08 carousel · 09 why · 10 guides · 11 faq · 12 cta · 13 marquee · 14 footer · 99 chat.
- Công nghệ: HTML tĩnh + Tailwind (CDN map token HSL) + `tokens.css`/`global.css` + `main.js` (vanilla).

## 3. Luồng thực thi (UI → API → Backend → DB → External)
Giống nguồn: tải HTML tĩnh → `main.js` chạy (IntersectionObserver reveal · header scroll · tabs · accordion ·
carousel · sticky activeIndex · lazy video play) → người dùng bấm → điều hướng (ở clone là `#`). **KHÔNG** API/Backend/DB.

## 4. Luồng agent/tool
**KHÔNG CÓ** — giống nguồn.

## 5. ERD
**KHÔNG CÓ** — nội dung tĩnh nhúng cứng, giống nguồn.

## 6. Bản đồ API
**KHÔNG CÓ API nghiệp vụ.** Tài nguyên tĩnh: `styles/*.css`, `scripts/main.js`, `assets/images/*`, `assets/media/*.mp4`,
Tailwind CDN, Google Fonts. Không tracking (khác nguồn — đã bỏ theo yêu cầu).

## 7. Vấn đề phát hiện
- Không phát sinh lỗi console (đã kiểm: 0 error/warn).
- Không có nút thắt mới: media lazy-play (IO), poster chống CLS — **cải thiện** so với nguồn (nguồn autoplay 48 video).
- MINOR: dùng Tailwind Play CDN (không tối ưu cho production thật) — đề xuất build Tailwind tĩnh khi deploy.

## 8. Lộ trình rebuild
Đã theo đúng thứ tự nguồn: tokens → khung 15 section → main.js tương tác → performance (lazy) → responsive/a11y.

## 9. Flowchart mẫu (CRUD/TODO)
**KHÔNG CÓ CRUD** — giống nguồn. Luồng tương tác client-side (FAQ open/close, đổi tab, sticky scroll) thay cho CRUD.
