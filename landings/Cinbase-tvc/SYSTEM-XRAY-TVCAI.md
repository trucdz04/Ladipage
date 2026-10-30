# SYSTEM X-RAY — TVCAI → CinBase TVC

Ngày tổng hợp: **2026-10-07**  
Trang nguồn: `https://tvcai.vn/`  
Trang đích: `landings/Cinbase-tvc/`

Tài liệu này mô tả những gì đã truy vết được từ runtime và hồ sơ extraction. Không suy đoán backend hay database không nhìn thấy.

## 1. Hệ thống làm gì?

TVCAI là một landing dài để bán chương trình học làm phim AI. Cách thuyết phục chính:

`xem ngay sản phẩm mẫu → nhận ra vấn đề → hiểu chương trình → xem quy trình/nội dung → cân nhắc offer → đọc FAQ → hành động`

Bản CinBase dùng cấu trúc thuyết phục tương tự nhưng thay toàn bộ nội dung/asset bằng hệ CinBase và CinAI:

- Hero cho thấy năng lực video trước khi giải thích.
- Thư viện 24 CinAI Skills chứng minh có nhiều ngách ứng dụng thật.
- Các section sau chuyển từ cảm xúc sang quy trình, kết quả, phạm vi và tư vấn.

## 2. Bản đồ hệ thống

```text
[Người xem]
    |
    v
[Header + CTA] ---------> [Form/kênh tư vấn CinBase]
    |
    v
[Hero video + pager] ---> [Rail case study]
    |
    v
[24 Skills có filter] ---> [cinai.tv/explore]
    |
    v
[Vấn đề/Giải pháp] -> [Product tour] -> [Chương trình/Quy trình]
    |
    v
[Phạm vi/Offer] -> [FAQ] -> [CTA cuối]
```

Ba lớp tách biệt:

1. **Nội dung tĩnh:** HTML semantic để đọc được ngay và hỗ trợ SEO.
2. **Tương tác nhẹ:** JavaScript cho hero, rail, filter, menu và progressive enhancement.
3. **Media ngoài:** video chỉ tải khi cần; poster quan trọng nằm cục bộ.

## 3. Luồng thực thi thật

### TVCAI nguồn

```text
Mở trang
  -> HTML/CSS/JS dựng giao diện
  -> browser tải ảnh/poster
  -> người dùng chọn pager/card
  -> state UI đổi
  -> video tương ứng được gắn/phát
  -> sự kiện analytics có thể gửi tới /api/events
```

Ví dụ input/output đã quan sát:

- Input: click pager hero thứ hai.
- Output: H1 đổi từ “HỌC LÀM PHIM AI TOÀN DIỆN” sang “MỘT MIẾNG HOTEL”; dot thứ hai nhận `aria-current="true"`.
- Input: click mũi tên rail.
- Output: `scrollLeft` tăng 213 px.
- Input: click FAQ.
- Output: thuộc tính `open` đổi từ `false` sang `true`.
- Input: click card showcase.
- Output: dialog mở và video tương ứng xuất hiện.

### CinAI Skills

```text
GET /api/entities/public/agent-skills
  -> danh sách 1.143 skill đang bật
  -> chọn 24 skill theo ngách
  -> lưu ảnh card cục bộ
  -> render HTML tĩnh + filter phía client
```

Ví dụ output rút gọn, đã lọc dữ liệu nhạy cảm:

```json
{
  "id": "6a9cd92f73265eba1f000001",
  "slug": "ugc-ad-x10",
  "name": "UGC Product Ad x10",
  "category": "marketing"
}
```

Backend xử lý endpoint và nơi lưu dữ liệu: **KHÔNG CHẮC CHẮN**.

## 4. Luồng agent/tool

### Trong landing TVCAI

- Agent AI chạy trực tiếp trong landing: **KHÔNG CÓ bằng chứng**.
- Tool gọi model/AI từ landing: **KHÔNG CÓ bằng chứng**.
- Landing chủ yếu là giao diện nội dung, media và CTA.

### Trong dữ liệu CinAI Skills

- Tên/mô tả cho biết Skills là các tác vụ agent dựng sẵn.
- Luồng nội bộ `task → agent → tool → result`: **KHÔNG CHẮC CHẮN**, vì không được thực thi trong landing và không có network trace chi tiết.
- Bản CinBase chỉ giới thiệu skill và đưa người dùng sang Explore; không giả lập việc chạy agent.

## 5. ERD cơ sở dữ liệu

Database của TVCAI: **KHÔNG CÓ bằng chứng runtime**. Không dựng ERD giả.

Từ payload công khai CinAI chỉ có thể nhận ra các thực thể hiển thị sau, nhưng quan hệ lưu trữ thật vẫn **KHÔNG CHẮC CHẮN**:

```text
[Public User/Author]
       1 ?
       |
       * ?
[Agent Skill] ----> [Public media URL]
```

- `Agent Skill`: có id, slug, name, category, usage count và media.
- `Public User/Author`: endpoint công khai nhận danh sách id tác giả.
- Dấu `?` nhấn mạnh đây là quan hệ suy từ payload hiển thị, không phải schema database đã xác nhận.

## 6. Bản đồ API

| Endpoint | Mục đích quan sát được | Ví dụ input | Ví dụ output |
|---|---|---|---|
| `GET https://api.cinai.tv/api/entities/public/agent-skills` | Lấy danh sách Skills công khai | Không body | Danh sách có id/slug/name/category/media |
| `GET https://api.cinai.tv/api/entities/public/users?ids={ids}` | Lấy thông tin tác giả công khai theo id | `ids=id1,id2` | Dữ liệu hồ sơ công khai; cấu trúc đầy đủ không lưu trong artifact |
| `POST /api/events` trên TVCAI | Ghi analytics nguồn | Payload không lưu | Quan sát response `400` trong một lần chạy |

Không có API form, thanh toán, LMS hay CRM nào được truy vết chắc chắn từ landing nguồn.

## 7. Vấn đề và vì sao

### CRITICAL

- Chưa phát hiện lỗi CRITICAL trong runtime đã kiểm tra.

### MAJOR

- **Media quá dày nếu clone nguyên trạng:** 156 ảnh + 63 video có thể làm lần tải đầu nặng. Nguyên nhân là nhiều rail/case study cùng tồn tại trong DOM.
- **DOM lớn:** 1.973 phần tử làm thay đổi bố cục và QA khó hơn. Nguyên nhân là section dài, nhiều button/card lặp.
- **Endpoint analytics trả 400:** sự kiện có thể mất dù nội dung vẫn chạy. Nguyên nhân cụ thể **KHÔNG CHẮC CHẮN** vì không lưu payload riêng tư.

### MINOR

- Pager hero ở mobile sát mép; cần hit area 44 px và safe inset.
- Hành trình focus dài do nhiều control; bản đích nên giảm số rail và card.
- Type scale nguồn biến thiên lớn; bản đích cần token typography ổn định.

## 8. Lộ trình rebuild

1. **Fix:** thay poster hero remote bằng ảnh WebP cục bộ; chỉ nạp video hiện tại; thêm pause và vùng chạm 44 px.
2. **Refactor:** gom landing còn khoảng 11–12 section; bỏ các handler/component không có markup thật.
3. **Architecture:** HTML/CSS/JS tĩnh, design token chung, mỗi controller quản lý một vùng rõ ràng.
4. **Agent/data:** 24 Skills render tĩnh từ catalog đã kiểm chứng; filter chỉ làm progressive enhancement; không gọi API lúc tải trang.
5. **Performance:** lazy image, `preload="none"` cho video, IntersectionObserver, tôn trọng `prefers-reduced-motion`.
6. **Production:** kiểm console/network, keyboard, reduced motion và screenshot 375/768/1024/1440; ghi diff còn lại trước khi phát hành.

## 9. Flowchart sử dụng thật

Landing này không phải ứng dụng TODO và không có CRUD task. Flow thật đã truy vết:

```text
[Người dùng mở landing]
          |
          v
[Xem hero/video mẫu] --chọn pager--> [Đổi case study]
          |
          v
[Duyệt Skills] --lọc nhóm--> [Danh sách phù hợp]
          |                         |
          |                         +--xem toàn bộ--> [cinai.tv/explore]
          v
[Đọc chương trình/quy trình/FAQ]
          |
          v
[Click CTA tư vấn]
          |
          v
[Kênh liên hệ CinBase]
```

Flow TODO mẫu `tạo → lưu DB → cập nhật → xóa`: **KHÔNG CÓ trong hệ thống này**, nên không dựng API hoặc database giả.

## Nguồn bằng chứng

- [`extraction/tvcai-refresh/dom-tree.json`](./extraction/tvcai-refresh/dom-tree.json): audit runtime, viewport, interaction và network đã lọc.
- [`extraction/tvcai-refresh/reference-audit.md`](./extraction/tvcai-refresh/reference-audit.md): bản đọc phi kỹ thuật theo section.
- [`extraction/tvcai-refresh/skills-catalog.json`](./extraction/tvcai-refresh/skills-catalog.json): 24 skill và nguồn công khai.
- [`extraction/tvcai-refresh/skills-catalog.md`](./extraction/tvcai-refresh/skills-catalog.md): tóm tắt lựa chọn.

