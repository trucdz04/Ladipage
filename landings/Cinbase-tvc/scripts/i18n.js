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
  "Cộng đồng Zalo · Chia sẻ skill": "Zalo community · Share skills",
  "Học cách tạo skill, cùng cộng đồng.": "Learn to create skills with the community.",
  "Bạn muốn tự tạo skill nhưng chưa biết bắt đầu từ đâu? Tham gia cộng đồng Zalo để học cách tạo skill và khám phá những skill miễn phí được chia sẻ trong nhóm.": "Want to create your own skills but unsure where to begin? Join the Zalo community to learn how to create skills and discover free skills shared in the group.",
  "Học cách tạo skill theo nhu cầu của bạn.": "Learn to create skills for your needs.",
  "Khám phá skill miễn phí do cộng đồng chia sẻ.": "Discover free skills shared by the community.",
  "Trao đổi cách sử dụng và chia sẻ kinh nghiệm.": "Discuss how to use skills and share your experience.",
  "Tham gia cộng đồng Zalo →": "Join the Zalo community →",
  "Xem skill trên CinAI": "Explore skills on CinAI",
  "Mở nhóm trên Zalo, không cần để lại email tại đây. Skill được chia sẻ miễn phí; chi phí model hoặc tín dụng khi chạy trên CinAI vẫn áp dụng theo gói và model bạn chọn.": "Open the group on Zalo — no email required here. Shared skills are free; CinAI model or credit costs still apply according to your plan and chosen model.",
  "Từ học cách làm đến skill của bạn": "From learning to your own skill",
  "01 · Khám phá": "01 · Explore",
  "Tìm skill được chia sẻ trong cộng đồng.": "Find skills shared by the community.",
  "02 · Học cách tạo": "02 · Learn to create",
  "Tìm hiểu cách xây dựng và chỉnh skill theo ý tưởng.": "Learn how to build and adapt skills to your ideas.",
  "03 · Thử nghiệm & chia sẻ": "03 · Experiment & share",
  "Thử trên CinAI, trao đổi kết quả và kinh nghiệm với nhóm.": "Try it on CinAI and discuss results and experiences with the group.",
  "3.500 tín dụng/tháng · +15% thưởng · model ảnh & video không giới hạn theo danh sách Pro.": "3,500 credits/month · +15% bonus · unlimited image & video models as listed in Pro.",
  "3.500 tín dụng/tháng, +15% thưởng và quyền lợi trên 17 model: 12 model ảnh, 5 model video.": "3,500 credits/month, +15% bonus and benefits across 17 models: 12 image and 5 video models.",
  "Dành cho người sáng tạo nội dung chuyên nghiệp: 3.500 tín dụng/tháng, +15% thưởng, 4 tác vụ đồng thời và hàng đợi ưu tiên cao.": "For professional creators: 3,500 credits/month, +15% bonus, 4 concurrent tasks and high-priority queue.",
  "Model ảnh & video": "Image & video models",
  "Tín dụng / tháng": "Credits / month",
  "Ảnh · 12 model": "Images · 12 models",
  "Video · 5 model": "Video · 5 models",
  "Quyền ưu tiên & model cao cấp": "Priority benefits & premium models",
  "Thưởng điểm danh hằng ngày": "Daily check-in rewards",
  "Tới 20/ngày": "Up to 20/day",
  "Tác vụ đồng thời": "Concurrent tasks",
  "Hàng đợi": "Queue",
  "Ưu tiên cao": "High priority",
  "Ưu tiên dùng model mới": "Priority access to new models",
  "Gói tín dụng giảm giá": "Discounted credit packs",
  "Model cao cấp khác": "Other premium models",
  "Có": "Included",
  "100 lượt free": "100 free uses",
  "60 lượt free": "60 free uses",
  "30 lượt free": "30 free uses",
  "3.500 tín dụng/tháng · +15% thưởng.": "3,500 credits/month · +15% bonus.",
  "/tháng · kiểm tra chu kỳ thanh toán": "/month · check billing cycle",
  "· Giảm 20%": "· 20% off",
  "Xem skill trên Explore": "View skill on Explore",
  "AI Avatar của jimi — skill có trên CinAI Explore. Xem video preview gốc để tham khảo nhân vật và phong cách thể hiện.": "AI Avatar by jimi — a skill on CinAI Explore. Watch its original preview for the character and visual style.",
  "Music Video của NovaFrames — khám phá skill video âm nhạc trên CinAI Explore cùng video preview gốc.": "Music Video by NovaFrames — explore this music video skill on CinAI Explore with its original preview.",
  "Drama Video của NovaFrames — tham khảo video kể chuyện từ thư viện skill CinAI Explore.": "Drama Video by NovaFrames — watch a storytelling preview from the CinAI Explore skill library.",
  "Interactive Drama của lanry — xem video preview của skill kể chuyện tương tác trên CinAI Explore.": "Interactive Drama by lanry — watch the preview for this interactive storytelling skill on CinAI Explore.",
  "Subtitle Localize của CinAI — skill thuộc nhóm Remake & Localize trên Explore, dành cho nội dung bản địa hóa phụ đề.": "Subtitle Localize by CinAI — a skill in Explore’s Remake & Localize category for subtitle localization.",
  "Khám phá skill,": "Explore skills,",
  "xem video thực tế.": "watch real previews.",
  "Xem skill trên Explore →": "View skill on Explore →",
  "Skill và video preview gốc từ CinAI Explore.": "Original skill and preview video from CinAI Explore.",
  "Skill trên CinAI Explore · CinAI. Video preview gốc từ thư viện skill.": "Skill on CinAI Explore · CinAI. Original preview from the skill library.",
  "Skill trên CinAI Explore · jimi. Video preview gốc từ thư viện skill.": "Skill on CinAI Explore · jimi. Original preview from the skill library.",
  "Chọn một skill để xem video preview gốc từ CinAI Explore. Mỗi tab là một skill có thật trên nền tảng; quyền sử dụng phụ thuộc vào model và điều kiện của từng skill.": "Choose a skill to watch its original CinAI Explore preview. Each tab features an actual platform skill; usage depends on its models and terms.",
  "Khám phá Explore →": "Discover Explore →",
  "AL:Khám phá workflow trên CinAI Explore (mở tab mới)": "Explore workflows on CinAI Explore (opens a new tab)",
  "__title": "CinAI Pro — USD 25/month | 500 workflows & over 4,000 skills",
  "Tặng": "Free",
  "Dịch vụ": "Services",
  "Ngành nghề": "Industries",
  "Quy trình": "Process",
  "Hỏi đáp": "FAQ",
  "Xuất bản chuẩn chạy ads:": "Ad-ready output:",
  "Preview Workflow": "Preview Workflow",
  "TVC Quảng Cáo": "Ad TVC",
  "Video Bán Hàng & Social": "Sales & Social Video",
  "Video Thương Hiệu & Đào Tạo": "Brand & Training Video",
  "Giải pháp": "The solution",
  "trên nền tảng CINAI.TV OS": "on the CINAI.TV OS platform",
  "TVC 30s": "30s TVC",
  "Video bán hàng": "Sales video",
  "Social / Reels": "Social / Reels",
  "Video sản phẩm": "Product video",
  "Video thương hiệu": "Brand video",
  "Đào tạo nội bộ": "Internal training",
  "Viral content": "Viral content",
  "E-commerce & Bán lẻ": "E-commerce & Retail",
  "F&B & Nhà hàng": "F&B & Restaurants",
  "Làm món nào cũng trông hấp dẫn: TVC món ăn, video menu và clip promo ngắn — đủ nhanh cho chiến dịch khuyến mãi hàng tuần.": "Make every dish look irresistible: food TVCs, menu videos and short promo clips — fast enough for weekly promotions.",
  "Bất động sản": "Real estate",
  "Phim giới thiệu dự án với góc quay điện ảnh, voice-over chuyên nghiệp — gây ấn tượng với khách hàng trước cả khi đến xem thực tế.": "Project showcase films with cinematic angles and professional voice-over — impress buyers before they even visit.",
  "Mỹ phẩm & Làm đẹp": "Cosmetics & Beauty",
  "Video UGC-style và TVC sản phẩm làm đẹp: nhiều góc máy, nhiều phong cách để test quảng cáo — không phải tổ chức quay lại mỗi chiến dịch.": "UGC-style videos and beauty product TVCs: multiple angles and styles to test ads — no reshoots every campaign.",
  "Giáo dục & Đào tạo": "Education & Training",
  "Video khoá học, video tuyển sinh và đào tạo nội bộ — voice-over rõ ràng, hình ảnh minh hoạ nhất quán cho cả bộ chương trình.": "Course videos, admissions and internal training — clear voice-over and consistent visuals across the whole program.",
  "End-to-end": "End-to-end",
  "Theo thương hiệu": "On-brand",
  "Kịch bản & storyboard AI": "AI script & storyboard",
  "AI viết kịch bản đúng giọng thương hiệu, chia cảnh và gợi ý hình ảnh — duyệt trước khi sản xuất.": "AI writes scripts in your brand voice, breaks down scenes and suggests visuals — approve before production.",
  "Xem thêm →": "Learn more →",
  "Xem gói →": "See plans →",
  "Điện ảnh": "Cinematic",
  "Hệ sinh thái CinBase": "CinBase ecosystem",
  "Quy trình khép kín — toàn bộ trên trình duyệt web": "A closed-loop process — entirely in your web browser",
  "Thư viện kết quả": "Results gallery",
  "Mỗi lần một video khác biệt": "A different video every time",
  "Style: TVC Điện ảnh": "Style: Cinematic TVC",
  "Style: Video sản phẩm": "Style: Product video",
  "Style: Video bán hàng": "Style: Sales video",
  "Style: Mỹ phẩm & Làm đẹp": "Style: Cosmetics & Beauty",
  "Style: F&B / Ẩm thực": "Style: F&B / Cuisine",
  "Style: Bất động sản": "Style: Real estate",
  "Style: Giáo dục": "Style: Education",
  "Style: Phim thương hiệu": "Style: Brand film",
  "Chuyển đổi số workflow": "Workflow digitalization",
  "CINAI.TV OS": "CINAI.TV OS",
  "Không giới hạn": "Unlimited",
  "trước khi sản xuất": "before production",
  "không giới hạn": "without limits",
  "Bắt đầu hôm nay": "Start today",
  "Lĩnh vực của doanh nghiệp": "Your industry",
  "Thương mại / Bán lẻ": "Commerce / Retail",
  "Sản xuất": "Manufacturing",
  "F&B / Nhà hàng": "F&B / Restaurant",
  "Giáo dục / Đào tạo": "Education / Training",
  "Agency / Marketing": "Agency / Marketing",
  "Khác": "Other",
  "Loại video bạn cần": "Video type you need",
  "TVC quảng cáo 15–30s": "Ad TVC 15–30s",
  "Video bán hàng / sản phẩm": "Sales / product video",
  "Video social (TikTok / Reels)": "Social video (TikTok / Reels)",
  "Phim giới thiệu doanh nghiệp": "Company intro film",
  "Video đào tạo nội bộ": "Internal training video",
  "Chưa rõ — cần tư vấn": "Not sure — need advice",
  "Hoặc gọi trực tiếp Hotline": "Or call our hotline",
  "· Thông tin chỉ dùng để tư vấn — không spam, không chia sẻ cho bên thứ ba.": "· Your info is used for consultation only — no spam, never shared with third parties.",
  "Hành trình một video": "The journey of one video",
  "Brief ngắn + ảnh/thông tin sản phẩm": "A short brief + product photos/info",
  "Kịch bản → voice-over → dựng cảnh AI → nhạc & hiệu ứng": "Script → voice-over → AI scenes → music & effects",
  "Bạn nhận": "You receive",
  "Câu hỏi trước khi bắt đầu": "Questions before you start",
  "Bắt đầu như thế nào?": "How do I get started?",
  "Sẵn sàng lên sóng?": "Ready to go live?",
  "Hotline": "Hotline",
  "Chiến dịch video tiếp theo bắt đầu tại đây.": "Your next video campaign starts here.",
  "Hệ sinh thái": "Ecosystem",
  "Quy trình sản xuất": "Production process",
  "Blog": "Blog",
  "Hỗ trợ": "Support",
  "Hotline 0962949620": "Hotline 0962949620",
  "Pháp lý": "Legal",
  "Chính sách bảo mật": "Privacy policy",
  "Điều khoản dịch vụ": "Terms of service",
  "Ngành nghề của bạn": "Your industry",
  "Thông tin chỉ dùng để tư vấn — không spam, không chia sẻ cho bên thứ ba.": "Your info is used for consultation only — no spam, never shared with third parties.",
  "PH:email@congty.com": "email@company.com",
  "AL:Email công ty": "Company email",
  "AL:Lĩnh vực": "Industry",
  "AL:Loại video cần làm": "Video type",
  "AL:Có cần xuất hóa đơn GTGT": "Need a VAT invoice",
  "AL:Đóng": "Close",
  "PH:Họ và tên": "Full name",
  "AL:Họ và tên": "Full name",
  "PH:Số điện thoại": "Phone number",
  "AL:Số điện thoại": "Phone number",
  "PH:Email": "Email",
  "AL:Ngành nghề": "Industry",
  "AL:Loại video cần": "Video type",
  "PH:Email của bạn": "Your email",
  "AL:Định dạng video": "Video format",
  "AL:Quy trình sản xuất": "Production process",
  "AL:Video mẫu theo phong cách": "Sample videos by style",
  "AL:Thời gian cam kết": "Commitment length",
  "CinAI Pro — 25 USD/tháng | 500 workflow & hơn 4.000 skill": "CinAI Pro — USD 25/month | 500 workflows & over 4,000 skills",
  "25 USD/tháng": "USD 25/month",
  "— tặng voucher": "— includes a voucher for",
  "giảm 50%": "50% off",
  ", giới hạn 100 voucher": ", limited to 100 vouchers",
  "Xem ưu đãi Pro": "See Pro offer",
  "Tính năng": "Features",
  "Ứng dụng": "Use cases",
  "Gói Pro": "Pro plan",
  "Xem gói Pro": "See Pro plan",
  "Đăng ký CinAI Pro": "Sign up for CinAI Pro",
  "CinAI Pro · Sáng tạo ngay trên trình duyệt": "CinAI Pro · Create in your browser",
  "Cả một studio AI": "An entire AI studio",
  "trong gói Pro": "in your Pro plan",
  "Tạo ảnh & video": "Create images & video",
  "chỉ 25 USD/tháng": "just USD 25/month",
  "Gemini Omni 1.1 Flash & Veo 3.1 Lite không giới hạn.": "Unlimited Gemini Omni 1.1 Flash & Veo 3.1 Lite.",
  "Khám phá": "Explore",
  "500 workflow và hơn 4.000 skill": "500 workflows and over 4,000 skills",
  "— từ ý tưởng đến nội dung, ngay trên CinAI.": "— from idea to content, right on CinAI.",
  "Xem nền tảng hoạt động": "See the platform in action",
  "Hơn 4.000 skill": "Over 4,000 skills",
  "Voucher giảm 50%": "50% off voucher",
  "Mỗi tháng": "Per month",
  "Workflow sáng tạo": "Creative workflows",
  "Skill để khám phá": "Skills to explore",
  "Khám phá workflow quảng cáo, phác thảo ý tưởng và tự tinh chỉnh nội dung trên CinAI.": "Explore advertising workflows, outline ideas and refine your content on CinAI.",
  "Xem gói Pro →": "See Pro plan →",
  "Tự tạo nội dung sản phẩm và video social từ workflow phù hợp với chiến dịch.": "Create product and social content with workflows suited to your campaign.",
  "Xem quyền lợi Pro →": "See Pro benefits →",
  "Khám phá cách kể câu chuyện thương hiệu và xây dựng nội dung đào tạo bằng AI.": "Explore brand storytelling and training content with AI.",
  "Bắt đầu sáng tạo với AI": "Start creating with AI",
  "Bạn muốn làm nội dung, không muốn bắt đầu lại từ đầu.": "You want to create content, not start from scratch.",
  "Chọn một workflow phù hợp, thêm ý tưởng của bạn và bắt đầu thử nghiệm. CinAI Pro kết hợp model AI với kho tài nguyên để bạn có điểm xuất phát rõ ràng.": "Choose a workflow, add your idea and start experimenting. CinAI Pro combines AI models with resources to give you a clear starting point.",
  "Tự ghép từng công cụ": "Connecting separate tools",
  "Nhiều bước trước khi có bản nháp": "Many steps before a first draft",
  "Nhiều công cụ rời rạc": "Disconnected tools",
  "— phải tự nối các bước trong quy trình.": "— connect each step yourself.",
  "Thiếu điểm bắt đầu": "No starting point",
  "— tốn thời gian chọn mẫu và viết yêu cầu.": "— spend time choosing templates and writing instructions.",
  "Cần thử lại": "Iteration needed",
  "— đầu ra AI vẫn cần kiểm tra và tinh chỉnh.": "— AI output still needs review and refinement.",
  "Khó tái sử dụng": "Hard to reuse",
  "— phải lưu và quản lý từng cách làm.": "— save and manage each approach separately.",
  "Nhiều lựa chọn": "Too many choices",
  "— chưa biết quy trình nào hợp nội dung.": "— unsure which workflow fits your content.",
  "Với CinAI Pro": "With CinAI Pro",
  "— một gói Pro để bắt đầu trên CinAI.": "— one Pro plan to get started on CinAI.",
  "— chọn quy trình phù hợp với ý tưởng.": "— choose a workflow for your idea.",
  "— khám phá kỹ năng cho từng tác vụ.": "— explore skills for individual tasks.",
  "— không giới hạn trong gói Pro.": "— unlimited in the Pro plan.",
  "Chủ động sáng tạo": "Creative control",
  "— bạn kiểm tra và tinh chỉnh thành phẩm.": "— review and refine your results.",
  "Có mẫu để bắt đầu, có công cụ để thử nghiệm —": "Templates to start with, tools to experiment with —",
  "bạn tập trung vào ý tưởng của mình.": "focus on your ideas.",
  "Hệ sinh thái AI · Pro không giới hạn: Gemini Omni 1.1 Flash và Veo 3.1 Lite": "AI ecosystem · Unlimited in Pro: Gemini Omni 1.1 Flash and Veo 3.1 Lite",
  "Một gói Pro,": "One Pro plan,",
  "nhiều cách tạo nội dung.": "many ways to create.",
  "Khám phá workflow cho quảng cáo, video social và nội dung thương hiệu. Kiểm tra model cần dùng trong từng workflow trước khi bắt đầu.": "Explore workflows for ads, social videos and brand content. Check each workflow's model requirements before starting.",
  "Xem CinAI hoạt động ngay trên trình duyệt": "See CinAI in action in your browser",
  "Một vòng khám phá giao diện, workflow và skill — video quay trực tiếp từ CinAI Explore.": "A tour of the interface, workflows and skills — recorded directly from CinAI Explore.",
  "Mở CinAI Explore →": "Open CinAI Explore →",
  "Khám phá workflow cho sản phẩm và quảng cáo bán lẻ. Thử ý tưởng, so sánh bản nháp và chọn nội dung phù hợp với thương hiệu.": "Explore product and retail ad workflows. Try ideas, compare drafts and choose content that fits your brand.",
  "Khám phá workflow trên CinAI": "Explore workflows on CinAI",
  "Kho tài nguyên sáng tạo": "Creative resources",
  "500 workflow. Hơn 4.000 skill. Một gói Pro.": "500 workflows. Over 4,000 skills. One Pro plan.",
  "Từ quy trình mẫu đến kỹ năng cho từng tác vụ — chọn điểm bắt đầu phù hợp với ý tưởng của bạn.": "From templates to task-specific skills — choose a starting point for your idea.",
  "Khám phá quy trình mẫu cho nhiều hướng nội dung. Chọn mẫu phù hợp rồi chỉnh theo sản phẩm, thương hiệu và mục tiêu của bạn.": "Explore templates for different content types. Adapt them to your product, brand and goals.",
  "→ Chọn mẫu, thêm ý tưởng của bạn": "→ Choose a template, add your idea",
  "Tìm kỹ năng theo nhu cầu sáng tạo, dùng làm điểm khởi đầu cho ý tưởng và các tác vụ trong quy trình làm nội dung.": "Find skills for your creative needs, ideas and individual content tasks.",
  "→ Khám phá kỹ năng theo tác vụ": "→ Explore skills by task",
  "Hai model không giới hạn": "Two unlimited models",
  "Gemini Omni 1.1 Flash và Veo 3.1 Lite — hai model thuộc quyền lợi không giới hạn của gói CinAI Pro.": "Gemini Omni 1.1 Flash and Veo 3.1 Lite — the two models included with unlimited usage in CinAI Pro.",
  "→ Cùng trong gói 25 USD/tháng": "→ Included in the USD 25/month plan",
  "Sáng tạo trên CinAI": "Create on CinAI",
  "Từ ý tưởng đến bản nháp của bạn": "From your idea to your first draft",
  "Khám phá quy trình làm nội dung trên nền tảng. Chọn workflow phù hợp và kiểm tra model, đầu vào cùng quyền lợi cần thiết trước khi chạy.": "Explore the platform's content workflows. Check the model, inputs and required plan benefits before running one.",
  "500 workflow để không bắt đầu từ trang trắng": "500 workflows, so you never face a blank page",
  "Chọn một quy trình mẫu theo hướng nội dung bạn muốn làm. Thêm thông tin sản phẩm, mô tả ý tưởng và tinh chỉnh từng bước theo mục tiêu của bạn.": "Choose a workflow for your content. Add product information, describe your idea and refine each step.",
  "Chọn mẫu → Thêm ý tưởng → Tạo bản nháp →": "Choose a template → Add your idea → Create a draft →",
  "Trong gói Pro": "Included in Pro",
  "Model không giới hạn trong gói CinAI Pro — một trong hai quyền lợi chính của chương trình.": "An unlimited model in CinAI Pro — one of the offer's two core model benefits.",
  "Khám phá hướng sáng tạo video với Veo 3.1 Lite không giới hạn trong gói Pro.": "Explore video creation with unlimited Veo 3.1 Lite in Pro.",
  "Kho kỹ năng": "Skill library",
  "Khám phá kỹ năng cho từng tác vụ, tìm ý tưởng mới và lựa chọn tài nguyên phù hợp với cách làm nội dung của bạn.": "Explore task-specific skills, find ideas and choose resources for your creative process.",
  "Chưa biết bắt đầu từ đâu? Mở Explore.": "Not sure where to start? Open Explore.",
  "Xem trước giao diện, khám phá workflow và skill theo chủ đề. Chọn một ý tưởng gần với nhu cầu của bạn trước khi bắt đầu.": "Preview the interface and browse workflows and skills by topic. Pick an idea that fits your needs.",
  "Khám phá CinAI Explore": "Discover CinAI Explore",
  "01 · Chọn workflow hoặc skill": "01 · Choose a workflow or skill",
  "02 · Mô tả ý tưởng của bạn": "02 · Describe your idea",
  "03 · Tạo và tinh chỉnh": "03 · Generate and refine",
  "04 · Kiểm tra thành phẩm": "04 · Review your result",
  "Chọn workflow hoặc skill → thêm mô tả và tài nguyên đầu vào → tạo bản nháp → kiểm tra và tinh chỉnh. Các video bên cạnh minh họa hướng nội dung, không phải cam kết đầu ra của từng model.": "Choose a workflow or skill → add your description and inputs → generate a draft → review and refine. The adjacent examples illustrate content styles, not guaranteed output from each model.",
  "Video minh họa từ thư viện CinBase trên nền CinAI — tham khảo phong cách, không đại diện riêng cho hai model Pro.": "Examples from the CinBase library on CinAI — style references, not exclusive demonstrations of the two Pro models.",
  "▶ Video mẫu": "▶ Sample video",
  "Bạn nhận được gì trong gói Pro?": "What is included in Pro?",
  "Quyền lợi cụ thể để bạn cân nhắc trước khi đăng ký.": "Specific benefits to consider before signing up.",
  "Tài nguyên": "Resources",
  "Nhu cầu": "Your needs",
  "Thuê bao": "Subscription",
  "Bắt đầu": "Get started",
  "Quy trình mẫu": "Workflow templates",
  "Chọn mẫu": "Choose a template",
  "Kỹ năng": "Skills",
  "Chọn một workflow, thêm ý tưởng của bạn và tạo bản nháp đầu tiên trên CinAI.": "Choose a workflow, add your idea and create your first draft on CinAI.",
  "CinAI Pro · Tự sáng tạo trên nền tảng": "CinAI Pro · Create on the platform",
  "Gói CinAI Pro": "CinAI Pro plan",
  "Sáng tạo với Pro — 25 USD/tháng": "Create with Pro — USD 25/month",
  "Hai model không giới hạn, cùng kho workflow và skill để bạn bắt đầu.": "Two unlimited models, plus workflows and skills to get started.",
  "Tự sáng tạo · CINAI PRO": "Create yourself · CINAI PRO",
  "Một gói Pro cho ý tưởng tiếp theo của bạn.": "One Pro plan for your next idea.",
  "Bắt đầu bằng workflow và skill có sẵn. Khai thác hai model không giới hạn, kiểm tra bản nháp và tinh chỉnh ngay trên nền tảng CinAI.": "Start with available workflows and skills. Use two unlimited models, review your drafts and refine them on CinAI.",
  "Gemini Omni 1.1 Flash — không giới hạn": "Gemini Omni 1.1 Flash — unlimited",
  "Veo 3.1 Lite — không giới hạn": "Veo 3.1 Lite — unlimited",
  "500 workflow cho nhiều hướng nội dung": "500 workflows for different content types",
  "Hơn 4.000 skill để khám phá": "Over 4,000 skills to explore",
  "Gói Pro / tháng": "Pro plan / month",
  "/tháng": "/month",
  "Tặng voucher": "Voucher included",
  "Giới hạn chương trình: 100 voucher": "Program limited to 100 vouchers",
  "Đăng ký CinAI Pro →": "Sign up for CinAI Pro →",
  "Kiểm tra điều kiện voucher và giá tại bước thanh toán.": "Check voucher terms and pricing at checkout.",
  "Đã bao gồm trong Pro": "Included in Pro",
  "Khám phá ý tưởng và tạo nội dung với model trong gói Pro.": "Explore ideas and create content with the model included in Pro.",
  "Khám phá trên CinAI": "Explore on CinAI",
  "Thử nghiệm hướng video và tinh chỉnh theo mục tiêu sáng tạo.": "Try video ideas and refine them for your creative goals.",
  "Thêm tài nguyên cho quá trình sáng tạo": "More resources for your creative process",
  "Chọn điểm bắt đầu cho nội dung": "Choose a starting point for your content",
  "Kỹ năng sáng tạo": "Creative skills",
  "Khám phá theo nhu cầu của bạn": "Explore based on your needs",
  "Ưu đãi đăng ký": "Sign-up offer",
  "Giới hạn 100 voucher": "Limited to 100 vouchers",
  "Xem nền tảng trước": "Preview the platform",
  "Xem video highlight hoặc mở Explore để hiểu cách sử dụng.": "Watch the highlight or open Explore to see how it works.",
  "Kiểm tra quyền lợi gói": "Check plan benefits",
  "Hai model không giới hạn được nêu rõ. Kiểm tra thông tin gói trước khi thanh toán.": "The two unlimited models are listed clearly. Check plan details before paying.",
  "Điều kiện voucher": "Voucher terms",
  "Voucher giảm 50%, giới hạn 100 voucher. Xác nhận phạm vi áp dụng khi đăng ký.": "50% off voucher, limited to 100 vouchers. Confirm eligibility when signing up.",
  "Cần hướng dẫn chọn workflow?": "Need help choosing a workflow?",
  "Để lại nhu cầu để trao đổi về gói Pro và cách bắt đầu trên CinAI. Nếu đã sẵn sàng, bạn có thể đăng ký trực tiếp ở phần gói Pro.": "Share your needs to discuss Pro and getting started on CinAI. Ready to begin? Sign up directly in the Pro section.",
  "Nhiều ý tưởng nội dung": "Multiple content ideas",
  "Nhận tư vấn gói Pro →": "Get Pro guidance →",
  "Yêu cầu tư vấn gói Pro. Bạn cũng có thể liên hệ hotline 0962949620.": "Pro consultation request. You can also call 0962949620.",
  "Bạn chuẩn bị": "You prepare",
  "Bạn thao tác trên CinAI": "You work on CinAI",
  "Bạn hoàn thiện": "You refine",
  "Kiểm tra bản nháp và tinh chỉnh nội dung theo mục tiêu": "Review your draft and refine the content for your goals",
  "Khám phá workflow và skill trên CinAI Explore": "Explore workflows and skills on CinAI Explore",
  "Giải đáp về gói Pro, workflow, skill và chương trình voucher.": "Answers about Pro, workflows, skills and the voucher offer.",
  "Gói CinAI Pro giá bao nhiêu?": "How much does CinAI Pro cost?",
  "Gói Pro trong chương trình này có giá 25 USD/tháng. Voucher giảm 50% là ưu đãi riêng; hãy kiểm tra điều kiện áp dụng và giá cuối cùng ở bước thanh toán.": "This campaign offers Pro at USD 25/month. The 50% off voucher is a separate offer; check its terms and your final price at checkout.",
  "Model nào được dùng không giới hạn?": "Which models are unlimited?",
  "Quyền lợi không giới hạn của gói này áp dụng cho Gemini Omni 1.1 Flash và Veo 3.1 Lite. Không có nghĩa mọi model khác trên nền tảng đều được bao gồm.": "This plan's unlimited benefits apply to Gemini Omni 1.1 Flash and Veo 3.1 Lite. Other models on the platform are not necessarily included.",
  "500 workflow và hơn 4.000 skill khác nhau thế nào?": "How do the 500 workflows and over 4,000 skills differ?",
  "Workflow là quy trình mẫu để bắt đầu làm nội dung. Skill là kỹ năng cho các tác vụ cụ thể. Bạn chọn tài nguyên theo mục tiêu và tùy chỉnh theo ý tưởng của mình.": "Workflows are templates for creating content. Skills support specific tasks. Choose resources for your goals and adapt them to your idea.",
  "Tôi có thể bắt đầu từ ảnh sản phẩm không?": "Can I start with product photos?",
  "Bạn có thể tìm workflow phù hợp với ảnh sản phẩm trên Explore. Xem yêu cầu đầu vào của từng workflow trước khi sử dụng.": "Find a workflow suited to product photos on Explore. Check its input requirements before using it.",
  "Voucher giảm 50% áp dụng thế nào?": "How does the 50% off voucher work?",
  "Chương trình tặng voucher giảm 50%, giới hạn 100 voucher. Hãy xác nhận điều kiện và kỳ áp dụng khi đăng ký; trang này không hiển thị số voucher còn lại.": "The program offers a 50% off voucher, limited to 100 vouchers. Confirm eligibility and applicable billing periods when signing up. This page does not show remaining availability.",
  "Tôi có thể làm những dạng nội dung nào?": "What kinds of content can I create?",
  "Khám phá các hướng nội dung như quảng cáo sản phẩm, video social, kể chuyện và giới thiệu thương hiệu trên Explore. Mỗi workflow có yêu cầu và cách sử dụng riêng.": "Explore product ads, social videos, storytelling and brand introductions. Each workflow has its own requirements and usage.",
  "Có thể xem nền tảng trước khi đăng ký không?": "Can I preview the platform before signing up?",
  "Có. Xem video highlight trên trang này hoặc mở cinai.tv/explore để khám phá giao diện và các tài nguyên đang hiển thị.": "Yes. Watch the highlight on this page or visit cinai.tv/explore to browse the interface and available resources.",
  "Đây có phải dịch vụ thuê sản xuất TVC không?": "Is this a done-for-you TVC production service?",
  "Không. CinAI Pro là gói sử dụng nền tảng để bạn tự sáng tạo. Đây không phải hợp đồng thuê đội ngũ sản xuất video.": "No. CinAI Pro is a platform subscription for creating content yourself, not a contract to hire a video production team.",
  "Chọn “Đăng ký CinAI Pro” để mở trang đăng ký CinAI. Kiểm tra gói, giá và voucher trước khi thanh toán; nếu cần hướng dẫn, liên hệ CinBase qua hotline 0962949620.": "Select “Sign up for CinAI Pro” to open CinAI registration. Check the plan, price and voucher before paying. For help, contact CinBase at 0962949620.",
  "Bắt đầu sáng tạo với CinAI Pro": "Start creating with CinAI Pro",
  "25 USD/tháng — Gemini Omni 1.1 Flash và Veo 3.1 Lite không giới hạn. Khám phá 500 workflow cùng hơn 4.000 skill cho ý tưởng tiếp theo.": "USD 25/month — unlimited Gemini Omni 1.1 Flash and Veo 3.1 Lite. Explore 500 workflows and over 4,000 skills for your next idea.",
  "CinAI Pro · 500 workflow · Hơn 4.000 skill": "CinAI Pro · 500 workflows · Over 4,000 skills",
  "CinAI Pro 25 USD/tháng — hai model không giới hạn, 500 workflow và hơn 4.000 skill.": "CinAI Pro at USD 25/month — two unlimited models, 500 workflows and over 4,000 skills.",
  "Cùng CinBase khám phá CinAI Pro — tự sáng tạo nội dung với 500 workflow, hơn 4.000 skill và hai model không giới hạn.": "Discover CinAI Pro with CinBase — create content with 500 workflows, over 4,000 skills and two unlimited models.",
  "© 2026 CinBase — vận hành trên nền tảng CINAI.TV OS. Bảo lưu mọi quyền. · Gói Pro 25 USD/tháng. Kiểm tra giá và điều kiện ưu đãi trước khi thanh toán.": "© 2026 CinBase — powered by CINAI.TV OS. All rights reserved. · Pro at USD 25/month. Check pricing and offer terms before paying.",
  "Tư vấn gói CinAI Pro": "CinAI Pro guidance",
  "Chia sẻ mục tiêu của bạn để được hướng dẫn chọn workflow và tìm hiểu gói Pro.": "Share your goals for help choosing workflows and understanding Pro.",
  "Nhận tư vấn gói Pro": "Get Pro guidance",
  "Ưu đãi CinAI Pro": "CinAI Pro offer",
  "Tặng voucher giảm 50%": "Get a 50% off voucher",
  "Gói CinAI Pro 25 USD/tháng. Chương trình giới hạn 100 voucher; kiểm tra điều kiện áp dụng khi đăng ký.": "CinAI Pro at USD 25/month. Limited to 100 vouchers; check terms when signing up.",
  "Xem quyền lợi gói Pro →": "See Pro benefits →",
  "2 model": "2 models",
  "500 workflow": "500 workflows",
  "4.000+ skill": "4,000+ skills"
};

  // aria-label preview workflow (mẫu lặp) → dịch động theo pattern
  const DICT = { en: EN };

  function detect() {
    const stored = localStorage.getItem(STORE);
    if (stored && SUPPORTED.includes(stored)) return Promise.resolve(stored);
    if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return Promise.resolve('vi');
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
    // ưu tiên đặt cạnh CTA trong header; nếu không có thì nổi góc dưới trái
    const host = document.querySelector('[data-header-actions]');
    if (host) host.insertBefore(wrap, host.firstChild);
    else { wrap.classList.add('lang-floating'); document.body.appendChild(wrap); }
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
