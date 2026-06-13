# Clone — toonbee.ai

Bản clone học tập của landing page `https://toonbee.ai/` (sales/VSL cho phần mềm AI tạo video hoạt hình).
Stack: **HTML/CSS/JS tĩnh** (giống nguồn — PageDock + jQuery + Bootstrap 5.2.3 + Swiper + Vimeo).

## Chạy thử
```bash
node extraction/serve.js     # phục vụ tại http://localhost:8099
# hoặc bất kỳ static server nào trỏ vào thư mục này
```

## Cấu trúc
```
toonbee.ai/
├── index.html              # trang ráp hoàn chỉnh (20 section)
├── SYSTEM-XRAY.md           # X-quang trang NGUỒN (9 phần)
├── SYSTEM-XRAY-CLONE.md     # X-quang bản CLONE + đối chiếu
├── styles/
│   ├── tokens.css           # design tokens (màu/font/spacing)
│   ├── global.css           # a11y + reduced-motion + smooth scroll
│   ├── style.css            # CSS gốc đã localize (../assets/images)
│   ├── checkout.css, autoplay.css, swiper.min.css
├── scripts/main.js          # accordion, swiper, lazy-load, video, countdown
├── assets/{images,media,js} # 130 ảnh + 43 video/poster + jQuery/Swiper/Vimeo
└── extraction/              # mọi bằng chứng trích xuất + script build
```

## Đã loại bỏ (theo yêu cầu — không tracking)
- Meta Pixel x2, Google Ads, tracking domain riêng
- Checkout FastSpring (popup) → nút CTA trỏ in-page `#pricing` / `#buynow`
- Social-proof widget (PageDock)

## Ranh giới bản quyền
Logo/ảnh/video/nội dung là tài sản của ToonBee — chỉ dùng cho **học tập/tham khảo**.
Nếu phát hành công khai: thay logo/nội dung thương mại bằng **placeholder**.
