# PLAYBOOK — Tạo Landing QC cho CinAI.tv từ template

> Quy trình chuẩn (SOP) để dựng một landing quảng cáo cho **cinai.tv** từ template có sẵn.
> Mục tiêu: lặp lại được, nhất quán, ai làm cũng ra cùng chất lượng. ~70% các bước là
> **tự động hoá được**; phần còn lại là **cổng duyệt của người** (quyết định kinh doanh + duyệt copy).
>
> Tài liệu này mô tả quy trình thủ công hiện tại **và** bản thiết kế để auto sau này.
> Bản tham chiếu mẫu đã làm theo đúng quy trình: [`cinai-video-studio-qc/`](cinai-video-studio-qc/).

---

## 0. Nguyên tắc

1. **Một prompt = một phần; phân tích TRƯỚC, làm SAU** (theo `CLAUDE.md`).
2. **3 cổng duyệt của người** (không bao giờ auto vượt qua):
   - 🚪 **Cổng 1 — Brief**: offer, giá, card nổi bật, ngôn ngữ mặc định, template nguồn.
   - 🚪 **Cổng 2 — Copy**: duyệt nội dung EN + bản dịch VN.
   - 🚪 **Cổng 3 — Deploy**: duyệt báo cáo QA + bật tracking thật.
3. **Source-of-truth giá**: luôn lấy từ [`templates/_shared/cinai-pricing.json`](../templates/_shared/cinai-pricing.json) — KHÔNG hardcode rời.
4. **An toàn trước tốc độ**: giữ template gốc nguyên vẹn (chỉ copy ra `landings/`).

---

## 1. Sơ đồ pipeline

```
[CỔNG 1] Brief
   ↓ (auto)
B1. Scaffold: copy template → landings/<tên>/ , dọn docs
   ↓ (auto)
B2. Nhúng tracking (config + tracking.js)         ← module _shared
B3. Sinh section Pricing từ cinai-pricing.json     ← source-of-truth
B4. Gắn khung i18n EN/VN (engine + data-i18n)      ← module _shared
   ↓ (AI sinh)
B5. Viết copy EN + dịch VN
   ↓ [CỔNG 2] duyệt copy
B6. QA tự động (link audit + playwright + n8n)
   ↓ [CỔNG 3] duyệt báo cáo
B7. Deploy (đặt DEBUG=false, kiểm route thật)
```

---

## 2. Các bước chi tiết

### 🚪 Cổng 1 — Brief (người chốt)
Trước khi làm bất cứ gì, chốt:
- [ ] **Template nguồn** (vd `templates/template-cinai-video-studio`, `template-cartoon`, `template-cinai-clips`).
- [ ] **Tên landing** → `landings/<tên>` (đặt theo template để phân biệt, vd `cinai-video-studio-qc`).
- [ ] **Offer** (vd "Welcome Offer 56% OFF") + có sticky không.
- [ ] **Giá & cách thể hiện ưu đãi** (giá gốc gạch ngang / áp % / chỉ badge) — xem `cinai-pricing.json`.
- [ ] **Card nổi bật** (Pro hay Plus).
- [ ] **Ngôn ngữ mặc định** (auto theo trình duyệt / VN / EN).

### B1. Scaffold *(auto)*
```bash
cp -r templates/<template> landings/<tên>
rm -rf landings/<tên>/extraction landings/<tên>/SYSTEM-*.md   # dọn tài liệu tham chiếu
```

### B2. Nhúng tracking *(auto)*
- Copy `scripts/tracking.js` (bản chuẩn) + `scripts/tracking-config.js`.
- Điền `tracking-config.js` (`window.CINAI_CONFIG`):
  - `PIXEL_ID: "2215508219251213"`
  - `N8N_WEBHOOK: "https://n8n.halcion.vn/webhook/cinai-track"`
  - `MAIN_DOMAIN: "https://cinai.tv"`, `PRICING_URL: "https://cinai.tv/pricing"`
  - `ROOT_COOKIE`: `".cinai.tv"` nếu host trên subdomain cinai.tv, còn lại để trống.
  - `CURRENCY`, `DEBUG: true` (đổi `false` khi deploy).
- Đảm bảo `index.html` nạp `tracking-config.js` rồi `tracking.js`.
- Gắn `data-cta` cho mọi nút sang cinai.tv (để passthrough utm/fbclid/_fbp/_fbc),
  `data-track="..."` cho các CTA chuyển đổi chính, `data-track-lead` + `data-redirect` cho form modal.

### B3. Sinh section Pricing *(auto từ source-of-truth)*
- Đọc `templates/_shared/cinai-pricing.json` → dựng 2 card Pro/Plus + toggle Monthly/Yearly (mặc định Yearly).
- Badge "Most popular" / "Best for video creators"; card nổi bật theo Cổng 1.
- CTA → `cinai.tv/signup?plan=pro|plus`.
- Nếu có offer %: thêm giá gốc gạch ngang (anchor = giá ÷ (1 − %)) + pill `−N%`.

### B4. Gắn khung i18n EN/VN *(bán-auto)*
- Copy `scripts/i18n.js` (engine). Cơ chế:
  - `data-i18n="key"` → đổi `textContent`.
  - `data-i18n-html="key"` → đổi `innerHTML` (cho text có `<em>`/`<strong>`).
  - `data-i18n-attr="placeholder:key"` → đổi thuộc tính.
  - Nội dung render bằng JS (mô tả model, FAQ) → để trong `DYNAMIC` của `i18n.js`.
- Gắn `data-i18n` vào mọi text node trong `index.html`.
- Thêm nút toggle **VI/EN** ở header; auto nhận `navigator.language`, lưu `localStorage`.

### B5. Viết copy EN + dịch VN *(AI sinh)*
- Viết copy EN giọng marketing (có thể dùng skill `fcb-copywriting` / `landing-prompt`).
- Dịch sang VN tự nhiên (không dịch máy cứng) → điền vào `DICT.en` / `DICT.vi`.

### 🚪 Cổng 2 — Duyệt copy (người)
- [ ] Đọc lại toàn bộ copy EN + VN trên trang (bấm toggle VI/EN).

### B6. QA tự động
```bash
cd landings/<tên> && npx -y serve -l 8099 --no-port-switching .
```
Checklist (xem mục 3).

### 🚪 Cổng 3 — Duyệt báo cáo + Deploy (người)
- [ ] Đặt `DEBUG: false` trong `tracking-config.js`.
- [ ] Xác nhận route thật: `cinai.tv/login`, `/pricing`, `/signup?plan=pro|plus`.
- [ ] Xác nhận placeholder giá (số credit mỗi gói, giá neo offer).

---

## 3. Checklist QA (chạy mỗi lần)

**Audit link** — không còn link lạ, tất cả trỏ cinai.tv / in-page / mailto:
```bash
grep -oE 'href="[^"]*"' index.html | grep -vE 'cinai\.tv|#|mailto:|assets/|styles/|fonts\.g' | sort -u
# kết quả rỗng = đạt
```

**Chức năng** (playwright headless):
- [ ] 0 lỗi console.
- [ ] Toggle **VI/EN**: text đổi (kể cả model/FAQ render JS), `<html lang>` đổi, lưu localStorage.
- [ ] Toggle **Monthly/Yearly**: giá + giá gốc gạch + ghi chú chu kỳ đổi đúng.
- [ ] 2 card pricing **bằng chiều cao** (`offsetHeight` bằng nhau).
- [ ] Thanh offer **sticky** `top:0` sau khi cuộn.
- [ ] **Tracking**: `fbq` init, PageView + ViewContent bắn (console `[cinai-track]`).
- [ ] **CTA passthrough**: với URL `?fbclid=…&utm_source=…`, các nút `a[data-cta]` được nối param sang cinai.tv.
- [ ] **End-to-end n8n**: load trang → có execution `success` trên workflow `B86AJPMPpv5QhlMj`
      (kiểm bằng MCP n8n `executions list`). PageView/ViewContent vào CAPI, KHÔNG tạo row Lark.
- [ ] Responsive 320/768/1024/1440 — không tràn, menu hamburger + float CTA ổn.

**Dọn rác QA**: xoá `.playwright-mcp/` và ảnh chụp tạm trước khi commit.

---

## 4. Mảnh ghép tái dùng (hiện trạng → cần tách)

| Module | Nguồn chuẩn hiện tại | Trạng thái |
|---|---|---|
| Bảng giá (số liệu) | [`templates/_shared/cinai-pricing.json`](../templates/_shared/cinai-pricing.json) | ✅ đã là source-of-truth |
| Tracking JS + config | [`cinai-video-studio-qc/scripts/tracking.js`](cinai-video-studio-qc/scripts/tracking.js) (port từ `Cinbase-tvc`, đã verified) | ⚠️ nên tách sang `_shared/tracking/` |
| i18n engine | [`cinai-video-studio-qc/scripts/i18n.js`](cinai-video-studio-qc/scripts/i18n.js) | ⚠️ nên tách sang `_shared/i18n/` |
| Section Pricing (HTML+CSS) | trong `cinai-video-studio-qc/index.html` + `styles/sections.css` | ⚠️ nên thành bộ sinh từ JSON |
| Workflow n8n tracking | [`automation/n8n/cinai-satellite-tracking.workflow.json`](../automation/n8n/cinai-satellite-tracking.workflow.json) | ✅ active (`B86AJPMPpv5QhlMj`) |

> Hiện tracking/i18n/pricing đang **copy thủ công** giữa các landing. Bước đầu tiên khi muốn auto:
> trích 3 cái này thành module dùng chung trong `templates/_shared/`.

---

## 5. Bản thiết kế AUTOMATION (khi quyết làm)

**(a) Script scaffold** — `tools/new-landing.mjs`:
```
node tools/new-landing.mjs --template <tên> --name <landing> --spotlight plus --offer 56
```
Tự: copy template → dọn docs → nhúng `_shared/tracking` + `_shared/i18n` → sinh section pricing từ
`cinai-pricing.json` → ghi `tracking-config.js` với giá trị mặc định → in checklist còn lại.

**(b) Skill điều phối** — `/cinai-landing` (giống skill `clone-template` đã có):
```
Cổng 1 (AskUserQuestion: template/offer/giá/card/ngôn ngữ)
  → chạy tools/new-landing.mjs (auto)
  → AI sinh copy EN + dịch VN vào i18n
  → Cổng 2 (duyệt copy)
  → QA tự động (mục 3) + check n8n executions
  → Cổng 3 (báo cáo + đặt DEBUG=false)
```

**(c) Module hoá** `templates/_shared/`:
```
_shared/
  cinai-pricing.json        # đã có
  tracking/tracking.js       # bản chuẩn (text/plain beacon, passthrough, dedup)
  tracking/tracking-config.template.js
  i18n/i18n.js               # engine; mỗi landing tự khai DICT
  pricing-section/render.mjs # sinh HTML 2 card từ JSON
```

**Ước lượng lợi ích**: 1 landing mới từ ~2 giờ thủ công → **vài phút auto + 3 lần bấm duyệt**.

---

## 6. Phụ lục — Event model tracking

| Event | Khi nào | Đi đâu |
|---|---|---|
| `PageView`, `ViewContent` | load trang | Meta CAPI (không lưu Lark) |
| `Scroll25/50/75` | cuộn | CAPI |
| click `[data-track]` (CTA) | bấm nút chính | CAPI |
| `Lead` | submit form modal (email) | CAPI **+ lưu Lark** |
| `CompleteRegistration` / `Purchase` | (xảy ra trên cinai.tv) | CAPI **+ lưu Lark** |

> n8n `Route by Event` chỉ ghi Lark khi `event_name` ∈ {`Lead`, `CompleteRegistration`, `Purchase`}.
> Mọi event dùng chung `event_id` (Browser Pixel ↔ CAPI) để **dedup**. Beacon gửi `text/plain` để
> tránh CORS preflight khi landing khác origin với n8n.
