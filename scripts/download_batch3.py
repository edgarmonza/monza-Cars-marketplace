#!/usr/bin/env python3
"""Download images for cars 56-70 from Wikipedia API."""

import urllib.request
import urllib.parse
import json
import ssl
import time
import os

# SSL context
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Output directory
OUTPUT_DIR = "/Users/bavaraianecons/Desktop/monza lab/Quantum/Secret projects/Bit the web/Moonshap Bitcar/public/cars"

# New cars to download (image filename -> Wikipedia article)
NEW_CARS = {
    "porsche-gt3rs-4.jpg": "Porsche_911_GT3",
    "ferrari-360cs.jpg": "Ferrari_360_Challenge_Stradale",
    "toyota-2000gt.jpg": "Toyota_2000GT",
    "lancia-stratos.jpg": "Lancia_Stratos",
    "bmw-m1.jpg": "BMW_M1",
    "lamborghini-diablo.jpg": "Lamborghini_Diablo",
    "shelby-cobra.jpg": "Shelby_Cobra",
    "jaguar-xj220.jpg": "Jaguar_XJ220",
    "nissan-r34.jpg": "Nissan_Skyline_GT-R",
    "mercedes-clk-gtr.jpg": "Mercedes-Benz_CLK_GTR",
    "honda-nsx-r.jpg": "Honda_NSX",
    "ferrari-599gto.jpg": "Ferrari_599_GTO",
    "porsche-carrera-gt.jpg": "Porsche_Carrera_GT",
    "ford-gt-2005.jpg": "Ford_GT",
    "mclaren-f1.jpg": "McLaren_F1",
}

def get_wiki_image_url(page_title):
    """Get image URL from Wikipedia API."""
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(page_title)}&prop=pageimages&format=json&pithumbsize=1280"

    req = urllib.request.Request(api_url, headers={
        "User-Agent": "MonzaLabImageDownloader/1.0 (contact@monzalab.com)"
    })

    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as response:
            data = json.loads(response.read().decode())
            pages = data.get("query", {}).get("pages", {})
            for page_id, page_data in pages.items():
                if "thumbnail" in page_data:
                    return page_data["thumbnail"]["source"]
    except Exception as e:
        print(f"  Error fetching Wikipedia API for {page_title}: {e}")

    return None

def download_image(url, output_path):
    """Download image from URL."""
    req = urllib.request.Request(url, headers={
        "User-Agent": "MonzaLabImageDownloader/1.0 (contact@monzalab.com)"
    })

    try:
        with urllib.request.urlopen(req, context=ctx, timeout=60) as response:
            data = response.read()
            if len(data) > 5000:  # Must be larger than 5KB
                with open(output_path, "wb") as f:
                    f.write(data)
                return True
    except Exception as e:
        print(f"  Error downloading image: {e}")

    return False

def main():
    print("=" * 60)
    print("MONZA LAB: Downloading 15 New Car Images (Batch 3)")
    print("=" * 60)

    success_count = 0

    for filename, wiki_title in NEW_CARS.items():
        output_path = os.path.join(OUTPUT_DIR, filename)

        # Skip if already exists
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            if file_size > 5000:
                print(f"[SKIP] {filename} already exists ({file_size:,} bytes)")
                success_count += 1
                continue

        print(f"\n[{filename}] Fetching from Wikipedia: {wiki_title}")

        # Get image URL from Wikipedia
        image_url = get_wiki_image_url(wiki_title)

        if image_url:
            print(f"  Found: {image_url[:80]}...")

            if download_image(image_url, output_path):
                file_size = os.path.getsize(output_path)
                print(f"  SUCCESS: Downloaded {file_size:,} bytes")
                success_count += 1
            else:
                print(f"  FAILED: Could not download image")
        else:
            print(f"  FAILED: No image found on Wikipedia")

        # Rate limiting
        time.sleep(2)

    print("\n" + "=" * 60)
    print(f"COMPLETE: {success_count}/{len(NEW_CARS)} images downloaded")
    print("=" * 60)

if __name__ == "__main__":
    main()
