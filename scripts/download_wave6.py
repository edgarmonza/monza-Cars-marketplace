#!/usr/bin/env python3
"""Wave 6: 30 more cars - More Ferrari, Lamborghini, Porsche"""

import os
import urllib.request
import time
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
CARS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "cars")

CARS_TO_DOWNLOAD = {
    # ─── FERRARI (10 more) ───
    "ferrari-sf90-stradale.jpg": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80",
    "ferrari-f12-tdf.jpg": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
    "ferrari-sp38.jpg": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    "ferrari-458-spider.jpg": "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=1200&q=80",
    "ferrari-550-barchetta.jpg": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=80",
    "ferrari-575m-maranello.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
    "ferrari-288-gto.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",
    "ferrari-250-swb.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",
    "ferrari-dino-246.jpg": "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
    "ferrari-365-gtc4.jpg": "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&q=80",

    # ─── LAMBORGHINI (10 more) ───
    "lambo-diablo-se30.jpg": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
    "lambo-huracan-sterrato.jpg": "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80",
    "lambo-silhouette.jpg": "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=1200&q=80",
    "lambo-aventador-ultimae.jpg": "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=1200&q=80",
    "lambo-huracan-performante.jpg": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
    "lambo-400gt.jpg": "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=80",
    "lambo-jalpa.jpg": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
    "lambo-terzo-millennio.jpg": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    "lambo-egoista.jpg": "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=1200&q=80",
    "lambo-revuelto.jpg": "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=1200&q=80",

    # ─── PORSCHE (10 more) ───
    "porsche-968-cs.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
    "porsche-914-6.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",
    "porsche-997-gt2-rs.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",
    "porsche-991-r.jpg": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80",
    "porsche-918-weissach.jpg": "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=1200&q=80",
    "porsche-911-targa-4s.jpg": "https://images.unsplash.com/media/photo-1503736334956-4c8f8e92946d?w=1200&q=80",
    "porsche-macan-turbo.jpg": "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
    "porsche-928-s4.jpg": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
    "porsche-959-sport.jpg": "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80",
    "porsche-carrera-gt-seal.jpg": "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=1200&q=80",
}

def download_image(url, filepath):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            with open(filepath, 'wb') as f:
                f.write(response.read())
            return True
    except Exception as e:
        print(f"  Error: {e}")
        return False

def main():
    print(f"Wave 6: Downloading {len(CARS_TO_DOWNLOAD)} car images...")
    os.makedirs(CARS_DIR, exist_ok=True)
    success = failed = 0
    for filename, url in CARS_TO_DOWNLOAD.items():
        filepath = os.path.join(CARS_DIR, filename)
        if os.path.exists(filepath):
            print(f"✓ {filename} (exists)")
            success += 1
            continue
        print(f"⬇ {filename}...", end=" ", flush=True)
        if download_image(url, filepath):
            print("✓")
            success += 1
        else:
            print("✗")
            failed += 1
        time.sleep(0.3)
    print(f"\nDone! Success: {success}, Failed: {failed}")

if __name__ == "__main__":
    main()
