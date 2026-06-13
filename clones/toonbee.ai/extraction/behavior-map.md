# Behavior & Animation Map — toonbee.ai (Pha 1b + 1c)

> Trace từ source (`page.html`, `style.css`, `player.js`, `vimeo-*.js`) + runtime (chrome-devtools).

## A. Animation (CSS @keyframes — `style.css`)
| Tên | Dùng ở | Mô tả | Easing/Duration |
|-----|--------|-------|-----------------|
| `scroll` | `.section2 .marquee__group` | Marquee chạy ngang vô hạn (-100% - gap) | linear, `--duration:80s` |
| `scroll-opp` | `.marquee__group-opp` | Marquee chạy ngược | linear, 80s |
| `float` | `.generatebtn-div` | Nút "Generate" trôi lên xuống ±15px | ease-in-out, 3s infinite |
| `shimmer` | (badge/CTA) | Hiệu ứng loé sáng | 3s infinite |
| `pulse-glow-text` | (text highlight) | Chữ pulse glow | ease-in-out, 2s infinite |
- Tôn trọng `@media (prefers-reduced-motion: reduce)` → marquee `animation-play-state: paused`.
- Transition phổ biến: `background-image 0.5s ease-in` (step cards đổi nền), `hvr-grow` (hover phóng to nút).

## B. Component động (SNAPSHOT_BEFORE — [input→state→render])
### 1. FAQ Accordion (`faq-section`)
- **Input**: click `.accordion_head`.
- **State**: toggle hiển thị `.accordion_body` (mặc định `display:none`), icon `.plusminus` đổi `fa-angle-down` ⇄ up.
- **Render**: jQuery slideToggle (mở/đóng mượt). 1 mục mở tại 1 thời điểm (theo mẫu sales page).
- **CONSTRAINT**: body bắt đầu ẩn; chỉ thân mục được click mới hiện.

### 2. Countdown Timer (`#timer`)
- **Input**: mở checkout popup (`#paymentpopup`).
- **State**: `remainingTime` bắt đầu `3*60` giây, giảm mỗi 1000ms qua `setInterval`.
- **Render**: `MM:SS` (padStart 2). Về 0 → `clearInterval`.
- **CONSTRAINT**: chỉ chạy khi popup mở; reset khi mở lại.

### 3. Audio Voices Preview (`toggleAudio`)
- **Input**: click `#audioControl`.
- **State**: `isPlaying` bật/tắt.
- **Render**: đổi icon `fa-play`⇄`fa-stop`, đổi label "Play Voices Preview"⇄"Stop Preview"; `audio.onended` reset.

### 4. Captions Preview Popover (`#cppVideo`)
- **Input**: click play button caption.
- **State**: `cppOpen`, lazy-init `cppInitialized`; chèn `<source>` webm→mp4, poster webp.
- **Render**: mở popover `.cpp-open`, video play; icon theo trạng thái thật của video.

### 5. Vimeo Players (17 iframe)
- **scroll-pause** (`vimeo-scroll-pause.js`): video pause khi out-of-view, play khi in-view (IntersectionObserver + Vimeo Player API).
- **click-to-unmute** (`vimeo-unmute.js`): video autoplay muted; click "Click to Unmute" → setVolume/unmute.
- Thư viện: `@vimeo/player v2.6.1` (player.js).

### 6. Swiper Carousel (`.swiper-wrapper`)
- Carousel video showcase (testimonial/samples). Swiper 80s loop hoặc drag.

### 7. Marquee (`section2`)
- 2 hàng logo/clip chạy ngang ngược chiều, CSS animation (mục A).

### 8. Lazy-bg
- Nhiều section có class `lazy-bg` + `data-bg="./images/xxx.webp"` → JS gán `background-image` khi scroll tới (giảm tải đầu trang).

### 9. Checkout Popup (`#paymentpopup`) — BÊN THỨ 3
- PageDock + FastSpring (`onfastspring`, `sbl.onfastspring.com`). Chọn addon (captions), order summary, timer.
- **Trong clone**: KHÔNG dựng checkout thật → thay bằng nút CTA placeholder / link "#buynow".

### 10. Social Proof Toast — BÊN THỨ 3
- Widget `app.pagedock.ai/pp/widget.js` (popup "X just purchased"). KHÔNG có trong HTML tĩnh.
- **Trong clone**: bỏ (theo yêu cầu user — không tracking/3rd-party), hoặc mô phỏng UI tĩnh tuỳ chọn.

## C. Performance (runtime trace)
| Metric | Field (CrUX p75) | Lab |
|--------|------------------|-----|
| LCP | 3605 ms ⚠️ (TTFB 1149 + load delay 1655 + render 1292) | — |
| INP | 115 ms ✅ | — |
| CLS | 0.09 ✅ | 0.00 |
- Nút thắt: TTFB chậm + nhiều ảnh/video tải sớm. Insight: bật nén text, giảm redirect, lazy-load asset dưới màn hình.
- Trang nặng: 120 ảnh, 17 iframe Vimeo, jQuery + Bootstrap + Swiper + FontAwesome + 7 Google font.

## D. Tracking/3rd-party (sẽ LOẠI khỏi clone — user chọn không tracking)
- Meta Pixel x2 (`4951226048437757`, `1463909925446442`), `fbevents.js`
- Google Ads conversion (`17978276504`), gtag
- `load.tracking.toonbee.ai/zzufmzdtgr.js` (tracking riêng)
- `app.pagedock.ai/pp/widget.js` (social proof)
- FastSpring checkout (`sbl.onfastspring.com`)
