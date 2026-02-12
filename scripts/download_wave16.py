#!/usr/bin/env python3
"""Wave 16: 30 more cars - Bugatti, McLaren, Aston Martin, SSC, Czinger"""

import os
import urllib.request
import time
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
CARS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "cars")

CARS_TO_DOWNLOAD = {
    # ─── BUGATTI (6 cars) ───
    "bugatti-chiron-pur-sport.jpg": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    "bugatti-chiron-super-sport.jpg": "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&q=80",
    "bugatti-divo.jpg": "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=80",
    "bugatti-centodieci.jpg": "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=1200&q=80",
    "bugatti-la-voiture-noire.jpg": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
    "bugatti-bolide.jpg": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",

    # ─── MCLAREN (8 cars) ───
    "mclaren-speedtail.jpg": "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=1200&q=80",
    "mclaren-elva.jpg": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
    "mclaren-senna-gtr.jpg": "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
    "mclaren-p1-gtr.jpg": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",
    "mclaren-sabre.jpg": "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80",
    "mclaren-765lt-spider.jpg": "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=1200&q=80",
    "mclaren-artura-spider.jpg": "https://images.unsplash.com/photo-1607853554439-0f34e9f99f30?w=1200&q=80",
    "mclaren-solus-gt.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",

    # ─── ASTON MARTIN (8 cars) ───
    "aston-martin-valkyrie.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
    "aston-martin-valkyrie-amr.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",
    "aston-martin-valhalla.jpg": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80",
    "aston-martin-vulcan.jpg": "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=1200&q=80",
    "aston-martin-one77.jpg": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=80",
    "aston-martin-victor.jpg": "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
    "aston-martin-v12-speedster.jpg": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
    "aston-martin-dbr22.jpg": "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80",

    # ─── SSC (3 cars) ───
    "ssc-tuatara.jpg": "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=1200&q=80",
    "ssc-ultimate-aero.jpg": "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=1200&q=80",
    "ssc-tuatara-aggressor.jpg": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",

    # ─── CZINGER (3 cars) ───
    "czinger-21c.jpg": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
    "czinger-21c-v-max.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",

    # ─── HISPANO SUIZA (2 cars) ───
    "hispano-suiza-carmen.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",
    "hispano-suiza-carmen-boulogne.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",
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
    print(f"Wave 16: Downloading {len(CARS_TO_DOWNLOAD)} car images...")
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
