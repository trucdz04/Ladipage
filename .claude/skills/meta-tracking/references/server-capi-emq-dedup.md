# Server / CAPI + EMQ + Dedup (Lớp 2-3-4) — meta-tracking

> Tham chiếu cho [`meta-tracking`](../SKILL.md). Cổng server-side dùng template n8n có sẵn:
> [`automation/n8n/`](../../../../automation/n8n/README.md) (`cinai-satellite-tracking.workflow.json`,
> đã validate). Có thể giao agent `mcp-n8n-integrator` để validate/triển khai.

## Lớp 2 — Conversions API qua n8n

Client `sendBeacon` (content-type `text/plain`) → webhook n8n. Routing **khuyến nghị** (CinBase đang chạy):

```
Normalize+Hash ─┬─► Build CAPI ─► Meta CAPI        (MỌI event: PageView/ViewContent/Scroll/Lead/Register/Purchase)
                └─► Route by Event ─ chỉ Lead|CompleteRegistration|Purchase ─► Lark (CRM sạch)
                                    └─ event khác → dừng (KHÔNG ghi Lark, tránh phình bảng)
```

> Mọi event vẫn lên CAPI (đo lường + dedup với Pixel); chỉ conversion thật mới vào Lark. Bản template
> gốc route "mọi event → Lark" làm CRM phình bởi PageView/Scroll — nên lọc như trên.

**Body text/plain:** vì client gửi `text/plain` (tránh CORS), node Normalize phải tự parse chuỗi:
```js
let bodyRaw = item.body;
if (typeof bodyRaw === 'string') { try { bodyRaw = JSON.parse(bodyRaw); } catch(e){ bodyRaw = {}; } }
const b = (bodyRaw && typeof bodyRaw === 'object' && Object.keys(bodyRaw).length) ? bodyRaw : item;
```

Backend app chính gửi `CompleteRegistration`/`Purchase` về **cùng webhook** (nguồn sự thật), payload:

```jsonc
// CompleteRegistration
{ "event_name":"CompleteRegistration", "event_id":"reg_<userId>",
  "email":"a@b.com", "phone":"+8490...", "user_id":"<userId>",
  "fbp":"fb.1...", "fbc":"fb.1...", "event_source_url":"https://cinai.tv/welcome",
  "utm_campaign":"<từ attr đã lưu>" }

// Purchase (event_id = order_id để dedup với Pixel /thank-you)
{ "event_name":"Purchase", "event_id":"ORDER_20260611_00123",
  "email":"a@b.com", "user_id":"<userId>", "plan":"pro_monthly",
  "value":19.00, "currency":"USD", "fbp":"fb.1...", "fbc":"fb.1..." }
```

Payload Meta CAPI (n8n tự dựng trong node *Build CAPI Payload*):

```jsonc
{ "data": [ {
  "event_name": "Purchase", "event_time": 1718000000,
  "event_id": "ORDER_20260611_00123", "action_source": "website",
  "event_source_url": "https://cinai.tv/thank-you",
  "user_data": { "em":["<sha256>"], "ph":["<sha256>"], "external_id":["<sha256>"],
                 "fbp":"fb.1...", "fbc":"fb.1...", "client_ip_address":"x.x.x.x", "client_user_agent":"..." },
  "custom_data": { "currency":"USD", "value":19.00, "content_ids":["pro_monthly"], "content_type":"product" }
} ] }
// + test_event_code khi test trong Events Manager
```

## Lớp 3 — EMQ (Event Match Quality)

- Gửi tối đa: `em` (email), `ph` (phone E.164 chỉ số), `external_id` (userId), `fn/ln`, `fbp`, `fbc`,
  `client_ip_address`, `client_user_agent`.
- **Hash SHA-256** (lowercase + trim) cho PII **phía server** trước khi rời hệ thống (node Normalize+Hash).
  - Cách 1: `require('crypto')` — cần env `NODE_FUNCTION_ALLOW_BUILTIN=crypto`.
  - Cách 2 (**bền hơn, chạy mọi instance**): SHA-256 **thuần JS** không import — bắt buộc khi n8n dùng
    *task-runner* chặn builtin (`Module 'crypto' is disallowed`). Bản thuần JS có sẵn trong
    `automation/n8n/cinai-satellite-tracking.workflow.json` (node Normalize). Dùng `String.fromCharCode(128/0)`
    thay literal hex để tránh lỗi escape khi nhúng trong JSON workflow.
- IP + User-Agent: lấy từ header request (`x-forwarded-for`, `user-agent`) — đặt n8n sau proxy thì
  bật forward header.
- Mục tiêu **EMQ ≥ 6.5** (lý tưởng 7–8). Lead-magnet có email thật → EMQ cao sẵn.

## Lớp 4 — Deduplication

- **Một `event_id` duy nhất** cho mỗi hành động, dùng chung:
  - Browser: `fbq('track', name, data, { eventID })`
  - Server: trường `event_id` trong payload CAPI
- Quy ước id: `vc_*` (ViewContent), `lead_*` (Lead), `cta_*` (Click_CTA), `reg_<userId>`
  (CompleteRegistration), **`order_id`** (Purchase — id đơn hàng, ổn định nhất).
- Meta gộp khi trùng `event_name` + `event_id` → tránh đếm gấp đôi.

## Biến môi trường (n8n)

| Biến | Ý nghĩa |
|------|---------|
| `META_PIXEL_ID` / `META_CAPI_TOKEN` | Pixel ID + Conversions API token |
| `LARK_APP_ID` / `LARK_APP_SECRET` | App Lark (đã có trong `.env.example`) |
| `LARK_BITABLE_APP_TOKEN` / `LARK_BITABLE_TABLE_ID` | Base + bảng lưu khách |
| `NODE_FUNCTION_ALLOW_BUILTIN=crypto` | Cho phép hash SHA-256 trong Code node (bỏ qua nếu dùng SHA-256 thuần JS) |

> **Nếu instance n8n chặn `$env`** (`access to env vars denied` — bật `N8N_BLOCK_ENV_ACCESS_IN_NODE`):
> không thể dùng `{{ $env.* }}` trong node. Thay bằng **n8n credentials** (kho mã hoá, KHÔNG lộ trong
> workflow JSON):
> - *Meta CAPI Send* → credential `httpQueryAuth` (`name=access_token`, `value=<token>`); pixel id để
>   literal trong URL (công khai, không phải secret).
> - *Lark Get Token* → credential `httpCustomAuth` với `json = {"body":{"app_id":"...","app_secret":"..."}}`.
> - Gắn vào node: `authentication=genericCredentialType`, `genericAuthType=httpQueryAuth|httpCustomAuth`.
> Tạo qua MCP `n8n_manage_credentials` (action `create`). app_token/table_id Lark không phải secret →
> có thể hardcode literal trong URL node Lark Save.

## Lark Bitable — cột lưu khách

Cơ bản: `Event · Email · Name · Phone · Plan · Value(Number) · Currency · Site · UTM Campaign · Event ID · Created(CreatedTime)`.
Thêm cột tuỳ field form (CinBase có thêm `Industry · Goal · VAT Invoice`). Node Lark Save map theo **tên cột** →
chỉ cần thêm key tương ứng vào `fields{}` + tạo cột cùng tên. Tạo bảng riêng cho tracking (đừng dùng chung
bảng nurture — khác schema); tạo nhanh qua MCP `bitable_v1_appTable_create` (field `Created` type 1001
KHÔNG kèm property, n8n tự điền).

## Lead-magnet (không sang app chính)

Form submit → bắn `Lead` (hoặc `CompleteRegistration` như CinBase) → n8n gửi **Meta CAPI** + lưu Lark.
Email tài liệu/nuôi dưỡng nên tách sang skill **`lead-nurture`** (workflow riêng) thay vì nhồi vào workflow
tracking — giữ workflow tracking gọn. Tối ưu chiến dịch Meta: mục tiêu **Leads**, optimize sự kiện `Lead`.

## Ranh giới

- PII hash trước khi gửi Meta; bản rõ chỉ để gửi email + CRM nội bộ.
- Không lưu token/secret vào Lark/log; lọc trước khi ghi.
- Webhook là điểm vào, validate payload, không eval nội dung từ client.
