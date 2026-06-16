# Bản đồ hành vi & logic component (Pha 1b + 1c — SNAPSHOT_BEFORE)

> Trang là landing **tĩnh** (Laravel+Vite render HTML, JS chỉ lo tương tác UI + autoplay video + reveal).
> KHÔNG có form/đăng nhập trên trang chủ (mọi nút điều hướng sang `/pricing`, `/demo`, `/login`...).

## Tương tác toàn cục
| Hành vi | Mô tả | Tái dựng |
|---|---|---|
| Header fixed | Header `position:fixed`, nền gradient mờ dần từ trên | CSS fixed + gradient |
| Scroll reveal | Section/card `opacity:0`→hiện khi vào viewport (`landing-fade-up`) | IntersectionObserver + class |
| Video autoplay | Nhiều `<video muted loop playsinline autoplay>` nền (modelslab mp4) | `autoplay muted loop playsinline` + IO lazy-play |
| Marquee | Logo strip (03) + text strip (13) chạy ngang vô tận | CSS keyframe translateX + duplicate nội dung |

## Component động (SNAPSHOT_BEFORE)

### A. Vertical Feature List — STICKY SCROLL (section 05) ⭐ phức tạp nhất
- **STATE:** activeIndex 0–4 (5 panel: Product Ads / Movie Pre-Prod / Social / VFX / Anime).
- **INPUT:** scroll progress trong vùng cao `4485px` (≈5× viewport).
- **TRANSFORM:** container `.sticky top-0 h-screen` pinned; nội dung panel (ảnh + text) đổi theo activeIndex; indicator số **1–5** sáng theo panel hiện hành; thanh tiến trình dọc.
- **ANIMATION:** crossfade/slide giữa panel khi đổi index (opacity + translateY nhẹ).
- **CONSTRAINT:** chỉ pin trên màn ≥ md; mobile fallback = stack dọc thường (không sticky).
- **Tái dựng:** wrapper cao `~500vh`, con `position:sticky; top:0; height:100vh`; IntersectionObserver/scroll listener tính `activeIndex = floor(progress * 5)`; toggle panel + indicator.

### B. Tabs "One Platform" (section 04)
- **STATE:** activeTab ∈ {Editor, AI Script, AI Character, AI Image, AI Video, Voice & Narration, Timeline & Director} (7).
- **INPUT:** click tab.
- **RENDER:** đổi nội dung/video preview tương ứng (ở bản clone dùng 1 video YouTube + poster `lence.webp`).
- **CONSTRAINT:** 1 tab active tại 1 thời điểm; bàn phím điều hướng được (a11y: `role=tablist`).

### C. Guided Highlights tabs (section 07)
- **STATE:** activeTab ∈ {AI Image, AI Video, Timeline Control} (3) → đổi clip demo.

### D. Horizontal Carousel (section 08)
- **STATE:** scroll ngang 6 card (ảnh + tiêu đề + mô tả).
- **INPUT:** kéo/scroll ngang (+ có thể nút prev/next — không thấy aria-label rõ).
- **TRANSFORM:** `overflow-x` scroll hoặc translateX theo index; scroll-snap.
- **Tái dựng:** flex row + `overflow-x-auto snap-x snap-mandatory`, mỗi card `snap-start`.

### E. FAQ Accordion (section 11)
- **STATE:** mục mở/đóng (4 mục, dạng button — KHÔNG có `aria-expanded` sẵn → toggle custom).
- **INPUT:** click câu hỏi → mở/đóng trả lời.
- **ANIMATION:** max-height/opacity transition + xoay icon chevron.
- **CONSTRAINT:** a11y nên thêm `aria-expanded` + `aria-controls`. Có thể đóng các mục khác (single-open) hoặc multi-open — mặc định clone: single-open.

## Hiệu năng (tham chiếu — Pha 1b)
- Trang nặng media (nhiều mp4 + webp). Cần lazy-load + `loading=lazy` ảnh dưới màn, IO play video.
- LCP có thể là H1 hero hoặc poster video — ưu tiên preload hero gif fallback + font.
- Chi tiết đo đạc CWV: ghi ở `performance.md` (đo bằng Lighthouse khi cần ở Pha 6).
