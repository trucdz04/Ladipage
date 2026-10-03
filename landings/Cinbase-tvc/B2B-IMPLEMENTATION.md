# B2B refresh — 03/10/2026

## Cổng 1: chiến lược FCB

GC1, mức cân nhắc cao, Learn → Feel → Do; ưu tiên 80% lý trí / 20% cảm xúc (định hướng biên tập, không phải số liệu khảo sát). Người mua là quản lý doanh nghiệp hoặc đơn vị đào tạo. Giá chương trình theo phạm vi, chưa có giá B2B được duyệt. Trigger: công việc tồn đọng, mong muốn tự chủ, nhu cầu dự toán. Không dùng FOMO giả hoặc hứa thay toàn bộ nhân sự.

## Cổng 2: tâm lý

Bề mặt: nhiều công cụ, phí phát sinh, học xong không áp dụng. Sâu hơn: thiếu SOP và người kiểm tra. Danh tính: người quản lý lo đầu tư không tạo hiệu quả. Đây là giả thuyết từ nghiên cứu, không phải lời kể khách hàng.

Kết quả mong muốn: đội chạy được công việc lặp lại; quản lý biết kiểm tra; có quy trình để bàn giao người mới. Rào cản: học phí, credit, thời gian học, trình độ đầu vào, chất lượng đầu ra, dữ liệu, lịch hỗ trợ, phạm vi bàn giao. Ngôn ngữ: việc thật, đội ngũ, người duyệt, chi phí thực hành, quy trình. Tránh toàn diện, đột phá, đảm bảo doanh số.

## Cổng 3: cấu trúc

Giữ template gốc: hero (rõ đối tượng) → vấn đề (nhận diện) → demo Explore (kiểm chứng) → ứng dụng (liên hệ việc thật) → năng lực đào tạo (giảm phức tạp) → quy trình (hinge: hiểu cơ chế) → đề nghị B2B/voucher (điều kiện rõ) → tài liệu miễn phí (cho giá trị) → FAQ (giảm rủi ro) → liên hệ (hành động nhỏ).

Không có case đào tạo đã xác minh: không dựng testimonial. Dùng demo sản phẩm có nhãn, ghi rõ không phải bằng chứng kết quả học viên. Không xác nhận giá Pro khi nguồn còn mâu thuẫn; dẫn Explore để xem nền tảng, gói doanh nghiệp tư vấn riêng.

## Triển khai và giới hạn

Chỉnh nội dung trong HTML gốc, giữ class/layout, section ID và tương tác. Media lấy từ manifest Explore có sẵn; ưu tiên commercial/avatar/subtitle, tour giao diện thật. Media khám phá dẫn https://cinai.tv/explore. Không dùng cảnh quay sản phẩm để giả minh họa bước khảo sát/đào tạo.

Voucher theo brief: 1.000 suất cho đơn vị đào tạo, giảm 50% ba tháng đầu khi ký một năm, tặng hai tháng. Chưa tính giá sau giảm hoặc cam kết thời hạn tổng khi chưa chốt điều khoản.

Bản tiếng Việt là bản được biên tập; không bật tự dịch bằng từ điển Pro cũ. Không deploy hoặc gửi thử dữ liệu lên CRM. Liên hệ thật qua điện thoại/email; form cũ không được gọi là đã nhận yêu cầu khi chưa xác nhận backend.

## Kiểm tra cần hoàn tất

- Review độc lập FCB/CRO sau triển khai.
- Desktop/mobile, FAQ, tabs, anchors, media tải được.
- Không còn giá/voucher Pro cũ trên trang; Explore đúng URL.
- Chốt giá B2B, pháp nhân, SLA, thể lệ voucher và quyền tái sử dụng media trước xuất bản.

## Kết quả triển khai / QC

- Đã chỉnh hero, vấn đề, năng lực đào tạo, lộ trình 4 bước, tiêu chí đánh giá, hai nhóm B2B, voucher, FAQ và liên hệ trên HTML gốc.
- Gỡ bảng giá Pro cũ khỏi trang vì chưa thống nhất nguồn; không sửa nguồn giá chung. Gỡ popup voucher cũ và form không có xác nhận backend; CTA gọi/email thật, không giả thông báo đã nhận lead.
- Không tải từ điển tiếng Anh cũ để tránh nội dung Pro lẫn bản B2B; bản này là tiếng Việt.
- Giữ tour Explore có sẵn; các tab media còn commercial/avatar/animation/subtitle. Bỏ music/drama/interactive khỏi gallery và mục ứng dụng để giảm nội dung giải trí lệch trọng tâm. Hero dùng ảnh giao diện Explore; quy trình dùng nội dung hướng dẫn thật, không dùng tour lặp cho từng bước.
- Đã mở Explore ngày 03/10/2026: có thư viện skill và các mẫu công việc. Số lượng tài liệu tặng vẫn tách khỏi số skill trên nền tảng.
- Review độc lập FCB: không CRITICAL, điểm copy định tính 8/10. Đã sửa 1 MAJOR (quyền lợi Pro sót), 2 MINOR (câu kiểm tra quyền lợi, lời hứa chuẩn ads).
- Playwright desktop 1440px, mobile 390px: không tràn ngang; không lỗi JavaScript; không ảnh hỏng; anchors đủ đích; 4 tab/4 panel media khớp; chuyển tab quy trình và mở FAQ thành công.
- Các liên kết nền tảng dùng /explore; tracking hiện hữu có thể nối query attribution nhưng không đổi đường dẫn. Chưa thay tracking, chưa gửi dữ liệu dịch vụ ngoài, chưa deploy.
- Ảnh QC: `.playwright-mcp/b2b-desktop.png`, `b2b-mobile.png`, `b2b-process.png` tại root repo.
- Cảnh báo còn lại: Tailwind CDN hiện hữu không phù hợp production build; chưa kiểm thử CRM/analytics end-to-end; thiếu case đào tạo được xác minh và thể lệ thương mại hoàn chỉnh. Bản local để duyệt, chưa sẵn sàng chạy ads.
