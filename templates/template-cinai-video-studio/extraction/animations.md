# Animations & Transitions — sendfame.com

## Transition cơ bản (Tailwind)
- Mặc định hover: `0.15s cubic-bezier(0.4, 0, 0.2, 1)` cho color/bg/border/fill/stroke
- Transform hover: `transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)` (scale card/button)
- Opacity reveal: `opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Tổng hợp UI: `all 0.2s` / `all 0.3s cubic-bezier(0.4,0,0.2,1)`

## Keyframes có ý nghĩa (tái dựng)
| Tên | Thời lượng | Lặp | Dùng cho |
|-----|-----------|-----|----------|
| `spotlight` | 1.5s ease | 1 lần | Hiệu ứng đèn rọi nền hero (fade + dịch) |
| `shine-infinite` | 2s ease-in-out | ∞ | Shimmer chạy ngang trên badge/CTA "NEW" |
| `float` / `float-slow` | — | ∞ | Phần tử nổi nhẹ lên xuống |
| `pulse` | — | ∞ | Nhấp nháy nhãn "New/Just Launched" |
| `ping` | — | ∞ | Chấm trạng thái |
| `spin` | — | ∞ | Loading spinner |
| `bounce` | — | ∞ | Mũi tên/icon |
| `motion-*` (Rombo/motion lib) | — | — | Reveal khi scroll (opacity/filter/color in-out) |
| `RomboConfettiPop`, `topfetti`, `bottomfetti` | — | 1 | Confetti khi tạo video thành công (gated) |

## Hành vi cảm giác
- **Hover card** (community/model/feature): scale nhẹ + sáng viền (border-white/10 → /20), 0.15–0.2s.
- **Hero spotlight**: chạy 1 lần khi load.
- **Badge "NEW"/"Just Launched"**: shimmer `shine-infinite` 2s lặp.
- **Scroll reveal**: motion lib fade/blur-in khi section vào viewport.
- **Video**: tất cả autoplay + loop + muted (community grid, showcase, panel preview).

## Nguyên tắc tái dựng (bản clone)
- Chỉ animate `transform` / `opacity` / `clip-path` / `filter`.
- Tôn trọng `prefers-reduced-motion: reduce` → tắt spotlight/shimmer/float, giữ video poster tĩnh.
- Easing chuẩn: `cubic-bezier(0.4, 0, 0.2, 1)` (đặt `--ease-standard`).
