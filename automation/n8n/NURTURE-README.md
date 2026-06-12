# Template tự động: Lead Nurture Email Sequence → CinAI (n8n)

> Chuỗi email nuôi dưỡng kéo traffic lạnh quay lại **cinai.tv**. **Nội dung email + thông tin sản
> phẩm + kịch bản quà tặng được CẬP NHẬT TRÊN LARK** — sửa trên Lark là email đổi theo, KHÔNG đụng n8n.
>
> File workflow: [`cinai-nurture-sequence.workflow.json`](cinai-nurture-sequence.workflow.json)
> (đã validate qua n8n MCP: `valid: true`, 0 lỗi).

## Luồng

```
Landing tặng quà (Name + Email)
   │  POST → n8n /webhook/cinai-nurture
   ▼
Webhook → Normalize → Lark Token → Lark Save Lead → Lark Get Content → Build Emails
   → 📧 Email 0 (ngay)
   → ⏳ Wait +1d 9:00 → ❓Đã đăng ký? ─có→ Stop ─không→ 📧 Email 1
   → ⏳ Wait +2d 9:00 → ❓Đã đăng ký? ─có→ Stop ─không→ 📧 Email 2  (mốc ~ngày 3)
   → ⏳ Wait +7d 9:00 → ❓Đã đăng ký? ─có→ Stop ─không→ 📧 Email 3  (hàng tuần)
```

- **Wait** dùng `specificTime` = `$now.plus({days:N}).set({hour:9})` → luôn gửi **9:00 sáng** (giờ vàng).
- **IF "Đã đăng ký?"** gọi `CINAI_CHECK_URL?email=…` → nếu `registered:true` thì **dừng** (đã chuyển đổi).
- Nội dung lấy từ **Lark Content table**; thiếu thì dùng bản DEFAULT trong node *Build Emails*.

## 1. Cài đặt

1. Import `.workflow.json` vào n8n → **Activate** → webhook `https://<n8n>/webhook/cinai-nurture`.
2. Bật `NODE_FUNCTION_ALLOW_BUILTIN=crypto` (nếu dùng chung hash với workflow tracking).
3. Cấu hình **SMTP credential** cho các node Email (hoặc thay SendGrid/Mailgun).
4. Landing form bắn về webhook này (xem mục 5).

## 2. Biến môi trường

| Biến | Ý nghĩa |
|------|---------|
| `LARK_APP_ID` / `LARK_APP_SECRET` | App Lark |
| `LARK_BITABLE_APP_TOKEN` | Base (app) chứa 2 bảng dưới |
| `LARK_LEADS_TABLE_ID` | Bảng **Leads** (lưu khách) |
| `LARK_CONTENT_TABLE_ID` | Bảng **Email Content** (nội dung email — sửa ở đây) |
| `CINAI_CHECK_URL` | API kiểm tra đã đăng ký: `https://app.cinai.tv/api/leads/status` (trả `{"registered":true/false}`) |

> Chưa có API check? Cứ để trống → mọi lead coi như chưa đăng ký (chuỗi chạy đủ). Hoặc thay bằng
> 1 node Lark đọc cột `Registered` mà app cập nhật.

## 3. Lark — 2 bảng cần tạo

### Bảng **Leads** (`LARK_LEADS_TABLE_ID`)
Cột: `Name · Email · Gift · Campaign · Status · Source` (đều Text trừ tùy chọn).

### Bảng **Email Content** (`LARK_CONTENT_TABLE_ID`) — **NƠI BẠN SỬA NỘI DUNG**
Mỗi dòng = 1 email của 1 chiến dịch:

| Cột | Kiểu | Ví dụ |
|-----|------|-------|
| `Step` | Text | `email_0` / `email_1` / `email_2` / `email_3` |
| `Campaign` | Text | `nurture_default` (khớp `utm_campaign`/`campaign` gửi vào) |
| `Subject` | Text | dùng `{{name}}` để cá nhân hoá |
| `Body` | Text (HTML) | nội dung, có thể chứa `{{name}}` |
| `CTA Text` | Text | `Dùng thử CinAI miễn phí` |
| `CTA Path` | Text | `/signup` (n8n tự nối domain `cinai.tv` + UTM) |

> Khi `Build Emails` chạy: lấy dòng khớp `Campaign`, thay `{{name}}`, **tự dựng nút CTA** trỏ
> `https://cinai.tv{CTA Path}?utm_source=n8n_email&utm_medium=email&utm_campaign={campaign}&utm_content={step}&email=…`
> + tự thêm footer **Huỷ nhận (unsubscribe)**.

## 4. Nội dung mẫu (seed) — dán vào bảng Email Content

> Bản gợi ý, chỉnh theo sản phẩm/quà của bạn. Bám công thức: **Subject gây tò mò + cá nhân hoá →
> Body bám nỗi đau → CTA về cinai.tv**.

**email_0 (gửi ngay — trao quà):**
- Subject: `Quà của bạn đây, {{name}} 🎁`
- Body: `Chào {{name}}, đây là [tên quà/tài liệu] bạn vừa nhận. Mẹo: dùng kèm CinAI để biến nó thành kết quả thật chỉ trong vài phút.`
- CTA Text: `Mở CinAI & dùng thử` · CTA Path: `/signup`

**email_1 (+1 ngày — khơi nỗi đau):**
- Subject: `{{name}} ơi, còn mất hàng giờ cho việc này?`
- Body: `Làm [nội dung/video/...] thủ công vừa chậm vừa tốn. CinAI giúp bạn rút ngắn còn vài phút — không cần kỹ năng phức tạp.`
- CTA Text: `Xem CinAI làm thay bạn` · CTA Path: `/signup`

**email_2 (+3 ngày — bằng chứng + thúc giục):**
- Subject: `Người khác đã làm được rồi đấy, {{name}}`
- Body: `Nhiều người dùng đã tiết kiệm tới 80% thời gian nhờ CinAI. Bạn chỉ cần thử 1 lần để thấy khác biệt. (Có thể kèm ưu đãi giới hạn).`
- CTA Text: `Tạo sản phẩm đầu tiên` · CTA Path: `/signup`

**email_3 (hàng tuần — mẹo + nhắc nhẹ):**
- Subject: `Mẹo tuần này cho {{name}}`
- Body: `Một mẹo nhỏ giúp bạn khai thác CinAI tốt hơn: [tip]. Đăng nhập để áp dụng ngay.`
- CTA Text: `Vào CinAI` · CTA Path: `/signup`

## 5. Snippet bắn lead từ landing tặng quà

```html
<form id="gift-form">
  <input name="name"><input name="email" type="email" required>
  <label><input type="checkbox" name="consent" required> Đồng ý nhận email</label>
  <button>Nhận quà</button>
</form>
<script>
document.getElementById('gift-form').addEventListener('submit', function(e){
  e.preventDefault(); if(!e.target.consent.checked) return;
  var qs=new URLSearchParams(location.search);
  fetch("https://<n8n>/webhook/cinai-nurture",{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ name:e.target.name.value, email:e.target.email.value,
      gift:'voucher_thang10', campaign: qs.get('utm_campaign')||'nurture_default',
      utm_source: qs.get('utm_source')||'fb' })});
  window.location='/cam-on';
});
</script>
```
> Có thể bắn **song song** webhook tracking (`/cinai-track`, sự kiện `Lead`) để vừa nuôi dưỡng vừa
> gửi CAPI — xem skill `meta-tracking`.

## 6. Lặp "hàng tuần" cho email_3 (tuỳ chọn)

Nối output **Email 3 → Wait +7d 9AM** (tạo vòng lặp). IF "Đã đăng ký?" sẽ tự dừng khi khách chuyển đổi.
Nên thêm cột `Week Count` + IF chặn tối đa (vd 4–6 tuần) để tránh gửi vô hạn.

## 7. Chiến lược tối ưu (chống spam + uy tín)

- **Xác thực domain mail**: bật **SPF + DKIM + DMARC** cho domain gửi (vd `mail.cinai.tv`); dù
  email dịch vụ (SES/SendGrid/Postmark) thay vì SMTP tự dựng.
- **Warm-up** domain/IP mới: tăng dần lượng gửi vài tuần đầu.
- **Tránh spam**: 1 CTA chính/email, ít link, không từ "bẫy spam", có **unsubscribe** thật (đã chèn
  footer), text/HTML cân đối, không đính kèm nặng.
- **Giờ vàng 9:00** (đã cấu hình Wait) + giãn cách hợp lý (ngay/+1/+3/tuần).
- **Tham số truyền**: luôn gửi `name,email,campaign,utm_*` vào webhook để cá nhân hoá + đo GA4.
- **Đo lường**: theo dõi Open Rate (subject), CTR (CTA→cinai.tv qua UTM), tỉ lệ chuyển đổi
  (IF "đã đăng ký" dừng luồng) trên GA4 + Lark.

## Ranh giới

- Chỉ gửi cho người đã **đồng ý** (consent ở form); có unsubscribe.
- Không lưu secret vào Lark; coi payload webhook là dữ liệu không tin cậy.
