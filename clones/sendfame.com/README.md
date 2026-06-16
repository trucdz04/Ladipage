# Clone — sendfame.com/ai-video-generator

Bản clone tĩnh (HTML/CSS/JS) trang **AI Video Generator** của SendFame, dựng theo skill `clone-template`
(EXTRACT → X-RAY → BUILD → VERIFY → TRACKING). Mục đích: học tập / tham khảo / dựng lại UI.

## Chạy thử
Mở `index.html` bằng trình duyệt, hoặc serve tĩnh:
```
npx serve clones/sendfame.com      # hoặc: python -m http.server
```

## Cấu trúc
```
index.html                 # 10 section 00→09 + login modal
styles/{tokens,global,sections}.css
scripts/main.js            # render data + wiring (tab/chip/radio/accordion/modal/reveal)
scripts/tracking-config.js # cấu hình tracking (điền trước khi deploy)
scripts/tracking.js        # Meta Pixel + CAPI(n8n) + dedup + cross-domain CTA
SYSTEM-XRAY.md             # X-quang trang nguồn (9 phần)
SYSTEM-XRAY-CLONE.md       # X-quang bản clone
extraction/                # bằng chứng trích xuất + screenshot + xray-diff.md
```

## Bật tracking (Pha 7)
Sửa `scripts/tracking-config.js`: `PIXEL_ID`, `N8N_WEBHOOK`, `MAIN_DOMAIN`, `ROOT_COOKIE`, `ENABLED:true`.
Hạ tầng n8n dùng template `automation/n8n/cinai-satellite-tracking.workflow.json`.

## Lưu ý bản quyền (trước khi phát hành công khai)
- Thumbnail model = **placeholder gradient** (ảnh thương hiệu bên thứ ba). Thay ảnh hợp lệ của bạn.
- Video community/showcase đang trỏ CDN nguồn — tải local hoặc thay placeholder.
- Logo dùng emoji ✌️ thay cho logo gốc.
