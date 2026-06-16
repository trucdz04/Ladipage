# Behavior Map — sendfame.com/ai-video-generator

## Tương tác theo section
| Section | Tương tác | Hành vi |
|---------|-----------|---------|
| 00 Announcement | Click "See Pricing →" | điều hướng `/pricing` (clone: MAIN_DOMAIN) |
| 01 Header | Hover "AI Music/Videos/Images" | mở mega-menu dropdown |
| 01 Header | Click "Sign In" (lime) | mở login modal / `/signin` |
| 03 Hero pills | Mobile: cuộn ngang | thanh chỉ báo xanh lá; desktop: wrap |
| 03 Panel | Tab/model/duration/resolution | single-select toggle (xem logic-generator-panel.md) |
| 03 Panel | "Signup to Try!" / "Login to generate" | mở login modal |
| 04 Community | Hover video card | video play / scale nhẹ + viền sáng |
| 04 Community | Click "View all Community Videos" | `/community` |
| 05 Showcase | — | video autoplay/loop full-width |
| 06 Features | Hover card | scale + sáng viền 0.15s |
| 07 Models | Hover model card | scale + sáng; Click "Read more" → trang model |
| 07 Models | Click "View All Models" | `/discover/models` |
| 08 FAQ | Click câu hỏi | accordion expand/collapse (1 mở tại 1 thời điểm hoặc độc lập) |
| 09 Footer | Click link | điều hướng các trang con |

## Wiring main.js (clone)
1. **Tab group panel** — click → toggle `.active`, đổi form panel.
2. **Single-select chips** (duration/resolution/model) — click → set active trong nhóm.
3. **FAQ accordion** — click `<summary>`/button → toggle `aria-expanded` + max-height.
4. **Header dropdown** — hover/focus mở, click ngoài đóng (a11y: keyboard).
5. **Login modal** — mọi CTA gated (Sign In / Signup to Try / Login to generate) → mở modal.
6. **Mobile pills** — overflow-x scroll container + custom scroll indicator.
7. **Smooth anchor** cho nav nội bộ.
8. **Scroll reveal** — IntersectionObserver fade/blur-in (tôn trọng reduced-motion).
9. **Video** — autoplay/loop/muted; lazy `preload=none` dưới fold.

## Event & data flow (nguồn)
- Tracking: FB Pixel `1636932644396730`, Google Ads `AW-11553070126`/`AW-974790479`, AppLovin.
- gtag cross-domain linker: `sendfame.com`, `sendfameai.com`, `sendfame.ai`.
- Media từ CDN: `videos.sendfame.com`, `cdn.higgsfield.ai`, cloudfront (qua wsrv.nl proxy), R2 bucket model thumbs.
- Không có form public POST trên trang này (mọi action gated sau auth) → clone thêm lead-form riêng cho tracking Pha 7.
