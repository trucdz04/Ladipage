/* Hiệu năng video (giống mstudio.ai): CHỈ phát video đang trong khung nhìn,
   PAUSE khi cuộn ra ngoài → giảm số video giải mã đồng thời → cuộn mượt dù nhiều clip.
   Bổ trợ cho lazy-loader trong main.js (lazy-loader chỉ nạp src lần đầu rồi thôi). */
(function () {
  if (!('IntersectionObserver' in window)) return;

  function hasSource(v) {
    if (v.currentSrc) return true;
    var s = v.querySelector('source');
    return !!(s && (s.getAttribute('src') || s.getAttribute('data-src')));
  }

  function setup() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (v.classList.contains('no-autoplay')) return;
          if (!hasSource(v)) return;          // chưa có nguồn (lazy chưa nạp) -> bỏ qua
          var p = v.play();
          if (p && p.catch) p.catch(function () {}); // bỏ qua lỗi autoplay policy
        } else if (!v.paused) {
          v.pause();                          // ra khỏi màn hình -> dừng giải mã
        }
      });
    }, { rootMargin: '150px 0px', threshold: 0.05 });

    document.querySelectorAll('video').forEach(function (v) { io.observe(v); });
  }

  if (document.readyState !== 'loading') setup();
  else document.addEventListener('DOMContentLoaded', setup);
})();
