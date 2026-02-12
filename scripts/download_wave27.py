#!/usr/bin/env python3
"""Wave 27: 30 more Japanese cars - Subaru WRX, Infiniti, Isuzu, Daihatsu, More Nissan/Toyota"""

import os
import urllib.request
import time
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
CARS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "cars")

CARS_TO_DOWNLOAD = {
    # ─── SUBARU (8 cars) ───
    "subaru-wrx-sti-s209.jpg": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    "subaru-impreza-wrx-gc8.jpg": "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&q=80",
    "subaru-svx.jpg": "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=80",
    "subaru-alcyone-vx.jpg": "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=1200&q=80",
    "subaru-360.jpg": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
    "subaru-sambar-dias.jpg": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    "subaru-wrx-sti-s207.jpg": "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=1200&q=80",
    "subaru-forester-sti.jpg": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",

    # ─── INFINITI (6 cars) ───
    "infiniti-q45-v2.jpg": "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
    "infiniti-g35-coupe.jpg": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",
    "infiniti-m45.jpg": "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80",
    "infiniti-fx45.jpg": "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=1200&q=80",
    "nissan-cima-y33.jpg": "https://images.unsplash.com/photo-1607853554439-0f34e9f99f30?w=1200&q=80",
    "nissan-president-hg50.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",

    # ─── MORE NISSAN SPECIAL (8 cars) ───
    "nissan-180sx-type-x.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
    "nissan-240sx-se.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",
    "nissan-cefiro-a31.jpg": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80",
    "nissan-laurel-c35.jpg": "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=1200&q=80",
    "nissan-gloria-y34.jpg": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=80",
    "nissan-cedric-y34.jpg": "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
    "nissan-sunny-gti-r.jpg": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
    "nissan-bluebird-sss.jpg": "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80",

    # ─── ISUZU/DAIHATSU/OTHER (8 cars) ───
    "isuzu-117-coupe.jpg": "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=1200&q=80",
    "isuzu-piazza-turbo.jpg": "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=1200&q=80",
    "isuzu-vehicross.jpg": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
    "daihatsu-copen.jpg": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
    "daihatsu-midget-ii.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
    "autozam-az1.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",
    "tommykaira-zz-ii.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",
    "aspark-owl-v2.jpg": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80",
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
    print(f"Wave 27: Downloading {len(CARS_TO_DOWNLOAD)} Japanese car images...")
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
