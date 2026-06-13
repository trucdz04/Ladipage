# SYSTEM X-RAY — BẢN CLONE (toonbee.ai) + Đối chiếu nguồn

> X-quang bản clone tại `clones/toonbee.ai/`, so với `SYSTEM-XRAY.md` (nguồn).
> Bản clone tái dựng theo hướng **localize trung thực**: dùng lại đúng CSS + asset gốc, dựng lại cấu trúc
> tĩnh sạch, **loại bỏ** mọi tracking/checkout/3rd-party theo yêu cầu.

## 1–6. Cấu trúc & luồng — TƯƠNG ĐƯƠNG nguồn
| Phần | Nguồn | Clone | Kết luận |
|------|-------|-------|----------|
| 1 Giải thích | Landing sales tĩnh | Landing sales tĩnh | ✅ khớp |
| 2 Bản đồ | 20 khối dọc | 20 khối dọc (banner→footer) | ✅ khớp |
| 3 Luồng thực thi | UI → JS tĩnh → External | UI → JS tĩnh → External (Vimeo) | ✅ khớp (đã cắt tracking/checkout) |
| 4 Agent/tool | KHÔNG CÓ | KHÔNG CÓ | ✅ |
| 5 ERD | KHÔNG CÓ | KHÔNG CÓ | ✅ |
| 6 API | Tĩnh + Vimeo/CDN/checkout/tracking | Tĩnh local + Vimeo embed | ✅ (bỏ checkout/tracking — chủ đích) |

## 7. Vấn đề — clone KHÔNG phát sinh lỗi/nút thắt mới
- Console sạch (chỉ cảnh báo Vimeo `allowfullscreen` + CORB từ embed bên thứ 3 — vô hại).
- Đã sửa 404 `withvid.png` (poster → dùng `noothertool.webp`).
- `section8.webp` thiếu cả ở nguồn (CSS background không tồn tại trên origin) → bỏ qua, không ảnh hưởng.
- Tối ưu hơn nguồn: thêm `prefers-reduced-motion`, focus-ring a11y, lazy-load giữ nguyên (IntersectionObserver).

## 8. Lộ trình rebuild — đã hoàn tất 1→6 (agent: KHÔNG CÓ)
fix nền tảng ✅ · refactor cấu trúc ✅ · architecture (main.js wiring) ✅ · performance (lazy-load) ✅ · production (bỏ tracking/checkout) ✅.

## 9. Flowchart CRUD mẫu — giống nguồn (FAQ toggle + lazy-load + countdown)

## CHÊNH LỆCH CÓ CHỦ ĐÍCH (so với nguồn)
| Hạng mục | Nguồn | Clone | Lý do |
|----------|-------|-------|-------|
| Meta Pixel x2 / Google Ads / tracking riêng | Có | **Bỏ** | User chọn không tracking |
| Checkout FastSpring (`#paymentpopup`) | Có | **Bỏ** → CTA trỏ `#pricing`/`#buynow` | Clone học tập, không thanh toán thật |
| Social-proof widget (PageDock) | Có | **Bỏ** | 3rd-party tracking |
| `#timer` countdown | Trong popup | Logic giữ nhưng không có target (popup đã gỡ) | Phụ thuộc popup |
| Vimeo video | Embed | Giữ embed (autoplay muted/loop) | Nội dung bên ngoài |

**Kết luận đối chiếu:** 2 báo cáo **tương đương về cấu trúc & luồng dữ liệu**. Khác biệt duy nhất là phần
tracking/checkout/3rd-party đã được cố ý loại bỏ. KHÔNG phát sinh lỗi/nút thắt mới. → **PASS**.
