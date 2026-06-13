// automation-pipeline.js — pipeline trái + panel phải đổi màn hình theo từng bước (như video)
(function () {
  const wrap = document.querySelector('.auto-pipe');
  const body = document.querySelector('.auto-dash-body');
  if (!wrap || !body) return;
  const steps = [...wrap.querySelectorAll('.auto-pipe-step:not(.is-restart)')];
  const restart = wrap.querySelector('.auto-pipe-step.is-restart');
  const complete = wrap.querySelector('.auto-pipe-complete');
  const screens = [...body.querySelectorAll('.auto-screen')];
  if (!steps.length) return;

  const STEP_MS = 2200;
  const STATUS = { done: 'Completed', active: 'In progress...', wait: 'Waiting...' };
  let active = 0;
  let subTimers = [];
  const clearSubs = () => { subTimers.forEach(clearInterval); subTimers = []; };

  function renderPipe() {
    steps.forEach((s, i) => {
      s.classList.remove('is-completed', 'is-active', 'is-waiting');
      const st = s.querySelector('.auto-pipe-status');
      if (i < active) { s.classList.add('is-completed'); st.textContent = STATUS.done; }
      else if (i === active) { s.classList.add('is-active'); st.textContent = STATUS.active; }
      else { s.classList.add('is-waiting'); st.textContent = STATUS.wait; }
    });
    const done = active >= steps.length;
    if (restart) restart.style.display = done ? 'none' : '';
    if (complete) complete.classList.toggle('is-shown', done);
  }

  function showScreen(i) {
    const idx = Math.min(i, screens.length - 1);
    screens.forEach((s) => s.classList.toggle('is-on', +s.dataset.screen === idx));
    clearSubs();
    const scr = screens[idx];
    if (!scr) return;

    if (idx === 2) { // audio progress
      const fill = scr.querySelector('.as-progress-fill');
      const cur = scr.querySelector('.as-cur');
      fill.style.transition = 'none'; fill.style.width = '0%';
      void fill.offsetWidth;
      fill.style.transition = 'width ' + STEP_MS + 'ms linear';
      fill.style.width = '100%';
      let t = 0;
      const ci = setInterval(() => {
        t += 3; if (t >= 45) { t = 45; clearInterval(ci); }
        cur.textContent = '0:' + String(t).padStart(2, '0');
      }, STEP_MS / 15);
      subTimers.push(ci);
    } else if (idx === 3) { // visual assembly counter
      const cnt = scr.querySelector('.as-count');
      const scenes = [...scr.querySelectorAll('.as-scene')];
      scenes.forEach((s) => s.classList.remove('is-on'));
      cnt.textContent = '0';
      let k = 0;
      const ci = setInterval(() => {
        if (k < scenes.length) { scenes[k].classList.add('is-on'); cnt.textContent = String(k + 1); k++; }
        else clearInterval(ci);
      }, STEP_MS / 5);
      subTimers.push(ci);
    } else if (idx === 4) { // publishing
      const plats = [...scr.querySelectorAll('.as-plat')];
      plats.forEach((p) => { p.classList.remove('is-pub'); p.querySelector('.as-pstat').textContent = 'Waiting...'; });
      let k = 0;
      const ci = setInterval(() => {
        if (k < plats.length) { plats[k].classList.add('is-pub'); plats[k].querySelector('.as-pstat').textContent = 'Published'; k++; }
        else clearInterval(ci);
      }, STEP_MS / 5);
      subTimers.push(ci);
    } else if (idx === 5) { // dashboard count-up
      countUp(scr);
    }
  }

  function countUp(scr) {
    const vals = [...scr.querySelectorAll('.auto-dash-val[data-count]')];
    const steps2 = 30;
    let n = 0;
    const ci = setInterval(() => {
      n++;
      const p = Math.min(n / steps2, 1);
      vals.forEach((el) => {
        const target = +el.dataset.count;
        const div = +(el.dataset.div || 1);
        const dec = +(el.dataset.dec || 0);
        const pre = el.dataset.prefix || '';
        const suf = el.dataset.suffix || '';
        let v = target * p / div;
        let txt = dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
        el.textContent = pre + txt + suf;
      });
      if (p >= 1) clearInterval(ci);
    }, STEP_MS / steps2);
    subTimers.push(ci);
  }

  function tick() {
    active = active >= steps.length ? 0 : active + 1;
    renderPipe();
    showScreen(active >= steps.length ? steps.length - 1 : active);
  }

  let timer = null;
  const start = () => { if (!timer) { renderPipe(); showScreen(0); timer = setInterval(tick, STEP_MS); } };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } clearSubs(); };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? start() : stop()));
    }, { threshold: 0.2 });
    io.observe(wrap);
  } else { start(); }
})();
