// video-lazy.js — chỉ phát video khi vào viewport (vá nút thắt LCP/băng thông của bản gốc)
(function () {
  const vids = document.querySelectorAll('video[data-lazy]');
  if (!('IntersectionObserver' in window)) {
    vids.forEach((v) => { try { v.play(); } catch (e) {} });
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    },
    { rootMargin: '200px 0px', threshold: 0.1 }
  );
  vids.forEach((v) => io.observe(v));
})();
