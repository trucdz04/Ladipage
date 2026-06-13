# Tokens trích từ mstudio.ai (Pha 1a — STATIC)

> Nguồn: `getComputedStyle(:root)` thật trên trang. Hệ token HSL (Tailwind + shadcn-style).
> Chính thức hoá thành `styles/tokens.css` ở Pha 3.

## 1. Màu (HSL — định dạng `H S% L%`)

| Token | Giá trị HSL | Tương đương | Vai trò |
|---|---|---|---|
| `--background` | `240 10% 4%` | ~`#09090b` | Nền chính (near-black, hơi xanh) |
| `--background-elevated` | `240 6% 10%` | ~`#18181b` | Nền nổi (card) |
| `--background-subtle` | `240 5% 15%` | ~`#26262b` | Nền phụ |
| `--foreground` | `240 5% 96%` | ~`#f4f4f5` | Chữ chính |
| `--foreground-muted` | `240 4% 58%` | ~`#909096` | Chữ phụ |
| `--card` | `240 6% 10%` | ~`#18181b` | Card |
| `--card-foreground` | `240 5% 96%` | | Chữ trên card |
| `--primary` | `32 47% 80%` | ~`#e0c9a6` (gold/tan) | Màu nhấn chính (vàng kem) |
| `--primary-foreground` | `0 0% 20%` | `#333` | Chữ trên nút primary |
| `--accent` | `32 47% 80%` | gold | Nhấn (giống primary) |
| `--accent-hover` | `32 47% 70%` | gold đậm | Hover |
| `--secondary` | `240 5% 15%` | ~`#26262b` | Nút phụ |
| `--muted` | `240 5% 15%` | | Nền muted |
| `--muted-foreground` | `240 4% 58%` | | Chữ muted |
| `--border` | `240 5% 15%` | | Viền |
| `--border-strong` | `240 4% 26%` | | Viền đậm |
| `--ring` | `32 47% 80%` | gold | Focus ring |
| `--gold` | `#ffd277` | | Vàng rực (gradient/accent đặc biệt) |
| `--gold-2` | `#77530a` | | Vàng nâu (gradient stop 2) |
| `--success` | `160 84% 39%` | | Thành công |
| `--warning` | `38 92% 50%` | | Cảnh báo |
| `--destructive` | `0 84% 60%` | | Lỗi |
| `--info` | `217 91% 60%` | | Thông tin |

- Body computed: `color: rgb(244,244,245)` trên `background: rgb(9,9,11)`.

## 2. Bo góc & layout

| Token | Giá trị |
|---|---|
| `--radius-sm` | `4px` |
| `--radius` | `6px` (base) |
| `--radius-lg` | `8px` |
| `--radius-xl` | `12px` |
| `--global-announcement-height` | `48px` |
| Container max-width | `1536px` (`max-w-screen-2xl`) |

## 3. Shadow

| Token | Giá trị |
|---|---|
| `--shadow-xs` | `0 1px 2px 0 #00000080` |
| `--shadow-sm` | `0 1px 3px 0 #0009` |
| `--shadow-md` | `0 4px 6px -1px #0009` |
| `--shadow-lg` | `0 10px 15px -3px #0009` |
| `--shadow-xl` | `0 20px 25px -5px #0009` |
| `--shadow-inner` | `inset 0 2px 4px 0 #0006` |

## 4. Typography

| Phần tử | Font | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| **Body** | `Inter` | 14px | 500 | 20px | normal |
| **H1** | `Plus Jakarta Sans` | 72px | 600 | 72px (1.0) | normal |
| **H2** | `Plus Jakarta Sans` | 48px | 600 | 48px (1.0) | -1.2px |
| **H3** | `Plus Jakarta Sans` | 24px | 600 | 32px | normal |
| **Nav link** | `Inter` | 16px | 400 | 1.6 | normal |

- Hai font family: **Inter** (body/UI) + **Plus Jakarta Sans** (heading).
- Weights dùng: 400 / 500 / 600 / 700.

## 5. Nút (buttons)

| Loại | BG | Color | Border | Radius | Padding | Font/Weight |
|---|---|---|---|---|---|---|
| Announcement "Start Generating" | `#242428` | `#d4d4d8` | 1px `#242428` | 4px | 0 12px | 12px / 600 |
| Header "Login" | `#121212` | `#fff` | 1px `#302c27` | 6–8px | 0 16px | 14px / 500 |
| Primary CTA | gold `--primary` | `#333` | — | 6px | — | 14px / 600 |

## 6. Header

- `position: fixed`, height `76px`.
- Background: `linear-gradient(#121212, rgba(18,18,18,.5), rgba(0,0,0,0))` — gradient mờ dần (KHÔNG dùng backdrop-filter).
