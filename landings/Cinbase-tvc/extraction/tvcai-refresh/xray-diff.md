# X-Ray diff — TVCAI reference vs CinBase TVC

Ngày đối chiếu: **2026-10-07**

## Bằng chứng kiểm tra

- Nguồn: `dom-tree.json`, `reference-audit.md`, `SYSTEM-XRAY-TVCAI.md`.
- Bản local desktop: `local-desktop-full.webp` — 1440 × 900 viewport.
- Bản local mobile: `local-mobile.webp` — 375 × 812 viewport.
- Runtime: Chrome DevTools + Playwright tại cổng `4173`.

## Đối chiếu cấu trúc và hành vi

| Hạng mục | TVCAI quan sát được | CinBase triển khai | Trạng thái |
|---|---|---|---|
| Header | Fixed, cao 72 px, nav rút gọn ở mobile | Fixed 72 px desktop/64 px mobile, mobile menu có Escape | Đạt |
| Hero | Full viewport, media nền, copy trái, pager phải | Full viewport, 12 tác phẩm CinAI, copy trái, pager phải | Đạt về hệ bố cục |
| Rail nổi | Rail card chồng lên đáy hero | 12 thumbnail local, scroll-snap, active state | Đạt |
| Nhịp section | Shell 72rem, khoảng dọc 128 px | Shell 72rem, section `clamp(80px, 8vw, 128px)` | Đạt |
| Mobile | Gutter 16 px, nav ẩn, rail ngang | Gutter 16 px, không overflow, rail ngang | Đạt |
| FAQ | Native details | Native details, chỉ một mục mở | Đạt |
| Video runtime | Nhiều media/card có thể mở dialog | Chỉ hero active có `src`; tour có controls | Cải thiện tải ban đầu |
| Nội dung | Khóa học làm phim AI cá nhân | Đào tạo TVC AI cho đội ngũ doanh nghiệp | Chủ động thay đổi |
| Showcase | Gallery chương trình/học viên | 24 Skill công khai + 12 Canvas works | Chủ động thay đổi |
| Modal/dialog | Card showcase mở dialog | Không sao chép vì không cần cho flow tư vấn | Chủ động lược bỏ |
| Analytics nguồn | Có request `/api/events` 400 quan sát được | Giữ tracking repo; localhost tự tắt | Không sao chép lỗi nguồn |

## Kết quả kỹ thuật

- Một `h1`, 11 `h2`, 24 Skill card, 12 hero slide.
- 38 tham chiếu asset local, **0 file thiếu**.
- `node --check scripts/main.js`: **OK**.
- Desktop 1440 × 900 và mobile 375 × 812: **không overflow ngang**.
- Tương tác đã chạy: hero next/pause, filter Design = 3 Skill, process tabs, FAQ single-open, mobile menu.
- Lighthouse desktop vòng cuối: Accessibility **100**, Best Practices **100**, SEO **100**, Agentic Browsing **100**; 60 audit pass, 0 fail.

## Sai lệch còn lại

### CRITICAL

Không có.

### MAJOR

Không có lỗi chức năng đã biết.

### MINOR

1. Font Google và MP4 hero vẫn phụ thuộc mạng ngoài; poster/Skill/tour đã có fallback local.
2. Cần chạy lại performance/network trên host/CDN production vì kết quả local không phản ánh độ trễ hạ tầng thật.
3. Đây là bản chuyển hệ bố cục và hành vi, không tuyên bố pixel-perfect hoặc sao chép nội dung TVCAI.

## Trạng thái

**OK** cho local preview và vòng QC hiện tại. Trước deploy cần xác nhận domain/canonical, giá/quyền lợi CinAI mới nhất và điều khoản ưu đãi trong hợp đồng.
