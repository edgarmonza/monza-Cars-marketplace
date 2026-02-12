#!/usr/bin/env python3
"""Wave 22: 30 more cars - Subaru, Mitsubishi, Mazda, More European Exotics"""

import os
import urllib.request
import time
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
CARS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "cars")

CARS_TO_DOWNLOAD = {
    # ─── SUBARU (5 cars) ───
    "subaru-impreza-22b-sti.jpg": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    "subaru-impreza-wrx-sti-s208.jpg": "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&q=80",
    "subaru-brz-sti-sport.jpg": "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=80",
    "subaru-legacy-rs.jpg": "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=1200&q=80",
    "subaru-impreza-555.jpg": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",

    # ─── MITSUBISHI (5 cars) ───
    "mitsubishi-lancer-evo-vi-tme.jpg": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    "mitsubishi-lancer-evo-ix-mr.jpg": "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=1200&q=80",
    "mitsubishi-3000gt-vr4.jpg": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
    "mitsubishi-gto-twin-turbo.jpg": "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
    "mitsubishi-lancer-evo-fq400.jpg": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",

    # ─── MAZDA (6 cars) ───
    "mazda-rx7-fd-spirit-r.jpg": "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80",
    "mazda-rx7-fd-bathurst.jpg": "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=1200&q=80",
    "mazda-cosmo-110s.jpg": "https://images.unsplash.com/photo-1607853554439-0f34e9f99f30?w=1200&q=80",
    "mazda-787b-lemans.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",
    "mazda-rx7-fc-turbo-ii.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
    "mazda-rx3-savanna.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",

    # ─── CLASSIC FERRARI (7 cars) ───
    "ferrari-250-gto-series-ii.jpg": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80",
    "ferrari-250-lusso.jpg": "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=1200&q=80",
    "ferrari-275-gtb4.jpg": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=80",
    "ferrari-365-gtb4-daytona.jpg": "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
    "ferrari-512-bbi.jpg": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
    "ferrari-308-gts-qv.jpg": "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80",
    "ferrari-330-p4.jpg": "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=1200&q=80",

    # ─── CLASSIC LAMBORGHINI (7 cars) ───
    "lamborghini-miura-sv-v2.jpg": "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=1200&q=80",
    "lamborghini-countach-lp500s.jpg": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
    "lamborghini-diablo-se30.jpg": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
    "lamborghini-lm002-v2.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
    "lamborghini-jalpa.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",
    "lamborghini-espada-series-iii.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",
    "lamborghini-islero-s.jpg": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80",
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
    print(f"Wave 22: Downloading {len(CARS_TO_DOWNLOAD)} car images...")
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
