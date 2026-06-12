# Tracking Integration — Pha 7 (nhúng đo lường tự động)

> Tài liệu tham chiếu cho skill [`clone-template`](../SKILL.md).
> Mục tiêu: mọi landing clone ra **mặc định có sẵn hạ tầng tracking 4 lớp** (Browser Pixel + CAPI
> + EMQ + Deduplication) và **nối thẳng vào n8n template** — chạy **tự động hoàn toàn**, không thao tác lại.
>
> Hạ tầng backend dùng template có sẵn: [`automation/n8n/`](../../../../automation/n8n/README.md)
> (`cinai-satellite-tracking.workflow.json`). Skill chỉ **nhúng phần client** + cấu hình tham số.

## Tham số (điền 1 lần cho mỗi dự án clone)

Ghi vào `scripts/tracking-config.js` của bản clone:

| Biến | Ví dụ | Ý nghĩa |
|------|-------|---------|
| `PIXEL_ID` | `123456789` | Meta Pixel/Dataset ID |
| `N8N_WEBHOOK` | `https://n8n.example/webhook/cinai-track` | Webhook của n8n template |
| `MAIN_DOMAIN` | `cinai.tv` | Trang chính nhận CTA |
| `ROOT_COOKIE` | `.cinai.tv` | Domain cookie first-party (chia sẻ chéo subdomain) |

```js
// scripts/tracking-config.js  (TỰ SINH ở Pha 7 — sửa giá trị cho đúng dự án)
window.TRK = {
  PIXEL_ID: "PIXEL_ID_HERE",
  N8N_WEBHOOK: "https://<n8n-domain>/webhook/cinai-track",
  MAIN_DOMAIN: "cinai.tv",
  ROOT_COOKIE: ".cinai.tv"
};
```

## 1. Lớp Browser — Meta Pixel (nhúng vào `<head>` mọi trang clone)

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
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=PIXEL_ID_HERE&ev=PageView&noscript=1"/></noscript>
```

## 2. `scripts/tracking.js` — auto-inject vào mọi landing clone

Bắt: `ViewContent` (load) · `Lead` (submit form/lead-magnet) · `Click_CTA` (nút CTA) +
nối `fbclid/utm/fbp/fbc` sang `MAIN_DOMAIN`. Mỗi event có `event_id` (dedup Browser↔CAPI) và
gửi song song về `N8N_WEBHOOK` (server-side/CAPI).

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
  function srv(p){ try{ navigator.sendBeacon(T.N8N_WEBHOOK, new Blob([JSON.stringify(p)],{type:'application/json'})); }catch(e){} }

  // (1) đặt _fbc từ fbclid nếu chưa có — first-party trên ROOT_COOKIE
  if(!gc('_fbc') && qs.get('fbclid')){
    document.cookie='_fbc=fb.1.'+Date.now()+'.'+qs.get('fbclid')+'; domain='+T.ROOT_COOKIE+'; path=/; max-age=7776000';
  }
  // (2) ViewContent khi tải trang
  if(window.fbq){ fbq('track','ViewContent'); }
  srv(base({ event_name:'ViewContent', event_id: uid('vc') }));

  // (3) Lead — submit form lấy quà/tài liệu (lead-magnet) HOẶC form email bất kỳ
  document.querySelectorAll('form[data-track-lead]').forEach(function(form){
    form.addEventListener('submit', function(e){
      var email=(form.querySelector('[type=email],[name=email]')||{}).value||'';
      var name=(form.querySelector('[name=name]')||{}).value||'';
      var eid=uid('lead');
      if(window.fbq) fbq('track','Lead',{content_name: form.getAttribute('data-track-lead')||'lead'},{eventID:eid});
      srv(base({ event_name:'Lead', event_id:eid, email:email, name:name,
                 content_name: form.getAttribute('data-track-lead')||'lead' }));
      // không chặn submit/redirect mặc định của form (n8n sẽ gửi email + lưu Lark)
    });
  });

  // (4) Click_CTA — nút dẫn về MAIN_DOMAIN + nối tham số định danh
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

**Quy ước đánh dấu trong HTML clone (skill tự gắn khi build):**
- Form lấy quà/đăng ký: `<form data-track-lead="leadmagnet_tailieu">…</form>`
- Nút CTA về trang chính: `<a data-cta="bat_dau_ngay" href="https://cinai.tv/signup">…</a>`

## 3. Trên `MAIN_DOMAIN` (cinai.tv) — nguồn sự thật

`CompleteRegistration` + `Purchase` do **Backend** gửi về cùng `N8N_WEBHOOK` (payload mẫu xem
[`automation/n8n/README.md`](../../../../automation/n8n/README.md) mục 5). `Purchase` dùng `event_id = order_id`
để dedup với Pixel `/thank-you`. Trang chính đọc `fbclid/utm/fbp/fbc` từ URL → lưu attribution.

## 4. Trường hợp lead-magnet (chỉ điền email nhận tài liệu, không sang trang chính)

- Chuyển đổi = **`Lead` khi submit form** (đã xử lý ở mục 2.3). Email thật → EMQ cao.
- n8n template tự **gửi email tài liệu** (nhánh Has Email) + **lưu Lark**. Không cần trang chính.
- Tối ưu chiến dịch Meta: mục tiêu **Leads**, optimize cho sự kiện `Lead`.

## 5. Checklist nghiệm thu Pha 7

- [ ] Pixel base + `tracking-config.js` + `tracking.js` đã nhúng vào mọi trang clone.
- [ ] `_fbp`/`_fbc` set ở `ROOT_COOKIE` (chia sẻ chéo subdomain).
- [ ] Form lead có `data-track-lead`; nút CTA có `data-cta` + href về `MAIN_DOMAIN`.
- [ ] `ViewContent`/`Lead`/`Click_CTA` gửi **cả Browser cả Server (n8n)**, cùng `event_id` → "Deduplicated".
- [ ] CTA chuyển tham số `fbclid/utm/fbp/fbc` nguyên vẹn sang `MAIN_DOMAIN`.
- [ ] n8n workflow đã active; webhook nhận đúng payload (kiểm Executions + Lark + email).
- [ ] (Lead-magnet) submit email → nhận tài liệu + có bản ghi Lark.

## 6. Test nhanh

1. **Meta Pixel Helper**: thấy PageView/ViewContent/Lead/Click_CTA, không lỗi trùng pixel.
2. **Test Events (Events Manager)**: các event "Deduplicated"; `Lead` có EMQ cao do `em`.
3. **n8n Executions**: payload đủ `fbp/fbc/utm`, `Normalize+Hash` ra `em` đã hash.
4. **Cross-domain**: bấm CTA → URL `MAIN_DOMAIN` đủ tham số; cookie `_fbc` domain `ROOT_COOKIE`.

## Ranh giới

- PII (email/phone) chỉ hash phía n8n trước khi gửi Meta; bản rõ chỉ để gửi email + lưu CRM.
- Không nhúng secret/token vào client; webhook là điểm vào, không trả dữ liệu nhạy cảm.
- Chỉ bật tracking khi có **consent** ở các thị trường yêu cầu (GDPR…); gắn checkbox đồng ý cho form lead.
