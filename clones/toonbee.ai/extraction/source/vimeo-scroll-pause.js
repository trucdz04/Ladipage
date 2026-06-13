/*!
 * vimeo-scroll-pause.js
 * Pauses muted/looping Vimeo hero videos when they scroll out of view and
 * resumes them when they scroll back in. Drop-in on any page that embeds a
 * Vimeo iframe — does NOT require the Vimeo Player API, communicates with
 * the iframe directly via postMessage.
 *
 * IMPORTANT: the Vimeo iframe's src MUST include  api=1  (and ideally
 * autopause=0) or Vimeo silently ignores the postMessage commands.
 * Example:
 *   <iframe src="https://player.vimeo.com/video/123?autoplay=1&muted=1&api=1&autopause=0&playsinline=1" ...></iframe>
 *
 * Usage:
 *   <script src="js/vimeo-scroll-pause.js?v=3"></script>
 *
 * Defaults: targets every iframe whose src points at player.vimeo.com that
 * is inside #autoplayer (the standard hero wrapper used across the site).
 * To override the selector or threshold, set a config object BEFORE this
 * script loads:
 *   <script>
 *     window.VimeoScrollPauseConfig = {
 *       selector: '#autoplayer iframe[src*="player.vimeo.com"]',
 *       threshold: 0.1,
 *       debug: false
 *     };
 *   </script>
 *
 * Behavior notes:
 *  - If the user manually pauses (via Vimeo's controls) and then scrolls away,
 *    we do NOT auto-resume on scroll-back until they press play again.
 *  - Also pauses when the browser tab is hidden, resumes when it returns
 *    into view (if the video was playing before).
 */
(function () {
	'use strict';

	var ATTACHED_FLAG = 'vimeoScrollPauseAttached';
	var cfg = window.VimeoScrollPauseConfig || {};
	var SELECTOR = cfg.selector || '#autoplayer iframe[src*="player.vimeo.com"]';
	var THRESHOLD = typeof cfg.threshold === 'number' ? cfg.threshold : 0.1;
	var DEBUG = !!cfg.debug;

	function log() {
		if (!DEBUG || typeof console === 'undefined' || !console.log) return;
		var args = Array.prototype.slice.call(arguments);
		args.unshift('[vimeo-scroll-pause]');
		console.log.apply(console, args);
	}

	function postToVimeo(iframe, method, value) {
		if (!iframe || !iframe.contentWindow) return;
		try {
			var msg = { method: method };
			if (typeof value !== 'undefined') msg.value = value;
			// JSON.stringify + "*" target origin is the most cross-browser-safe
			// way to talk to a Vimeo iframe (works on every Vimeo build).
			iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
		} catch (_) {}
	}

	function subscribeToVimeo(iframe, eventName) {
		postToVimeo(iframe, 'addEventListener', eventName);
	}

	function parseVimeoMessage(data) {
		if (typeof data === 'string') {
			try {
				return JSON.parse(data);
			} catch (_) {
				return null;
			}
		}
		return data;
	}

	function attach(iframe) {
		if (iframe.dataset[ATTACHED_FLAG] === '1') return;
		iframe.dataset[ATTACHED_FLAG] = '1';
		log('attach', iframe.src);

		var userWantsPlaying = true;
		var pausedByScroll = false;
		var isInView = true;

		function pauseForScroll() {
			pausedByScroll = true;
			log('pause (scroll-out)');
			postToVimeo(iframe, 'pause');
		}

		function resumeForScroll() {
			if (!userWantsPlaying) {
				log('skip resume — user manually paused');
				return;
			}
			log('play (scroll-in)');
			postToVimeo(iframe, 'play');
			pausedByScroll = false;
		}

		// Listen for player events so we can tell apart manual pause/play vs
		// scroll-driven pause/play.
		function onMessage(e) {
			if (e.source !== iframe.contentWindow) return;
			var data = parseVimeoMessage(e.data);
			if (!data) return;
			if (data.event === 'pause') {
				if (pausedByScroll) {
					pausedByScroll = false;
					return;
				}
				userWantsPlaying = false;
				log('user paused');
			} else if (data.event === 'play') {
				userWantsPlaying = true;
				log('user played');
			}
		}
		window.addEventListener('message', onMessage, false);

		// Subscribe a bit later, the iframe's player needs a moment after the
		// page loads to start accepting addEventListener messages.
		setTimeout(function () {
			subscribeToVimeo(iframe, 'pause');
			subscribeToVimeo(iframe, 'play');
		}, 400);

		// Observe the iframe directly — it has explicit dimensions and is the
		// most reliable target across page layouts.
		if ('IntersectionObserver' in window) {
			var observer = new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						var nowInView =
							entry.isIntersecting && entry.intersectionRatio >= THRESHOLD;
						log(
							'observer',
							'ratio=' + entry.intersectionRatio.toFixed(2),
							'inView=' + nowInView
						);
						if (nowInView === isInView) return;
						isInView = nowInView;
						if (isInView) {
							resumeForScroll();
						} else {
							pauseForScroll();
						}
					});
				},
				{ threshold: [0, THRESHOLD, 0.5, 1] }
			);
			observer.observe(iframe);
		} else {
			// Fallback: throttled scroll listener using getBoundingClientRect.
			var ticking = false;
			var checkVisibility = function () {
				var rect = iframe.getBoundingClientRect();
				var vh = window.innerHeight || document.documentElement.clientHeight;
				var visibleHeight = Math.max(
					0,
					Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
				);
				var ratio = rect.height ? visibleHeight / rect.height : 0;
				var nowInView = ratio >= THRESHOLD;
				if (nowInView !== isInView) {
					isInView = nowInView;
					if (isInView) resumeForScroll();
					else pauseForScroll();
				}
				ticking = false;
			};
			window.addEventListener(
				'scroll',
				function () {
					if (!ticking) {
						window.requestAnimationFrame(checkVisibility);
						ticking = true;
					}
				},
				{ passive: true }
			);
			checkVisibility();
		}

		document.addEventListener('visibilitychange', function () {
			if (document.hidden) {
				pauseForScroll();
			} else if (isInView) {
				resumeForScroll();
			}
		});
	}

	function init() {
		var iframes = document.querySelectorAll(SELECTOR);
		log('init found', iframes.length, 'iframe(s) for selector', SELECTOR);
		if (!iframes.length) return;
		Array.prototype.forEach.call(iframes, attach);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
