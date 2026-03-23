const fs = require('fs');
const path = require('path');

/**
 * A native Node.js statically serving utility designed to replace `express.static()`
 * Automatically determines file types (MIME mappings) based on extension.
 */
const serveStaticFile = (res, urlPath) => {
  // Translate the URL path to the actual "public/" file path on the server
  // If the path is just '/' serve the index.html fallback
  let parsedPath = urlPath === '/' ? '/index.html' : urlPath;
  const filePath = path.join(process.cwd(), 'public', parsedPath);
  
  // Extract extension to map valid MIME Types natively
  const extname = String(path.extname(filePath)).toLowerCase();
  
  const mimeTypes = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf':  'font/ttf'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Read file from disk asynchronously utilizing streams or callbacks.
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist within /public (Like navigating manually to a bad UI route)
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`<h1>404: The page or file you are searching for does not exist on this server.</h1>`, 'utf-8');
      } else {
        // E.g., permissions error 500
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Return file natively to browser
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
};

module.exports = serveStaticFile;
