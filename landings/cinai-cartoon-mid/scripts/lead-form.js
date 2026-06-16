/* Lead magnet: email -> n8n nurture webhook (nhận workflow CinAI miễn phí).
   Song ngữ: message + placeholder đồng bộ với localStorage 'cinai_lang' của i18n.
   Tracking Lead qua cinaiTrack (nếu có) + dataLayer. Honeypot chống bot. */
(function () {
  var form = document.getElementById('lead-form');
  if (!form) return;
  var msg = document.getElementById('lead-msg');
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  var GIFT = 'free_cinai_workflow';

  var T = {
    en: {
      invalid: 'Please enter a valid email address.',
      sending: 'Sending…',
      success: 'Check your inbox — your free CinAI workflow is on the way. 🎬',
      error: 'Something went wrong. Please try again.'
    },
    vi: {
      invalid: 'Vui lòng nhập email hợp lệ.',
      sending: 'Đang gửi…',
      success: 'Kiểm tra hộp thư — workflow CinAI miễn phí đang trên đường tới bạn. 🎬',
      error: 'Có lỗi xảy ra. Vui lòng thử lại.'
    }
  };
  function lang() { try { return localStorage.getItem('cinai_lang') === 'vi' ? 'vi' : 'en'; } catch (e) { return 'en'; } }
  function t(k) { return (T[lang()] || T.en)[k]; }
  function setMsg(text, type) { msg.textContent = text; msg.className = 'lead-msg ' + (type || ''); }

  function applyPlaceholders() {
    var l = lang();
    Array.prototype.forEach.call(form.querySelectorAll('[data-ph-en]'), function (el) {
      var v = el.getAttribute(l === 'vi' ? 'data-ph-vi' : 'data-ph-en');
      if (v != null) el.setAttribute('placeholder', v);
    });
  }
  applyPlaceholders();
  // đổi ngôn ngữ qua nút [data-lang-btn] -> cập nhật placeholder
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-lang-btn]');
    if (b) setTimeout(applyPlaceholders, 0);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.company && form.company.value) return; // honeypot: bot điền -> bỏ qua

    var email = (form.email.value || '').trim();
    var name = (form.name.value || '').trim();
    if (!EMAIL_RE.test(email)) {
      form.email.setAttribute('aria-invalid', 'true');
      setMsg(t('invalid'), 'error');
      form.email.focus();
      return;
    }
    form.email.removeAttribute('aria-invalid');

    var btn = form.querySelector('button[type="submit"]');
    var original = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = t('sending');

    // (1) Tracking Lead
    try {
      if (typeof window.cinaiTrack === 'function') window.cinaiTrack('Lead', { email: email, name: name, content_name: GIFT });
      else if (window.fbq) window.fbq('track', 'Lead', { content_name: GIFT });
    } catch (e2) { /* noop */ }
    try { (window.dataLayer = window.dataLayer || []).push({ event: 'lead', form: GIFT }); } catch (e3) { /* noop */ }

    // (2) Enroll vào chuỗi nurture (webhook n8n). URL placeholder/{{}} -> demo mode (không gọi mạng).
    var CFG = window.CINAI_CONFIG || {};
    var nurture = CFG.NURTURE_WEBHOOK || form.getAttribute('data-webhook') || '';
    var isPlaceholder = !nurture || nurture.indexOf('{{') !== -1;
    var body = JSON.stringify({
      name: name, email: email, gift: GIFT, campaign: 'nurture_default',
      source: 'lead-magnet-free-workflow', page: location.href
    });
    var request = isPlaceholder
      ? Promise.resolve()
      : fetch(nurture, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: body, keepalive: true });

    request
      .then(function () {
        var fields = form.querySelector('.lead-fields');
        var fine = form.querySelector('.lead-fine');
        if (fields) fields.style.display = 'none';
        if (fine) fine.style.display = 'none';
        setMsg(t('success'), 'success');
      })
      .catch(function () {
        btn.disabled = false;
        btn.innerHTML = original;
        setMsg(t('error'), 'error');
      });
  });
})();
