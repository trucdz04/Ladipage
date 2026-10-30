# Logic — cinematic hero

```text
state:
  activeIndex
  heroIsVisible
  document.hidden
  userPaused
  prefersReducedMotion
  focusWithin / pointerWithin

canAnimate = visible && document visible && !userPaused && !reducedMotion

select(index):
  normalize index
  pause + remove src from mọi slide không active
  cập nhật class/aria/pager/thumb/title
  nếu canAnimate: gắn src cho video active rồi play
  nếu không hover/focus: đặt timer 6 giây
```

Autoplay không ghi vào live region. Chỉ thao tác trực tiếp của người dùng mới cập nhật vùng thông báo dành cho screen reader. Thumbnail rail dùng `scrollLeft`, không dùng `scrollIntoView`, nên không kéo dọc cả trang.
