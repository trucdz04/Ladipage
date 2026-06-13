# Behavior & Logic Map — autoclips.app

## Hiệu năng (đo thực)
- FCP ~1.0s · DOMContentLoaded ~3.1s · Load ~7.9s (250 resource, ~74 video autoplay) · transferSize HTML ~40KB
- LCP: hero H1 "Create Viral Videos with AI" (96px) + video trailer autoplay → nặng vì nhiều video
- Nút thắt chính: **quá nhiều `<video autoplay>`** tải đồng thời (carousel + format showcases) → load chậm. Clone nên dùng `loading=lazy` / IntersectionObserver play.

## Animation chính
- Transition mặc định: `0.2s cubic-bezier(0,0,0.2,1)` (màu/transform/opacity) — hover nút, card
- Card hover: `box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)` + nhấc nhẹ (transform translateY)
- **Marquee carousel**: `@keyframes scroll 56s linear infinite` — dải video "UNIQUE VIDEOS EACH TIME" trôi ngang vô tận (duplicate track để loop liền mạch)
- Video: `autoplay loop muted playsinline` — phát tự động khi vào viewport
- Scroll-reveal: fade/slide-up nhẹ khi section vào màn hình (opacity + translateY)

## Component động (SNAPSHOT_BEFORE — [input→state→render] · 4 trục)

### 1. Pricing Toggle (Yearly/Monthly)
- **STATE**: `billing: 'yearly' | 'monthly'` (mặc định Yearly, có badge "-20%")
- **INPUT**: click 2 tab "Yearly -20%" / "Monthly"
- **TRANSFORM**: yearly → hiển thị giá/mo đã giảm 20% + "$X billed annually" + "Save N (20% off)"; monthly → giá gốc
- **RENDER giá** (yearly /mo · monthly gốc):
  - Essential: $23 · $29 — 5,000 credits, 12-50 videos/mo, 1 account (YT+TikTok)
  - Pro **(Most Popular)**: $47 · $59 — 12,000 credits, 30-120 videos/mo, 1 acc/platform
  - Advanced: $79 · $99 — 25,000 credits, 62-250 videos/mo, x3 accounts
  - Enterprise: $159 · $199 — 60,000 credits, 150-600 videos/mo, x5 accounts
  - Ultra: (gói cao nhất — credits/giá lớn hơn)
- **CONSTRAINT**: yearly = round(monthly × 0.8); badge "Most Popular" trên Pro
- **ANIMATION**: tab active trượt (transition bg/color 0.2s)

### 2. FAQ Accordion (20 mục)
- **STATE**: `openIndex: number | null` (chỉ MỞ 1 mục/lần — single-open)
- **INPUT**: click nút câu hỏi
- **TRANSFORM**: toggle openIndex; click mục đang mở → đóng
- **RENDER**: panel trả lời expand (max-height + opacity), icon +/− hoặc chevron xoay
- **ANIMATION**: chevron rotate 0.2s, panel slide 0.3s ease-in-out
- Q&A đầy đủ: xem `faq-content.json` (20 cặp)

### 3. ROI Calculator (4 sliders)
- **STATE**: `{ videosPerDay:1, avgViews:1000, buyerRate:0.1, productValue:30 }`
- **INPUT**: 4 `<input type=range>`:
  - Videos per day: min1 max3 step1 (default 1) — nhãn 1/day·2/day·3/day
  - Average views per video: min1000 max50000 step1000 (default 1000)
  - Viewer-to-buyer rate: min0.1 max0.5 step0.05 (default 0.1) — "% (conservative)"
  - Product / commission value: min10 max200 step5 (default 30)
- **TRANSFORM (công thức)**:
  ```
  monthlyVideos = videosPerDay * 30
  totalViews    = monthlyVideos * avgViews
  estSales      = totalViews * (buyerRate / 100)
  revenue       = estSales * productValue
  roiMultiple   = revenue / 29   // so với gói $29/mo
  ```
- **RENDER** (verify default): 1×30=30 videos · 30×1000=30K views · 30K×0.1%=30 sales · 30×$30=**$900/mo** · "From a $29/month investment" · "31.03x return 🔥"
- **CONSTRAINT**: cập nhật realtime khi kéo (oninput), format số (K, $, .Xx), thanh track tô màu accent theo % value
- **ANIMATION**: số nhảy mượt; track fill transition

### 4. Video Carousels / Showcases
- **STATE**: video autoplay muted loop; một số "talking objects" autoplay=false → play khi hover/viewport
- Marquee dải ngang (scroll 56s) cho niche showcase
- Các format section (Talking Objects / Fruit / Creepy Toon / 3D / Character Explainer): lưới video dọc 9:16 với badge "X views"
- **CONSTRAINT**: muted + playsinline để autoplay hợp lệ trên mobile

### 5. Nav (header)
- **STATE**: mobile menu open/closed (hamburger < md)
- Desktop: links Pricing/FAQs/Roadmap/Changelog + Login + "Get Started For Free" (CTA accent)
- **Nav KHÔNG sticky** (đã xác minh: `position: static` — cuộn xuống trôi mất theo trang, không cố định top)
- Platform bar: nhãn "Create videos optimized for" ở trên, hàng 3 nền tảng mỗi cái icon-SVG-xám TRÊN / chữ DƯỚI (flex-col)

### 6. Automations Pipeline (section "Put Your Content on Autopilot")
- **STATE**: goal selector `Views|Followers|Sales` + animated step "Step N of 6"
- **TRANSFORM**: chọn goal đổi nội dung tối ưu; pipeline tự chạy qua 6 bước (auto-advance timer)
- Posts to YouTube/TikTok/Instagram/Facebook (logos)

## Links ngoài (đều trỏ app chính)
- CTA → `https://app.autoclips.app/login`
- Studio → `/studio`, Character Explainer → `/character-explainer`
- Nav: `/pricing`, `/#faqs`, `/roadmap`, `/changelog`, `/blog`
- Discord `discord.gg/autoclips` · email `hello@autoclips.app` · Refer `autoclips.getrewardful.com`
- Footer: © 2024 Zayaverse LLC, Sheridan WY

## Asset inventory
- 17 ảnh: logo (`/icon.png`), avatar creator (ali/yusuf/mrpuppi/incredible/jab/history), screenshot UI (`autoclips-prompt-box.webp`, `ve.jpg`), platform icons (youtube/tiktok png)
- 74 `<video>` element trên CDN `zayathemes.b-cdn.net` (carousel, talking-objects, fruit-stories, creepy-toon, 3d-videos, character-explainer, step-1/2/3) + trailer `autoclips-trailer.mp4`
- **Chính sách**: giữ link CDN video trực tiếp (public, học tập); logo/avatar thương mại → placeholder ở bản phát hành
