# 📺 live-programm — расписание ТВ-программ как TikTok 🎯

> Самый крутой способ смотреть, что сейчас в эфире: робот сам ищет расписание, плеер пускает эфир, а UI — в стиле TikTok.

✨ **Особенности:**
- 🤖 Автоматический сбор расписания: GitHub Actions запускает скрапер **каждые 3 часа**
- 📺 Плеер `cdnplayerjs` — лёгкий, быстрый, с поддержкой `.m3u8`
- 🎥 Интерфейс: вертикальный скролл, как в TikTok — лайки, стоп, всплытие информации
- 🌍 Источники: [oinktechllc/livem3u](https://github.com/oinktechllc/livem3u) + ручные источники (CTC, 1TV и т.д.)

## 🧪 Как работает

1. Скрапер (`scraper/scraper.py`) берёт `.m3u8` плейлист из:
   - [oinktechllc/livem3u](https://github.com/oinktechllc/livem3u)
   - [oinktechltd/rulive](https://github.com/oinktechltd/rulive)
2. Ищет расписание на `ctc.ru`, `1tv.ru`, `rentv.ru`
3. Сохраняет в `data/schedule.json`: текущая программа, есть ли эфир, URL.
4. Frontend (React) рендерит карточки — как TikTok видео.
5. Клик → запуск `cdnplayerjs`.

## 🚀 Запуск локально

```bash
# Сначала собери расписание (нужен Python 3.10+)
cd scraper && pip install -r requirements.txt
python scraper.py

# Запусти фронтенд
cd .. && npm install && npm run dev
