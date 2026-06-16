// goal-toggle.js — "Choose what to create" Ad Images/Product Shots/AI Video: đổi nội dung 2 card
(function () {
  const root = document.querySelector('.auto-goals');
  if (!root) return;
  const tabs = [...root.querySelectorAll('.goal-tab')];
  if (!tabs.length) return;

  const ICON = {
    adimages: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    shots: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>'
  };

  const GOALS = {
    adimages: {
      emoji: '🖼️', title: 'Scroll-Stopping Ad Images',
      desc: 'CinAI writes the concept and generates high-converting ad images & banners with GPT Image 2 and Nano Banana Pro — test 10 variations where you used to test 2.',
      checks: ['Concepts + ad copy written for you', 'Unlimited* GPT Image 2 & Nano Banana Pro', 'Ad images, banners & UGC in every size'],
      num: '10×', sub: 'more ad variations tested'
    },
    shots: {
      emoji: '📦', title: 'Studio Product Shots',
      desc: 'Upload one product photo and get clean studio shots, lookbooks and hero images — no photographer, no studio booking, no waiting on a designer.',
      checks: ['Studio-quality shots from a single photo', 'Lookbooks, hero images & catalog sets', 'Consistent lighting & brand style'],
      num: '$0', sub: 'spent on photographers & studios'
    },
    video: {
      emoji: '🎬', title: 'AI Video Ads',
      desc: 'Turn a product or idea into cinematic AI video with Omni & Seedance — storyboard with Opus 4.8, render and export ad-ready clips in minutes.',
      checks: ['Storyboards with Opus 4.8', 'Unlimited* AI video with Omni & Seedance', 'Export-ready for TikTok, Reels & YouTube'],
      num: 'Unlimited*', sub: 'AI video on the Plus plan'
    }
  };

  const CHECK = '<svg class="goal-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  const elIcon = root.querySelector('[data-goal-icon]');
  const elEmoji = root.querySelector('[data-goal-emoji]');
  const elTitle = root.querySelector('[data-goal-title]');
  const elDesc = root.querySelector('[data-goal-desc]');
  const elChecks = root.querySelector('[data-goal-checks]');
  const elNum = root.querySelector('[data-goal-num]');
  const elSub = root.querySelector('[data-goal-sub]');

  function render(key) {
    const g = GOALS[key];
    if (!g) return;
    elIcon.innerHTML = ICON[key];
    elEmoji.textContent = g.emoji;
    elTitle.textContent = g.title;
    elDesc.textContent = g.desc;
    elChecks.innerHTML = g.checks.map((c) => '<li>' + CHECK + '<span>' + c + '</span></li>').join('');
    elNum.textContent = g.num;
    elSub.textContent = g.sub;
    tabs.forEach((t) => {
      const on = t.dataset.goal === key;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  tabs.forEach((t) => t.addEventListener('click', () => render(t.dataset.goal)));
  render('adimages');
})();
