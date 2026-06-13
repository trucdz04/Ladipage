// pricing-toggle.js — chuyển giá tháng/năm (yearly = -20%)
(function () {
  const root = document.querySelector('[data-pricing]');
  if (!root) return;
  const tabs = root.querySelectorAll('[data-billing]');
  const setBilling = (mode) => {
    root.dataset.mode = mode;
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.billing === mode));
    root.querySelectorAll('[data-price]').forEach((el) => {
      const v = el.dataset[mode]; // data-monthly / data-yearly
      if (v != null) el.textContent = v;
    });
    root.querySelectorAll('[data-sub]').forEach((el) => {
      el.textContent = el.dataset[mode] || '';
    });
    // hiện/ẩn chi tiết "billed annually"
    root.querySelectorAll('[data-annual-only]').forEach((el) => {
      el.style.display = mode === 'yearly' ? '' : 'none';
    });
  };
  tabs.forEach((t) => t.addEventListener('click', () => setBilling(t.dataset.billing)));
  setBilling('yearly'); // mặc định như bản gốc
})();
