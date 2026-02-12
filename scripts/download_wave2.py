#!/usr/bin/env python3
"""Download wave 2 car images from Unsplash - 20 more top brand vehicles"""

import os
import urllib.request
import time
import ssl

# Disable SSL verification for simplicity
ssl._create_default_https_context = ssl._create_unverified_context

CARS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "cars")

# Wave 2 cars: 20 more for top brands
CARS_TO_DOWNLOAD = {
    # ─── PORSCHE (5 more) ───
    "porsche-sport-classic.jpg": "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&q=80",  # Classic 911 style
    "porsche-boxster-spyder.jpg": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",  # Convertible Porsche
    "porsche-cayman-gt4rs.jpg": "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=1200&q=80",  # Modern track Porsche
    "porsche-gt3-touring.jpg": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",  # 911 GT3
    "porsche-904-gts.jpg": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",  # Vintage Porsche

    # ─── FERRARI (5 more) ───
    "ferrari-portofino.jpg": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",  # Modern Ferrari GT
    "ferrari-california.jpg": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80",  # Red convertible
    "ferrari-488-pista.jpg": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",  # Yellow Ferrari
    "ferrari-f8-tributo.jpg": "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=1200&q=80",  # Modern Ferrari
    "ferrari-330gtc.jpg": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=80",  # Classic Ferrari

    # ─── LAMBORGHINI (5 more) ───
    "lambo-aventador-lp700.jpg": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",  # White Lambo
    "lambo-huracan-sto.jpg": "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80",  # Orange Lambo
    "lambo-huracan-tecnica.jpg": "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=1200&q=80",  # Blue Lambo
    "lambo-centenario.jpg": "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=1200&q=80",  # Special edition
    "lambo-islero.jpg": "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",  # Vintage style

    # ─── MERCEDES-BENZ (5 more) ───
    "mercedes-sl65-black.jpg": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",  # AMG Black
    "mercedes-s63-coupe.jpg": "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=1200&q=80",  # Luxury coupe
    "mercedes-280se-cab.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",  # Classic cabrio
    "mercedes-g65-amg.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",  # V12 G-Wagon
    "mercedes-190e-evo2.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",  # DTM homologation
}

def download_image(url, filepath):
    """Download image from URL to filepath"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read()
            with open(filepath, 'wb') as f:
                f.write(data)
            return True
    except Exception as e:
        print(f"  Error: {e}")
        return False

def main():
    print(f"Wave 2: Downloading {len(CARS_TO_DOWNLOAD)} car images...")
    print(f"Saving to: {CARS_DIR}\n")

    os.makedirs(CARS_DIR, exist_ok=True)

    success = 0
    failed = 0

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

        time.sleep(0.5)  # Be nice to the server

    print(f"\nDone! Success: {success}, Failed: {failed}")

if __name__ == "__main__":
    main()
