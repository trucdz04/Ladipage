const newsItems = [
  { category: 'GIỌNG NÓI', title: 'ElevenLabs: bắt đầu thử tạo giọng đọc AI cho video', initials: 'EL', tone: 'violet', href: 'https://elevenlabs.io/', featured: true },
  { category: 'QUẢNG CÁO', title: 'AdCreative.ai: tạo nhiều ý tưởng hình quảng cáo từ một brief', initials: 'AD', tone: 'cyan', href: 'https://www.adcreative.ai/' },
  { category: 'VIDEO', title: 'Descript: chỉnh sửa bản ghi hình theo nội dung văn bản', initials: 'DS', tone: 'pink', href: 'https://www.descript.com/' },
  { category: 'DỮ LIỆU', title: 'Browse AI: theo dõi thông tin trên website không cần code', initials: 'BA', tone: 'blue', href: 'https://www.browse.ai/' },
  { category: 'AI SEO', title: 'OmniSEO: theo dõi thương hiệu trong kết quả tìm kiếm AI', initials: 'OS', tone: 'gold', href: 'https://omniseo.com/' },
  { category: 'HỌP', title: 'MeetGeek: ghi chú và tóm tắt các cuộc họp bằng AI', initials: 'MG', tone: 'violet', href: 'https://meetgeek.ai/' },
  { category: 'NỘI DUNG', title: 'Castmagic: biến audio thành nhiều định dạng nội dung', initials: 'CM', tone: 'pink', href: 'https://www.castmagic.io/' },
  { category: 'VOICEOVER', title: 'Murf AI: tạo lời thoại cho video và bài thuyết trình', initials: 'MF', tone: 'cyan', href: 'https://murf.ai/', featured: true },
  { category: 'LỊCH LÀM VIỆC', title: 'Reclaim.ai: tự sắp lịch và bảo vệ thời gian tập trung', initials: 'RC', tone: 'blue', href: 'https://reclaim.ai/' },
  { category: 'NGHIÊN CỨU', title: 'Consensus: tìm và đọc nghiên cứu với hỗ trợ của AI', initials: 'CS', tone: 'gold', href: 'https://consensus.app/' }
];

const toolSets = {
  popular: [
    ['ChatGPT','Trợ lý AI','#18a47b','✳','https://chatgpt.com/'],['Claude','Trợ lý AI','#ad7352','✦','https://claude.ai/'],['Gemini','Trợ lý AI','#5477dc','✧','https://gemini.google.com/'],['Perplexity','Tìm kiếm AI','#189baa','◈','https://www.perplexity.ai/'],['ElevenLabs','Giọng nói AI','#222733','◉','https://elevenlabs.io/'],['Canva','Thiết kế AI','#664cd7','C','https://www.canva.com/'],['Descript','Video & audio','#835ec2','D','https://www.descript.com/'],['Runway','Tạo video','#222b40','R','https://runwayml.com/'],['NotebookLM','Nghiên cứu','#5581b0','N','https://notebooklm.google/'],['n8n','Tự động hóa','#d75e65','n','https://n8n.io/'],['Murf AI','Giọng nói AI','#5042a1','M','https://murf.ai/'],['Reclaim.ai','Lịch thông minh','#795aca','R','https://reclaim.ai/'],['MeetGeek','Ghi chú họp','#4e76bc','M','https://meetgeek.ai/'],['Browse AI','Thu thập dữ liệu','#377bca','B','https://www.browse.ai/'],['Castmagic','Tái sử dụng nội dung','#9556a6','C','https://www.castmagic.io/'],['Beautiful.ai','Slide AI','#4580b5','B','https://www.beautiful.ai/'],['AdCreative.ai','Quảng cáo AI','#ad4986','A','https://www.adcreative.ai/'],['Consensus','Nghiên cứu','#437897','C','https://consensus.app/'],['QuillBot','Viết nội dung','#298965','Q','https://quillbot.com/'],['OmniSEO','AI SEO','#907343','O','https://omniseo.com/']
  ],
  editor: [
    ['ElevenLabs','Thử giọng đọc','#222733','◉','https://elevenlabs.io/'],['AdCreative.ai','Thử creative','#ad4986','A','https://www.adcreative.ai/'],['Browse AI','Thử automation','#377bca','B','https://www.browse.ai/'],['MeetGeek','Thử ghi chú họp','#4e76bc','M','https://meetgeek.ai/'],['Descript','Thử edit video','#835ec2','D','https://www.descript.com/'],['Murf AI','Thử voiceover','#5042a1','M','https://murf.ai/'],['Castmagic','Thử tái sử dụng nội dung','#9556a6','C','https://www.castmagic.io/'],['Reclaim.ai','Thử quản lý lịch','#795aca','R','https://reclaim.ai/'],['Consensus','Thử tìm nghiên cứu','#437897','C','https://consensus.app/'],['OmniSEO','Thử AI SEO','#907343','O','https://omniseo.com/']
  ]
};

function make(tag, className, text) { const el=document.createElement(tag); if(className) el.className=className; if(text) el.textContent=text; return el; }

function renderNews() {
  const list=document.getElementById('news-list');
  newsItems.forEach(item=>{
    const card=make('a',`news-card${item.featured?' featured':''}`);
    card.href=item.href; card.target='_blank'; card.rel='noopener noreferrer';
    card.setAttribute('aria-label',`${item.title}, mở website công cụ trong tab mới`);
    const thumb=make('div',`news-thumb thumb-${item.tone}`,item.initials);
    const body=make('div','news-card-body');
    const meta=make('div','news-meta');
    meta.append(make('b','',item.category),make('span','','·'),make('span','','GỢI Ý KHÁM PHÁ'));
    if(item.featured) meta.append(make('em','','NÊN THỬ'));
    body.append(meta,make('h3','',item.title)); card.append(thumb,body); list.append(card);
  });
}

function renderTools(which='popular') {
  const list=document.getElementById('tool-list'); list.replaceChildren();
  toolSets[which].forEach((tool,index)=>{
    const [name,category,color,letter,url]=tool;
    const item=make('li'); const link=make('a'); link.href=url;link.target='_blank';link.rel='noopener noreferrer';
    link.setAttribute('aria-label',`${name}, mở website trong tab mới`);
    const icon=make('span','tool-icon',letter);icon.style.setProperty('--icon',color);
    const label=make('span','tool-name');label.append(make('strong','',name),make('small','',category));
    link.append(make('span','rank',String(index+1)),icon,label);item.append(link);list.append(item);
  });
  document.querySelectorAll('[role=tab]').forEach(tab=>tab.setAttribute('aria-selected',String(tab.dataset.tab===which)));
  document.getElementById('rank-note').textContent=which==='popular'?'Danh sách minh họa, chưa phải bảng xếp hạng theo lượt dùng.':'Danh sách nên thử cho blog review AI, không phải xếp hạng khách quan.';
}

renderNews(); renderTools();

document.querySelectorAll('[role=tab]').forEach(tab=>tab.addEventListener('click',()=>renderTools(tab.dataset.tab)));

const menuToggle=document.querySelector('.menu-toggle');
const mobileNav=document.getElementById('mobile-nav');
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Đóng menu':'Mở menu');mobileNav.hidden=!open;});
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mobileNav.hidden=true;menuToggle.setAttribute('aria-expanded','false');}));

document.querySelectorAll('.nav-trigger').forEach(button=>button.addEventListener('click',()=>{const group=button.closest('.nav-group');const open=!group.classList.contains('is-open');document.querySelectorAll('.nav-group').forEach(g=>{g.classList.remove('is-open');g.querySelector('.nav-trigger').setAttribute('aria-expanded','false');});group.classList.toggle('is-open',open);button.setAttribute('aria-expanded',String(open));}));
document.addEventListener('click',event=>{if(!event.target.closest('.nav-group'))document.querySelectorAll('.nav-group').forEach(g=>{g.classList.remove('is-open');g.querySelector('.nav-trigger').setAttribute('aria-expanded','false');});});

const themeToggle=document.querySelector('.theme-toggle');
try{if(localStorage.getItem('ai-radar-theme')==='light')document.body.classList.add('light');}catch{}
function syncTheme(){themeToggle.textContent=document.body.classList.contains('light')?'☾':'☼';themeToggle.setAttribute('aria-label',document.body.classList.contains('light')?'Chuyển sang giao diện tối':'Chuyển sang giao diện sáng');}syncTheme();
themeToggle.addEventListener('click',()=>{document.body.classList.toggle('light');try{localStorage.setItem('ai-radar-theme',document.body.classList.contains('light')?'light':'dark');}catch{}syncTheme();});

document.querySelectorAll('[data-demo-form]').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();const status=form.nextElementSibling;status.textContent='Đây là giao diện demo. Hãy kết nối dịch vụ email trước khi nhận đăng ký thật.';form.querySelector('input[type=email]').value='';}));
