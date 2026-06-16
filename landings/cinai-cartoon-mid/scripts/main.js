/* main.js — hành vi bản clone toonbee.ai
   Tổng hợp từ nguồn: script.js (accordion + swiper + video controls),
   script-fe.js (fake playbar), inline (lazy-load IntersectionObserver, countdown).
   Mọi tracking/checkout/3rd-party đã được loại bỏ theo yêu cầu. */

(function () {
  'use strict';

  /* ---------- 1. FAQ Accordion (jQuery slideToggle, 1 mục mở/lượt) ---------- */
  if (window.jQuery) {
    jQuery(function ($) {
      $('.accordion_head').on('click', function () {
        var $body = $(this).next('.accordion_body');
        var isOpen = $body.is(':visible');
        $('.accordion_body').slideUp(300);
        $('.plusminus').html('<i class="fa fa-angle-down" aria-hidden="true"></i>');
        if (!isOpen) {
          $body.slideDown(300);
          $(this).find('.plusminus').html('<i class="fa fa-angle-up" aria-hidden="true"></i>');
        }
      });
    });
  }

  /* ---------- 2. Swiper carousel (showcase video) ---------- */
  function initSwiper() {
    if (typeof Swiper === 'undefined' || !document.querySelector('.swiper1')) return;
    new Swiper('.swiper1', {
      slidesPerView: 2.2,
      spaceBetween: 150,
      centeredSlides: true,
      loop: true,
      grabCursor: true,
      navigation: {
        nextEl: '.swiper-button-next.swiper1-button-next',
        prevEl: '.swiper-button-prev.swiper1-button-prev'
      },
      breakpoints: {
        1500: { spaceBetween: 150 },
        1400: { spaceBetween: 100 },
        992: { spaceBetween: 50 },
        768: { spaceBetween: 30 },
        640: { slidesPerView: 1, spaceBetween: 0 },
        100: { slidesPerView: 1, spaceBetween: 0 }
      }
    });
  }

  /* ---------- 3. Fake video playbar (hiệu ứng "đang phát") ---------- */
  function initPlaybars() {
    document.querySelectorAll('.video-playbar[data-duration]').forEach(function (bar) {
      var total = parseInt(bar.dataset.duration, 10);
      var progress = bar.querySelector('.video-playbar-progress');
      var badge = bar.querySelector('.video-duration-badge');
      if (!progress || !badge || !total) return;
      var elapsed = Math.floor((bar.offsetWidth % total));
      function fmt(sec) { var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
      function paint() {
        progress.style.width = (elapsed / total) * 100 + '%';
        badge.textContent = fmt(total - elapsed);
      }
      paint();
      setInterval(function () { elapsed = (elapsed + 1) % total; paint(); }, 2000);
    });
  }

  /* ---------- 4. Video play/pause + mute toggle (intro demo) ---------- */
  function initVideoControls() {
    var wrapper = document.querySelector('.intro-detail-img');
    if (!wrapper) return;
    var video = wrapper.querySelector('.my-video');
    if (!video) return;
    var playBtn = wrapper.querySelector('.play-toggle');
    var playIcon = wrapper.querySelector('.icon-play');
    var pauseIcon = wrapper.querySelector('.icon-pause');
    var muteBtn = wrapper.querySelector('.mute-toggle');
    var mutedIcon = wrapper.querySelector('.icon-muted');
    var unmutedIcon = wrapper.querySelector('.icon-unmuted');

    if (playBtn) playBtn.addEventListener('click', function () {
      var sources = video.querySelectorAll('source');
      var needsLoad = false;
      sources.forEach(function (s) { if (!s.src && s.dataset.src) { s.src = s.dataset.src; needsLoad = true; } });
      if (needsLoad) {
        video.load();
        video.classList.remove('lazy');
        video.addEventListener('canplay', function once() { video.removeEventListener('canplay', once); video.play(); }, { once: true });
      } else { video.paused ? video.play() : video.pause(); }
    });
    video.addEventListener('play', function () { wrapper.classList.add('playing'); if (playIcon) playIcon.style.display = 'none'; if (pauseIcon) pauseIcon.style.display = 'block'; });
    video.addEventListener('pause', function () { wrapper.classList.remove('playing'); if (playIcon) playIcon.style.display = 'block'; if (pauseIcon) pauseIcon.style.display = 'none'; });
    if (muteBtn) muteBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      video.muted = !video.muted;
      if (mutedIcon) mutedIcon.style.display = video.muted ? 'block' : 'none';
      if (unmutedIcon) unmutedIcon.style.display = video.muted ? 'none' : 'block';
    });
  }

  /* ---------- 5. Audio voices preview ---------- */
  var isPlaying = false;
  window.toggleAudio = function () {
    var audio = document.getElementById('audioPlayer');
    var button = document.getElementById('audioControl');
    if (!audio || !button) return;
    if (isPlaying) {
      audio.pause(); audio.currentTime = 0;
      button.innerHTML = '<i class="fa fa-play" id="iconControl"></i> Play Voices Preview';
      isPlaying = false;
    } else {
      audio.play();
      button.innerHTML = '<i class="fa fa-stop" id="iconControl"></i> Stop Preview';
      isPlaying = true;
      audio.onended = function () { button.innerHTML = '<i class="fa fa-play" id="iconControl"></i> Play Voices Preview'; isPlaying = false; };
    }
  };

  /* ---------- 6. Lazy-load: img.lazy, video.lazy, .lazy-bg (IntersectionObserver) ---------- */
  function initLazyLoad() {
    var assets = [].slice.call(document.querySelectorAll('video.lazy, img.lazy, .lazy-bg'));
    if (!('IntersectionObserver' in window)) {
      // fallback: tải ngay
      assets.forEach(applyAsset);
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { applyAsset(entry.target); obs.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px 300px 0px' });
    assets.forEach(function (a) { io.observe(a); });
  }
  function applyAsset(asset) {
    if (asset.tagName === 'IMG') {
      if (asset.dataset.src) { asset.src = asset.dataset.src; asset.onload = function () { asset.classList.remove('lazy'); }; }
    } else if (asset.tagName === 'VIDEO') {
      asset.querySelectorAll('source').forEach(function (s) { if (s.dataset.src) s.src = s.dataset.src; });
      asset.load();
      asset.classList.remove('lazy');
      if (!asset.classList.contains('no-autoplay')) {
        var p = asset.play();
        if (p !== undefined) p.catch(function () {});
      }
    } else if (asset.classList.contains('lazy-bg')) {
      if (asset.dataset.bg) { asset.style.backgroundImage = "url('" + asset.dataset.bg + "')"; asset.classList.remove('lazy-bg'); }
    }
  }

  /* ---------- 7. Countdown 03:00 (kích hoạt khi cuộn tới pricing) ---------- */
  var timerInterval;
  function startCountdown(seconds, el) {
    var remaining = seconds;
    function update() {
      var m = Math.floor(remaining / 60), s = remaining % 60;
      el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      if (remaining > 0) remaining--; else clearInterval(timerInterval);
    }
    update();
    timerInterval = setInterval(update, 1000);
  }
  function initCountdown() {
    var el = document.getElementById('timer');
    if (!el) return;
    var pricing = document.getElementById('buynow') || document.getElementById('pricing');
    if (!pricing || !('IntersectionObserver' in window)) { startCountdown(3 * 60, el); return; }
    var once = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) { if (e.isIntersecting) { startCountdown(3 * 60, el); obs.disconnect(); } });
    }, { threshold: 0.2 });
    once.observe(pricing);
  }

  /* ---------- init ---------- */
  function boot() {
    initLazyLoad();
    initSwiper();
    initPlaybars();
    initVideoControls();
    initCountdown();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
