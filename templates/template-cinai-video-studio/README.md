# Template CinAI Video Studio

Landing **AI Video & Workflow Studio** thương hiệu **CinAI.tv**, rebrand từ bản clone
`sendfame.com/ai-video-generator` (dark-luxury tím). Tĩnh HTML/CSS/JS, dựng theo skill
`clone-template`. Mục đích: marketing/landing cho CinAI.tv.

## Đặc điểm
- **Thương hiệu CinAI**: logo `assets/cinai/cinai-logo.svg`, nội dung + meta/OG = CinAI.tv.
- **Nối thẳng sang cinai.tv**: mọi CTA (Sign In, Sign up to Try, View all, Read more), tile video
  Community và card Model đều trỏ `https://cinai.tv` / `/login` / `/pricing`.
- **Video demo CinAI** (local, hợp bản quyền): hero preview + Community grid dùng `assets/media/cinai-*.mp4`.
- **Model = model CinAI kết nối** ("Connect 100+ AI models"): Seedance 2.0, Kling V3 Pro, Veo 3.1,
  Hailuo, GPT Image 2, Nano Banana, Omni, Opus 4.8 — thumbnail = ảnh output thật của CinAI (`out-*`).
- 7 section: header/mega-menu (Videos·Models·Workflows) · hero + generator panel · Community (masonry
  full-width, fade đáy) · Features (5 card) · Explore Models · FAQ · footer/epic. + login modal.

## Chạy thử (local)
```bash
cd templates/template-cinai-video-studio
npx -y serve -l 8099 .
# mở http://localhost:8099
```

## Cấu trúc
```
index.html                 # 7 section + login modal
styles/{tokens,global,sections}.css   # token tím dark-luxury
scripts/main.js            # render Community/Models/FAQ + wiring (tab/chip/radio/accordion/modal/reveal)
scripts/tracking-config.js # cấu hình tracking (điền {{PIXEL_ID}}, {{N8N_WEBHOOK}} trước deploy)
scripts/tracking.js        # Meta Pixel + CAPI(n8n) + dedup + cross-domain CTA (MAIN_DOMAIN=cinai.tv)
assets/cinai/              # logo + ảnh output (thumbnail model)
assets/media/              # video demo CinAI
SYSTEM-XRAY*.md, extraction/  # tài liệu tham chiếu từ bản gốc
```

## Trước khi deploy
- Điền `{{PIXEL_ID}}`, `{{N8N_WEBHOOK}}` trong `scripts/tracking-config.js`, đặt `ENABLED: true`.
- Kiểm tra lại link `cinai.tv/login`, `cinai.tv/pricing` đúng route thật.
