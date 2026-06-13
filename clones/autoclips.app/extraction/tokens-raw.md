# Tokens trích từ autoclips.app (nháp — chính thức hoá ở Pha 3)

## Stack nguồn
- **Next.js** (`__NEXT_DATA__`, `/_next/`) + **Tailwind CSS** + **DaisyUI** (thấy biến `--p`, `--s`, `--a`, `--b1`…)
- Font: **Urbanist** (700 cho heading, 400-600 body), fallback `sans-serif`
- Color scheme: **light**

## Màu (DaisyUI theme + computed)
| Token | Giá trị | Ghi chú |
|-------|---------|---------|
| `--color-accent` / primary | `#15E49E` (oklch 81.3% 0.176 161.9 ; hsl 162 83% 49%) | xanh mint — CTA chính, link |
| `--color-accent-ink` | `#000000` | chữ trên nút accent |
| `--color-text` | `#000000` / `oklch(0.2 0 0)` | chữ chính (gần đen) |
| `--color-text-muted` | `#4B5563` (gray-600) / `220 9% 46%` | phụ đề |
| `--color-surface` | `#FFFFFF` | nền chính |
| `--color-muted` | `#F3F4F6` (gray-100/muted) | nền section xám nhạt |
| `--color-surface-alt` | `#F9FAFB` (gray-50) | nền section luân phiên |
| secondary | `#154 73% 81%` (mint nhạt) | |
| dark section | `#0F0B17` | "Creepy Toon" + footer tối |
| black band | `#000000` | "Creators Earning $5K+" |
| pink band | `#FCF5F8` | "Fruit Stories" |
| border | `#E5E7EB` (gray-100/200) `220 13% 91%` | viền section |

## Typography (computed)
| Vai trò | Size | Weight | Line-height | Letter-spacing |
|---------|------|--------|-------------|----------------|
| H1 hero | 96px (desktop) → clamp | 700 | 96px (1.0) | normal |
| H2 section | 48px | 700 | 48px (1.0) | 1.2px |
| H3 | ~24-30px | 600-700 | | |
| body | 16px (đoạn lớn tới 18-30px) | 400 | 1.5 | |

→ clamp đề xuất: `--text-hero: clamp(2.5rem, 1rem + 7vw, 6rem)`, `--text-h2: clamp(1.75rem, 1rem + 2.5vw, 3rem)`

## Spacing / Radius / Shadow
- baseUnit: 4px (Tailwind scale)
- Section padding dọc: `py-16` (64px) phổ biến, hero `py-20/24`, automations `py-20 md:py-32`
- `--radius` / `--rounded-btn`: `0.5rem` (8px) — nút CTA accent
- nút secondary / pill / input: `9999px` (bo tròn full)
- `--rounded-box`: 1rem (16px) — card; badge: 1.9rem
- shadow: nhẹ `0 1px 2px rgba(0,0,0,0.05)`; card hover `box-shadow 0.3s`

## Breakpoints (Tailwind chuẩn)
- sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536 (prefix `sm:`/`md:`/`lg:` xuất hiện nhiều)

## Buttons
- **Primary**: bg `#15E49E`, chữ `#000`, radius 8px, shadow nhẹ, hover scale/đậm
- **Secondary**: bg `#111827`, chữ trắng, radius pill 9999px
- **Ghost nav**: chữ `#111827`, hover accent

## Easing
- `cubic-bezier(0,0,0.2,1)` (ease-out) 0.2s — mặc định transition
- `cubic-bezier(0.4,0,0.2,1)` (ease-in-out) 0.15s/0.3s/0.5s
- marquee carousel: `@keyframes scroll 56s linear infinite`
