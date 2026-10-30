# Animation map

- Hero cross-fade: opacity khoảng `800ms`; scale rất nhẹ cho slide active.
- Card media hover: scale/translate nhẹ `180–600ms`.
- Reveal: opacity + translateY `700ms`, chạy một lần khi vào viewport.
- Header: background/border/backdrop chuyển `220ms` khi scroll.
- Rail: native smooth scroll và scroll-snap.
- Accordion icon: rotate `180ms`.

`prefers-reduced-motion: reduce` vô hiệu hóa smooth scroll, transition dài, reveal và tải/phát video hero tự động.
