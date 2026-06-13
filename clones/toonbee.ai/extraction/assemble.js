// Assemble final index.html from body-extracted.html + clean head + clean scripts
const fs = require('fs');
const path = require('path');
const body = fs.readFileSync(path.join(__dirname, 'body-extracted.html'), 'utf8');

const head = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>ToonBee — Unlock AI-powered Cartoon Video Creation (Clone)</title>
  <meta name="description" content="Clone học tập — landing ToonBee. Tạo video hoạt hình AI chỉ với một kịch bản." />
  <link rel="shortcut icon" href="assets/images/favicon.webp" />

  <!-- Vendor CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" />
  <link rel="stylesheet" href="styles/swiper.min.css" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Syne:wght@400..800&family=Zalando+Sans+SemiExpanded:ital,wght@0,200..900;1,200..900&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Gochi+Hand&family=Wendy+One&family=Noto+Color+Emoji&display=swap" rel="stylesheet" />

  <!-- Design tokens + base site CSS + clone overrides -->
  <link rel="stylesheet" href="styles/tokens.css" />
  <link rel="stylesheet" href="styles/style.css" />
  <link rel="stylesheet" href="styles/checkout.css" />
  <link rel="stylesheet" href="styles/global.css" />

  <style>
    .bigleap-video-1, .my-video, .clip-video { width: 100%; height: auto; display: block; object-fit: cover; }
    .glow { box-shadow: 0 0 12px 2px #ffe06688, 0 0 4px 1px #ffd70066; animation: pulse-glow 1.4s infinite alternate; }
    @keyframes pulse-glow {
      0% { box-shadow: 0 0 7px 1px #ffe06666, 0 0 2px 0.5px #ffd70044; }
      100% { box-shadow: 0 0 15px 4px #ffe06699, 0 0 8px 1.5px #ffd70055; }
    }
  </style>

  <script src="assets/js/jquery.min.js"></script>
</head>
<body>
`;

const tail = `
  <!-- Vendor JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
  <script defer src="assets/js/swiper.min.js"></script>
  <script src="https://player.vimeo.com/api/player.js"></script>
  <!-- Clone behaviours (accordion, swiper, lazy-load, countdown, video controls) -->
  <script defer src="scripts/main.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '..', 'index.html'), head + body + tail, 'utf8');
console.log('index.html written, total', (head + body + tail).length, 'bytes');
