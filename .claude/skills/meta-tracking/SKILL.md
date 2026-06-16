---
name: meta-tracking
description: Thiết lập hạ tầng đo lường Meta Ads 4 lớp cho SaaS (Browser Pixel + Server CAPI + EMQ + Deduplication) cho luồng Ads → Landing → CTA → Web App chính → Đăng ký/Thanh toán, gồm cả lead-magnet (điền email nhận quà). Điều phối Meta Pixel + n8n (CAPI/email/Lark) + cross-domain. Output báo cáo + KPI bằng tiếng Việt. Dùng khi cần dựng tracking từ A–Z cho landing/sản phẩm SaaS.
origin: Ladipage
---

# meta-tracking — Hạ tầng đo lường Meta Ads 4 lớp cho SaaS

Skill chuẩn hoá việc **dựng tracking sạch** cho chiến dịch Facebook Ads → Landing (subdomain) →
bấm CTA → Web App chính → Đăng ký/Thanh toán; **hoặc** lead-magnet (chỉ điền email nhận quà/tài liệu).
Bù dữ liệu mất do iOS/AdBlock bằng CAPI, tối đa khớp nối (EMQ), chống đếm trùng (dedup).

> **Nguyên tắc:** PII (email/phone) **hash SHA-256** trước khi gửi Meta; secret không nhúng client;
> chỉ bật tracking khi có **consent** ở thị trường yêu cầu. Báo cáo bằng **tiếng Việt phi kỹ thuật**.

## When to Use

- Chạy Ads đổ về landing rồi điều hướng về web/app chính để đăng ký/mua.
- Lead-magnet: đổi email lấy tài liệu/quà (chuyển đổi nằm trên landing).
- Cần CAPI server-side, tăng EMQ, dedup, cross-domain/subdomain tracking.
- Cần đối soát Meta ↔ GA4 ↔ CRM (Lark) bằng UTM.

## When NOT to Use

- Chỉ cần clone giao diện → `/clone-template` (skill này được gọi ở Pha 7 của clone-template).
- Chỉ debug 1 trang đang chạy → `/inspect-site`.

## Kiến trúc 4 lớp (bắt buộc)

| Lớp | Tên | Vai trò |
|-----|-----|---------|
| 1 | **Browser / Client** | Meta Pixel trên Landing + Web chính, ghi tương tác tức thời |
| 2 | **Server / CAPI** | Gửi Conversions API từ Backend hoặc qua **n8n** (cổng trung gian) — bù iOS/AdBlock |
| 3 | **EMQ (Event Match Quality)** | Thu tối đa `fbp, fbc, em, ph, external_id, IP, UA` (hash PII) → khớp ≥ 6.5–8đ |
| 4 | **Deduplication** | Dùng **chung `event_id`** cho Browser + Server để Meta không đếm gấp đôi |

## Công cụ điều phối

| Việc | MCP / Agent / Template | Vai trò |
|------|------------------------|---------|
| Quan sát/đo trang thật | `mcp__chrome-devtools__*` + agent `mcp-chrome-power-user` | Kiểm pixel, network, LCP/INP, console |
| Cổng CAPI + email + CRM | template [`automation/n8n/`](../../../automation/n8n/README.md) + MCP `n8n` + agent `mcp-n8n-integrator` | Nhận webhook → CAPI → email lead-magnet → lưu Lark |
| Nuôi dưỡng lead (nurture) | skill **`lead-nurture`** (`/nurture-setup`) + template [`automation/n8n/NURTURE-README.md`](../../../automation/n8n/NURTURE-README.md) | Chuỗi email kéo traffic lạnh quay lại app chính; nội dung sửa trên Lark |
| Lưu khách / CRM nhẹ | MCP `lark` (Bitable) | Lưu Lead/Register/Purchase |
| Đối soát | GA4 + UTM | Tránh lệch data Meta ↔ thực tế |

## Phễu sự kiện chuẩn

```
Ads FB ─(utm_*, fbclid)→ LANDING ─ CTA ─(nối tham số)→ WEB APP CHÍNH
```

| Event | Kích hoạt ở | Browser | Server(CAPI) | event_id | Tham số chính |
|-------|-------------|:------:|:------:|----------|---------------|
| `PageView` | Landing + App | ✅ | ✅ | `pv_*` | fbp, fbc, IP, UA |
| `ViewContent` | Landing | ✅ | ✅ | `vc_*` | fbp, fbc |
| `Lead` | **Submit form / lead-magnet** | ✅ | ✅ | `lead_*` | **em(hash)**, fbp, fbc |
| `Click_CTA` (custom) | Nút CTA về app chính | ✅ | ✅ | `cta_*` | + nối fbclid/utm/fbp/fbc sang app |
| `CompleteRegistration` | App chính (Backend) | ✅ | ✅ | `reg_<userId>` | em, ph, external_id |
| `Purchase` | App chính (Backend) | ✅ | ✅ **(ưu tiên server)** | **`order_id`** | value, currency, em, external_id |

Chi tiết code: [`references/client-setup.md`](references/client-setup.md) (Browser) ·
[`references/server-capi-emq-dedup.md`](references/server-capi-emq-dedup.md) (Server/CAPI/EMQ/Dedup).

## How It Works — 6 bước

```
1. PLAN     → chốt domain (landing/app), Pixel ID, mục tiêu (lead-magnet hay full-funnel), phễu sự kiện
2. BROWSER  → nhúng Pixel base + tracking.js (ViewContent/Lead/Click_CTA) vào landing & app
3. SERVER   → dựng/nối n8n webhook (CAPI + email + Lark); backend app gửi Register/Purchase
4. EMQ      → thu fbp/fbc + hash em/ph/external_id; lấy IP/UA từ header server
5. DEDUP+CROSS-DOMAIN → 1 event_id cho Browser+Server; cookie first-party .ROOT; nối tham số qua CTA
6. TEST+KPI → Test Events, Pixel Helper, n8n Executions; đối chiếu KPI
```

### Bước 1 — PLAN
Xác định: landing domain (vd `intro.cinai.tv`), app chính (`cinai.tv`), `ROOT_COOKIE=.cinai.tv`,
`PIXEL_ID`, mục tiêu chiến dịch (Leads vs Sales), có lead-magnet không. Vẽ phễu sự kiện.

### Bước 2 — BROWSER (Lớp 1)
Nhúng Pixel base + `tracking.js` (xem `references/client-setup.md`). Đánh dấu HTML:
form lead → `data-track-lead="…"`, nút CTA → `data-cta="…"` (href về app chính).

### Bước 3 — SERVER / CAPI (Lớp 2)
Nối client → webhook n8n template `cinai-satellite-tracking`. Backend app gửi
`CompleteRegistration`/`Purchase` về cùng webhook (nguồn sự thật). Xem `references/server-capi-emq-dedup.md`.

### Bước 4 — EMQ (Lớp 3)
Thu `_fbp`/`_fbc`; n8n hash `em/ph/external_id` (SHA-256, lowercase+trim); IP+UA lấy từ header.
Mục tiêu EMQ ≥ 6.5 (lý tưởng 7–8). Lead-magnet có email → EMQ cao.

### Bước 5 — DEDUP + CROSS-DOMAIN (Lớp 4)
Mỗi sự kiện 1 `event_id` dùng cho cả Pixel (`eventID`) và CAPI (`event_id`); `Purchase` dùng `order_id`.
Cookie `_fbp/_fbc` set first-party trên `ROOT_COOKIE` → chia sẻ chéo subdomain. CTA nối
`fbclid/utm_*/fbp/fbc` sang app chính để quy gán đúng chiến dịch.

### Bước 6 — TEST + KPI
Xem mục KPI + Testing dưới.

## KPI cần đạt

| Chỉ số | Mục tiêu | Cảnh báo |
|--------|----------|----------|
| **EMQ** | ≥ 6.5 (lý tưởng 7–8) | Thấp → thiếu em/ph/external_id |
| **LandingPageView / LinkClick** | > 85% | < 85% → trang tải chậm/lỗi pixel |
| **Bounce Rate** | < 40% | Cao → traffic kém/mismatch ads-landing |
| **Click_CTA / LPV** hoặc **Submit / View** (lead-magnet) | theo dõi sát | đánh giá độ hấp dẫn landing |
| **Dedup coverage** | event "Deduplicated" trên Events Manager | sai → kiểm `event_id` |
| **CAPI / Pixel coverage** | CAPI ≥ Pixel | thấp → lỗi server-side |

## Testing

1. **Meta Pixel Helper** — thấy PageView/ViewContent/Lead/Click_CTA, không lỗi trùng pixel.
2. **Test Events (Events Manager)** — set `test_event_code`: các event "Deduplicated", EMQ cao,
   `Purchase` có value+currency.
3. **n8n Executions** — payload đủ fbp/fbc/utm; hash `em` đúng; email lead-magnet gửi; bản ghi Lark.
4. **Cross-domain** — bấm CTA → URL app chính đủ tham số; cookie `_fbc` domain `ROOT_COOKIE`.
5. **GA4 DebugView** — UTM khớp Meta ↔ GA4 ↔ CRM.

## Gotchas thực chiến (kiểm trước khi verify)

Rút từ lần dựng CinBase trên `n8n.halcion.vn` — 3 lỗi này KHÔNG hiện khi test server-to-server,
chỉ lộ khi chạy thật. Kiểm execution n8n (`n8n_executions` mode `error`/`filtered`) nếu Lark/CAPI rỗng:

| Triệu chứng | Nguyên nhân | Cách xử lý |
|-------------|-------------|-----------|
| Console: `blocked by CORS policy ... preflight` | beacon gửi `application/json` → preflight, n8n khác origin không trả CORS header | Client gửi **`text/plain`** (CORS-safelisted); Normalize `JSON.parse` body chuỗi |
| Execution lỗi `Module 'crypto' is disallowed` | task-runner n8n chặn `require('crypto')` | Dùng **SHA-256 thuần JS** (không import) trong node Normalize |
| Node ra `access to env vars denied` → token rỗng → Lark 400 "Missing access token" | instance bật `N8N_BLOCK_ENV_ACCESS_IN_NODE` | Thay `{{ $env.* }}` bằng **n8n credentials** (httpQueryAuth cho Meta, httpCustomAuth cho Lark) |

Quyết định routing (mặc định nên theo): **mọi event → Meta CAPI**, **chỉ `Lead`/`CompleteRegistration`/`Purchase` → Lark**
(không ghi PageView/ViewContent/Scroll/click vào Lark — tránh phình CRM). Bảng Lark tracking tạo riêng,
không dùng chung bảng nurture (khác schema). Chi tiết: [`references/server-capi-emq-dedup.md`](references/server-capi-emq-dedup.md).

## Output (tiếng Việt — §5 CLAUDE.md)

1. **Tổng quan** — phễu đã dựng, lớp nào xong, môi trường nào.
2. **Sơ đồ luồng dữ liệu** — Ads → Landing → CTA → App → Register/Purchase (event nào, Browser/Server).
3. **Cấu hình** — Pixel ID, webhook, env, cột Lark, event_id từng bước.
4. **KPI hiện trạng** — EMQ, LPV%, Bounce, dedup, CAPI coverage + cảnh báo.
5. **Trạng thái** — `OK` / `BLOCKED` (lý do, vd thiếu token).
6. **Phase tiếp theo** — gợi ý (VBO, audience từ CAPI, A/B landing…).

## Ranh giới

- Hash PII trước khi gửi Meta; bản rõ chỉ để gửi email + CRM nội bộ.
- Không nhúng secret/token vào client; lọc token khỏi log/Lark.
- Tôn trọng consent (GDPR…) trước khi bắn sự kiện ở thị trường yêu cầu.
