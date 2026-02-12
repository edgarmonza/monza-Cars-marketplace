#!/usr/bin/env python3
"""Wave 26: 30 Japanese cars - Datsun, More Nissan Skyline, Toyota, Mazda, Mitsubishi"""

import os
import urllib.request
import time
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
CARS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "cars")

CARS_TO_DOWNLOAD = {
    # ─── DATSUN/NISSAN CLASSICS (10 cars) ───
    "datsun-240z-v2.jpg": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    "datsun-280z.jpg": "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&q=80",
    "nissan-skyline-hakosuka-gtr.jpg": "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=80",
    "nissan-skyline-kenmeri-gtr.jpg": "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=1200&q=80",
    "datsun-510-bluebird.jpg": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
    "nissan-300zx-z32-twin-turbo.jpg": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    "nissan-pulsar-gti-r.jpg": "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=1200&q=80",
    "nissan-stagea-260rs.jpg": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
    "nissan-leopard-f31.jpg": "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
    "nissan-prince-r380.jpg": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",

    # ─── MORE TOYOTA (10 cars) ───
    "toyota-mr2-sw20-turbo.jpg": "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80",
    "toyota-celica-gt-four-st205.jpg": "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=1200&q=80",
    "toyota-soarer-z30.jpg": "https://images.unsplash.com/photo-1607853554439-0f34e9f99f30?w=1200&q=80",
    "toyota-chaser-jzx100.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",
    "toyota-aristo-v300.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
    "toyota-sports-800.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",
    "toyota-land-cruiser-fj40.jpg": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80",
    "toyota-crown-athlete.jpg": "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=1200&q=80",
    "toyota-hilux-sr5.jpg": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=80",
    "toyota-ts050-hybrid.jpg": "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",

    # ─── MORE MAZDA/HONDA/MITSUBISHI (10 cars) ───
    "mazda-eunos-cosmo.jpg": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
    "mazda-rx8-spirit-r.jpg": "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80",
    "mazda-roadster-rf.jpg": "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=1200&q=80",
    "honda-nsx-r-gt.jpg": "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=1200&q=80",
    "honda-s660.jpg": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
    "honda-prelude-type-sh.jpg": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
    "mitsubishi-starion-esi-r.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
    "mitsubishi-fto-gp-version-r.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",
    "mitsubishi-pajero-evo.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",
    "suzuki-cappuccino.jpg": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80",
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
    print(f"Wave 26: Downloading {len(CARS_TO_DOWNLOAD)} Japanese car images...")
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
