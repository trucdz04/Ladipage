# SYSTEM X-RAY — toonbee.ai (TRANG NGUỒN)

> X-quang trang nguồn dựa trên bằng chứng thật trong `extraction/` + runtime (chrome-devtools).
> 100% tiếng Việt, phi kỹ thuật. Chỗ không chắc ghi **KHÔNG CHẮC CHẮN**; phần không tồn tại ghi **KHÔNG CÓ**.
> Đây là landing tĩnh (sales/VSL) — KHÔNG có backend/DB/agent riêng.

---

## 1. Giải thích hệ thống (dễ hiểu)

ToonBee là **một trang bán hàng dài (landing page)** giới thiệu phần mềm AI tạo video hoạt hình "ToonBee".
Mục tiêu duy nhất: thuyết phục khách xem hết trang rồi **bấm mua** (gói $97/tháng). Toàn bộ trang chỉ là
một file HTML tĩnh, không có đăng nhập, không lưu dữ liệu người dùng. Mọi "thông minh" nằm ở: video demo,
ảnh minh hoạ làm sẵn, đồng hồ đếm ngược tạo cảm giác khan hiếm, và nút mua nối tới cổng thanh toán bên ngoài.

Có thể hình dung trang như **một cuốn brochure cuộn dọc 20 chương**: mở đầu gây ấn tượng (hero), giải thích
"tại sao cartoon", chỉ ra "làm video khó", giới thiệu giải pháp, so sánh đối thủ, demo, liệt kê tính năng,
báo giá, cam kết hoàn tiền, quà tặng, hỏi-đáp, và chốt đơn.

## 2. Bản đồ hệ thống

```
NGƯỜI DÙNG (trình duyệt)
   │  tải 1 trang HTML tĩnh (PageDock builder)
   ▼
┌─────────────────────────────────────────────────────────────┐
│  toonbee.ai  (HTML + CSS + JS tĩnh, jQuery + Bootstrap 5.2.3) │
│                                                               │
│  20 KHỐI NỘI DUNG (cuộn dọc):                                 │
│  hero → 3-clicks → quy trình → showcase → why → hard-to-make  │
│  → giải pháp AI → so sánh → demo → simple → features → real   │
│  videos → never-easier → hoàn tiền → PRICING → synthetic      │
│  → bonus → FAQ → CTA cuối → footer                            │
│                                                               │
│  THƯ VIỆN: jQuery, Bootstrap, Swiper (carousel),              │
│            @vimeo/player (17 video), FontAwesome, 7 Google font│
└───────────────┬───────────────────────────────────────────────┘
                │ nút "Get Instant Access" / "Buy Now"
                ▼
   ┌────────────────────────────────────────────┐
   │ BÊN THỨ 3 (ngoài trang — KHÔNG dựng lại):    │
   │ • FastSpring / PageDock checkout (#paymentpopup)│
   │ • Vimeo (player.vimeo.com) — host video       │
   │ • CloudFront (del3o5...) — host video/poster  │
   │ • Meta Pixel x2, Google Ads, tracking riêng   │
   │ • PageDock social-proof widget                │
   └────────────────────────────────────────────┘
```

## 3. Luồng thực thi (UI → API → Backend → DB → External/AI)

Trang **KHÔNG CÓ** backend/DB của riêng landing. Luồng thực tế:

```
UI (cuộn trang)
  → JS tĩnh xử lý tương tác (accordion, countdown, video, marquee)
  → KHÔNG gọi API nội bộ (KHÔNG CÓ backend riêng)
  → Khi bấm MUA: chuyển sang cổng FastSpring (External) để thanh toán
  → External: Vimeo trả video, CloudFront trả poster/video mp4
  → Tracking (External): Meta Pixel/Google Ads ghi nhận sự kiện xem/đặt mua
```
- **Không có** xử lý AI ngay trên trang — các video "AI tạo" là **video làm sẵn** nhúng từ Vimeo/CloudFront.
- Ví dụ input/output (đã lọc): click `.accordion_head` → output: thân FAQ trượt mở; mở checkout → output:
  `#timer` hiển thị `03:00` rồi đếm lùi.

## 4. Luồng agent/tool

**KHÔNG CÓ.** Trang không chứa agent AI, không có tool-calling, không có orchestration. "AI" chỉ là
thông điệp marketing; video là nội dung tĩnh nhúng sẵn.

## 5. ERD (mô hình dữ liệu)

**KHÔNG CÓ** cơ sở dữ liệu. Landing tĩnh không lưu trữ thực thể nào. Dữ liệu duy nhất là nội dung cứng
viết thẳng trong HTML (text, đường dẫn ảnh/video). Nếu khách mua, dữ liệu đơn hàng nằm ở **FastSpring**
(ngoài phạm vi trang này → KHÔNG CHẮC CHẮN về schema của họ).

## 6. Bản đồ API

**KHÔNG CÓ API nội bộ.** Các lệnh gọi mạng đều là tài nguyên tĩnh hoặc bên thứ 3:
| Loại | Đích | Mục đích |
|------|------|----------|
| Tĩnh | `toonbee.ai/css/*`, `/js/*`, `/images/*` | CSS, JS, ảnh |
| Video | `player.vimeo.com/video/*` | 17 video nhúng |
| CDN | `del3o5ypqgi9j.cloudfront.net/toonbee/videosfe/*` | poster + mp4 |
| Font | `fonts.googleapis.com` | 7 họ font |
| Checkout | `sbl.onfastspring.com` | thanh toán (bên thứ 3) |
| Tracking | Meta Pixel, Google Ads, `load.tracking.toonbee.ai` | đo lường (bên thứ 3) |

## 7. Vấn đề + VÌ SAO (phân loại)

| Mức | Vấn đề | Vì sao |
|-----|--------|--------|
| MAJOR | LCP ~3.6s (chậm) | TTFB 1.15s + tải sớm nhiều ảnh/video + nhiều thư viện chặn render |
| MAJOR | Tải nặng đầu trang | 120 ảnh + 17 iframe Vimeo + jQuery/Bootstrap/Swiper/FontAwesome cùng lúc |
| MINOR | CLS 0.09 (field) | Một số ảnh/video chưa đặt kích thước cố định → dịch layout nhẹ khi tải |
| MINOR | Phụ thuộc nhiều bên thứ 3 | Checkout/tracking/social-proof là external → khó kiểm soát, dễ vỡ nếu họ đổi |
| MINOR | SEO hạn chế | `googlebot: noindex` (cố ý cho landing quảng cáo) |

→ Với **bản clone** (mục tiêu học/dựng UI), ta sẽ tối ưu: lazy-load ảnh dưới màn hình, đặt width/height,
gộp CSS, bỏ tracking/checkout/social-proof bên thứ 3.

## 8. Lộ trình rebuild (fix → refactor → architecture → agent → performance → production)

1. **fix/nền tảng**: scaffold `clones/toonbee.ai/`, tải asset hợp lệ về local, dựng `tokens.css` + `global.css`.
2. **refactor cấu trúc**: tách 20 khối thành 20 partial section (mỗi file ≤ 800 dòng), semantic HTML.
3. **architecture**: `index.html` ráp partial + `main.js` wiring tương tác (accordion, countdown, video, marquee, lazy-bg).
4. **agent**: KHÔNG CÓ (trang không có agent).
5. **performance**: lazy-load ảnh/iframe dưới màn hình, đặt width/height, ưu tiên hero, `font-display:swap`, animation chỉ `transform/opacity`.
6. **production**: bỏ tracking + checkout thật (thay nút placeholder `#buynow`), verify đa breakpoint, X-ray lại đối chiếu.

**Thứ tự dựng section** = theo chiều dọc 00→19 (xem bản đồ Pha 0).

## 9. Flowchart TODO app (mẫu CRUD — tham chiếu của skill)

> Trang này KHÔNG phải TODO app, nhưng skill yêu cầu sơ đồ CRUD mẫu. Áp vào tương tác động duy nhất có
> "trạng thái" trên trang (FAQ accordion + countdown) để minh hoạ vòng đời:

```
[Tải trang]
    │
    ├─► tạo (init): mọi .accordion_body = ẩn; timer chưa chạy
    │
    ├─► đọc (render): hiển thị 20 section tĩnh + video poster
    │
    ├─► update (tương tác):
    │       click FAQ → toggle 1 body (mở/đóng)
    │       mở checkout → countdown 03:00 → giảm mỗi giây
    │       scroll → lazy-bg gán background-image; Vimeo play/pause theo view
    │
    └─► delete/reset:
            countdown = 0 → clearInterval (dừng)
            đóng popup → reset form + clear timer
```

*(KHÔNG có lưu DB — mọi trạng thái chỉ tồn tại trong phiên trình duyệt.)*
