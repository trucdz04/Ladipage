# X-RAY Diff — Nguồn ↔ Clone

| Phần X-RAY | Nguồn | Clone | Kết luận |
|------------|-------|-------|----------|
| 1 Giải thích | Landing AI video, gated | Landing tĩnh tái dựng, gated | ✅ Tương đương |
| 2 Bản đồ | 10 section + modal | 10 section + modal | ✅ Khớp 1-1 |
| 3 Luồng thực thi | UI → (gated) backend ẩn | UI → client state, không backend; +tracking n8n | ✅ Tương đương (public surface) |
| 4 Agent/tool | KHÔNG CÓ | KHÔNG CÓ | ✅ |
| 5 ERD | KHÔNG CÓ (content tĩnh) | KHÔNG CÓ (content model JS) | ✅ |
| 6 API | ẩn sau auth | N8N_WEBHOOK (Pha 7) | ✅ Tương đương |
| 7 Vấn đề | TTFB field cao, 3rd-party nặng | Console sạch, không lỗi mới | ✅ Không phát sinh nút thắt |
| 8 Lộ trình | — | Đã build theo lộ trình | ✅ |
| 9 Flowchart | PanelState gated | PanelState gated | ✅ |

## Lệch còn lại (phân loại)
- **MINOR** — Thumbnail 8 model: nguồn dùng ảnh thương hiệu (R2/cdn-cgi) chặn hotlink → clone dùng **placeholder gradient có chủ đích** (đúng chính sách asset). Thay ảnh hợp lệ trước khi phát hành nếu cần.
- **MINOR** — Video community/showcase phụ thuộc CDN nguồn (`videos.sendfame.com`, `cdn.higgsfield.ai`); panel preview + showcase tải được, vài card cộng đồng `preload=none` chỉ phát khi hover. Nên tải local hoặc thay placeholder cho bản phát hành.
- **Không có CRITICAL/MAJOR cấu trúc.** 2 báo cáo X-RAY **tương đương** → PASS, không cần quay lại Pha 5.
