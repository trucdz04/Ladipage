# Catalog 24 CinAI Skills dùng cho landing CinBase TVC

Thời điểm kiểm chứng: **2026-10-07**.

## Nguồn và phạm vi

- Trang công khai: `https://cinai.tv/explore`.
- API công khai: `GET https://api.cinai.tv/api/entities/public/agent-skills`.
- Tổng số skill đang bật quan sát được: **1.143**.
- Landing chỉ dùng **24 skill tuyển chọn**, trải trên **10 nhóm** để tránh tải cả thư viện vào một trang bán hàng.
- Metadata chi tiết và nguồn từng ảnh nằm trong [`skills-catalog.json`](./skills-catalog.json).
- Ảnh đã được lưu cục bộ ở `landings/Cinbase-tvc/assets/skills/`; tổng 24 file JPEG khoảng 0,93 MB.
- Số lượt dùng là ảnh chụp dữ liệu tại thời điểm kiểm chứng, không phải cam kết cố định.

## Phân bố toàn thư viện

| Nhóm | Số skill công khai |
|---|---:|
| Cinematic | 351 |
| Story | 235 |
| Marketing | 161 |
| Video | 139 |
| Design | 79 |
| Social | 60 |
| Explainer | 37 |
| Music | 37 |
| Game | 31 |
| Remake | 11 |
| Studio | 2 |

Tổng: **1.143**.

## Danh sách tuyển chọn

| # | Skill | Nhóm | Tác giả | Lượt dùng |
|---:|---|---|---|---:|
| 1 | UGC Product Ad x10 | Marketing | CinAI | 27 |
| 2 | Food & Beverage TVC | Marketing | CinAI | 5 |
| 3 | Narrative TVC 15s/30s | Marketing | CinAI | 19 |
| 4 | E-Commerce Product Visuals and Details | Marketing | Jackpoors | 227 |
| 5 | Card Game UA Ad | Game | CinAI | 2 |
| 6 | Gameplay PV / Trailer | Game | CinAI | 6 |
| 7 | Ancient History / Mythology Teaser | Story | CinAI | 12 |
| 8 | Suspense / Horror Short | Story | CinAI | 0 |
| 9 | Objects Come Alive | Story | CinAI | 0 |
| 10 | Vox-Style Explainer | Explainer | CinAI | 6 |
| 11 | Talking Head Educational Script Generator | Explainer | Devilworld | 121 |
| 12 | History POV | Explainer | CinAI | 0 |
| 13 | Music Video | Music | CinAI | 4 |
| 14 | Healing Music Video Creator | Music | TTyears | 81 |
| 15 | Character Design Sheet | Design | CinAI | 1 |
| 16 | Multi-Angle Environment Concept Sheet | Design | PixelHarbor | 412 |
| 17 | Brand Key Visual Poster Designer | Design | Jackpoors | 69 |
| 18 | Subtitle Localize | Remake | CinAI | 0 |
| 19 | Reference Video Remake Workflow | Remake | VividEcho | 317 |
| 20 | AI Movie Fight Scene Prompts | Cinematic | XiaoAIGC | 742 |
| 21 | Cinematic Storyboard Director | Cinematic | Tingfeng | 1 |
| 22 | AI Video Lighting Prompts | Cinematic | XiaoAIGC | 547 |
| 23 | AI Video Prompt Engineer | Video | ShiziAICG | 291 |
| 24 | Article to Viral Short Video | Social | Canghe | 169 |

## Quy tắc tích hợp vào landing

- Render HTML tĩnh để công cụ tìm kiếm và người dùng vẫn đọc được tên skill khi JavaScript tắt.
- Ảnh dùng `loading="lazy"`, kích thước khai báo trước và nguồn cục bộ.
- Filter dùng button có `aria-pressed`; đây là bộ lọc, không giả làm tab.
- Không tự tạo URL chi tiết theo slug vì chưa truy vết được route public ổn định. CTA “Xem toàn bộ Skills” trỏ tới trang Explore chung.
- Video preview chỉ được tải khi thật sự cần; catalog giữ URL có thật cho bảy mục đã quan sát thấy video công khai.

