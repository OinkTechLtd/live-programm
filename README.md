# 📺 LiveПрограмма

> Поисковой робот TV-расписания + веб-гид в стиле TikTok  
> OinkTech Ltd | FUN RUSSIA CRMP

![Actions](https://img.shields.io/badge/GitHub_Actions-каждые_3ч-blue?logo=github-actions)
![Python](https://img.shields.io/badge/Python-3.12-brightgreen?logo=python)
![Node](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Деплой

### Vercel (рекомендуется — бесплатно)

1. Форкни репо
2. Зайди на [vercel.com](https://vercel.com) → **New Project** → импортируй репо
3. Vercel сам увидит `vercel.json` — нажми **Deploy**
4. Готово ✅

> Build command: `node scripts/copy-static.js`  
> Output directory: `public`

---

### GitHub Pages (бесплатно)

1. `Settings → Pages → Deploy from branch → main / docs`
2. Запусти Actions вручную: `Actions → 🤖 EPG Robot → Run workflow`
3. Сайт: `https://ИМЯ.github.io/live-programm/`

---

### Onrender (бесплатно)

1. [render.com](https://render.com) → **New Web Service** → подключи репо
2. **Build:** `node scripts/copy-static.js`
3. **Start:** `node scripts/serve.js`
4. Готово ✅ (файл `render.yaml` уже настроен)

---

### Tatnet / Heroku-style

Используется `Procfile`:
```
web: node scripts/serve.js
```
Build перед стартом: `node scripts/copy-static.js`

---

## 🤖 Как работает робот

```
GitHub Actions (каждые 3 часа)
    │
    ├─ python scripts/epg_robot.py
    │   ├─ Шаг 1: публичные XMLTV (epg.one, epg.ottplay...)
    │   ├─ Шаг 2: API (tv.mail.ru, epg.best...)
    │   ├─ Шаг 3: авто-обнаружение новых каналов
    │   └─ Шаг 4: плейлисты OinkTech → stream_url
    │
    ├─ python scripts/build.py
    │   ├─ → docs/   (GitHub Pages)
    │   └─ → public/ (Vercel / Tatnet / Onrender)
    │
    └─ git commit & push
```

---

## 📁 Структура

```
live-programm/
├── .github/workflows/epg.yml   # Actions: каждые 3 часа
├── scripts/
│   ├── epg_robot.py            # 🤖 Python-робот
│   ├── build.py                # Сборка docs/ и public/
│   ├── copy-static.js          # Node.js build (Vercel)
│   └── serve.js                # Статический сервер (Onrender)
├── data/
│   ├── schedule.json           # EPG данные (авто)
│   └── epg.xml                 # XMLTV формат (авто)
├── public/                     # ← деплоится на Vercel/Tatnet
├── docs/                       # ← деплоится на GitHub Pages
├── index.html                  # TikTok-гид
├── embed.html                  # Виджет для вставки
├── player.html                 # Плеер
├── vercel.json                 # Vercel конфиг
├── render.yaml                 # Onrender конфиг
├── Procfile                    # Tatnet / Heroku
└── requirements.txt            # Python зависимости
```

---

## 🔗 Embed-виджет

Вставь канал с расписанием на любой сайт:

```html
<iframe
  src="https://ВАШ_САЙТ/embed.html?ch=perviy&app=https://ВАШ_САЙТ/"
  width="320" height="480"
  frameborder="0"
  allowfullscreen
  allow="autoplay; fullscreen"
  style="border-radius:12px"
></iframe>
```

В виджете автоматически появляется реклама **«Смотрите все каналы в LiveПрограмма»**.

---

## 📡 EPG для IPTV плееров

```
https://ВАШ_САЙТ/data/epg.xml
```

Подключай в TiviMate, OttPlayer, IPTV Smarters.

---

## 👤 OinkTech Ltd · FUN RUSSIA CRMP
