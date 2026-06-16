# CinAI.tv — Bảng giá dùng chung (SOURCE OF TRUTH)

> File này là **nguồn chân lý** cho bảng giá CinAI.tv. Mọi landing template (`template-cinai-cartoon-lp`,
> `template-cartoon`, `template-cinai-clips`, …) **tham chiếu sang đây** thay vì hardcode rời rạc.
> Dữ liệu máy đọc: [`cinai-pricing.json`](cinai-pricing.json). Cập nhật giá ở 1 nơi → đồng bộ mọi trang.
>
> ⚠️ **Placeholder cần xác nhận trước deploy** (xem mục cuối) — số credit mỗi gói, cơ chế free-trial.

## Hai gói

| | **Pro** — *Most popular · Start here* | **Plus** — *Best for video creators* |
|---|---|---|
| **Tháng** | **$29/mo** | **$49/mo** |
| **Năm** | **$19/mo** (billed yearly ≈ $228/yr) | **$39/mo** (billed yearly ≈ $468/yr) |
| **Ảnh AI** | ♾️ Unlimited — **Nano Banana 2 Pro** · **ChatGPT Image 2** | ♾️ Unlimited (gồm toàn bộ của Pro) |
| **Storyboard** | ✅ bằng **Opus 4.8** | ✅ (như Pro) |
| **Video — credit** | Plan credits chạy **Seedance · Kling · Omni** | **Credit cộng theo gói (nhiều hơn Pro)** |
| **Video — unlimited** | — | ♾️ Unlimited — **Gemini Omni** · **Veo Quality** |
| **Quà tặng** | One-time: **20 Grok + 20 Omni + 100 Veo Quality** video free | Tất cả của Pro **+ 100 Grok video free / tháng** |
| **CTA** | `cinai.tv/signup?plan=pro` | `cinai.tv/signup?plan=plus` |

**Free trial:** "Sign up and generate for free". **Toggle mặc định:** Yearly (khoe giá $19 / $39).

## Định vị 2 gói (để dùng trong copy)
- **Pro = cửa vào** (rào giá thấp $29): bán bằng **"unlimited images + storyboards"** — hợp creator cần nhiều ảnh/thumbnail + video vừa phải.
- **Plus = gói creator video** ($49): bán bằng **"unlimited cinematic video"** — hợp KOL đăng video đều.
- **Đòn bẩy**: từ khoá **"Unlimited"** lặp xuyên suốt · **quà free renders** tạo urgency · **Yearly giảm 33%/20%** để anchor mua năm.

## Copy snippets sẵn dùng (EN)

**Pricing eyebrow:** `Unlimited starts at $19/mo`
**Pro card:** `Pro — $29/mo (or $19/mo billed yearly). Unlimited AI images (Nano Banana 2 Pro, ChatGPT Image 2), auto-storyboards with Opus 4.8, and credits for Seedance, Kling & Omni video. Welcome bonus: 20 Grok + 20 Omni + 100 Veo Quality renders free.`
**Plus card:** `Plus — $49/mo (or $39/mo billed yearly). Everything in Pro, a bigger credit allotment, plus UNLIMITED video with Gemini Omni & Veo Quality — and 100 free Grok videos every month.`
**Toggle:** `Monthly · Yearly (save up to 33%)`

## Cách 1 template áp dụng
1. Đọc `cinai-pricing.json` (hoặc bảng trên) làm chuẩn.
2. Dựng section pricing 2 card Pro/Plus + toggle Monthly/Yearly (mặc định Yearly).
3. Gắn badge: Pro = "Most popular", Plus = "Best for video creators".
4. CTA mỗi card trỏ đúng `ctaUrls`; giữ `utm`/`fbclid` khi điều hướng sang cinai.tv.
5. KHÔNG hardcode số ở nhiều nơi — chỉ lấy từ file này.

## Placeholder cần xác nhận trước deploy
- [ ] **Số credit cụ thể** mỗi gói (Pro vs Plus) — hiện chưa có con số.
- [ ] **Hiển thị giá năm** (tổng $228 / $468, hay chỉ ghi "$19/mo billed yearly").
- [ ] **Cơ chế free-trial** (tặng bao nhiêu credit/video khi đăng ký free).
- [ ] **Most-popular badge**: đang gán **Pro** — đổi sang Plus nếu muốn đẩy gói cao hơn.
