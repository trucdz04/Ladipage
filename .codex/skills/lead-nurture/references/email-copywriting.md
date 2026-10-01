# Email Copywriting & Content Schema — lead-nurture

> Tham chiếu cho [`lead-nurture`](../SKILL.md). Công thức viết + 4 email mẫu + cấu trúc lưu trên Lark.
> Nội dung canonical nằm trên **Lark** (bảng *Email Content*); file này là khung + bản seed để dán vào.

## Công thức từng phần

- **Subject**: 4–7 từ, gây tò mò/lợi ích/khẩn, cá nhân hoá `{{name}}`. Tránh từ bẫy spam
  (miễn phí 100%, $$$, !!!). Mục tiêu Open Rate.
- **Body**: mở bằng tên → chạm **nỗi đau** → nêu **cách app chính giải quyết** (1 ý) → dẫn tới CTA.
  Ngắn (3–6 dòng), giọng người thật, không dông dài.
- **CTA**: 1 nút duy nhất về app chính; n8n tự gắn
  `?utm_source=n8n_email&utm_medium=email&utm_campaign={campaign}&utm_content={step}&email=…`.
- **Footer**: lý do nhận mail + link **unsubscribe** (n8n tự chèn).

## Bảng Lark "Email Content" (sửa nội dung ở đây)

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| `Step` | Text | `email_0` / `email_1` / `email_2` / `email_3` |
| `Campaign` | Text | khớp `campaign`/`utm_campaign` gửi vào webhook |
| `Subject` | Text | dùng `{{name}}` |
| `Body` | Text (HTML) | nội dung, có thể chứa `{{name}}` |
| `CTA Text` | Text | chữ trên nút |
| `CTA Path` | Text | đường dẫn app chính, vd `/signup` |

> `Build Emails` lấy dòng khớp `Campaign`, thay `{{name}}`, dựng nút CTA + UTM + footer unsubscribe.
> Thiếu dòng nào → dùng bản DEFAULT trong node (chuỗi vẫn chạy).

## 4 email seed (chỉnh theo sản phẩm/quà của bạn)

Bám: **Subject tò mò + cá nhân hoá → Body nỗi đau → cách app giải quyết → 1 CTA về app chính**.

| Step | Subject (gợi ý) | Ý chính Body | CTA Text / Path |
|------|------------------|--------------|------------------|
| email_0 (ngay) | `Quà của bạn đây, {{name}} 🎁` | Trao quà; gợi mở dùng kèm app để có kết quả thật | `Mở app & dùng thử` / `/signup` |
| email_1 (+1d) | `{{name}} ơi, còn mất hàng giờ cho việc này?` | Nỗi đau làm thủ công chậm/tốn; app rút ngắn còn vài phút | `Xem app làm thay bạn` / `/signup` |
| email_2 (+3d) | `Người khác đã làm được rồi đấy, {{name}}` | Bằng chứng/use-case; tiết kiệm thời gian; có thể kèm ưu đãi giới hạn | `Tạo sản phẩm đầu tiên` / `/signup` |
| email_3 (tuần) | `Mẹo tuần này cho {{name}}` | 1 mẹo dùng app hiệu quả + nhắc nhẹ quay lại | `Vào app` / `/signup` |

> Viết Body dạng HTML đơn giản (thẻ `<p>`). Giữ 1 CTA chính. Có thể A/B 2 Subject mỗi mốc.

## Mẹo nâng Open Rate / CTR

- Test 2–3 Subject/mốc; giữ Subject thắng.
- Preheader (dòng preview) bổ trợ Subject, không lặp lại.
- CTA động từ + lợi ích ("Tạo video đầu tiên" > "Nhấn vào đây").
- Mỗi email một mục tiêu; đừng nhồi nhiều link.

## Ranh giới

- Chỉ gửi khi có consent; unsubscribe thật; tránh nội dung gây hiểu nhầm.
- Không nhúng secret/PII nhạy cảm vào nội dung email.
