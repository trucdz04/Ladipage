# Templates — kho landing/template đã clone

Thư mục lưu trữ các template clone để dễ quản lý & tái sử dụng. Mỗi template là 1 thư mục con chạy độc lập (HTML/CSS/JS tĩnh).

## Danh sách template

| Tên | Thư mục | Nguồn gốc | Mô tả |
|-----|---------|-----------|-------|
| **Template Studio** | `template-studio/` | clone mstudio.ai → rebrand **CinAI.tv** (EN) | Landing SaaS dark-luxury **tiếng Anh**: hero serif + pill video, sticky lens, bento, Pro/Plus pricing, lead-magnet form, tracking Meta 4 lớp. |
| **Template TVC** | `template-tvc/` | bản **tiếng Việt** của template-studio | Y hệt Template Studio nhưng toàn bộ nội dung **tiếng Việt cho thị trường VN** (giá nhấn "79K/ngày"). Font serif nhấn đổi sang **Playfair Display** để hiển thị đủ dấu tiếng Việt. |
| **Template Cartoon** | `template-cartoon/` | clone **toonbee.ai** (EN) | Landing **sales/VSL** bán phần mềm AI tạo video hoạt hình: 20 section, theme ấm + motif tổ ong, headline highlight vàng (font **Wendy One**), FAQ accordion, Swiper, lazy-load, pricing $97. Đã gỡ tracking/checkout. |
| **Template CinAI Video Studio** | `template-cinai-video-studio/` | clone **sendfame.com/ai-video-generator** → rebrand **CinAI.tv** (EN) | Landing **AI Video & Workflow Studio** dark-luxury tím: header mega-menu (Videos·Models·Workflows), hero + generator panel (chọn model Seedance/Veo, image/text/extend, preview video CinAI), Community masonry full-width (video CinAI, tile click → cinai.tv), 5 feature card, **Explore Models** (8 model CinAI kết nối: Seedance 2.0/Kling/Veo 3.1/Hailuo/GPT Image 2/Nano Banana/Omni/Opus 4.8 — thumbnail ảnh output thật), FAQ, footer. Mọi CTA/video/model nối thẳng **cinai.tv**. Tracking Meta 4 lớp (`MAIN_DOMAIN=cinai.tv`). Logo `assets/cinai/cinai-logo.svg`, video demo local `assets/media/cinai-*.mp4`. |
| **Template CinAI Clips** | `template-cinai-clips/` | clone **autoclips.app** → rebrand **CinAI.tv** (EN) | Landing SaaS **sáng + mint** (#15E49E), 27 section build từ partial qua `build.sh`: hero composer, **Creative Engine** (pipeline động 6 bước + dashboard 6 màn hình, file `automation-pipeline.js`), toggle "Ad Images/Product Shots/AI Video" (`goal-toggle.js`), **ROI tiết kiệm chi phí creative** (`roi-calculator.js`), pricing **Pro $25 / Plus $59** (toggle Yearly/Monthly), FAQ accordion. Nội dung = AI Creative Workspace (ad images · product shots · UGC · AI video · model premium GPT Image 2/Nano Banana/Omni/Seedance/Opus 4.8). Logo `assets/cinai/cinai-logo.svg`. Video demo dùng CDN gốc; 6 ảnh avatar tải local. |

## Dùng chung (`_shared/`)
- **Bảng giá CinAI** (source of truth): [`_shared/cinai-pricing.md`](_shared/cinai-pricing.md) + [`_shared/cinai-pricing.json`](_shared/cinai-pricing.json).
  Mọi landing CinAI tham chiếu sang đây cho section pricing — cập nhật giá 1 nơi, đồng bộ mọi trang.

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
