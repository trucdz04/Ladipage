# Landing QC — CinAI Video Studio (song ngữ EN/VN)

Bản **landing quảng cáo (QC)** cho **CinAI.tv**, dẫn xuất từ template `template-cinai-video-studio`
(dark-luxury tím). Tĩnh HTML/CSS/JS. Dùng để chạy ads cho **cả thị trường Việt Nam và nước ngoài**.

## Khác biệt so với template gốc
- **Song ngữ EN/VN** — tự nhận ngôn ngữ trình duyệt (`vi*` → Tiếng Việt, còn lại → English),
  có nút toggle **VI / EN** ở header, lưu lựa chọn vào `localStorage`. Engine: `scripts/i18n.js`.
- **Section Pricing Pro/Plus** — 2 card + toggle **Monthly / Yearly** (mặc định Yearly),
  liệt kê **quyền lợi từng gói**. Nguồn số liệu: `../../templates/_shared/cinai-pricing.json` (source of truth).
- CTA pricing trỏ `cinai.tv/signup?plan=pro|plus`, giữ utm/fbclid qua `tracking.js` (cross-domain).

## Cấu trúc
```
index.html                 # 8 section + pricing + login modal (mọi text gắn data-i18n)
styles/{tokens,global,sections}.css
scripts/i18n.js            # từ điển EN/VN + detect + apply + toggle + sự kiện cinai:langchange
scripts/main.js            # render Community/Models/FAQ (theo ngôn ngữ) + billing toggle + wiring
scripts/tracking-config.js # window.CINAI_CONFIG — ĐÃ điền giá trị thật (Pixel + webhook n8n live)
scripts/tracking.js        # Meta Pixel + CAPI(n8n, beacon text/plain) + dedup event_id + CTA passthrough sang cinai.tv
assets/                    # logo + ảnh output + video demo CinAI
```

## Cơ chế i18n (cách thêm/sửa text)
- Text thường: `<span data-i18n="key">…</span>` → đổi `textContent`.
- Có thẻ con (`<em>`, `<strong>`): `data-i18n-html="key"` → đổi `innerHTML`.
- Thuộc tính: `data-i18n-attr="placeholder:key"` (nhiều cặp cách nhau bằng `;`).
- Nội dung render bằng JS (mô tả model, FAQ): nằm trong `DYNAMIC` của `i18n.js`.
- Sửa bản dịch → chỉ sửa từ điển `DICT.en` / `DICT.vi` trong `scripts/i18n.js`.

## Chạy thử (local)
```bash
cd landings/cinai-video-studio-qc
npx -y serve -l 8099 .
# mở http://localhost:8099  — bấm VI/EN để đổi ngôn ngữ, bấm Monthly/Yearly ở Pricing
```

## Tracking (đã gắn — verified live)
- `scripts/tracking-config.js` đã điền: Pixel `2215508219251213`, webhook `https://n8n.halcion.vn/webhook/cinai-track`
  (workflow "CinBase — Satellite Landing Tracking", id `B86AJPMPpv5QhlMj`, active).
- Tự bắn **PageView + ViewContent** khi load; **Lead** khi submit form modal (→ Lark); **Scroll 25/50/75** + click `[data-track]`.
- **CTA passthrough**: mọi `a[data-cta]` trỏ cinai.tv được nối thêm `utm_*`, `fbclid`, `_fbp`, `_fbc` → cinai.tv dedup/attribute được.
- Đã verify end-to-end: load trang tạo execution success trên n8n + Meta CAPI.

## Trước khi deploy
- **Đặt `DEBUG: false`** trong `scripts/tracking-config.js` (đang `true` để tiện kiểm tra local).
- Nếu host trên **subdomain cinai.tv** (vd `go.cinai.tv`): đặt `ROOT_COOKIE: ".cinai.tv"` để _fbp/_fbc dùng chung first-party. Khác domain thì để trống (đã có passthrough URL).
- Kiểm tra route thật: `cinai.tv/login`, `cinai.tv/pricing`, `cinai.tv/signup?plan=pro|plus`.
- **Placeholder bảng giá cần xác nhận** (theo `_shared/cinai-pricing.json`): số credit cụ thể mỗi gói; giá neo "gốc" ($43/$66/$89/$111) dùng minh hoạ ưu đãi 56%.
- **Placeholder bảng giá cần xác nhận** (theo `_shared/cinai-pricing.json`):
  số credit cụ thể mỗi gói, hiển thị tổng giá năm ($228 / $468), cơ chế free-trial,
  có giữ badge "Most popular" ở Pro hay đẩy sang Plus.
