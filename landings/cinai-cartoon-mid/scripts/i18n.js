/* Song ngữ EN/VI — mặc định EN. Dịch theo TEXT-NODE: từ điển EN→VI ở window.CINAI_VI
   (scripts/i18n-vi.js). Không cần sửa markup; chỉ thay nội dung text, giữ nguyên span/img/gradient.
   Lưu lựa chọn vào localStorage. */
(function () {
  var STORE = 'cinai_lang';
  var MAP = window.CINAI_VI || {};
  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }

  var viByNorm = {};
  Object.keys(MAP).forEach(function (k) { viByNorm[norm(k)] = MAP[k]; });

  var items = []; // { node, en }

  function collect() {
    if (!document.body) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TITLE') return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('.lang-switch')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) items.push({ node: n, en: n.nodeValue });
  }

  function apply(lang) {
    document.documentElement.setAttribute('lang', lang);
    items.forEach(function (it) {
      if (lang === 'vi') {
        var vi = viByNorm[norm(it.en)];
        if (vi != null) {
          var m = it.en.match(/^(\s*)[\s\S]*?(\s*)$/);
          it.node.nodeValue = (m ? m[1] : '') + vi + (m ? m[2] : '');
        }
      } else if (it.node.nodeValue !== it.en) {
        it.node.nodeValue = it.en;
      }
    });
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang-btn') === lang);
    });
    try { localStorage.setItem(STORE, lang); } catch (e) {}
  }

  function init() {
    collect();
    var lang = 'en';
    try { var s = localStorage.getItem(STORE); if (s === 'vi' || s === 'en') lang = s; } catch (e) {}
    apply(lang);
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-lang-btn]');
      if (b) apply(b.getAttribute('data-lang-btn'));
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
  window.__cinaiSetLang = apply;
})();
