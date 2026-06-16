# Template CinAI Cartoon LP — bản LEAN bán Pro & Plus

Landing **gọn (8 section)** cho **CinAI.tv** — phong cách **dark luxury + gold** (tái dùng design token của
`template-cartoon`), tối ưu content + CTA, bán hai gói **Pro & Plus**. Stack **HTML/CSS/JS tĩnh**, tự chứa.

## Vì sao bản này
- Rút từ ~20 section của `template-cartoon` xuống **8 section** theo hành trình tâm lý **FCB GC2 (Feel→Learn→Do)**
  — xem skill `fcb-copywriting`.
- Copy **tiếng Anh**, giọng creator, neo từ khoá **"Unlimited"**; mỗi section một ý.
- Conversion hinge = **Showcase/Demo** (đặt sớm). CTA xuất hiện ~4 điểm (header · hero · showcase · pricing · final).

## 8 section
1. **Hero** + dải logo model — headline khát khao + CTA + video output (placeholder)
2. **Showcase/Demo** ★ hinge — lưới output thật
3. **Problem → Solution** — "posting daily shouldn't burn you out" → unlimited
4. **How it works** — Describe → Storyboard (Opus 4.8) → Render (model inline)
5. **Why CinAI** — bảng so sánh + chip use-case
6. **Pricing** — Pro/Plus, toggle Monthly/Yearly (mặc định Yearly), bonus + cancel anytime + countdown
7. **Social proof + FAQ** — 2 quote + 5 câu gỡ rào
8. **Lead magnet** — form thu email tặng **1,000 workflow template free** (nuôi dưỡng khách chưa mua → n8n nurture)

## Bảng giá
Lấy từ `../../templates/_shared/cinai-pricing.md` (source of truth):
- **Pro** $29/mo · $19/mo yearly — *Most popular*. Unlimited images (Nano Banana 2 Pro, ChatGPT Image 2),
  storyboard Opus 4.8, credits video (Seedance/Kling/Omni). Bonus: 20 Grok + 20 Omni + 100 Veo Quality (one-time).
- **Plus** $49/mo · $39/mo yearly — *Best for video creators*. Everything in Pro + bigger credits +
  unlimited video (Gemini Omni, Veo Quality) + 100 Grok/tháng free.

> Cập nhật giá: sửa ở `templates/_shared/cinai-pricing.*` rồi đồng bộ vào `index.html` (section `#pricing`,
> các `data-monthly`/`data-yearly`). KHÔNG hardcode rải rác.

## Chạy local
```bash
cd landings/template-cinai-cartoon-lp
npx -y serve -l 8101 .
# http://localhost:8101
```

## Tương tác (scripts/main.js)
- Toggle giá Monthly/Yearly (anchor giá gốc + pill tiết kiệm chỉ hiện ở Yearly) · FAQ accordion · countdown (kích hoạt khi cuộn tới pricing, lưu sessionStorage)
- **Lead-magnet form** (#lead): validate email + honeypot chống bot → bắn `Lead` qua `cinaiTrack` (Pixel+CAPI dedup) + POST nurture webhook → state cảm ơn.
- Reveal-on-scroll (IntersectionObserver) · tôn trọng `prefers-reduced-motion`.

## Tracking Meta 4 lớp — ĐÃ GẮN (reuse hạ tầng CinBase)
- `scripts/tracking-config.js` + `scripts/tracking.js` (nhúng ở `<head>`). Pixel **2215508219251213**.
- Browser Pixel: PageView + ViewContent (auto), Click_CTA (nút `data-track="Click_CTA"`), Lead (form).
- Server CAPI + Lark: qua webhook **`https://n8n.halcion.vn/webhook/cinai-track`** (workflow `B86AJPMPpv5QhlMj`), cùng `event_id` → dedup.
- CTA passthrough utm/fbclid/fbp/fbc sang `cinai.tv`.
- ⚠️ Trước production: đặt `DEBUG:false` trong `tracking-config.js`; set `ROOT_COOKIE` khi có domain thật.

## Lead magnet (section 8) + Email nurture — ĐÃ DỰNG
- Form `id="lead"` POST `https://n8n.halcion.vn/webhook/cinai-nurture` (text/plain) → workflow **`CinAI — Lead Nurture (1000 Templates)`** id `BQGqDOFLHDFB7g0R` (active).
- Luồng: enroll vào Lark Leads `tblw53bXmpSe6JUD` (Status `nurturing`) → Email 0 (ngay) → +1d → +3d → +7d, dừng khi `registered`.
- Email gửi qua **Gmail OAuth2** (cred `Gmail account`), nội dung từ Lark Content `tbl5i02XtuGPvpvx` (fallback mặc định EN trong node Build Emails).
- ⚠️ Cần hoàn thiện: endpoint thật `https://cinai.tv/api/check-registered?email=` (hiện trả 404 → mặc định tiếp tục nuôi dưỡng); chuẩn bị **asset 1,000 template** (link tải) trong email.

## Tuỳ biến nhanh
- **Màu/font**: `styles/tokens.css` (dùng chung với cartoon).
- **Nội dung/CTA**: sửa thẳng `index.html`; CTA trỏ `cinai.tv/signup?plan=pro|plus`.
- **Video/ảnh**: dùng **output CinAI thật** (mượn từ `template-cinai-video-studio`): hero `assets/media/cinai-tvc.mp4`,
  showcase `cinai-thuonghieu.mp4` + ảnh `assets/cinai/out-*`. Thay bằng asset đúng chiến dịch nếu cần.
- **Tracking**: đã gắn (xem mục trên). CTA có `data-track="Click_CTA"` + `data-cta=` để bắt event & passthrough.

## Trước khi deploy (checklist rút gọn)
- [x] Video/ảnh = output CinAI thật (đã wire). Đổi sang asset đúng chiến dịch/định dạng nếu muốn.
- [x] Gắn tracking Meta 4 lớp (Pixel + CAPI + dedup) — reuse webhook `cinai-track`.
- [x] Dựng chuỗi nurture email (n8n `BQGqDOFLHDFB7g0R`, active) — verify enroll Lark OK.
- [ ] Chốt số credit mỗi gói + cơ chế free-trial (xem `_shared/cinai-pricing.md`).
- [ ] Đặt `DEBUG:false` (tracking-config) + `ROOT_COOKIE` domain thật trước production.
- [ ] Endpoint `check-registered` thật + asset **1,000 template** (link tải) gắn vào email.
- [ ] QA mobile thật, tốc độ < 3s, mọi CTA hoạt động.

## Bản quyền
Logo `assets/cinai/` là tài sản CinAI.tv. Video/ảnh demo là placeholder — thay trước khi phát hành.
