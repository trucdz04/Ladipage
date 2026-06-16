# SYSTEM-DESIGN — template-cinai-clips

> **Tóm tắt:** Đây là một landing page **tĩnh** (không framework, không build bundler) cho sản phẩm **CinAI.tv** — một "AI Creative Workspace" tạo ad images / product shots / AI video. Trang là bản clone phái sinh của `autoclips.app`, đổi định vị từ "AI video" sang "ad creatives". **Stack:** HTML thuần + CSS thuần (biến CSS làm design token) + **Tailwind Play CDN** (chỉ để tái dụng utility class) + 8 file JavaScript IIFE vanilla (không phụ thuộc thư viện). **Cơ chế build từ partial:** trang được ghép bằng `build.sh` — script `cat` nối `index.head.html` + lần lượt 27 file trong `sections/*.html` (sắp theo tên 00→26) + `index.foot.html` thành `index.html`. Mỗi partial trong `sections/` mới là source thật của từng section; `index.html` chỉ là bản đã ghép (mỗi section có comment `<!-- ===== NN-ten.html ===== -->`). **Style direction:** nền sáng (trắng/xám nhạt), nhấn **mint `#15E49E`**, font **Urbanist**, bo góc tròn, có vài section tối (creepy-toon tím, footer, earning đen). **Chạy local:** `bash build.sh` để ghép lại `index.html`, rồi `node server.cjs` (server tĩnh, lắng nghe cổng **4180**). **Thứ tự nạp CSS** (trong `index.head.html`): `tokens.css` → `global.css` → `sections.css` → `sections-b.css` (tokens trước, riêng-từng-section sau). JS nạp `defer` cuối `<body>` theo thứ tự: nav → video-lazy → pricing-toggle → faq-accordion → roi-calculator → automation-pipeline → goal-toggle → reveal.

---

## 1. FONT CHỮ

Chỉ dùng **một** họ chữ: **Urbanist** (Google Fonts), nạp ở `index.head.html` dòng 16 với các weight `400;500;600;700;800;900` và `display=swap`. Tailwind config (head dòng 31) cũng đặt `fontFamily.sans = ['Urbanist', ui-sans-serif, system-ui, sans-serif]`. `<body>` mang class `font-sans` (head dòng 43).

### Vai trò → token → giá trị thật (tokens.css)

| Vai trò | Token | Giá trị thật |
|---|---|---|
| Họ chữ | `--font-sans` | `'Urbanist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif` |
| H1 (hero) | `--text-hero` | `clamp(2.5rem, 1rem + 6.5vw, 6rem)` (~96px desktop) |
| H2 | `--text-h2` | `clamp(1.75rem, 1rem + 2.6vw, 3rem)` (~48px) |
| H3 | `--text-h3` | `clamp(1.25rem, 0.9rem + 1.1vw, 1.75rem)` (~24–28px) |
| Lead / mô tả | `--text-lead` | `clamp(1.05rem, 0.95rem + 0.6vw, 1.375rem)` |
| Bold | `--weight-bold` | `700` |
| Semibold | `--weight-semibold` | `600` |
| Medium | `--weight-medium` | `500` |

### Weights / line-height (global.css)
- Heading h1–h4: `font-weight: var(--weight-bold)` = 700, `line-height: 1.05`, `letter-spacing: normal`. Dùng selector đặc dị cao `html h1, html h2…` (global.css dòng 18) để **thắng preflight reset của Tailwind CDN** (Tailwind đặt `h1{font-weight:inherit}`).
- `body`: `line-height: 1.5`.

### Override cỡ chữ theo section (inline style trong partial — KHÔNG CHẮC CHẮN có ngoại lệ nào khác ngoài liệt kê)

| Section | Override |
|---|---|
| 01 hero `.hero-sub` | `clamp(1.25rem, 1rem + 1.4vw, 1.875rem)`, weight 400, `max-width: 30ch` |
| 03 stats `.stat-num` | `clamp(1.5rem, 1rem + 1.8vw, 2.25rem)`, weight 700 |
| 06 stop-wasting H2 | inline `clamp(1.75rem, 1rem + 1.4vw, 2.25rem)` |
| 07 comparison H2 | inline `clamp(1.75rem, 1rem + 1.4vw, 2.25rem)` |
| 14 testimonials H2 | inline `clamp(1.875rem, 1.4rem + 1.2vw, 2.25rem)` |
| 15 autopilot H2 | inline `var(--text-h2)`, `text-transform: uppercase` |
| 17 ROI số tiết kiệm `.roi-rev-num` | `3.75rem`, weight 700 |
| 16 goal dark `.goal-dark-big` | `4rem`, weight 900 |
| 19 pricing `.price-amount` | `2.5rem`, weight 900 |

---

## 2. MÀU SẮC

Tất cả token nằm trong `tokens.css` (`:root`). Tailwind config (head dòng 25–30) lặp lại một số màu để utility-class gọi được (`accent`, `ink`, `surfacealt`, `mutedbg`, `dark`, `pinkbg`).

### Nhóm Accent (mint — nhận diện chính)

| Token | Hex | Vai trò |
|---|---|---|
| `--color-accent` | `#15E49E` | **Mint chủ đạo** — CTA chính, link, highlight, thanh ROI |
| `--color-accent-600` | `#0FCB8A` | Hover đậm hơn, eyebrow, icon nhỏ |
| `--color-accent-soft` | `#A7F3D0` | Mint nhạt (viền good, divider testimonial) |
| `--color-accent-ink` | `#00110B` | Chữ trên nền mint |
| (dùng trực tiếp) | `rgba(21,228,158,.12)` | Nền pill-accent; `0a7a55` = chữ xanh đậm trên nền nhạt |

### Nhóm Text

| Token | Hex | Vai trò |
|---|---|---|
| `--color-text` | `#0A0A0A` | Chữ chính (gần đen) |
| `--color-text-muted` | `#4B5563` | Phụ đề (gray-600) |
| `--color-text-faint` | `#6B7280` | Chữ mờ (gray-500) |

### Nhóm Surface / nền

| Token | Hex | Vai trò |
|---|---|---|
| `--color-surface` | `#FFFFFF` | Nền chính |
| `--color-surface-alt` | `#F9FAFB` | Section luân phiên (gray-50) |
| `--color-muted` | `#F3F4F6` | Nền xám nhạt (gray-100) |
| `--color-border` | `#E5E7EB` | Viền (gray-200) |
| `--color-dark` | `#0F0B17` | Section tối (creepy-toon, footer) |
| `--color-black` | `#000000` | Band "earning" / card dark goal |
| `--color-pink` | `#FCF5F8` | Fruit Stories (section 11) |
| `--color-ink-900` | `#111827` | Nút secondary (btn-dark) |

### Màu phụ (hardcode trong section CSS — không phải token)
- Đỏ cảnh báo: `#EF4444`, `#DC2626`, `#F87171`, `#FEE2E2` (icon ✕, giá cũ).
- Cam (badge trending / format-orange): `#F97316`, gradient `#F97316→#EF4444`.
- Hồng (UGC / fruit): `#DB2777`, `#EC4899`, `#FDF2F8`.
- Tím (creepy-toon): `#7C3AED`, `#A78BFA`, `#8B5CF6`.
- Vàng sao đánh giá: `#FACC15`.
- Brand logo social: TikTok `#010101`, YouTube `#FF0000`, Instagram `#EC4899`, Facebook `#1877F2`.
- Chấm cửa sổ dashboard: `#FF5F57` / `#FEBC2E` / `#28C840` (sections-b dòng 89).

---

## 3. BỐ CỤC

### Container / spacing / radius (tokens.css + global.css)

| Khái niệm | Token | Giá trị |
|---|---|---|
| Container chuẩn | `--container-max` | `1200px` (`.container`, padding ngang `1.25rem`) |
| Container hẹp | `--container-narrow` | `960px` (`.container-narrow`) |
| Padding dọc section | `--space-section` | `clamp(3.5rem, 2.5rem + 4vw, 6rem)` (`.section`) |
| Radius nút | `--radius-btn` | `0.5rem` (8px) |
| Radius card | `--radius-card` | `1rem` (16px) |
| Radius pill | `--radius-pill` | `9999px` |
| Radius video | `--radius-video` | `0.75rem` (12px) |
| Shadow nhỏ/vừa/lớn | `--shadow-sm/md/lg` | `0 1px 2px…` / `0 8px 24px…` / `0 20px 50px…` |
| Shadow mint | `--shadow-accent` | `0 10px 30px rgba(21,228,158,.35)` |

### Breakpoint (rút từ media query trong CSS)

| Breakpoint | Nguồn | Ảnh hưởng |
|---|---|---|
| `min-width: 768px` | sections.css dòng 61 | platform-logos giãn gap 4rem |
| `max-width: 1024px` | sections-b dòng 299 | pricing/whatis/guides/format-steps → 2 cột |
| `max-width: 860px` | sections.css dòng 20 | nav → menu mobile (burger), ẩn login/cta desktop |
| `max-width: 768px` | sections-b dòng 303 | hầu hết grid → 1 cột; video-format → cuộn ngang scroll-snap |
| `max-width: 640px` | sections.css dòng 70 | stats xếp dọc |
| `prefers-reduced-motion` | global.css dòng 72 | tắt animation/transition NHƯNG giữ marquee + reveal |

### Cơ chế partial → ghép
`build.sh` (root): `cat index.head.html` → vòng lặp `for f in sections/*.html` (sắp xếp theo tên, mỗi file ghi thêm comment phân tách) → `cat index.foot.html`. Kết quả là `index.html`. **Sửa nội dung phải sửa trong `sections/`** rồi chạy lại `bash build.sh`, không sửa thẳng `index.html`.

### Sơ đồ khung trang dọc (27 section theo thứ tự ghép)

```
index.head.html  (DOCTYPE, <head>: meta+OG, font Urbanist, Tailwind CDN+config, 4 link CSS, <body class="font-sans text-ink">)
│
├─ 00  HEADER / NAV ............ <header data-nav> logo CinAI · links · Login/Unlock Pro · burger
├─ 01  HERO ................... H1 + composer input (submit→/pricing) + freenote + video frame 16:11
├─ 02  PLATFORM BAR ........... "optimized for" TikTok · YouTube · Instagram (logo SVG)
├─ 03  STATS ................. 110,000+ creatives · 40,000+ marketers · 11B+ impressions
├─ 04  NICHE MARQUEE .......... "Unique creatives each time" — 8 video tile ×2 (loop liền mạch)
├─ 05  WHAT IS (#features) .... lead + 4 feature pill + 3 card (Ad Image Studio / Product Shot Lab / AI Video)
├─ 06  STOP WASTING ........... 2 card so sánh Old Way (đỏ) vs Better Way (mint) — reveal from-left/right
├─ 07  COMPARISON ............. 4 card đối thủ (✕) vs 1 card CinAI thắng (✓)
├─ 08  DIY COST ............... 2 cột chi phí: DIY $1,690+/mo vs CinAI from $90/mo
├─ 09  AI VIDEO STUDIO ........ 3 video tile + bảng so sánh production + strip 4 điểm
├─ 10  TALKING/AD IMAGES ...... format-orange, badge "#1 USE CASE", "Stop the Scroll"
├─ 11  UGC VISUALS ............ format-pink, "People Can't Look Away"
├─ 12  PRODUCT SHOTS .......... format-dark (tím), "Studio Mode"
├─ 13  CTA BAND ............... 1 nút "Start Creating — From $3/Day"
├─ 14  TESTIMONIALS ........... 2 card mint (incredible.creatures, Mr Puppi)
├─ 15  AUTOPILOT ............. 3 step (video trượt lên reveal) — Pick brief / Generate set / Export
├─ 16  AUTOMATIONS (★) ........ Creative Engine: pipeline động trái + dashboard panel phải + goal-toggle 2 card
├─ 17  ROI (★) ............... ROI Calculator: 4 slider → panel kết quả tối + thanh so sánh
├─ 18  CTA BAND ............... 1 nút "Start Creating from $3/day"
├─ 19  PRICING (#pricing) ..... toggle Yearly/Monthly + 2 plan card (Pro / Plus-popular)
├─ 20  FAQ (#faqs) ............ accordion 20 mục (single-open)
├─ 21  EARNING CTA ............ nền đen, 6 avatar chữ, "Ship More Winning Creatives"
├─ 22  STORYBOARDS ........... format, "Storyboards with Opus 4.8", 3 video tile
├─ 23  QUOTE GRID ............. 4 blockquote ★★★★★
├─ 24  GUIDES ................ 3 guide card (blog) + "View all guides"
├─ 25  DISCORD ............... "Still Not Sure?" join Discord + Try Free
├─ 26  FOOTER ................ logo + tag + 3 cột link (Product/Features/Legal) + copyright
│
index.foot.html  (8 thẻ <script defer> + </body></html>)
```
(★ = section có logic JS động đáng chú ý)

---

## 4. ANIMATION & MOTION

### Token easing / duration (tokens.css)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--ease-out` | `cubic-bezier(0,0,0.2,1)` | reveal, hover, button |
| `--ease-in-out` | `cubic-bezier(0.4,0,0.2,1)` | card shadow, faq max-height |
| `--ease-expo` | `cubic-bezier(0.16,1,0.3,1)` | menu mobile trượt |
| `--dur-fast` | `0.15s` | — |
| `--dur` | `0.25s` | hover/transition mặc định |
| `--dur-slow` | `0.5s` | card, menu, faq |
| `--marquee-dur` | `56s` | tốc độ băng chuyền marquee |

### Bảng keyframes

| Keyframe | Nguồn | Hành vi |
|---|---|---|
| `marquee` | global.css 58 | `translateX(0)` → `translateX(-50%)`, linear infinite (vì DOM nhân đôi bộ tile để loop liền mạch) |
| `as-in` | sections-b 95 | panel dashboard hiện: `opacity 0 + translateY(8px)` → `1 + none`, 0.4s |

### Scroll reveal
- `.reveal`: `opacity:0; translateY(24px)` → khi có class `.in`: `opacity:1; transform:none` (transition 0.6s ease-out). Biến thể `.from-left`/`.from-right` trượt ngang ±64px (0.7s). `.autopilot-media-reveal` trượt lên 90px (0.9s).
- `prefers-reduced-motion`: tắt mọi animation/transition NHƯNG **giữ** `.marquee` và `.reveal` (cố ý giống bản gốc).

### Hover
- `.btn-accent:hover`: đổi nền `#0FCB8A` + `translateY(-2px)`. `.btn-dark/.btn-white:hover`: `translateY(-2px)`.
- `.card:hover`: `shadow-lg` + `translateY(-4px)` (0.5s).
- `.sw-media:hover img`: `scale(1.06)`. `.video-tile:hover .video-mute`: hiện nút mute. `.marquee-wrap:hover .marquee`: **pause** băng chuyền.
- `.nav-links > a:hover`: đổi sang mint-600.

### Tương tác động (mô tả cơ chế thật)

| Tương tác | File JS | Cơ chế |
|---|---|---|
| Toggle Ad Images / Product Shots / AI Video | `goal-toggle.js` | Click tab → `render(key)` ghi lại icon SVG, emoji, title, desc, danh sách check (li), số lớn + sub vào card; set `is-active`/`aria-selected`. Mặc định `adimages`. |
| Pricing Yearly / Monthly | `pricing-toggle.js` | Click → `setBilling(mode)` đặt `root.dataset.mode`, đổi text mọi `[data-price]` (đọc `data-yearly`/`data-monthly`), `[data-sub]`, ẩn/hiện `[data-annual-only]`. Mặc định **yearly**. |
| FAQ accordion | `faq-accordion.js` | Single-open: click đóng tất cả mục khác (set `max-height:0`), nếu mục chưa mở thì mở (`max-height = scrollHeight + 'px'`). |
| Pipeline động (★) | `automation-pipeline.js` | IntersectionObserver (threshold 0.2) → khi vào viewport chạy `setInterval(tick, 2200ms)`: tăng bước active, render trạng thái Completed/In progress/Waiting, đổi màn hình panel phải tương ứng. Rời viewport thì dừng. |
| Dashboard count-up (★) | `automation-pipeline.js` | Ở màn hình cuối (screen 5) `countUp()` nội suy 30 bước → các số (Impressions, Clicks, Sales, Revenue) đếm lên từ 0, format theo `data-div/dec/prefix/suffix`. |
| ROI calculator (★) | `roi-calculator.js` | 4 slider `input` → `update()` tính lại toàn bộ output + tô màu track theo % (xem phần 7). |
| Nav scroll + mobile menu | `nav.js` | Scroll > 12px → toggle class `nav-scrolled`; burger → toggle `.open` + khoá scroll body. |
| Lazy video | `video-lazy.js` | IntersectionObserver (rootMargin 200px) → vào tầm thì gán `src` từ `data-src` và `play()`, rời thì `pause()`. |

---

## 5. SCROLL REVEAL & EVENT FLOW

### Sơ đồ init JS (thứ tự nạp trong index.foot.html, đều IIFE, đều `defer`)
```
nav.js              → sticky header + mobile menu
video-lazy.js       → IO phát/dừng video data-lazy
pricing-toggle.js   → toggle giá, default yearly
faq-accordion.js    → accordion single-open
roi-calculator.js   → 4 slider → công thức tiết kiệm
automation-pipeline.js → pipeline + dashboard động (IO-gated)
goal-toggle.js      → 3 tab đổi nội dung 2 card
reveal.js           → IO add class .in cho .reveal
```
Mỗi IIFE tự `querySelector` gốc của mình, nếu không thấy thì `return` (an toàn khi section vắng mặt).

### Chi tiết từng handler

**nav.js** — `header = [data-nav]`. `onScroll`: `header.classList.toggle('nav-scrolled', scrollY>12)` (passive). Burger `[data-nav-toggle]` toggle `.open` trên `[data-nav-menu]`, set `aria-expanded`, khoá `body.overflow`. Click link trong menu → đóng menu.

**video-lazy.js** — chọn `video[data-lazy]`. IO rootMargin `200px 0px`, threshold 0.1. Vào tầm: nếu chưa có `src` thì gán từ `data-src`, gọi `play()` (nuốt lỗi). Rời tầm: `pause()`. Không hỗ trợ IO → play tất cả.

**pricing-toggle.js** — `root=[data-pricing]`, tabs `[data-billing]`. `setBilling(mode)`: ghi `root.dataset.mode`, đổi text `[data-price]` theo `el.dataset[mode]`, `[data-sub]` theo `dataset[mode]`, hiện/ẩn `[data-annual-only]` (chỉ yearly). Init `setBilling('yearly')`.

**faq-accordion.js** — mỗi `[data-faq-item]` có `[data-faq-q]` (nút) + `[data-faq-a]` (panel, init `max-height:0`). Click: đóng tất cả, rồi nếu mục đang đóng thì mở (`maxHeight = scrollHeight px`), set `aria-expanded`.

**reveal.js** — chọn `.reveal`. Không IO → add `.in` ngay. Có IO: rootMargin `0px 0px -10% 0px`, threshold 0.1; khi intersecting add `.in` rồi `unobserve` (chỉ chạy 1 lần).

**roi-calculator.js** — xem luồng dữ liệu bên dưới.

**automation-pipeline.js** — xem luồng dữ liệu bên dưới.

**goal-toggle.js** — `root=.auto-goals`, `tabs=.goal-tab`. Hằng `ICON` (3 SVG), `GOALS` (3 object dữ liệu), `CHECK` (SVG dấu tick). Cache 7 phần tử `[data-goal-*]`. `render(key)`: ghi icon/emoji/title/desc/checks(map li)/num/sub; set tab active + aria. Init `render('adimages')`.

### Luồng dữ liệu — Pipeline động (automation-pipeline.js)
1. Selector gốc: `.auto-pipe` (cột trái) + `.auto-dash-body` (panel phải). Lấy `steps` (6 step không tính `.is-restart`), `restart`, `complete`, `screens` (6 `.auto-screen` data-screen 0–5).
2. `STEP_MS = 2200`. IO threshold 0.2 → `start()` (`renderPipe()` + `showScreen(0)` + `setInterval(tick)`); rời viewport → `stop()` (clear timer + sub-timers).
3. `tick()`: `active` tăng 1, vòng về 0 khi vượt số step. `renderPipe()` gán class `is-completed`/`is-active`/`is-waiting` + text trạng thái (`Completed`/`In progress...`/`Waiting...`); ẩn restart & hiện card complete khi xong vòng.
4. `showScreen(i)` bật `.is-on` cho screen tương ứng, clear sub-timer cũ, rồi chạy hiệu ứng riêng:
   - screen 2 (image gen): thanh `as-progress-fill` chạy width 0→100% trong 2200ms; bộ đếm thời gian `0:00`→`0:45`.
   - screen 3 (video assembly): 4 `.as-scene` lần lượt `is-on`, `.as-count` 0→4.
   - screen 4 (publish): 4 `.as-plat` lần lượt `is-pub` + đổi "Waiting..."→"Published".
   - screen 5 (dashboard): `countUp()` nội suy 30 bước cho mọi `.auto-dash-val[data-count]`.

### Luồng dữ liệu — ROI Calculator (roi-calculator.js)
- 4 input: `creatives` (số creative/tháng), `oldCostPer` ($ mỗi creative kiểu cũ), `hoursSaved` (giờ tiết kiệm/creative), `hourlyRate` ($/giờ).
- Hằng `MONTHLY_COST = 59` (gói CinAI Plus để so sánh).
- Mỗi sự kiện `input` → `update()` tính lại và ghi ra ~12 phần tử output + tô màu track 4 slider (`paintTrack`: gradient mint theo % giá trị).
- `fmtNum` rút gọn K/M, `fmtMoney` định dạng `$1,234`.

---

## 6. COMPONENT HIERARCHY

```
body.font-sans.text-ink
├── header[data-nav].nav  ........................... (sticky-ish, nav-scrolled toggle)
│   └── .nav-inner: .nav-logo · nav[data-nav-menu].nav-links · .nav-actions(.nav-login,.nav-cta,.nav-burger)
├── section.hero ................................... composer form (submit→/pricing), video[data-lazy]
├── section.platform .............................. 3 .platform-item (reveal)
├── section.stats ................................. 3 .stat-item + 2 .stat-divider
├── section.niche ................................. .marquee-wrap > .marquee > 16 .niche-item (8 ×2)
├── section#features .............................. .whatis-features(4) + .whatis-grid(3 card, card[0]=featured)
├── section.stopwaste ............................. .sw-card-old(reveal from-left) + .sw-card-new(from-right)
├── section.comparison ............................ .cmp-left(4 .cmp-card) + .cmp-win
├── section.diy ................................... .diy-bad + .diy-good
├── section.format(×4: orange/pink/dark/normal) ... .format-videos + .format-compare/strip
├── section.cta-band(×2) .......................... 1 .btn-accent
├── section testimonials .......................... 2 .testi-card
├── section.autopilot ............................. 3 .autopilot-step (video reveal slide-up)
├── section.automations  ★
│   ├── .auto-social (export-ready row)
│   ├── .auto-engine
│   │   ├── .auto-pipe ............................. 6 .auto-pipe-step + .is-restart + .auto-pipe-complete  [DEFAULT: step0 active, rest waiting]
│   │   └── .auto-dash > .auto-dash-body > 6 .auto-screen[data-screen]  [DEFAULT: screen0 is-on]
│   └── .auto-goals
│       ├── .goal-toggle (3 .goal-tab)  ............ [DEFAULT: adimages is-active]
│       └── .goal-grid: .goal-card(data-goal-*) + .goal-dark(data-goal-num/sub)
├── section.roi[data-roi]  ★
│   ├── .roi-controls (4 label > input[type=range])
│   └── .roi-panel (.roi-metrics, .roi-revenue, .roi-compare, .roi-mini)
├── section#pricing[data-pricing][data-mode=yearly]  [DEFAULT: yearly active]
│   ├── .pricing-toggle (2 button[data-billing])
│   └── .pricing-grid: .price-card(Pro) + .price-card-popular(Plus)
├── section#faqs .................................. .faq-list > 20 .faq-item[data-faq-item]  [DEFAULT: tất cả đóng]
├── section.earning ............................... 6 .avatar + CTA
├── section storyboards / quotes / guides / discord
└── footer.footer ................................. .footer-brand + .footer-cols(3) + .footer-copy
```

---

## 7. DATA LOGIC

### Pipeline steps (16-automations.html — DOM tĩnh, JS chỉ đổi trạng thái)
| # | Tên bước | Screen panel |
|---|---|---|
| 1 | Pick a brief from your pool | 0 — Brief Pool (42 remaining) |
| 2 | Storyboard with Opus 4.8 | 1 — Concept & Copy |
| 3 | Generate ad images (GPT Image 2) | 2 — Image Generation (progress 0:00/0:45) |
| 4 | Add brand kit & product media | 3 — Video Assembly (0/4 shot) |
| 5 | Render AI video (Omni · Seedance) | 4 — Export & Publish (4 nền tảng) |
| 6 | Export ad-ready & launch | 5 — Results Dashboard |
| — | Restart cycle (`.is-restart`) | — |

### Dashboard screen 5 — count-up (data-count)
| Nhãn | data-count | Hiển thị | delta |
|---|---|---|---|
| Impressions | 247800 (div 1000, dec 1, suffix K) | 247.8K | +340% |
| Link Clicks | 1842 (prefix +) | +1,842 | +180% |
| Sales | 36 | 36 | +520% |
| Revenue | 1080 (prefix $) | $1,080 | this month |

### Goal toggle (goal-toggle.js — object GOALS)
| key | emoji | title | num | sub |
|---|---|---|---|---|
| adimages (default) | 🖼️ | Scroll-Stopping Ad Images | 10× | more ad variations tested |
| shots | 📦 | Studio Product Shots | $0 | spent on photographers & studios |
| video | 🎬 | AI Video Ads | Unlimited* | AI video on the Plus plan |

(Card dark có 3 dòng tĩnh: Creatives per month = Unlimited*, Premium AI models = 6+ in one place, Cost to start = from $3/day.)

### Pricing (19-pricing.html — data-yearly / data-monthly)
| Plan | Yearly (default) | Monthly | Sub yearly |
|---|---|---|---|
| Pro | $21/mo | $25/mo | $252 billed yearly · or $3/day pass |
| Plus (popular) | $49/mo | $59/mo | $588 billed yearly · everything in Pro |

Toggle hiển thị "Yearly -16%". Mặc định `data-mode="yearly"`, JS init `setBilling('yearly')`.

### ROI inputs / công thức (roi-calculator.js)
| Input | min / max / step / default |
|---|---|
| Creatives / month | 10 / 300 / 10 / **30** |
| Old cost per creative ($) | 15 / 150 / 5 / **40** |
| Hours saved per creative | 0.5 / 8 / 0.5 / **2** |
| Hourly rate ($) | 10 / 150 / 5 / **30** |

**Công thức:**
```
oldCashCost     = creatives * oldCostPer
totalHoursSaved = creatives * hoursSaved
timeValue       = totalHoursSaved * hourlyRate
oldTotal        = oldCashCost + timeValue
savings         = max(0, oldTotal - 59)          // 59 = MONTHLY_COST (Plus)
roiMultiple     = oldTotal / 59
costPct         = (59 / oldTotal) * 100           // thanh đỏ = chi phí gói
savePct         = (savings / oldTotal) * 100      // % tiết kiệm
cpv             = 59 / creatives                  // "cost per creative"
```
Output: `revenue` = `$savings/mo`, `roi` = "That's {roiMultiple}× your CinAI plan back. 🔥", thanh so sánh đỏ (`costPct`) vs mint (`100-costPct`). Với default → savings ≈ $2,941/mo, ROI ≈ 50.8×.

### Bảng nội dung chính / hằng điều hướng — CTA
- **CTA chính (lặp nhiều lần):** `https://cinai.tv/pricing` ("Start Creating from $3/day", "Get Pro/Plus"…).
- **CTA phụ:** `https://cinai.tv/login` ("Try CinAI Free"), `https://discord.gg/cinai`, `mailto:hello@cinai.tv`.
- **Nav anchor:** `#features` (05), `#pricing` (19), `#faqs` (20). Footer link tới các trang `cinai.tv/*` (pricing, roadmap, changelog, refer, blog, ad-images, product-shots, ai-video, privacy).
- **Stats:** 110,000+ creatives · 40,000+ marketers & sellers · 11B+ impressions.
- **Models nhắc nhiều:** GPT Image 2, Nano Banana 2 & Pro, Omni, Seedance, Opus 4.8.
- **Địa chỉ footer:** Ste 1200, 1309 Coffeen Avenue, Sheridan, WY 82801, US.

---

## 8. TRACKING

**KHÔNG CÓ.** Không tìm thấy file `tracking-config.js` / `tracking.js`, không có Meta Pixel (`fbq`), `gtag`, `dataLayer`, hay thuộc tính `data-track` nào trong template. (Từ khoá "tracking" chỉ xuất hiện trong tài liệu `SYSTEM-XRAY.md`, không trong code thực thi.) Form hero không POST đi đâu — `onsubmit` chỉ `window.location.href='https://cinai.tv/pricing'`. Nếu cần đo lường, đây là phần phải bổ sung từ đầu.

---

## 9. CHECKLIST CHẤT LƯỢNG

- [x] Design token tập trung trong `tokens.css` (màu, type scale, spacing, radius, shadow, motion) — không hardcode lặp token chính.
- [x] Nền sáng + nhấn mint `#15E49E` nhất quán; vài section tối có chủ đích (creepy-toon, earning, footer).
- [x] Semantic HTML: `<header> <nav> <section> <article> <footer> <figure>`, `aria-label`/`aria-expanded`/`role="tab"` ở nav, toggle, goal.
- [x] Animation chủ yếu dùng property thân thiện compositor (`transform`, `opacity`); marquee dùng `translateX`.
- [x] Tôn trọng `prefers-reduced-motion` (giữ marquee + reveal có chủ đích).
- [x] `:focus-visible` outline mint 3px cho khả năng truy cập bàn phím.
- [x] Lazy video qua IntersectionObserver (`data-lazy`/`data-src`) — giảm tải băng thông/LCP.
- [x] Ảnh avatar có `width`/`height`/`loading="lazy"` (tránh layout shift).
- [x] JS module hoá theo tính năng (8 file IIFE nhỏ), guard null an toàn, không phụ thuộc thư viện runtime.
- [x] Responsive đủ breakpoint (1024/860/768/640) + menu mobile + grid co về 1 cột + video cuộn ngang.
- [ ] **Tracking/analytics:** KHÔNG CÓ (xem phần 8).
- [ ] **Test tự động:** KHÔNG CÓ (không có file test trong template).
- [~] **Tailwind Play CDN**: tiện cho clone nhưng là render-blocking script ngoài + không tối ưu cho production (nên build tĩnh nếu lên thật). KHÔNG CHẮC CHẮN về mức ảnh hưởng hiệu năng thực tế (không đo).
- [~] Một số màu phụ (đỏ/cam/hồng/tím) hardcode trực tiếp trong section CSS thay vì token — chấp nhận được vì là màu cục bộ theo section.

---

> **Tham chiếu chéo:** `SYSTEM-XRAY.md` (cùng thư mục) và thư mục `extraction/` (`tokens-raw.md`, `behavior-map.md`, `content-sections.json`, `faq-content.json`, `xray-diff.md`) — nguồn trích xuất gốc từ `autoclips.app` mà template này phái sinh.
