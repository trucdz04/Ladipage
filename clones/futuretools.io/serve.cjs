const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + (urlPath === '/' ? '/index.html' : urlPath));
  if (!file.startsWith(root + path.sep) && file !== path.join(root,'index.html')) { res.writeHead(403).end(); return; }
  fs.readFile(file,(error,data)=>{
    if(error){res.writeHead(404).end('Not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream'}).end(data);
  });
}).listen(8765,'127.0.0.1',()=>console.log('http://127.0.0.1:8765'));
