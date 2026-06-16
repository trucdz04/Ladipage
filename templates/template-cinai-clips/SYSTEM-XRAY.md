# SYSTEM X-RAY — autoclips.app (trang NGUỒN)

> Báo cáo X-quang trang gốc `https://www.autoclips.app/`, tổng hợp từ `extraction/` (DOM + runtime thật qua chrome-devtools).
> Mọi mô tả chỉ dựa trên cái **trace được thật**. Chỗ không chắc ghi **KHÔNG CHẮC CHẮN**; phần không có ghi **KHÔNG CÓ**.
> 100% tiếng Việt, phi kỹ thuật. Đây là **kim chỉ nam để code** ở Pha 3–5.

---

## 1. Giải thích hệ thống (hệ này là gì?)

Autoclips.app là **trang đích bán hàng (marketing landing page)** cho một phần mềm AI tạo video ngắn ("faceless video"). Mục tiêu duy nhất của trang: **thuyết phục khách truy cập bấm "Get Started For Free"** và chuyển sang ứng dụng chính tại `app.autoclips.app`.

Trang **không phải là ứng dụng** — nó không tự tạo video, không có đăng nhập, không lưu dữ liệu người dùng. Toàn bộ "xử lý thật" nằm ở app chính (ngoài phạm vi clone). Trang này chỉ là một **brochure tương tác**: trình diễn các định dạng video (qua video CDN), chứng minh bằng số liệu + lời chứng thực, báo giá, và trả lời thắc mắc (FAQ).

Vài thành phần có **logic phía trình duyệt** (không cần server): máy tính ROI (kéo slider ra tiền), bảng giá có công tắc tháng/năm, accordion FAQ, và các carousel video tự chạy.

---

## 2. Bản đồ hệ thống

```
                      ┌─────────────────────────────────────────────┐
                      │   TRÌNH DUYỆT (Client) — Next.js render tĩnh  │
                      │                                               │
   Người dùng ──────▶ │  Landing page (26 section, cuộn dọc ~30k px)  │
                      │   ├─ Nav (sticky)                             │
                      │   ├─ Hero + video trailer                     │
                      │   ├─ Showcase video (carousel/marquee)        │
                      │   ├─ Logic client: ROI calc · Pricing toggle  │
                      │   │                · FAQ accordion            │
                      │   └─ CTA → app.autoclips.app/login            │
                      └───────────────┬───────────────────────────────┘
                                      │ chỉ tải tài nguyên tĩnh
              ┌───────────────────────┼────────────────────────────┐
              ▼                       ▼                            ▼
   CDN video/thumb            Ảnh /_next/image            app.autoclips.app
   zayathemes.b-cdn.net       (avatar, logo, UI)          (ỨNG DỤNG THẬT — ngoài clone)
   (~74 video 9:16)

   Backend/DB/API riêng của trang:  KHÔNG CÓ (trang tĩnh).
```

---

## 3. Luồng thực thi `UI → API → Backend → DB → External/AI`

| Lớp | Có trên trang landing? | Chi tiết |
|-----|------------------------|----------|
| **UI** | ✅ | 26 section HTML/CSS; tương tác client: kéo slider ROI, đổi tab giá, mở/đóng FAQ, video autoplay |
| **API** | ❌ KHÔNG CÓ | Trang không gọi API nghiệp vụ. Chỉ tải asset tĩnh (video/ảnh) qua HTTP GET tới CDN |
| **Backend** | ❌ KHÔNG CÓ | Không có server xử lý của landing (Next.js chỉ render tĩnh/SSG) |
| **DB** | ❌ KHÔNG CÓ | Không lưu trữ dữ liệu người dùng tại landing |
| **External/AI** | ⚠️ Gián tiếp | Mọi AI (tạo script/ảnh/voice/video) nằm ở `app.autoclips.app`, KHÔNG chạy ở landing |

**Luồng thực tế của trang (ví dụ input/output):**
- *Input*: người dùng kéo slider ROI "Videos per day = 3, Views = 50K, Rate = 0.5%, Value = $200".
  *Output (tính client)*: 90 videos/mo → 4.5M views → 22.500 sales → **$4.500.000/mo** (hiển thị tức thì, không gọi mạng).
- *Input*: bấm "Get Started For Free".
  *Output*: chuyển hướng `https://app.autoclips.app/login` (rời khỏi trang).
- *Input*: cuộn tới section "Talking Objects".
  *Output*: các `<video muted loop autoplay>` từ CDN bắt đầu phát.

---

## 4. Luồng Agent / Tool

**KHÔNG CÓ.** Trang landing không có agent AI, không có tool-calling, không có pipeline LLM chạy phía client. (Pipeline AI tạo video là tính năng của app chính `app.autoclips.app`, được *mô tả* trên trang nhưng không *thực thi* tại đây.)

---

## 5. ERD (mô hình dữ liệu)

**KHÔNG CÓ** cơ sở dữ liệu cho trang landing. Trang là tĩnh, không có entity lưu trữ.

Tuy nhiên, có vài **cấu trúc dữ liệu tĩnh nhúng trong UI** (không phải DB, chỉ là mảng dữ liệu để render — clone sẽ tái tạo bằng mảng JS/JSON):

```
PricingPlan { name, monthlyPrice, yearlyPrice, credits, videosRange,
              accounts, features[], badge?, ctaHref }
FaqItem     { question, answer }
RoiInputs   { videosPerDay, avgViews, buyerRate, productValue }
Testimonial { author, handle, avatar, quote, platform }
VideoCard   { src(CDN), poster, title, views, niche }
FormatBlock { title, subtitle, steps[3], videos[], ctaLabel, theme }
```

---

## 6. Bản đồ API

**KHÔNG CÓ API nghiệp vụ.** Chỉ có các request tài nguyên tĩnh (HTTP GET, không tham số nghiệp vụ):

| Loại request | Đích | Mục đích |
|--------------|------|----------|
| GET video `.mp4` | `zayathemes.b-cdn.net/autoclips-videos/...` | showcase định dạng video |
| GET ảnh | `/_next/image?url=...&w=&q=` | logo, avatar, screenshot (Next Image optimizer) |
| GET (điều hướng) | `app.autoclips.app/login` | mọi CTA chuyển sang app chính |

Không có POST/PUT/DELETE, không có auth, không có webhook tại landing.

---

## 7. Vấn đề + VÌ SAO

| Mức | Vấn đề | VÌ SAO (nguyên nhân gốc) |
|-----|--------|--------------------------|
| **MAJOR** | Load chậm (~7.9s, 250 resource) | ~74 `<video autoplay>` tải đồng thời ngay khi mở trang, không lazy theo viewport → nghẽn băng thông, hại LCP/INP |
| **MAJOR** | Không có poster cho nhiều video showcase | một số `<video>` thiếu `poster` → khung trắng trước khi video tải, gây nhảy layout (CLS) |
| **MINOR** | H1 desktop cố định 96px | thiếu `clamp()` mượt — cần chỉnh để không vỡ ở màn trung bình |
| **MINOR** | Trùng lặp nội dung video (carousel duplicate track) | cần thiết cho marquee loop liền mạch, nhưng tăng số phần tử DOM |
| **MINOR** | Nhiều CTA giống nhau trỏ cùng `/login` | tốt cho chuyển đổi nhưng cần đảm bảo nhất quán href khi clone |

> **Khi clone, ta SẼ vá**: lazy-load video bằng IntersectionObserver (chỉ phát khi vào màn), thêm `poster`/`preload=none`, dùng `clamp()` cho typography, đặt `width/height` để chống CLS.

---

## 8. Lộ trình rebuild (`fix → refactor → architecture → agent → performance → production`)

**Thứ tự dựng (định bởi X-Ray này):**

1. **Nền tảng (fix)**: `tokens.css` (màu/font/spacing/easing) + `global.css` (reset, container, semantic) → nạp Tailwind CDN + Urbanist.
2. **Khung tĩnh trên xuống (architecture)** — dựng tuần tự theo bản đồ section:
   `00 Nav → 01 Hero → 02 Platform bar → 03 Stats → 04 Niche marquee → 05 What is → 06 Stop-wasting → 07 Comparison → 08 DIY cost → 09 3D Studio → 10 Talking Objects → 11 Fruit Stories → 12 Creepy Toon → 13 CTA → 14 Testimonials → 15 Autopilot 3-steps → 16 Automations → 17 ROI Calc → 18 CTA → 19 Pricing → 20 FAQ → 21 Earning CTA → 22 Character Explainer → 23 Testimonial quote → 24 Guides → 25 Discord → 26 Footer`
3. **Logic client (agent/tool tương đương)** — thêm 4 module JS:
   `pricing-toggle.js` (tháng/năm), `faq-accordion.js` (single-open), `roi-calculator.js` (4 slider → công thức), `video-lazy.js` (IntersectionObserver autoplay) + `nav.js` (mobile menu).
4. **Performance**: lazy video, poster placeholder, `clamp()` typography, ảnh có kích thước, animation chỉ `transform/opacity`, marquee bằng CSS keyframes.
5. **Production**: responsive 5 breakpoint, a11y (focus ring, prefers-reduced-motion), SEO meta/OG, kiểm khớp pixel với bản gốc qua COMPARE LOOP.

---

## 9. Flowchart mẫu (luồng CRUD tham chiếu — ROI Calculator như "app động" của trang)

> Trang không có TODO app/CRUD thật. Thành phần "động" gần nhất là **ROI Calculator** — minh hoạ luồng [input → state → tính → render] thuần client:

```
        ┌──────────────────────────────────────────────┐
        │              ROI CALCULATOR (client)          │
        └──────────────────────────────────────────────┘

   [Kéo slider]                 set state               render lại
  videosPerDay ───┐         ┌──────────────┐         ┌────────────────┐
  avgViews ───────┼──oninput─▶  state = {   │──tính──▶│ monthlyVideos  │
  buyerRate ──────┤         │   v, views,   │         │ totalViews     │
  productValue ───┘         │   rate, value}│         │ estSales       │
                            └──────────────┘         │ revenue        │
                                                      │ roiMultiple    │
                                                      └───────┬────────┘
                                                              ▼
                                              ┌────────────────────────────┐
                                              │ Hiển thị: "$900/mo",        │
                                              │ "31.03x return 🔥",         │
                                              │ thanh track tô màu accent   │
                                              └────────────────────────────┘
   (KHÔNG lưu DB · KHÔNG gọi API · reset khi reload trang)

   Công thức:
     monthlyVideos = videosPerDay × 30
     totalViews    = monthlyVideos × avgViews
     estSales      = totalViews × (buyerRate ÷ 100)
     revenue       = estSales × productValue
     roiMultiple   = revenue ÷ 29
```

---

### Phụ lục — nguồn bằng chứng
- `extraction/content-sections.json` — nội dung 25 block
- `extraction/faq-content.json` — 20 cặp hỏi/đáp đầy đủ
- `extraction/tokens-raw.md` — màu/font/spacing/easing
- `extraction/behavior-map.md` — animation, hiệu năng, 6 component động (SNAPSHOT_BEFORE)
