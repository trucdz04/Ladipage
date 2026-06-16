---
description: Soạn prompt landing page chuẩn theo khung A–I (làm rõ ngữ cảnh trước → wireframe → xuất prompt hoàn chỉnh) — chạy skill landing-prompt. Phân tích trước, xuất prompt sau.
---

# /landing-prompt — Soạn prompt landing page chuẩn

Brief / ý tưởng sản phẩm (kèm bất kỳ thông tin nào đã có): **$ARGUMENTS**

## Nhiệm vụ
Kích hoạt skill **`landing-prompt`** để biến brief sơ sài thành một **prompt landing page hoàn chỉnh**
theo khung A–I, qua trục **CLARIFY → DRAFT → WIREFRAME → PROMPT**: làm rõ ngữ cảnh còn thiếu TRƯỚC,
xuất prompt SAU.

## Cách làm
1. Nếu `$ARGUMENTS` trống, hỏi gọn user đang làm landing cho sản phẩm/dịch vụ gì.
2. Nêu 1 dòng: "Tôi sẽ chạy skill `landing-prompt` để soạn prompt cho <sản phẩm>."
3. Theo pipeline trong skill, tuân thủ *"một prompt = một phần; làm rõ trước, xuất sau"*:
   - **Pha 0–1**: map brief vào 9 trục A–I; hỏi các trục **bắt buộc** còn thiếu (mục tiêu KD · đối tượng ·
     thông điệp · stack · định dạng đầu ra); trục tuỳ chọn dùng mặc định + ghi rõ.
   - **Pha 2**: bảng tóm tắt ngữ cảnh để người dùng xác nhận.
   - **Pha 3**: đề xuất wireframe + cấu trúc nội dung + rationale — **người dùng duyệt**.
   - **Pha 4**: xuất prompt hoàn chỉnh (mẫu `references/prompt-template.md`).
4. Báo cáo bằng **tiếng Việt phi kỹ thuật** (tổng quan → bảng ngữ cảnh → wireframe → prompt → phase tiếp).

## Liên quan
- Dựng cả trang từ URL mẫu → `/clone-template <url>`.
- Dựng một component từ URL → `/clone-ui <url> <phần>`.
- Gắn đo lường / nuôi dưỡng lead sau khi có landing → `/tracking-setup`, `/nurture-setup`.
