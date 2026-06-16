# Animation & Motion (Pha 1b)

> Tất cả keyframes trích thật từ stylesheet. Animation chỉ dùng `transform` + `opacity` (compositor-friendly).

## Keyframes chính (scroll-reveal)

| Tên | Từ → Đến | Dùng cho |
|---|---|---|
| `landing-fade-up` | `opacity:0; translateY(32px)` → `opacity:1; translateY(0)` | Reveal chính khi section vào viewport |
| `reveal-up` | `opacity:0; translateY(24px)` → `opacity:1; translateY(0)` | Reveal card/heading |
| `landing-fade-in` | `opacity:0` → `opacity:1` | Fade đơn |
| `reveal-fade` | `opacity:0` → `opacity:1` | Fade đơn |
| `landing-scale-in` | `opacity:0; scale(0.96)` → `opacity:1; scale(1)` | Card/media zoom-in nhẹ |
| `reveal-scale` | `opacity:0; scale(0.95)` → `opacity:1; scale(1)` | Tương tự |
| `heroPanelIn` | `opacity:0; scale(0.985)` → `opacity:1; scale(1)` | Panel hero xuất hiện |

## Keyframes phụ (loop/decor)

| Tên | Mô tả |
|---|---|
| `gradient-shift` | `background-position: 0% → 100% → 0%` — chữ/nền gradient động (heading "AI Filmmaking Platform"?) |
| `shimmer` | `translateX(-100% → 100%)` — hiệu ứng quét sáng (skeleton/marquee) |
| `shimmer-diagonal` | `translate(-100%,-100%) rotate(25deg)` → `translate(100%,100%)` — quét chéo |
| `pulse-subtle` | opacity `1 → 0.7 → 1` — nhịp thở nhẹ |
| `buffering-pulse` | opacity `0.6 → 0.85 → 0.6` — video đang load |
| `scripting-glow` | border + box-shadow glow (warning color) pulse |
| `fade-in-down` | `opacity:0; translateY(-4px)` → `(0)` — dropdown/menu |
| `spin` | rotate 360° — spinner |
| `ping`, `pulse` | Tailwind mặc định |

## Quy ước reveal (Intersection Observer)
- Phần tử khởi đầu `opacity:0` + `translateY`, khi vào viewport thêm class chạy `landing-fade-up`/`reveal-up`.
- Đề xuất clone: IntersectionObserver thêm class `.in-view` → CSS animation `landing-fade-up .6s var(--ease-out) both`.
- Stagger: card trong grid reveal lần lượt (delay tăng dần ~80–120ms).

## Easing đề xuất (tái dựng)
- `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` cho reveal.
- Duration reveal ~500–700ms.

## prefers-reduced-motion
- BẮT BUỘC: tắt mọi reveal/marquee, hiển thị tĩnh (opacity:1, transform:none).
