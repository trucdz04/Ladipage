// Transform source page.html -> clean static clone index.html
// - keep body content (banner .. </footer>)
// - strip tracking / 3rd-party / checkout popup
// - rewrite asset paths to local
// - point CSS/JS to local + our main.js
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, 'source', 'page.html');
const OUT = path.join(__dirname, '..', 'index.html');

let html = fs.readFileSync(SRC, 'utf8');

// 1) Extract body content: from first `<div class="banner` to the closing `</footer>`
const startIdx = html.indexOf('<div class="banner');
const footerEnd = html.indexOf('</footer>');
if (startIdx < 0 || footerEnd < 0) throw new Error('markers not found');
let body = html.slice(startIdx, footerEnd + '</footer>'.length);

// 2) Rewrite asset paths
const CF = 'https://del3o5ypqgi9j.cloudfront.net/toonbee/videosfe/';
body = body
  .replace(/(["'(])\.\/images\//g, '$1assets/images/')      // ./images/
  .replace(/(["'(])images\//g, '$1assets/images/')          // images/
  .replace(/(["'(])\.\.\/images\//g, '$1assets/images/')    // ../images/
  .replace(new RegExp(CF.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 'assets/media/'); // cloudfront -> local media

// 3) Neuter checkout triggers: any href/data that opens the FastSpring popup -> #buynow
//    The buy buttons use class getlink / data-popup / href to popup; point them at the pricing table.
body = body.replace(/href="[^"]*paymentpopup[^"]*"/gi, 'href="#buynow"');

// 4) Remove any leftover inline on* handlers that reference fastspring/popup (defensive)
body = body.replace(/data-popup-[a-z-]+="[^"]*"/gi, '');

fs.writeFileSync(path.join(__dirname, 'body-extracted.html'), body, 'utf8');
console.log('body length', body.length);
console.log('done -> body-extracted.html');
