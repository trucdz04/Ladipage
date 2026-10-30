# Performance notes

## Nguồn TVCAI

- DOM desktop quan sát: khoảng 1.973 element, 156 ảnh, 63 video.
- Trang dài khoảng 15.964 px tại viewport 1920 px.
- Một request `/api/events` trả 400; không được sao chép sang CinBase.

## CinBase local sau rebuild

- 12 poster hero local: khoảng **0,76 MB** tổng.
- 24 ảnh Skill local: khoảng **0,93 MB** tổng.
- Tour WEBM local: khoảng **4,8 MB**, dùng `preload="metadata"`.
- Tối đa một hero video remote có `src`; slide ẩn bị pause/unload.
- Reduced motion tại first load: **0 hero video remote có `src`**.
- Performance trace desktop local: **LCP 275 ms**, **CLS 0,02**, không throttle.
- Lighthouse desktop vòng cuối: **Accessibility 100, Best Practices 100, SEO 100, Agentic Browsing 100**; 60 audit pass, 0 fail.

Vẫn cần đo lại trên host production/CDN vì kết quả local không bao gồm độ trễ hạ tầng thật.
