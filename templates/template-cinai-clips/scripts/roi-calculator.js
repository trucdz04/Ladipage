// roi-calculator.js — 4 slider → công thức tiết kiệm chi phí creative của CinAI
(function () {
  const root = document.querySelector('[data-roi]');
  if (!root) return;

  const MONTHLY_COST = 59; // gói CinAI Plus $59/mo để so sánh tiết kiệm
  const els = {
    videos: root.querySelector('[data-roi-videos]'),
    views: root.querySelector('[data-roi-views]'),
    rate: root.querySelector('[data-roi-rate]'),
    value: root.querySelector('[data-roi-value]'),
  };
  const out = {
    videosVal: root.querySelector('[data-out-videos-val]'),
    viewsVal: root.querySelector('[data-out-views-val]'),
    rateVal: root.querySelector('[data-out-rate-val]'),
    valueVal: root.querySelector('[data-out-value-val]'),
    monthlyVideos: root.querySelector('[data-out-monthly-videos]'),
    totalViews: root.querySelector('[data-out-total-views]'),
    estSales: root.querySelector('[data-out-est-sales]'),
    revenue: root.querySelector('[data-out-revenue]'),
    revPlain: root.querySelector('[data-out-rev-plain]'),
    roi: root.querySelector('[data-out-roi]'),
    cpv: root.querySelector('[data-out-cpv]'),
    margin: root.querySelector('[data-out-margin]'),
    barCost: root.querySelector('[data-bar-cost]'),
    barRev: root.querySelector('[data-bar-rev]'),
  };

  const fmtNum = (n) => {
    if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'K';
    return String(Math.round(n));
  };
  const fmtMoney = (n) =>
    '$' + Math.round(n).toLocaleString('en-US');

  // tô màu track theo % giá trị
  const paintTrack = (input) => {
    const min = +input.min, max = +input.max, val = +input.value;
    const pct = ((val - min) / (max - min)) * 100;
    input.style.background =
      `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${pct}%, var(--color-border) ${pct}%, var(--color-border) 100%)`;
  };

  const update = () => {
    const creatives = +els.videos.value;     // creatives / month
    const oldCostPer = +els.views.value;      // $ per creative the old way
    const hoursSaved = +els.rate.value;       // hours saved per creative
    const hourlyRate = +els.value.value;      // $ / hour

    const oldCashCost = creatives * oldCostPer;          // what you'd pay out the old way
    const totalHoursSaved = creatives * hoursSaved;      // hours
    const timeValue = totalHoursSaved * hourlyRate;      // $ value of time saved
    const oldTotal = oldCashCost + timeValue;            // total old-way cost (cash + time)
    const savings = Math.max(0, oldTotal - MONTHLY_COST); // monthly savings vs CinAI plan
    const roiMultiple = oldTotal / MONTHLY_COST;

    if (out.videosVal) out.videosVal.textContent = String(creatives);
    if (out.viewsVal) out.viewsVal.textContent = '$' + oldCostPer;
    if (out.rateVal) out.rateVal.textContent = hoursSaved.toFixed(1) + 'h';
    if (out.valueVal) out.valueVal.textContent = '$' + hourlyRate;

    if (out.monthlyVideos) out.monthlyVideos.textContent = fmtNum(creatives);
    if (out.totalViews) out.totalViews.textContent = fmtMoney(oldCashCost);
    if (out.estSales) out.estSales.textContent = fmtNum(totalHoursSaved);
    if (out.revenue) out.revenue.textContent = fmtMoney(savings) + '/mo';
    if (out.revPlain) out.revPlain.textContent = fmtMoney(savings);
    if (out.roi) out.roi.textContent = "That's " + roiMultiple.toFixed(1) + '× your CinAI plan back. 🔥';
    if (out.cpv) out.cpv.textContent = '$' + (MONTHLY_COST / creatives).toFixed(2);

    // savings % + plan-vs-savings comparison bar (red = what you pay, mint = what you save)
    const savePct = oldTotal > 0 ? Math.round((savings / oldTotal) * 100) : 0;
    if (out.margin) out.margin.textContent = Math.max(0, savePct) + '%';
    const costPct = oldTotal > 0 ? (MONTHLY_COST / oldTotal) * 100 : 0;
    if (out.barCost) out.barCost.style.width = Math.min(100, costPct).toFixed(2) + '%';
    if (out.barRev) out.barRev.style.width = Math.max(0, 100 - costPct).toFixed(2) + '%';

    [els.videos, els.views, els.rate, els.value].forEach((i) => i && paintTrack(i));
  };

  [els.videos, els.views, els.rate, els.value].forEach((i) => i && i.addEventListener('input', update));
  update();
})();
