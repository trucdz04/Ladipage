# SYSTEM DESIGN — Template CinAI Video Studio

> Tài liệu thiết kế hệ thống cho landing **CinAI.tv — AI Video & Workflow Studio**.
> Trích trực tiếp từ source (`index.html`, `styles/*.css`, `scripts/main.js`) — mọi giá trị
> (token màu, font, spacing, animation) là **giá trị thật trong code**, không phỏng đoán.
> Đây là landing **cầu nối**: mọi CTA/video/model đều dẫn về `https://cinai.tv`.

- **Stack:** HTML5 tĩnh + CSS thuần (custom properties) + Vanilla JS (IIFE), không build step.
- **Style direction:** Dark-luxury / AI-tech, accent **tím** (purple) + điểm nhấn **lime**.
- **Chạy local:** `cd templates/template-cinai-video-studio && npx -y serve -l 8099 .` → http://localhost:8099
- **File CSS:** `tokens.css` (design tokens) → `global.css` (reset + component dùng chung + keyframes) → `sections.css` (style theo từng section). Thứ tự nạp cố định trong `<head>`.

---

## 1. FONT CHỮ (Typography)

| Vai trò | Token | Giá trị thật |
|---------|-------|--------------|
| Tiêu đề (h1–h4, brand, nút, card) | `--font-heading` | `"Rubik", system-ui, -apple-system, "Segoe UI", Arial, sans-serif` |
| Body / đoạn văn | `--font-body` | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` |

- **Rubik** nạp qua Google Fonts (`global.css` dòng 4): weights `400, 500, 600, 700` + italic `700` (dùng cho `<em>` gạch chân sóng trong H1). `display=swap`.
- Body dùng **system sans** (không tải thêm font) → tối ưu tốc độ.

### Thang cỡ chữ (type scale)
| Token | rem | px | Dùng cho |
|-------|-----|----|----------|
| `--text-xs` | 0.75 | 12 | eyebrow, badge, caption, disclaimer |
| `--text-sm` | 0.875 | 14 | body mặc định, nav-sub, chip |
| `--text-base` | 1 | 16 | nav pill, nút |
| `--text-lg` | 1.125 | 18 | subtitle, body trang |
| `--text-xl` | 1.5 | 24 | h3 panel, h3 modal |
| `--text-2xl` | 2 | 32 | h2 section mặc định |
| `--text-hero` | `clamp(1.9rem, 1.1rem + 3.4vw, 3rem)` | ~30→48 | H1 hero (co theo viewport) |
| `--text-epic` | `clamp(3rem, 1rem + 13vw, 11rem)` | khổng lồ | dòng "Create Epic" footer |

**Cỡ tiêu đề override theo section** (`global.css` 49–54): `#community-heading` 48px/bold · `#features-heading` 30px/bold · `#models-heading` 30px/semibold · `#faq-heading` 24px/bold. Mobile (≤640px): community 32px, features/models 24px.

- **Weights:** normal 400 · medium 500 · semibold 600 · bold 700.
- **line-height:** heading `1.1`; body `1.5`; `<p>` `1.6`.

---

## 2. MÀU SẮC (Color system)

Toàn bộ là CSS custom properties trong `:root` (`tokens.css`).

### Nền / surface
| Token | Giá trị | Vai trò |
|-------|---------|---------|
| `--color-bg` | `#000000` | nền trang |
| `--color-bg-2` | `#0a0a0a` | section xen kẽ / mega-menu |
| `--color-bg-3` | `#18181b` | zinc-900 |
| `--color-surface` | `rgba(255,255,255,0.05)` | card kính |
| `--color-surface-2` | `#1a1a1a` | button secondary / panel shell |
| `--color-surface-3` | `#0d0d0d` | nền input / modal |
| `--color-border` | `rgba(255,255,255,0.10)` | viền mặc định |
| `--color-border-strong` | `rgba(255,255,255,0.18)` | viền hover/nhấn |

### Accent tím (thương hiệu)
| Token | Giá trị | Vai trò |
|-------|---------|---------|
| `--color-accent` | `#a855f7` (purple-500) | CTA chính |
| `--color-accent-hover` | `#9333ea` (purple-600) | hover CTA |
| `--color-accent-text` | `#c084fc` (purple-400) | link/nhấn |
| `--color-accent-soft` | `#d8b4fe` (purple-300) | icon outline |
| `--color-accent-900` | `#581c87` | nền card tím đậm |
| `--color-accent-ring` | `rgba(168,85,247,0.40)` | viền focus/glow |
| `--color-accent-glow` | `rgba(168,85,247,0.25)` | đổ sáng |
| `--gradient-icon` | `linear-gradient(to left top, rgba(211,231,99,.7), #a855f7)` | nền icon mega-menu (tím→lime) |

### Lime + phụ trợ
- Lime: `--color-lime #a3e635`, `--color-lime-text #3f6212`, `--color-lime-border #d9f99d` (nút "Trial Omni unlimited").
- Sao đánh giá: `--color-star #d3e763`.
- Phụ: green `#22c55e`, cyan `#22d3ee` (nút Upscale), amber `#fbbf24` (credits), rose `#fb7185` (badge chất lượng), emerald `#34d399` (badge trạng thái).

### Text
`--color-text #fff` · `--color-text-2 #d1d5db` (subtitle) · `--color-text-3 #9ca3af` (caption) · `--color-text-4 #71717a` (mờ).

---

## 3. BỐ CỤC (Layout)

### Container & spacing
- `--container 1280px` (mặc định) · `--container-wide 1500px` (section Models).
- `.container` / `.container-wide`: `margin-inline:auto; padding-inline:var(--space-4)`.
- `.section { padding-block: var(--space-section) }` với `--space-section: clamp(4rem, 3rem + 5vw, 7rem)`.
- Thang spacing 4px: `--space-1`(4) … `--space-24`(96). Radius: sm6 · md8 · lg12 · xl16 · 2xl24 · pill9999.

### Breakpoints thực dùng
| px | Tác động |
|----|----------|
| 520 | model-list chuyển cột dọc |
| 600 | H1 giới hạn 14ch |
| 640 (sm) | feature-grid 2 cột · model-grid 2 cột · footer 4 cột · giảm heading |
| 768 (md) | hero-pills wrap + căn giữa · community-clip max-h 600 |
| 900 | hiện `nav-main`, ẩn hamburger / ẩn mega-menu khi <900 |
| 1024 (lg) | panel-body 2 cột · feature-grid 3 cột · model-grid 4 cột · community 4 cột · community-clip max-h 700 |

### Khung trang (thứ tự dọc — khớp `index.html`)
```
body
├─ 00 .announce            ── thanh thông báo nền sáng + 2 blob gradient hồng/tím (clip-path)
├─ 01 header.header        ── KHÔNG sticky (position:relative); cuộn đi sẽ mất
├─ main
│   ├─ .grid-zone          ── nền lưới ô vuông 32px + glow tím radial (CHỈ bao hero+panel)
│   │   ├─ 02 .breadcrumb-wrap
│   │   └─ 03 section.hero.container
│   │       ├─ .laurel (vòng nguyệt quế + 5 sao + "#1 AI Cinematic")
│   │       ├─ h1#hero-heading
│   │       ├─ p.hero-sub
│   │       ├─ .hero-pills (4 feat-pill, scroll ngang ở mobile)
│   │       └─ .panel#generator  ◄── COMPONENT ĐỘNG (xem §6, §7)
│   ├─ 04 section.community-section  ── masonry full-width, cắt cao + fade đáy
│   ├─ 05 section.features           ── grid 1/2/3 cột, 5 feature-card
│   ├─ 07 section.container-wide     ── Explore AI Models, grid 1/2/4, 8 model-tile
│   └─ 08 section.container          ── FAQ (<details>)
├─ 09 section.epic + footer.footer  ── "Create Epic / CinAI.tv" + 4 cột link
├─ .modal-backdrop#login-modal       ── modal đăng nhập (ẩn mặc định)
└─ .float-cta#float-cta              ── nút lime nổi góc phải (hiện khi cuộn)
```

`.grid-zone` (`global.css` 22–30): chồng 3 lớp background — radial glow tím + 2 linear tạo lưới ô 32px — **chỉ** bao hero + panel; phần dưới đen tuyền.

---

## 4. ANIMATION & MOTION

### Token motion
- Easing: `--ease-standard cubic-bezier(.4,0,.2,1)` · `--ease-out-expo cubic-bezier(.16,1,.3,1)`.
- Duration: `--dur-fast .15s` · `--dur-normal .3s` · `--dur-slow .6s`.
- **Chỉ animate `transform`/`opacity`/`filter`** (compositor-friendly) — không animate layout.
- `@media (prefers-reduced-motion: reduce)`: tắt mọi animation/transition, `.reveal` hiện ngay.

### Keyframes (`global.css` 114–118)
| Tên | Hiệu ứng | Dùng ở |
|-----|----------|--------|
| `shine-infinite` | vệt sáng quét ngang 2s lặp | badge `NEW` (`.shimmer::after`) |
| `fade-up` | opacity 0→1 + translateY 24→0 | modal mở |
| `spotlight`, `float`, `pulse` | (định nghĩa sẵn, dự phòng) | — |

### Scroll reveal
`.reveal { opacity:0; translateY(24px) }` → thêm `.is-visible` (transition `--dur-slow` ease-out-expo). Kích bởi IntersectionObserver (`threshold:0.12`), unobserve sau khi hiện (xem §5).

### Hover card (các tương tác hover chính)
| Phần tử | Hiệu ứng hover |
|---------|----------------|
| `.btn` | `translateY(-1px)` (active về 0) |
| `.btn-primary` | đổi nền tím-600 + thêm ring glow |
| `.feature-card` | `translateY(-4px)` + viền tím `--color-accent-ring` |
| `.model-tile` | `translateY(-4px)` + viền sáng hơn |
| `.community-grid .v-card` | `scale(1.02)` |
| `.pv-btn` | nền sáng hơn + viền strong + `translateY(-1px)` |
| `.mega-intro` (hover cha) | mũi tên `.mi-arrow` nền tím + `translateX(3px)` |
| `.model-card` (chưa chọn) | viền strong + nền sáng hơn |

### Mega-menu open/close (CSS thuần — `sections.css` 47–54)
`.mega` mặc định `opacity:0; visibility:hidden; pointer-events:none; transform:translate(-50%,-6px)`.
Khi `.has-menu:hover` **hoặc** `:focus-within` → `opacity:1; visibility:visible; transform:translate(-50%,0)` (transition `--dur-fast`). `.mega::before` là dải đệm vô hình 12px để hover không rớt khi di chuột xuống panel.

### Modal open/close
- Mở: `.modal-backdrop.is-open { display:flex }` (JS thêm class) → `.modal` chạy `animation: fade-up .3s ease-out-expo`. Backdrop có `backdrop-filter: blur(6px)`.
- Đóng: gỡ class `is-open` → ẩn (`display:none`).

### Tab switch
`.tab[aria-selected="true"]` → nền `linear-gradient(rgba(147,51,234,.85), rgb(147,51,234))` + glow tím. JS đổi `aria-selected` (xem §6) và ẩn/hiện dropzone upload.

### FAQ accordion
`<details>` native. `.faq-item[open] .faq-q .chev { transform: rotate(180deg) }` (transition fast). Không cần JS.

### Float CTA
`.float-cta` cố định `top:8px; right:8px; z-index:60`, mặc định `opacity:0; translateY(-12px); pointer-events:none`. Khi `.is-visible` → hiện (transition `--dur-normal` ease-out-expo). Toggle bằng JS theo scroll (xem §6).

---

## 5. SCROLL REVEAL & EVENT FLOW

`main.js` là một IIFE `"use strict"`, mọi wiring chạy trong `DOMContentLoaded`:

```
DOMContentLoaded
 ├─ renderCommunity()        → build masonry video tiles vào #community-grid
 ├─ renderModels()           → build 8 model-tile vào #model-grid (+ observeReveal nội bộ)
 ├─ renderFaq()              → build 6 <details> vào #faq-wrap
 ├─ wireSingleSelect('[role="radiogroup"]', 'aria-checked')   → chọn model
 ├─ wireSingleSelect('[role="group"]', 'aria-pressed')        → chip duration/resolution
 ├─ wireTabs()               → đổi tab Image/Text/Extend + ẩn dropzone ở Text
 ├─ wireModal()              → mở/đóng login-modal
 ├─ wireDropdowns()          → toggle aria-expanded mega-menu (a11y)
 ├─ wireFloatCta()           → hiện nút lime khi scrollY > chiều cao header
 ├─ observeReveal(.reveal)   → IntersectionObserver fade-up
 └─ resize (debounce 200ms)  → đổi số cột masonry → renderCommunity() lại
```

### Chi tiết handler
- **wireSingleSelect(selector, attr):** trong mỗi group, click 1 item → set tất cả `attr=false` rồi item đó `=true`. Dùng chung cho model-card (`aria-checked`) và chip (`aria-pressed`). Thuần class CSS phản ánh trạng thái.
- **wireTabs:** click tab → reset `aria-selected=false` cho mọi tab, tab đó `=true`; nếu nội dung match `/Text to Video/` → ẩn `[data-tab-panel="image"]` (`display:none`), ngược lại `flex`.
- **wireModal:** `open(e)` lưu `lastFocus`, thêm `.is-open`, focus phần tử đầu (input/button). `close()` gỡ class + trả focus. Đóng khi: click nút `[data-close-modal]`, click ra backdrop, nhấn `Escape`. Phơi `window.__openLoginModal` để tracking gọi. Mọi `[data-open-modal]` (nút Save/Extend/Upscale/See More/Change image/Use sample/notif…) đều mở modal này.
- **wireDropdowns:** click nút mega → toggle `aria-expanded` (mega-menu vốn mở bằng hover CSS; đây là lớp a11y cho bàn phím/touch).
- **wireFloatCta:** `threshold = header.offsetHeight` (~72px). Scroll listener `{passive:true}` → `scrollY > threshold` thì `.float-cta` thêm `.is-visible` + `aria-hidden=false`.
- **observeReveal(nodes):** nếu không có IntersectionObserver → hiện ngay tất cả; ngược lại observe `threshold:0.12`, intersecting → `.is-visible` + `unobserve`.
- **resize:** debounce 200ms, chỉ render lại masonry khi **số cột** đổi (1/2/4 theo media query) — tránh re-render thừa.

---

## 6. COMPONENT HIERARCHY (cây component)

```
Header
 ├─ Brand (logo SVG đảo trắng + "CinAI.tv")
 ├─ Nav (3× HasMenu → MegaMenu[ MegaIntro + 4× MegaItem ])
 └─ HeaderActions (btn-lime "Trial Omni unlimited" + Hamburger)

GeneratorPanel  #generator  ◄── component động trung tâm
 ├─ PanelBanner (badge NEW shimmer + "Try the new Gemini Omni…")
 ├─ PanelForm (cột trái)
 │   ├─ PanelHead (h2 + link "Login to generate videos" → cinai.tv/login)
 │   ├─ ModelList [radiogroup] → 2× ModelCard (Gemini Omni ✓ / Veo 3.1)
 │   ├─ SeeMore  (data-open-modal, "+8 more")
 │   ├─ Tabs [tablist] → Image to Video* / Text to Video / Extend Video
 │   ├─ UploadPanel [data-tab-panel="image"] → Dropzone(out-helmet.png) + ChangeImg
 │   ├─ Prompt (label + textarea điền sẵn)
 │   ├─ ChipRow Duration [group] → 5s* / 10s(+20) / 15s(+40)
 │   ├─ ChipRow Resolution [group] → 720p* / 1080p(+10)
 │   ├─ MoreOptions (data-open-modal)
 │   ├─ CTA "Sign up to Try!" → cinai.tv/pricing (data-cta="generate")
 │   └─ NotifToggle
 └─ Preview (cột phải)
     ├─ Player (video cinai-tvc.mp4 autoplay/loop/muted + timestamp)
     └─ PreviewActions → Save / Extend / Upscale(cyan) / Continue / Generate-image (đều data-open-modal)

CommunitySection → CommunityClip → CommunityGrid(N cột) → V-Card(video) + CommunityFade(View all)
Features → 5× FeatureCard (ico + h3 + p)
Models → ModelGrid → 8× ModelTile (Thumb[logo+maker] + Body[h3+p+ReadMore])
FAQ → 6× <details>.faq-item (summary.faq-q + .faq-a)
Footer → EpicCTA + 4 cột (Brand / Product / Models / Company) + FooterBottom
LoginModal #login-modal (eyebrow + h3 + form lead + Google + disclaimer)
FloatCTA #float-cta
```

`*` = trạng thái mặc định được chọn.

---

## 7. DATA LOGIC (content model)

Toàn bộ dữ liệu là **mảng hằng trong `main.js`**, render bằng `innerHTML` template string. Không backend, không API runtime.

### COMMUNITY (12 video) — `main.js` 15–28
Mỗi item `{ v, ar }`: đường dẫn video local + aspect-ratio (tạo masonry cao-thấp).
Video: `cinai-tvc / banhang / beauty / bds / ecommerce / fnb / giaoduc / thuonghieu` + `vid-1..4`.
Render `renderCommunity()`: tính số cột (`matchMedia` 1024→4, 640→2, else 1), phân phối **round-robin** `idx % cols` vào từng `.community-col` → lề trên mọi cột bằng nhau. Mỗi tile là `<a href="https://cinai.tv" target="_blank">` chứa `<video autoplay loop muted playsinline>`.

### MODELS (8 model CinAI kết nối) — `main.js` 32–41
Mỗi item `{ logo, maker, grad, name, desc }`. Thumbnail = **logo hãng chính thức** (CinAI hợp tác chính thức) trên nền **gradient thương hiệu** + nhãn maker uppercase.

| name | maker | logo |
|------|-------|------|
| Seedance 2.0 | ByteDance | bytedance.svg |
| Kling V3 Pro | Kuaishou | kuaishou.svg |
| Veo 3.1 | Google DeepMind | google.svg |
| Hailuo (MiniMax) | MiniMax | minimax.svg |
| Nano Banana | Google Gemini | googlegemini.svg |
| GPT Image 2 | OpenAI | openai.svg |
| Gemini Omni | Google Gemini | googlegemini.svg |
| Opus 4.8 | Anthropic | anthropic.svg |

`renderModels()` build `.model-tile.reveal`, "Read more" → `https://cinai.tv` (`data-cta="model"`), rồi gọi `observeReveal()` cho các tile mới.

### FAQ (6 câu) — `main.js` 43–50
Mỗi item `{ q, a }`, render thành `<details class="faq-item">`. Nội dung xoay quanh CinAI: model hỗ trợ, thời gian render, automation pipeline, license thương mại…

### Hằng điều hướng
`CINAI = "https://cinai.tv"` · `CINAI_APP = "https://cinai.tv/login"`. Mọi CTA/link trong HTML cũng trỏ thẳng `cinai.tv` (pricing/login/privacy/terms/blog) — đúng vai trò landing cầu nối.

---

## 8. TRACKING (Meta 4 lớp — sẵn sàng, đang TẮT)

- `scripts/tracking-config.js`: `MAIN_DOMAIN="https://cinai.tv"`, `ROOT_COOKIE=".cinai.tv"`, `PIXEL_ID`/`N8N_WEBHOOK` là placeholder, `ENABLED:false`.
- `scripts/tracking.js`: lớp Pixel + CAPI + EMQ + dedup (theo skill `meta-tracking`).
- HTML đã gắn data-attr: form modal `data-track-lead="signup"`; mọi CTA có `data-cta="…"` (pricing/signin/generate/community/models/model/google/create-account/float).
- Sự kiện dự kiến: `ViewContent` (load) · `Lead` (submit form) · `Click_CTA` (nối `fbclid/utm/fbp/fbc` sang `cinai.tv`).
- Kích hoạt: điền `PIXEL_ID` + `N8N_WEBHOOK`, đặt `ENABLED:true`.

---

## 9. CHECKLIST CHẤT LƯỢNG (đã áp dụng trong template)

- [x] Design tokens tập trung, không hardcode lặp màu/spacing/typography.
- [x] Semantic HTML (`header/nav/main/section/article/footer`, `aria-*`, `role`).
- [x] Animation chỉ trên `transform`/`opacity`/`filter`; có `prefers-reduced-motion`.
- [x] `:focus-visible` outline tím; modal trả focus; mega-menu mở bằng `focus-within`.
- [x] Ảnh/video có `width/height` hoặc `aspect-ratio`; below-fold `loading="lazy"`; hero `eager`.
- [x] Font ≤ 2 họ (Rubik + system), `display=swap`, `preconnect` Google Fonts.
- [x] File CSS/JS tách nhỏ theo vai trò; `main.js` < 210 dòng.

> **Tham chiếu chéo:** `SYSTEM-XRAY.md` (X-quang trang nguồn sendfame), `SYSTEM-XRAY-CLONE.md` (X-quang bản clone), `extraction/` (bằng chứng trích xuất: tokens, animations, behavior-map, logic-generator-panel, performance).
