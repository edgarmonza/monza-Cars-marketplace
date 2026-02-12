#!/usr/bin/env python3
"""Download missing images with alternative article names."""

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

# Alternative Wikipedia articles for missing images
MISSING_CARS = {
    "ferrari-360cs.jpg": ["Ferrari_360", "Ferrari_360_Modena"],
    "ferrari-599gto.jpg": ["Ferrari_599", "Ferrari_599_GTB_Fiorano"],
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
        print(f"    Error: {e}")
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
        print(f"    Error: {e}")
    return False

def main():
    print("Downloading missing Ferrari images with alternatives...")
    print("=" * 60)

    for filename, alternatives in MISSING_CARS.items():
        output_path = os.path.join(OUTPUT_DIR, filename)

        if os.path.exists(output_path) and os.path.getsize(output_path) > 5000:
            print(f"[SKIP] {filename} already exists")
            continue

        print(f"\n[{filename}]")

        for alt in alternatives:
            print(f"  Trying: {alt}")
            image_url = get_wiki_image_url(alt)

            if image_url:
                print(f"  Found: {image_url[:60]}...")
                if download_image(image_url, output_path):
                    print(f"  SUCCESS: {os.path.getsize(output_path):,} bytes")
                    break

            time.sleep(2)

        if not os.path.exists(output_path) or os.path.getsize(output_path) < 5000:
            print(f"  FAILED: Could not find image")

    print("\n" + "=" * 60)
    print("Done!")

if __name__ == "__main__":
    main()
