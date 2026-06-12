# Server / CAPI + EMQ + Dedup (Lớp 2-3-4) — meta-tracking

> Tham chiếu cho [`meta-tracking`](../SKILL.md). Cổng server-side dùng template n8n có sẵn:
> [`automation/n8n/`](../../../../automation/n8n/README.md) (`cinai-satellite-tracking.workflow.json`,
> đã validate). Có thể giao agent `mcp-n8n-integrator` để validate/triển khai.

## Lớp 2 — Conversions API qua n8n

Client `sendBeacon` → webhook n8n. Workflow tự:
`Normalize+Hash → Route by Event → (Lead → email + Lark) / (Register|Purchase → Meta CAPI + Lark)`.

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
- **Hash SHA-256** (lowercase + trim) cho PII **phía server** trước khi rời hệ thống (node Normalize+Hash
  của n8n đã làm; cần env `NODE_FUNCTION_ALLOW_BUILTIN=crypto`).
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
| `NODE_FUNCTION_ALLOW_BUILTIN=crypto` | Cho phép hash SHA-256 trong Code node |

## Lark Bitable — cột lưu khách

`Event · Email · Name · Phone · Plan · Value(Number) · Currency · Site · UTM Campaign · Event ID`.

## Lead-magnet (không sang app chính)

`Lead` (submit form) → n8n nhánh *Has Email* gửi **email tài liệu** + lưu Lark; không cần app chính.
Tối ưu chiến dịch Meta: mục tiêu **Leads**, optimize sự kiện `Lead`.

## Ranh giới

- PII hash trước khi gửi Meta; bản rõ chỉ để gửi email + CRM nội bộ.
- Không lưu token/secret vào Lark/log; lọc trước khi ghi.
- Webhook là điểm vào, validate payload, không eval nội dung từ client.
