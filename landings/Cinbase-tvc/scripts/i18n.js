/* i18n.js — CinBase landing: tự nhận diện quốc gia (Cloudflare) + đổi ngôn ngữ/tiền tệ.
   Phase 1: VN → tiếng Việt (bản gốc, VND); mọi nước khác (JP/KR/PH/TH/…) → English + USD.
   Cơ chế nhẹ: KHÔNG refactor HTML — quét text node thay theo từ điển + đổi data-usd.
   Đổi ngôn ngữ = lưu localStorage rồi reload (VI là bản gốc nên không cần khôi phục). */
(() => {
  'use strict';
  const STORE = 'cinbase_lang';
  const SUPPORTED = ['vi', 'en'];

  // Phase 1: tất cả quốc gia ngoài VN → 'en'. (Sau này: JP:'ja', KR:'ko', TH:'th', PH:'en'.)
  const countryToLang = (cc) => (cc === 'VN' ? 'vi' : 'en');

  // ───────── Từ điển EN (key = đúng text tiếng Việt đã trim) ─────────
  const EN = {
    __title: 'CinBase — Cinematic AI Video Production for Business | CINAI.TV OS',
    // Announcement + nav
    'Tặng': 'Free', 'video demo miễn phí': 'demo video', 'cho doanh nghiệp — video AI chuẩn điện ảnh chỉ từ': 'for businesses — cinematic AI video from just', '/video 30s': '/30s video',
    'Nhận demo miễn phí': 'Get a free demo',
    'Dịch vụ': 'Services', 'Ngành nghề': 'Industries', 'Quy trình': 'Process', 'Bảng giá TVC': 'Pricing', 'Hỏi đáp': 'FAQ',
    'Xem Báo Giá': 'See pricing', 'Nhận Tư Vấn Miễn Phí': 'Get a free consult',
    // Hero
    'Model bản quyền · Hợp đồng trực tiếp Bytedance & Alibaba': 'Licensed models · Direct contracts with Bytedance & Alibaba',
    'Cả một hãng phim AI': 'A whole AI film studio', 'cho doanh nghiệp': 'for businesses', 'TVC & video marketing': 'TVC & marketing video', 'chuẩn điện ảnh': 'cinematic-grade',
    'Giảm': 'Cut', '80% chi phí': '80% of costs', ', giao trong': ', delivered in', 'vài ngày': 'days', ', giữ': ', keeping', 'nhân vật & thương hiệu nhất quán': 'characters & brand consistent', '— toàn bộ trên nền tảng CINAI.TV OS.': '— all on the CINAI.TV OS platform.',
    'Stop prompting. Start directing.': 'Stop prompting. Start directing.', '— bạn chỉ đạo, AI sản xuất.': '— you direct, AI produces.',
    'Nhận video demo theo ngành': 'Get an industry demo video', 'Xem Bảng Giá & Cam Kết': 'See pricing & terms',
    'Demo trong 24h': 'Demo within 24h', 'Xuất hóa đơn GTGT': 'VAT invoice', 'Không ràng buộc': 'No commitment',
    '−80%': '−80%', 'Chi phí sản xuất': 'Production cost', 'X3': 'X3', 'Biến thể Ads để A/B': 'Ad variants for A/B', '−70%': '−70%', 'Thời gian hậu kỳ': 'Post-production time', 'Video AI / tháng': 'AI videos / month',
    'Xuất bản chuẩn chạy ads:': 'Ad-ready output:', 'Preview Workflow': 'Preview Workflow',
    // Hero cards
    'TVC Quảng Cáo': 'Ad TVC', 'TVC 15–30s chuẩn chạy ads: kịch bản theo thương hiệu, hình ảnh điện ảnh, voice-over chuyên nghiệp.': '15–30s ad-ready TVC: on-brand script, cinematic visuals, professional voice-over.', 'Xem gói TVC →': 'See TVC plans →',
    'Video Bán Hàng & Social': 'Sales & Social Video', 'Video sản phẩm, TikTok/Reels theo lô — batch cả tháng nội dung trong một lần đặt, phong cách nhất quán.': 'Product, TikTok/Reels videos in batches — a full month of content in one order, consistent style.', 'Nhận báo giá →': 'Get a quote →',
    'Video Thương Hiệu & Đào Tạo': 'Brand & Training Video', 'Phim giới thiệu doanh nghiệp, video đào tạo nội bộ — hiệu ứng 3D, diễn viên/MC ở gói Chuyên Nghiệp.': 'Company intro films, internal training videos — 3D effects, actors/hosts on the Pro plan.', 'Xem gói video →': 'See video plans →',
    // Problem ↔ Solution
    'Bài toán sản xuất video 2026': 'The 2026 video production problem',
    'Lãng phí ngân sách hay đánh cược với lỗi kỹ thuật?': 'Waste budget, or gamble on technical glitches?',
    'Doanh nghiệp cần video liên tục để chạy ads. Cách làm cũ — tự quay hay dùng AI lẻ — đều có cái giá. Đây là cách CinBase giải quyết trọn vẹn.': 'Businesses need a constant stream of video for ads. The old way — filming yourself or using standalone AI — has its price. Here is how CinBase solves it end-to-end.',
    'Cách làm cũ': 'The old way', 'Tự quay hoặc dùng AI lẻ': 'Filming yourself or standalone AI tools',
    'Chi phí đội lên': 'Costs pile up', '— thuê ê-kíp quay, diễn viên & hậu kỳ cho từng video.': '— hiring a crew, actors & post-production for every video.',
    'Chậm hàng tuần': 'Weeks of delay', '— hậu kỳ kéo dài; đổi thông điệp là làm lại từ đầu.': '— long post-production; changing the message means starting over.',
    '80% video lỗi': '80% of videos fail', '— AI lẻ hay méo mặt, lệch khung hình.': '— standalone AI often warps faces and breaks framing.',
    'Mất nhất quán': 'Loss of consistency', '— nhân vật đổi mặt, thương hiệu lệch giữa các cảnh.': '— characters change faces, branding drifts between scenes.',
    'Khó scale': 'Hard to scale', '— không ra nổi nhiều biến thể để test ads.': '— can’t produce enough variants to test ads.',
    'Giải pháp': 'The solution', 'Với CinBase': 'With CinBase', 'trên nền tảng CINAI.TV OS': 'on the CINAI.TV OS platform',
    'Giảm tới 80% chi phí': 'Up to 80% lower cost', '— pipeline AI khép kín thay cả ê-kíp sản xuất.': '— a closed-loop AI pipeline replaces an entire production crew.',
    'Nhanh gấp nhiều lần': 'Many times faster', '— rút 70% thời gian hậu kỳ, giao trong vài ngày.': '— 70% less post-production time, delivered in days.',
    'Chuẩn điện ảnh, ổn định': 'Cinematic and consistent', '— 100+ model (Seedance, Happy Horse, Kling), kiểm soát từng khung hình.': '— 100+ models (Seedance, Happy Horse, Kling), control over every frame.',
    'Nhân vật nhất quán': 'Consistent characters', '— giữ đúng mặt, trang phục & bối cảnh xuyên suốt.': '— same face, wardrobe & setting throughout.',
    'Scale không giới hạn': 'Unlimited scale', '— X3 biến thể ads từ 1 kịch bản, batch tới 500+ video/tháng.': '— 3x ad variants from one script, batch up to 500+ videos/month.',
    'Duyệt trước khi sản xuất': 'Approve before production', '— bạn chốt kịch bản & storyboard, không lo "khác mô tả".': '— you sign off on the script & storyboard, no surprises.',
    'Cùng một nhu cầu —': 'Same need —', 'CinBase rẻ hơn, nhanh hơn và kiểm soát 100% chuẩn điện ảnh': 'CinBase is cheaper, faster and gives 100% cinematic control', ', sản xuất hàng loạt mà vẫn nhất quán.': ', mass-produced yet consistent.',
    'Nhận video demo miễn phí': 'Get a free demo video',
    // Engine strip
    'Engine AI điện ảnh hàng đầu · Xuất bản chuẩn mọi nền tảng': 'Top cinematic AI engines · Publish-ready for every platform',
    // Pipeline / formats
    'Một pipeline,': 'One pipeline,', 'đủ mọi định dạng video.': 'every video format.',
    'Từ TVC quảng cáo đến video social và đào tạo nội bộ — cùng một quy trình sản xuất, đổi định dạng theo mục tiêu chiến dịch của bạn.': 'From ad TVCs to social and internal training videos — one production process, formats adapted to your campaign goal.',
    'TVC 30s': '30s TVC', 'Video bán hàng': 'Sales video', 'Social / Reels': 'Social / Reels', 'Video sản phẩm': 'Product video', 'Video thương hiệu': 'Brand video', 'Đào tạo nội bộ': 'Internal training', 'Viral content': 'Viral content',
    // Use cases
    'E-commerce & Bán lẻ': 'E-commerce & Retail', 'Video sản phẩm và TVC ads chuẩn chuyển đổi: nhiều biến thể để test, xuất đúng tỉ lệ từng nền tảng — batch cả tháng nội dung trong một lần đặt.': 'Conversion-ready product videos and ad TVCs: many variants to test, exported at the right ratio per platform — a full month of content in one order.', 'Nhận demo video + workflow miễn phí': 'Get a free demo video + workflow',
    'F&B & Nhà hàng': 'F&B & Restaurants', 'Làm món nào cũng trông hấp dẫn: TVC món ăn, video menu và clip promo ngắn — đủ nhanh cho chiến dịch khuyến mãi hàng tuần.': 'Make every dish look irresistible: food TVCs, menu videos and short promo clips — fast enough for weekly promotions.',
    'Bất động sản': 'Real estate', 'Phim giới thiệu dự án với góc quay điện ảnh, voice-over chuyên nghiệp — gây ấn tượng với khách hàng trước cả khi đến xem thực tế.': 'Project showcase films with cinematic angles and professional voice-over — impress buyers before they even visit.',
    'Mỹ phẩm & Làm đẹp': 'Cosmetics & Beauty', 'Video UGC-style và TVC sản phẩm làm đẹp: nhiều góc máy, nhiều phong cách để test quảng cáo — không phải tổ chức quay lại mỗi chiến dịch.': 'UGC-style videos and beauty product TVCs: multiple angles and styles to test ads — no reshoots every campaign.',
    'Giáo dục & Đào tạo': 'Education & Training', 'Video khoá học, video tuyển sinh và đào tạo nội bộ — voice-over rõ ràng, hình ảnh minh hoạ nhất quán cho cả bộ chương trình.': 'Course videos, admissions and internal training — clear voice-over and consistent visuals across the whole program.',
    // Pillars
    'Giải bài toán Scale-up': 'Solving the scale-up problem', '3 trụ cột công nghệ — sản xuất hàng loạt mà vẫn nhất quán': '3 technology pillars — mass production that stays consistent',
    'Đây là điểm khác biệt giữa một hệ sản xuất điện ảnh và các công cụ AI thông thường.': 'This is what separates a cinematic production system from ordinary AI tools.',
    'Tính nhất quán nhân vật': 'Character consistency', 'Giữ nguyên khuôn mặt, trang phục và bối cảnh xuyên suốt mọi khung hình — đúng nhân vật, đúng thương hiệu.': 'Keep the same face, wardrobe and setting across every frame — right character, right brand.', '→ Bảo vệ hình ảnh nguyên bản của thương hiệu': '→ Protects your brand’s original identity',
    'Biến thể hàng loạt (One-click)': 'Bulk variants (one-click)', 'Tạo hàng chục phiên bản Ads khác nhau chỉ từ một kịch bản gốc — đổi thông điệp, đổi bối cảnh trong một cú click.': 'Generate dozens of ad versions from one master script — change message and setting in a single click.', '→ Tăng X3 hiệu suất thử nghiệm quảng cáo': '→ 3x your ad testing throughput',
    'Thư viện Workflow': 'Workflow library', 'Kho kịch bản và tư duy marketing dựng sẵn theo từng ngành — bắt đầu nhanh, không phải nghĩ từ con số 0.': 'A library of ready-made scripts and marketing playbooks per industry — start fast, never from zero.', '→ Giảm 80% thời gian lên ý tưởng tiền kỳ': '→ 80% less pre-production ideation time',
    // Features
    'Năng lực pipeline': 'Pipeline capability', 'Pipeline sản xuất video vận hành như nhà máy': 'A video production pipeline that runs like a factory',
    'Mỗi công đoạn — kịch bản, giọng đọc, dựng cảnh, xuất bản — đều được tự động hoá, nên giá rẻ hơn quay truyền thống nhiều lần mà tốc độ tính bằng ngày.': 'Every stage — script, voice, scene building, publishing — is automated, so it costs a fraction of traditional shoots at a speed measured in days.', 'Xem bảng giá TVC →': 'See TVC pricing →',
    'End-to-end': 'End-to-end', 'Pipeline tự động từ brief đến video lên sóng': 'Automated pipeline from brief to published video',
    'Bạn gửi brief — pipeline lo phần còn lại: AI viết kịch bản theo thương hiệu, chia storyboard, thu voice-over, dựng cảnh, lồng nhạc và render. Sản xuất hàng loạt vẫn giữ phong cách nhất quán từng khung hình.': 'You send a brief — the pipeline handles the rest: AI writes the on-brand script, builds the storyboard, records voice-over, generates scenes, adds music and renders. Mass production keeps a consistent style frame by frame.', 'Kịch bản → Voice → Dựng cảnh → Xuất bản →': 'Script → Voice → Scene → Publish →',
    'Theo thương hiệu': 'On-brand', 'Kịch bản & storyboard AI': 'AI script & storyboard', 'AI viết kịch bản đúng giọng thương hiệu, chia cảnh và gợi ý hình ảnh — duyệt trước khi sản xuất.': 'AI writes scripts in your brand voice, breaks down scenes and suggests visuals — approve before production.', 'Xem thêm →': 'Learn more →',
    'Đa giọng': 'Multi-voice', 'Voice-over & nhạc bản quyền': 'Voice-over & licensed music', 'Giọng đọc tự nhiên nhiều ngôn ngữ, đồng bộ cảm xúc — kèm nhạc bản quyền ở gói Nâng Cao trở lên.': 'Natural multilingual voice-over with matched emotion — licensed music on the Advanced plan and up.', 'Xem gói →': 'See plans →',
    'Điện ảnh': 'Cinematic', 'Dựng cảnh với Seedance · Happy Horse · Kling': 'Scene building with Seedance · Happy Horse · Kling', 'Text-to-video, image-to-video chất lượng cao — góc máy, ánh sáng chỉnh theo yêu cầu, regenerate nhanh.': 'High-quality text-to-video and image-to-video — camera angles and lighting on demand, fast regeneration.',
    'Theo lịch': 'Scheduled', 'Xuất bản tự động đa nền tảng': 'Automated multi-platform publishing', 'Render hàng loạt, đăng lên YouTube, TikTok, Facebook theo lịch — đúng tỉ lệ khung hình từng kênh.': 'Batch render and schedule posts to YouTube, TikTok, Facebook — at the right aspect ratio for each channel.',
    'Hệ sinh thái CinBase': 'CinBase ecosystem', 'Cần Base/Lark hoặc n8n Automation?': 'Need Base/Lark or n8n automation?', 'CinBase còn thiết kế nền dữ liệu Lark Base và tự động hoá quy trình với n8n — hai dịch vụ này có trang riêng với báo giá chi tiết.': 'CinBase also designs Lark Base data systems and automates workflows with n8n — each has its own page with detailed pricing.', 'Xem hệ thống CinBase đang triển khai': 'See the CinBase system in action',
    // Process
    'Quy trình khép kín — toàn bộ trên trình duyệt web': 'A closed-loop process — entirely in your web browser',
    '01 · Kịch bản & Storyboard AI': '01 · AI Script & Storyboard', '02 · Chỉnh sửa tương tác': '02 · Interactive editing', '03 · Dựng nháp hàng loạt': '03 · Batch draft rendering', '04 · Dựng video AI trên đám mây': '04 · Cloud AI video rendering',
    'AI viết kịch bản, chia phân cảnh & đề xuất góc máy chuẩn điện ảnh → bạn tùy chỉnh trực tiếp theo ý đồ đạo diễn → render demo hàng loạt để duyệt trước → dựng, cắt ghép & xuất file thành phẩm ngay trên website.': 'AI writes the script, breaks down scenes & suggests cinematic angles → you fine-tune directly to your vision → batch-render demos to preview → edit, cut and export the finished file right in the browser.',
    // Gallery
    'Thư viện kết quả': 'Results gallery', 'Mỗi lần một video khác biệt': 'A different video every time', 'Video AI Marketing do CinBase sản xuất trên nền CINAI.TV — chọn phong cách bạn cần.': 'AI marketing videos produced by CinBase on CINAI.TV — pick the style you need.',
    'Style: TVC Điện ảnh': 'Style: Cinematic TVC', 'Style: Video sản phẩm': 'Style: Product video', 'Style: Video bán hàng': 'Style: Sales video', 'Style: Mỹ phẩm & Làm đẹp': 'Style: Cosmetics & Beauty', 'Style: F&B / Ẩm thực': 'Style: F&B / Cuisine', 'Style: Bất động sản': 'Style: Real estate', 'Style: Giáo dục': 'Style: Education', 'Style: Phim thương hiệu': 'Style: Brand film',
    'Nhận video demo theo phong cách của bạn': 'Get a demo video in your style',
    // ROI
    'Chuyển đổi số workflow': 'Workflow digitalization', 'Tối đa hóa ROI — số liệu nói thay chúng tôi': 'Maximize ROI — the numbers speak for us', 'So sánh trực tiếp giữa quy trình sản xuất truyền thống và hệ điều hành CINAI.TV OS.': 'A direct comparison between traditional production and the CINAI.TV OS.',
    'Tiêu chí': 'Criteria', 'Truyền thống': 'Traditional', 'CINAI.TV OS': 'CINAI.TV OS', 'Cao': 'High', 'Giảm 80%': '80% lower', '1 tuần': '1 week', 'Vài giờ': 'A few hours', 'Scale creative': 'Creative scale', 'Bị giới hạn': 'Limited', 'Không giới hạn': 'Unlimited', '3 tháng': '3 months', 'Triển khai & vận hành thực tế': 'Real deployment & operation', 'Chi phí khâu hậu kỳ': 'Post-production cost', 'Creative để A/B test': 'Creative for A/B testing',
    '"Hệ điều hành CINAI.TV giúp chúng tôi kiểm soát 100% tính nhất quán của nhân vật ảo và workflow nội bộ mà hoàn toàn không phải phụ thuộc vào bất kỳ bên thứ ba nào."': '"The CINAI.TV OS lets us keep 100% control over virtual-character consistency and our internal workflow, with zero dependence on any third party."', '— Marketing Director, Retail Brand': '— Marketing Director, Retail Brand', 'Nhận Video Demo Miễn Phí': 'Get a free demo video',
    // Pricing
    'Triết lý định giá mới': 'A new pricing philosophy', 'Đối tác dài hạn, chi phí đáy sàn': 'Long-term partner, rock-bottom cost', 'Chi phí tính trên mỗi video 30s. Càng đồng hành lâu dài, giá sản xuất mỗi video càng giảm sâu.': 'Priced per 30s video. The longer we work together, the lower the cost per video.',
    '1 tháng': '1 month', '6 tháng': '6 months', '12 tháng': '12 months', 'Giá/video khi cam kết 6 tháng': 'Price/video on a 6-month commitment',
    'Gói Cơ Bản': 'Basic plan', 'Core AI': 'Core AI', 'Phù hợp: SME, shop, nội dung social cần ra video nhanh & đều.': 'For SMEs, shops and social content that needs fast, regular video.', '/ video 30s ·': '/ 30s video ·', 'cam kết 6 tháng': '6-month commitment',
    'Mô hình AI Omni': 'Omni AI model', '— chất lượng cao, ra video nhanh & đều': '— high quality, fast and steady output', 'Kịch bản AI & storyboard theo thương hiệu': 'On-brand AI script & storyboard', 'Góc quay & chuyển động tiêu chuẩn': 'Standard angles & motion', 'Bản quyền thương mại tiêu chuẩn': 'Standard commercial license', 'Chứng từ bản điện tử': 'Electronic documentation',
    'Đề xuất cho Brand & Agency': 'Recommended for brands & agencies', 'Gói Nâng Cao': 'Advanced plan', 'Cinematic AI': 'Cinematic AI', 'Phù hợp: thương hiệu & agency chạy ads liên tục, cần chất lượng điện ảnh.': 'For brands & agencies running ads continuously who need cinematic quality.',
    'Bộ siêu mô hình — Seedance 2.0 · Happy Horse · Kling': 'Super-model suite — Seedance 2.0 · Happy Horse · Kling', 'Góc quay chuyên nghiệp độc quyền cinAI': 'Exclusive cinAI professional angles', 'Bảo vệ nhãn hiệu — hợp đồng trực tiếp với': 'Brand protection — direct contracts with', 'Bytedance & Alibaba': 'Bytedance & Alibaba', 'Xuất hóa đơn GTGT công ty đầy đủ': 'Full company VAT invoicing', 'Trọn bộ tính năng gói Cơ Bản': 'Everything in the Basic plan',
    'Ưu đãi khối lượng — mua càng nhiều, tặng càng sâu': 'Volume deals — the more you buy, the more you get', 'Starter · SME': 'Starter · SME', 'Mua 12 tặng 3': 'Buy 12, get 3', '= 15 video / tháng': '= 15 videos / month', 'Khuyên dùng': 'Recommended', 'Pro · Brand / Agency': 'Pro · Brand / Agency', 'Mua 25 tặng 5': 'Buy 25, get 5', '= 30 video / tháng': '= 30 videos / month', 'Unlimited · Franchise / E-com': 'Unlimited · Franchise / E-com', 'Mua 50 tặng 10': 'Buy 50, get 10', '= 60 video / tháng': '= 60 videos / month',
    'Bạn duyệt kịch bản & storyboard': 'You approve the script & storyboard', 'trước khi sản xuất': 'before production', '· Gói Nâng Cao xuất hóa đơn GTGT đầy đủ · Báo giá chi tiết theo nhu cầu khi đăng ký demo.': '· The Advanced plan issues full VAT invoices · Detailed quote tailored to your needs when you book a demo.',
    // Self-serve band
    'Hoặc — bạn đã có sẵn workflow?': 'Or — already have your own workflow?', 'Tự vận hành · CINAI.TV OS': 'Self-serve · CINAI.TV OS', 'Đã có sẵn quy trình & đội ngũ? Tự vận hành trên nền tảng.': 'Already have a process & team? Run it yourself on the platform.',
    'Không cần thuê sản xuất — cắm thẳng workflow của bạn vào hệ engine CinBase, render video AI': 'No need to hire a production team — plug your own workflow straight into the CinBase engine and render AI video', 'không giới hạn': 'without limits', '. Hợp với doanh nghiệp/agency đã chuẩn hoá quy trình, muốn tự chủ tốc độ & chi phí.': '. Ideal for businesses/agencies that have standardized their process and want full control over speed & cost.',
    'Unlimited video AI': 'Unlimited AI video', '— Gemini Omni · Veo Quality': '— Gemini Omni · Veo Quality', 'Chạy chính workflow của bạn — render không giới hạn': 'Run your own workflow — unlimited rendering', 'Unlimited ảnh AI + auto-storyboard (Opus 4.8)': 'Unlimited AI images + auto-storyboard (Opus 4.8)', '+100 video Grok free/tháng · credit Seedance · Kling': '+100 free Grok videos/month · Seedance · Kling credits',
    'Thuê bao / tháng': 'Subscription / month', 'Mua gói năm: CinBase': 'Yearly plan: CinBase', 'hướng dẫn sử dụng nền tảng CINAI.TV miễn phí': 'onboards you on the CINAI.TV platform for free', 'Dùng thử miễn phí trên CINAI.TV →': 'Try it free on CINAI.TV →', 'Đăng ký tạo video free — không cần thẻ': 'Sign up and create video free — no card required',
    // Risk reversal
    'Bạn xem & chốt kịch bản, storyboard trước — không lo "sản phẩm khác mô tả".': 'You review & sign off on the script and storyboard first — no "not as described" surprises.', 'Hóa đơn GTGT đầy đủ': 'Full VAT invoice', 'Gói Nâng Cao xuất hóa đơn công ty — hợp lệ cho chi phí marketing doanh nghiệp.': 'The Advanced plan issues company invoices — valid as a business marketing expense.', 'Bản quyền thương mại': 'Commercial license', 'Video an toàn chạy ads; gói Cinematic có bảo vệ nhãn hiệu từ Bytedance (hợp đồng trực tiếp).': 'Videos are safe to run as ads; the Cinematic plan includes brand protection from Bytedance (direct contract).',
    // Lead magnet form
    'Bắt đầu hôm nay': 'Start today', 'Bắt đầu số hóa workflow sản xuất video của bạn.': 'Start digitalizing your video production workflow.', 'Để lại thông tin — CinBase liên hệ trong 24h để book demo trực tiếp trên nền tảng CINAI.TV và gửi báo giá theo nhu cầu. Hoàn toàn miễn phí, không ràng buộc.': 'Leave your details — CinBase will reach out within 24h to book a live demo on CINAI.TV and send a tailored quote. Completely free, no commitment.',
    'Lĩnh vực của doanh nghiệp': 'Your industry', 'Thương mại / Bán lẻ': 'Commerce / Retail', 'Sản xuất': 'Manufacturing', 'F&B / Nhà hàng': 'F&B / Restaurant', 'Giáo dục / Đào tạo': 'Education / Training', 'Agency / Marketing': 'Agency / Marketing', 'Khác': 'Other',
    'Loại video bạn cần': 'Video type you need', 'TVC quảng cáo 15–30s': 'Ad TVC 15–30s', 'Video bán hàng / sản phẩm': 'Sales / product video', 'Video social (TikTok / Reels)': 'Social video (TikTok / Reels)', 'Phim giới thiệu doanh nghiệp': 'Company intro film', 'Video đào tạo nội bộ': 'Internal training video', 'Combo số lượng lớn theo tháng': 'High-volume monthly combo', 'Chưa rõ — cần tư vấn': 'Not sure — need advice',
    'Bạn có cần xuất hóa đơn GTGT (VAT)?': 'Do you need a VAT invoice?', 'Có — cần xuất hóa đơn GTGT': 'Yes — I need a VAT invoice', 'Không cần hóa đơn': 'No invoice needed',
    'Nhận 1000 Workflow Miễn Phí →': 'Get 1000 free workflows →', 'Hoặc gọi trực tiếp Hotline': 'Or call our hotline', '· Thông tin chỉ dùng để tư vấn — không spam, không chia sẻ cho bên thứ ba.': '· Your info is used for consultation only — no spam, never shared with third parties.', '✓ Đã nhận yêu cầu! CinBase sẽ gửi quà + chuỗi hướng dẫn qua email trong vòng 24h.': '✓ Request received! CinBase will email your gift + guide series within 24h.',
    // Journey
    'Hành trình một video': 'The journey of one video', 'Bạn gửi': 'You send', 'Brief ngắn + ảnh/thông tin sản phẩm': 'A short brief + product photos/info', 'CinBase sản xuất': 'CinBase produces', 'Kịch bản → voice-over → dựng cảnh AI → nhạc & hiệu ứng': 'Script → voice-over → AI scenes → music & effects', 'Bạn nhận': 'You receive', 'TVC 30s hoàn chỉnh + biến thể đúng tỉ lệ từng nền tảng': 'A finished 30s TVC + variants at the right ratio per platform', 'Xuất hóa đơn GTGT (VAT) đầy đủ sau khi bàn giao': 'Full VAT invoice issued after delivery',
    // FAQ
    'Câu hỏi trước khi bắt đầu': 'Questions before you start', 'Giải đáp nhanh về giá gói, thời gian sản xuất, bản quyền và cách bắt đầu.': 'Quick answers on pricing, production time, licensing and how to begin.', 'Nhận Báo Giá TVC': 'Get a TVC quote', 'Xem Bảng Giá': 'See pricing',
    'Giá video tính như thế nào?': 'How is video pricing calculated?',
    'Giá tính trên mỗi video 30s theo thời gian cam kết — càng dài càng rẻ. Gói Cơ Bản (Core AI): 99.000đ (1 tháng) · 89.000đ (6 tháng) · 79.000đ (12 tháng). Gói Nâng Cao (Cinematic AI): 289.000đ · 269.000đ · 249.000đ tương ứng. Đặt khối lượng lớn còn được tặng thêm video (mua 12 tặng 3, mua 25 tặng 5, mua 50 tặng 10).': 'Priced per 30s video by commitment length — the longer, the cheaper. Basic (Core AI): 99,000₫ (1mo) · 89,000₫ (6mo) · 79,000₫ (12mo). Advanced (Cinematic AI): 289,000₫ · 269,000₫ · 249,000₫ respectively. Bulk orders earn bonus videos (buy 12 get 3, buy 25 get 5, buy 50 get 10).',
    'Một video mất bao lâu?': 'How long does one video take?',
    'Gói Cơ Bản (Core AI) và Nâng Cao (Cinematic AI) thường bàn giao trong vài ngày làm việc sau khi duyệt kịch bản. Đặt khối lượng lớn theo tháng được sản xuất theo lịch hàng tuần để đảm bảo tiến độ chạy ads liên tục.': 'Basic (Core AI) and Advanced (Cinematic AI) are typically delivered within a few business days after script approval. Monthly bulk orders are produced on a weekly schedule to keep your ads running continuously.',
    'Có được duyệt kịch bản và yêu cầu chỉnh sửa không?': 'Can I review the script and request edits?',
    'Có. Bạn duyệt kịch bản + storyboard trước khi sản xuất, và duyệt bản nháp trước khi bàn giao. Mỗi gói có số vòng chỉnh sửa tương ứng — chỉnh nội dung lớn sau khi đã duyệt kịch bản sẽ tính như video mới.': 'Yes. You approve the script + storyboard before production and review the draft before delivery. Each plan includes a set number of revision rounds — major content changes after script approval count as a new video.',
    'Tôi chỉ có ảnh sản phẩm, không có footage quay sẵn?': 'I only have product photos, no footage — is that OK?',
    'Không sao — đó chính là thế mạnh của pipeline AI. Chỉ cần brief ngắn + ảnh sản phẩm (hoặc mô tả), chúng tôi dựng cảnh bằng Veo/Kling/Seedance: bối cảnh, chuyển động, ánh sáng đều tạo bằng AI, không cần đoàn quay.': 'No problem — that’s exactly the strength of an AI pipeline. Just a short brief + product photos (or a description), and we build the scenes with Veo/Kling/Seedance: setting, motion and lighting all AI-generated, no film crew needed.',
    'Nhạc và giọng đọc có bản quyền không?': 'Are the music and voice-over licensed?',
    'Gói Nâng Cao (Cinematic AI) dùng nhạc bản quyền và bảo vệ nhãn hiệu từ Bytedance (hợp đồng trực tiếp), an toàn khi chạy quảng cáo và đăng đa nền tảng. Voice-over AI được cấp phép sử dụng thương mại; xuất hóa đơn GTGT đầy đủ cho doanh nghiệp.': 'The Advanced plan (Cinematic AI) uses licensed music and brand protection from Bytedance (direct contract), safe for ads and multi-platform posting. AI voice-over is licensed for commercial use; full VAT invoices for businesses.',
    'CinBase làm được những loại video nào?': 'What types of video can CinBase make?',
    'TVC quảng cáo 15–30s, video bán hàng/sản phẩm, video social (TikTok/Reels), phim giới thiệu doanh nghiệp và video đào tạo nội bộ — đầy đủ kịch bản, voice-over, nhạc và hiệu ứng theo gói.': '15–30s ad TVCs, sales/product videos, social videos (TikTok/Reels), company intro films and internal training videos — complete with script, voice-over, music and effects per plan.',
    'Video AI có dùng chạy quảng cáo được không?': 'Can the AI videos be used for ads?',
    'Được — video bàn giao đạt chuẩn chạy ads trên Meta, TikTok và YouTube, xuất đúng tỉ lệ khung hình từng kênh (16:9, 9:16, 1:1). Nhiều khách đặt combo để có nhiều biến thể test quảng cáo cùng lúc.': 'Yes — delivered videos meet ad standards on Meta, TikTok and YouTube, exported at the right aspect ratio per channel (16:9, 9:16, 1:1). Many clients order combos to test multiple ad variants at once.',
    'Đặt số lượng lớn có ưu đãi gì?': 'Any deals for bulk orders?',
    'Có 3 mức ưu đãi khối lượng theo tháng: Starter mua 12 tặng 3 (15 video/tháng), Pro mua 25 tặng 5 (30 video/tháng — phù hợp brand/agency chạy ads liên tục), Unlimited mua 50 tặng 10 (60 video/tháng cho chuỗi/e-commerce). Kết hợp với cam kết dài hạn để có giá/video thấp nhất.': 'There are 3 monthly volume tiers: Starter buy 12 get 3 (15 videos/mo), Pro buy 25 get 5 (30 videos/mo — for brands/agencies running ads non-stop), Unlimited buy 50 get 10 (60 videos/mo for chains/e-commerce). Combine with a long-term commitment for the lowest price per video.',
    'Bắt đầu như thế nào?': 'How do I get started?',
    'Điền form phía trên với lĩnh vực và loại video bạn cần. Trong 24h, CinBase gửi báo giá chi tiết kèm kịch bản mẫu — duyệt là sản xuất ngay, không ràng buộc trước khi bạn đồng ý.': 'Fill in the form above with your industry and the video type you need. Within 24h, CinBase sends a detailed quote with a sample script — approve and we produce right away, no commitment until you say yes.',
    // Final CTA + footer
    'Sẵn sàng lên sóng?': 'Ready to go live?', 'Bắt đầu số hóa workflow sản xuất video ngay hôm nay': 'Start digitalizing your video production workflow today', 'Book demo trực tiếp trên nền tảng CINAI.TV, nhận báo giá theo nhu cầu. Từ 79.000đ/video 30s khi cam kết dài hạn — chuẩn chạy ads Meta, TikTok, YouTube.': 'Book a live demo on CINAI.TV and get a tailored quote. From 79,000₫/30s video on a long-term commitment — ad-ready for Meta, TikTok, YouTube.', 'Hotline': 'Hotline',
    'CinBase — TVC & Video AI Marketing cho doanh nghiệp': 'CinBase — TVC & AI Marketing Video for business', 'Chiến dịch video tiếp theo bắt đầu tại đây.': 'Your next video campaign starts here.', 'Sản xuất TVC & Video AI Marketing cho doanh nghiệp — vận hành trên nền tảng CINAI.TV OS. Từ 79.000đ/video 30s khi cam kết dài hạn.': 'TVC & AI marketing video production for business — running on the CINAI.TV OS. From 79,000₫/30s video on a long-term commitment.', 'TVC, video bán hàng, video social — sản xuất trên nền tảng CINAI.TV OS, từ 79.000đ/video 30s khi cam kết dài hạn. Book demo trực tiếp.': 'TVC, sales and social videos — produced on the CINAI.TV OS, from 79,000₫/30s video on a long-term commitment. Book a live demo.',
    'Gói video': 'Video plans', 'Gói Cơ Bản — Core AI': 'Basic plan — Core AI', 'Gói Nâng Cao — Cinematic AI': 'Advanced plan — Cinematic AI', 'Ưu đãi khối lượng': 'Volume deals', 'Cam kết 1 / 6 / 12 tháng': '1 / 6 / 12-month commitment', 'Hệ sinh thái': 'Ecosystem', 'Quy trình sản xuất': 'Production process', 'Blog': 'Blog', 'Hỗ trợ': 'Support', 'Hotline 0962949620': 'Hotline 0962949620', 'Pháp lý': 'Legal', 'Chính sách bảo mật': 'Privacy policy', 'Điều khoản dịch vụ': 'Terms of service',
    '© 2026 CinBase — vận hành trên nền tảng CINAI.TV OS. Bảo lưu mọi quyền. · Giá tính trên video 30s theo thời gian cam kết, báo giá chính xác theo nhu cầu.': '© 2026 CinBase — running on the CINAI.TV OS. All rights reserved. · Priced per 30s video by commitment length; exact quote per your needs.',
    // Demo modal + gift popup
    'Để CinBase gửi demo cho bạn': 'Let CinBase send you a demo', 'Điền thông tin — đội ngũ gọi tư vấn trong 24h & gửi video demo đúng ngành của bạn.': 'Fill in your details — our team will call within 24h and send a demo video for your industry.', 'Ngành nghề của bạn': 'Your industry', 'Xem thêm demo': 'See more demos', 'Thông tin chỉ dùng để tư vấn — không spam, không chia sẻ cho bên thứ ba.': 'Your info is used for consultation only — no spam, never shared with third parties.',
    'Quà cho doanh nghiệp': 'A gift for businesses', 'Tặng bộ 1000 workflow video AI — miễn phí': '1000 AI video workflows — free', 'Chưa cần làm ngay? Để lại email — CinBase gửi ngay bộ 1000 workflow mẫu & chuỗi hướng dẫn tối ưu video AI cho doanh nghiệp. Không ràng buộc.': 'Not ready yet? Leave your email — CinBase will instantly send 1000 sample workflows & a guide to optimizing AI video for business. No commitment.', 'Nhận 1000 Workflow Miễn Phí': 'Get 1000 free workflows', 'Chỉ gửi nội dung hữu ích — huỷ nhận bất cứ lúc nào.': 'Only useful content — unsubscribe anytime.', '✓ Đã nhận! Kiểm tra email để nhận quà + chuỗi hướng dẫn trong vòng 24h.': '✓ Received! Check your email for the gift + guide series within 24h.',
    // Attributes
    'PH:email@congty.com': 'email@company.com', 'AL:Email công ty': 'Company email', 'AL:Lĩnh vực': 'Industry', 'AL:Loại video cần làm': 'Video type', 'AL:Có cần xuất hóa đơn GTGT': 'Need a VAT invoice', 'AL:Đóng': 'Close', 'PH:Họ và tên': 'Full name', 'AL:Họ và tên': 'Full name', 'PH:Số điện thoại': 'Phone number', 'AL:Số điện thoại': 'Phone number', 'PH:Email': 'Email', 'AL:Ngành nghề': 'Industry', 'AL:Loại video cần': 'Video type', 'PH:Email của bạn': 'Your email',
    'AL:Định dạng video': 'Video format', 'AL:Quy trình sản xuất': 'Production process', 'AL:Video mẫu theo phong cách': 'Sample videos by style', 'AL:Thời gian cam kết': 'Commitment length'
  };

  // aria-label preview workflow (mẫu lặp) → dịch động theo pattern
  const DICT = { en: EN };

  function detect() {
    const stored = localStorage.getItem(STORE);
    if (stored && SUPPORTED.includes(stored)) return Promise.resolve(stored);
    return fetch('/cdn-cgi/trace', { cache: 'no-store' })
      .then((r) => r.text())
      .then((t) => { const m = t.match(/loc=([A-Z]{2})/); return m ? countryToLang(m[1]) : 'vi'; }) // không xác định được → mặc định VI (thị trường chính)
      .catch(() => 'vi');
  }

  function translate(lang) {
    if (lang === 'vi') { document.documentElement.lang = 'vi'; return; }
    const d = DICT[lang]; if (!d) return;
    // text nodes
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const edits = []; let n;
    while ((n = walker.nextNode())) {
      const raw = n.nodeValue; const t = raw.trim();
      if (!t) continue;
      if (Object.prototype.hasOwnProperty.call(d, t)) edits.push([n, raw.replace(t, d[t])]);
    }
    edits.forEach(([node, val]) => { node.nodeValue = val; });
    // placeholders + aria-labels
    document.querySelectorAll('[placeholder]').forEach((el) => { const k = 'PH:' + el.getAttribute('placeholder'); if (d[k]) el.setAttribute('placeholder', d[k]); });
    document.querySelectorAll('[aria-label]').forEach((el) => {
      const v = el.getAttribute('aria-label'); const k = 'AL:' + v;
      if (d[k]) { el.setAttribute('aria-label', d[k]); return; }
      // pattern preview workflow: "Xem preview workflow X trên CINAI.TV"
      const pm = v.match(/^Xem preview workflow (.+) trên CINAI\.TV$/);
      if (pm) el.setAttribute('aria-label', 'Preview the ' + pm[1] + ' workflow on CINAI.TV');
    });
    // currency: đổi sang USD cho bản nước ngoài
    document.querySelectorAll('[data-usd]').forEach((el) => { el.textContent = el.getAttribute('data-usd'); });
    // title
    if (d.__title) document.title = d.__title;
    document.documentElement.lang = lang;
  }

  // ───────── bộ chuyển ngôn ngữ nổi (góc trên phải) ─────────
  function buildSwitcher(active) {
    const wrap = document.createElement('div');
    wrap.id = 'lang-switcher';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Language');
    wrap.innerHTML = SUPPORTED.map((l) =>
      `<button type="button" data-lang="${l}" class="lang-opt${l === active ? ' is-active' : ''}" aria-pressed="${l === active}">${l.toUpperCase()}</button>`
    ).join('');
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lang]'); if (!b) return;
      const l = b.getAttribute('data-lang'); if (l === active) return;
      localStorage.setItem(STORE, l);
      if (window.cinaiTrack) window.cinaiTrack('SwitchLanguage', { lang: l });
      location.reload();
    });
    document.body.appendChild(wrap);
  }

  function run() {
    detect().then((lang) => {
      if (!SUPPORTED.includes(lang)) lang = 'vi';
      translate(lang);
      buildSwitcher(lang);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
