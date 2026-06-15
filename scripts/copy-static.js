#!/usr/bin/env node
/**
 * Build script для Vercel / Tatnet / Onrender
 * Копирует статические файлы в public/
 * EPG данные берёт из data/ (если есть) или оставляет пустыми
 */
const fs   = require("fs");
const path = require("path");

const ROOT   = __dirname.replace(/[\\/]scripts$/, "");
const PUBLIC = path.join(ROOT, "public");
const DATA   = path.join(ROOT, "data");

// Создаём папки
[PUBLIC, path.join(PUBLIC, "data")].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Читаем EPG данные если есть
let epgData = null;
const schedPath = path.join(DATA, "schedule.json");
if (fs.existsSync(schedPath)) {
  try {
    epgData = JSON.parse(fs.readFileSync(schedPath, "utf8"));
    const ch = Object.keys(epgData.channels || {}).length;
    const pr = Object.values(epgData.schedule || {}).reduce((a, v) => a + v.length, 0);
    console.log(`📊 EPG: ${ch} каналов, ${pr} передач`);
  } catch (e) {
    console.warn("⚠️  schedule.json повреждён:", e.message);
  }
}

// Вставляем данные в HTML
function injectAndCopy(src, dst) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  ${path.basename(src)} не найден`);
    return;
  }
  let html = fs.readFileSync(src, "utf8");
  if (epgData) {
    const snippet = `<script>window.__EPG_DATA__=${JSON.stringify(epgData)};</script>`;
    html = html.replace("</head>", snippet + "\n</head>");
  }
  fs.writeFileSync(dst, html, "utf8");
  console.log(`✅ ${path.basename(dst)}`);
}

// HTML файлы
injectAndCopy(path.join(ROOT, "index.html"),  path.join(PUBLIC, "index.html"));
injectAndCopy(path.join(ROOT, "embed.html"),  path.join(PUBLIC, "embed.html"));
injectAndCopy(path.join(ROOT, "player.html"), path.join(PUBLIC, "player.html"));

// Данные
if (fs.existsSync(DATA)) {
  for (const f of fs.readdirSync(DATA)) {
    if (f.endsWith(".json") || f.endsWith(".xml")) {
      fs.copyFileSync(path.join(DATA, f), path.join(PUBLIC, "data", f));
      console.log(`✅ data/${f}`);
    }
  }
}

console.log("\n🚀 Build готов → public/");
