# Template tự động: Tracking Landing Vệ Tinh → CinAI (n8n)

> Workflow tái dùng cho **mọi landing vệ tinh** trỏ về `cinai.tv`. Build landing mới chỉ cần
> **nhúng 1 snippet** + trỏ về cùng webhook — KHÔNG dựng lại luồng.
>
> File workflow: [`cinai-satellite-tracking.workflow.json`](cinai-satellite-tracking.workflow.json)
> (đã validate qua n8n MCP: `valid: true`).

## Luồng

```
Landing (intro.cinai.tv / landing vệ tinh khác)
   │  beacon POST  →  n8n Webhook /webhook/cinai-track
   ▼
[Webhook] → [Normalize + Hash] → [Route by Event] ┬─ Lead ──► [Has Email?] ─yes─► [Send Email] ─┐
                                                  │                          └─no──────────────┤
                                                  ├─ CompleteRegistration ─► [Build CAPI] ─►[Meta CAPI]┐
                                                  ├─ Purchase ─────────────► [Build CAPI] ─►[Meta CAPI]┤
                                                  └─ other ─────────────────────────────────────────────┤
                                                                                                         ▼
                                                                          [Lark Get Token] → [Lark Save Record]
```

- **Mọi event** (PageView/ViewContent/Scroll/Lead/CompleteRegistration/Purchase…) → gửi **Meta CAPI** (đo lường + dedup).
- **Chỉ** `Lead` / `CompleteRegistration` / `Purchase` → lưu **Lark Bitable** (CRM sạch, không phình bởi PageView/Scroll).
- Event khác (PageView/ViewContent/Scroll/click) chỉ lên CAPI, **không** ghi Lark.

## 1. Cài đặt n8n

1. Import file `.workflow.json` vào n8n (**Workflows → Import from File**).
2. **Bật builtin crypto** cho Code node (hash SHA-256): đặt biến môi trường khi chạy n8n
   `NODE_FUNCTION_ALLOW_BUILTIN=crypto`.
3. Cấu hình **credential SMTP** cho node *Send Welcome Email* (hoặc thay bằng node SendGrid/Mailgun).
4. **Activate** workflow → URL webhook dạng: `https://<n8n-domain>/webhook/cinai-track`.

## 2. Biến môi trường (Settings → Variables hoặc env)

| Biến | Ý nghĩa |
|------|---------|
| `META_PIXEL_ID` | ID Pixel/Dataset của CinAI |
| `META_CAPI_TOKEN` | Conversions API access token |
| `LARK_APP_ID` / `LARK_APP_SECRET` | App Lark (đã có trong `.env.example` của project) |
| `LARK_BITABLE_APP_TOKEN` | App token của Bitable (base) lưu khách |
| `LARK_BITABLE_TABLE_ID` | Table ID trong base đó |

> Lark dùng domain `open.larksuite.com`. Nếu bạn dùng Feishu (TQ) → đổi sang `open.feishu.cn` trong 2 node Lark.

## 3. Lark Bitable — cột cần tạo

Tạo 1 bảng với các cột (đúng tên, kiểu Text/Number):
`Event` · `Email` · `Name` · `Phone` · `Plan` · `Value` (Number) · `Currency` · `Site` ·
`UTM Campaign` · `Event ID`.

## 4. Snippet nhúng vào MỌI landing vệ tinh

Dán vào landing (sau Meta Pixel). Đổi `N8N_WEBHOOK` + `SITE`. Phần còn lại tự chạy cho mọi trang.

```html
<script>
const N8N_WEBHOOK = "https://<n8n-domain>/webhook/cinai-track";
const SITE = location.hostname; // vd intro.cinai.tv

function gc(n){return document.cookie.split('; ').find(r=>r.startsWith(n+'='))?.split('=')[1]||'';}
function uid(p){return p+'_'+(crypto.randomUUID?crypto.randomUUID():Date.now()+'_'+Math.random().toString(36).slice(2,8));}
const qs = new URLSearchParams(location.search);
function base(extra){
  return Object.assign({
    site: SITE, event_source_url: location.href,
    fbp: gc('_fbp'), fbc: gc('_fbc'),
    utm_source: qs.get('utm_source')||'', utm_medium: qs.get('utm_medium')||'',
    utm_campaign: qs.get('utm_campaign')||'', utm_content: qs.get('utm_content')||'',
    utm_term: qs.get('utm_term')||''
  }, extra||{});
}
function track(p){ navigator.sendBeacon(N8N_WEBHOOK, new Blob([JSON.stringify(p)],{type:'application/json'})); }

// 1) Lead khi vào landing (kèm email nếu form đã có)
track(base({ event_name:'Lead', event_id: uid('lead') }));

// 2) (Tuỳ chọn) khi user nhập email vào form landing
// document.querySelector('#email-form')?.addEventListener('submit', e=>{
//   track(base({ event_name:'Lead', email: e.target.email.value, name: e.target.name?.value }));
// });

// 3) Nút CTA: gắn fbclid/utm/fbp/fbc sang cinai.tv + bắn Click_CTA
const cta = document.getElementById('cta-start');
if (cta){
  const u = new URL(cta.href);
  ['fbclid','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k=>{ if(qs.get(k)) u.searchParams.set(k, qs.get(k)); });
  u.searchParams.set('fbp', gc('_fbp')); u.searchParams.set('fbc', gc('_fbc'));
  cta.href = u.toString();
  cta.addEventListener('click', ()=> track(base({ event_name:'Lead', cta:'BatDauNgay' })));
}
</script>
```

## 5. Gọi từ `cinai.tv` (đăng ký / thanh toán) — nguồn sự thật là Backend

Backend `cinai.tv` POST về cùng webhook khi sự kiện xảy ra (đảm bảo quy gán đúng dù xảy ra sau):

```jsonc
// CompleteRegistration
{ "event_name":"CompleteRegistration", "event_id":"reg_<userId>",
  "email":"a@b.com", "phone":"+8490...", "user_id":"<userId>",
  "fbp":"fb.1...", "fbc":"fb.1...", "event_source_url":"https://cinai.tv/welcome",
  "utm_campaign":"<từ attribution đã lưu>" }

// Purchase  (event_id = order_id để dedup với Pixel /thank-you)
{ "event_name":"Purchase", "event_id":"ORDER_20260611_00123",
  "email":"a@b.com", "user_id":"<userId>", "plan":"pro_monthly",
  "value":19.00, "currency":"USD", "fbp":"fb.1...", "fbc":"fb.1..." }
```

> Node *Normalize + Hash* tự **SHA-256** email/phone/user_id thành `em/ph/external_id` (EMQ).
> IP + User-Agent lấy tự động từ header request (đặt n8n sau proxy thì bật forward `x-forwarded-for`).

## 6. Test

1. **Test Events (Events Manager)**: bỏ comment `test_event_code` trong node *Build CAPI Payload* → gửi thử Purchase → kiểm event hiện + có `value/currency` + dedup theo `event_id`.
2. **n8n Executions**: xem từng execution, kiểm `Normalize + Hash` ra đúng `user_data` đã hash.
3. **Lark**: kiểm bản ghi mới xuất hiện trong Bitable.
4. **Email**: kiểm hộp thư nhận mail chào mừng khi gửi `Lead` có `email`.

## Tái dùng cho landing vệ tinh mới

Chỉ 2 việc: (1) nhúng snippet ở mục 4 (đổi `SITE` nếu muốn), (2) trỏ nút CTA về `cinai.tv`.
**Không cần** đụng vào n8n nữa — cùng webhook, cùng workflow, dữ liệu tự gắn `site` để phân biệt nguồn.

## Ranh giới / an toàn

- Không log secret/token vào Lark; chỉ lưu dữ liệu khách cần thiết.
- PII (email/phone) được hash trước khi gửi Meta; bản rõ chỉ dùng để gửi email + lưu CRM nội bộ.
- Coi payload webhook là dữ liệu không tin cậy: Normalize lọc field, không eval nội dung.

## Triển khai thực tế — CinBase (cập nhật 2026-06-15)

Workflow đã deploy & active trên `n8n.halcion.vn`:

| Mục | Giá trị |
|-----|---------|
| Workflow | **CinBase — Satellite Landing Tracking** (id `B86AJPMPpv5QhlMj`), active |
| Webhook | `https://n8n.halcion.vn/webhook/cinai-track` |
| Meta Pixel | `2215508219251213` (literal trong URL — không phải secret) |
| Lark base | `BrUDbLn6bau8m7s41Nbjf0hopBg` |
| Lark table tracking | **CinBase Leads** `tblzX3JghstuzXnR` (cột: Event, Email, Name, Phone, Industry, Goal, VAT Invoice, Plan, Value, Currency, Site, UTM Campaign, Event ID, Created) |

**3 khác biệt so với template gốc (do đặc thù instance này):**

1. **SHA-256 thuần JS** thay `require('crypto')` — task-runner của n8n chặn builtin
   (`Module 'crypto' is disallowed`). Hàm thuần JS chạy ở mọi instance, không cần
   `NODE_FUNCTION_ALLOW_BUILTIN=crypto`.
2. **Credentials thay `$env`** — instance này bật `N8N_BLOCK_ENV_ACCESS_IN_NODE`
   (`access to env vars denied`). Token nằm trong n8n credentials (mã hoá, KHÔNG lộ trong
   workflow JSON): `Meta CAPI – CinBase` (httpQueryAuth, id `0y2s8kdkVdPBYx4g`) gắn vào *Meta CAPI Send*;
   `Lark App – CinAI` (httpCustomAuth body app_id/secret, id `F7Xm6aMEDG1ZUhu5`) gắn vào *Lark Get Token*.
   File template trong repo vẫn để `$env.*` (an toàn cho git) — instance nào cho phép `$env`
   thì dùng env như mục 2; instance khoá `$env` thì tạo credentials như trên.
3. **Beacon `text/plain`** (xem `templates/Cinbase-tvc/scripts/tracking.js`) — gửi `application/json`
   cross-origin bị CORS preflight chặn (landing ≠ domain n8n). `text/plain` là CORS-safelisted →
   request "simple", tới được webhook; node Normalize tự `JSON.parse` body chuỗi.

**Routing đã rewire (2026-06-15):** `Normalize → Build CAPI → Meta CAPI` cho **mọi** event;
`Normalize → Route by Event` chỉ cho `Lead/CompleteRegistration/Purchase` → Lark, nhánh "other"
(PageView/ViewContent/Scroll/click) **dừng** (không vào Lark). 2 node `Has Email?` + `Send Welcome Email`
đã gỡ (còn 7 node) — email do skill nurture xử lý riêng.

> Sơ đồ "Luồng" ở đầu file là bản template gốc (có nhánh email + lưu mọi event); bản CinBase live đã
> đơn giản hoá theo mô tả trên.
