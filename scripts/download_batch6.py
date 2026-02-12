#!/usr/bin/env python3
"""Download images for cars 101-115 from Wikipedia API."""

import urllib.request
import urllib.parse
import json
import ssl
import time
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

OUTPUT_DIR = "/Users/bavaraianecons/Desktop/monza lab/Quantum/Secret projects/Bit the web/Moonshap Bitcar/public/cars"

NEW_CARS = {
    "porsche-944.jpg": "Porsche_944",
    "bmw-z8.jpg": "BMW_Z8",
    "mercedes-280se.jpg": "Mercedes-Benz_W111",
    "jaguar-etype-s1.jpg": "Jaguar_E-Type",
    "lotus-elise.jpg": "Lotus_Elise",
    "mazda-cosmo.jpg": "Mazda_Cosmo",
    "subaru-gc8.jpg": "Subaru_Impreza",
    "mitsubishi-3000gt.jpg": "Mitsubishi_3000GT",
    "buick-gnx.jpg": "Buick_Grand_National",
    "volvo-p1800.jpg": "Volvo_P1800",
    "austin-healey.jpg": "Austin-Healey_3000",
    "triumph-tr6.jpg": "Triumph_TR6",
    "mgb-gt-v8.jpg": "MG_MGB",
    "ferrari-mondial.jpg": "Ferrari_Mondial",
    "renault-5-turbo.jpg": "Renault_5_Turbo",
}

def get_wiki_image_url(page_title):
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
        print(f"  Error: {e}")
    return None

def download_image(url, output_path):
    req = urllib.request.Request(url, headers={
        "User-Agent": "MonzaLabImageDownloader/1.0 (contact@monzalab.com)"
    })
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=60) as response:
            data = response.read()
            if len(data) > 5000:
                with open(output_path, "wb") as f:
                    f.write(data)
                return True
    except Exception as e:
        print(f"  Error: {e}")
    return False

def main():
    print("=" * 60)
    print("MONZA LAB: Downloading 15 New Car Images (Batch 6)")
    print("=" * 60)

    success_count = 0
    for filename, wiki_title in NEW_CARS.items():
        output_path = os.path.join(OUTPUT_DIR, filename)
        if os.path.exists(output_path) and os.path.getsize(output_path) > 5000:
            print(f"[SKIP] {filename} already exists")
            success_count += 1
            continue

        print(f"\n[{filename}] Fetching: {wiki_title}")
        image_url = get_wiki_image_url(wiki_title)
        if image_url:
            print(f"  Found: {image_url[:60]}...")
            if download_image(image_url, output_path):
                print(f"  SUCCESS: {os.path.getsize(output_path):,} bytes")
                success_count += 1
            else:
                print(f"  FAILED: Download error")
        else:
            print(f"  FAILED: No image found")
        time.sleep(2)

    print("\n" + "=" * 60)
    print(f"COMPLETE: {success_count}/{len(NEW_CARS)} images")
    print("=" * 60)

if __name__ == "__main__":
    main()
