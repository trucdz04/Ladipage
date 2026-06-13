// faq-accordion.js — single-open accordion (giống bản gốc: chỉ 1 mục mở/lần)
(function () {
  const items = document.querySelectorAll('[data-faq-item]');
  items.forEach((item) => {
    const btn = item.querySelector('[data-faq-q]');
    const panel = item.querySelector('[data-faq-a]');
    if (!btn || !panel) return;
    btn.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = '0px';
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // đóng tất cả
      items.forEach((other) => {
        other.classList.remove('open');
        const ob = other.querySelector('[data-faq-q]');
        const op = other.querySelector('[data-faq-a]');
        if (ob) ob.setAttribute('aria-expanded', 'false');
        if (op) op.style.maxHeight = '0px';
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
})();
