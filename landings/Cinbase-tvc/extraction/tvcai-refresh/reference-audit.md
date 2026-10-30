# Audit tham chiếu TVCAI cho CinBase TVC

Ngày kiểm tra: **2026-10-07**  
URL nguồn: `https://tvcai.vn/`  
Phương pháp: đọc runtime bằng Chrome DevTools ở desktop và mobile; bằng chứng thô nằm trong [`dom-tree.json`](./dom-tree.json). Không sao chép bundle hoặc lưu cookie/token.

## Tóm tắt định lượng

| Mốc | Quan sát |
|---|---|
| Desktop 1440 × 900 | `scrollHeight` 15.822 px; header cố định cao 72 px; H1 44,64 px; hero tính cả rail dài khoảng 2.468 px |
| Desktop 1920 | content shell khoảng 72rem; section cách nhau khoảng 128 px; H1 khoảng 56 px; rail chồng lên hero khoảng 133 px |
| Mobile 375 × 812 | Không có tràn ngang; H1 khoảng 32/33,6 px; section padding khoảng 80 px; shell cách mép 16–20 px; rail chồng phần cuối hero |
| DOM desktop | 1.973 phần tử; 1.179 phần tử hiển thị; 13 section; 33 heading; 31 link; 158 button; 156 ảnh; 63 video; 6 `details`; 1 `dialog` |
| Tương tác được kiểm tra | 79 phần tử tương tác; hero pager; ba rail; FAQ native; dialog video |

## Design tokens quan sát được

```css
--canvas: #080b09;
--canvas-raised: #0e1310;
--surface: #121814;
--surface-strong: #18211b;
--line: rgba(238, 243, 233, 0.12);
--line-strong: rgba(238, 243, 233, 0.22);
--text: #f2f5ee;
--muted: #abb5aa;
--quiet: #7b867c;
--green: #4cdd90;
--yellow: #f5ca3f;
--danger: #f1a286;
```

- Radius chính: 8 / 14 / 22 px.
- Thang khoảng cách: 0,5 / 0,75 / 1 / 1,5 / 2 / 3rem.
- Khung nội dung: 72rem; khung media rộng: 88rem.
- Bóng hero: `0 28px 80px rgba(0, 0, 0, 0.36)`.
- Nhịp trang: nền gần đen, chữ sáng, green/yellow chỉ làm tín hiệu; rail media dày ở đầu trang rồi chuyển sang section biên tập thoáng hơn.

## Bản đồ section nguồn

1. Header cố định.
2. Hero video toàn màn hình, nội dung ở góc trái, pager dọc bên phải.
3. Rail video nổi bật chồng lên cuối hero.
4. Rail bài tập học viên.
5. Rail highlight kỹ thuật.
6. Dữ liệu/fact về chương trình.
7. Video giới thiệu.
8. Pain quote.
9. Hai panel vấn đề / giải pháp.
10. Lợi ích chương trình.
11. Quy trình 5 bước.
12. Nội dung học.
13. Phù hợp / không phù hợp.
14. Người hướng dẫn và báo chí.
15. Giá/offer.
16. FAQ.
17. CTA cuối và footer.

Trang nguồn có 13 `section` ở DOM; danh sách trên tách thêm các khối chức năng lồng trong cùng section để phục vụ thiết kế lại.

## Cấu trúc và responsive

### Header

- `position: fixed`, cao 72 px ở desktop.
- Desktop hiển thị điều hướng nội trang và CTA.
- Mobile ẩn nhóm nav dài, vẫn giữ CTA; không quan sát thấy tràn ngang ở 375 px.

### Hero + rail

- Stage cao theo viewport; media phủ toàn khung bằng crop.
- Copy neo trái phía dưới, có lớp gradient đảm bảo tương phản.
- Pager dọc neo phải; click pager đổi tiêu đề và trạng thái `aria-current`.
- Rail media bắt đầu trước khi stage kết thúc, tạo lớp chồng điện ảnh. Card desktop khoảng 259 × 346 px ở viewport 1920.
- Mobile hạ cỡ H1 xuống khoảng 32 px, copy padding `80px 52px 40px 20px`, rail còn khoảng 167 px cao.

### Section nội dung

- Desktop dùng shell giữa trang và khoảng trắng dọc lớn.
- Cặp panel hai cột tự thu về một cột ở mobile.
- FAQ dùng `details/summary`, hoạt động không phụ thuộc JavaScript.

## Hành vi đã truy vết

| Input | State | Render / hiệu ứng | Constraint |
|---|---|---|---|
| Click hero pager | đổi index hiện tại | đổi H1/subtitle, chuyển `aria-current` | chỉ một pager hiện tại |
| Click arrow rail | thay `scrollLeft` | rail dịch 213 px trong lần test | giữ snap/card width |
| Click card showcase | dialog `open=true` | hiện video và title tương ứng | đóng được trước khi mở card khác |
| Click FAQ summary | thuộc tính `open` đổi | nội dung mở/đóng native | vẫn dùng được khi JS lỗi |

Nguồn có dialog video thật; lần test mở mục “Ý TƯỞNG TRIỆU ĐÔ” và nạp media công khai. Không đưa URL media của bên tham chiếu vào bản phát hành CinBase.

## Network và dữ liệu

- Nội dung chính được dựng ở client/runtime với lượng media lớn.
- Quan sát một request `/api/events` trả `400`; đây là endpoint analytics của trang nguồn, không thuộc luồng chính và không được tái sử dụng.
- Không quan sát được backend quản trị, database hoặc quy trình agent từ landing. Các phần này phải ghi là **KHÔNG CÓ / KHÔNG CHẮC CHẮN** thay vì suy đoán.

## Phát hiện theo mức độ

### CRITICAL

- **Không có lỗi CRITICAL được xác nhận** trong các breakpoint đã kiểm tra: không thiếu section runtime, không vỡ layout và không có tràn ngang tại 375 px.

### MAJOR

- **Rủi ro tải media nếu sao chép nguyên trạng:** DOM có 156 ảnh và 63 video. Nếu bản CinBase đưa toàn bộ media vào tải đầu trang, LCP và dữ liệu di động sẽ tăng mạnh. Cách xử lý: poster cục bộ đã tối ưu, video `preload="none"`, chỉ gắn `src` cho video đang hoạt động/được người dùng yêu cầu.
- **Mật độ DOM và tương tác cao:** 1.973 node và 79 điểm tương tác làm clone nguyên xi khó bảo trì. Cách xử lý: rút landing về khoảng 11–12 khối, gộp các rail lặp, giữ HTML tĩnh cho nội dung chính.
- **Analytics nguồn lỗi `400`:** không chặn nội dung nhưng cho thấy luồng ghi sự kiện nguồn không đáng để sao chép. Cách xử lý: giữ tracking CinBase hiện có, không gọi endpoint nguồn.

### MINOR

- **Pager mobile sát mép phải:** tại 375 px pager bắt đầu quanh x=345, vùng tương tác dễ chật. Cách xử lý: bản đích đảm bảo hit area tối thiểu 44 × 44 px và khoảng cách mép an toàn.
- **Nhiều rail làm tăng số lần tab bàn phím:** card/button dày đặc có thể kéo dài hành trình focus. Cách xử lý: chỉ dùng 24 skill tuyển chọn, arrow điều khiển rõ, focus ring dễ thấy và bộ lọc có `aria-pressed`.
- **Quy mô heading biến thiên lớn:** h2 quan sát từ 16,8 đến 56,8 px. Cách xử lý: chuẩn hóa type scale trong token đích, chỉ dùng khác biệt rõ cho hero/section label.

## Những gì nên học, không sao chép máy móc

- Học: hero điện ảnh, rail chồng lớp, nhịp nền tối + điểm màu, section dài theo câu chuyện, FAQ native.
- Điều chỉnh theo CinBase: nội dung TVC + đào tạo AI, asset CinAI có quyền sử dụng, 24 Skills thật và CTA tư vấn thống nhất.
- Không sao chép: logo, nội dung người hướng dẫn, báo chí, video/hình ảnh độc quyền của TVCAI, bundle minify và endpoint analytics nguồn.

