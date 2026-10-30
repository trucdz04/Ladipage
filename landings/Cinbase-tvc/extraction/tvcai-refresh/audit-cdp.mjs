import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const CDP_PORT = 9338;
const OUTPUT = resolve('landings/Cinbase-tvc/extraction/tvcai-refresh/dom-tree.json');

const targets = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`).then((response) => response.json());
const target = targets.find((entry) => entry.type === 'page' && entry.url.includes('tvcai.vn'));

if (!target) {
  throw new Error('Không tìm thấy page target tvcai.vn');
}

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const listeners = new Map();
let nextId = 0;

socket.addEventListener('message', (event) => {
  const payload = JSON.parse(event.data);
  if (payload.id) {
    const request = pending.get(payload.id);
    if (!request) return;
    pending.delete(payload.id);
    if (payload.error) request.reject(new Error(payload.error.message));
    else request.resolve(payload.result);
    return;
  }

  const callbacks = listeners.get(payload.method) ?? [];
  callbacks.forEach((callback) => callback(payload.params));
});

await new Promise((resolveOpen, rejectOpen) => {
  socket.addEventListener('open', resolveOpen, { once: true });
  socket.addEventListener('error', rejectOpen, { once: true });
});

function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolveRequest, rejectRequest) => {
    pending.set(id, { resolve: resolveRequest, reject: rejectRequest });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function waitForEvent(method, timeout = 20_000) {
  return new Promise((resolveEvent, rejectEvent) => {
    const callbacks = listeners.get(method) ?? [];
    const timer = setTimeout(() => {
      listeners.set(method, callbacks.filter((callback) => callback !== handler));
      rejectEvent(new Error(`Hết thời gian chờ ${method}`));
    }, timeout);
    const handler = (params) => {
      clearTimeout(timer);
      listeners.set(method, callbacks.filter((callback) => callback !== handler));
      resolveEvent(params);
    };
    callbacks.push(handler);
    listeners.set(method, callbacks);
  });
}

async function evaluate(functionSource) {
  const response = await send('Runtime.evaluate', {
    expression: `(${functionSource})()`,
    returnByValue: true,
    awaitPromise: true,
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.text || 'Runtime.evaluate thất bại');
  }
  return response.result.value;
}

await Promise.all([
  send('Page.enable'),
  send('Runtime.enable'),
  send('Network.enable'),
  send('DOM.enable'),
  send('CSS.enable'),
]);

await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

const responses = [];
listeners.set('Network.responseReceived', [({ response, type }) => {
  responses.push({
    url: response.url,
    type,
    status: response.status,
    mimeType: response.mimeType,
    protocol: response.protocol,
    fromDiskCache: Boolean(response.fromDiskCache),
    fromServiceWorker: Boolean(response.fromServiceWorker),
  });
}]);

const loadEvent = waitForEvent('Page.loadEventFired', 30_000);
await send('Page.reload', { ignoreCache: false });
await loadEvent.catch(() => null);
await new Promise((resolveDelay) => setTimeout(resolveDelay, 6_000));

const desktopAudit = await evaluate(async function collectDesktopAudit() {
  await document.fonts.ready;

  const round = (value) => Math.round(value * 100) / 100;
  const cleanText = (value) => (value ?? '').replace(/\s+/g, ' ').trim();
  const rectOf = (element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: round(rect.x),
      y: round(rect.y + scrollY),
      viewportY: round(rect.y),
      width: round(rect.width),
      height: round(rect.height),
    };
  };
  const selectorOf = (element) => {
    if (element.id) return `#${CSS.escape(element.id)}`;
    const classes = [...element.classList].slice(0, 3).map((name) => `.${CSS.escape(name)}`).join('');
    return `${element.tagName.toLowerCase()}${classes}`;
  };
  const headingOf = (element) => cleanText(element.querySelector('h1,h2,h3,h4,h5,h6')?.textContent).slice(0, 180);
  const summarize = (element) => {
    const style = getComputedStyle(element);
    return {
      tag: element.tagName.toLowerCase(),
      selector: selectorOf(element),
      id: element.id || null,
      classes: [...element.classList].slice(0, 12),
      role: element.getAttribute('role'),
      ariaLabel: element.getAttribute('aria-label'),
      heading: headingOf(element) || null,
      text: cleanText(element.childNodes.length <= 5 ? element.textContent : '').slice(0, 180) || null,
      rect: rectOf(element),
      computed: {
        display: style.display,
        position: style.position,
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        backgroundColor: style.backgroundColor,
        color: style.color,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        padding: style.padding,
        margin: style.margin,
        gap: style.gap,
        border: style.border,
        borderRadius: style.borderRadius,
        opacity: style.opacity,
        transform: style.transform,
        zIndex: style.zIndex,
      },
    };
  };

  const allElements = [...document.querySelectorAll('body *')];
  const visibleElements = allElements.filter((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  });
  const countValues = (getter, limit = 16) => {
    const counts = new Map();
    visibleElements.forEach((element) => {
      const value = getter(element);
      if (!value || value === 'rgba(0, 0, 0, 0)' || value === 'none' || value === 'normal') return;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([value, count]) => ({ value, count }));
  };

  const rootProperties = {};
  const rootStyle = getComputedStyle(document.documentElement);
  for (let index = 0; index < rootStyle.length; index += 1) {
    const property = rootStyle[index];
    if (property.startsWith('--')) rootProperties[property] = rootStyle.getPropertyValue(property).trim();
  }

  const customPropertyDefinitions = {};
  const mediaQueries = new Set();
  const keyframes = [];
  const stylesheetErrors = [];
  const visitRules = (rules, source) => {
    for (const rule of [...rules]) {
      if (rule.type === CSSRule.MEDIA_RULE) {
        mediaQueries.add(rule.conditionText);
        visitRules(rule.cssRules, source);
      } else if (rule.type === CSSRule.KEYFRAMES_RULE) {
        keyframes.push({
          name: rule.name,
          source,
          frames: [...rule.cssRules].map((frame) => ({ keyText: frame.keyText, cssText: frame.style.cssText })),
        });
      } else if (rule.type === CSSRule.STYLE_RULE) {
        for (const property of [...rule.style]) {
          if (!property.startsWith('--')) continue;
          const definitions = customPropertyDefinitions[property] ?? [];
          definitions.push({ selector: rule.selectorText, value: rule.style.getPropertyValue(property).trim(), source });
          customPropertyDefinitions[property] = definitions.slice(0, 12);
        }
      }
      if (rule.cssRules && rule.type !== CSSRule.MEDIA_RULE) visitRules(rule.cssRules, source);
    }
  };
  [...document.styleSheets].forEach((sheet) => {
    try {
      visitRules(sheet.cssRules, sheet.href || 'inline');
    } catch (error) {
      stylesheetErrors.push({ href: sheet.href, error: String(error) });
    }
  });

  const semanticCandidates = [...document.querySelectorAll('header,nav,main,main > *,section,article,aside,footer,[role="main"],[role="navigation"],[role="region"]')];
  const sections = semanticCandidates
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 120 && rect.height > 20;
    })
    .map(summarize)
    .sort((a, b) => a.rect.y - b.rect.y || b.rect.width - a.rect.width);

  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((element) => ({
    ...summarize(element),
    text: cleanText(element.textContent).slice(0, 240),
    nearestSection: selectorOf(element.closest('section,header,main,footer,article') ?? element.parentElement),
  })).sort((a, b) => a.rect.y - b.rect.y);

  const controls = [...document.querySelectorAll('button,a[href],summary,input,select,textarea,[role="button"],[role="tab"]')]
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })
    .map((element) => ({
      ...summarize(element),
      text: cleanText(element.textContent || element.getAttribute('aria-label') || element.getAttribute('placeholder')).slice(0, 160),
      href: element instanceof HTMLAnchorElement ? element.href : null,
      ariaExpanded: element.getAttribute('aria-expanded'),
      ariaControls: element.getAttribute('aria-controls'),
      type: element.getAttribute('type'),
    }));

  const horizontalScrollers = visibleElements.filter((element) => {
    const style = getComputedStyle(element);
    return element.scrollWidth > element.clientWidth + 12 && ['auto', 'scroll'].includes(style.overflowX);
  }).map((element) => ({
    ...summarize(element),
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    childCount: element.children.length,
    scrollSnapType: getComputedStyle(element).scrollSnapType,
  }));

  const componentSelectors = [
    'header.site-header', '.site-header .shell', '.brand', '.site-nav', '.header-cta',
    'body', '#top', '.showcase-hero', '.showcase-feature', '.showcase-feature-copy',
    '.showcase-feature-frame', '.showcase-feature-frame video', '.showcase-pager',
    '.showcase-pager button', '.showcase-feature-description', '.showcase-rail-wrap',
    '.showcase-rail-heading', '#showcaseRail', '.showcase-rail-card', '.showcase-rail-frame',
    '.showcase-category', '.showcase-category-heading', '.showcase-list', '.showcase-list-card',
    '.fact-strip', '.fact-intro', '.fact-grid',
    '.section', '.shell', '.section-head', '.stats-grid', '.transformation-grid',
    '.program-grid', '.process-grid', '.curriculum-grid', '.fit-grid', '.founder-grid',
    '.pricing-grid', '.faq-grid', '.final', 'footer',
  ];
  const componentDetails = Object.fromEntries(componentSelectors.map((selector) => {
    const elements = [...document.querySelectorAll(selector)];
    return [selector, {
      count: elements.length,
      samples: elements.slice(0, 6).map((element) => {
        const style = getComputedStyle(element);
        return {
          ...summarize(element),
          extended: {
            width: style.width,
            minWidth: style.minWidth,
            maxWidth: style.maxWidth,
            height: style.height,
            minHeight: style.minHeight,
            maxHeight: style.maxHeight,
            inset: style.inset,
            top: style.top,
            right: style.right,
            bottom: style.bottom,
            left: style.left,
            background: style.background,
            backgroundImage: style.backgroundImage,
            backgroundSize: style.backgroundSize,
            backgroundPosition: style.backgroundPosition,
            boxShadow: style.boxShadow,
            objectFit: style.objectFit,
            objectPosition: style.objectPosition,
            flexDirection: style.flexDirection,
            alignItems: style.alignItems,
            justifyContent: style.justifyContent,
            gridTemplateColumns: style.gridTemplateColumns,
            gridTemplateRows: style.gridTemplateRows,
            aspectRatio: style.aspectRatio,
            textTransform: style.textTransform,
            transition: style.transition,
            animation: style.animation,
          },
          before: (() => {
            const pseudo = getComputedStyle(element, '::before');
            return { content: pseudo.content, background: pseudo.background, inset: pseudo.inset, opacity: pseudo.opacity };
          })(),
          after: (() => {
            const pseudo = getComputedStyle(element, '::after');
            return { content: pseudo.content, background: pseudo.background, inset: pseudo.inset, opacity: pseudo.opacity };
          })(),
        };
      }),
    }];
  }));

  const outlineNode = (element, depth = 0) => ({
    tag: element.tagName.toLowerCase(),
    id: element.id || null,
    classes: [...element.classList],
    role: element.getAttribute('role'),
    ariaLabel: element.getAttribute('aria-label'),
    text: cleanText([...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent).join(' ')).slice(0, 180) || null,
    rect: rectOf(element),
    children: depth >= 5 ? [] : [...element.children].slice(0, 40).map((child) => outlineNode(child, depth + 1)),
  });
  const heroElement = document.querySelector('#top');
  const heroOutline = heroElement ? outlineNode(heroElement) : null;

  const stickyOrFixed = visibleElements.filter((element) => ['fixed', 'sticky'].includes(getComputedStyle(element).position)).map(summarize);
  const animatedElements = visibleElements.filter((element) => {
    const style = getComputedStyle(element);
    return style.animationName !== 'none' || style.transitionDuration.split(',').some((value) => Number.parseFloat(value) > 0);
  }).slice(0, 240).map((element) => {
    const style = getComputedStyle(element);
    return {
      selector: selectorOf(element),
      text: cleanText(element.textContent).slice(0, 100),
      animationName: style.animationName,
      animationDuration: style.animationDuration,
      animationTimingFunction: style.animationTimingFunction,
      animationIterationCount: style.animationIterationCount,
      transitionProperty: style.transitionProperty,
      transitionDuration: style.transitionDuration,
      transitionTimingFunction: style.transitionTimingFunction,
    };
  });

  const images = [...document.images].map((image) => ({
    src: image.currentSrc || image.src,
    alt: image.alt,
    loading: image.loading,
    decoding: image.decoding,
    fetchPriority: image.fetchPriority,
    intrinsic: [image.naturalWidth, image.naturalHeight],
    rendered: [round(image.getBoundingClientRect().width), round(image.getBoundingClientRect().height)],
  }));
  const videos = [...document.querySelectorAll('video')].map((video) => ({
    src: video.currentSrc || video.src,
    poster: video.poster,
    autoplay: video.autoplay,
    muted: video.muted,
    loop: video.loop,
    playsInline: video.playsInline,
    preload: video.preload,
    paused: video.paused,
    readyState: video.readyState,
    intrinsic: [video.videoWidth, video.videoHeight],
    rendered: [round(video.getBoundingClientRect().width), round(video.getBoundingClientRect().height)],
  }));

  const resourceEntries = performance.getEntriesByType('resource').map((entry) => ({
    url: entry.name,
    initiatorType: entry.initiatorType,
    duration: round(entry.duration),
    transferSize: entry.transferSize,
    encodedBodySize: entry.encodedBodySize,
    decodedBodySize: entry.decodedBodySize,
  }));
  const groupResources = (keyGetter) => {
    const groups = new Map();
    resourceEntries.forEach((entry) => {
      const key = keyGetter(entry);
      const group = groups.get(key) ?? { count: 0, transferSize: 0, encodedBodySize: 0 };
      group.count += 1;
      group.transferSize += entry.transferSize;
      group.encodedBodySize += entry.encodedBodySize;
      groups.set(key, group);
    });
    return Object.fromEntries([...groups.entries()].sort((a, b) => b[1].count - a[1].count));
  };

  const directBodyTree = [...document.body.children].map((element) => ({
    ...summarize(element),
    children: [...element.children].slice(0, 20).map((child) => ({
      ...summarize(child),
      children: [...child.children].slice(0, 20).map((grandChild) => summarize(grandChild)),
    })),
  }));

  return {
    capturedAt: new Date().toISOString(),
    document: {
      url: location.href,
      title: document.title,
      lang: document.documentElement.lang,
      description: document.querySelector('meta[name="description"]')?.content ?? null,
      viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
      page: { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight },
      bodyClasses: [...document.body.classList],
      htmlClasses: [...document.documentElement.classList],
      counts: {
        elements: allElements.length,
        visibleElements: visibleElements.length,
        sections: document.querySelectorAll('section').length,
        headings: document.querySelectorAll('h1,h2,h3,h4,h5,h6').length,
        links: document.links.length,
        buttons: document.querySelectorAll('button,[role="button"]').length,
        images: images.length,
        videos: videos.length,
        forms: document.forms.length,
        details: document.querySelectorAll('details').length,
        iframes: document.querySelectorAll('iframe').length,
      },
    },
    designSystem: {
      rootProperties,
      customPropertyDefinitions,
      frequent: {
        colors: countValues((element) => getComputedStyle(element).color),
        backgrounds: countValues((element) => getComputedStyle(element).backgroundColor),
        fontFamilies: countValues((element) => getComputedStyle(element).fontFamily),
        fontSizes: countValues((element) => getComputedStyle(element).fontSize),
        fontWeights: countValues((element) => getComputedStyle(element).fontWeight),
        lineHeights: countValues((element) => getComputedStyle(element).lineHeight),
        radii: countValues((element) => getComputedStyle(element).borderRadius),
        gaps: countValues((element) => getComputedStyle(element).gap),
      },
      mediaQueries: [...mediaQueries].sort(),
      keyframes,
      stylesheetErrors,
      stylesheets: [...document.styleSheets].map((sheet) => sheet.href || 'inline'),
    },
    structure: {
      directBodyTree,
      sections,
      headings,
      controls,
      stickyOrFixed,
      horizontalScrollers,
      componentDetails,
      heroOutline,
    },
    motion: { animatedElements },
    media: { images, videos },
    resources: {
      entries: resourceEntries,
      byInitiatorType: groupResources((entry) => entry.initiatorType || 'other'),
      byHostname: groupResources((entry) => {
        try { return new URL(entry.url).hostname; } catch { return 'relative'; }
      }),
    },
  };
});

const viewports = [];
for (const viewport of [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'laptop-1024', width: 1024, height: 800, mobile: false },
  { name: 'tablet-768', width: 768, height: 900, mobile: true },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
]) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 700));
  const snapshot = await evaluate(function collectViewportSnapshot() {
    scrollTo(0, 0);
    const cleanText = (value) => (value ?? '').replace(/\s+/g, ' ').trim();
    const measure = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        classes: [...element.classList].slice(0, 8),
        text: cleanText(element.textContent).slice(0, 140),
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        display: style.display,
        position: style.position,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        padding: style.padding,
      };
    };
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const all = [...document.querySelectorAll('body *')];
    const overflows = all.filter((element) => {
      const style = getComputedStyle(element);
      return visible(element) && element.scrollWidth > element.clientWidth + 4 && !['auto', 'scroll'].includes(style.overflowX);
    }).slice(0, 40).map(measure);
    const navItems = [...document.querySelectorAll('header a,header button,nav a,nav button')];
    const h1 = document.querySelector('h1');
    const hero = h1?.closest('section,main > div') ?? h1?.parentElement;
    return {
      viewport: { width: innerWidth, height: innerHeight },
      page: { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight },
      header: measure(document.querySelector('header')),
      hero: measure(hero),
      h1: measure(h1),
      visibleNavControls: navItems.filter(visible).map((element) => cleanText(element.textContent || element.getAttribute('aria-label')).slice(0, 80)),
      hiddenNavControls: navItems.filter((element) => !visible(element)).map((element) => cleanText(element.textContent || element.getAttribute('aria-label')).slice(0, 80)),
      h2Sizes: [...new Set([...document.querySelectorAll('h2')].filter(visible).map((element) => getComputedStyle(element).fontSize))],
      accidentalOverflows: overflows,
      horizontalScrollerCount: all.filter((element) => visible(element) && element.scrollWidth > element.clientWidth + 12 && ['auto', 'scroll'].includes(getComputedStyle(element).overflowX)).length,
    };
  });
  viewports.push({ ...viewport, ...snapshot });
}

await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

const interactionAudit = await evaluate(async function collectInteractions() {
  const cleanText = (value) => (value ?? '').replace(/\s+/g, ' ').trim();
  const visible = (element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  };
  const interactive = [...document.querySelectorAll('button,a[href],summary,[role="button"],[role="tab"]')].filter(visible);
  const likelyCarouselButtons = interactive.filter((element) => /(^|\s)(‹|›|←|→)($|\s)|next|prev|trước|sau/i.test(cleanText(element.textContent) + ' ' + (element.getAttribute('aria-label') ?? ''))).map((element) => ({
    tag: element.tagName.toLowerCase(),
    text: cleanText(element.textContent),
    ariaLabel: element.getAttribute('aria-label'),
    disabled: 'disabled' in element ? element.disabled : null,
    targetSection: cleanText(element.closest('section')?.querySelector('h2,h3')?.textContent).slice(0, 100),
  }));
  const expandable = interactive.filter((element) => element.hasAttribute('aria-expanded')).map((element) => ({
    tag: element.tagName.toLowerCase(),
    text: cleanText(element.textContent).slice(0, 180),
    expanded: element.getAttribute('aria-expanded'),
    controls: element.getAttribute('aria-controls'),
  }));
  const details = [...document.querySelectorAll('details')].map((element) => ({
    open: element.open,
    summary: cleanText(element.querySelector('summary')?.textContent).slice(0, 180),
  }));
  const dialogs = [...document.querySelectorAll('[role="dialog"],dialog')].map((element) => ({
    tag: element.tagName.toLowerCase(),
    open: element instanceof HTMLDialogElement ? element.open : visible(element),
    text: cleanText(element.textContent).slice(0, 180),
  }));
  const tablists = [...document.querySelectorAll('[role="tablist"]')].map((list) => ({
    label: list.getAttribute('aria-label'),
    tabs: [...list.querySelectorAll('[role="tab"]')].map((tab) => ({
      text: cleanText(tab.textContent),
      selected: tab.getAttribute('aria-selected'),
      controls: tab.getAttribute('aria-controls'),
    })),
  }));

  const heroState = () => ({
    title: cleanText(document.querySelector('#showcaseFeatureTitle')?.textContent),
    client: cleanText(document.querySelector('.showcase-feature-client')?.textContent),
    videoSrc: document.querySelector('.showcase-feature-frame video')?.currentSrc || document.querySelector('.showcase-feature-frame video')?.src || null,
    videoPaused: document.querySelector('.showcase-feature-frame video')?.paused ?? null,
    pager: [...document.querySelectorAll('.showcase-pager button')].filter(visible).map((button) => ({
      label: button.getAttribute('aria-label'),
      current: button.getAttribute('aria-current'),
      pressed: button.getAttribute('aria-pressed'),
      classes: [...button.classList],
    })),
  });
  const initialHeroState = heroState();
  const visiblePagerButtons = [...document.querySelectorAll('.showcase-pager button')].filter(visible);
  visiblePagerButtons[1]?.click();
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 600));
  const clickedHeroState = heroState();
  visiblePagerButtons[0]?.click();

  const heroScroller = document.querySelector('#showcaseRail');
  const heroNext = [...document.querySelectorAll('.showcase-scroll-button')].find((button) => /nổi bật sang phải/i.test(button.getAttribute('aria-label') ?? ''));
  const scrollBefore = heroScroller?.scrollLeft ?? null;
  heroNext?.click();
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
  const scrollAfter = heroScroller?.scrollLeft ?? null;
  heroScroller?.scrollTo({ left: 0, behavior: 'instant' });

  const firstDetails = document.querySelector('details');
  const detailsBefore = firstDetails?.open ?? null;
  firstDetails?.querySelector('summary')?.click();
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 80));
  const detailsAfter = firstDetails?.open ?? null;
  firstDetails?.querySelector('summary')?.click();

  const dialog = document.querySelector('#showcasePlayer');
  document.querySelector('.showcase-rail-card')?.click();
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
  const dialogAfterCardClick = {
    open: dialog instanceof HTMLDialogElement ? dialog.open : visible(dialog),
    title: cleanText(dialog?.querySelector('#showcasePlayerTitle')?.textContent),
    videoSrc: dialog?.querySelector('video')?.currentSrc || dialog?.querySelector('video')?.src || null,
  };
  dialog?.querySelector('.showcase-player-close')?.click();

  return {
    interactiveCount: interactive.length,
    likelyCarouselButtons,
    expandable,
    details,
    dialogs,
    tablists,
    heroPagerTest: {
      initial: initialHeroState,
      afterSecondDotClick: clickedHeroState,
      titleChanged: initialHeroState.title !== clickedHeroState.title,
      videoChanged: initialHeroState.videoSrc !== clickedHeroState.videoSrc,
    },
    carouselButtonTest: { scrollBefore, scrollAfter, delta: scrollAfter - scrollBefore },
    faqDetailsTest: { before: detailsBefore, afterSummaryClick: detailsAfter },
    showcaseDialogTest: dialogAfterCardClick,
  };
});

const networkSummary = {
  capturedResponses: responses.length,
  statuses: Object.fromEntries(Object.entries(responses.reduce((accumulator, response) => {
    accumulator[response.status] = (accumulator[response.status] ?? 0) + 1;
    return accumulator;
  }, {})).sort()),
  types: responses.reduce((accumulator, response) => {
    accumulator[response.type] = (accumulator[response.type] ?? 0) + 1;
    return accumulator;
  }, {}),
  hosts: responses.reduce((accumulator, response) => {
    try {
      const host = new URL(response.url).hostname;
      accumulator[host] = (accumulator[host] ?? 0) + 1;
    } catch {}
    return accumulator;
  }, {}),
  failures: responses.filter((response) => response.status >= 400),
  mediaExamples: responses.filter((response) => ['Media', 'Image', 'Font'].includes(response.type)).slice(0, 80),
};

const output = {
  methodology: {
    mode: 'Black-box runtime DOM/CSS audit via Chrome DevTools Protocol',
    note: 'Chỉ lưu metadata tính toán và outline DOM; không lưu bundle minified hoặc nội dung asset nguồn.',
    chromeTarget: target.url,
  },
  desktopAudit,
  viewports,
  interactions: interactionAudit,
  network: networkSummary,
};

await writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Đã ghi ${OUTPUT}`);
console.log(JSON.stringify({
  title: output.desktopAudit.document.title,
  counts: output.desktopAudit.document.counts,
  sectionCount: output.desktopAudit.structure.sections.length,
  pageHeight: output.desktopAudit.document.page.scrollHeight,
  viewports: output.viewports.map((viewport) => ({ name: viewport.name, h1: viewport.h1?.fontSize, pageWidth: viewport.page.scrollWidth })),
  network: output.network,
}, null, 2));

socket.close();
