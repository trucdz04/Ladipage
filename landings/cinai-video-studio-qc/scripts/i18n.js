/* ============================================================
   i18n.js — Song ngữ EN/VN cho landing QC CinAI.tv
   - Tự nhận ngôn ngữ trình duyệt (vi* → tiếng Việt, còn lại → English)
   - Lưu lựa chọn vào localStorage, có nút toggle VI/EN ở header
   - Áp text qua [data-i18n], HTML qua [data-i18n-html],
     thuộc tính qua [data-i18n-attr="attr:key"]
   - Phát sự kiện "cinai:langchange" để main.js render lại nội dung động
   ============================================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "cinai_lang";
  var DEFAULT_LANG = "en"; // fallback cho thị trường nước ngoài

  /* ---------- TỪ ĐIỂN ---------- */
  var DICT = {
    en: {
      /* announce + nav */
      "announce.text": "<strong>Welcome Offer!</strong> Get 56% OFF — all plans!",
      "announce.cta": "See Pricing →",
      "nav.videos": "AI Videos",
      "nav.models": "AI Models",
      "nav.workflows": "Workflows",
      "nav.pricing": "Pricing",
      "cta.trial": "Trial Omni unlimited",
      /* mega menus */
      "mega.videos.sub": "Turn any image or prompt into a dynamic AI video.",
      "mega.i2v.t": "Image to Video", "mega.i2v.d": "Animate any photo or product shot.",
      "mega.t2v.t": "Text to Video", "mega.t2v.d": "Describe a scene, get a polished MP4.",
      "mega.ext.t": "Extend Video", "mega.ext.d": "Continue any clip seamlessly.",
      "mega.ava.t": "Talking Avatars", "mega.ava.d": "Lipsync talking-head clips.",
      "mega.models.t": "100+ AI Models", "mega.models.sub": "Connect the best video & image models in one studio.",
      "mega.seedance.d": "Cinematic multi-shot video engine.",
      "mega.kling.d": "Pro motion & character consistency.",
      "mega.veo.d": "Fast clips with native audio.",
      "mega.img.d": "Premium image models for key art.",
      "mega.wf.t": "Workflows & Templates", "mega.wf.sub": "Automate creative pipelines and remix community templates.",
      "mega.tpl.t": "Community Templates", "mega.tpl.d": "Remix proven creative pipelines.",
      "mega.pipe.t": "Automated Pipelines", "mega.pipe.d": "Chain models end to end.",
      "mega.up.t": "Image Upscaler", "mega.up.d": "Enhance & upscale up to 4K.",
      "mega.edit.t": "Image Editor", "mega.edit.d": "Edit & restyle with AI.",
      /* breadcrumb + hero */
      "bc.home": "Home", "bc.studio": "AI Video Studio",
      "hero.laurel": "#1 AI Cinematic",
      "hero.h1": "AI Video &amp; Workflow Studio with <em>Image to Video</em>",
      "hero.sub": "Build, run, and share AI-powered video workflows on CinAI.tv. Connect 100+ AI models and turn any image or prompt into a finished video.",
      "hero.pill1": "Instant AI Video Generation",
      "hero.pill2": "Picture to Video AI",
      "hero.pill3": "Connect 100+ AI Models",
      "hero.pill4": "Automate Creative Pipelines",
      /* generator panel */
      "panel.banner": "Try the new Gemini Omni cinematic model",
      "panel.title": "Turn Images into Videos with AI",
      "panel.login": "Login to generate videos",
      "panel.selectModel": "Select AI Model",
      "panel.badge.bestAudio": "Best Quality + Audio",
      "panel.badge.new": "New",
      "panel.badge.proQuality": "Pro Quality",
      "panel.badge.justLaunched": "Just Launched",
      "panel.seeMore": "See More Models",
      "panel.seeMoreCount": "+8 more",
      "panel.tab.i2v": "Image to Video",
      "panel.tab.t2v": "Text to Video",
      "panel.tab.ext": "Extend Video",
      "panel.upload": "Upload Image",
      "panel.useSample": "Use sample image",
      "panel.changeImg": "Change image",
      "panel.prompt": "Prompt",
      "panel.promptPh": "Describe how the image should animate...",
      "panel.duration": "Video Duration",
      "panel.credits20": "+20 credits",
      "panel.credits40": "+40 credits",
      "panel.resolution": "Video Resolution",
      "panel.credits10": "+10 credits",
      "panel.moreOptions": "Click to see more options",
      "panel.cta": "Sign up to Try!",
      "panel.note": "Update: Now generate more videos while you wait",
      "panel.notif": "Notification sound on",
      "pv.save": "Save", "pv.extend": "Extend video", "pv.upscale": "Upscale video",
      "pv.continue": "Continue from last frame", "pv.editImg": "Generate or edit an image",
      /* community */
      "community.eyebrow": "Community Videos",
      "community.h2": "Community Videos Collection",
      "community.sub": "Discover and remix videos with prompts.",
      "community.cta": "View all Community Videos",
      /* features */
      "features.h2": "Everything you need to create AI videos",
      "features.sub": "Generate clips from images, prompts, portraits, and product shots in one workflow.",
      "feat.fast.t": "Fast Generation", "feat.fast.d": "Turn images and prompts into short videos without editing software or render queues.",
      "feat.t2v.t": "Text to Video", "feat.t2v.d": "Describe the scene, style, and motion you want, then generate a polished MP4.",
      "feat.i2v.t": "Image to Video", "feat.i2v.d": "Upload a photo, product shot, or character image and add realistic motion.",
      "feat.ava.t": "Talking Avatars", "feat.ava.d": "Create lipsync and talking-head videos from portraits for ads, intros, and social clips.",
      "feat.comm.t": "Commercial Use", "feat.comm.d": "Download videos for social media, ads, websites, presentations, and client work.",
      /* models section */
      "models.h2": "Explore AI Video Models",
      "models.sub": "Discover powerful AI video generation models to create stunning videos from text or images.",
      "models.cta": "View All Models",
      "models.readmore": "Read more",
      /* pricing */
      "pricing.eyebrow": "Welcome Offer — 56% OFF",
      "pricing.h2": "Simple pricing, unlimited creativity",
      "pricing.sub": "Welcome Offer: 56% off every plan. Start free, then keep the plan that fits how you create. Cancel anytime.",
      "pricing.monthly": "Monthly",
      "pricing.yearly": "Yearly",
      "pricing.save": "best value",
      "pricing.wasLabel": "was",
      "pricing.perMonth": "/mo",
      "pricing.billedMonthly": "billed monthly",
      "pricing.pro.badge": "Most popular",
      "pricing.pro.sub": "Start here",
      "pricing.pro.billedYearly": "billed yearly · $228/yr",
      "pricing.pro.tagline": "Unlimited AI images + storyboards, with credits for cinematic video.",
      "pricing.pro.cta": "Start with Pro",
      "pricing.pro.f1": "♾️ Unlimited AI images — Nano Banana 2 Pro",
      "pricing.pro.f2": "♾️ Unlimited AI images — ChatGPT Image 2",
      "pricing.pro.f3": "Auto-storyboard with Opus 4.8",
      "pricing.pro.f4": "Plan credits for Seedance · Kling · Omni video",
      "pricing.pro.bonus": "🎁 Welcome bonus: 20 Grok + 20 Omni + 100 Veo Quality renders free (one-time)",
      "pricing.plus.badge": "Best for video creators",
      "pricing.plus.sub": "Unlimited video",
      "pricing.plus.billedYearly": "billed yearly · $468/yr",
      "pricing.plus.tagline": "Everything in Pro, plus unlimited cinematic video.",
      "pricing.plus.cta": "Go Plus",
      "pricing.plus.f1": "✓ Everything in Pro",
      "pricing.plus.f2": "♾️ Unlimited AI video — Gemini Omni",
      "pricing.plus.f3": "♾️ Unlimited AI video — Veo Quality",
      "pricing.plus.f4": "Larger plan credit allotment",
      "pricing.plus.bonus": "🎁 100 free Grok videos every month",
      "pricing.freeTrial": "Sign up and generate for free — no credit card required.",
      /* faq */
      "faq.h2": "Frequently asked questions",
      /* epic + footer */
      "epic.big": "Create Epic",
      "epic.sub": "Build, run, and share AI video workflows with CinAI.tv · Questions: hello@cinai.tv",
      "footer.brand": "AI video & workflow studio. Connect 100+ AI models, automate creative pipelines, and remix community templates. Questions: hello@cinai.tv",
      "footer.product": "Product", "footer.models": "Models", "footer.company": "Company",
      "footer.blog": "Blog", "footer.login": "Login", "footer.plans": "Plans",
      "footer.privacy": "Privacy Policy", "footer.terms": "Terms & Conditions",
      "footer.contact": "Contact", "footer.termsUse": "Terms of Use",
      "footer.copy": "© CinAI.tv — AI Video & Workflow Studio",
      /* modal */
      "modal.title": "Epic AI Videos in Seconds",
      "modal.trust": "Sign up to start creating · Connect 100+ AI models",
      "modal.google": "Continue with Google",
      "modal.create": "Create Account",
      "modal.haveAccount": "Already have an account?",
      "modal.signin": "Sign In",
      "modal.disclaimer": "By continuing, I acknowledge the Privacy Policy and agree to the Terms of Use. I also confirm that I am at least 18 years old.",
    },

    vi: {
      /* announce + nav */
      "announce.text": "<strong>Ưu đãi chào mừng!</strong> Giảm ngay 56% — mọi gói!",
      "announce.cta": "Xem bảng giá →",
      "nav.videos": "Video AI",
      "nav.models": "Model AI",
      "nav.workflows": "Quy trình",
      "nav.pricing": "Bảng giá",
      "cta.trial": "Dùng thử Omni không giới hạn",
      /* mega menus */
      "mega.videos.sub": "Biến mọi ảnh hoặc prompt thành video AI sống động.",
      "mega.i2v.t": "Ảnh ra Video", "mega.i2v.d": "Làm chuyển động mọi ảnh chụp hay ảnh sản phẩm.",
      "mega.t2v.t": "Chữ ra Video", "mega.t2v.d": "Mô tả một cảnh, nhận ngay video MP4 hoàn chỉnh.",
      "mega.ext.t": "Nối dài Video", "mega.ext.d": "Kéo dài bất kỳ clip nào liền mạch.",
      "mega.ava.t": "Avatar biết nói", "mega.ava.d": "Clip nhân vật nói chuyện, khớp khẩu hình.",
      "mega.models.t": "100+ Model AI", "mega.models.sub": "Kết nối các model video & ảnh tốt nhất trong một studio.",
      "mega.seedance.d": "Engine video điện ảnh, nhiều cảnh.",
      "mega.kling.d": "Chuyển động pro & nhân vật nhất quán.",
      "mega.veo.d": "Clip nhanh, có âm thanh gốc.",
      "mega.img.d": "Model ảnh cao cấp cho key art.",
      "mega.wf.t": "Quy trình & Mẫu", "mega.wf.sub": "Tự động hoá quy trình sáng tạo và remix mẫu cộng đồng.",
      "mega.tpl.t": "Mẫu cộng đồng", "mega.tpl.d": "Remix các quy trình sáng tạo đã được kiểm chứng.",
      "mega.pipe.t": "Quy trình tự động", "mega.pipe.d": "Nối nhiều model từ đầu đến cuối.",
      "mega.up.t": "Nâng nét ảnh", "mega.up.d": "Tăng chất lượng & nâng nét lên đến 4K.",
      "mega.edit.t": "Chỉnh sửa ảnh", "mega.edit.d": "Chỉnh sửa & đổi phong cách bằng AI.",
      /* breadcrumb + hero */
      "bc.home": "Trang chủ", "bc.studio": "Studio Video AI",
      "hero.laurel": "#1 Điện ảnh AI",
      "hero.h1": "Studio Video &amp; Quy trình AI với <em>Ảnh ra Video</em>",
      "hero.sub": "Dựng, chạy và chia sẻ quy trình video AI ngay trên CinAI.tv. Kết nối 100+ model AI và biến mọi ảnh hay prompt thành video hoàn chỉnh.",
      "hero.pill1": "Tạo video AI tức thì",
      "hero.pill2": "Ảnh thành Video bằng AI",
      "hero.pill3": "Kết nối 100+ Model AI",
      "hero.pill4": "Tự động hoá quy trình sáng tạo",
      /* generator panel */
      "panel.banner": "Thử model điện ảnh mới Gemini Omni",
      "panel.title": "Biến ảnh thành video bằng AI",
      "panel.login": "Đăng nhập để tạo video",
      "panel.selectModel": "Chọn model AI",
      "panel.badge.bestAudio": "Chất lượng cao + Âm thanh",
      "panel.badge.new": "Mới",
      "panel.badge.proQuality": "Chất lượng Pro",
      "panel.badge.justLaunched": "Vừa ra mắt",
      "panel.seeMore": "Xem thêm model",
      "panel.seeMoreCount": "+8 model nữa",
      "panel.tab.i2v": "Ảnh ra Video",
      "panel.tab.t2v": "Chữ ra Video",
      "panel.tab.ext": "Nối dài Video",
      "panel.upload": "Tải ảnh lên",
      "panel.useSample": "Dùng ảnh mẫu",
      "panel.changeImg": "Đổi ảnh",
      "panel.prompt": "Mô tả (prompt)",
      "panel.promptPh": "Mô tả cách ảnh chuyển động...",
      "panel.duration": "Thời lượng video",
      "panel.credits20": "+20 credit",
      "panel.credits40": "+40 credit",
      "panel.resolution": "Độ phân giải",
      "panel.credits10": "+10 credit",
      "panel.moreOptions": "Bấm để xem thêm tuỳ chọn",
      "panel.cta": "Đăng ký dùng thử!",
      "panel.note": "Cập nhật: Tạo thêm video ngay trong lúc chờ",
      "panel.notif": "Đã bật âm báo",
      "pv.save": "Lưu", "pv.extend": "Nối dài video", "pv.upscale": "Nâng nét video",
      "pv.continue": "Tiếp từ khung cuối", "pv.editImg": "Tạo hoặc chỉnh ảnh",
      /* community */
      "community.eyebrow": "Video cộng đồng",
      "community.h2": "Bộ sưu tập video cộng đồng",
      "community.sub": "Khám phá và remix video kèm prompt.",
      "community.cta": "Xem tất cả video cộng đồng",
      /* features */
      "features.h2": "Mọi thứ bạn cần để tạo video AI",
      "features.sub": "Tạo clip từ ảnh, prompt, chân dung và ảnh sản phẩm trong cùng một quy trình.",
      "feat.fast.t": "Tạo nhanh", "feat.fast.d": "Biến ảnh và prompt thành video ngắn, không cần phần mềm dựng hay hàng chờ render.",
      "feat.t2v.t": "Chữ ra Video", "feat.t2v.d": "Mô tả cảnh, phong cách và chuyển động bạn muốn, rồi tạo ngay video MP4 hoàn chỉnh.",
      "feat.i2v.t": "Ảnh ra Video", "feat.i2v.d": "Tải lên ảnh chụp, ảnh sản phẩm hay nhân vật và thêm chuyển động chân thực.",
      "feat.ava.t": "Avatar biết nói", "feat.ava.d": "Tạo video chân dung nói chuyện, khớp khẩu hình cho quảng cáo, intro và clip mạng xã hội.",
      "feat.comm.t": "Dùng thương mại", "feat.comm.d": "Tải video về dùng cho mạng xã hội, quảng cáo, website, thuyết trình và dự án khách hàng.",
      /* models section */
      "models.h2": "Khám phá các model video AI",
      "models.sub": "Khám phá những model tạo video AI mạnh mẽ để dựng video ấn tượng từ chữ hoặc ảnh.",
      "models.cta": "Xem tất cả model",
      "models.readmore": "Tìm hiểu thêm",
      /* pricing */
      "pricing.eyebrow": "Ưu đãi chào mừng — giảm 56%",
      "pricing.h2": "Giá đơn giản, sáng tạo không giới hạn",
      "pricing.sub": "Ưu đãi chào mừng: giảm 56% mọi gói. Bắt đầu miễn phí, rồi giữ gói hợp với cách bạn sáng tạo. Huỷ bất cứ lúc nào.",
      "pricing.monthly": "Theo tháng",
      "pricing.yearly": "Theo năm",
      "pricing.save": "đáng giá nhất",
      "pricing.wasLabel": "giá gốc",
      "pricing.perMonth": "/tháng",
      "pricing.billedMonthly": "thanh toán theo tháng",
      "pricing.pro.badge": "Phổ biến nhất",
      "pricing.pro.sub": "Bắt đầu ở đây",
      "pricing.pro.billedYearly": "thanh toán theo năm · $228/năm",
      "pricing.pro.tagline": "Ảnh AI + storyboard không giới hạn, kèm credit cho video điện ảnh.",
      "pricing.pro.cta": "Bắt đầu với Pro",
      "pricing.pro.f1": "♾️ Ảnh AI không giới hạn — Nano Banana 2 Pro",
      "pricing.pro.f2": "♾️ Ảnh AI không giới hạn — ChatGPT Image 2",
      "pricing.pro.f3": "Tự động dựng storyboard bằng Opus 4.8",
      "pricing.pro.f4": "Credit theo gói cho video Seedance · Kling · Omni",
      "pricing.pro.bonus": "🎁 Quà chào mừng: 20 Grok + 20 Omni + 100 Veo Quality video miễn phí (một lần)",
      "pricing.plus.badge": "Tốt nhất cho nhà sáng tạo video",
      "pricing.plus.sub": "Video không giới hạn",
      "pricing.plus.billedYearly": "thanh toán theo năm · $468/năm",
      "pricing.plus.tagline": "Tất cả của Pro, cộng thêm video điện ảnh không giới hạn.",
      "pricing.plus.cta": "Lên gói Plus",
      "pricing.plus.f1": "✓ Tất cả quyền lợi của Pro",
      "pricing.plus.f2": "♾️ Video AI không giới hạn — Gemini Omni",
      "pricing.plus.f3": "♾️ Video AI không giới hạn — Veo Quality",
      "pricing.plus.f4": "Hạn mức credit theo gói lớn hơn",
      "pricing.plus.bonus": "🎁 100 video Grok miễn phí mỗi tháng",
      "pricing.freeTrial": "Đăng ký và tạo thử miễn phí — không cần thẻ tín dụng.",
      /* faq */
      "faq.h2": "Câu hỏi thường gặp",
      /* epic + footer */
      "epic.big": "Tạo nên điều phi thường",
      "epic.sub": "Dựng, chạy và chia sẻ quy trình video AI cùng CinAI.tv · Liên hệ: hello@cinai.tv",
      "footer.brand": "Studio video & quy trình AI. Kết nối 100+ model AI, tự động hoá quy trình sáng tạo và remix mẫu cộng đồng. Liên hệ: hello@cinai.tv",
      "footer.product": "Sản phẩm", "footer.models": "Model", "footer.company": "Công ty",
      "footer.blog": "Blog", "footer.login": "Đăng nhập", "footer.plans": "Các gói",
      "footer.privacy": "Chính sách bảo mật", "footer.terms": "Điều khoản & Điều kiện",
      "footer.contact": "Liên hệ", "footer.termsUse": "Điều khoản sử dụng",
      "footer.copy": "© CinAI.tv — Studio Video & Quy trình AI",
      /* modal */
      "modal.title": "Video AI đỉnh cao trong vài giây",
      "modal.trust": "Đăng ký để bắt đầu sáng tạo · Kết nối 100+ model AI",
      "modal.google": "Tiếp tục với Google",
      "modal.create": "Tạo tài khoản",
      "modal.haveAccount": "Đã có tài khoản?",
      "modal.signin": "Đăng nhập",
      "modal.disclaimer": "Khi tiếp tục, tôi xác nhận đã đọc Chính sách bảo mật và đồng ý với Điều khoản sử dụng. Tôi cũng xác nhận mình đủ 18 tuổi trở lên.",
    },
  };

  /* ---------- DYNAMIC DATA (Models/FAQ) cho main.js đọc ---------- */
  // mô tả model + nội dung FAQ tách theo ngôn ngữ; main.js render dựa vào đây.
  var DYNAMIC = {
    modelDesc: {
      en: {
        "Seedance 2.0": "CinAI's flagship cinematic engine — multi-shot sequences, native audio sync, and crisp 2K output.",
        "Kling V3 Pro": "Professional-grade motion and multi-shot storytelling, up to 15-second clips with consistent characters.",
        "Veo 3.1": "Google DeepMind's Veo — fast, budget-friendly clips with dialogue and ambient sound baked in.",
        "Hailuo (MiniMax)": "Rapid text- and image-to-video generation, great for quick social and ad iterations.",
        "Nano Banana": "Lightning-fast image model for product shots and reference frames before you animate.",
        "GPT Image 2": "Premium prompt-to-image model for storyboards, key art, and on-brand visual concepts.",
        "Gemini Omni": "All-in-one multimodal model for blending image, motion, and audio in a single workflow.",
        "Opus 4.8": "Reasoning model that scripts, plans, and orchestrates your creative pipeline end to end.",
      },
      vi: {
        "Seedance 2.0": "Engine điện ảnh chủ lực của CinAI — chuỗi nhiều cảnh, đồng bộ âm thanh gốc và đầu ra 2K sắc nét.",
        "Kling V3 Pro": "Chuyển động cấp chuyên nghiệp và kể chuyện nhiều cảnh, clip đến 15 giây với nhân vật nhất quán.",
        "Veo 3.1": "Veo của Google DeepMind — clip nhanh, tiết kiệm, có sẵn lời thoại và âm thanh nền.",
        "Hailuo (MiniMax)": "Tạo video từ chữ và ảnh cực nhanh, lý tưởng để thử nhanh nội dung social và quảng cáo.",
        "Nano Banana": "Model ảnh tốc độ cao cho ảnh sản phẩm và khung tham chiếu trước khi tạo chuyển động.",
        "GPT Image 2": "Model chữ-ra-ảnh cao cấp cho storyboard, key art và ý tưởng hình ảnh đúng thương hiệu.",
        "Gemini Omni": "Model đa phương thức tất-cả-trong-một, hoà trộn ảnh, chuyển động và âm thanh trong một quy trình.",
        "Opus 4.8": "Model suy luận viết kịch bản, lên kế hoạch và điều phối toàn bộ quy trình sáng tạo của bạn.",
      },
    },
    faq: {
      en: [
        { q: "What is CinAI.tv?", a: "CinAI.tv is an AI video and workflow studio. You can connect 100+ AI models, automate creative pipelines, and remix community templates to turn any idea, image, or prompt into a finished video." },
        { q: "Which AI models can I use?", a: "CinAI connects 100+ models including Seedance 2.0, Kling, Veo 3.1, Hailuo, GPT Image 2, Nano Banana, Omni, and Opus 4.8 — pick the right model for each step of your pipeline, all in one place." },
        { q: "How long does it take to generate a video?", a: "Most clips are ready within 30-60 seconds depending on the model, resolution, and length. Longer or higher-resolution renders take a little more time, and you'll be notified the moment yours is ready." },
        { q: "Can I automate my creative workflow?", a: "Yes. CinAI lets you build reusable pipelines that chain models together — script, image, motion, and audio — so you can run an entire creative process automatically and share it as a template." },
        { q: "How do I get the best results?", a: "Write detailed prompts describing the motion, style, and scene you want, and start from a clean high-quality image for image-to-video. The more context you give, the closer the output matches your vision." },
        { q: "Can I use the videos commercially?", a: "Yes — videos you generate on CinAI are yours to use for personal or commercial projects including social media, ads, websites, and client work. See our terms for full licensing details." },
      ],
      vi: [
        { q: "CinAI.tv là gì?", a: "CinAI.tv là studio tạo video và quy trình bằng AI. Bạn có thể kết nối 100+ model AI, tự động hoá quy trình sáng tạo và remix mẫu cộng đồng để biến mọi ý tưởng, ảnh hay prompt thành video hoàn chỉnh." },
        { q: "Tôi dùng được những model AI nào?", a: "CinAI kết nối 100+ model gồm Seedance 2.0, Kling, Veo 3.1, Hailuo, GPT Image 2, Nano Banana, Omni và Opus 4.8 — chọn đúng model cho từng bước trong quy trình, tất cả trong một nơi." },
        { q: "Tạo một video mất bao lâu?", a: "Hầu hết clip sẵn sàng trong 30-60 giây tuỳ model, độ phân giải và độ dài. Clip dài hơn hoặc độ phân giải cao hơn cần thêm chút thời gian, và bạn sẽ được báo ngay khi video xong." },
        { q: "Tôi có thể tự động hoá quy trình sáng tạo không?", a: "Có. CinAI cho phép bạn dựng các quy trình tái sử dụng, nối nhiều model với nhau — kịch bản, ảnh, chuyển động và âm thanh — để chạy toàn bộ quá trình sáng tạo tự động và chia sẻ dưới dạng mẫu." },
        { q: "Làm sao để có kết quả tốt nhất?", a: "Viết prompt chi tiết mô tả chuyển động, phong cách và bối cảnh bạn muốn, và bắt đầu từ ảnh chất lượng cao, sạch khi dùng ảnh-ra-video. Càng nhiều ngữ cảnh, kết quả càng sát ý bạn." },
        { q: "Tôi dùng video cho mục đích thương mại được không?", a: "Được — video bạn tạo trên CinAI là của bạn để dùng cho dự án cá nhân hoặc thương mại gồm mạng xã hội, quảng cáo, website và dự án khách hàng. Xem điều khoản để biết chi tiết bản quyền." },
      ],
    },
  };

  /* ---------- CORE ---------- */
  function detectLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "vi") return saved;
    } catch (e) { /* localStorage có thể bị chặn */ }
    var nav = (navigator.language || navigator.userLanguage || "").toLowerCase();
    return nav.indexOf("vi") === 0 ? "vi" : DEFAULT_LANG;
  }

  function t(key) {
    var lang = state.lang;
    return (DICT[lang] && DICT[lang][key]) || (DICT[DEFAULT_LANG] && DICT[DEFAULT_LANG][key]) || "";
  }

  function apply(lang) {
    var table = DICT[lang] || DICT[DEFAULT_LANG];

    // textContent
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = table[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });
    // innerHTML (chứa <em>, <strong>…)
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = table[el.getAttribute("data-i18n-html")];
      if (v != null) el.innerHTML = v;
    });
    // attribute: "placeholder:panel.promptPh" (có thể nhiều cặp, cách nhau bằng ;)
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length === 2) {
          var v = table[parts[1].trim()];
          if (v != null) el.setAttribute(parts[0].trim(), v);
        }
      });
    });

    document.documentElement.setAttribute("lang", lang);

    // trạng thái nút toggle
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var on = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", String(on));
    });
  }

  function setLang(lang, persist) {
    if (lang !== "en" && lang !== "vi") return;
    state.lang = lang;
    if (persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    }
    apply(lang);
    document.dispatchEvent(new CustomEvent("cinai:langchange", { detail: { lang: lang } }));
  }

  /* ---------- STATE + EXPORT ---------- */
  var state = { lang: detectLang() };
  window.CinaiI18n = {
    get lang() { return state.lang; },
    t: t,
    setLang: setLang,
    modelDesc: function (name) {
      var m = DYNAMIC.modelDesc[state.lang] || DYNAMIC.modelDesc.en;
      return m[name] || (DYNAMIC.modelDesc.en[name] || "");
    },
    faq: function () { return DYNAMIC.faq[state.lang] || DYNAMIC.faq.en; },
  };

  // Áp ngôn ngữ càng sớm càng tốt (script nạp không defer, trước main.js)
  apply(state.lang);
  document.documentElement.setAttribute("lang", state.lang);

  // Nút toggle + áp lại sau khi DOM sẵn sàng (phòng khi vài node chưa parse xong)
  document.addEventListener("DOMContentLoaded", function () {
    apply(state.lang);
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang")); });
    });
  });
})();
