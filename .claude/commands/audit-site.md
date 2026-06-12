---
description: Audit một trang web về bug, bảo mật và hiệu năng; trả báo cáo phân loại Critical/Major/Minor bằng tiếng Việt.
---

# /audit-site — Audit bug / security / performance

URL: **$ARGUMENTS**

## Quy trình (phân tích trước, kết luận sau)
1. **Chức năng & bug** — `mcp-chrome-power-user` inspect: console errors,
   network fail, state sai. `qa-automation-agent` chạy thử luồng chính (mobile iPhone 12).
2. **Bảo mật (quan sát phía client):**
   - Header bảo mật (CSP, HSTS, X-Frame-Options...) qua network response.
   - Lộ secret/token trong JS/network, form thiếu CSRF, link/script bên thứ ba đáng ngờ.
   - Mixed content, dùng `http` cho dữ liệu nhạy cảm.
3. **Hiệu năng** — `performance_start_trace`/`stop_trace`:
   - Core Web Vitals (LCP, INP, CLS), tài nguyên render-blocking, ảnh quá khổ, JS nặng.
4. Đối chiếu với chuẩn của project (web/performance, web/security).

## Output (tiếng Việt phi kỹ thuật)
1. **Tổng quan** trang.
2. **Danh sách phát hiện** phân loại:
   - 🔴 CRITICAL (lỗi nặng / lỗ hổng bảo mật)
   - 🟠 MAJOR (lỗi chức năng / hiệu năng kém rõ rệt)
   - 🟡 MINOR (đề xuất cải thiện)
   kèm **nguyên nhân gốc**.
3. **Đề xuất fix** giải thích đơn giản.
4. **Kết luận:** mức độ sẵn sàng release (OK / cần xử lý trước).

## Ranh giới
- Chỉ audit ở góc độ phòng thủ/quan sát hợp pháp; không tấn công, không dò quét xâm nhập.
- Không thử khai thác lỗ hổng; chỉ báo cáo và đề xuất khắc phục.
