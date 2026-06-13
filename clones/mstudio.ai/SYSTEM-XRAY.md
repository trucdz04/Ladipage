# SYSTEM-XRAY — mstudio.ai (trang NGUỒN)

> X-quang hệ thống dựa trên bằng chứng trích được thật (DOM runtime + network + computed styles + keyframes).
> 100% tiếng Việt, phi kỹ thuật. Chỗ không chắc ghi **KHÔNG CHẮC CHẮN**; phần không tồn tại ghi **KHÔNG CÓ**.
> Đây là **landing page tĩnh** (Laravel + Vite render HTML), không phải app có backend hiển thị trên trang chủ.

---

## 1. Giải thích hệ thống (system này là gì)

mstudio.ai là **trang giới thiệu sản phẩm (landing page)** cho một nền tảng làm phim bằng AI tên "M Studio".
Nhiệm vụ DUY NHẤT của trang chủ này: **thuyết phục người xem và đẩy họ bấm nút** sang các trang khác
(đăng ký `/register`, bảng giá `/pricing`, xem demo `/demo`, đăng nhập `/login`, vào ứng dụng `/dashboard`).

Trang KHÔNG xử lý nghiệp vụ (không tạo phim, không lưu dữ liệu người dùng ngay tại đây). Mọi "tính năng AI"
được **mô tả bằng chữ + video minh hoạ**; bấm vào sẽ chuyển sang khu vực ứng dụng/đăng ký nằm ngoài trang chủ.

Cảm giác thị giác: **tối sang trọng (dark luxury)**, nền đen hơi xanh `#09090b`, điểm nhấn **vàng kem/gold**,
chữ tiêu đề lớn (font Plus Jakarta Sans), rất nhiều **video clip AI tự chạy** làm nền minh hoạ, hiệu ứng
**hiện dần khi cuộn** và một khối **cuộn-dính (sticky)** kể 5 nhóm khách hàng.

---

## 2. Bản đồ hệ thống (các khối ghép thành trang)

```
┌──────────────────────────────────────────────────────────┐
│ 00 Announcement bar  "Seedance 2.0…"  → /dashboard          │
├──────────────────────────────────────────────────────────┤
│ 01 Header (fixed)  Logo · Features/AI Directors/Demo/Pricing │
│                    · Explore · Support · Discord · Login     │
├──────────────────────────────────────────────────────────┤
│ 02 Hero  H1 + 2 gif chip + sub + CTA + 3 feature card        │
│ 03 Clients strip  "Powered by best-in-class AI models"       │
│ 04 Tools overview  7 tab + video YouTube (poster lence.webp) │
│ 05 Vertical Feature List  ★ STICKY 5 panel (indicator 1–5)   │
│ 06 Platform Features  grid 6 card                            │
│ 07 Guided Highlights  3 tab clip                             │
│ 08 Horizontal Carousel  6 card scroll ngang                  │
│ 09 Why M Studio  4 thống kê + "Powered by" + CTA             │
│ 10 Buyer Guides  6 card bài viết                             │
│ 11 FAQ  accordion 4 mục                                      │
│ 12 CTA "Ready To Build"  H3 + 2 nút                          │
│ 13 Marquee strip  text chạy ngang ×12                        │
│ 14 Footer  CTA lớn + 5 cột link + watermark MSTUDIO          │
├──────────────────────────────────────────────────────────┤
│ 99 Chat widget  tawk.to (góc phải dưới)  → PLACEHOLDER       │
└──────────────────────────────────────────────────────────┘
```

- **Công nghệ nguồn:** Laravel + **Vite** (`/build/assets/app.BxHggJZ_.js`) + **Tailwind CSS** (token HSL kiểu shadcn).
- **Lớp đo lường/tracking:** GTM, Google Ads, Meta Pixel, Reddit Pixel, MS Clarity, OpenAI SDK, tawk.to.
  → Ở bản clone đã **bỏ toàn bộ** (theo yêu cầu, không làm Pha 7).

---

## 3. Luồng thực thi (UI → API → Backend → DB → External/AI)

Vì là landing tĩnh, luồng rất ngắn:

```
NGƯỜI XEM
   │  (1) mở trang
   ▼
TRÌNH DUYỆT tải HTML (Laravel render sẵn) + app.js (Vite) + Tailwind CSS
   │  (2) JS chạy: IntersectionObserver (reveal) · autoplay/lazy video · sticky-scroll · tabs · accordion · marquee
   ▼
HIỂN THỊ trang (mọi nội dung là TĨNH, nhúng sẵn trong HTML)
   │  (3) người xem bấm nút/link
   ▼
ĐIỀU HƯỚNG sang trang khác (/pricing, /register, /demo, /login, /dashboard, /features/*, /insights/*) — RỜI trang chủ
```

- **API gọi từ trang chủ:** **KHÔNG CÓ** lệnh gọi API nghiệp vụ. Các request mạng chỉ gồm:
  tải media (mp4/webp), font, và **pixel tracking** (gọi sang Google/Meta/Reddit — không phải API của hệ thống).
- **Backend xử lý lúc xem trang:** **KHÔNG CÓ** (HTML đã render sẵn; không có submit form).
- **External/AI gọi runtime:** **KHÔNG CÓ** (tên Google Veo/Gemini/Kling/ElevenLabs chỉ là nội dung quảng cáo,
  không có lệnh gọi nào tới chúng từ trang chủ).

Ví dụ input/output (đã lọc secret):
- **Input:** người dùng bấm "Start now".
- **Output:** trình duyệt điều hướng `GET https://mstudio.ai/pricing` → tải trang bảng giá (ngoài phạm vi clone).

---

## 4. Luồng agent / tool (AI agent, công cụ tự động)

**KHÔNG CÓ.** Trang chủ không chứa agent AI, không có pipeline tool-calling, không có chatbot AI nghiệp vụ.
(Widget tawk.to là chat hỗ trợ người-thật của bên thứ ba, không phải agent của hệ thống.)

---

## 5. ERD (mô hình dữ liệu)

**KHÔNG CÓ** cơ sở dữ liệu hiển thị/tương tác ở trang chủ. Toàn bộ "dữ liệu" là **nội dung tĩnh nhúng cứng**
trong HTML (text marketing, đường dẫn ảnh/video, link). Không có bảng, không có quan hệ thực thể.

> Nếu muốn biến clone thành có dữ liệu động (ví dụ FAQ/feature lấy từ CMS), đó là **đề xuất tương lai**, không phải hiện trạng.

---

## 6. Bản đồ API

**KHÔNG CÓ API nghiệp vụ.** Bảng dưới là **tài nguyên tĩnh + tracking** quan sát được (không phải API hệ thống):

| Loại | Endpoint (mẫu) | Vai trò |
|---|---|---|
| Tài nguyên | `GET /build/assets/app.*.js` | Bundle Vite (tương tác UI) |
| Tài nguyên | `GET /images/landingpage/*.{webp,mp4}` | Poster + gif hero + video |
| Media CDN | `GET assets.modelslab.ai/generations/*.mp4` | Video minh hoạ AI (range 206) |
| Media CDN | `GET images.stablediffusionapi.com/?Image=…&quality=30&width=N` | Ảnh minh hoạ (proxy resize) |
| Điều hướng | `GET /pricing /register /demo /login /features/* /insights/*` | Link nội bộ (rời trang chủ) |
| Tracking (ngoài) | Google GTM/Ads, Meta Pixel `/tr`, Reddit `rp.gif`, Clarity | Đo lường — **bỏ ở clone** |

---

## 7. Vấn đề phát hiện + VÌ SAO (phân loại)

| Mức | Vấn đề | Vì sao |
|---|---|---|
| **MAJOR** | 48 request video + autoplay đồng loạt | Tốn băng thông/CPU, hại INP. Bản clone phải lazy-play (IO play/pause) để tránh lặp lại. |
| **MAJOR** | 58 script tracking (~231KB) làm nặng trang | Nhiều bên thứ ba. Bản clone bỏ tracking → nhẹ hơn rõ rệt. |
| **MINOR** | FAQ là `<button>` không có `aria-expanded` | Hạn chế khả năng tiếp cận (a11y). Clone nên thêm `aria-expanded`/`aria-controls`. |
| **MINOR** | `<title>` bị tawk.to đổi thành "1 new message" | Widget chat ghi đè title — gây nhiễu SEO/UX nhẹ. Clone dùng title chuẩn. |
| **MINOR** | Ảnh proxy `quality=30` | Nén mạnh, hơi mờ khi phóng to. Chấp nhận được cho landing. |
| KHÔNG CHẮC CHẮN | Cơ chế chính xác của sticky-scroll (scroll listener vs IO + CSS) | Bundle Vite đã minify; clone tái dựng bằng `position:sticky` + tính progress. |

---

## 8. Lộ trình rebuild (fix → refactor → architecture → agent → performance → production)

Thứ tự DỰNG bản clone (kim chỉ nam cho Pha 5):

1. **Nền tảng (fix/scaffold):** tokens.css (màu/typography/spacing/radius/shadow) + global.css + reset + 2 font.
2. **Khung tĩnh (architecture):** dựng tuần tự 00→14 (mỗi section 1 partial), semantic HTML, container `max-w-screen-2xl`.
   - Thứ tự ưu tiên: 01 Header → 02 Hero → 03 Clients → 04 Tools → 05 Sticky list → 06 Features → 07 Guided →
     08 Carousel → 09 Why → 10 Guides → 11 FAQ → 12 CTA → 13 Marquee → 14 Footer → 00 Announcement → 99 Chat (placeholder).
3. **Tương tác (agent/logic — ở đây là JS UI):** main.js gồm
   IntersectionObserver reveal · sticky-scroll activeIndex · tabs (04, 07) · FAQ accordion · carousel scroll-snap · lazy video play · marquee.
4. **Performance:** lazy-load ảnh/video, poster + aspect-ratio chống CLS, preload font + hero, `prefers-reduced-motion`.
5. **Production:** responsive 5 breakpoint, a11y (focus ring, aria), SEO meta/OG, tải media về `assets/`, rewrite path local.

(Không có bước "agent" thực sự vì hệ thống không có AI agent — thay bằng lớp JS tương tác.)

---

## 9. Flowchart mẫu (TODO app: tạo → lưu DB → hiển thị → update → delete)

> Trang nguồn KHÔNG CÓ CRUD/TODO. Đây là flowchart **mẫu tham chiếu** theo yêu cầu khung X-RAY (không phản ánh tính năng thật của mstudio.ai):

```
[Người dùng nhập việc] 
        │  tạo
        ▼
[Validate input] ──fail──► [Báo lỗi, giữ form]
        │ ok
        ▼
[Lưu vào DB] ──► [Trả về bản ghi + id]
        │
        ▼
[Hiển thị trong danh sách]
        │
   ┌────┴─────┐
   ▼          ▼
[Update]    [Delete]
   │          │
   ▼          ▼
[Ghi DB]   [Xoá DB]
   │          │
   └────┬─────┘
        ▼
[Cập nhật lại danh sách hiển thị]
```

Với bản clone landing này, "luồng CRUD" tương đương = **luồng tương tác UI client-side** (mở/đóng FAQ, đổi tab,
cuộn sticky), không ghi DB. Đó là phạm vi thực tế của hệ thống.
