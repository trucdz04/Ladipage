// goal-toggle.js — "Choose your goal" Views/Followers/Sales: đổi nội dung 2 card
(function () {
  const root = document.querySelector('.auto-goals');
  if (!root) return;
  const tabs = [...root.querySelectorAll('.goal-tab')];
  if (!tabs.length) return;

  const ICON = {
    views: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    followers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    sales: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
  };

  const GOALS = {
    views: {
      emoji: '🔥', title: 'Go Viral on Autopilot',
      desc: 'AI writes scripts with pattern-interrupt hooks, curiosity gaps, and proven viral formulas. Every video is engineered to maximize watch time and get pushed by the algorithm.',
      checks: ['Pattern-interrupt hooks that stop the scroll', 'Curiosity gaps & open loops for retention', 'Trending topics from a 30-90 topic pool'],
      num: '10x', sub: 'more reach with daily posting'
    },
    followers: {
      emoji: '🚀', title: 'Build a Loyal Audience',
      desc: 'The algorithm rewards consistency. Automations posts 1-3 videos per day, every day, building authority and recognition so viewers become fans.',
      checks: ['1-3 videos posted daily, automatically', 'Authority-positioning content strategy', 'Smart follow CTAs woven into scripts'],
      num: '90', sub: 'videos/month on autopilot'
    },
    sales: {
      emoji: '💰', title: 'Turn Views Into Revenue',
      desc: 'Attach your brand, products, or affiliate links. AI reads your brand docs, weaves natural mentions into the script, and places your media with Smart Mix.',
      checks: ['Brand knowledge docs for context-aware promos', 'Smart Mix: AI + brand media in every video', 'Natural CTAs — "comment", "visit", "share"'],
      num: '$3,400', sub: 'avg. monthly revenue from automations'
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
  render('views');
})();
