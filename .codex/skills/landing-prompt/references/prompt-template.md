# Mẫu prompt landing page (điền-vào-chỗ-trống)

> Đây là khung prompt đầu ra của skill `landing-prompt`. Điền các trục A–I đã chốt ở Pha 1–2.
> Các phần để trong `[...]` là chỗ điền; phần "Mặc định:" dùng khi người dùng không chỉ định.

---

## KHỐI PROMPT (copy phần dưới đây cho AI dựng landing)

```
# VAI TRÒ
Bạn là [full-stack developer + conversion copywriter + UI/UX designer]. Hãy kết hợp UI/UX,
copywriting và frontend code để tạo một landing page tối ưu chuyển đổi.

# A. BỐI CẢNH & MỤC TIÊU
- Sản phẩm/dịch vụ: [..............]
- Làm cho: [tên thương hiệu / loại doanh nghiệp]
- Mục tiêu chính của trang: [thu lead / bán hàng / đặt lịch tư vấn / tải tài liệu / đăng ký dùng thử / branding / tuyển dụng / ra mắt sản phẩm]
- Hành động mong muốn của user (CTA): [điền form / bấm nút Zalo / mua ngay / đăng ký ...]

# B. ĐỐI TƯỢNG KHÁCH HÀNG
- Họ là ai: [nghề, độ tuổi, bối cảnh]
- Đau điểm: [..............]
- Mức hiểu biết / trình độ kỹ thuật: [..............]
- Đang cân nhắc gì trước khi mua: [giá / độ tin cậy / thời gian triển khai ...]

# C. THÔNG ĐIỆP CHÍNH
- USP / điểm khác biệt: [..............]
- Lợi ích chính (3–5 ý): [..............]
- Cam kết / bảo chứng: [..............]

# D. CẤU TRÚC SECTION
Mặc định (chỉnh nếu cần):
1. Hero: headline + subheadline + CTA chính
2. Vấn đề khách hàng đang gặp
3. Giải pháp của chúng tôi
4. Lợi ích chính
5. Quy trình làm việc
6. Gói dịch vụ / bảng giá
7. Case study / testimonial
8. FAQ
9. CTA cuối trang
10. Footer

# E. UI/UX
- Phong cách: [hiện đại / cao cấp / tối giản / năng động / công nghệ / thân thiện / luxury / corporate / playful]
- Mặc định: sạch, dễ đọc, nhiều khoảng trắng, hierarchy rõ ràng, CTA nổi bật,
  responsive mobile-first, ưu tiên trải nghiệm chuyển đổi, không quá nhiều hiệu ứng gây rối.

# F. YÊU CẦU KỸ THUẬT
- Stack: [HTML/CSS/JS thuần | React + Tailwind | Next.js + Tailwind | WordPress theme]
- Bắt buộc: code sạch, chia component rõ ràng, responsive mobile-first, tối ưu SEO cơ bản,
  tối ưu tốc độ tải, semantic HTML, alt text cho ảnh, form có validation cơ bản.

# G. NỘI DUNG
[ Mặc định: Hãy tự viết nội dung tiếng Việt giọng chuyên nghiệp, dễ hiểu, thuyết phục,
  không sáo rỗng; tập trung vào lợi ích kinh doanh, không chỉ mô tả tính năng. ]
[ Hoặc: Dưới đây là nội dung có sẵn, hãy sắp xếp lại cho hợp lý: ...... ]

# H. MÀU SẮC / FONT / HÌNH ẢNH
- Màu chủ đạo: [vd: xanh navy + trắng + xanh lá nhấn]
- Font: [hiện đại, dễ đọc / cụ thể]
- Hình ảnh: dùng placeholder có mô tả rõ để sau thay bằng ảnh thật.

# I. ĐỊNH DẠNG ĐẦU RA
[ 1 file HTML duy nhất | tách index.html + style.css + script.js | 1 file LandingPage.jsx | WordPress theme ]

# QUY TRÌNH
Trước khi code, hãy đề xuất WIREFRAME + cấu trúc nội dung từng section + rationale thiết kế.
Sau khi tôi duyệt mới viết code.
```

---

## Ghi chú khi điền

- **Trục bắt buộc** (A mục tiêu, B đối tượng, C thông điệp, F stack, I định dạng): không để trống — nếu user
  chưa cung cấp thì **hỏi**, không bịa.
- **Trục tuỳ chọn** (D, E, G, H): nếu trống thì dùng "Mặc định" trong khối và nói rõ cho người dùng.
- Nếu user muốn **code thẳng không qua wireframe** → bỏ phần "# QUY TRÌNH" cuối và yêu cầu trả full code luôn.
- Khi bàn giao sang `$clone-template` hoặc bước triển khai UI: dùng cùng khối ngữ cảnh A–I này làm định hướng
  phong cách + nội dung + mục tiêu chuyển đổi.
