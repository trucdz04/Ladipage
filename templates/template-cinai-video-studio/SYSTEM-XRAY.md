# SYSTEM X-RAY — sendfame.com/ai-video-generator (TRANG NGUỒN)

> Bản X-quang trang nguồn, tổng hợp từ `extraction/` thật (DOM + runtime + network + perf).
> 100% tiếng Việt, phi kỹ thuật. Chỗ không trace được ghi **KHÔNG CHẮC CHẮN**; phần landing
> không có backend riêng ghi **KHÔNG CÓ**. Đây là kim chỉ nam để code (Pha 3–5) và để đối chiếu (Pha 6).

---

## 1. Giải thích hệ thống (trang này là gì)
Đây là **một trang landing marketing** của SendFame — giới thiệu công cụ "AI Video Generator" (biến ảnh
thành video bằng AI). Mục tiêu của trang: **thuyết phục khách thử và đăng ký tài khoản**. Trang trưng bày:
một panel tạo video tương tác (demo), thư viện video cộng đồng, danh sách model AI, các tính năng, FAQ, và
chân trang nhiều liên kết. **Mọi hành động "tạo video" thật đều bị khoá sau đăng nhập** — tức trang này
đóng vai trò "cửa ngõ" (top of funnel), không tự xử lý nghiệp vụ tạo video.

- **Stack nguồn:** Next.js (Pages Router) + Tailwind CSS, font Rubik. Render sẵn nội dung (SSG/SSR) rồi
  hydrate bằng JS.
- **Bản clone của ta:** **HTML/CSS/JS tĩnh** (đã chốt với người dùng) — tái dựng đúng giao diện + trạng
  thái tương tác, nhẹ và dễ deploy.

## 2. Bản đồ hệ thống (các khối hợp thành)
```
TRANG (1 route: /ai-video-generator)
├── 00 Announcement bar      — khuyến mãi + nút See Pricing
├── 01 Header nav            — logo + 3 mega-menu + Sign In (lime)
├── 02 Breadcrumb            — Home / AI Video Generator
├── 03 Hero + Generator panel — H1 + pills + PANEL DEMO (tab/model/duration/resolution + preview player)
├── 04 Community Videos       — lưới video card từ CDN + CTA
├── 05 Featured showcase      — 1 video cinematic full-width
├── 06 Features               — 5 card (Fast/Text/Image/Avatars/Commercial)
├── 07 Explore AI Models       — 8 model card + CTA
├── 08 FAQ                    — accordion 6 câu
└── 09 Footer/CTA             — "Create Epic" + 3 cột link + email
+ Login modal (overlay)       — bật khi bấm mọi CTA gated
```
**Hạ tầng phụ trợ (trang nguồn):** CDN media (`videos.sendfame.com`, `cdn.higgsfield.ai`, cloudfront qua
wsrv.nl, R2 bucket), tracking bên thứ ba (FB Pixel, Google Ads, AppLovin).

## 3. Luồng thực thi `UI → API → Backend → DB → External/AI`
- **Trang landing (clone tĩnh):** `UI` (HTML/CSS) → tương tác client (JS toggle state) → **API: KHÔNG CÓ**
  (không gọi backend) → **Backend/DB: KHÔNG CÓ** trên trang. CTA gated → mở modal đăng ký.
- **Trang nguồn (suy luận, KHÔNG CHẮC CHẮN chi tiết):** khi đăng nhập và bấm "Generate", UI gọi API nội
  bộ SendFame → hàng đợi job tạo video → gọi **External/AI** (Veo, Kling, Seedance, Grok, Hailuo…) → lưu
  kết quả ở CDN → trả về client. Phần này **không trace được từ trang public** (bị gate).
- **Tracking flow (có thật, trace được):** load trang → bắn `PageView` (FB Pixel) + Google Ads conversion
  config + gtag cross-domain linker giữa `sendfame.com / sendfameai.com / sendfame.ai`.

Ví dụ input/output (đã lọc secret):
- *Input:* người dùng chọn tab "Image to Video", model "Original Ultra 2.6", duration "5s", res "720p",
  nhập prompt → bấm "Signup to Try!".
- *Output (clone):* mở login modal (không tạo video). Sự kiện tracking `Lead`/`Click_CTA` bắn (Pha 7).

## 4. Luồng agent / tool
**KHÔNG CÓ** agent/tool trong trang landing. (Các "model AI" liệt kê ở section 07 là *sản phẩm* SendFame
quảng bá, không phải agent của trang.) Việc gọi model AI thật nằm sau đăng nhập — **KHÔNG CHẮC CHẮN**.

## 5. ERD (mô hình dữ liệu)
**KHÔNG CÓ** cơ sở dữ liệu trong bản landing tĩnh. Dữ liệu hiển thị là **nội dung tĩnh** + danh sách
media từ CDN. Mô hình dữ liệu *trình bày* (để dựng UI), không phải DB:
```
Model            { name, slug(href), thumbnail, description }      // 8 model card
CommunityVideo   { posterUrl, videoUrl, prompt? }                  // lưới video
Feature          { icon, title, description }                       // 5 card
FAQItem          { question, answer }                               // 6 câu
NavLink          { label, href, group(Navigation/New/Learn More) } // footer
PanelState       { activeTab, selectedModel, duration, resolution, prompt, uploadedImage }
```
> Đây là "content model" để render tĩnh — có thể đặt trong `scripts/data.js` hoặc nhúng thẳng HTML.

## 6. Bản đồ API
**KHÔNG CÓ** API do bản clone tĩnh sở hữu. API duy nhất sẽ thêm ở Pha 7 là **webhook n8n** cho tracking:
| Endpoint | Phương thức | Mục đích | Ví dụ payload (lọc secret) |
|----------|-------------|----------|----------------------------|
| `N8N_WEBHOOK` (Pha 7) | POST | Lead/CAPI/Lark | `{ event:"Lead", email, event_id, fbp, fbc, utm }` |

API của trang nguồn (sau auth) **KHÔNG CHẮC CHẮN** — không trace được.

## 7. Vấn đề + VÌ SAO
| Mức | Vấn đề (trang nguồn) | Vì sao |
|-----|----------------------|--------|
| MINOR | TTFB field cao (~979ms p75) | SSR + tracking bên thứ ba nặng |
| MINOR | Nhiều script bên thứ ba (FB/Google/AppLovin) | có thể chậm INP nếu không defer |
| MINOR | Nhiều video autoplay | tốn băng thông mobile nếu không lazy |
| INFO | Panel demo gated | hợp lý (bảo vệ chi phí tạo video) |
- **Với bản clone:** tránh các vấn đề trên bằng inline critical CSS, defer tracking, lazy video/ảnh, DOM gọn.

## 8. Lộ trình rebuild `fix → refactor → architecture → agent → performance → production`
1. **fix/nền tảng:** dựng `tokens.css` + `global.css` (Pha 3) — màu/typography/spacing chuẩn Tailwind-like.
2. **refactor/cấu trúc:** scaffold `clones/sendfame.com/` + tách mỗi section 1 partial (Pha 4).
3. **architecture/build:** dựng tuần tự 00→09 (Pha 5), wiring `main.js` (tab/chip/accordion/modal/reveal).
4. **agent:** KHÔNG CÓ (landing tĩnh).
5. **performance:** lazy media, defer JS, font-display swap, width/height ảnh → CLS≈0 (Pha 6).
6. **production:** nhúng tracking 4 lớp + nối n8n (Pha 7) → đối chiếu X-RAY clone (Pha 6 khép vòng) → deploy.

## 9. Flowchart luồng CRUD mẫu (ASCII — áp cho PanelState, vì không có TODO/DB thật)
```
[Người dùng mở trang]
        │
        ▼
[Khởi tạo PanelState mặc định]  (tab=image, model=2.6, dur=5s, res=720p, prompt=sample)
        │
        ▼
[Tương tác: click tab/model/chip/nhập prompt]
        │
        ▼
[UPDATE PanelState trong bộ nhớ client]  ──► [Render lại: đổi class active + nội dung form]
        │
        ▼
[Click "Signup to Try!" / CTA gated]
        │
        ▼
[Mở Login Modal]  ──►  (Pha 7) [bắn event Lead/Click_CTA + chuyển fbclid/utm sang MAIN_DOMAIN]
        │
        ▼
[KHÔNG tạo/lưu video ở client]  (việc tạo thật nằm sau đăng nhập — ngoài phạm vi clone)
```
> Không có Create/Delete bản ghi DB trên landing. "State" chỉ sống trong phiên trình duyệt (reset khi tải lại).

---
### Kết luận cho việc code
- Dựng **tĩnh, 1 trang, 10 section**, theo thứ tự 00→09.
- Trọng tâm khó: **section 03 (panel)** — nhiều state UI; làm kỹ class active + responsive 2 cột→stack.
- Không cần data layer/DB; content nhúng trực tiếp. Chỉ thêm webhook tracking ở Pha 7.
- Mục tiêu chất lượng: pixel-perfect 5 breakpoint, CWV tốt, a11y (focus/contrast/reduced-motion).
