#!/usr/bin/env python3
"""
Сборщик статики — для GitHub Actions
Собирает в docs/ (GitHub Pages) и public/ (Vercel/Tatnet/Onrender)
"""
import json, shutil, sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
DATA = ROOT / "data"

epg_data = {}
sched = DATA / "schedule.json"
if sched.exists():
    epg_data = json.loads(sched.read_text("utf-8"))
    ch = len(epg_data.get("channels", {}))
    pr = sum(len(v) for v in epg_data.get("schedule", {}).values())
    print(f"📊 EPG: {ch} каналов, {pr} передач")

def inject(html_src, dst):
    src = ROOT / html_src
    if not src.exists():
        print(f"  ⚠️  {html_src} не найден")
        return
    html = src.read_text("utf-8")
    if epg_data:
        snippet = f"<script>window.__EPG_DATA__={json.dumps(epg_data, ensure_ascii=False, separators=(',',':'))};</script>"
        html = html.replace("</head>", snippet + "\n</head>", 1)
    Path(dst).write_text(html, "utf-8")
    print(f"  ✅ {Path(dst).name}")

def cp(src, dst):
    s = Path(src)
    if s.exists():
        shutil.copy(s, dst)
        print(f"  ✅ {s.name}")

# Собираем в оба места
for out_dir in ["docs", "public"]:
    d = ROOT / out_dir
    d.mkdir(exist_ok=True)
    (d / "data").mkdir(exist_ok=True)
    print(f"\n📁 → {out_dir}/")
    inject("index.html",  d / "index.html")
    inject("embed.html",  d / "embed.html")
    cp(ROOT / "player.html", d / "player.html")
    # Данные
    if DATA.exists():
        for f in DATA.glob("*.json"):
            shutil.copy(f, d / "data" / f.name)
            print(f"  ✅ data/{f.name}")
        for f in DATA.glob("*.xml"):
            shutil.copy(f, d / "data" / f.name)
            print(f"  ✅ data/{f.name}")

print("\n✅ Сборка завершена → docs/ и public/")
