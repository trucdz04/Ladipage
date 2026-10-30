(() => {
  'use strict';

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopNavQuery = window.matchMedia('(min-width: 900px)');
  const root = document.documentElement;

  const setAnnouncementHeight = (announcement) => {
    const height = announcement && !announcement.hidden ? announcement.offsetHeight : 0;
    const value = `${height}px`;
    root.style.setProperty('--announcement-h', value);
    root.style.setProperty('--announcement-height', value);
    root.style.setProperty('--announcement-current-h', value);
  };

  const initAnnouncement = () => {
    const announcement = document.querySelector('[data-announcement]');
    const closeButton = document.querySelector('[data-announcement-close]');
    if (!announcement) {
      setAnnouncementHeight(null);
      return;
    }

    const sync = () => setAnnouncementHeight(announcement);
    const observer = 'ResizeObserver' in window ? new ResizeObserver(sync) : null;
    observer?.observe(announcement);
    window.addEventListener('resize', sync, { passive: true });
    closeButton?.addEventListener('click', () => {
      announcement.hidden = true;
      sync();
    });
    sync();
  };

  const initHeader = () => {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;
    let scheduled = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 16);
      scheduled = false;
    };
    update();
    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
  };

  const initMobileNavigation = () => {
    const toggle = document.querySelector('[data-nav-toggle]');
    const navigation = document.querySelector('[data-mobile-nav]');
    if (!toggle || !navigation) return;

    if (!navigation.id) navigation.id = 'mobile-navigation';
    toggle.setAttribute('aria-controls', navigation.id);
    const setOpen = (open, returnFocus = false) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
      navigation.classList.toggle('is-open', open);
      navigation.hidden = !open;
      if (returnFocus) toggle.focus();
    };

    setOpen(false);
    toggle.addEventListener('click', () => {
      const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
      setOpen(willOpen);
      if (willOpen) navigation.querySelector('a, button')?.focus();
    });
    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false, true);
      }
    });
    const handleBreakpoint = () => setOpen(false);
    if (desktopNavQuery.addEventListener) desktopNavQuery.addEventListener('change', handleBreakpoint);
    else desktopNavQuery.addListener(handleBreakpoint);
  };

  const initReveal = () => {
    const elements = [...document.querySelectorAll('[data-reveal]')];
    if (!elements.length) return;
    root.classList.add('reveal-ready');
    let observer = null;
    const show = (element) => element.classList.add('is-visible', 'in-view');
    const observe = () => {
      if (reduceMotionQuery.matches || !('IntersectionObserver' in window)) {
        observer?.disconnect();
        observer = null;
        elements.forEach(show);
        return;
      }
      observer?.disconnect();
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          show(entry.target);
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      elements.forEach((element) => {
        if (!element.classList.contains('is-visible')) observer.observe(element);
      });
    };
    observe();
    if (reduceMotionQuery.addEventListener) reduceMotionQuery.addEventListener('change', observe);
    else reduceMotionQuery.addListener(observe);
  };

  const initCinematicHero = () => {
    const hero = document.querySelector('[data-cinematic-hero]');
    if (!hero) return;

    const slides = [...hero.querySelectorAll('[data-cinematic-slide]')];
    const pagerButtons = [...hero.querySelectorAll('[data-hero-pager]')];
    const previousButton = hero.querySelector('[data-hero-prev]');
    const nextButton = hero.querySelector('[data-hero-next]');
    const toggleButton = hero.querySelector('[data-hero-toggle]');
    const liveRegion = hero.querySelector('[data-hero-live]');
    const announcer = hero.querySelector('[data-hero-announcer]');
    if (!slides.length) return;

    let activeIndex = Math.max(0, slides.findIndex((slide) => (
      slide.classList.contains('is-active') || slide.getAttribute('aria-hidden') === 'false'
    )));
    let heroIsVisible = false;
    let userPaused = false;
    let focusPaused = false;
    let pointerWithin = false;
    let rotationTimer = 0;

    const normalizedIndex = (index) => (index + slides.length) % slides.length;
    const getVideo = (slide) => slide?.querySelector('[data-cinematic-video]');
    const detachVideo = (video) => {
      if (!video) return;
      video.pause();
      if (video.hasAttribute('src')) {
        video.removeAttribute('src');
        video.load();
      }
      video.removeAttribute('data-loaded');
    };
    const attachVideo = (video) => {
      if (!video || video.dataset.loaded === 'true') return;
      const source = video.dataset.src;
      if (!source) return;
      video.src = source;
      video.dataset.loaded = 'true';
      video.load();
    };
    const canAnimate = () => (
      heroIsVisible && !document.hidden && !reduceMotionQuery.matches && !userPaused
    );
    const playActiveVideo = () => {
      const video = getVideo(slides[activeIndex]);
      if (!video) return;
      if (!canAnimate()) {
        video.pause();
        return;
      }
      attachVideo(video);
      video.play()?.catch((error) => {
        if (error?.name === 'AbortError' || video !== getVideo(slides[activeIndex])) return;
        userPaused = true;
        clearRotation();
        syncToggle();
        if (announcer) announcer.textContent = 'Không thể tự động phát video này. Hãy chọn tác phẩm khác hoặc thử lại.';
      });
    };
    const clearRotation = () => {
      if (!rotationTimer) return;
      window.clearTimeout(rotationTimer);
      rotationTimer = 0;
    };
    const scheduleRotation = () => {
      clearRotation();
      if (!canAnimate() || focusPaused || pointerWithin || slides.length < 2) return;
      rotationTimer = window.setTimeout(() => selectSlide(activeIndex + 1, { announce: false }), 6000);
    };
    const syncToggle = () => {
      if (!toggleButton) return;
      const appearsPaused = userPaused || reduceMotionQuery.matches;
      toggleButton.disabled = reduceMotionQuery.matches;
      toggleButton.setAttribute('aria-pressed', String(appearsPaused));
      toggleButton.setAttribute('aria-label', reduceMotionQuery.matches
        ? 'Tự động phát đã tắt theo cài đặt giảm chuyển động'
        : (userPaused ? 'Tiếp tục trình chiếu' : 'Tạm dừng trình chiếu'));
      toggleButton.dataset.state = appearsPaused ? 'paused' : 'playing';
    };
    const itemTitle = (index) => (
      pagerButtons[index]?.dataset.title
      || slides[index]?.dataset.title
      || getVideo(slides[index])?.getAttribute('aria-label')
      || `Video ${index + 1}`
    );

    function selectSlide(index, options = {}) {
      activeIndex = normalizedIndex(index);
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        if (!active) detachVideo(getVideo(slide));
      });
      const syncSelectors = (items) => {
        items.forEach((item, itemIndex) => {
          const active = itemIndex === activeIndex;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-current', active ? 'true' : 'false');
          item.setAttribute('aria-pressed', String(active));
          item.tabIndex = active ? 0 : -1;
        });
      };
      syncSelectors(pagerButtons);
      if (liveRegion) {
        const status = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')} · ${itemTitle(activeIndex)}`;
        liveRegion.textContent = status;
        if (announcer && options.announce !== false) announcer.textContent = `Đang chiếu ${status}`;
      }
      if (options.focus === 'pager') pagerButtons[activeIndex]?.focus();
      playActiveVideo();
      scheduleRotation();
    }

    const bindSelectorKeys = (items, focusGroup) => {
      items.forEach((item, index) => {
        item.addEventListener('click', () => selectSlide(index));
        item.addEventListener('keydown', (event) => {
          let targetIndex = null;
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') targetIndex = index + 1;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') targetIndex = index - 1;
          if (event.key === 'Home') targetIndex = 0;
          if (event.key === 'End') targetIndex = slides.length - 1;
          if (targetIndex === null) return;
          event.preventDefault();
          selectSlide(targetIndex, { focus: focusGroup });
        });
      });
    };

    bindSelectorKeys(pagerButtons, 'pager');
    previousButton?.addEventListener('click', () => selectSlide(activeIndex - 1));
    nextButton?.addEventListener('click', () => selectSlide(activeIndex + 1));
    toggleButton?.addEventListener('click', () => {
      if (reduceMotionQuery.matches) return;
      userPaused = !userPaused;
      syncToggle();
      if (userPaused) {
        clearRotation();
        getVideo(slides[activeIndex])?.pause();
      } else {
        focusPaused = false;
        playActiveVideo();
        scheduleRotation();
      }
    });

    hero.addEventListener('focusin', (event) => {
      if (event.target !== toggleButton) focusPaused = true;
      clearRotation();
    });
    hero.addEventListener('focusout', (event) => {
      if (event.relatedTarget && hero.contains(event.relatedTarget)) return;
      focusPaused = false;
      scheduleRotation();
    });
    hero.addEventListener('mouseenter', () => {
      pointerWithin = true;
      clearRotation();
    });
    hero.addEventListener('mouseleave', () => {
      pointerWithin = false;
      scheduleRotation();
    });

    const pauseAll = () => {
      slides.forEach((slide) => getVideo(slide)?.pause());
      clearRotation();
    };
    const syncPlayback = () => {
      syncToggle();
      if (canAnimate()) {
        playActiveVideo();
        scheduleRotation();
      } else pauseAll();
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        heroIsVisible = entry.isIntersecting;
        syncPlayback();
      }, { threshold: 0.12 });
      observer.observe(hero);
    } else heroIsVisible = true;

    document.addEventListener('visibilitychange', syncPlayback);
    if (reduceMotionQuery.addEventListener) reduceMotionQuery.addEventListener('change', syncPlayback);
    else reduceMotionQuery.addListener(syncPlayback);
    syncToggle();
    selectSlide(activeIndex, { announce: false });
  };

  const initMediaLibraries = () => {
    const legacyAttributes = {
      'data-skill-filter': 'data-library-filter',
      'data-skill-card': 'data-library-card',
      'data-skill-rail': 'data-library-rail',
      'data-skill-prev': 'data-library-prev',
      'data-skill-next': 'data-library-next',
      'data-skill-count': 'data-library-count',
      'data-skill-preview': 'data-library-preview',
    };
    document.querySelectorAll('[data-skill-library]').forEach((library) => {
      library.setAttribute('data-media-library', '');
      library.dataset.itemLabel ||= 'Skill';
      Object.entries(legacyAttributes).forEach(([legacy, current]) => {
        library.querySelectorAll(`[${legacy}]`).forEach((element) => {
          element.setAttribute(current, element.getAttribute(legacy) || '');
        });
      });
    });
    const libraries = [...document.querySelectorAll('[data-media-library]')];
    if (!libraries.length) return;
    const allCards = [...document.querySelectorAll('[data-media-library] [data-library-card]')];
    const hoveredCards = new Set();
    const interestedCards = new Set();
    const failedPreviews = new WeakSet();
    let activePreviewCard = null;
    let previewGeneration = 0;
    const hasInteraction = (card) => (
      hoveredCards.has(card) || card.contains(document.activeElement)
    );
    const isCardVisible = (card) => {
      if (card.hidden || !card.isConnected) return false;
      const bounds = card.getBoundingClientRect();
      const railBounds = card.closest('[data-library-rail]')?.getBoundingClientRect();
      const left = Math.max(0, railBounds?.left ?? 0, bounds.left);
      const right = Math.min(window.innerWidth, railBounds?.right ?? window.innerWidth, bounds.right);
      const top = Math.max(0, railBounds?.top ?? 0, bounds.top);
      const bottom = Math.min(window.innerHeight, railBounds?.bottom ?? window.innerHeight, bounds.bottom);
      return right > left && bottom > top;
    };
    const stopPreview = (card = activePreviewCard) => {
      if (!card) return;
      const video = card.querySelector('[data-library-preview]');
      card.classList.remove('is-previewing');
      if (video) {
        video.pause();
        if (video.hasAttribute('src')) {
          video.removeAttribute('src');
          video.load();
        }
      }
      if (activePreviewCard === card) {
        activePreviewCard = null;
        previewGeneration += 1;
      }
    };
    const startPreview = (card) => {
      if (!card || document.hidden || reduceMotionQuery.matches || !isCardVisible(card)) return;
      if (activePreviewCard === card) return;
      stopPreview();
      const video = card.querySelector('[data-library-preview]');
      const source = video?.dataset.src;
      if (!video || !source) return;
      activePreviewCard = card;
      const generation = ++previewGeneration;
      video.muted = true;
      video.src = source;
      video.load();
      const playback = video.play();
      if (!playback) {
        card.classList.add('is-previewing');
        return;
      }
      playback.then(() => {
        if (generation === previewGeneration && activePreviewCard === card) {
          card.classList.add('is-previewing');
        }
      }).catch((error) => {
        if (error?.name === 'AbortError' || generation !== previewGeneration) return;
        failedPreviews.add(card);
        if (activePreviewCard === card) stopPreview(card);
      });
    };
    const syncPreview = () => {
      if (document.hidden || reduceMotionQuery.matches) {
        stopPreview();
        return;
      }
      const candidate = [...interestedCards].reverse().find((card) => (
        hasInteraction(card) && !failedPreviews.has(card) && isCardVisible(card)
      ));
      if (candidate) startPreview(candidate);
      else stopPreview();
    };
    const rememberInteraction = (card) => {
      interestedCards.delete(card);
      interestedCards.add(card);
      failedPreviews.delete(card);
      syncPreview();
    };
    const releaseInteraction = (card) => {
      if (!hasInteraction(card)) interestedCards.delete(card);
      syncPreview();
    };
    allCards.forEach((card) => {
      card.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'touch') return;
        hoveredCards.add(card);
        rememberInteraction(card);
      });
      card.addEventListener('pointerleave', () => {
        hoveredCards.delete(card);
        releaseInteraction(card);
      });
      card.addEventListener('focusin', () => rememberInteraction(card));
      card.addEventListener('focusout', (event) => {
        if (event.relatedTarget && card.contains(event.relatedTarget)) return;
        if (!hoveredCards.has(card)) interestedCards.delete(card);
        syncPreview();
      });
      card.querySelector('[data-library-preview]')?.addEventListener('error', () => {
        if (activePreviewCard !== card) return;
        failedPreviews.add(card);
        stopPreview(card);
        syncPreview();
      });
    });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(() => syncPreview(), { threshold: [0, 0.12] });
      allCards.forEach((card) => observer.observe(card));
    } else {
      window.addEventListener('scroll', syncPreview, { passive: true });
    }
    document.addEventListener('visibilitychange', syncPreview);
    if (reduceMotionQuery.addEventListener) reduceMotionQuery.addEventListener('change', syncPreview);
    else reduceMotionQuery.addListener(syncPreview);

    const categoryFor = (filter) => (
      filter.dataset.category || filter.dataset.libraryFilter || 'all'
    ).trim().toLowerCase();
    const categoriesFor = (card) => (
      card.dataset.category || ''
    ).toLowerCase().split(/[\s,|]+/).filter(Boolean);

    libraries.forEach((library) => {
      const filters = [...library.querySelectorAll('[data-library-filter]')];
      const cards = [...library.querySelectorAll('[data-library-card]')];
      const rail = library.querySelector('[data-library-rail]');
      const previousButton = library.querySelector('[data-library-prev]');
      const nextButton = library.querySelector('[data-library-next]');
      const count = library.querySelector('[data-library-count]');
      const itemLabel = library.dataset.itemLabel || 'Skill';
      const updateArrows = () => {
        if (!rail) return;
        const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
        if (previousButton) previousButton.disabled = rail.scrollLeft <= 2;
        if (nextButton) nextButton.disabled = rail.scrollLeft >= maxScroll - 2;
      };
      const applyFilter = (filter, options = {}) => {
        const category = categoryFor(filter);
        let visibleCount = 0;
        cards.forEach((card) => {
          const visible = category === 'all' || categoriesFor(card).includes(category);
          if (!visible) stopPreview(card);
          card.hidden = !visible;
          if (visible) visibleCount += 1;
        });
        filters.forEach((candidate) => {
          const active = candidate === filter;
          candidate.classList.toggle('is-active', active);
          candidate.setAttribute('aria-pressed', String(active));
          candidate.tabIndex = active ? 0 : -1;
        });
        if (count) count.textContent = `${visibleCount} ${itemLabel}`;
        rail?.scrollTo({ left: 0, behavior: reduceMotionQuery.matches ? 'auto' : 'smooth' });
        window.requestAnimationFrame(() => {
          updateArrows();
          syncPreview();
        });
        if (options.focus) filter.focus();
      };

      filters.forEach((filter, index) => {
        filter.addEventListener('click', () => applyFilter(filter));
        filter.addEventListener('keydown', (event) => {
          let targetIndex = null;
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') targetIndex = index + 1;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') targetIndex = index - 1;
          if (event.key === 'Home') targetIndex = 0;
          if (event.key === 'End') targetIndex = filters.length - 1;
          if (targetIndex === null) return;
          event.preventDefault();
          applyFilter(filters[(targetIndex + filters.length) % filters.length], { focus: true });
        });
      });

      const scrollRail = (direction) => {
        if (!rail) return;
        rail.scrollBy({
          left: direction * rail.clientWidth * 0.8,
          behavior: reduceMotionQuery.matches ? 'auto' : 'smooth',
        });
      };
      previousButton?.addEventListener('click', () => scrollRail(-1));
      nextButton?.addEventListener('click', () => scrollRail(1));
      rail?.addEventListener('scroll', () => {
        updateArrows();
        syncPreview();
      }, { passive: true });
      window.addEventListener('resize', updateArrows, { passive: true });
      const initial = filters.find((filter) => filter.getAttribute('aria-pressed') === 'true') || filters[0];
      if (initial) applyFilter(initial);
      else if (count) count.textContent = `${cards.length} ${itemLabel}`;
      updateArrows();
    });
  };

  const initProcessTabs = () => {
    const tabs = [...document.querySelectorAll('[data-process-tab]')];
    const panels = [...document.querySelectorAll('[data-process-panel]')];
    if (!tabs.length || !panels.length) return;
    const tabList = tabs[0].parentElement;
    const processMobileQuery = window.matchMedia('(max-width: 767px)');
    const syncOrientation = () => tabList?.setAttribute(
      'aria-orientation',
      processMobileQuery.matches ? 'horizontal' : 'vertical',
    );
    syncOrientation();
    if (processMobileQuery.addEventListener) processMobileQuery.addEventListener('change', syncOrientation);
    else processMobileQuery.addListener(syncOrientation);
    tabs.forEach((tab, index) => {
      if (!tab.id) tab.id = `process-tab-${index + 1}`;
      const panel = panels[index];
      if (!panel) return;
      if (!panel.id) panel.id = `process-panel-${index + 1}`;
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('aria-labelledby', tab.id);
    });
    const select = (index, focus = false) => {
      const activeIndex = (index + tabs.length) % tabs.length;
      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === activeIndex;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel, panelIndex) => {
        panel.hidden = panelIndex !== activeIndex;
        panel.classList.toggle('is-active', panelIndex === activeIndex);
      });
      if (focus) tabs[activeIndex].focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', (event) => {
        let nextIndex = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = index + 1;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = index - 1;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        select(nextIndex, true);
      });
    });
    const initialIndex = Math.max(0, tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true'));
    select(initialIndex);
  };

  const initFaq = () => {
    const items = [...document.querySelectorAll('details[data-faq-item]')];
    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        items.forEach((candidate) => {
          if (candidate !== item) candidate.open = false;
        });
      });
    });
  };

  const initRegistrationForm = () => {
    const form = document.querySelector('[data-registration-form]');
    if (!form) return;
    const audience = form.querySelector('[name="audience"]');
    const status = form.querySelector('[data-registration-status]');

    document.querySelectorAll('[data-registration-audience]').forEach((link) => {
      link.addEventListener('click', () => {
        if (audience) audience.value = link.dataset.registrationAudience || 'business';
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status?.classList.remove('is-error');
      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) {
          status.textContent = 'Vui lòng điền đầy đủ họ tên, thông tin liên hệ và đơn vị trước khi mở email đăng ký.';
          status.classList.add('is-error');
        }
        return;
      }

      const data = new FormData(form);
      const isEducator = data.get('audience') === 'educator';
      const subject = isEducator
        ? 'Đăng ký đối tác giảng viên CinAI'
        : 'Đăng ký đào tạo video AI miễn phí qua Zoom';
      const body = [
        `Họ và tên: ${data.get('name') || ''}`,
        `Số điện thoại / Zalo: ${data.get('phone') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Doanh nghiệp / đơn vị: ${data.get('organization') || ''}`,
        `Vai trò: ${isEducator ? 'Giảng viên / đơn vị đào tạo' : 'Doanh nghiệp'}`,
        '',
        'Nhu cầu muốn trao đổi:',
        data.get('need') || 'Chưa cung cấp',
      ].join('\n');
      window.cinaiTrack?.('RegistrationIntent', { audience: isEducator ? 'educator' : 'business' });
      if (status) status.textContent = 'Đang mở ứng dụng email. Vui lòng kiểm tra lại nội dung và bấm Gửi để hoàn tất đăng ký.';
      window.location.href = `mailto:admin@cinai.tv?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  };

  const init = () => {
    initAnnouncement();
    initHeader();
    initMobileNavigation();
    initReveal();
    initCinematicHero();
    initMediaLibraries();
    initProcessTabs();
    initFaq();
    initRegistrationForm();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
