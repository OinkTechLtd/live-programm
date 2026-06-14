# backend/m3u_collector.py
import json
import requests
from datetime import datetime

# Ссылки на твои репозитории с плейлистами
M3U_SOURCES = {
    "livem3u": "https://raw.githubusercontent.com/OinkTechLLC/livem3u/main/data/playlist.m3u",
    "rulive": "https://raw.githubusercontent.com/OinkTechLtd/rulive/main/data/playlist.m3u"
}

def fetch_m3u_playlists():
    """Собирает M3U плейлисты из указанных источников."""
    all_playlists = {}
    for name, url in M3U_SOURCES.items():
        try:
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                all_playlists[name] = response.text
                print(f"✅ Успешно загружен {name}")
            else:
                print(f"❌ Ошибка {response.status_code} при загрузке {name}")
        except Exception as e:
            print(f"❌ Исключение при загрузке {name}: {e}")
    return all_playlists

def save_playlists(playlists):
    """Сохраняет плейлисты в JSON."""
    timestamp = datetime.now().isoformat()
    data = {
        "last_updated": timestamp,
        "sources": playlists
    }
    with open("data/playlists/raw_m3u.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"💾 Плейлисты сохранены в data/playlists/raw_m3u.json")

if __name__ == "__main__":
    print("🚀 Запуск сбора M3U плейлистов...")
    playlists = fetch_m3u_playlists()
    if playlists:
        save_playlists(playlists)
