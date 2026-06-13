// roi-calculator.js — 4 slider → công thức ROI (theo extraction/behavior-map.md)
(function () {
  const root = document.querySelector('[data-roi]');
  if (!root) return;

  const MONTHLY_COST = 29; // gói $29/mo để tính ROI multiple
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
    const videosPerDay = +els.videos.value;
    const avgViews = +els.views.value;
    const buyerRate = +els.rate.value;     // %
    const productValue = +els.value.value; // $

    const monthlyVideos = videosPerDay * 30;
    const totalViews = monthlyVideos * avgViews;
    const estSales = totalViews * (buyerRate / 100);
    const revenue = estSales * productValue;
    const roiMultiple = revenue / MONTHLY_COST;

    if (out.videosVal) out.videosVal.textContent = String(videosPerDay);
    if (out.viewsVal) out.viewsVal.textContent = (avgViews / 1000).toFixed(1) + 'K';
    if (out.rateVal) out.rateVal.textContent = buyerRate + '%';
    if (out.valueVal) out.valueVal.textContent = '$' + productValue;

    if (out.monthlyVideos) out.monthlyVideos.textContent = fmtNum(monthlyVideos);
    if (out.totalViews) out.totalViews.textContent = fmtNum(totalViews);
    if (out.estSales) out.estSales.textContent = fmtNum(estSales);
    if (out.revenue) out.revenue.textContent = fmtMoney(revenue) + '/mo';
    if (out.revPlain) out.revPlain.textContent = fmtMoney(revenue);
    if (out.roi) out.roi.textContent = roiMultiple.toFixed(2) + 'x return on your investment. 🔥';
    if (out.cpv) out.cpv.textContent = '$' + (MONTHLY_COST / monthlyVideos).toFixed(2);

    // profit margin + cost-vs-revenue comparison bar
    const margin = revenue > 0 ? Math.round(((revenue - MONTHLY_COST) / revenue) * 100) : 0;
    if (out.margin) out.margin.textContent = Math.max(0, margin) + '%';
    const total = MONTHLY_COST + revenue;
    const costPct = total > 0 ? (MONTHLY_COST / total) * 100 : 0;
    if (out.barCost) out.barCost.style.width = costPct.toFixed(2) + '%';
    if (out.barRev) out.barRev.style.width = (100 - costPct).toFixed(2) + '%';

    [els.videos, els.views, els.rate, els.value].forEach((i) => i && paintTrack(i));
  };

  [els.videos, els.views, els.rate, els.value].forEach((i) => i && i.addEventListener('input', update));
  update();
})();
