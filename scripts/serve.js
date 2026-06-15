#!/usr/bin/env node
/**
 * Минимальный статический сервер для Onrender / Tatnet
 * Отдаёт файлы из public/ (или из корня если public/ нет)
 */
const http = require("http");
const fs   = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname.replace(/[\\/]scripts$/, "");

// Папка для раздачи: сначала public/, потом корень
const SERVE = fs.existsSync(path.join(ROOT, "public"))
  ? path.join(ROOT, "public")
  : ROOT;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml":  "application/xml; charset=utf-8",
  ".m3u":  "application/x-mpegurl",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
};

const server = http.createServer((req, res) => {
  // CORS для embed и data
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "no-cache");

  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  let urlPath = req.url.split("?")[0];
  if (urlPath === "/" || urlPath === "") urlPath = "/index.html";

  // Безопасность — не даём выйти за пределы SERVE
  const filePath = path.resolve(SERVE, "." + urlPath);
  if (!filePath.startsWith(SERVE)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }

  // Если папка — ищем index.html
  let target = filePath;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    target = path.join(target, "index.html");
  }

  if (!fs.existsSync(target)) {
    // SPA fallback — отдаём index.html
    target = path.join(SERVE, "index.html");
  }

  const ext  = path.extname(target).toLowerCase();
  const mime = MIME[ext] || "application/octet-stream";

  try {
    const data = fs.readFileSync(target);
    res.writeHead(200, { "Content-Type": mime, "Content-Length": data.length });
    res.end(data);
  } catch (e) {
    res.writeHead(500); res.end("Server Error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n📺 LiveПрограмма запущена`);
  console.log(`🌐 http://0.0.0.0:${PORT}`);
  console.log(`📁 Раздаём из: ${SERVE}\n`);
});
