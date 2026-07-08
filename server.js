// Standalone static server for the Double Digit WEBSITE prototype (separate from the app).
// HTTP Range support is required for <img>/large-asset delivery in Safari.
const http = require('http'), fs = require('fs'), pa = require('path');
const ROOT = __dirname;
const PORT = 4614;
const MIME = {
  '.html':'text/html', '.css':'text/css', '.js':'text/javascript',
  '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp',
  '.mp4':'video/mp4', '.webm':'video/webm', '.woff2':'font/woff2'
};

http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/') u = '/index.html';
  const fp = pa.normalize(pa.join(ROOT, u));
  if (!fp.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }

  fs.stat(fp, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end('not found'); }
    const type = MIME[pa.extname(fp).toLowerCase()] || 'application/octet-stream';
    const range = req.headers.range;
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
      let start = m[1] ? parseInt(m[1], 10) : 0;
      let end   = m[2] ? parseInt(m[2], 10) : st.size - 1;
      if (isNaN(start)) start = 0;
      if (isNaN(end) || end > st.size - 1) end = st.size - 1;
      if (start > end || start >= st.size) {
        res.writeHead(416, { 'Content-Range': `bytes */${st.size}` });
        return res.end();
      }
      res.writeHead(206, {
        'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${st.size}`,
        'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Cache-Control': 'no-cache'
      });
      fs.createReadStream(fp, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Type': type, 'Content-Length': st.size,
        'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache'
      });
      fs.createReadStream(fp).pipe(res);
    }
  });
}).listen(PORT, '127.0.0.1', () => console.log(`Double Digit website V2 on http://127.0.0.1:${PORT}`));
