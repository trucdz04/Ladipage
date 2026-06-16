# LOGIC — Generator Panel (SNAPSHOT_BEFORE)

> Component động trọng tâm (section 03). **Toàn bộ là state UI client-side**; hành động thật ("generate") bị gate sau login modal. Bản clone tái dựng các toggle trạng thái + CTA mở modal đăng ký.

## [input → state → render] theo 4 trục

### 1. STATE
| State | Giá trị | Mặc định |
|-------|---------|----------|
| `activeTab` | `image` \| `text` \| `extend` | `image` (Image to Video) |
| `selectedModel` | `ultra-2.6` \| `ultra-2.7` \| (+8 more) | `ultra-2.6` |
| `duration` | `5s` \| `10s` (+20cr) \| `15s` (+40cr) | `5s` |
| `resolution` | `720p` \| `1080p` (+10cr) | `720p` |
| `promptText` | string | sample prompt có sẵn |
| `uploadedImage` | file/sample | sample `monster-medium.jpeg` |

### 2. TRANSFORM (input → state)
- Click tab → set `activeTab`; đổi nội dung form (Image: hiện Upload Image; Text: ẩn upload, chỉ prompt; Extend: chọn video nguồn).
- Click model card → set `selectedModel` (radio, single-select).
- Click duration/resolution chip → set tương ứng (single-select mỗi nhóm).
- Nhập textarea → cập nhật `promptText`.
- "Use sample image" / "Change image" → set `uploadedImage`.
- Click **Signup to Try!** → mở **login modal** (không generate khi chưa đăng nhập).

### 3. ANIMATION (state → render feedback)
- Tab active: nền `bg-gradient` tím + chữ trắng; tab thường: `text-gray-3` (gray-400). Transition `all 0.15s cubic-bezier(0.4,0,0.2,1)`.
- Chip duration/resolution chọn: viền/nền accent tím (`border-purple-500`, `bg-purple-500/10`), `rounded-xl`. Chuyển `transition-all`.
- Model card chọn: viền tím + dấu check tròn tím (radio). `rounded-xl p-2.5`.
- Badge "New"/"Just Launched": shimmer `shine-infinite 2s`.

### 4. CONSTRAINT
- Mỗi nhóm (tab/duration/resolution/model) **single-select** — luôn có đúng 1 active.
- Duration/resolution cao hiển thị "+N credits" (chỉ nhãn, không tính phí ở clone).
- "Generate"/preview thật yêu cầu login → clone chỉ mở modal CTA (data-track-lead/CTA về MAIN_DOMAIN).
- Player preview phía phải: video autoplay/loop/muted + hàng nút (Save/Extend/Upscale/Continue from last frame) — ở clone là demo tĩnh (disabled hoặc mở modal).

## Cấu trúc DOM panel (rebuild)
```
.panel (rounded-2xl, bg zinc-900/ glass border-white/10)
├── banner "NEW · Try the new Wan 2.7 Extend Video"
├── header: "Turn Images into Videos with AI" + a.link "Login to generate videos"
├── grid 2 cột (desktop) / stack (mobile):
│   ├── LEFT (form):
│   │   ├── "Select AI Version" → 2 model radio card + "See More Models +8 more"
│   │   ├── tab group: Image to Video | Text to Video | Extend Video
│   │   ├── Upload Image (dropzone + "Use sample image"/"Change image")
│   │   ├── Prompt (textarea, placeholder "Describe how the image should animate...")
│   │   ├── Video Duration: 5s | 10s | 15s (chip)
│   │   ├── Video Resolution: 720p | 1080p + "Click to see more options"
│   │   └── CTA "Signup to Try!" (purple) + note "Now generate more videos while you wait"
│   └── RIGHT (preview):
│       ├── video player (autoplay/loop/muted, 0:06/...) + progress
│       └── nút: Save · Extend video · Upscale video · Continue from last frame · Generate or edit an image
```

## Player button labels (đo thật)
Save · Extend video · Upscale video · Continue from last frame · Generate or edit an image

## INP / FPS
- Field INP 155ms (toggle nhẹ, DOM nhỏ). Clone target INP < 200ms, FPS ≥ 55 — dễ đạt vì chỉ class swap.
