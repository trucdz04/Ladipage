# Client Setup (Lớp 1 Browser) — meta-tracking

> Tham chiếu cho [`meta-tracking`](../SKILL.md). Nhúng Pixel + `tracking.js` vào **landing và app chính**.
> Tham số hoá để tái dùng cho mọi sản phẩm.

## Config (1 lần / dự án)

```js
// tracking-config.js  — nhúng trước tracking.js
window.TRK = {
  PIXEL_ID:    "PIXEL_ID_HERE",
  N8N_WEBHOOK: "https://<n8n-domain>/webhook/cinai-track",
  MAIN_DOMAIN: "cinai.tv",     // app chính nhận CTA
  ROOT_COOKIE: ".cinai.tv"     // cookie first-party chia sẻ chéo subdomain
};
```

## Meta Pixel base (đặt trong `<head>` mọi trang)

```html
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', window.TRK.PIXEL_ID);
fbq('track', 'PageView');
</script>
```

## tracking.js — auto-bind sự kiện

Bắt `ViewContent` (load), `Lead` (submit form/lead-magnet), `Click_CTA` (nút CTA), nối
`fbclid/utm/fbp/fbc` sang `MAIN_DOMAIN`, set `_fbc` first-party. Mỗi event có `event_id` (dedup) và
gửi song song về `N8N_WEBHOOK`.

```js
(function(){
  var T = window.TRK || {};
  function gc(n){return document.cookie.split('; ').find(function(r){return r.indexOf(n+'=')===0})?.split('=')[1]||'';}
  function uid(p){return p+'_'+(crypto.randomUUID?crypto.randomUUID():Date.now()+'_'+Math.random().toString(36).slice(2,8));}
  var qs = new URLSearchParams(location.search);
  function base(extra){
    return Object.assign({
      site: location.hostname, event_source_url: location.href,
      fbp: gc('_fbp'), fbc: gc('_fbc'),
      utm_source: qs.get('utm_source')||'', utm_medium: qs.get('utm_medium')||'',
      utm_campaign: qs.get('utm_campaign')||'', utm_content: qs.get('utm_content')||'',
      utm_term: qs.get('utm_term')||''
    }, extra||{});
  }
  // QUAN TRỌNG (CORS): dùng content-type 'text/plain' — KHÔNG 'application/json'.
  // Landing thường khác origin với n8n → 'application/json' bật preflight OPTIONS, n8n không trả
  // CORS header → request bị CHẶN, không tới server. 'text/plain' là CORS-safelisted → request
  // "simple", fire-and-forget tới được webhook. n8n parse chuỗi JSON ở node Normalize (xem ref server).
  function srv(p){ try{
    var body = JSON.stringify(p);
    if (navigator.sendBeacon) navigator.sendBeacon(T.N8N_WEBHOOK, new Blob([body],{type:'text/plain;charset=UTF-8'}));
    else fetch(T.N8N_WEBHOOK, { method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=UTF-8'}, body:body, keepalive:true });
  }catch(e){} }

  if(!gc('_fbc') && qs.get('fbclid')){
    document.cookie='_fbc=fb.1.'+Date.now()+'.'+qs.get('fbclid')+'; domain='+T.ROOT_COOKIE+'; path=/; max-age=7776000';
  }

  if(window.fbq){ fbq('track','ViewContent'); }
  srv(base({ event_name:'ViewContent', event_id: uid('vc') }));

  // Lead: form lấy quà / đăng ký
  document.querySelectorAll('form[data-track-lead]').forEach(function(form){
    form.addEventListener('submit', function(){
      var email=(form.querySelector('[type=email],[name=email]')||{}).value||'';
      var name=(form.querySelector('[name=name]')||{}).value||'';
      var eid=uid('lead');
      if(window.fbq) fbq('track','Lead',{content_name: form.getAttribute('data-track-lead')||'lead'},{eventID:eid});
      srv(base({ event_name:'Lead', event_id:eid, email:email, name:name,
                 content_name: form.getAttribute('data-track-lead')||'lead' }));
    });
  });

  // Click_CTA: nút về app chính + nối tham số
  document.querySelectorAll('a[data-cta]').forEach(function(cta){
    try{
      var u=new URL(cta.href, location.href);
      ['fbclid','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){ if(qs.get(k)) u.searchParams.set(k,qs.get(k)); });
      u.searchParams.set('fbp', gc('_fbp')); u.searchParams.set('fbc', gc('_fbc'));
      cta.href=u.toString();
    }catch(e){}
    cta.addEventListener('click', function(){
      var eid=uid('cta');
      if(window.fbq) fbq('trackCustom','Click_CTA',{content_name: cta.getAttribute('data-cta')||'cta'},{eventID:eid});
      srv(base({ event_name:'Lead', event_id:eid, cta: cta.getAttribute('data-cta')||'cta' }));
    });
  });
})();
```

## Quy ước đánh dấu HTML

```html
<!-- form lead-magnet / đăng ký -->
<form data-track-lead="leadmagnet_tailieu">
  <input name="email" type="email" required>
  <label><input type="checkbox" name="consent" required> Đồng ý nhận tài liệu</label>
  <button>Nhận tài liệu</button>
</form>

<!-- nút CTA về app chính -->
<a data-cta="bat_dau_ngay" href="https://cinai.tv/signup">Bắt đầu ngay</a>
```

## App chính (cinai.tv) — lưu attribution khi vào

```js
const q=new URLSearchParams(location.search);
['fbclid','utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbp','fbc']
  .forEach(k=>{ if(q.get(k)) localStorage.setItem('attr_'+k,q.get(k)); });
if(!document.cookie.includes('_fbc=') && q.get('fbclid')){
  document.cookie=`_fbc=fb.1.${Date.now()}.${q.get('fbclid')}; domain=${window.TRK.ROOT_COOKIE}; path=/; max-age=7776000`;
}
```
Khi user đăng ký/mua → backend đọc các `attr_*` này gửi kèm CAPI (xem reference server).
