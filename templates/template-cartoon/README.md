# Template Cartoon — CinAI.tv Rebrand

Landing **sales/VSL** cho **CinAI.tv** — AI Creative Workspace bán gói Pro &amp; Plus.
Clone cấu trúc từ `toonbee.ai`, rebrand sang CinAI.tv (EN).
Stack: **HTML/CSS/JS tĩnh** (jQuery + Bootstrap 5.2.3 + Swiper + Vimeo embed). Tự chứa, chạy độc lập.

## Đặc điểm
- 20 section: hero (dark bg + CinAI gold accent) → 3-steps → VSL demo → "why AI video"
  → hard-to-create problem → AI solution → comparison → showcase → features → pricing → bonus → FAQ → footer.
- Phong cách: **Dark luxury** — nền `#09090b`, nhấn vàng kem `#e0c9a6` / `#ffd277`.
- Font: **Inter** (body) + **Plus Jakarta Sans** (heading/display) + **Instrument Serif** (accent).
- Tương tác: FAQ accordion, Swiper carousel, lazy-load (IntersectionObserver), video play/pause/mute,
  marquee + float animation, countdown (kích hoạt khi cuộn tới #pricing).
- **Pricing**: Dual plan — **Plus $49/mo** + **Pro $97/mo** (most popular).
- **Đã loại bỏ:** tracking (Meta Pixel/Google Ads), checkout FastSpring, social-proof widget.
  Nút CTA trỏ `https://cinai.tv/signup?plan=plus` / `?plan=pro`.

## Chạy local
```bash
cd templates/template-cartoon
npx -y serve -l 8100 .
# hoặc: node _serve.js   → http://localhost:8100
```

## Cấu trúc
```
template-cartoon/
├── index.html                 # trang đầy đủ (20 section), rebrand CinAI.tv
├── styles/
│   ├── tokens.css             # CinAI dark luxury design tokens
│   ├── cinai-override.css     # font + color rebrand layer (load cuối)
│   ├── global.css             # a11y + reduced-motion + smooth scroll
│   ├── style.css              # CSS gốc (layout/structure)
│   ├── checkout.css, autoplay.css, swiper.min.css
├── scripts/
│   └── main.js                # accordion, swiper, lazy-load, video, countdown
├── assets/
│   ├── cinai/                 # CinAI SVG logos (cinai-logo.svg, cinai-logo-gold.svg)
│   ├── images/                # ảnh section (130 file — placeholder từ toonbee)
│   ├── media/                 # video/poster (43 file — placeholder từ toonbee)
│   └── js/                    # jQuery, Swiper, Vimeo
├── SYSTEM-XRAY.md · SYSTEM-XRAY-CLONE.md
```

## Tuỳ biến nhanh
- **Đổi màu/font**: sửa `styles/tokens.css` — tất cả màu CinAI được định nghĩa ở đây.
- **Đổi nội dung**: sửa text thẳng trong `index.html`.
- **CTA links**: tìm `cinai.tv/signup?plan=` trong `index.html` → đổi sang URL thật.
- **Pricing**: section `id="pricing"` trong `index.html` — chỉnh số tiền/tính năng.
- **Thêm tracking**: chạy `/tracking-setup` để nhúng Meta Pixel + n8n (4 lớp).
- **Thay video**: đổi Vimeo embed ID trong các `<iframe src="https://player.vimeo.com/...">`.

## Lưu ý bản quyền
Ảnh/video trong `assets/images/` và `assets/media/` là placeholder từ toonbee.ai — chỉ dùng **học tập/tham khảo**.
Trước khi phát hành công khai: thay toàn bộ bằng ảnh/video của CinAI.tv.
Logo SVG trong `assets/cinai/` là tài sản của CinAI.tv — dùng tự do.
