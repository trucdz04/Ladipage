# Hiệu năng trang nguồn (Pha 1b — tham chiếu)

> Đo bằng Performance API (desktop, mạng thường). Số liệu CWV chi tiết của bản CLONE sẽ đo lại ở Pha 6.

## Số liệu trang nguồn
| Chỉ số | Giá trị | Nhận xét |
|---|---|---|
| TTFB | ~496ms | Server Laravel phản hồi ổn |
| FCP | ~724ms | Tốt (< 1.5s) |
| DOMContentLoaded | ~1077ms | |
| Load event | ~2406ms | Khá nặng do nhiều media |
| LCP | (không bắt được qua API) | Ước tính ~ poster/H1 hero |
| Tổng request | **214** | RẤT NHIỀU |
| Script | 58 file (~231KB) | GTM, Pixel, Clarity, Reddit, tawk, YouTube — phần lớn là tracking |
| Video | 48 request (.mp4 range 206) | Nhiều video nền autoplay |
| Image | 35 | webp quality=30 |

## Nút thắt nhận diện (CRITICAL/MAJOR cho bản clone tránh lặp lại)
- **MAJOR — Quá nhiều media autoplay đồng thời:** 48 video request → tốn băng thông, hại INP/CPU. Bản clone phải **lazy-play** (IntersectionObserver: chỉ play video trong viewport, pause khi ra).
- **MAJOR — 58 script tracking:** bản clone (đã bỏ Pha 7) sẽ KHÔNG nhúng → nhẹ hơn hẳn.
- **MINOR — Ảnh quality=30 webp:** nên giữ kích thước responsive (`width=400/800/1200` theo breakpoint).

## Mục tiêu CWV cho bản clone (theo web/performance.md)
| Metric | Target |
|---|---|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| FCP | < 1.5s |

## Chiến lược loading bản clone
- Preload: hero gif fallback (poster) + 2 font (Inter, Plus Jakarta Sans) weight chính.
- `loading="lazy"` mọi ảnh dưới màn; `fetchpriority="high"` chỉ cho media hero.
- Video: `preload="none"` + IO play; `poster` cho mọi `<video>` để tránh CLS.
- Đặt `width`/`height` (hoặc aspect-ratio) cho mọi media → CLS ~0.
