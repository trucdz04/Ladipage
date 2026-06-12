---
description: Phân tích sâu một trang web đang chạy — DOM, JS events, network, state, console — qua chrome-devtools MCP.
---

# /inspect-site — Phân tích sâu một trang

URL (và khu vực/luồng cần soi, nếu có): **$ARGUMENTS**

## Nhiệm vụ
Giao cho agent **mcp-chrome-power-user** phân tích realtime. Tập trung **MỘT** khu vực/luồng
mỗi lần (nguyên tắc: một prompt = một phần).

## Các bước
1. `navigate_page` tới URL → `take_snapshot` lấy cấu trúc.
2. Mô phỏng tương tác liên quan (click/fill/hover) ở khu vực cần soi.
3. Thu thập tín hiệu:
   - Console: `list_console_messages`
   - Network: `list_network_requests` + `get_network_request`
   - State/DOM: `evaluate_script`
4. (Tuỳ chọn) đo hiệu năng bằng `performance_start_trace`/`performance_stop_trace`.
5. Chẩn đoán nguyên nhân gốc.

## Output (tiếng Việt)
- Khu vực/luồng đã phân tích.
- Phát hiện (Critical/Major/Minor) + nguyên nhân.
- Đề xuất fix tối thiểu, không phá vỡ logic.
