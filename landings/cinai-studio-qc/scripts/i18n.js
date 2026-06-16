/* ============================================================
   i18n.js — Song ngữ EN/VN cho cinai-studio-qc (string-replacement)
   - KHÔNG cần gắn data-i18n: dịch bằng cách so khớp NGUYÊN văn bản EN → VI ở runtime.
   - Hai chiều: vi=EN→VI, en=VI→EN (stateless, an toàn khi gọi lại nhiều lần).
   - Tự nhận navigator.language (vi* → Tiếng Việt), nút toggle VI/EN, lưu localStorage.
   - window.CinaiI18n.apply() để main.js gọi lại sau khi đổi text động (billing note).
   ============================================================ */
(function () {
  "use strict";
  var STORAGE_KEY = "cinai_lang";
  var DEFAULT_LANG = "en";

  /* ---------- Từ điển EN → VI (khớp NGUYÊN văn bản đã trim) ---------- */
  var EN2VI = {
    // announcement + nav
    "New: Nano Banana Pro & GPT Image 2 unlocked on CinAI Pro — from $3/day": "Mới: Nano Banana Pro & GPT Image 2 đã mở khoá trên CinAI Pro — từ 79.000đ/ngày",
    "Get Pro": "Lấy gói Pro",
    "Features": "Tính năng",
    "Models": "Model",
    "Use cases": "Trường hợp dùng",
    "Pricing": "Bảng giá",
    "FAQ": "Hỏi đáp",
    "Get Free Workflow": "Nhận workflow miễn phí",
    "See Pricing": "Xem bảng giá",
    // hero
    "Create": "Tạo",
    "ad creatives, product shots": "ảnh quảng cáo, ảnh sản phẩm",
    "AI video —": "video AI —",
    "without counting credits": "không lo đếm credit",
    "CinAI.tv is the all-in-one AI creative workspace for marketers, sellers and agencies. From idea → storyboard → ad image → AI video, in one workflow. Try from $3/day.": "CinAI.tv là không gian sáng tạo AI tất-cả-trong-một cho marketer, người bán hàng và agency. Từ ý tưởng → storyboard → ảnh quảng cáo → video AI, trong một quy trình. Dùng thử từ 79.000đ/ngày.",
    "Unlock Pro from $3/day": "Mở khoá Pro từ 79.000đ/ngày",
    "Ad Images & Visuals": "Ảnh quảng cáo & Visual",
    "Turn a brief into scroll-stopping ad images and banners — multiple variants ready to test on Meta Ads.": "Biến một brief thành ảnh quảng cáo & banner níu mắt — nhiều biến thể sẵn sàng test trên Meta Ads.",
    "Create ad images →": "Tạo ảnh quảng cáo →",
    "Product & UGC Shots": "Ảnh sản phẩm & UGC",
    "Upload a product photo and generate clean studio shots, lookbooks and UGC-style visuals in minutes.": "Tải lên ảnh sản phẩm và tạo ảnh studio sạch, lookbook và visual kiểu UGC trong vài phút.",
    "Create product shots →": "Tạo ảnh sản phẩm →",
    "AI Video": "Video AI",
    "Generate short ad videos with Omni & Seedance — from storyboard to motion, no editing suite required.": "Tạo video quảng cáo ngắn với Omni & Seedance — từ storyboard tới chuyển động, không cần phần mềm dựng.",
    "Create AI video →": "Tạo video AI →",
    // strip
    "Premium AI models, one workspace": "Model AI cao cấp, một không gian",
    // tools
    "One workspace,": "Một không gian,",
    "every creative tool you need.": "đủ mọi công cụ sáng tạo bạn cần.",
    "From brief to storyboard to ad image to video — CinAI generates everything in a single session. No tool-switching, no agency markup, no 5-week timelines.": "Từ brief tới storyboard, ảnh quảng cáo rồi video — CinAI tạo tất cả trong một phiên làm việc. Không đổi công cụ, không phí agency, không chờ 5 tuần.",
    "Ad Image": "Ảnh quảng cáo",
    "Product Shot": "Ảnh sản phẩm",
    "UGC Image": "Ảnh UGC",
    "Workflow": "Quy trình",
    // use-cases (VFL)
    "E-commerce & Shop Owners": "Thương mại điện tử & Chủ shop",
    "Turn product photos into ad images. Generate clean studio shots, lookbooks and 5 ad variants to test on Meta — no photographer, no studio booking, no waiting on a designer.": "Biến ảnh sản phẩm thành ảnh quảng cáo. Tạo ảnh studio sạch, lookbook và 5 biến thể quảng cáo để test trên Meta — không cần thợ chụp, không thuê studio, không chờ designer.",
    "Beauty & Cosmetics": "Làm đẹp & Mỹ phẩm",
    "Create UGC-style beauty visuals and clean product concepts from a single shot. Test more angles for your skincare and makeup ads without re-shooting every time.": "Tạo visual làm đẹp kiểu UGC và concept sản phẩm sạch từ một tấm ảnh. Thử nhiều góc cho quảng cáo skincare & makeup mà không phải chụp lại mỗi lần.",
    "Fashion & Apparel": "Thời trang & May mặc",
    "Generate AI lookbooks on models, seasonal campaign sets and editorial visuals from flatlays — ready for social feeds and Meta Ads in one session.": "Tạo lookbook AI trên người mẫu, bộ ảnh chiến dịch theo mùa và visual editorial từ ảnh flatlay — sẵn sàng cho social và Meta Ads trong một phiên.",
    "F&B & Restaurants": "F&B & Nhà hàng",
    "Make every dish look irresistible. Generate appetizing hero shots, menu visuals and short promo videos for your restaurant or food brand — fast enough for weekly campaigns.": "Khiến mọi món ăn trông khó cưỡng. Tạo ảnh hero ngon mắt, visual menu và video quảng cáo ngắn cho nhà hàng hay thương hiệu đồ ăn — đủ nhanh cho chiến dịch hàng tuần.",
    "Agencies & Marketers": "Agency & Marketer",
    "Go from client brief to storyboard with Opus 4.8, then a hero video and a full set of image variants for A/B testing — all in one workflow, without the agency markup.": "Đi từ brief khách hàng tới storyboard bằng Opus 4.8, rồi video hero và bộ ảnh biến thể đầy đủ để A/B test — tất cả trong một quy trình, không phí agency.",
    // platform features
    "Why CinAI": "Vì sao chọn CinAI",
    "Everything for your creative ads, in one workspace": "Mọi thứ cho quảng cáo sáng tạo, trong một không gian",
    "Generate images, visuals, storyboards and video in one connected workflow — built for teams that test fast and want to stop worrying about credits.": "Tạo ảnh, visual, storyboard và video trong một quy trình liền mạch — hợp cho ai cần test thật nhanh mà không phải lo đếm credit.",
    "See plans & pricing →": "Xem các gói & bảng giá →",
    "Unlimited within plan": "Không giới hạn trong gói",
    "6+ models": "6+ model",
    "A/B ready": "Sẵn sàng A/B",
    "No prompt skills": "Không cần kỹ năng prompt",
    "Lower cost": "Chi phí thấp hơn",
    "All-in-one": "Tất cả trong một",
    "Stop counting credits": "Khỏi lo đếm credit",
    "Use GPT Image 2, Nano Banana 2 & Pro, and Opus 4.8 storyboards without watching your balance — unlimited within your plan term & fair-use policy. Test 10 creatives where you used to test 2.": "Dùng GPT Image 2, Nano Banana 2 & Pro, và storyboard Opus 4.8 mà không phải canh số dư — không giới hạn trong kỳ gói & chính sách dùng hợp lý. Test 10 mẫu thay vì 2 như trước.",
    "See what Pro unlocks →": "Xem Pro mở khoá gì →",
    "Premium models, one place": "Model cao cấp, một nơi",
    "GPT Image 2, Nano Banana Pro, Omni, Seedance and more — switch models without switching tools.": "GPT Image 2, Nano Banana Pro, Omni, Seedance và hơn nữa — đổi model mà không đổi công cụ.",
    "Explore →": "Khám phá →",
    "Test more creatives": "Test nhiều mẫu hơn",
    "Generate multiple variants per brief and export image sets ready for Meta Ads in one session.": "Tạo nhiều biến thể mỗi brief và xuất bộ ảnh sẵn sàng cho Meta Ads trong một phiên.",
    "Made for non-designers": "Dành cho người không phải designer",
    "Guided workflows turn a simple brief into finished creatives. Prompt packs included — no prompt engineering required.": "Quy trình có hướng dẫn biến brief đơn giản thành mẫu hoàn chỉnh. Có sẵn bộ prompt — không cần kỹ thuật prompt.",
    "Cut outsourcing cost": "Cắt chi phí thuê ngoài",
    "Replace one-off photographer, designer and editor bills with one predictable plan — from $3/day.": "Thay các khoản thuê thợ chụp, designer, editor lẻ bằng một gói cố định — từ 79.000đ/ngày.",
    "From idea to ready-to-post": "Từ ý tưởng tới sẵn sàng đăng",
    "Brief → storyboard → ad image → product shot → AI video, all in one connected workspace. No tool-switching, no exporting between five apps.": "Brief → storyboard → ảnh quảng cáo → ảnh sản phẩm → video AI, tất cả trong một không gian liền mạch. Không đổi công cụ, không xuất qua lại giữa năm app.",
    // guided
    "See it in motion": "Xem nó hoạt động",
    "From brief to creative, in one flow": "Từ brief tới mẫu sáng tạo, trong một luồng",
    // output marquee
    "Output gallery": "Thư viện kết quả",
    "Real outputs, made with CinAI": "Kết quả thật, dựng bằng CinAI",
    "Ad images & videos created on CinAI — pick a style, then remix the workflow.": "Ảnh & video AI dựng ngay trên CinAI — chọn phong cách bạn thích rồi remix lại workflow.",
    "Style: Cinematic TVC": "Phong cách: TVC điện ảnh",
    "Style: Product Visuals": "Phong cách: Ảnh sản phẩm",
    "Style: Sales Video": "Phong cách: Video bán hàng",
    "Style: Beauty & UGC": "Phong cách: Làm đẹp & UGC",
    "Style: Food & Beverage": "Phong cách: Ẩm thực & Đồ uống",
    "Style: Real Estate": "Phong cách: Bất động sản",
    "Style: Education": "Phong cách: Giáo dục",
    "Style: Brand Film": "Phong cách: Phim thương hiệu",
    // why / stats
    "Built for teams that ship creatives fast": "Lên mẫu quảng cáo nhanh hơn bao giờ hết",
    "One connected workspace — generate images, product shots, storyboards and video, then export ad-ready sets. No tool switching, no credit anxiety.": "Một không gian liền mạch — tạo ảnh, ảnh sản phẩm, storyboard và video, rồi xuất trọn bộ sẵn sàng chạy quảng cáo. Không phải đổi công cụ, cũng không lo credit.",
    "One workspace": "Một không gian",
    "Images, product shots, storyboards and video in a single workflow — no tool switching.": "Ảnh, ảnh sản phẩm, storyboard và video trong một quy trình — không đổi công cụ.",
    "GPT Image 2, Nano Banana Pro, Omni, Seedance and more — in one place.": "GPT Image 2, Nano Banana Pro, Omni, Seedance và hơn nữa — trong một nơi.",
    "Unlimited*": "Không giới hạn*",
    "Key models unlimited within your plan term & fair-use policy — stop counting credits.": "Các model chính không giới hạn trong kỳ gói & chính sách dùng hợp lý — khỏi lo đếm credit.",
    "From $3/day": "Từ 79.000đ/ngày",
    "Daily, monthly or yearly plans — start small and scale when you're ready.": "Gói ngày, tháng hoặc năm — bắt đầu nhỏ và mở rộng khi sẵn sàng.",
    "Powered by": "Vận hành bởi",
    // pricing
    "Plans": "Các gói",
    "Pick your plan. Stop counting credits.": "Chọn gói của bạn. Khỏi lo đếm credit.",
    "Try from $3/day, or go monthly/yearly. Key models are unlimited within your plan term & fair-use policy.": "Dùng thử từ 79.000đ/ngày, hoặc chọn tháng/năm. Các model chính không giới hạn trong kỳ gói & chính sách dùng hợp lý.",
    "Monthly": "Theo tháng",
    "Yearly": "Theo năm",
    "from $3/day": "từ 79.000đ/ngày",
    "For solo marketers, sellers & creators who want to test more without credit anxiety.": "Cho marketer, người bán & creator cá nhân muốn test nhiều hơn mà không lo credit.",
    "Billed monthly · or $3/day pass": "Tính theo tháng · hoặc vé 79.000đ/ngày",
    "Billed yearly · save ~16%": "Tính theo năm · tiết kiệm ~16%",
    "Billed monthly · everything in Pro included": "Tính theo tháng · gồm mọi thứ của Pro",
    "Plan credits + premium models (Omni, Seedance & more)": "Credit theo gói + model cao cấp (Omni, Seedance & hơn nữa)",
    "storyboards with Opus 4.8": "storyboard với Opus 4.8",
    "Ad images, product shots, UGC & banners": "Ảnh quảng cáo, ảnh sản phẩm, UGC & banner",
    "Guided workflows + prompt packs": "Quy trình có hướng dẫn + bộ prompt",
    "Most popular": "Phổ biến nhất",
    "+ unlimited video": "+ video không giới hạn",
    "For teams & agencies that also need unlimited AI video output.": "Cho agency & marketer cần thêm video AI không giới hạn.",
    "Everything in Pro": "Mọi thứ của Pro",
    "AI video with Omni": "video AI với Omni",
    "AI video with Seedance": "video AI với Seedance",
    "Priority for new premium models": "Ưu tiên model cao cấp mới",
    "Best for agencies running many campaigns": "Tốt nhất cho agency chạy nhiều chiến dịch",
    "Get Plus": "Lấy gói Plus",
    "*Unlimited applies within your plan term and our fair-use policy. Plan credits cover premium models per your plan.": "*Không giới hạn áp dụng trong kỳ gói và chính sách dùng hợp lý. Credit theo gói chi trả cho model cao cấp tuỳ gói.",
    // lead magnet
    "Free workflow": "Workflow miễn phí",
    "Not ready to upgrade? Get a free AI workflow for your industry.": "Chưa muốn nâng cấp? Nhận một workflow AI miễn phí cho ngành của bạn.",
    "Tell us your industry and goal. We'll email you a ready-to-use workflow, sample prompts, and a limited Pro upgrade voucher.": "Cho chúng tôi biết ngành & mục tiêu của bạn. Chúng tôi sẽ email workflow dùng ngay, prompt mẫu và voucher nâng cấp Pro có hạn.",
    "Your industry": "Ngành của bạn",
    "E-commerce / Shop owner": "TMĐT / Chủ shop",
    "Beauty / Cosmetics": "Làm đẹp / Mỹ phẩm",
    "Fashion": "Thời trang",
    "Agency / Freelancer": "Agency / Freelancer",
    "Marketer (running ads)": "Marketer (chạy ads)",
    "Content Creator": "Nhà sáng tạo nội dung",
    "Other": "Khác",
    "Your main goal": "Mục tiêu chính của bạn",
    "Create ad images": "Tạo ảnh quảng cáo",
    "Create product images": "Tạo ảnh sản phẩm",
    "Create UGC images": "Tạo ảnh UGC",
    "Create storyboards": "Tạo storyboard",
    "Create AI video": "Tạo video AI",
    "Test more ad creatives": "Test thêm mẫu quảng cáo",
    "Optimize social content": "Tối ưu nội dung social",
    "Send Me My Workflow →": "Gửi workflow cho tôi →",
    "We'll only email your workflow & occasional CinAI tips. Unsubscribe anytime.": "Chúng tôi chỉ email workflow & vài mẹo CinAI thỉnh thoảng. Huỷ nhận bất cứ lúc nào.",
    "✓ Done! Check your inbox — your industry workflow & Pro voucher are on the way.": "✓ Xong! Kiểm tra hộp thư — workflow theo ngành & voucher Pro đang đến.",
    "Example workflow": "Workflow ví dụ",
    "Input": "Đầu vào",
    "A single product photo": "Một tấm ảnh sản phẩm",
    "AI lookbook + promo text + variants": "Lookbook AI + lời quảng cáo + biến thể",
    "Output": "Kết quả",
    "5 ad variants ready to test on Meta Ads": "5 biến thể quảng cáo sẵn sàng test trên Meta Ads",
    // FAQ
    "Questions before you start": "Câu hỏi trước khi bắt đầu",
    "Quick answers about plans, models, pricing and the free workflow.": "Giải đáp nhanh về gói, model, giá và workflow miễn phí.",
    "What does Pro include unlimited?": "Pro bao gồm không giới hạn những gì?",
    "Within your plan term and fair-use policy, Pro unlocks unlimited use of GPT Image 2, Nano Banana 2, Nano Banana Pro and Opus 4.8 storyboards — on top of your plan credits and premium models like Omni & Seedance.": "Trong kỳ gói và chính sách dùng hợp lý, Pro mở khoá dùng không giới hạn GPT Image 2, Nano Banana 2, Nano Banana Pro và storyboard Opus 4.8 — bên cạnh credit theo gói và model cao cấp như Omni & Seedance.",
    "How is Plus different from Pro?": "Plus khác Pro thế nào?",
    "Plus includes everything in Pro, plus unlimited AI video with Omni and Seedance (within plan term & fair-use). It's built for teams and agencies that also need video output.": "Plus gồm mọi thứ của Pro, cộng thêm video AI không giới hạn với Omni và Seedance (trong kỳ gói & dùng hợp lý). Hợp cho agency và marketer cần làm thêm video.",
    "What's the $3/day option?": "Tùy chọn 79.000đ/ngày là gì?",
    "It's the lowest-cost way to try CinAI — a daily access pass (about 79K VND) so you can test the workspace before committing to a monthly or yearly plan.": "Đây là cách rẻ nhất để thử CinAI — vé truy cập theo ngày (79.000đ) để bạn test không gian trước khi cam kết gói tháng hay năm.",
    "Is yearly cheaper?": "Gói năm có rẻ hơn không?",
    "Yes — billed yearly, Pro works out to $21/mo (vs $25) and Plus to $49/mo (vs $59), roughly 16% off.": "Có — tính theo năm, Pro còn 550.000đ/tháng (so với 650.000đ) và Plus còn 1.290.000đ/tháng (so với 1.540.000đ), giảm khoảng 16%.",
    "I'm not good at prompts — can I still use it?": "Tôi không giỏi prompt — vẫn dùng được chứ?",
    "Yes. Guided workflows turn a simple brief into finished creatives, and prompt packs are included — no prompt engineering required.": "Được. Quy trình có hướng dẫn biến brief đơn giản thành mẫu hoàn chỉnh, và có sẵn bộ prompt — không cần kỹ thuật prompt.",
    "Can I use outputs for commercial ads?": "Tôi dùng kết quả cho quảng cáo thương mại được không?",
    "Yes, for client projects and campaigns, subject to your plan and the underlying model providers' terms.": "Được, cho dự án khách hàng và chiến dịch, tuỳ theo gói của bạn và điều khoản của nhà cung cấp model.",
    "Which models are unlocked?": "Những model nào được mở khoá?",
    "GPT Image 2, Nano Banana 2, Nano Banana Pro, Opus 4.8 (storyboard), Omni and Seedance — all in one workspace.": "GPT Image 2, Nano Banana 2, Nano Banana Pro, Opus 4.8 (storyboard), Omni và Seedance — tất cả trong một không gian.",
    "How do plan credits work?": "Credit theo gói hoạt động ra sao?",
    "Each plan includes credits for premium models, while the listed models above are unlimited within your plan term & fair-use policy — so most everyday creative work won't run your balance down.": "Mỗi gói gồm credit cho model cao cấp, còn các model liệt kê ở trên là không giới hạn trong kỳ gói & chính sách dùng hợp lý — nên hầu hết công việc sáng tạo hằng ngày sẽ không làm cạn số dư.",
    "How do I get the free workflow?": "Làm sao nhận workflow miễn phí?",
    "Fill the form above with your industry and goal — we'll email your workflow, sample prompts and a Pro upgrade voucher.": "Điền form phía trên với ngành & mục tiêu — chúng tôi sẽ email workflow, prompt mẫu và voucher nâng cấp Pro.",
    // CTA
    "Ready To Build": "Sẵn sàng bắt tay",
    "Ready to test more creatives today?": "Sẵn sàng test thêm nhiều mẫu hôm nay?",
    "Generate ad images, product shots, storyboards and AI video in one workflow — unlimited within your plan, from $3/day. No tool switching, no credit anxiety.": "Tạo ảnh quảng cáo, ảnh sản phẩm, storyboard và video AI trong một quy trình — không giới hạn trong gói, từ 79.000đ/ngày. Không đổi công cụ, không lo credit.",
    // marquee
    "CinAI.tv — Create more, count credits less": "CinAI.tv — Tạo nhiều hơn, đếm credit ít đi",
    // footer
    "Your next campaign starts here.": "Chiến dịch kế tiếp của bạn bắt đầu ở đây.",
    "Start with a plan built for AI creative work — daily, monthly or yearly. Unlock premium models from $3/day.": "Bắt đầu với gói dành cho sáng tạo AI — ngày, tháng hoặc năm. Mở khoá model cao cấp từ 79.000đ/ngày.",
    "The AI creative workspace for ad images, product shots, storyboards and video.": "Không gian sáng tạo AI cho ảnh quảng cáo, ảnh sản phẩm, storyboard và video.",
    "Product": "Sản phẩm",
    "Support": "Hỗ trợ",
    "Legal": "Pháp lý",
    "AI Models": "Model AI",
    "Use Cases": "Trường hợp dùng",
    "Free Workflow": "Workflow miễn phí",
    "Ad Images": "Ảnh quảng cáo",
    "Product Shots": "Ảnh sản phẩm",
    "UGC Images": "Ảnh UGC",
    "Storyboards": "Storyboard",
    "Pro — $25/mo": "Pro — 650.000đ/tháng",
    "Plus — $59/mo": "Plus — 1.540.000đ/tháng",
    "Yearly (save ~16%)": "Năm (tiết kiệm ~16%)",
    "Day pass — from $3": "Vé ngày — từ 79.000đ",
    "Help Center": "Trung tâm trợ giúp",
    "Privacy Policy": "Chính sách bảo mật",
    "Refund Policy": "Chính sách hoàn tiền",
    "Terms of Service": "Điều khoản dịch vụ",
    "© 2026 CinAI.tv. All rights reserved. · \"Unlimited\" applies within your plan term & fair-use policy.": "© 2026 CinAI.tv. Bảo lưu mọi quyền. · \"Không giới hạn\" áp dụng trong kỳ gói & chính sách dùng hợp lý.",
    // lớp phủ video
    "Preview Workflow": "Xem workflow",
    // transient (nút submit)
    "Sending…": "Đang gửi…"
  };

  /* ---------- reverse map (VI → EN) cho lúc đổi về English ---------- */
  var VI2EN = {};
  Object.keys(EN2VI).forEach(function (en) { if (!(EN2VI[en] in VI2EN)) VI2EN[EN2VI[en]] = en; });

  var state = { lang: detectLang() };

  function detectLang() {
    try { var s = localStorage.getItem(STORAGE_KEY); if (s === "vi" || s === "en") return s; } catch (e) {}
    var n = (navigator.language || navigator.userLanguage || "").toLowerCase();
    return n.indexOf("vi") === 0 ? "vi" : DEFAULT_LANG;
  }

  function skip(node) {
    for (var p = node.parentNode; p && p !== document.body; p = p.parentNode) {
      var tag = p.nodeName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return true;
      if (p.nodeType === 1 && p.hasAttribute("data-no-i18n")) return true;
    }
    return false;
  }

  function apply(lang) {
    if (lang) state.lang = lang;
    var dict = state.lang === "vi" ? EN2VI : VI2EN; // dịch INTO ngôn ngữ đích
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var raw = node.nodeValue;
      var t = raw.trim();
      if (!t) continue;
      var hit = dict[t];
      if (hit && hit !== t && !skip(node)) node.nodeValue = raw.replace(t, hit);
    }
    document.documentElement.setAttribute("lang", state.lang);
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      var on = b.getAttribute("data-lang") === state.lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    // đổi tiền tệ giá (EN=USD / VI=VND) + ghi chú — main.js sở hữu logic này
    if (window.__cinaiRefreshPricing) window.__cinaiRefreshPricing();
  }

  function setLang(lang) {
    if (lang !== "vi" && lang !== "en") return;
    if (lang === state.lang) { apply(); return; }
    state.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    apply();
  }

  window.CinaiI18n = {
    get lang() { return state.lang; },
    apply: apply,
    setLang: setLang,
  };

  function init() {
    apply(state.lang);
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
