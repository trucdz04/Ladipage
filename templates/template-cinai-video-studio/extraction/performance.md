# Performance — sendfame.com/ai-video-generator

## Core Web Vitals
| Metric | Lab (máy này) | Field CrUX p75 | Mục tiêu | Đánh giá |
|--------|---------------|----------------|----------|----------|
| LCP | 614 ms | 1472 ms | < 2.5s | ✅ Tốt |
| CLS | 0.01 | 0.09 | < 0.1 | ✅ Tốt |
| INP | — | 155 ms | < 200ms | ✅ Tốt |
| TTFB | 101 ms | 979 ms | < 0.8s | ⚠️ Field hơi cao |

### LCP breakdown (lab)
- TTFB 101ms · Load delay 57ms · Load duration 6ms · **Render delay 451ms** (chiếm phần lớn — JS hydration Next.js)
- LCP node: nodeId 9 (vùng hero/heading)

## Insight đáng chú ý (để Pha 6 tối ưu bản clone)
- **RenderBlocking:** có request chặn render (CSS/JS) — bản clone static nên inline critical CSS, defer JS.
- **ThirdParties:** FB Pixel + Google Ads + AppLovin tải nặng (đến ~252323113902µs) → bản clone nên load async/defer.
- **DOMSize:** DOM lớn (Next.js + nhiều video card) → bản clone giữ DOM gọn.
- **ForcedReflow:** có layout thrashing từ JS.
- **NetworkDependencyTree:** chuỗi request critical → static clone rút ngắn được.

## Khuyến nghị cho bản clone (static)
1. Inline critical CSS hero; defer phần còn lại.
2. Video community/showcase: `preload="none"` + `loading="lazy"` cho dưới màn hình đầu; chỉ video panel preview eager.
3. Ảnh model card: `loading="lazy"`, width/height tường minh để CLS ≈ 0.
4. Font Rubik: `font-display: swap`, preload 1 weight (700) critical.
5. Tracking (Pixel/CAPI) load async — không chặn render.
