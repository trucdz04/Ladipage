const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const types={'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.gif':'image/gif','.jpg':'image/jpeg','.mp4':'video/mp4','.webm':'video/webm','.mp3':'audio/mpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]); if(p==='/')p='/index.html';
  const fp=path.join(root,p);
  fs.readFile(fp,(e,d)=>{ if(e){res.writeHead(404);res.end('404 '+p);return;} res.writeHead(200,{'Content-Type':types[path.extname(fp)]||'application/octet-stream'});res.end(d); });
}).listen(8099,()=>console.log('serving on 8099'));
