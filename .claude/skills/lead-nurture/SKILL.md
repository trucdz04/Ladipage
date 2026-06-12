---
name: lead-nurture
description: Dựng chuỗi email nuôi dưỡng lead tự động trên n8n để kéo traffic lạnh quay lại app chính (đăng ký/mua). Khách để lại Tên+Email ở landing tặng quà → webhook n8n → email theo timeline (ngay → +1d → +3d → hàng tuần) gửi giờ vàng 9:00, có IF "đã đăng ký" để dừng. Nội dung email cập nhật trên Lark. Output blueprint n8n + kịch bản email + chiến lược chống spam, tiếng Việt. Dùng khi cần nuôi dưỡng lead/lead-magnet cho SaaS.
origin: Ladipage
---

# lead-nurture — Chuỗi email nuôi dưỡng kéo traffic về app chính

Biến lead lạnh (chỉ để lại Tên+Email nhận quà) thành người dùng đăng ký/mua trên app chính, bằng
chuỗi email tự động theo dòng thời gian, **gửi giờ vàng 9:00**, **dừng khi đã chuyển đổi**, và
**nội dung sửa trên Lark** (không đụng n8n).

> **Nguyên tắc:** chỉ gửi cho người **đã đồng ý** (consent), luôn có **unsubscribe**; mỗi email 1 CTA
> chính kéo về app chính, **CTA bắt buộc gắn UTM**. Báo cáo bằng **tiếng Việt phi kỹ thuật**.

## When to Use

- Có landing tặng quà/lead-magnet thu Tên+Email; cần nuôi dưỡng để kéo về app chính (vd `cinai.tv`).
- Cần chuỗi email tự động theo timeline + dừng khi lead đã đăng ký.
- Muốn marketer **sửa nội dung trên Lark** thay vì sửa workflow.

## When NOT to Use

- Cần dựng tracking Pixel/CAPI (không phải email) → skill `meta-tracking` / `/tracking-setup`.
- Chỉ gửi 1 email giao dịch đơn lẻ → dùng thẳng node Email/SMTP.

## Hạ tầng dùng sẵn

- Workflow template: [`automation/n8n/cinai-nurture-sequence.workflow.json`](../../../automation/n8n/cinai-nurture-sequence.workflow.json) (đã validate).
- Hướng dẫn cấu hình + schema Lark: [`automation/n8n/NURTURE-README.md`](../../../automation/n8n/NURTURE-README.md).
- Khớp với `meta-tracking`: sự kiện `Lead` (có email) vừa nuôi dưỡng vừa gửi CAPI.

## Blueprint n8n

```
Webhook /cinai-nurture → Normalize → Lark Token → Lark Save Lead → Lark Get Content → Build Emails
 → 📧 Email 0 (ngay)
 → ⏳ Wait +1d 9:00 → ❓Đã đăng ký? ─có→ Stop ─không→ 📧 Email 1
 → ⏳ Wait +2d 9:00 → ❓Đã đăng ký? ─có→ Stop ─không→ 📧 Email 2  (~ngày 3)
 → ⏳ Wait +7d 9:00 → ❓Đã đăng ký? ─có→ Stop ─không→ 📧 Email 3  (hàng tuần, có thể loop)
```

| Node | Cấu hình chính |
|------|----------------|
| **Webhook** | POST, path `cinai-nurture`; nhận `{name, email, gift, campaign, utm_*}` |
| **Normalize** | chuẩn hoá field, lowercase email |
| **Lark Save Lead** | tạo record bảng *Leads* (Status=`nurturing`) |
| **Lark Get Content** | đọc bảng *Email Content* → nội dung email (sửa ở đây) |
| **Build Emails** | thay `{{name}}`, dựng CTA về app chính + **UTM**, footer unsubscribe; fallback DEFAULT |
| **Wait** | `resume=specificTime`, `={{ $now.plus({days:N}).set({hour:9,minute:0,second:0}).toISO() }}` |
| **Check Registered + IF** | GET `CINAI_CHECK_URL?email=…` → `registered:true` ⇒ **Stop** |
| **Email 0–3** | `emailSend`, subject/html từ `Build Emails`, gửi tới lead |

Chi tiết kịch bản + copywriting: [`references/email-copywriting.md`](references/email-copywriting.md).

## Timeline mặc định

| Email | Thời điểm | Mục đích |
|-------|-----------|----------|
| 0 | Ngay | Trao quà + giới thiệu nhẹ app chính |
| 1 | +1 ngày (9:00) | Khơi nỗi đau → app giải quyết |
| 2 | +3 ngày (9:00) | Bằng chứng/use-case + thúc giục (ưu đãi) |
| 3 | Hàng tuần (9:00) | Mẹo + nhắc nhẹ; loop tới khi chuyển đổi (có guard) |

## Copywriting (bắt buộc)

- **Subject**: ngắn, gây tò mò, cá nhân hoá `{{name}}` — ưu tiên Open Rate.
- **Body**: ngắn gọn, bám **nỗi đau → app chính giải quyết**; 1 ý chính.
- **CTA**: 1 nút chính về app chính, **gắn UTM** `utm_source=n8n_email&utm_medium=email&utm_campaign=…&utm_content=email_N`.
- Nội dung canonical nằm trên **Lark** (bảng *Email Content*), sửa là email đổi.

## KPI

| Chỉ số | Mục tiêu |
|--------|----------|
| Open Rate | theo subject; A/B subject để nâng |
| CTR (CTA → app chính) | đo qua UTM trên GA4 |
| Conversion (đăng ký) | IF "đã đăng ký" dừng luồng = đã chuyển đổi |
| Spam/Bounce rate | thấp; theo dõi reputation domain |
| Unsubscribe rate | < 0.5%/email |

## Testing

1. Bắn thử webhook → kiểm n8n Executions: lead lưu Lark, Email 0 gửi.
2. Tạm rút Wait xuống phút để kiểm chuỗi Email 1/2/3 + IF dừng khi `registered:true`.
3. Kiểm CTA mở đúng app chính + đủ UTM (GA4 DebugView).
4. Kiểm inbox: không vào spam (SPF/DKIM/DMARC), có unsubscribe.

## Chiến lược tối ưu (chống spam + uy tín)

- SPF + DKIM + DMARC cho domain gửi; dùng email dịch vụ (SES/SendGrid/Postmark) + warm-up.
- 1 CTA/email, ít link, không từ bẫy spam, có unsubscribe thật, cân đối text/HTML.
- Giờ vàng 9:00 + giãn cách hợp lý; cá nhân hoá `{{name}}`.
- Luôn truyền `name,email,campaign,utm_*` vào webhook để cá nhân hoá + đo lường.

## Output (tiếng Việt — §5 CLAUDE.md)

1. **Tổng quan** — chuỗi đã dựng, timeline, đích kéo về.
2. **Blueprint n8n** — sơ đồ node + biểu thức Wait + IF dừng.
3. **Kịch bản email** — đủ 4 mốc (Subject/Body/CTA + UTM).
4. **Cấu hình** — env, 2 bảng Lark, SMTP, CINAI_CHECK_URL.
5. **Chiến lược tối ưu** — chống spam, reputation, đo lường.
6. **Trạng thái** — `OK`/`BLOCKED`; **Phase tiếp**.

## Ranh giới

- Chỉ gửi khi có consent; unsubscribe thật; tôn trọng GDPR/luật chống spam.
- Không lưu secret vào Lark; payload webhook coi là dữ liệu không tin cậy.
