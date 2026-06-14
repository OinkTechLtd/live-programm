import requests
from bs4 import BeautifulSoup

def fetch(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        print(f"[ERROR] Failed to fetch {url}: {e}")
        return None

def parse_ctc_now(html):
    soup = BeautifulSoup(html, "lxml")
    current = soup.select_one(".broadcasting .program-title, .current-program-title")
    return current.get_text(strip=True) if current else "Расписание недоступно"

def parse_1tv_now(html):
    soup = BeautifulSoup(html, "lxml")
    current = soup.select_one(".current-broadcast__title, .program-title")
    return current.get_text(strip=True) if current else "Программа неизвестна"
