#!/usr/bin/env python3
"""Download car images from Unsplash"""

import os
import urllib.request
import time
import ssl

# Disable SSL verification for simplicity
ssl._create_default_https_context = ssl._create_unverified_context

CARS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "cars")

# Direct Unsplash URLs for car images (using source.unsplash.com)
# These are reliable, free-to-use images
CARS_TO_DOWNLOAD = {
    # Porsche
    "porsche-911r.jpg": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",  # Porsche 911
    "porsche-928-gts.jpg": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",  # Classic Porsche
    "porsche-964-rs.jpg": "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=80",  # Porsche 911
    "porsche-997-gt3rs-4.jpg": "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=1200&q=80",  # Porsche GT3
    "porsche-992-gt3.jpg": "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=1200&q=80",  # Modern Porsche

    # Ferrari
    "ferrari-f355.jpg": "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=80",  # Red Ferrari
    "ferrari-550.jpg": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",  # Ferrari front
    "ferrari-812.jpg": "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=1200&q=80",  # Modern Ferrari
    "ferrari-roma.jpg": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",  # Ferrari Roma style
    "ferrari-challenge-stradale.jpg": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=80",  # Ferrari 360

    # Lamborghini
    "lambo-gallardo.jpg": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",  # Lamborghini
    "lambo-murcielago.jpg": "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&q=80",  # Lambo side
    "lambo-reventon.jpg": "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=1200&q=80",  # Angular Lambo
    "lambo-urus.jpg": "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",  # Lambo Urus SUV
    "lambo-sian.jpg": "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=1200&q=80",  # Modern Lambo

    # Mercedes
    "mercedes-slr.jpg": "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=1200&q=80",  # Mercedes sports
    "mercedes-amg-one.jpg": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",  # Mercedes AMG
    "mercedes-g63.jpg": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=1200&q=80",  # Mercedes G-Class
    "mercedes-600-pullman.jpg": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",  # Classic Mercedes
    "mercedes-sl55.jpg": "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80",  # Mercedes SL
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
    print(f"Downloading {len(CARS_TO_DOWNLOAD)} car images...")
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
