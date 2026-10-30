# Behavior map

| Thành phần | Input | State/Output |
|---|---|---|
| Announcement | Click close | Ẩn bar, đồng bộ biến chiều cao header |
| Mobile nav | Click, Escape, breakpoint | Đổi `aria-expanded` và `hidden` |
| Hero pager/thumb | Click hoặc Arrow/Home/End | Đổi active index, poster/video, `aria-current` |
| Hero autoplay | 6 giây | Chỉ đổi slide khi visible, tab visible, không hover/focus/pause/reduced-motion |
| Hero pause | Click toggle | Pause video/timer; đồng bộ label và pressed state |
| Skill filter | Click hoặc Arrow/Home/End | Đổi `aria-pressed`, `hidden`, count, reset rail |
| Skill arrows | Click | Cuộn ngang 80% viewport rail |
| Process tabs | Click hoặc Arrow/Home/End | Đổi tab active và tabpanel visible |
| FAQ | Toggle details | Giữ tối đa một mục mở |
| Reveal | IntersectionObserver | Thêm class visible; bỏ qua khi reduced-motion |

TVCAI nguồn còn có card mở dialog/video; hành vi này không được đưa sang bản CinBase vì không phục vụ luồng chính.
