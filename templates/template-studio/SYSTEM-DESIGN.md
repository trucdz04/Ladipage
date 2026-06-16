# SYSTEM-DESIGN — template-studio (CinAI.tv)

> **Template**: Landing page tĩnh `template-studio` — clone & rebrand từ **mstudio.ai** sang **CinAI.tv** (AI Creative Workspace cho ad images, product shots, storyboards & AI video).
> **Stack**: HTML tĩnh + **Tailwind CDN** (`cdn.tailwindcss.com`, cấu hình inline map vào CSS variables) + 2 file CSS thuần (`styles/tokens.css` design tokens, `styles/global.css` component/utility) + 3 file JS thuần (`scripts/main.js` tương tác UI, `scripts/tracking-config.js` + `scripts/tracking.js` đo lường Meta). KHÔNG framework, KHÔNG build step, KHÔNG node_modules.
> **Style direction**: Dark-luxury (nền gần đen `#09090b`, nhấn vàng kem/tan `#e0c9a6`), ngôn ngữ **tiếng Anh**. Hero serif italic ("without counting credits") + **pill video** bo tròn nhúng trong heading, bố cục **bento** (feature cards lệch cột 7/5/12), pricing **Pro/Plus** có billing toggle, **lead-magnet form** (email + industry + goal) gửi webhook n8n, tracking Meta 4 lớp (Pixel + CAPI + EMQ + Dedup).
> **Chạy local**: mở trực tiếp `index.html` bằng trình duyệt, hoặc serve tĩnh (vd `python -m http.server` rồi mở `http://localhost:8000/`). Video/asset dùng đường dẫn tương đối `assets/…` nên cần phục vụ từ thư mục template.
> **Thứ tự nạp CSS** (trong `<head>`): (1) Google Fonts (Inter, Plus Jakarta Sans, Instrument Serif) → (2) `styles/tokens.css` → (3) `styles/global.css` → (4) Tailwind CDN + cấu hình inline. Tracking nạp ở cuối `<head>`: `tracking-config.js` rồi `tracking.js`; `main.js` nạp cuối `<body>` với `defer`.

---

## 1. FONT CHỮ

### Nguồn font (Google Fonts, `index.html` dòng 19)
| Font | Weights nạp | Vai trò |
|------|-------------|---------|
| **Inter** | 400, 500, 600, 700 | Body / sans mặc định (`--font-body`) |
| **Plus Jakarta Sans** | 500, 600, 700, 800 | Display / heading (`--font-display`) |
| **Instrument Serif** | ital 0;1 (regular + italic) | Hero serif highlight, VFL heading & số orbit |

### Bảng vai trò → token → giá trị
| Vai trò | Token | Giá trị thật |
|---------|-------|--------------|
| Body sans | `--font-body` | `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` (`tokens.css` 65) |
| Display/heading | `--font-display` | `"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` (`tokens.css` 66) |
| Serif nhấn | (class `.hero-serif`, `.vfl-heading`, `.vfl-num`) | `"Instrument Serif", Georgia, "Times New Roman", serif`, italic, weight 400 (`global.css` 79-85, 108, 120) |
| Tailwind `font-sans` | — | `['Inter','sans-serif']` (`index.html` 45) |
| Tailwind `font-display` | — | `['"Plus Jakarta Sans"','sans-serif']` (`index.html` 46) |

### Thang cỡ chữ (token, từ `tokens.css` 67-70)
| Token | Giá trị (clamp) | Quy đổi xấp xỉ | Dùng cho |
|-------|-----------------|----------------|----------|
| `--text-hero` | `clamp(2.75rem, 1.2rem + 6.5vw, 4.5rem)` | ~44 → 72px | (định nghĩa sẵn — H1 hero thực tế dùng clamp inline, xem dưới) |
| `--text-h2` | `clamp(2rem, 1.2rem + 3.2vw, 3rem)` | ~32 → 48px | H2 section |
| `--text-h3` | `clamp(1.25rem, 1.05rem + 0.9vw, 1.5rem)` | ~20 → 24px | H3 |
| `--text-eyebrow` | `0.8125rem` | 13px | Nhãn eyebrow (`.eyebrow`) |
| Body | — | `font-size: 14px; line-height: 1.5` (`global.css` 9-10) | Body mặc định |

### Override heading theo section (clamp inline trong HTML)
| Section | Cỡ chữ (clamp inline) | Vị trí |
|---------|-----------------------|--------|
| Hero H1 | `clamp(2.4rem, 1rem + 6vw, 4.5rem)`, weight 600, line-height 1.08 | `index.html` 114 |
| Tools H2 ("One workspace…") | `clamp(2rem, 1.2rem + 3vw, 3rem)`, weight 600 | 196 |
| Features H2 | `clamp(2rem, 1.2rem + 3vw, 3rem)`, weight 600 | 270 |
| Guided / Carousel / Why / Pricing / Lead / FAQ / CTA H2-H3 | `clamp(1.75rem, 1.2rem + 2.5vw, 2.75rem)`, weight 600 | 352, 389, 411, 461, 585, 641 |
| Lead-magnet H2 | `clamp(1.75rem, 1.2rem + 2.5vw, 2.5rem)` | 526 |
| Footer H2 | `clamp(2rem, 1.2rem + 3vw, 3.25rem)` | 678 |
| Footer watermark "CINAI.TV" | `clamp(4rem, 20vw, 18rem)`, line-height .8 | 718 |
| VFL heading | `clamp(2.25rem, 1.5rem + 2.5vw, 3.75rem)` (Instrument Serif) | `global.css` 121 |

### Line-height & weights
- `h1..h4` (global): `font-weight: 600`, `line-height: 1.05`, `color: #fff` (`global.css` 18).
- Body: `line-height: 1.5` (`global.css` 10); VFL desc `line-height: 1.6` (`global.css` 124).
- Stat title: weight **700**, Instrument-không (dùng `--font-display`), size 1.5rem (`global.css` 240).

---

## 2. MÀU SẮC

Hệ màu định dạng HSL không-`hsl()` (`"H S% L%"`) để dùng `hsl(var(--x) / alpha)`. Tất cả từ `tokens.css`.

### Nền / surface
| Token | Giá trị HSL | Hex (ghi chú nguồn) | Vai trò |
|-------|-------------|----------------------|---------|
| `--background` | `240 10% 4%` | `#09090b` | Nền trang chính |
| `--background-elevated` | `240 6% 10%` | `#18181b` | Nền nâng (btn-ghost, footer) |
| `--background-subtle` | `240 5% 15%` | `#26262b` | Nền tinh tế (guided tab hover) |
| `--card` | `240 6% 10%` | — | Nền card |
| `--card-elevated` | `240 5% 15%` | — | Card nâng |
| `--popover` | `240 6% 10%` | — | Popover |

### Accent (gold / tan)
| Token | Giá trị | Vai trò |
|-------|---------|---------|
| `--primary` | `32 47% 80%` (vàng kem `#e0c9a6`) | Màu nhấn chính (btn-primary, announcement bar, badge) |
| `--primary-hover` | `240 5% 86%` | Hover primary (KHÔNG CHẮC CHẮN — giá trị xám, dùng hạn chế) |
| `--primary-foreground` | `0 0% 20%` (`#333`) | Chữ trên nền primary |
| `--accent` | `32 47% 80%` | = primary (link accent, ✓ pricing) |
| `--accent-hover` | `32 47% 70%` | Hover nút primary (`btn-primary:hover`) |
| `--accent-foreground` | `240 10% 4%` | Chữ trên accent |
| `--accent-muted` | `32 47% 30%` | Accent mờ |
| `--gold` | `#ffd277` | Gradient gold text (`.gradient-gold`) |
| `--gold-2` | `#77530a` | Gold tối (chưa dùng trực tiếp — KHÔNG CHẮC CHẮN) |

### Phụ trợ / trạng thái
| Token | Giá trị | Vai trò |
|-------|---------|---------|
| `--secondary` | `240 5% 15%` | Nền phụ |
| `--secondary-hover` | `240 4% 20%` | Hover btn-ghost |
| `--secondary-foreground` | `240 5% 84%` | Chữ phụ |
| `--success` | `160 84% 39%` | Trạng thái thành công (KHÔNG dùng trong UI hiện tại) |
| `--warning` | `38 92% 50%` | Cảnh báo (chưa dùng) |
| `--destructive` | `0 84% 60%` | Lỗi (chưa dùng) |
| `--info` | `217 91% 60%` | Thông tin (chưa dùng) |
| `--border` | `240 5% 15%` | Viền mặc định |
| `--border-subtle` | `240 6% 10%` | Viền tinh tế |
| `--border-strong` | `240 4% 26%` | Viền đậm (btn-ghost, icon box) |
| `--input` | `240 6% 10%` | Nền input |
| `--ring` | `32 47% 80%` | Focus ring |

### Text
| Token | Giá trị | Hex | Vai trò |
|-------|---------|-----|---------|
| `--foreground` | `240 5% 96%` | `#f4f4f5` | Chữ chính |
| `--foreground-muted` | `240 4% 58%` | `#909096` | Chữ mờ (eyebrow, placeholder) |
| `--muted` | `240 5% 15%` | — | Nền muted (tablist, billing toggle) |
| `--muted-foreground` | `240 4% 58%` | — | Chữ muted (mô tả) |
| `--card-foreground` | `240 5% 96%` | — | Chữ trên card |
| Trắng tuyệt đối | `#fff` | `#fff` | Heading, chữ nổi bật (dùng trực tiếp) |

### Shadow (`tokens.css` 57-62)
`--shadow-xs … --shadow-xl` dùng tone đen alpha (`#0009`, `#0006`…); `--shadow-lg` dùng cho `.vfl-card`, `--shadow-xl` cho tab panel.

---

## 3. BỐ CỤC

### Container / spacing / radius
| Hạng mục | Token / giá trị | Nguồn |
|----------|-----------------|-------|
| Container max | `--container-max: 1536px` (= `max-w-screen-2xl`), class `.container-2xl` | `tokens.css` 73, `global.css` 26 |
| Padding container | 1rem → 1.5rem (≥640) → 2rem (≥1024) | `global.css` 26-28 |
| Spacing section | `--space-section: clamp(4rem, 3rem + 5vw, 7rem)` (token; section thực tế dùng `py-16/20/24`) | `tokens.css` 76 |
| Announcement height | `--announcement-h: 48px` (`min-h-12`) | `tokens.css` 74 |
| Header height | `--header-h: 76px` (`h-[76px]`, fixed `top-12`) | `tokens.css` 75 |
| Radius | `--radius-sm 4px`, `--radius 6px`, `--radius-lg 8px`, `--radius-xl 12px`, `--radius-2xl 16px` | `tokens.css` 50-54 |
| Btn cao | `.btn` height 44px; announcement btn 32px (`h-8`) | `global.css` 38 |

### Breakpoint (Tailwind mặc định) + tác động
| Breakpoint | px | Tác động chính |
|------------|----|----|
| `sm` | 640 | Padding container 1.5rem; lộ nút "See Pricing"; carousel card 380px; lề section py tăng |
| `md` | 768 | Hero pill video hiện (`md:inline-flex`); hero cards chuyển ngang + accordion flex (`is-active` flex 3); feature card full-row layout |
| `lg` | 1024 | Padding 2rem; nav pill hiện (`lg:flex`); ẩn `nav-toggle`; VFL bật sticky scroll + lens/số orbit; bento 12-cột; carousel 420px |
| `xl` | 1280 | `max-w-screen-xl` cho header/announcement |
| `2xl` | 1536 | `max-w-screen-2xl` container chính |

> VFL: dưới 1024px tắt sticky (`height:auto`), xếp panel dọc hiện hết (`global.css` 127-133); ≥1024px bật scroll-driven (xem phần 4-5).

### Sơ đồ khung trang dọc (cây section theo `index.html`)
```
body.font-sans.bg-background.text-foreground
├─ 00 #announcement-bar           (bar vàng, dòng 62) — text + "Get Pro" + nút đóng
├─ 01 <header> #site-header        (fixed top-12, dòng 79) — logo · nav pill · CTA · nav-toggle
└─ <main> #top
   ├─ 02 HERO                      (109) — H1 (pill video) + sub + 2 CTA + 3 hero-card accordion
   ├─ 03 #models CLIENTS STRIP     (179) — marquee logo model (6 pill)
   ├─ 04 TOOLS OVERVIEW            (194) — H2 + segmented tabs (7) + video panel theo tab
   ├─ 05 #use-cases VFL STICKY     (222, height:520vh) — lens + số orbit + 5 panel crossfade
   ├─ 06 #features PLATFORM        (267) — bento 6 feature-card (7/5/5/7/5/12)
   ├─ 07 GUIDED HIGHLIGHTS         (347) — vertical tabs (3) + video panel
   ├─ 08 HORIZONTAL CAROUSEL       (384) — 5 carousel-card + nút prev/next
   ├─ 09 WHY CINAI                 (408) — 4 stat-card + powered-by chip + CTA
   ├─ 10 #pricing PRO vs PLUS      (458) — billing toggle + 2 plan card (Pro/Plus)
   ├─ 10b #lead-magnet FORM        (521) — form (email/industry/goal) + preview Input→Workflow→Output
   ├─ 11 #faq ACCORDION            (580) — heading+CTA trái · 9 faq-item phải
   ├─ 12 CTA READY TO BUILD        (635) — video nền + heading + 2 CTA
   └─ 13 MARQUEE STRIP             (653) — marquee text full-width (aria-hidden)
   └─ (đóng main, 672)
├─ 14 <footer>                     (675) — heading+CTA · brand+5 cột link · copyright · watermark
└─ 99 #chat-widget                 (722) — nút chat nổi (placeholder)
```

---

## 4. ANIMATION & MOTION

### Token easing / duration (`tokens.css` 79-83)
| Token | Giá trị |
|-------|---------|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--dur-fast` | `150ms` |
| `--dur-normal` | `300ms` |
| `--dur-reveal` | `650ms` |

### Bảng keyframes (`global.css`)
| Keyframe | Hiệu ứng | Dùng cho |
|----------|----------|----------|
| `landing-fade-up` | opacity 0→1, translateY 32px→0 | `[data-reveal]` mặc định (57) |
| `landing-fade-in` | opacity 0→1 | `[data-reveal="fade"]` (58) |
| `landing-scale-in` | opacity 0→1, scale .96→1 | `[data-reveal="scale"]` (59) |
| `marquee-x` | translateX 0→-100% | `.marquee__track` (reverse, 100) |
| `gradient-shift` | background-position chạy ngang 6s linear | `.gradient-gold` (94) |

### Scroll reveal
- `[data-reveal]`: bắt đầu `opacity:0; translateY(32px)`, khi thêm class `.in-view` (do IntersectionObserver) chạy `landing-fade-up` 650ms expo (`global.css` 50-51).
- Biến thể: `="fade"` (chỉ mờ), `="scale"` (scale .96). Stagger: con trong `[data-stagger]` được set `animationDelay = i*80ms` qua JS (`main.js` 17-19).

### Hover (chọn lọc)
| Phần tử | Hiệu ứng hover |
|---------|----------------|
| `.btn-primary` | đổi nền sang `accent-hover`; `:active` translateY(1px) |
| `.btn-ghost` | nền `secondary-hover`, viền `primary/.5` |
| `.hero-card` (≥768) | `is-active` flex 1→3 (mở rộng accordion) `--dur-normal` expo; reveal max-height 0→12rem |
| `.feature-card` | viền `primary/.4`, translateY(-4px), glow radial hiện |
| `.glow-card` / `.stat-card` | viền `primary/.4`, translateY(-8px), 2 lớp glow `::before/::after` hiện |
| `.feature-link` | translateX(3px) |
| `.marquee:hover .marquee__track` | `animation-play-state: paused` |
| `.logo-pill` / `.footer-social` / `.seg-tab` / `.guided-tab` | đổi màu chữ/viền |

### Tương tác mở/đóng (cơ chế thật)
| Thành phần | Cơ chế |
|------------|--------|
| **Announcement close** | JS set `annBar.style.display='none'` + `header.style.top='0'` (main.js 200-207) |
| **Mobile nav toggle** | JS `nav.classList.toggle('hidden')` trên `header nav` (main.js 191-197) |
| **Tabs (tools, guided)** | `aria-selected` + panel `hidden`; chỉ panel active phát video (main.js 47-72) |
| **Hero cards accordion** | hover/focusin → `activate(i)`: toggle `.is-active`, play video active, pause còn lại (main.js 75-93); mặc định card 0 |
| **FAQ accordion** | single-open: click toggle `aria-expanded`; mở thì grid-rows 0fr→1fr (CSS), chevron rotate 180° (main.js 95-108; global.css 141-145) |
| **Carousel** | nút prev/next `scrollBy({left: ±min(80% width,400), smooth})`; scroll-snap x mandatory (main.js 110-118) |
| **Billing toggle (Pro/Plus)** | click `.bill-opt` → set `textContent` giá theo `data-monthly`/`data-yearly`, đổi note (main.js 209-228) |

---

## 5. SCROLL REVEAL & EVENT FLOW

### Sơ đồ init JS (`main.js`, IIFE `'use strict'`)
```
(IIFE)
 ├─ prefersReduced = matchMedia('(prefers-reduced-motion: reduce)')
 ├─ 1. Scroll reveal     → IO threshold .12, rootMargin -8% → add .in-view + unobserve; stagger delay i*80ms
 ├─ 2. Header scroll     → rAF throttle: toggle .is-scrolled (y>24); hide khi cuộn xuống (y>90 & down), show khi lên
 ├─ 3. Tabs              → mỗi [role=tablist][data-tabs]: click/Arrow key → select(idx), play/pause video
 ├─ 3b. Hero cards       → mouseenter/focusin → activate(i); load+play video active
 ├─ 4. FAQ accordion     → single-open toggle aria-expanded
 ├─ 5. Carousel          → prev/next scrollBy smooth
 ├─ 6. VFL sticky        → ≥1024: scroll → lens rotate + số orbit + setActive(panel gần 0°); <1024: hiện hết
 ├─ 7. Lazy video        → IO threshold .25: vào viewport thì load+play, ra thì pause (loại video trong hero-card)
 ├─ 8. Mobile nav toggle
 ├─ 8b. Announcement close
 ├─ 8c. Billing toggle
 ├─ 8d. Lead magnet form → focusin→LeadFormStart; change→SelectIndustry/SelectGoal; submit→LeadSubmit + fetch/sendBeacon webhook
 └─ 9. Chat widget       → alert placeholder
```

### Chi tiết handler thật
- **Header** (22-44): `lastY`, `ticking`; hằng `REVEAL_AT_TOP = 90`; `is-scrolled` khi `y>24`; thêm `header-hidden` (translateY -150%) khi `y>90 && goingDown`. Scroll listener `{passive:true}` qua `requestAnimationFrame`.
- **Tabs** (47-72): tìm panel theo `[role=tabpanel][data-tabs="${key}"]`; `select(idx)` đặt `aria-selected`, `panel.hidden`, lazy `v.load()` 1 lần (`dataset.loaded`), `tryPlay`/`pause`. Phím `ArrowRight/Left` chuyển tab vòng.
- **Hero cards** (75-93): `activate(idx)` toggle `.is-active` + play/pause video; gắn `mouseenter` + `focusin`; gọi `activate(0)` lúc init.
- **VFL** (120-172): `N=5` panel; `STEP = 360/N = 72°`; `RADIUS = 375` (vòng số ngoài vành lens ~320px); `norm(a)` chuẩn hoá góc về [-180,180]. `onScroll`: tính `progress = scrolled/total` (0..1) từ `getBoundingClientRect().top` và `offsetHeight - innerHeight`; xoay lens `rotate(progress*(N-1)*72°)` (âm); với mỗi số tính toạ độ `(RADIUS·cos, RADIUS·sin)`, opacity `0.2 + 0.8·max(0,cos)` (sáng bên phải), zIndex theo cos; chọn số gần 0° → `setActive(best)` (panel `.is-active` + video play). `mq min-width:1024px`: chỉ bật scroll khi match; đổi breakpoint → `location.reload()`.
- **Lazy video** (174-188): lọc bỏ video trong `[data-hero-card]`; IO `.25` load+play khi vào (nếu không nằm trong `[hidden]`), pause khi ra.
- **Lead form** (230-259): xem phần 7 & 8.

---

## 6. COMPONENT HIERARCHY

```
LandingPage
├─ AnnouncementBar [đóng được] — mặc định HIỆN
│   └─ "Get Pro" CTA + close button
├─ Header [fixed, hide-on-scroll]
│   ├─ Logo (CinAI.tv)
│   ├─ NavPill (lg+): Features · Models · Use cases · Pricing · FAQ
│   ├─ CTA: Get Free Workflow (ghost) · See Pricing (primary, sm+)
│   └─ NavToggle (lg-)  — đóng menu mặc định
├─ Hero
│   ├─ H1 + 2 PillVideo (md+, autoplay loop muted)
│   ├─ 2 CTA (Unlock Pro / Get Free Workflow)
│   └─ HeroCards ×3 [accordion] — card[0] is-active mặc định
├─ ClientsStrip — MarqueeLogos ×6
├─ ToolsOverview
│   ├─ SegmentedTabs ×7 — tab[0] "Ad Image" selected
│   └─ VideoPanel ×7 — panel[0] hiện, còn lại hidden
├─ VFL [sticky scroll, lg+] — panel[0] is-active mặc định
│   ├─ LensDecor + NumberRing ×5
│   └─ Panel ×5 (E-commerce / Beauty / Fashion / F&B / Agency)
├─ PlatformFeatures — BentoCard ×6 (1 lớn 7×2, 5,5,7,5, 1 full-12)
├─ GuidedHighlights — VerticalTabs ×3 (Ad Image sel.) + VideoPanel ×3
├─ Carousel — Card ×5 + Prev/Next
├─ WhyCinAI — StatCard ×4 + PoweredByChip + CTA
├─ Pricing
│   ├─ BillingToggle [Monthly is-active / Yearly] — monthly mặc định
│   └─ PlanCard ×2 (Pro / Plus[Most popular, ring])
├─ LeadMagnet
│   ├─ LeadForm (email + industry select + goal select + submit) — fields hiện, success hidden
│   └─ WorkflowPreview (Input→Workflow→Output + 3 thumb)
├─ FAQ — FaqItem ×9 [accordion single-open] — tất cả aria-expanded=false mặc định
├─ CTAReadyToBuild — VideoBg + heading + 2 CTA
├─ MarqueeStrip [aria-hidden]
├─ Footer — heading+CTA · brand+social ×4 · 5 cột link · copyright · Watermark
└─ ChatWidget [fixed, placeholder]
```

---

## 7. DATA LOGIC

### Hằng / cấu hình JS
- **VFL**: `N = panels.length (=5)`, `STEP = 72°`, `RADIUS = 375` (main.js 126-128).
- **Header**: `REVEAL_AT_TOP = 90`, `is-scrolled` ngưỡng `y>24` (main.js 27, 30).
- **Reveal**: IO threshold `0.12`, rootMargin `-8%`; stagger `i*80ms` (main.js 14, 18).
- **Lazy video**: IO threshold `0.25` (main.js 186).
- **Carousel step**: `min(clientWidth*0.8, 400)` (main.js 113).
- **STANDARD events map** (tracking.js 48): `PageView, ViewContent, Lead, LeadSubmit→Lead, InitiateCheckout, Purchase` (event tên khác → `trackCustom`).
- **passthroughKeys** (tracking.js 100): `utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid`.

> Không có mảng JS dữ liệu nội dung (content là HTML tĩnh hard-code, KHÔNG render từ data). Pricing dùng `data-monthly`/`data-yearly` trên DOM (xem dưới).

### Bảng nội dung chính (HTML tĩnh)
| Khối | Giá trị |
|------|---------|
| Announcement | "New: Nano Banana Pro & GPT Image 2 unlocked on CinAI Pro — from $3/day" |
| Marquee models | GPT Image 2 · Nano Banana 2 · Nano Banana Pro · Opus 4.8 · Omni · Seedance |
| Tools tabs (7) | Ad Image · Product Shot · UGC Image · Storyboard · AI Video · Banner · Workflow |
| VFL use-cases (5) | E-commerce & Shop Owners · Beauty & Cosmetics · Fashion & Apparel · F&B & Restaurants · Agencies & Marketers |
| Guided tabs (3) | Ad Image · AI Video · Storyboard |
| Stat cards (4) | One workspace · 6+ models · Unlimited* · From $3/day |
| FAQ (9) | Pro unlimited? · Plus vs Pro? · $3/day? · Yearly cheaper? · Not good at prompts? · Commercial use? · Which models? · Plan credits? · How to get free workflow? |

### Pricing (data-attr trên DOM)
| Plan | `data-monthly` | `data-yearly` | Note monthly | Note yearly |
|------|----------------|----------------|--------------|-------------|
| Pro | `$25` | `$21` | "Billed monthly · or $3/day pass" | "Billed yearly · save ~16%" |
| Plus (`data-plan="plus"`) | `$59` | `$49` | "Billed monthly · everything in Pro included" | "Billed yearly · save ~16%" |

Toggle: `[data-billing-toggle]` với `.bill-opt[data-billing=monthly|yearly]`; suffix luôn `/mo` (main.js 222).

### Hằng điều hướng / CTA (placeholder thay khi deploy)
- Anchor nav: `#features #models #use-cases #pricing #faq #lead-magnet #top`.
- Placeholder URL: `{{PRICING_URL}}` (CTA Pro/Plus/pricing), `{{MAIN_DOMAIN}}` (footer "Create"/Support), `{{N8N_WEBHOOK}}` (form action). Được thay runtime bởi `tracking.js` `decorateAll()` từ `CINAI_CONFIG`.
- `data-cta` types: `pro`, `plus`, `pricing`, `workflow`; `data-cta-type`: `hot` / `cold`.

### Lead-magnet form (`index.html` 528-558)
| Field | name | required | Options |
|-------|------|----------|---------|
| Email | `email` (type email) | ✓ | autocomplete email |
| Industry | `industry` (select) | ✓ | ecommerce, beauty, fashion, fnb, agency, marketer, creator, other |
| Goal | `goal` (select) | ✓ | ad-images, product-images, ugc, storyboard, ai-video, test-creatives, social |

- Form attr: `data-lead-form`, `data-webhook="{{N8N_WEBHOOK}}"`, `novalidate`.
- Submit payload (main.js 242-247): `{ email, industry, goal, source:'landing', landing_page_url, timestamp }`.
- Gửi: nếu `data-webhook` đã thay (không còn `{{`) → `fetch POST JSON`; nếu placeholder → `setTimeout 600ms` rồi hiện success.
- UI: ẩn `[data-lead-fields]`, hiện `[data-lead-success]` ("✓ Done! Check your inbox…"). Nút submit disable + đổi text "Sending…".
- Events phụ: `LeadFormStart` (focusin), `SelectIndustry`, `SelectGoal` (change), `LeadSubmit` (submit).

---

## 8. TRACKING

Hai file: `tracking-config.js` (cấu hình) + `tracking.js` (logic). Nạp đầu, trước `main.js`.

### Cấu hình (`tracking-config.js` → `window.CINAI_CONFIG`)
| Khoá | Giá trị mặc định | Ý nghĩa |
|------|------------------|---------|
| `PIXEL_ID` | `{{PIXEL_ID}}` (placeholder) | Meta Pixel ID — chưa set → "log-only mode" |
| `N8N_WEBHOOK` | `{{N8N_WEBHOOK}}` | Webhook n8n nhận CAPI + lead |
| `MAIN_DOMAIN` | `https://cinai.tv` | Website chính |
| `PRICING_URL` | `https://cinai.tv/pricing` | URL trang giá |
| `ROOT_COOKIE` | `.cinai.tv` | Domain set `_fbc` first-party (cross-subdomain) |
| `CURRENCY` | `USD` | Tiền tệ cho value |
| `DEBUG` | `true` | Log event ra console |

### Cơ chế (`tracking.js`) — Meta 4 lớp
- **Browser Pixel**: chỉ init khi `PIXEL_ID` đã set (`isSet`); chèn `fbevents.js`, `fbq('init', PIXEL_ID)`.
- **Server CAPI qua n8n**: `cinaiTrack()` gửi cùng payload tới `N8N_WEBHOOK` bằng `navigator.sendBeacon` (fallback `fetch keepalive`).
- **Dedup (EMQ)**: mỗi event sinh `event_id = name.Date.now().seq.performance.now()`; Pixel truyền `{eventID: event_id}` và payload server cùng `event_id` → khử trùng Browser ↔ CAPI.
- **Attribution / EMQ data**: cookie `_fbc` (dựng từ `fbclid` nếu thiếu, format `fb.1.<ts>.<fbclid>`, lưu 90 ngày, domain `ROOT_COOKIE`), `_fbp`; gom `utm_*`, `placement`, `landing_page_url`.

### Sự kiện
| Loại | Sự kiện |
|------|---------|
| Auto | `PageView`, `ViewContent` (content_name `cinai_landing`), `Scroll25/50/75` (depth) |
| `data-track` click (chuẩn) | gắn trên CTA/nav: `ClickAnnouncement, ClickHeaderWorkflow, ClickHeaderPricing, ClickHeroCTA, ClickHeroCardCTA, SelectModule, ViewUseCase, ClickFeaturesPricing, SelectGuided, ToggleBilling, ClickProOffer, ClickPlusOffer, ClickWhyCTA, ClickFaqPricing, ClickFinalCTA, ClickFooterCTA` |
| Form | `LeadFormStart, SelectIndustry, SelectGoal, LeadSubmit` |

- **data-attr → params**: click handler gom mọi `data-*` (trừ `data-track`, `data-reveal`) thành params (ví dụ `data-cta`→`cta`, `data-module`→`module`, `data-industry`→`industry`).
- **CTA passthrough** (`decorate`/`decorateAll`): thay `{{PRICING_URL}}`/`{{MAIN_DOMAIN}}` trong href; với link tới `cinai.tv` thì nối `utm_*`, `fbclid`, `fbp`, `fbc` sang URL đích (cross-domain stitching).

---

## 9. CHECKLIST CHẤT LƯỢNG

- [x] Dark-luxury, nền `#09090b` + nhấn vàng kem `#e0c9a6`, chữ EN
- [x] 3 họ font: Inter (body) · Plus Jakarta Sans (display) · Instrument Serif (serif nhấn)
- [x] Design tokens tập trung trong `tokens.css` (màu HSL, type scale, radius, motion)
- [x] Hero có pill video bo tròn (md+) + serif italic highlight
- [x] Hero cards accordion mở rộng khi hover/focus (flex 1→3)
- [x] Bento layout feature cards (cột 7/5/5/7/5/12)
- [x] VFL sticky scroll-driven với lens xoay + số orbit (lg+), fallback xếp dọc (lg-)
- [x] Pricing Pro/Plus + billing toggle Monthly/Yearly (đổi giá qua data-attr)
- [x] Lead-magnet form (email + industry + goal) → webhook n8n, có trạng thái success
- [x] FAQ accordion single-open (grid-rows 0fr↔1fr)
- [x] Carousel scroll-snap + nút prev/next
- [x] Marquee logo + marquee text (pause on hover)
- [x] Scroll reveal IntersectionObserver (fade-up/fade/scale) + stagger
- [x] Header hide-on-scroll, throttle rAF
- [x] Lazy video play/pause theo viewport (IntersectionObserver)
- [x] Tracking Meta 4 lớp: Browser Pixel + Server CAPI (n8n) + EMQ (fbc/fbp/utm) + Dedup (event_id)
- [x] CTA passthrough cross-domain (utm/fbclid/fbp/fbc → cinai.tv)
- [x] `prefers-reduced-motion`: tắt animation/transition, giữ marquee (giống bản gốc)
- [x] Semantic HTML (header/main/section/footer, aria-label, role=tablist/tab/tabpanel)
- [x] Mọi giá trị trong tài liệu trích thẳng từ source (không bịa số liệu hiệu năng)

---

## Tham chiếu chéo
- `SYSTEM-XRAY.md` — bản X-quang trang gốc (tồn tại trong template).
- `SYSTEM-XRAY-CLONE.md` — X-quang bản clone (tồn tại).
- `extraction/` — `tokens-raw.md`, `content.md`, `animations.md`, `behavior-map.md`, `performance.md`, `xray-diff.md` (nguồn trích xuất Pha 1-3).
