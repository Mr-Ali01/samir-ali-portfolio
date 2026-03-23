const http = require('http');
const db = require('./src/config/db'); // Load MySQL connection pool
const serveStaticFile = require('./src/utils/serveStatic'); // Native Static UI Server
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Central Request Handler utilizing Node's core HTTP module natively
const requestHandler = async (req, res) => {
  // 1. Establish strict CORS & Content-Type Headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight active OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 2. Core Routing Setup
  // We will parse URLs manually avoiding Express.js dependencies
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  // Example API Status / DB Test Route
  if (path === '/api/ping' && req.method === 'GET') {
    try {
      // Test the database pool asynchronously
      const [rows] = await db.query('SELECT 1 + 1 AS solution');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        message: '🟢 Server is running natively (No Frameworks!). Database connection is active.', 
        db_solution: rows[0].solution 
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: false, 
        error: 'Database connection failed', 
        details: error.message 
      }));
    }
    return;
  }

  // 3. Serve Frontend / Static Assets (e.g. index.html, style.css, JS files) natively
  if (req.method === 'GET' && !path.startsWith('/api')) {
    return serveStaticFile(res, path);
  }

  // Default 404 Fallback for unmapped API routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, message: 'API Route Not Found' }));
};

// Start the HTTP Server natively
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`🚀 Native HTTP Server listening on http://localhost:${PORT}`);
});
