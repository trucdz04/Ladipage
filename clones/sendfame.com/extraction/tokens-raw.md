# Tokens RAW — sendfame.com/ai-video-generator

> Trích xuất Pha 1a (getComputedStyle + firecrawl branding). Chính thức hoá ở Pha 3 (`styles/tokens.css`).

## Tổng quan
- **colorScheme:** dark
- **Framework nguồn:** Tailwind CSS (full default palette) trên Next.js Pages Router
- **Font heading:** `Rubik` (next/font, weight 400/500/700) → fallback `system-ui, arial`
- **Font body:** `ui-sans-serif, system-ui, sans-serif` (Tailwind sans stack)
- **Radius cơ bản:** pill `9999px` (nav/badge/CTA tròn), card `12px`, panel input `6–8px`
- **Spacing base unit:** 4px (thang Tailwind)

## Màu (đã chuẩn hoá)
| Vai trò | Hex | Ghi chú |
|---------|-----|---------|
| Nền trang (page bg) | `#000000` | đáy là đen tuyền |
| Nền html/zinc | `#18181b` (zinc-900) | nền gốc html |
| Accent chính (CTA) | `#A855F7` (purple-500) | nút "Signup to Try", primary |
| Accent text/link | `#C084FC` (purple-400) | "Login to generate", text nhấn |
| Accent nhạt | `#D8B4FE` (purple-300) | viền/nhãn nhẹ |
| Tím sâu nền | `#581C87` (purple-900) @ 0.2–0.4 | nền card feature |
| Sign In (lạ mắt) | nền `#A3E635` (lime-400), chữ `#3F6212` (lime-800), viền `#D9F99D` (lime-200) | nút CTA nổi bật |
| Success/badge | `#22C55E` (green-500) | nhãn trạng thái |
| Cyan nhấn | `#22D3EE` (cyan-400) | điểm nhấn phụ |
| Text chính | `#FFFFFF` | tiêu đề |
| Text phụ (subtitle) | `#D1D5DB` (gray-300) | mô tả dưới H1/H2 |
| Text mờ | `#9CA3AF` (gray-400) / `#71717A` (zinc-500) | caption |
| Viền/đường kẻ | `rgba(255,255,255,0.1)` · `0.15` | card border |
| Nền card kính | `rgba(255,255,255,0.05)` | surface mờ |

## Typography (đo thật)
| Element | font-size | weight | line-height | màu | font-family |
|---------|-----------|--------|-------------|-----|-------------|
| H1 | 48px (desktop) | 700 | 48px | #fff | Rubik |
| H2 | 18px | 400 | 28px | gray-300 | Rubik |
| Body/p | 14px | 400 | 24px | varies | sans stack |
| Subtitle hero | 18px | 400 | 27px | gray-300 | sans |

> H1 dùng kiểu mix: chữ thường + 1 cụm in nghiêng (italic) "Image to Video".

## Components (đo thật)
### Button primary (CTA "Signup to Try!")
- bg `#A855F7`, text `#FAFAFA`, radius `8px`
- focus ring: `rgba(168,85,247,0.4) 0 0 0 2px`

### Button secondary
- bg `#1A1A1A`, text `#fff`, radius `12px`, inset top highlight `rgba(255,255,255,0.25) 0 1px 0 inset`

### Nav pill (AI Music/Videos/Images)
- bg transparent, text #fff, radius `9999px`, padding `8px 16px`, font 16/500

### Sign In pill
- bg `#A3E635`, text `#3F6212`, viền `#D9F99D`, radius `9999px`, padding `4px 16px`

### Announcement "See Pricing →"
- bg `#111827` (gray-900), text #fff, radius `9999px`, padding `2px 14px`, font 14/600

### Input (panel generator)
- bg `#0D0D0D`, text #fff, radius `6px`, shadow none

## Assets chính
- Logo: `https://sendfame.com/cdn-cgi/image/format=webp,width=128/logo/logo.png` (alt "SendFame Logo", href "/")
- Favicon: `https://sendfame.com/favicon-96x96.png`
- OG image: `https://sendfame.com/api/og?title=AI%20Video%20%26%20Music&image=https://sendfame.com/gradient2.jpg`
- Gradient bg: `https://sendfame.com/gradient2.jpg`

## Meta / SEO
- title: `AI Video Generator - Turn Any Image into Video with AI | SendFame`
- description: `Create AI videos from images with full creative control. Multiple AI video models, custom prompts, and pre-made effects. Free AI image to video generator.`
- twitter: `@sendfamecom`, card `summary_large_image`
- og:type website, lang en
- next-head-count 38

## Tracking phát hiện (cho Pha 7 tham khảo)
- Facebook Pixel: `1636932644396730` (connect.facebook.net/signals/config/...)
- Google Ads conversion: `AW-11553070126`, `AW-974790479`
- AppLovin (res4.applovin.com)
- gtag linker domains: `sendfame.com`, `sendfameai.com`, `sendfame.ai` (accept_incoming: true) → cross-domain
