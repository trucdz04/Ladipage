# Landings — bản triển khai (QC tách biệt với templates)

Thư mục này chứa các **landing page bản triển khai/QC** — tách khỏi `../templates/` (kho template tham chiếu).
QC, sửa nội dung, gắn tracking và deploy diễn ra ở đây; `templates/` giữ nguyên làm bản mẫu sạch để clone lại.

> **Ranh giới:** `templates/` = bản gốc tham chiếu (đừng QC/sửa production ở đó). `landings/` = bản thật chạy QC → deploy.

## Danh sách landing

| Tên | Thư mục | Nguồn | Mô tả |
|-----|---------|-------|-------|
| **CinAI Cartoon LP (lean)** | `template-cinai-cartoon-lp/` | dựng từ `templates/template-cartoon` | Landing **8 section gọn** bán Pro/Plus, dark-luxury + gold, copy EN giọng creator, FCB GC2. Media = output CinAI thật. CTA → `cinai.tv/signup?plan=pro\|plus`. |
| **CinAI Cartoon LP (mid)** | `cinai-cartoon-mid/` | cắt từ `templates/template-cartoon` | Landing **mid-length (~11 section)**, **song ngữ VI/EN** — giữ style cartoon. Bán **Pro $29 / Plus $49** (Plus nổi bật). Đã: thay carousel→**marquee 9:16/16:9**, bỏ section thừa/sai (demo kinh dị, money-back bịa, bonus ToonBee), thêm **lead-magnet (form email→nurture)**, ảnh CinAI mockup. **Media nén 243MB→18MB** + poster + play/pause. **Tracking** (Pixel+CAPI) đã gắn. Responsive ✓. |
| **Cinbase TVC** | `Cinbase-tvc/` | (chuyển từ `templates/`) | Landing Cinbase-tvc — QC/triển khai. |

## Chạy local 1 landing
```bash
cd landings/template-cinai-cartoon-lp
npx -y serve -l 8101 .
# http://localhost:8101
```

## Tối ưu media (đã áp dụng toàn bộ landings)
Nén + cắt loop 15s + tạo poster cho mọi video (ffmpeg portable `C:\Users\Admin\ffmpeg`). Backup gốc tại
`C:\Users\Admin\ladipage-media-backup\<landing>\`. Kết quả `assets/media`:

| Landing | Trước | Sau |
|---------|------|-----|
| cinai-cartoon-mid | 243MB | **18MB** |
| Cinbase-tvc | 122MB | **47MB** |
| cinai-studio-qc | 122MB | **47MB** |
| cinai-video-studio-qc | 39MB | **23MB** |
| template-cinai-cartoon-lp | 11MB | **5MB** |

Kỹ thuật "mượt như mstudio.ai": clip nhẹ + **poster .webp** + **play/pause theo viewport** (chỉ phát clip đang thấy).
Cinbase-tvc & cinai-studio-qc đã có poster + play/pause sẵn → chỉ nén file.

## Quy ước
- Giá CinAI dùng chung vẫn lấy từ `../templates/_shared/cinai-pricing.md` (source of truth).
- Trước deploy mỗi landing: thay asset đúng chiến dịch · chốt giá/credit · gắn tracking (`/tracking-setup`) · QA mobile · CRO review.
- Khi cần một landing mới từ template: clone trong `templates/` → đưa bản làm việc sang `landings/` để QC.
