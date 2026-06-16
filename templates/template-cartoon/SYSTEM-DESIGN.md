# SYSTEM-DESIGN — template-cartoon (CinAI.tv)

> **Tóm tắt:** Đây là một **landing page bán hàng dạng VSL** (cuộn dọc dài) cho sản phẩm **CinAI.tv — AI Creative Workspace**, bán hai gói **Plus $49/tháng** và **Pro $97/tháng**. Trang được clone cấu trúc từ `toonbee.ai` rồi rebrand sang phong cách **dark luxury** (nền đen `#09090b`, nhấn vàng kem `#e0c9a6` / `#ffd277`).
> **Stack:** HTML/CSS/JS **tĩnh**, tự chứa — jQuery + Bootstrap 5.2.3 (CDN) + Swiper + FontAwesome 4.6.3 + nhúng video Vimeo. Không có backend/DB.
> **Style direction:** Dark luxury + tông ấm vàng-kem, nhiều badge bo góc bất đối xứng, marquee chữ chạy, ảnh/video minh hoạ tràn viền.
> **Chạy local:** `cd templates/template-cartoon && npx -y serve -l 8100 .` — hoặc `node _serve.js` → http://localhost:8100
> **Thứ tự nạp CSS (rất quan trọng — quyết định ai đè ai):**
> 1. Bootstrap 5.2.3 (CDN) → 2. `styles/swiper.min.css` → 3. FontAwesome 4.6.3 (CDN) → 4. `styles/tokens.css` (biến design) → 5. `styles/style.css` (layout gốc) → 6. `styles/checkout.css` → 7. `styles/global.css` (a11y) → 8. `styles/cinai-override.css` (lớp rebrand — **nạp cuối cùng để override màu + font**).
> Nguồn dẫn chứng: `index.html` dòng 17–31.

---

## 1. FONT CHỮ

Hệ font được khai báo ở 2 nơi: biến token trong `tokens.css` (dòng 79–81) và lớp ép-buộc trong `cinai-override.css` (dòng 7–27, dùng `!important`). Font tải qua Google Fonts (`index.html` dòng 24).

### 1.1 Vai trò → token → giá trị thật

| Vai trò | Token (tokens.css) | Giá trị thật | Áp dụng ở đâu |
|---|---|---|---|
| Thân bài (body) | `--font-body` | `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | `body` (override.css dòng 7–8) |
| Tiêu đề / display | `--font-display` | `"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | `.syne, .zalando, .wendy` (override.css dòng 14–16) |
| Nhấn / chữ viết tay (highlight) | `--font-serif` | `"Instrument Serif", Georgia, "Times New Roman", serif` (in **nghiêng**) | `.gochihand, .merriweather` (override.css dòng 19–22) |

> **Font nhấn highlight (template này CÓ):** lớp `.gochihand` và `.merriweather` được remap sang **Instrument Serif italic**. Trên trang hiện tại, `.gochihand` chỉ xuất hiện **1 lần** (caption dưới video hero — `index.html` dòng 120), `.merriweather` **không còn dùng** trong HTML (KHÔNG CÓ trong index.html). Vậy font nhấn gần như chỉ còn 1 điểm chạm.

### 1.2 Cơ chế remap (rebrand từ ToonBee)

CSS gốc (`style.css` dòng 2–7) định nghĩa các họ font ToonBee: `Syne`, `Zalando Sans SemiExpanded`, `Merriweather`, `Gochi Hand`, `Noto Color Emoji`. Body gốc là `"Outfit"` (`style.css` dòng 11). Lớp `cinai-override.css` **đè toàn bộ** bằng `!important`:
- `.syne / .zalando / .wendy` → Plus Jakarta Sans.
- `.gochihand / .merriweather` → Instrument Serif italic.
- `.outfit` và `body` → Inter.

Thực tế trong `index.html`, lớp tiêu đề dùng phổ biến nhất là **`.zalando`** (65 lần) → nghĩa là hầu hết heading hiển thị bằng **Plus Jakarta Sans**. Lớp `.syne` / `.wendy` được khai báo trong CSS nhưng **không gắn trực tiếp** trên thẻ trong index.html hiện tại (KHÔNG CÓ `class="syne"` / `class="wendy"` đứng riêng — `banner-headline` dùng class `syne` ở dòng 84,86,96).

> Lưu ý mâu thuẫn nhỏ: `--font-body` token ghi Inter, nhưng `body` trong `style.css` dòng 11 vẫn là `"Outfit"`. Override.css thắng (nạp sau) → kết quả cuối là **Inter**. Nguồn `Outfit` **không được preload** trong `<head>` → nếu override hỏng sẽ fallback `Outfit` không tồn tại.

### 1.3 Weights tải về (Google Fonts — index.html dòng 24)

| Họ font | Weights | Kiểu |
|---|---|---|
| Inter | 400, 500, 600, 700 | thường |
| Plus Jakarta Sans | 500, 600, 700, 800 | thường |
| Instrument Serif | — | thường + **italic** (`ital@0;1`) |
| Noto Color Emoji | (mặc định) | màu emoji |

`display=swap` được bật (chống FOIT). FontAwesome 4.6.3 dùng cho icon (mũi tên accordion, nút next/prev Swiper).

### 1.4 Thang cỡ chữ (type scale)

Có **hai hệ** song song:

**A. Token clamp (responsive, tokens.css dòng 83–85):**
| Token | Giá trị |
|---|---|
| `--text-hero` | `clamp(2.6rem, 1rem + 7vw, 6.875rem)` |
| `--text-h2` | `clamp(1.6rem, 1rem + 2.4vw, 2.6875rem)` |
| `--text-body` | `clamp(1rem, 0.92rem + 0.4vw, 1.25rem)` |

**B. Hệ utility cỡ chữ theo breakpoint (style.css dòng 21–45) — đây mới là cái dùng thực tế trong index.html.** Mỗi breakpoint có một thang `px` rời rạc, đặt theo prefix:
- `.xs*` từ `min-width:240px` (8px → 85px)
- `.sm*` từ `min-width:768px` (8px → 130px)
- `.md*` từ `min-width:992px` (8px → 240px)
- `.lg*` từ `min-width:1200px` (8px → 240px)
- `.xl*` từ `min-width:1500px` (8px → 240px)

Ví dụ thật trên heading: `class="xl66 lg58 md48 sm45 xs30"` (section3, dòng 258) → 66px ở ≥1500px, 58px ở ≥1200px, 48px ở ≥992px, 45px ở ≥768px, 30px ở ≥240px.

### 1.5 Override cỡ/line-height theo class tiện ích

- **font-weight**: `.w100`…`.w900` (style.css dòng 60–61).
- **line-height**: `.lh0`…`.lh230` theo % (style.css dòng 62).
- **letter-spacing**: `.ls1`, `.ls2`, và các biến thể âm như `.lg66-ls75` (`-3.3px`), `.lg52-ls50` (`-2.6px`), `.lg40-ls30` (`-1.2px`) (style.css dòng 46–48).
- Heading banner gốc: `.banner-headline` = `110px / weight 400 / line-height 110% / "Wendy One"` (style.css dòng 82) — nhưng class `syne` trên thẻ + override khiến hiển thị bằng Plus Jakarta Sans.

### 1.6 Override màu/font heading theo section

Chủ yếu nằm trong `cinai-override.css`:
- Heading trong các section nền sáng cũ (`.section2/6/8/9/10/11 h1..h4`) bị ép `color:#f4f4f5` (dòng 116–123) để đọc được trên nền tối.
- Heading trong card giá (`.table-box-inn h1/h2`) ép `color:#09090b` (chữ tối trên nền vàng — dòng 126–129).

---

## 2. MÀU SẮC

Toàn bộ token màu nằm trong `tokens.css` (dùng cú pháp HSL không bọc `hsl()` cho nhóm shadcn-style, và hex cho nhóm gold). Lớp `cinai-override.css` ánh xạ màu amber ToonBee → gold CinAI.

### 2.1 Nhóm nền (dark luxury)
| Token | Giá trị (HSL) | Hex tương đương | Vai trò |
|---|---|---|---|
| `--background` | `240 10% 4%` | `#09090b` | Nền trang chính |
| `--background-elevated` | `240 6% 10%` | `#18181b` | Card / khối nổi (vd `.video-box`) |
| `--background-subtle` | `240 5% 15%` | `#26262b` | Nền phụ |
| `--card` / `--popover` | `240 6% 10%` | `#18181b` | Card / popover |

### 2.2 Nhóm chữ
| Token | Giá trị | Hex | Vai trò |
|---|---|---|---|
| `--foreground` | `240 5% 96%` | `#f4f4f5` | Chữ chính trên nền tối |
| `--foreground-muted` / `--muted-foreground` | `240 4% 58%` | ~`#909096` | Chữ mờ (footer, phụ đề) |
| `--color-ink` | — | `#f4f4f5` | Chữ trên dark bg |
| `--color-ink-soft` | — | `#d4d4d8` | Chữ phụ |

### 2.3 Nhóm nhấn — CinAI gold / cream (motif "ấm")
| Token | Giá trị | Vai trò |
|---|---|---|
| `--primary` / `--accent` | `32 47% 80%` (= `#e0c9a6`) | Màu nhấn chính (vàng kem) |
| `--primary-hover` / `--accent-hover` | `32 47% 70%` | Hover nhấn |
| `--accent-muted` | `32 47% 30%` | Nhấn trầm |
| `--gold` | `#ffd277` | Vàng sáng (highlight) |
| `--gold-2` | `#77530a` | Vàng nâu (đổ bóng) |
| `--gold-gradient` / `--gradient-gold` | `linear-gradient(180deg, #c4a87a 0%, #e0c9a6 51%, #ffd277 100%)` | Gradient nút CTA + badge |

**Palette thay thế amber ToonBee (tokens.css dòng 30–41):** `--color-accent #e0c9a6` (thay `#FFBF21`), `--color-accent-bright #ffd277` (thay `#FFD71D`), `--color-accent-orange #c4a87a` (thay `#FFAC25`), `--color-accent-soft #f0e0c0` (thay `#FFDF60`).

> **Motif "tổ ong" (honeycomb):** Đề bài nhắc motif tổ ong — trong **token CSS không có biến honeycomb riêng**. Motif này (nếu có) đến từ **ảnh nền** (`banner.webp`, `pointbg.webp`, `headlinebg.webp`…) và bảng màu vàng-ong, **không** từ biến màu. → Ghi nhận: motif tổ ong **nằm ở tầng ảnh/visual, KHÔNG CÓ trong design token**.

### 2.4 Nhóm trạng thái & viền
| Token | Giá trị | Vai trò |
|---|---|---|
| `--success` | `160 84% 39%` | Thành công (xanh) |
| `--warning` | `38 92% 50%` | Cảnh báo |
| `--destructive` | `0 84% 60%` | Lỗi / khẩn cấp (đỏ) |
| `--info` | `217 91% 60%` | Thông tin |
| `--border` | `240 5% 18%` | Viền chuẩn |
| `--border-subtle` / `--border-strong` | `240 6% 12%` / `240 4% 28%` | Viền mờ / đậm |
| `--ring` | `32 47% 80%` | Vòng focus (a11y, = màu gold) |

### 2.5 Màu inline chèn trực tiếp trong HTML (urgency)
- `#da3131` (đỏ) — câu hù "nếu đóng trang sẽ trả giá cao hơn" (`index.html` dòng 1616). Override map sang `#f87171` khi ở dạng span.
- `#258f16` (xanh) — "81% OFF" (dòng 1616) → map `#4ade80`.
- `#e0c9a6` chèn trực tiếp ở nhiều heading hero (dòng 86, 101…).

---

## 3. BỐ CỤC

### 3.1 Container / spacing / radius (tokens.css)
| Thuộc tính | Token | Giá trị |
|---|---|---|
| Bề rộng tối đa | `--container-max` | `1536px` |
| Chiều cao header | `--header-h` | `76px` (nav hiện đang **bị comment** — xem mục 6) |
| Khoảng cách section | `--space-section` | `clamp(4rem, 3rem + 5vw, 7rem)` |
| Bo góc | `--radius-sm/…/2xl` | `4 / 8 / 12 / 16 / 20px` |
| Bo góc card | `--radius-card` | `20px` (CinAI đổi từ `75px` của ToonBee — sắc hơn) |
| Bo góc viên thuốc | `--radius-pill` | `999px` |

> Lưu ý: nhiều khối trong `style.css` gốc vẫn dùng bo góc rất lớn (`border-radius:75px` ở `.step-div` dòng 174, `.section7-box-inn` dòng 288, `border-radius:79px` ở `.intro-detail-box` dòng 318). Token `--radius-card:20px` **chỉ áp khi class mới gọi token** — phần lớn layout gốc vẫn giữ bo tròn lớn kiểu cartoon.

**Container tự chế (style.css dòng 24–37):** `.mycontainer` / `.mycontainer2` co theo breakpoint: 100% (mobile) → 750px (≥768) → 970/922px (≥992). Đây là grid riêng, song song với Bootstrap `.container`.

**Shadow (tokens.css 70–76):** `--shadow-xs..xl` (đen mờ), `--shadow-cta` (`0 8px 24px rgba(0,0,0,0.40), 0 0 0 1px rgba(224,201,166,0.15)`), `--shadow-img` (drop-shadow lớn).

### 3.2 Bảng breakpoint thực dùng

| Breakpoint | Khai báo | Tác động chính |
|---|---|---|
| ≥240px | `min-width:240px` | Thang `.xs*`, container 100% |
| ≥480px | `min-width:480px` | Tinh chỉnh nhỏ |
| ≥768px | `min-width:768px` | Thang `.sm*`, container 750px (Bootstrap md) |
| ≥992px | `min-width:992px` | Thang `.md*`, container 970px |
| ≥1100px / ≥1200px | `min-width:1100/1200px` | Thang `.lg*`, tinh chỉnh layout |
| ≥1300…≥1900px | `min-width:1300/1400/1500/1600/1700/1800/1900px` | Tinh chỉnh kích thước theo màn lớn; `.xl*` từ 1500px |
| ≤991px | `max-width:991px` | Layout tablet xuống |
| ≤767px | `max-width:767px` | **Mobile fixes** (step-video full width, wrap heading, flex check-text) |
| ≤479px / ≤359px | `max-width:479/359px` | Mobile rất nhỏ |
| `hover:none, pointer:coarse` | — | Tinh chỉnh thiết bị cảm ứng |
| `max-height:500px, landscape` | — | Điện thoại nằm ngang |
| `prefers-reduced-motion: reduce` | — | Dừng marquee + giảm mọi animation (global.css 14–23 + style.css 139,149) |

→ Tổng cộng **rất nhiều media query** (xem style.css dòng 21–45, 622–1984). Đây là dấu hiệu template builder (PageDock) sinh ra hàng loạt breakpoint cố định.

### 3.3 Sơ đồ khung trang dọc (theo đúng thứ tự trong index.html)

```
BODY (nền #09090b)
│
├─ [00] .banner  (HERO)                         index.html:40
│     ├─ <nav> menu (ĐANG COMMENT, không render)      :45–76
│     ├─ logo CinAI + pre-subheadline badge           :81–82
│     ├─ H1 "Breathtaking" / "AI Ad Creatives" / "In 3 Steps"  :84–101
│     ├─ video hero (iframe Vimeo 1168019205, autoplay muted)  :114
│     ├─ caption .gochihand (font nhấn duy nhất)      :120
│     └─ 9 ô .banner-point-box (lazy-bg pointbg.webp) :132–195
│
├─ [01] .section2  (marquee "made with CinAI")  :232
│     └─ 2 dải marquee chạy ngược chiều (video testimonials)
│
├─ [02] .section3  (3 BƯỚC / 3 Clicks)          :253
│     ├─ H1 "Builds The Entire Video … Just 3 Clicks!"
│     ├─ step-div-1  Click 1 — Describe IT        :266
│     ├─ step-div-2  Click 2 — Generate IT (nút float)  :285
│     └─ step-div-3  Click 3 — Download IT (video .my-video lazy)  :316
│
├─ [03] .section4  (SAMPLES — 6 video Vimeo)    :346
│     └─ 6 .section4-box (iframe Vimeo, có .video-playbar overlay tĩnh)
│
├─ [04] .section5  (FACT — ĐANG ẨN: class "d-none") :416
│     └─ Khối "Fact" bị tắt hiển thị (Bootstrap d-none)
│
├─ [05] .section6  (But Why AI videos?)         :465
│
├─ [06] .section7  (Hard To Create — 3 option)  :508
│     └─ option-1/2/3 (ảnh + mô tả, nền card đổi màu)
│
├─ [07] .section8  (INTRODUCING + showcase)     :605
│     ├─ tiêu đề "Introducing" + logo intro       :609–640
│     ├─ section8-2 / section8-1 (lazy-bg)        :641–644
│     ├─ video intro (introvideo3, .my-video lazy) :633
│     └─ .swiper.swiper1  CAROUSEL 5 slide video  :654–711
│           + nút .swiper1-button-next / -prev     :709–710
│
├─ [08] .vsbg-section  (Competitors VS CinAI)   :716
│     ├─ .without-box (Competitors)               :733
│     └─ .with-box  (CinAI, video withvid)
│
├─ [09] .section9  (FEATURES — id="features")   :840
│     └─ 7 hàng .section9-box (ảnh tính năng + mô tả)  :847–1027
│
├─ [10] .section10 (FEATURE chi tiết — 4 hàng video Vimeo)  :1029
│
├─ [11] .section11 ("No other tool can do this!" + video)  :1214
│
├─ [12] .section12 (PRICING — id="pricing")     :1273
│     ├─ Card PLUS  $49/mo  (id="buynow")         :1286–1313
│     └─ Card PRO   $97/mo  (.glow, MOST POPULAR) :1316–1345
│
├─ [13] .section13 ("No one believed … Synthetic" + testimonials)  :1352
│
├─ [14] .section14 (BONUS + money-back box)      :1371
│     ├─ section14-box  (bonus)                   :1381
│     └─ section14-box2 (đảm bảo hoàn tiền)       :1450
│
├─ [15] .faq-section (FAQ — id="faq")            :1513
│     └─ 7 .accordion_div (accordion_head + accordion_body display:none)  :1525–1597
│
├─ [16] .section15 (CTA CUỐI / urgency)          :1609
│     ├─ câu hù "81% OFF" + review + nút "Get CinAI Right Now"
│     └─ 4 gạch đầu dòng lợi ích + câu chốt
│
└─ [17] <footer.site-footer>                     :1672
      ├─ logo + DISCLAIMER + 6 link pháp lý + copyright 2026
```

> **Số lượng section:** README/X-RAY ghi "20 section". DOM thực tế có **17 khối nội dung + 1 footer** (banner→section15). Trong đó `.section5` **bị ẩn** (`d-none`). Chênh lệch con số "20" so với DOM thực là do cách đếm khác nhau (gộp banner-points / split section8) — **con số chính xác theo wrapper là 18** (xem grep `class="section..."` ở trên).

---

## 4. ANIMATION & MOTION

### 4.1 Token easing / duration (tokens.css 92–97)
| Token | Giá trị | Dùng cho |
|---|---|---|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveal mạnh |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Reveal mượt |
| `--duration-fast` | `150ms` | Hover nhanh |
| `--duration-normal` | `300ms` | Chuyển trạng thái |
| `--dur-reveal` | `650ms` | Hiệu ứng xuất hiện |

> Lưu ý: các token easing/duration **được khai báo nhưng phần lớn layout gốc dùng giá trị cứng** (`transition:.3s linear`, `transition:0.5s`…). Token là chuẩn của lớp CinAI, chưa được áp đồng bộ vào CSS gốc.

### 4.2 Bảng keyframes (giá trị thật)

| Keyframe | File:dòng | Cơ chế |
|---|---|---|
| `scroll` | style.css:142 | Marquee chạy trái: `translateX(0)` → `translateX(calc(-100% - var(--gap)))`, `--duration:80s` linear infinite |
| `scroll-opp` | style.css:152 | Marquee chạy phải (ngược): từ `-100%` về `0` |
| `float` | style.css:198 | Nút "Generate" nổi lên xuống: `translatey(0 → -15px → 0)`, `3s ease-in-out infinite` |
| `shimmer` | style.css:1251 | Ánh sáng lướt qua CTA cuối: `left:-100% → 100%`, `3s infinite` |
| `pulse-glow-text` | style.css:1290 | Phóng/sáng chữ `brightness+scale` — **đang TẮT** (bị comment ở dòng 1287) |
| `cinai-pulse-glow` | cinai-override.css:84 | Glow vàng cho card Pro `.glow`: box-shadow nở ra, `1.4s infinite alternate` |

### 4.3 Hiệu ứng float / glow / marquee áp dụng
- **Marquee** (`scroll` / `scroll-opp`): section2, hai dải video testimonials trượt ngược chiều, 80s/vòng. Dừng khi `prefers-reduced-motion`.
- **Float**: `.generatebtn-div` (nút Generate ở step 2, section3 dòng 308).
- **Glow vàng**: card **Pro** trong pricing (`class="...glow"` dòng 1317) — pulse box-shadow vàng kem (override.css 80–87).
- **Shimmer**: dải sáng lướt ngang câu CTA `.section15-cta-text` (dòng 1664).

### 4.4 Hover
- Nút CTA (`.mybutton1/2 a`, `.btn-link a`, `.getlink`): `transform: scale(1.05)` + đảo gradient khi hover (style.css 112,119,447; override 41–46).
- Link nav (gốc): gạch chân chạy `width:0% → 80%` (style.css 76–77) — **không render** vì nav đang comment.
- Link footer: đổi sang `#e0c9a6` khi hover (override 161–163).

### 4.5 Tương tác động (cơ chế thật — xem mục 5)
- **FAQ accordion** (jQuery slideToggle).
- **Swiper carousel** (showcase section8).
- **Lazy-load** ảnh/video/background (IntersectionObserver).
- **Fake video playbar** (thanh tiến trình giả "đang phát") — section4.
- **Countdown 03:00** — **logic CÓ nhưng không có target** (`#timer` KHÔNG CÓ trong HTML → dormant).
- **Video play/pause + mute** — **logic CÓ nhưng không có target** (`.intro-detail-img` KHÔNG CÓ trong HTML → dormant).
- **Audio voices preview** (`toggleAudio`) — **logic CÓ nhưng không có target** (`#audioPlayer`/`#audioControl` KHÔNG CÓ → dormant).

---

## 5. SCROLL REVEAL & EVENT FLOW

Toàn bộ hành vi nằm trong `scripts/main.js` (182 dòng, IIFE `'use strict'`). Nạp `defer` ở cuối body (index.html:1709). jQuery nạp trong `<head>` (dòng 37).

### 5.1 Sơ đồ init
```
DOMContentLoaded (hoặc gọi ngay nếu DOM đã sẵn)
   └─ boot()  [main.js:173]
        ├─ initLazyLoad()      → IntersectionObserver cho video.lazy/img.lazy/.lazy-bg
        ├─ initSwiper()        → khởi tạo .swiper1 (nếu có Swiper + .swiper1)
        ├─ initPlaybars()      → fake progress cho .video-playbar[data-duration]
        ├─ initVideoControls() → play/pause/mute cho .intro-detail-img  (DORMANT)
        └─ initCountdown()     → đếm ngược cho #timer khi cuộn tới #pricing/#buynow (DORMANT)

jQuery(ready) [main.js:11]  →  gắn click cho .accordion_head
window.toggleAudio          →  hàm global cho nút audio (DORMANT)
```

### 5.2 Chi tiết từng handler có thật

| # | Handler | Trigger | Cơ chế | Trạng thái |
|---|---|---|---|---|
| 1 | **FAQ accordion** (main.js:12) | `click .accordion_head` | Đóng tất cả `.accordion_body` (`slideUp 300ms`), reset icon về `angle-down`; nếu mục đang đóng thì `slideDown 300ms` + icon `angle-up`. Chỉ 1 mục mở/lượt. | **HOẠT ĐỘNG** (7 mục FAQ) |
| 2 | **Swiper** (main.js:26) | boot | `new Swiper('.swiper1')`: `slidesPerView:2.2`, `spaceBetween:150`, `centeredSlides:true`, `loop:true`, `grabCursor:true`, navigation next/prev, breakpoints 1500/1400/992/768/640/100. | **HOẠT ĐỘNG** (5 slide section8) |
| 3 | **Fake playbar** (main.js:50) | boot | Mỗi `.video-playbar[data-duration]`: tính `elapsed`, vẽ `width %` + badge thời gian; `setInterval 2000ms`. | **DORMANT** — `.video-playbar` có trong HTML nhưng **không có `data-duration`** (count=0) → vòng lặp bỏ qua |
| 4 | **Video play/pause + mute** (main.js:68) | click `.play-toggle`/`.mute-toggle` | Lazy-set `source.src` từ `data-src`, `video.load()`, play/pause; toggle `video.muted`; đổi icon play/pause/mute. | **DORMANT** — `.intro-detail-img` KHÔNG CÓ trong HTML |
| 5 | **Audio preview** (main.js:102) | `onclick=toggleAudio` | Play/stop `#audioPlayer`, đổi nhãn nút, reset `currentTime` khi stop, gắn `onended`. | **DORMANT** — `#audioPlayer`/`#audioControl` KHÔNG CÓ |
| 6 | **Lazy-load** (main.js:119) | IntersectionObserver `rootMargin 0 0 300px 0` | `IMG`: gán `src` từ `data-src`. `VIDEO`: gán `source.src` từ `data-src`, `load()`, auto `play()` (trừ `.no-autoplay`). `.lazy-bg`: gán `background-image` từ `data-bg`. Fallback tải ngay nếu không hỗ trợ IO. | **HOẠT ĐỘNG** (30 `data-src` + nhiều `.lazy-bg`) |
| 7 | **Countdown** (main.js:151) | IntersectionObserver trên `#buynow`/`#pricing`, `threshold 0.2` | Khi pricing vào khung nhìn → `startCountdown(180s, #timer)`, cập nhật `MM:SS` mỗi 1000ms, `clearInterval` khi về 0. | **DORMANT** — `#timer` KHÔNG CÓ (đề-bài/README xác nhận đã gỡ popup chứa timer) |

> **Kết luận:** Trong số 7 handler, chỉ **3 thật sự chạy** (accordion, swiper, lazy-load). 4 handler còn lại là **mã thừa từ bản gốc ToonBee**, an toàn (đều kiểm tra `if (!el) return`), không gây lỗi nhưng nên dọn nếu muốn gọn.

---

## 6. COMPONENT HIERARCHY

```
<body>
│
├─ Hero (.banner.lazy-bg)
│   ├─ Nav (.main-nav)  ……………………………  [TRẠNG THÁI: ẨN — đang comment HTML]
│   ├─ Logo + Pre-subheadline pill
│   ├─ Headline group (H1 ×3)
│   ├─ HeroVideo (iframe Vimeo, autoplay muted)  [mặc định: ĐANG PHÁT]
│   └─ PointBoxGrid (9 × .banner-point-box)
│
├─ Marquee (.section2)  → 2 × MarqueeRow  [mặc định: ĐANG CHẠY 80s, dừng nếu reduced-motion]
│
├─ Steps (.section3)
│   ├─ StepCard 1 (Describe)
│   ├─ StepCard 2 (Generate)  → FloatBtn  [mặc định: ĐANG FLOAT]
│   └─ StepCard 3 (Download)  → LazyVideo  [mặc định: lazy, autoplay khi vào view]
│
├─ Samples (.section4)  → 6 × SampleCard
│   └─ VimeoEmbed + Playbar  [Playbar: TĨNH — không có data-duration]
│
├─ Fact (.section5)  ……………………………………  [TRẠNG THÁI: ẨN — class d-none]
│
├─ WhyAI (.section6)
├─ HardToCreate (.section7)  → 3 × OptionCard
│
├─ Introducing (.section8)
│   ├─ IntroVideo (LazyVideo introvideo3)
│   └─ Showcase (.swiper.swiper1)  → 5 × Slide(LazyVideo + 2 badge)
│        ├─ NavNext (.swiper1-button-next)
│        └─ NavPrev (.swiper1-button-prev)
│
├─ Comparison (.vsbg-section)
│   ├─ WithoutBox (Competitors)
│   └─ WithBox (CinAI, video)  + VS badge
│
├─ Features (#features .section9)  → 7 × FeatureRow
├─ FeatureDetail (.section10)  → 4 × FeatureRow(VimeoEmbed)
├─ NoOtherTool (.section11)  → VimeoEmbed/LazyVideo
│
├─ Pricing (#pricing .section12)
│   ├─ PlanCard PLUS  (#buynow)        [mặc định: thường]
│   └─ PlanCard PRO (.glow)            [mặc định: ĐANG GLOW + badge MOST POPULAR]
│
├─ Synthetic (.section13)  → testimonials img
├─ Bonus (.section14)
│   ├─ BonusBox
│   └─ MoneyBackBox
│
├─ FAQ (#faq .faq-section)  → 7 × Accordion
│        └─ AccordionItem (head + body)  [mặc định: TẤT CẢ ĐÓNG — body display:none]
│
├─ FinalCTA (.section15)
│   ├─ UrgencyHeadline + Review + CTA button
│   └─ BenefitList (4) + ClosingQuestion (shimmer)
│
└─ Footer (.site-footer)  → logo + disclaimer + 6 link + copyright
```

---

## 7. DATA LOGIC

### 7.1 Dữ liệu hằng trong JS (scripts/main.js)
Template **gần như không có mảng/đối tượng dữ liệu**. Các hằng "cấu hình" duy nhất:

| Hằng | Giá trị | Nơi |
|---|---|---|
| Cấu hình Swiper | `slidesPerView:2.2`, `spaceBetween:150`, `centeredSlides:true`, `loop:true`; breakpoints `{1500,1400,992,768,640,100}` | main.js:28–46 |
| Thời lượng đếm ngược | `3 * 60` = 180 giây (03:00) | main.js:165,167 |
| Nhịp playbar giả | `setInterval … 2000ms` | main.js:63 |
| `rootMargin` lazy-load | `'0px 0px 300px 0px'` | main.js:130 |
| `threshold` countdown | `0.2` | main.js:168 |
| Trạng thái audio | biến `isPlaying` (boolean) | main.js:101 |

→ **Toàn bộ nội dung hiển thị là TĨNH, viết thẳng trong `index.html`.** Không fetch, không JSON, không template engine, không state store.

### 7.2 Bảng nội dung chính (hard-coded trong HTML)

| Mục | Nội dung thật |
|---|---|
| Tên sản phẩm | CinAI.tv — AI Creative Workspace |
| Title trang | "CinAI.tv — AI Creative Workspace for Ad Creatives, Storyboards & AI Video" |
| Hero headline | "Breathtaking **AI Ad Creatives** In 3 Steps" |
| Định vị | "One workspace for Ad Images, Product Shots & AI Video — Pro & Plus plans from $3/day" |
| 3 bước | Click 1: Describe IT · Click 2: Generate IT · Click 3: Download IT |
| Gói Plus | **$49/mo** (hoặc $39/mo trả năm) — Ad Images & Product Shots, AI Storyboard, AI Video ≤30s, Standard models, 3 variant, Cloud render, Cancel anytime |
| Gói Pro (MOST POPULAR) | **$97/mo** (hoặc $79/mo trả năm) — Everything in Plus, Premium models (GPT Image 2, Nano Banana Pro), AI Video ≤60s, Unlimited variants, Priority render, Multi-language voiceover, Dedicated support |
| Đảm bảo | 30-day money-back guarantee (cả 2 gói) |
| FAQ | 7 câu: install? · MAC/Windows? · free trial? · support? · Plus vs Pro? · switch plan? · money-back? |
| CTA urgency | "81% OFF" + "they're the present … Will you be selling them or buying them?" |
| Footer | DISCLAIMER + 6 link + "Copyright © 2026 CinAI.tv" |

### 7.3 Hằng điều hướng / CTA

| Đích | URL | Vị trí |
|---|---|---|
| CTA Plus | `https://cinai.tv/signup?plan=plus` | index.html:1307 |
| CTA Pro | `https://cinai.tv/signup?plan=pro` | index.html:1337 |
| CTA cuối ("Get CinAI Right Now") | `#pricing` (anchor in-page) | index.html:1622 |
| Nav "Buy Now" (đang comment) | `#buynow` | index.html:68 |
| Anchor in-page | `#features`, `#pricing`, `#buynow`, `#faq` | nhiều nơi |
| Support | `https://help.cinai.tv` | index.html:1564,1693 |
| Pháp lý | `cinai.tv/privacy · /terms · /refunds · /disclaimer · /cookie` | footer 1688–1693 |

### 7.4 Tài nguyên ngoài (external)
- **Vimeo**: 17 video embed (`player.vimeo.com/video/…`) — hero (1168019205) + 6 samples + 1 intro + 8 feature + comparison. Nội dung video host bên Vimeo (không tự dựng lại).
- **CDN**: Bootstrap 5.2.3, FontAwesome 4.6.3, Google Fonts.
- Asset local: `assets/images/` (130 file), `assets/media/` (43 file video/poster), `assets/cinai/` (2 logo SVG), `assets/js/` (jQuery, Swiper, Vimeo player).

> **Lưu ý bản quyền (README):** ảnh/video trong `assets/` là **placeholder từ toonbee.ai**, chỉ dùng học tập — phải thay trước khi phát hành.

---

## 8. TRACKING

**KHÔNG CÓ.**

Đã kiểm tra toàn bộ `index.html` + `scripts/main.js`: không có Meta Pixel (`fbq`/`fbevents`), không Google Ads/GTM (`gtag`/`gtm`), không Provely/social-proof widget, không FastSpring checkout, không `<noscript>` pixel. Comment đầu `main.js` (dòng 4) ghi rõ: *"Mọi tracking/checkout/3rd-party đã được loại bỏ theo yêu cầu."*

**Lý do:** bản clone này được dựng cho mục đích **học tập / dựng UI**; người dùng chủ động **gỡ tracking + checkout + social-proof** so với trang nguồn `toonbee.ai` (xem `SYSTEM-XRAY-CLONE.md` mục "Chênh lệch có chủ đích"). Nút CTA chỉ trỏ tới `cinai.tv/signup?plan=…` và anchor in-page, **không thực thi thanh toán**.

> Nếu cần bật đo lường: README gợi ý chạy `/tracking-setup` để nhúng Meta Pixel + n8n (4 lớp). Hiện tại: **chưa có gì**.

---

## 9. CHECKLIST CHẤT LƯỢNG

Đối chiếu thực tế với code:

- [x] **Semantic landmark cơ bản**: có `<footer>`; có `<h1>` cho heading chính.
- [ ] **Semantic đầy đủ**: phần lớn layout là `<div class="sectionN">`, **không** dùng `<section>`/`<header>`/`<main>`/`<nav>` đang active (nav bị comment). → còn thiên về div.
- [x] **Design token tập trung**: màu/font/spacing/radius/motion gom trong `tokens.css` (không hardcode lặp ở lớp CinAI).
- [x] **Tách lớp rebrand**: `cinai-override.css` cô lập việc đổi màu/font, không sửa `style.css` gốc → giữ behavior gốc.
- [x] **prefers-reduced-motion**: có (global.css 14–23 + marquee tự dừng).
- [x] **Focus ring a11y**: `:focus-visible` cho `a/button/.accordion_head` (global.css 5–11), màu `--color-accent`.
- [x] **Lazy-load ảnh/video/bg**: IntersectionObserver + fallback (main.js).
- [x] **Animation compositor-friendly**: marquee/float/glow dùng `transform`/`opacity`/`box-shadow` (không animate width/height bố cục — trừ shimmer dùng `left`).
- [x] **font-display: swap**: bật trong link Google Fonts.
- [x] **Anchor scroll mượt**: `html{scroll-behavior:smooth}` (global.css 29).
- [x] **CTA hover/active có thiết kế**: scale + đảo gradient.
- [x] **Không tracking / không checkout thật**: đã gỡ (mục 8).
- [ ] **Mã JS sạch (không thừa)**: còn **4 handler dormant** (playbar, video-controls, audio, countdown) thiếu DOM target → nên dọn.
- [ ] **Kích thước ảnh tường minh (chống CLS)**: nhiều `<img>`/`<video>` **không đặt `width`/`height`** → nguy cơ layout shift (nguồn cũng vậy — X-RAY ghi CLS ~0.09).
- [ ] **Thống nhất bo góc theo token**: layout gốc còn dùng `radius:75px/79px` cứng, chưa map về `--radius-card:20px`.
- [x] **Self-contained, chạy local 1 lệnh**: `_serve.js` (port 8100) hoặc `npx serve`.

---

> **Tham chiếu chéo:**
> - [`SYSTEM-XRAY.md`](./SYSTEM-XRAY.md) — X-quang **trang nguồn** `toonbee.ai` (9 phần).
> - [`SYSTEM-XRAY-CLONE.md`](./SYSTEM-XRAY-CLONE.md) — đối chiếu **bản clone** vs nguồn + chênh lệch có chủ đích.
> - [`README.md`](./README.md) — hướng dẫn chạy, cấu trúc thư mục, tuỳ biến nhanh, lưu ý bản quyền.
