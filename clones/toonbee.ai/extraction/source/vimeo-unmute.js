/*!
 * vimeo-unmute.js
 * Adds a centered "Click to Unmute" overlay on top of muted Vimeo hero videos.
 * Required because mobile browsers block unmuted autoplay; the video starts
 * muted and the user taps the overlay to enable sound.
 *
 * Targets any iframe inside #autoplayer that points at player.vimeo.com.
 * Also gives every muted Vimeo iframe inside .section4-pro-box-dark a
 * click-to-toggle-mute behavior (gallery-style: only one sample plays sound
 * at a time, clicking again mutes it back).
 * Requires the official Vimeo Player API (https://player.vimeo.com/api/player.js).
 */
(function () {
	'use strict';

	var STYLE_ID = 'vimeo-unmute-styles';
	var ATTACHED_FLAG = 'unmuteAttached';

	/**
	 * Wait until window.Vimeo.Player exists. We cannot rely on the Vimeo script
	 * tag's "load" event — if the script finished before this file runs (common
	 * when the API is a blocking <script> right above us), "load" never fires
	 * and the overlay would never attach (seen on production).
	 * Also supports pages that only load async `js/player.js` (bundled API).
	 */
	function waitForVimeoPlayer(callback) {
		if (window.Vimeo && window.Vimeo.Player) {
			callback();
			return;
		}
		var tries = 0;
		var max = 300; // 300 × 50ms = 15s
		var id = setInterval(function () {
			tries++;
			if (window.Vimeo && window.Vimeo.Player) {
				clearInterval(id);
				callback();
			} else if (tries >= max) {
				clearInterval(id);
				if (typeof console !== 'undefined' && console.warn) {
					console.warn(
						'[vimeo-unmute] Vimeo Player API not found after 15s. ' +
							'Ensure https://player.vimeo.com/api/player.js or js/player.js loads. ' +
							'Unmute overlay skipped.'
					);
				}
			}
		}, 50);
	}

	function injectStyles() {
		if (document.getElementById(STYLE_ID)) return;
		var style = document.createElement('style');
		style.id = STYLE_ID;
		style.textContent = [
			'.vimeo-unmute-host { position: relative; }',
			'.vimeo-unmute-overlay {',
			'  position: absolute;',
			'  top: 50%;',
			'  left: 50%;',
			'  transform: translate(-50%, -50%);',
			'  z-index: 2147483000;',
			'  display: inline-flex;',
			'  align-items: center;',
			'  justify-content: center;',
			'  gap: 10px;',
			'  min-height: 48px;',
			'  padding: 14px 26px;',
			'  background: rgba(0, 0, 0, 0.78);',
			'  color: #ffffff;',
			'  font-family: "Outfit", "Inter", system-ui, -apple-system, sans-serif;',
			'  font-weight: 600;',
			'  font-size: 16px;',
			'  line-height: 1;',
			'  letter-spacing: 0.3px;',
			'  white-space: nowrap;',
			'  border: 0;',
			'  border-radius: 14px;',
			'  cursor: pointer;',
			'  user-select: none;',
			'  -webkit-user-select: none;',
			'  pointer-events: auto;',
			'  touch-action: manipulation;',
			'  -webkit-tap-highlight-color: transparent;',
			'  -webkit-appearance: none;',
			'  appearance: none;',
			'  -webkit-backdrop-filter: blur(6px);',
			'  backdrop-filter: blur(6px);',
			'  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);',
			'  transition: transform 0.18s ease, background 0.18s ease, opacity 0.25s ease;',
			'  animation: vimeo-unmute-pulse 2s ease-in-out infinite;',
			'}',
			'.vimeo-unmute-overlay:hover {',
			'  background: rgba(0, 0, 0, 0.92);',
			'}',
			'.vimeo-unmute-overlay:active {',
			'  transform: translate(-50%, -50%) scale(0.96);',
			'  animation: none;',
			'}',
			'.vimeo-unmute-overlay:focus-visible {',
			'  outline: 2px solid #ffd21d;',
			'  outline-offset: 3px;',
			'}',
			'.vimeo-unmute-overlay svg {',
			'  width: 22px;',
			'  height: 22px;',
			'  flex-shrink: 0;',
			'  pointer-events: none;',
			'}',
			'.vimeo-unmute-overlay span { pointer-events: none; }',
			'.vimeo-unmute-overlay.is-hidden {',
			'  opacity: 0;',
			'  pointer-events: none;',
			'  animation: none;',
			'}',
			'@keyframes vimeo-unmute-pulse {',
			'  0%, 100% { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), 0 0 0 0 rgba(255, 210, 29, 0.55); }',
			'  50%      { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), 0 0 0 12px rgba(255, 210, 29, 0); }',
			'}',
			'@media (max-width: 767px) {',
			'  .vimeo-unmute-overlay { font-size: 14px; padding: 12px 20px; gap: 9px; border-radius: 12px; min-height: 44px; }',
			'  .vimeo-unmute-overlay svg { width: 20px; height: 20px; }',
			'}',
			'@media (max-width: 380px) {',
			'  .vimeo-unmute-overlay { font-size: 12px; padding: 10px 16px; gap: 7px; min-height: 44px; }',
			'  .vimeo-unmute-overlay svg { width: 18px; height: 18px; }',
			'}',
			'@media (prefers-reduced-motion: reduce) {',
			'  .vimeo-unmute-overlay { animation: none; transition: opacity 0.2s ease; }',
			'  .vimeo-unmute-overlay:active { transform: translate(-50%, -50%); }',
			'}'
		].join('\n');
		document.head.appendChild(style);
	}

	function buildOverlay() {
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'vimeo-unmute-overlay';
		btn.setAttribute('aria-label', 'Click to unmute');
		btn.innerHTML =
			'<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
			'<path d="M11 5L6 9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3l5 4V5z" fill="currentColor"/>' +
			'<path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
			'</svg>' +
			'<span>Click to Unmute</span>';
		return btn;
	}

	function attach(iframe) {
		// Prefer .autoplayer-subarea (has the padding-bottom aspect-ratio box that
		// gives the container real visible height) over #autoplayer (which is a
		// zero-height wrapper around an absolutely-positioned iframe).
		var host = iframe.closest('.autoplayer-subarea') ||
			iframe.closest('#autoplayer') ||
			iframe.parentElement;
		if (!host || host.dataset[ATTACHED_FLAG] === '1') return;
		host.dataset[ATTACHED_FLAG] = '1';
		host.classList.add('vimeo-unmute-host');

		var overlay = buildOverlay();
		host.appendChild(overlay);

		var player;
		try {
			player = new Vimeo.Player(iframe);
		} catch (err) {
			overlay.parentNode && overlay.parentNode.removeChild(overlay);
			return;
		}

		var hide = function () {
			overlay.classList.add('is-hidden');
			setTimeout(function () {
				if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
			}, 300);
		};

		var handleActivate = function (e) {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}
			// Fire all three calls inside the same user-gesture tick. iOS Safari
			// requires that audio-enabling API calls be initiated synchronously
			// from a real user interaction, otherwise it silently rejects them.
			try { player.setMuted(false); } catch (_) {}
			try { player.setVolume(1); } catch (_) {}
			try { player.play(); } catch (_) {}
			hide();
		};

		// Use both pointerup (covers mouse, touch, pen) and click (keyboard
		// activation, accessibility). The handler is idempotent thanks to hide().
		overlay.addEventListener('click', handleActivate);
		overlay.addEventListener('touchend', function (e) {
			// Prevent iOS from firing a synthetic 300ms-delayed click after touch.
			e.preventDefault();
			handleActivate(e);
		}, { passive: false });

		player.on('volumechange', function (data) {
			if (data && data.muted === false && data.volume > 0) hide();
		});
	}

	function init() {
		var iframes = document.querySelectorAll('#autoplayer iframe[src*="player.vimeo.com"]');
		if (!iframes.length) return;
		injectStyles();
		waitForVimeoPlayer(function () {
			Array.prototype.forEach.call(iframes, attach);
		});
	}

	/* ---------------------------------------------------------------------
	 * Sample gallery: click any muted Vimeo sample to unmute it.
	 * Clicking the currently unmuted sample mutes it again. Clicking a
	 * different one mutes the previous one so only one plays audio at a time.
	 * ------------------------------------------------------------------- */

	var SAMPLE_STYLE_ID = 'vimeo-sample-unmute-styles';
	var SAMPLE_ATTACHED_FLAG = 'sampleUnmuteAttached';

	function injectSampleStyles() {
		if (document.getElementById(SAMPLE_STYLE_ID)) return;
		var style = document.createElement('style');
		style.id = SAMPLE_STYLE_ID;
		style.textContent = [
			'.section4-pro-box-dark .vimeo-embed-wrapper .vsu-click-shield {',
			'  position: absolute;',
			'  top: 0;',
			'  left: 0;',
			'  width: 100%;',
			'  height: 100%;',
			'  z-index: 4;',
			'  background: transparent;',
			'  cursor: pointer;',
			'}'
		].join('\n');
		document.head.appendChild(style);
	}

	function attachSample(iframe, registry) {
		var wrapper = iframe.closest('.vimeo-embed-wrapper');
		if (!wrapper || wrapper.dataset[SAMPLE_ATTACHED_FLAG] === '1') return;
		wrapper.dataset[SAMPLE_ATTACHED_FLAG] = '1';

		var player;
		try {
			player = new Vimeo.Player(iframe);
		} catch (err) {
			return;
		}

		// Invisible overlay that catches the first click only. After unmute it
		// removes itself so Vimeo's native controls (play/pause/seek/fullscreen)
		// are fully reachable.
		var shield = document.createElement('div');
		shield.className = 'vsu-click-shield';

		var entry = { player: player, wrapper: wrapper, shield: shield };
		registry.push(entry);

		var activate = function (e) {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}
			// Mute every other sample so only one plays audio at a time.
			for (var i = 0; i < registry.length; i++) {
				var other = registry[i];
				if (other === entry) continue;
				try { other.player.setMuted(true); } catch (_) {}
			}
			try { player.setMuted(false); } catch (_) {}
			try { player.setVolume(1); } catch (_) {}
			try { player.play(); } catch (_) {}
			if (shield.parentNode) shield.parentNode.removeChild(shield);
			entry.shield = null;
		};

		shield.addEventListener('click', activate);
		shield.addEventListener('touchend', function (e) {
			e.preventDefault();
			activate(e);
		}, { passive: false });

		wrapper.appendChild(shield);
	}

	function initSamples() {
		var iframes = document.querySelectorAll(
			'.section4-pro-box-dark .vimeo-embed-wrapper iframe[src*="player.vimeo.com"]'
		);
		if (!iframes.length) return;
		injectSampleStyles();
		waitForVimeoPlayer(function () {
			var registry = [];
			Array.prototype.forEach.call(iframes, function (iframe) {
				attachSample(iframe, registry);
			});
		});
	}

	function boot() {
		init();
		initSamples();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else {
		boot();
	}
})();
