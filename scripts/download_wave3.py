#!/usr/bin/env python3
"""Download wave 3 car images from Unsplash - 20 more top brand vehicles"""

import os
import urllib.request
import time
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

CARS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "cars")

# Wave 3: 20 more for top brands
CARS_TO_DOWNLOAD = {
    # ─── PORSCHE (5 more) ───
    "porsche-turbo-s.jpg": "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=1200&q=80",
    "porsche-550-spyder.jpg": "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&q=80",
    "porsche-carrera-rs27.jpg": "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=80",
    "porsche-356-speedster.jpg": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    "porsche-911-r-2016.jpg": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",

    # ─── FERRARI (5 more) ───
    "ferrari-monza-sp2.jpg": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    "ferrari-gtc4lusso.jpg": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80",
    "ferrari-512tr.jpg": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
    "ferrari-daytona.jpg": "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=1200&q=80",
    "ferrari-250-california.jpg": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=80",

    # ─── LAMBORGHINI (5 more) ───
    "lambo-veneno.jpg": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
    "lambo-huracan-evo.jpg": "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80",
    "lambo-lm002.jpg": "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
    "lambo-espada.jpg": "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=1200&q=80",
    "lambo-jarama.jpg": "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=1200&q=80",

    # ─── MERCEDES-BENZ (5 more) ───
    "mercedes-sl-pagoda.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
    "mercedes-clk-black.jpg": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
    "mercedes-sls-roadster.jpg": "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=1200&q=80",
    "mercedes-560sec.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",
    "mercedes-c63-bs.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",
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
    print(f"Wave 3: Downloading {len(CARS_TO_DOWNLOAD)} car images...")
    print(f"Saving to: {CARS_DIR}\n")
    os.makedirs(CARS_DIR, exist_ok=True)

    success = failed = 0
    for filename, url in CARS_TO_DOWNLOAD.items():
        filepath = os.path.join(CARS_DIR, filename)
        if os.path.exists(filepath):
            print(f"✓ {filename} (already exists)")
            success += 1
            continue
        print(f"⬇ Downloading {filename}...", end=" ", flush=True)
        if download_image(url, filepath):
            print("✓")
            success += 1
        else:
            print("✗")
            failed += 1
        time.sleep(0.5)
    print(f"\nDone! Success: {success}, Failed: {failed}")

if __name__ == "__main__":
    main()
