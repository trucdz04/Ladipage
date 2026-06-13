# Tokens RAW — toonbee.ai (Pha 1a)

> Trích từ `getComputedStyle` (runtime) + firecrawl branding. Chính thức hoá ở `styles/tokens.css` (Pha 3).

## Màu (Color)
| Token | Giá trị | Ghi chú |
|-------|---------|---------|
| `--color-accent` | `#FFBF21` | Vàng hổ phách chủ đạo (CTA, highlight) |
| `--color-accent-2` | `#FFD71D` / `rgb(255,215,61)` | Vàng sáng (gradient stop) |
| `--color-accent-3` | `#FFAC25` / `rgb(255,172,37)` | Cam (gradient stop đầu) |
| `--color-accent-soft` | `#FFDF60` / `rgb(255,223,96)` | Vàng nhạt (nền badge) |
| `--color-secondary` | `#FFEEEC` | Hồng kem nhạt (nền section) |
| `--color-cream` | `#FFE7A8` | Kem vàng |
| `--color-ink` | `#000000` | Chữ chính (đen) |
| `--color-ink-2` | `#26262d` / `#2d2d2d` | Đen mềm |
| `--color-surface` | `#FFFFFF` | Nền sáng |
| `--color-surface-dark` | `#080502` / `#000000` | Nền tối (hero, step cards) |
| `--color-muted` | `#b7b7b7` / `#969696` / `#bababa` | Chữ phụ trên nền tối |
| `--color-muted-2` | `#666666` / `#868686` | Chữ phụ trên nền sáng |
| `--color-danger` | `#F03030` / `rgb(240,48,48)` | Đỏ (cross/negative) |
| Gradient vàng | `linear-gradient(180deg, #FFAC25 0%, #FFBF21 51%, #FFD71D 100%)` | Dùng cho span highlight, badge bước |

## Typography
| Vai trò | Font | Cỡ (desktop) | Weight | Line-height |
|---------|------|--------------|--------|-------------|
| Display H1 (hero) | **Wendy One**, sans-serif (cartoon tròn) | 110px | 400 | 121px |
| Heading H2 | **Zalando Sans SemiExpanded** / **Syne** | 43px | 600 | 51.6px |
| Body / P | **Outfit**, sans-serif | 20px (body gốc 14px) | 300 | 24px |
| Accent viết tay | **Gochi Hand**, cursive | — | 400 | nhãn trang trí |
| Serif phụ | **Merriweather**, serif | — | — | trích dẫn |
| Emoji | Noto Color Emoji | — | — | — |

Google Fonts dùng: Outfit (100..900), Syne (400..800), Zalando Sans SemiExpanded, Merriweather, Gochi Hand, Wendy One, Noto Color Emoji.

## Spacing / Radius / Shadow
- baseUnit: 4px
- border-radius phổ biến: `21px`, `26px`/`28px` (video), `30px` (pill/badge), `75px` (step card), `14px` (button phụ)
- shadow CTA: `rgba(0,0,0,0.35) 0 8px 24px, rgba(255,210,29,0.55) 0 0 0` (viền glow vàng)
- drop-shadow ảnh: `drop-shadow(0 27px 54px rgba(0,0,0,0.22))`

## Breakpoint
- Bootstrap 5.2.3 grid: 576 / 768 / 992 / 1200 / 1400
- Class responsive tuỳ biến: `lg20 md18 sm16 xs18` (cỡ chữ theo breakpoint), `xs15`...
- Hero h1 dùng cỡ giảm dần theo viewport.

## Buttons
- **Primary CTA** (`mybutton1-orange`): nền gradient vàng, chữ đen, bo tròn, glow vàng, text "Get Instant Access to ToonBee".
- **Secondary** (`Click to Unmute`): nền `#383838`, chữ trắng, radius 14px.
