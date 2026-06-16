# CinAI Cartoon LP — bản MID-LENGTH (bán Pro & Plus, song ngữ VI/EN)

Landing **mid-length** cho **CinAI.tv** — **giữ NGUYÊN phong cách (style) của `templates/template-cartoon`**
(dark-luxury + gold, font zalando/syne, lazy-bg + accordion). KHÔNG phải redesign: đây là **template-cartoon
được cắt bớt + thay ruột giá/CTA/nội dung**, mục tiêu **bán gói trực tiếp** + **thu lead**.

> Phân biệt với 2 bản khác:
> - `templates/template-cartoon/` = bản mẫu gốc ~20 section (đừng QC/sửa ở đó).
> - `landings/template-cinai-cartoon-lp/` = bản **lean 8 section** redesign (style KHÁC).
> - `landings/cinai-cartoon-mid/` (file này) = **mid-length, giữ đúng style cartoon**.

## Cấu trúc hiện tại (~11 section + footer)
1. **Hero (banner)** — "Breathtaking AI Ad Creatives In 3 Steps" + intro video + 9 điểm bán + CTA
2. **section3** — 3 bước Describe → Generate → Download
3. **section4** — "I just use CinAI" — **marquee video chạy ngang 16:9** (6 sample, auto-scroll, hover Preview)
4. **section7** — "AI videos are Hard To Create" — 3 lựa chọn (freelancer / tự làm / **CinAI** với ảnh mockup `assets/cinai/cinai-mockup.png`)
5. **section8** — "Introducing… AI-Powered Storytelling" + **marquee video DỌC 9:16** "Perfect Style For Any Need"
6. **vsbg-section** — "Competitors Vs CinAI" — bảng so sánh
7. **section9** — "CinAI Unmatched Features" — **lưới 3 cột, 12 tính năng**
8. **section10-reel** — "Watch Real Videos Generated with CinAI" — **marquee 16:9** + overlay Preview
9. **section12 (#pricing)** ★ — **Pro $29 (trái)** / **Plus $49 (phải · Most popular, nổi bật)** + dải Stripe
10. **faq-section (#faq)** — 7 câu hỏi
11. **lead-magnet (#lead)** — **form thu email** → nhận workflow CinAI miễn phí (nối n8n nurture)
+ **footer**

**Đã CẮT/THAY trong quá trình QC** (so với template gốc): bỏ swiper carousel (→ marquee 9:16), bỏ `demo-section`
(video kinh dị), bỏ `money-back-section` (cam kết hoàn tiền bịa), bỏ `section14` bonus (ToonBee + "500 Ai Credits"),
thay `section15` final-CTA (hù dọa) → **lead-magnet**, bỏ feature "AI Voice Studio" (CinAI không có).

## Bảng giá (source of truth: `../../templates/_shared/cinai-pricing.md`)
- **Pro** — **$29/mo** ($19/mo yearly · save 33%). Card **trái, nền tối**. Unlimited images (Nano Banana 2 Pro,
  ChatGPT Image 2), storyboard Opus 4.8, plan credits video (Seedance/Kling/Omni). Welcome bonus: 20 Grok + 20 Omni + 100 Veo Quality.
- **Plus** — **$49/mo** ($39/mo yearly). Card **phải, vàng, badge ⭐ Most Popular** (nổi bật). Everything in Pro +
  bigger credits + **unlimited video** (Gemini Omni, Veo Quality) + 100 Grok/tháng free.
- Icon checkmark đồng nhất (CSS), dải thanh toán **Stripe** (VISA/MC/Amex/Discover/Apple/Google Pay) trên card Plus.

## Song ngữ VI/EN
- Engine **dịch theo text-node** (`scripts/i18n.js` + từ điển `scripts/i18n-vi.js`), **mặc định EN**, lưu `localStorage`.
- Nút chuyển EN/VI cố định góc phải; placeholder form cũng đổi ngôn ngữ (`scripts/lead-form.js`).

## Media — đã TỐI ƯU (mượt + nhẹ như mstudio.ai)
- 9 clip anime thật từ cinai.tv (`assets/media/anime{1,2,3,4,5,6,9,10,11}.mp4`). **Đã xoá sạch ToonBee** (anime7/8 + ảnh mồ côi).
- **Nén + cắt loop:** `assets/media` **243MB → 18MB**. Clip dài (96–341s) trim còn **loop 15s**, H.264 720p CRF28, bỏ audio, `+faststart`.
- **Poster** `.webp` (frame đầu) cho mọi `<video>` ở `assets/media/posters/` → hiện hình ngay, hết "ô đen".
- **`scripts/video-perf.js`**: IntersectionObserver **chỉ phát clip trong khung nhìn, pause phần còn lại** → cuộn mượt.
- Backup bản gốc: `C:\Users\Admin\ladipage-media-backup\cinai-cartoon-mid\`.
- ⚙️ Nén lại bằng ffmpeg portable (`C:\Users\Admin\ffmpeg`); chỉnh CRF/poster trong các lệnh đã dùng nếu cần.

## Tracking (Meta Pixel + CAPI + EMQ + Dedup)
- `scripts/tracking-config.js` (Pixel `2215508219251213` · CAPI `n8n…/cinai-track` · nurture `…/cinai-nurture` · USD)
  + `scripts/tracking.js` (engine dùng chung các landing CinAI) — include trong `<head>`.
- Auto: `PageView`, `ViewContent`, `Scroll25/50/75`, mọi nút `data-track` (CTA), **`Lead`** khi submit form.
- Browser Pixel ↔ Server CAPI cùng `event_id` → **dedup**.
- ⚠️ **Trước production**: trong `tracking-config.js` đổi `DEBUG:false`, `ROOT_COOKIE:".cinai.tv"`, xác nhận Pixel ID.

## CTA & link
- CTA pricing → `https://cinai.tv/signup?plan=pro|plus`? → **ĐÃ chuẩn hoá: mọi link trỏ `https://cinai.tv`** (theo yêu cầu; không dùng subpath/subdomain). Hoàn tiền theo **điều khoản Stripe**.
- Nút hero/nav → anchor trong trang (`#pricing`, `#features`); logo → `https://cinai.tv`.

## Responsive — đã verify
320 / 390 / 768 / 1024 / 1920px: **không tràn ngang**; features 1→2→3 cột, bảng giá dồn/side-by-side, lead form xếp dọc đúng.

## Chạy local
```bash
cd landings/cinai-cartoon-mid
node _serve.js          # http://localhost:8100/index.html
```

## Scripts
`main.js` (accordion, lazy-load, video controls — dùng chung template) · `video-perf.js` (play/pause theo viewport) ·
`lead-form.js` (form → webhook nurture, song ngữ, honeypot) · `i18n-vi.js` + `i18n.js` (song ngữ) ·
`tracking-config.js` + `tracking.js` (Pixel + CAPI).

## ⚠️ Còn lại trước deploy
- [ ] `tracking-config.js`: `DEBUG:false` + `ROOT_COOKIE:".cinai.tv"` + xác nhận Pixel ID đúng CinAI.tv.
- [ ] Chốt **số credit mỗi gói + cơ chế free-trial** (placeholder trong `_shared/cinai-pricing.md`).
- [ ] Xác nhận webhook `cinai-nurture` có nội dung **quà tặng workflow** để gửi mail.
- [ ] (Tuỳ chọn) tối ưu `assets/cinai/cinai-mockup.png` (~1.9MB → webp ~120KB).

## Bản quyền
Logo + ảnh `assets/cinai/` là tài sản CinAI.tv. Toàn bộ video/ảnh ToonBee kế thừa từ template **đã được thay/bỏ**.
