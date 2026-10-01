---
name: fcb-copywriting
description: Thiết kế cấu trúc section và viết copy landing page theo ma trận FCB, tâm lý khách hàng và quy trình CRO 5 bước. Dùng khi cần tạo hoặc nâng cấp thông điệp chuyển đổi; không dùng để build UI, clone trang hoặc triển khai tracking.
---

# fcb-copywriting — Landing chuyển đổi cao bằng FCB + Tâm lý học

Skill này biến một brief thành **chiến lược content + cấu trúc section + copy** theo **hành trình tâm lý**
của khách hàng, thay vì áp một bố cục cố định cho mọi sản phẩm.

> **Nguồn phương pháp:** quy trình SOP "Landing Page Chuyển Đổi Cao — FCB & Tâm lý học" của **Bui Huu Duc**
> (tài liệu nội bộ) + Ma trận **FCB (Foote, Cone & Belding, 1980)** và các nguyên lý tâm lý học công khai.
> Skill này **operationalize phương pháp để dùng nội bộ trong project**, **không** tái phát hành tài liệu gốc.
>
> **Nguyên tắc vàng (theo AGENTS.md):** *"Phân tích TRƯỚC, viết SAU."* KHÔNG viết copy khi chưa qua
> Bước 1→3. Mỗi section viết riêng một lượt. Báo cáo bằng **tiếng Việt phi kỹ thuật**.

## When to Use

- Cần một landing/section **thuyết phục theo tâm lý**, không chỉ "đẹp" — muốn tối ưu tỷ lệ chuyển đổi.
- Đã có brief (từ [[landing-prompt]]) và muốn **quyết định thứ tự section + giọng copy** dựa trên loại sản phẩm.
- Cần **nâng cấp/CRO review** một landing đã có (chạy thẳng Bước 5).
- Trước khi dựng bằng `$clone-template` hoặc triển khai UI — để có "bản đồ tâm lý + copy" làm input.

## When NOT to Use

- Chỉ cần khung brief A–I, chưa cần tâm lý chuyên sâu → dùng [[landing-prompt]] trước.
- Chỉ cần clone một trang có sẵn → `$clone-template`.
- Chỉ cần gắn đo lường / nuôi dưỡng lead → `$meta-tracking`, `$lead-nurture`.

## How It Works — 5 bước có cổng (không bỏ bước, không đảo thứ tự)

```
Brief (từ landing-prompt) ──┐
                            ▼
1. FCB CLASSIFY    Phân loại sản phẩm → góc 1/2/3/4 + hành trình tâm lý + %Think/%Feel   [cổng]
2. PSYCHOLOGY MAP  3 tầng nỗi đau · dream outcome · rào cản · trigger · NGÔN NGỮ khách    [cổng]
3. STRUCTURE       Thứ tự section theo hành trình + nguyên lý tâm lý mỗi section          [cổng]
─────────────────────────── CHỈ qua 1–3 mới VIẾT COPY ───────────────────────────
4. COPY (per section)  Mỗi section 1 lượt: 3 headline + body + 3 CTA + self-check + cấm-chữ
5. CRO REVIEW      Người KHÁC review: điểm mạnh · lỗi giết chuyển đổi · ưu tiên sửa · điểm/10
─────────────────────────── Bàn giao dựng trang ───────────────────────────
→ clone-template / clone-ui (BUILD)  → tracking-setup (đo lường)  → publish checklist (Phụ lục)
```

**Cổng giữa các bước:** xác nhận xong output bước trước mới sang bước sau (xem checklist mỗi bước trong
[references/prompts-and-rules.md](references/prompts-and-rules.md)).

## Tài nguyên skill

- **[references/fcb-framework.md](references/fcb-framework.md)** — ma trận FCB 4 góc + hành trình, bảng
  **Section × Góc FCB**, bảng tra nhanh **FCB × Section × Trigger**, và 8 nguyên lý tâm lý học kèm cách dùng.
- **[references/prompts-and-rules.md](references/prompts-and-rules.md)** — 5 prompt chạy được cho Bước 1→5,
  **quy tắc cấm chữ sáo rỗng** (mỗi câu phải có lý do tồn tại), và **checklist publish** (chiến lược · kỹ thuật · pre-traffic).

## Tích hợp pipeline marketing-automation

```
landing-prompt (brief A–I)  →  fcb-copywriting (chiến lược + cấu trúc + copy)  →
clone-template / clone-ui (BUILD)  →  tracking-setup (Pixel+CAPI 4 lớp)  →  nurture-setup (nếu lead-magnet)
```

Khi làm cho **CinAI.tv**: lấy giá từ `templates/_shared/cinai-pricing.md` (source of truth) cho section pricing.

## Output cho người dùng (tiếng Việt)

1. **Tổng quan** — sản phẩm rơi vào góc FCB nào, hành trình tâm lý, tỉ lệ lý trí/cảm xúc.
2. **Bản đồ tâm lý** — 3 tầng nỗi đau, dream outcome, rào cản, trigger, ngôn ngữ khách hàng.
3. **Cấu trúc section** — thứ tự + mục tiêu tâm lý + nguyên lý áp dụng mỗi section + **conversion hinge**.
4. **Copy** — từng section (headline/body/CTA) đã qua self-check + không vi phạm cấm-chữ.
5. **Điểm CRO + ưu tiên sửa** — và phase tiếp theo (BUILD → tracking → publish).

## Checklist hoàn thành

- [ ] **Bước 1**: chốt góc FCB (1/2/3/4) + hành trình (Learn→Feel→Do / …) + %Think-%Feel.
- [ ] **Bước 2**: đủ 3 tầng nỗi đau + dream outcome (ngoài/trong/xã hội) + ≥6 rào cản + ngôn ngữ khách (dùng/tránh).
- [ ] **Bước 3**: thứ tự section khớp hành trình; xác định **conversion hinge**; mỗi section ghi rõ nguyên lý tâm lý.
- [ ] **Bước 4**: mỗi section có copy hoàn chỉnh + self-check; **không cụm từ bị cấm**; viết từ góc nhìn "Bạn".
- [ ] **Bước 5**: đã có người (không phải người viết) CRO review; xử lý hết lỗi nghiêm trọng.
- [ ] CTA chính xuất hiện ≥3 lần; có ≥1 social proof mạnh; risk reversal rõ; hero hiểu được trong 5 giây.

## Ranh giới (tuân thủ)

- Skill chỉ tạo **chiến lược + cấu trúc + copy**; **không tự deploy/build** — bàn giao cho `$clone-template` hoặc bước triển khai UI.
- Tôn trọng bản quyền nguồn: dùng **nội bộ**, ghi nguồn, không tái phát hành tài liệu SOP gốc ra ngoài.
- Mọi tuyên bố FOMO/khan hiếm/social-proof phải **có số liệu thật** — không bịa con số.
