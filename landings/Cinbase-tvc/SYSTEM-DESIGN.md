# SYSTEM-DESIGN.md — CinBase TVC Landing

> **Template:** Landing page bán dịch vụ "Sản xuất TVC & Video AI Marketing cho doanh nghiệp" — thương hiệu **CinBase**, vận hành trên nền tảng **cinAI.tv OS**. Trang một cột dọc (single-page), tiếng Việt, hướng chuyển đổi (book demo + nhận báo giá).
> **Stack:** HTML tĩnh + **Tailwind CDN** (cấu hình inline map vào CSS variable) + CSS thuần (2 file: `tokens.css` design-system, `global.css` component) + 3 file JS thuần vanilla (`tracking-config.js`, `tracking.js`, `main.js`). Không build step, không framework.
> **Hướng thiết kế (style direction):** Dark luxury / cinematic — nền gần như đen (#09090b), điểm nhấn **vàng kem (tan/gold)**, chữ tiêu đề hiện đại + điểm xuyết **serif nghiêng** (Playfair Display) cho cảm giác điện ảnh. Nhiều video nền tự phát, hiệu ứng glow, marquee, sticky-scroll "ống kính xoay".
> **Chạy local:** Mở `index.html` trực tiếp hoặc qua server tĩnh bất kỳ (ví dụ `npx serve`, `python -m http.server`) — không cần build. Tailwind nạp từ CDN nên cần internet.
> **Thứ tự nạp CSS (trong `<head>`):** 1) Google Fonts (Inter, Plus Jakarta Sans, Playfair Display) → 2) `styles/tokens.css` → 3) `styles/global.css` → 4) Tailwind CDN + config inline. JS: `tracking-config.js` + `tracking.js` ở `<head>` (chạy sớm để bắt PageView); `main.js` ở cuối `<body>` với `defer`.

---

## 1. FONT CHỮ

Nguồn: Google Fonts (1 link, subset `vietnamese,latin`, `display=swap`). 3 họ chữ.

| Họ chữ | Nguồn / weights nạp | Token | Vai trò |
|--------|---------------------|-------|---------|
| **Inter** | Google Fonts — 400, 500, 600, 700 | `--font-body` | Chữ thân (body), nút, mô tả, form |
| **Plus Jakarta Sans** | Google Fonts — 500, 600, 700, 800 | `--font-display` | Tiêu đề h1–h4, logo wordmark, số liệu, watermark |
| **Playfair Display** | Google Fonts — ital 500/600 (có cả thẳng 500/600) | (không có token; gọi trực tiếp) | Điểm nhấn serif nghiêng: `.hero-serif`, `.vfl-heading`, số vòng `.vfl-num` |

### Token họ chữ (tokens.css dòng 65–66)
- `--font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;`
- `--font-display: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;`
- Tailwind map (index.html dòng 44–47): `font-sans → Inter`, `font-display → "Plus Jakarta Sans"`.

### Thang cỡ chữ (type scale — tokens.css dòng 67–70)
| Token | Giá trị thật | Dùng cho |
|-------|--------------|----------|
| `--text-hero` | `clamp(2.75rem, 1.2rem + 6.5vw, 4.5rem)` (~44→72px) | (định nghĩa sẵn) |
| `--text-h2` | `clamp(2rem, 1.2rem + 3.2vw, 3rem)` (~32→48px) | (định nghĩa sẵn) |
| `--text-h3` | `clamp(1.25rem, 1.05rem + 0.9vw, 1.5rem)` (~20→24px) | (định nghĩa sẵn) |
| `--text-eyebrow` | `0.8125rem` (13px) | `.eyebrow` nhãn nhỏ trên tiêu đề |

> **KHÔNG CHẮC CHẮN / lưu ý:** Các token `--text-hero/h2/h3` được khai báo trong tokens.css nhưng trong `index.html` phần lớn tiêu đề dùng giá trị `clamp()` viết thẳng trên class Tailwind tùy ý (override theo section), không tham chiếu token. Xem bảng override bên dưới.

### Override cỡ tiêu đề theo từng section (giá trị viết thẳng trong index.html)
| Section | Giá trị `clamp()` thật |
|---------|------------------------|
| Hero h1 | `clamp(2.4rem, 1rem + 6vw, 4.5rem)`, `font-semibold`, `leading-[1.08]` |
| Problem / 3 trụ cột / Quy trình / Thư viện / ROI / Pricing / FAQ / CTA (h2,h3) | `clamp(1.75rem, 1.2rem + 2.5vw, 2.75rem)`, `font-semibold` |
| Tools overview / Platform features (h2) | `clamp(2rem, 1.2rem + 3vw, 3rem)`, `font-semibold` |
| Lead-magnet (h2) | `clamp(1.75rem, 1.2rem + 2.5vw, 2.5rem)` |
| Footer h2 | `clamp(2rem, 1.2rem + 3vw, 3.25rem)` |
| `.vfl-heading` (use-case) | `clamp(2.25rem, 1.5rem + 2.5vw, 3.75rem)`, Playfair italic 600 (global.css dòng 162–163) |
| `.vfl-num` (số vòng) | `64px` Playfair italic (global.css dòng 149–150) |
| `.watermark` "CINBASE" | `clamp(4rem, 20vw, 18rem)`, leading `.8` |
| `.marquee-text` | `clamp(1.25rem, 1rem + 1.1vw, 1.875rem)` |
| `.logo-pill` | `1.125rem` |

### Line-height & weight nền (global.css)
- `body`: `font-size: 14px; line-height: 1.5;` (dòng 9–10).
- `h1,h2,h3,h4`: `font-family: var(--font-display); font-weight: 600; color:#fff; line-height: 1.05;` (dòng 18).
- `.hero-serif`: Playfair italic, `font-weight: 500`, màu trắng (dòng 121–127).

---

## 2. MÀU SẮC

Hệ màu khai trong `tokens.css` theo định dạng HSL "H S% L%" để dùng `hsl(var(--x) / alpha)`. Toàn trang **dark mode mặc định** (`<html class="dark">`, `theme-color #09090B`).

### Nhóm Nền / Surface
| Token | Giá trị (HSL) | ~Hex | Vai trò |
|-------|---------------|------|---------|
| `--background` | `240 10% 4%` | #09090b | Nền trang chính |
| `--background-elevated` | `240 6% 10%` | #18181b | Nền nâng (btn-ghost, footer, feature-card) |
| `--background-subtle` | `240 5% 15%` | #26262b | Nền tinh tế (guided-tab active) |
| `--card` | `240 6% 10%` | (#18181b) | Nền thẻ `.surface`, panel video |
| `--card-elevated` | `240 5% 15%` | — | Thẻ nâng |
| `--popover` | `240 6% 10%` | — | (khai báo sẵn) |
| `--muted` | `240 5% 15%` | — | Nền segmented control / toggle |

### Nhóm Accent thương hiệu (vàng kem / gold-tan)
| Token | Giá trị | ~Hex | Vai trò |
|-------|---------|------|---------|
| `--primary` | `32 47% 80%` | #e0c9a6 (vàng kem) | Màu nhấn chính: nút primary, ring, số liệu, announcement bar |
| `--primary-hover` | `240 5% 86%` | — | (hover sáng) |
| `--primary-foreground` | `0 0% 20%` | #333 | Chữ trên nền primary |
| `--accent` | `32 47% 80%` | = primary | Link, dấu ✓, badge |
| `--accent-hover` | `32 47% 70%` | — | Hover nút primary (`.btn-primary:hover`) |
| `--accent-muted` | `32 47% 30%` | — | (khai báo sẵn) |
| `--accent-foreground` | `240 10% 4%` | — | — |
| `--gold` | `#ffd277` (hex thẳng) | #ffd277 | Gradient vàng (.gradient-gold, .vfl-cta) |
| `--gold-2` | `#77530a` (hex thẳng) | #77530a | (khai báo sẵn, ít dùng) |

### Nhóm Phụ trợ / Trạng thái / Viền
| Token | Giá trị | Vai trò |
|-------|---------|---------|
| `--secondary` / `--secondary-hover` / `--secondary-foreground` | `240 5% 15%` / `240 4% 20%` / `240 5% 84%` | Nền phụ, hover btn-ghost |
| `--success` | `160 84% 39%` | Trạng thái thành công |
| `--warning` | `38 92% 50%` | Cảnh báo |
| `--destructive` | `0 84% 60%` | Lỗi/xóa |
| `--info` | `217 91% 60%` | Thông tin |
| `--border` | `240 5% 15%` | Viền mặc định |
| `--border-subtle` | `240 6% 10%` | Viền mờ |
| `--border-strong` | `240 4% 26%` | Viền đậm (nút, ô input, icon box) |
| `--input` | `240 6% 10%` | Nền ô nhập |
| `--ring` | `32 47% 80%` | Vòng focus (= primary) |

### Nhóm Text
| Token | Giá trị | ~Hex | Vai trò |
|-------|---------|------|---------|
| `--foreground` | `240 5% 96%` | #f4f4f5 | Chữ chính |
| `--foreground-muted` | `240 4% 58%` | #909096 | Chữ mờ (eyebrow, placeholder) |
| `--muted-foreground` | `240 4% 58%` | — | Mô tả, chú thích |
| `--card-foreground` | `240 5% 96%` | — | — |

### Màu hex viết thẳng đáng chú ý (trong index.html)
- Logo wordmark "CinBase": "in" = `#5BB8F5` (xanh), "Bas/e" = `#A78BFA` (tím) — dòng 85, 849. **Đây là 2 màu thương hiệu riêng của logo, không nằm trong token.**
- Announcement bar: chữ `#333`, nút trong bar `#1a1a1d` (hover `black`) — dòng 62, 67.
- Nút trắng trong hero-card: `bg-white/95`, chữ `#1a1a1d` — dòng 155, 167, 179.
- Icon cảnh báo Problem: `red-500/10 + red-400`, `amber-500/10 + amber-400` (Tailwind palette).

### Shadow (tokens.css dòng 57–62)
`--shadow-xs/sm/md/lg/xl/inner` — tông đen alpha (vd `--shadow-lg: 0 10px 15px -3px #0009`).

---

## 3. BỐ CỤC

### Container / Spacing / Radius
- Container chính `.container-2xl`: `max-width: var(--container-max)` = **1536px** (= `max-w-screen-2xl`), `margin-inline:auto`, padding ngang **1rem → 1.5rem (≥640px) → 2rem (≥1024px)** (global.css dòng 26–28).
- Token layout: `--announcement-h: 48px`, `--header-h: 76px`, `--space-section: clamp(4rem, 3rem + 5vw, 7rem)`.
- Radius (tokens.css 50–54): `--radius-sm 4px`, `--radius 6px`, `--radius-lg 8px`, `--radius-xl 12px`, `--radius-2xl 16px`. Tailwind map `DEFAULT/lg/xl/2xl` về các biến này.
- Nhịp section điển hình: `py-16 sm:py-20 lg:py-24` (≈ 64 / 80 / 96px).

### Bảng breakpoint thực dùng
| Breakpoint | Điểm | Tác động chính |
|------------|------|----------------|
| `sm` | 640px | Tăng padding container; hiện nút "Nhận Tư Vấn" trên header; lưới Problem/ROI 2–3 cột; padding section tăng |
| `md` | 768px | Hero feature cards chuyển hàng ngang + accordion `flex:3` khi active (global.css 68); video tròn trong hero h1 hiện; bento 2 cột |
| `lg` | 1024px | Nav pill hiện (ẩn nút hamburger); kích hoạt **sticky VFL "ống kính xoay"** (main.js `mq min-width:1024px`); lens + vòng số hiện; bento 12 cột; layout 2 cột process/lead/faq |
| (max-width) 767px | <768 | hero-card__reveal mở sẵn, preview hiện sẵn (global.css 117–118) |
| (max-width) 1023px | <1024 | VFL về xếp dọc tĩnh (`height:auto`, panel relative — global.css 222–228); JS gắn `is-active` cho mọi panel |

### Sơ đồ khung trang dọc (theo đúng comment đánh số trong index.html)
```
<body>
├─ [00] #announcement-bar      — thanh thông báo (đóng được), z-60
├─ [01] #site-header           — fixed top-12, logo + nav pill + 2 CTA + hamburger
├─ <main id="top">
│  ├─ [02] HERO                — h1 (video tròn nhúng) + 4 số li(−80%/X3/−70%/500+) + 3 hero-card hover-accordion
│  ├─ [02c] PROBLEM AGITATION  — 2 thẻ "Truyền thống" vs "Tool AI cơ bản"
│  ├─ [03] #models CLIENTS STRIP — marquee logo engine AI (Gemini/GPT-4o/Veo3/Seedance + social)
│  ├─ [04] TOOLS OVERVIEW      — segmented tabs 7 mục → 7 panel video (1 hiện/lần)
│  ├─ [05] #use-cases VFL      — STICKY 520vh: lens xoay + vòng số + 5 panel ngành crossfade
│  ├─ [05b] 3 TRỤ CỘT CÔNG NGHỆ — 3 glow-card
│  ├─ [06] #features PLATFORM  — bento 12-cột (card lớn + nhỏ + card full Base/n8n)
│  ├─ [07] #process QUY TRÌNH  — vertical tabs (4 bước) ↔ 4 panel video
│  ├─ [08] MARQUEE VIDEO       — "Mỗi lần một video khác biệt": niche-marquee 8 tile 9:16 (×2 loop)
│  ├─ [09] ROI + PROOF         — bảng so sánh 3 cột + 3 stat-card + testimonial
│  ├─ [10] #pricing            — toggle cam kết 1/6/12 tháng + 2 gói (Cơ Bản/Nâng Cao) + ưu đãi khối lượng
│  ├─ [10a] RISK REVERSAL      — 3 cam kết (duyệt trước / hóa đơn GTGT / bản quyền)
│  ├─ [10b] #lead-magnet       — form (email + 3 select) + preview "hành trình 1 video" + ảnh hóa đơn
│  ├─ [11] #faq                — heading + CTA | accordion 9 câu hỏi
│  ├─ [12] CTA READY TO BUILD  — khối video nền + CTA cuối + hotline
│  └─ [13] MARQUEE STRIP       — dải chữ chạy full-width (aria-hidden)
├─ [14] <footer>              — heading+CTA + grid 7 cột link + watermark "CINBASE"
└─ [99] #chat-widget          — nút chat nổi góc phải (placeholder alert)
```

---

## 4. ANIMATION & MOTION

### Token motion (tokens.css 79–83)
| Token | Giá trị |
|-------|---------|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--dur-fast` | `150ms` |
| `--dur-normal` | `300ms` |
| `--dur-reveal` | `650ms` |

### Bảng @keyframes (global.css)
| Keyframes | Mô tả | Dùng cho |
|-----------|-------|----------|
| `landing-fade-up` | opacity 0→1, translateY 32px→0 | `[data-reveal]` mặc định |
| `landing-fade-in` | opacity 0→1 | `[data-reveal="fade"]` |
| `landing-scale-in` | opacity + scale .96→1 | `[data-reveal="scale"]` |
| `gradient-shift` | trượt background-position 6s | `.gradient-gold` |
| `marquee-x` | translateX 0 → −100% (chạy `reverse`) | `.marquee__track` (logo + chữ) |
| `niche-marquee` | translateX 0 → −50%, 60s | dải video `.niche-marquee` |
| `vfl-cta-pulse` | nhịp box-shadow (vòng sáng lan) 2.4s | nút `.vfl-cta` (hút mắt kiểu Ladi) |
| `vfl-cta-shine` | vệt sáng quét qua nút 3.2s | `.vfl-cta::before` |

### Scroll reveal
`[data-reveal]` khởi tạo `opacity:0; translateY(32px)`; IntersectionObserver thêm `.in-view` → chạy keyframes (global.css 50–55). Biến thể `data-reveal="fade"` và `="scale"`. `[data-stagger]` set `animation-delay = index*80ms` cho con (main.js 17–19).

### Hover
- `.btn-primary:hover` đổi nền sang `accent-hover`; `.btn:active` lún 1px.
- `.feature-card:hover` viền primary + `translateY(-4px)` + bật `__glow`.
- `.glow-card:hover` viền primary + `translateY(-8px)` + bật 2 lớp glow (::before, ::after).
- `.stat-card:hover` tương tự glow + nâng −8px.
- `.preview-host:hover`/`focus-within` → overlay `.video-preview` hiện (opacity+blur), nút trượt vào.
- `.hero-card:hover` → mở rộng `flex` + hiện `__preview` + `__reveal`.
- `marquee` & `niche-marquee`: `:hover` → `animation-play-state: paused`.

### Tương tác mở/đóng (cơ chế thật)
| Thành phần | Cơ chế |
|------------|--------|
| **Announcement bar** | Nút `#announcement-close` → set `display:none` cho bar + đẩy header `top:0` (main.js 199–207). |
| **Mobile nav** | `#nav-toggle` → toggle class `hidden` trên `header nav` (main.js 190–197). Đơn giản, không overlay. |
| **Header hide/show** | Cuộn xuống (>90px) → thêm `.header-hidden` (`translateY(-150%)`); cuộn lên/gần đỉnh → bỏ; >24px thêm `.is-scrolled` (main.js 22–44). |
| **Tabs (tools + guided)** | `role=tab`/`tabpanel`, dùng thuộc tính `hidden`; chọn tab → set `aria-selected` + ẩn/hiện panel + load/play video panel active, pause panel khác; hỗ trợ phím ←/→ (main.js 46–72). |
| **Hero feature cards** | Accordion ngang: `mouseenter`/`focusin` → `activate(i)` (toggle `.is-active`, mở rộng flex, play video) (main.js 74–93). Mặc định card 0 active. |
| **FAQ accordion** | Single-open: click → đóng tất cả, mở mục vừa click qua `aria-expanded`; CSS dùng `grid-template-rows 0fr→1fr` để mở mượt, chevron xoay 180° (main.js 95–108, global.css 230–240). |
| **Pricing term toggle** | 3 nút `.term-opt` (1/6/12 tháng) → đổi text `[data-price]`, `[data-anchor]` (ẩn nếu trống), `[data-term-suffix]`, ghi chú; bắn `SelectTerm` (main.js 209–239). |
| **Marquee** (logo/chữ + niche video) | Thuần CSS (translateX vô hạn), dải nhân đôi để loop liền mạch; pause khi hover. |
| **Sticky VFL "ống kính xoay"** | Xem mục 5 — driven bởi scroll progress (không phải tab). |
| **Carousel** | Có handler `[data-carousel]` + prev/next scrollBy (main.js 110–118) nhưng **KHÔNG CÓ** markup `data-carousel` trong index.html hiện tại → handler không kích hoạt (code dự phòng). |
| **Chat widget** | Click → `alert()` placeholder (main.js 273–275). |

---

## 5. SCROLL REVEAL & EVENT FLOW

### Sơ đồ init (IIFE main.js, chạy sau `defer`)
```
main.js (IIFE 'use strict')
├─ prefersReduced = matchMedia('(prefers-reduced-motion: reduce)')
├─ 1. Scroll reveal     → IO threshold .12, rootMargin -8% → add .in-view, unobserve; stagger delay i*80ms
├─ 2. Header scroll     → rAF throttle, is-scrolled(>24) + header-hidden(>90 & down)
├─ 3. Tabs              → mỗi [role=tablist][data-tabs] → click/keydown ←→ → select() + load/play video
├─ 3b. Hero cards       → mouseenter/focusin → activate(); card 0 mặc định active
├─ 4. FAQ accordion     → single-open theo aria-expanded
├─ 5. Carousel          → prev/next scrollBy (chỉ chạy nếu có [data-carousel])
├─ 6. VFL sticky        → scroll → lens rotate + số orbit + chọn panel gần 0° (chỉ ≥1024px)
├─ 7. Lazy video        → IO threshold .25 → load+play khi vào view, pause khi rời (loại video trong hero-card)
├─ 8. Mobile nav toggle → toggle .hidden
├─ 8b. Announcement close
├─ 8c. Term toggle      → đổi giá theo 1/6/12 tháng + cinaiTrack('SelectTerm')
├─ 8d. Lead form        → focusin→LeadFormStart; change select→Select*; submit→CompleteRegistration + show success
└─ 9. Chat widget       → alert placeholder
```

### Chi tiết handler đáng chú ý
- **VFL sticky (main.js 120–172):** section cao `520vh`, `.vfl-sticky-full` `position:sticky; top:0; height:100vh`. Khi cuộn, tính `progress 0..1` từ `getBoundingClientRect().top` và `offsetHeight - innerHeight`. `ringRot = -progress*(N-1)*72°`; xoay ảnh lens (`lence.webp`) + đặt từng số `.vfl-num` trên vòng tròn bán kính `RADIUS=375px` (cos/sin), opacity sáng bên phải (cos>0) mờ bên trái; panel có số gần `0°` (vị trí 3 giờ) → `setActive` (crossfade + play video active, pause còn lại). N=5 panel, STEP=72°. Chỉ chạy ≥1024px; nhỏ hơn → tất cả panel `is-active`. Đổi breakpoint → `location.reload()`.
- **Lazy video (174–188):** mọi `video[data-lazy-video]` (trừ video trong hero-card) → IO 0.25: vào view thì `load()` (1 lần) + `play()` nếu không nằm trong phần tử `[hidden]`; rời view thì `pause()`.
- **Lead form (241–271):** lần focus đầu → `LeadFormStart`; mỗi select đổi → `SelectIndustry/SelectGoal/SelectVatInvoice`; submit (preventDefault) → gom `{email,industry,goal,vat_invoice,lead_source:'landing'}` → `cinaiTrack('CompleteRegistration', data)` (1 event_id dùng chung cho Pixel + CAPI) → disable nút "Đang gửi…" → sau 600ms ẩn fields, hiện thông báo thành công.

> Ghi chú: `main.js` không trực tiếp đọc/đợi `prefersReduced` ngoài việc khai báo; xử lý reduced-motion chủ yếu ở CSS (global.css 403–409).

---

## 6. COMPONENT HIERARCHY

```
App (index.html)
├─ AnnouncementBar [00]              (mặc định HIỆN; đóng được)
├─ Header#site-header [01] (fixed)
│  ├─ Logo (wordmark 2 màu) 
│  ├─ NavPill (hidden <lg → HIỆN ≥lg)   [Dịch vụ·Ngành nghề·Quy trình·Bảng giá·Hỏi đáp]
│  ├─ CTA "Xem Báo Giá" (.btn-ghost)
│  ├─ CTA "Nhận Tư Vấn" (.btn-primary, hidden <sm)
│  └─ NavToggle hamburger (HIỆN <lg)
├─ Hero [02]
│  ├─ H1 (+ 2 video tròn nhúng, hidden <md)
│  ├─ StatRow (4 số liệu)
│  └─ HeroCards ×3 (accordion) — card[0] is-active MẶC ĐỊNH
│     └─ video(lazy) · overlay · preview-link · body(reveal)
├─ ProblemAgitation [02c] — 2 surface card
├─ ClientsStrip#models [03] — marquee (×2 track) logo-pill
├─ ToolsOverview [04]
│  ├─ Segmented tabs ×7 — tab[0]"TVC 30s" aria-selected=true MẶC ĐỊNH
│  └─ Panels ×7 — panel[0] HIỆN, 6 panel còn lại [hidden]
├─ VFL#use-cases [05] (sticky)
│  ├─ Lens img + NumberRing ×5
│  └─ Panels ×5 — panel[0] is-active MẶC ĐỊNH (≥lg do scroll điều khiển)
├─ TechPillars [05b] — 3 glow-card
├─ PlatformFeatures#features [06] — bento (card 7×2, 5, 5, 7, 5, full Base/n8n)
├─ Process#process [07]
│  ├─ Guided tabs ×4 (dọc) — tab[0]"Kịch bản" MẶC ĐỊNH
│  └─ Panels video ×4 — panel[0] HIỆN
├─ ResultsMarquee [08] — niche-marquee ×8 tile (+8 bản aria-hidden)
├─ ROIProof [09] — bảng so sánh + 3 stat-card + testimonial
├─ Pricing#pricing [10]
│  ├─ TermToggle (1/"6"/12) — "6 tháng" is-active MẶC ĐỊNH
│  ├─ PlanCard "Cơ Bản"
│  └─ PlanCard "Nâng Cao" (highlight ring + badge "Đề xuất")
│  └─ VolumeOffers ×3 (giữa "Khuyên dùng")
├─ RiskReversal [10a] — 3 cam kết
├─ LeadMagnet#lead-magnet [10b]
│  ├─ Form (email + select industry/goal/vat + submit) + Success(hidden MẶC ĐỊNH)
│  └─ JourneyPreview + ảnh hóa đơn
├─ FAQ#faq [11] — 9 faq-item (TẤT CẢ aria-expanded=false MẶC ĐỊNH)
├─ FinalCTA [12] — video nền + CTA
├─ MarqueeStrip [13] (aria-hidden)
├─ Footer [14] — heading+CTA + grid 7 cột + watermark
└─ ChatWidget#chat-widget (fixed, placeholder)
```

---

## 7. DATA LOGIC

### Hằng / cấu hình trong JS
- `window.CINAI_CONFIG` (tracking-config.js) — xem mục 8.
- `STANDARD` (tracking.js 48): map tên event nội bộ → tên event chuẩn Meta: `PageView, ViewContent, Lead(=Lead/LeadSubmit), CompleteRegistration, InitiateCheckout, Purchase`.
- `passthroughKeys` (tracking.js 105): `['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid']`.
- VFL hằng số (main.js): `N = số panel (5)`, `STEP = 360/N = 72°`, `RADIUS = 375px`.
- Stagger delay: `i * 80ms`.

> **Nội dung trang là TĨNH** — không có mảng dữ liệu render động (no JSON/list-render). Mọi nội dung (gói giá, FAQ, use-case, tile video) viết thẳng trong HTML. Giá theo kỳ hạn lưu ở **data-attribute** và JS chỉ swap text.

### Bảng giá (data-attr trên `[data-price]` / `[data-anchor]`, pricing section)
| Gói | 1 tháng | 6 tháng (mặc định) | 12 tháng | Giá gạch (anchor) |
|-----|---------|--------------------|----------|-------------------|
| **Cơ Bản (Core AI)** | 99.000đ | 89.000đ | 79.000đ | a1 159.000đ · a6/a12 99.000đ |
| **Nâng Cao (Cinematic AI)** | 289.000đ | 269.000đ | 249.000đ | a1 399.000đ · a6/a12 289.000đ |

Ưu đãi khối lượng: Starter **Mua 12 tặng 3** (15 video/tháng) · Pro **Mua 25 tặng 5** (30/tháng, "Khuyên dùng") · Unlimited **Mua 50 tặng 10** (60/tháng).

### Số liệu / nội dung chính
- Hero stats: **−80%** chi phí · **X3** biến thể Ads · **−70%** hậu kỳ · **500+** video/tháng.
- ROI bảng: Chi phí (Cao → Giảm 80%) · Hậu kỳ (1 tuần → Vài giờ) · Scale (Giới hạn → Không giới hạn/Batch). Stat: **3 tháng** triển khai · **−70%** hậu kỳ · **X3** creative.
- Engine AI nêu tên: Gemini, GPT-4o, Veo 3, Seedance 2.0 & Omni, Kling. Nền tảng phát hành: YouTube, TikTok, Facebook, Instagram.
- FAQ: 9 câu (giá, thời gian, duyệt kịch bản, chỉ có ảnh sản phẩm, bản quyền nhạc/giọng, loại video, chạy ads, ưu đãi số lượng, cách bắt đầu).

### Hằng điều hướng / CTA
- Anchor nội bộ: `#top, #features, #use-cases, #process, #pricing, #faq, #lead-magnet, #models`.
- CTA chính lặp lại: "Nhận 3 Video Demo Miễn Phí" / "Nhận Tư Vấn Miễn Phí" / "Nhận Báo Giá TVC" → đều trỏ `#lead-magnet`; "Xem Bảng Giá" → `#pricing`.
- Liên hệ tĩnh: Hotline **1900-8888** (`tel:19008888`), email **hello@cinai.tv** (`mailto:`).
- Link ngoài: các `https://cinai.tv/template/<id>` (Preview Workflow theo ngành/định dạng), social footer (href `#` placeholder).
- **Placeholder template chưa điền:** `{{BASE_LP_URL}}`, `{{N8N_LP_URL}}` (link sang landing Base/Lark & n8n), `{{N8N_WEBHOOK}}` (action form — lưu ý form thực gửi qua `cinaiTrack`, không qua attribute này), `{{PRICING_URL}}`, `{{MAIN_DOMAIN}}`, `{{ROOT_COOKIE}}`.

---

## 8. TRACKING

**CÓ** — hệ tracking Meta 4 lớp (Browser Pixel + CAPI qua n8n + EMQ attribution + Dedup event_id). File: `scripts/tracking-config.js` + `scripts/tracking.js`. Nạp ở `<head>` (chạy trước, bắt PageView sớm).

### Cấu hình thật (tracking-config.js → window.CINAI_CONFIG)
| Khóa | Giá trị | Trạng thái |
|------|---------|------------|
| `PIXEL_ID` | `2215508219251213` | **ĐÃ ĐIỀN** (Meta Pixel CinAI/CinBase) |
| `N8N_WEBHOOK` | `https://n8n.halcion.vn/webhook/cinai-track` | **ĐÃ ĐIỀN** (CAPI + ghi Lark) |
| `MAIN_DOMAIN` | `{{MAIN_DOMAIN}}` | CHƯA ĐIỀN (placeholder) |
| `PRICING_URL` | `{{PRICING_URL}}` | CHƯA ĐIỀN |
| `ROOT_COOKIE` | `{{ROOT_COOKIE}}` | CHƯA ĐIỀN (để trống khi localhost) |
| `CURRENCY` | `VND` | — |
| `DEBUG` | `true` | **ĐANG BẬT** — log event ra console; cần đặt `false` khi production |

> Trạng thái tổng: **ENABLED** (Pixel + Webhook đã có giá trị thật → bắn event thật). Khi để placeholder `{{...}}` thì module tự về chế độ "log-only" (hàm `isSet()` lọc giá trị chứa `{{`).
> An toàn dữ liệu: file `env.local` (212 bytes) **có tồn tại** trong thư mục — không in nội dung (chứa secret/biến môi trường). Không thấy secret hardcode trong 3 file JS ngoài Pixel ID + URL webhook công khai ở config.

### Cơ chế (tracking.js)
- **Attribution / EMQ:** đọc `fbclid`, dựng `_fbc` (format `fb.1.<ts>.<fbclid>`) nếu thiếu, đọc `_fbp`; gom utm_* + placement + `event_source_url` (dòng 17–29).
- **Dedup:** `event_id = name.<Date.now()>.<seq>.<perf>`; Browser Pixel và CAPI gửi **cùng event_id** (dòng 33, 51, 58).
- **`window.cinaiTrack(name, params)`** (49–74): bắn `fbq('track'|'trackCustom', …, {eventID})` + gửi server tới `N8N_WEBHOOK`. Server dùng `navigator.sendBeacon` với `Content-Type: text/plain` (CORS-safelisted → không preflight, gửi được cross-origin) hoặc fallback `fetch mode:'no-cors', keepalive`.
- **Auto:** `PageView` + `ViewContent{content_name:'cinai_landing'}` ngay khi load (77–78); **scroll depth** 25/50/75 → `Scroll25/50/75` (80–88).
- **Bind click:** mọi `[data-track]` → đọc tên + gom các `data-*` còn lại làm params (90–102).
- **CTA passthrough:** với link `a[data-cta]` trỏ `cinai.tv` → nối utm/fbclid/fbp/fbc; đồng thời thay `{{PRICING_URL}}`/`{{MAIN_DOMAIN}}` nếu config đã set (104–125).

### Sự kiện sử dụng trong trang
- Tự động: `PageView`, `ViewContent`, `Scroll25/50/75`.
- Form: `LeadFormStart`, `SelectIndustry`, `SelectGoal`, `SelectVatInvoice`, `CompleteRegistration` (chuẩn Meta).
- Click `data-track`: `ClickAnnouncement, ClickHeaderPricing, ClickHeaderConsult, ClickHeroCTA, ClickHeroCardCTA, ClickPreviewWorkflow, SelectModule, ViewUseCase, ClickVflCTA, ClickFeaturesPricing, ClickBaseLP, ClickN8nLP, SelectGuided, ClickWhyCTA, ClickBasicOffer, ClickProOffer, ClickFaqConsult, ClickFinalCTA, ClickFooterCTA, SelectTerm`.
- Thuộc tính ngữ cảnh kèm theo: `data-cta` (consult/pricing/lead-magnet/base-lp/n8n-lp), `data-cta-type` (hot/cold), `data-industry`, `data-module`, `data-guided`, `data-plan` (co-ban/nang-cao).

---

## 9. CHECKLIST CHẤT LƯỢNG (đối chiếu thực tế source)

- [x] **Design token tập trung** — toàn bộ màu/typography/spacing/motion/radius khai trong `tokens.css`, dùng qua `hsl(var(--x)/alpha)`; Tailwind map về biến (không hardcode lặp ở phần lớn chỗ).
- [x] **Semantic HTML** — `<header><main><section><footer><article><figure><nav aria-label>`, `role=tablist/tab/tabpanel`, `aria-selected`, `aria-expanded`, `aria-label`, `aria-hidden` cho phần trang trí.
- [x] **Reduced motion** — khối `@media (prefers-reduced-motion: reduce)` tắt animation/transition, giữ marquee chạy chậm (global.css 403–409).
- [x] **Animation compositor-friendly** — chủ yếu `transform`/`opacity` (reveal, hero-card flex là ngoại lệ, VFL dùng transform).
- [x] **Lazy media** — video `preload="none"` + `data-lazy-video`, chỉ `load()/play()` khi vào viewport; poster ảnh nhẹ.
- [x] **Focus state** — `:focus-visible` outline dùng `--ring`; hero-card/preview có focus-within.
- [x] **Tracking đầy đủ** — Pixel + CAPI + dedup event_id + attribution + scroll depth + click binding.
- [x] **CTA passthrough cross-domain** — giữ utm/fbclid/fbp/fbc sang cinai.tv.
- [x] **Form UX** — validate `required`/`type=email`, trạng thái "Đang gửi…", thông báo thành công, cam kết không spam.
- [x] **Nội dung tiếng Việt nhất quán** — toàn trang VN, đúng ngữ cảnh dịch vụ TVC/video AI VN (giá VND, hóa đơn GTGT, hotline VN).
- [ ] **DEBUG=false cho production** — hiện `DEBUG:true` (log console) — CẦN tắt khi go-live.
- [ ] **Placeholder chưa điền** — `{{MAIN_DOMAIN}}`, `{{PRICING_URL}}`, `{{ROOT_COOKIE}}`, `{{BASE_LP_URL}}`, `{{N8N_LP_URL}}`, `{{N8N_WEBHOOK}}` (action form) còn nguyên — cần điền/kiểm trước deploy.
- [ ] **Phụ thuộc CDN runtime** — Tailwind nạp từ `cdn.tailwindcss.com` (không tối ưu cho production; nên build tĩnh). Social footer href `#` placeholder.
- [~] **Code thừa dự phòng** — handler carousel (`[data-carousel]`) và một số class (`.bill-opt`, `.vfl-dot`, `.tab-btn/.tab-panel`, `.gradient-gold`) không có markup tương ứng đang dùng → vô hại nhưng là dead code nhẹ.

---

> **Tham chiếu chéo:** Tài liệu này bổ sung cho `SYSTEM-XRAY.md` (bản đồ X-quang 9 phần) và `SYSTEM-XRAY-CLONE.md` (chênh lệch bản clone), cùng thư mục `extraction/` (`content.md`, `tokens-raw.md`, `animations.md`, `behavior-map.md`, `performance.md`, `xray-diff.md`) — đều tồn tại trong `templates/Cinbase-tvc/`. Nguồn gốc design system trích từ `mstudio.ai` (ghi chú trong header `tokens.css`/`main.js`); nội dung & thương hiệu đã Việt hóa cho CinBase / cinAI.tv.
