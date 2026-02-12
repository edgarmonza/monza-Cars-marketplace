#!/usr/bin/env python3
"""Download new car images for expanding the collection"""

import os

# Directory to save images
CARS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "cars")

# New cars to add - using high-quality Unsplash/Pexels-style URLs
# Format: (filename, search_term_for_manual_download)
NEW_CARS = [
    # Porsche additions
    ("porsche-911r.jpg", "Porsche 911 R white"),
    ("porsche-928-gts.jpg", "Porsche 928 GTS"),
    ("porsche-964-rs.jpg", "Porsche 964 RS America"),
    ("porsche-997-gt3rs-4.jpg", "Porsche 997 GT3 RS 4.0"),
    ("porsche-992-gt3.jpg", "Porsche 992 GT3"),

    # Ferrari additions
    ("ferrari-f355.jpg", "Ferrari F355 GTS"),
    ("ferrari-550.jpg", "Ferrari 550 Maranello"),
    ("ferrari-812.jpg", "Ferrari 812 Superfast"),
    ("ferrari-roma.jpg", "Ferrari Roma"),
    ("ferrari-challenge-stradale.jpg", "Ferrari 360 Challenge Stradale"),

    # Lamborghini additions
    ("lambo-gallardo.jpg", "Lamborghini Gallardo Superleggera"),
    ("lambo-murcielago.jpg", "Lamborghini Murcielago SV"),
    ("lambo-reventon.jpg", "Lamborghini Reventon"),
    ("lambo-urus.jpg", "Lamborghini Urus"),
    ("lambo-sian.jpg", "Lamborghini Sian"),

    # Mercedes additions
    ("mercedes-slr.jpg", "Mercedes SLR McLaren"),
    ("mercedes-amg-one.jpg", "Mercedes AMG ONE"),
    ("mercedes-g63.jpg", "Mercedes G63 AMG"),
    ("mercedes-600-pullman.jpg", "Mercedes 600 Pullman"),
    ("mercedes-sl55.jpg", "Mercedes SL55 AMG R230"),
]

print("New cars to add images for:")
print("=" * 60)
for filename, search_term in NEW_CARS:
    filepath = os.path.join(CARS_DIR, filename)
    exists = "✓ EXISTS" if os.path.exists(filepath) else "✗ MISSING"
    print(f"{exists}: {filename} - Search: '{search_term}'")

print("\n" + "=" * 60)
print(f"Total: {len(NEW_CARS)} cars")
print(f"Save images to: {CARS_DIR}")
print("\nTo download, search for these on:")
print("- Unsplash (unsplash.com)")
print("- Pexels (pexels.com)")
print("- RM Sotheby's (rmsothebys.com)")
print("- Bring a Trailer (bringatrailer.com)")
