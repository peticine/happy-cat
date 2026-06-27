#!/usr/bin/env python3
"""Crop photo-only panels from Healthy Cat screening infographics."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path.home() / ".cursor/projects/Users-sagarsheth-Documents-pet-supplements-premium/assets"
OUT_DIR = ROOT / "images" / "quiz"
EDGE_TRIM = 3

# Photo rectangles measured from source infographics (1024×682 grid / 1024×819 vomiting).
# Excludes labels, icons, number badges, and card padding.
PHOTO_BOXES: dict[str, tuple[int, int, int, int]] = {
    "appetite-leaving": (27, 138, 326, 362),
    "appetite-less": (354, 138, 653, 362),
    "appetite-same": (681, 138, 980, 362),
    "appetite-more": (181, 446, 499, 652),
    "appetite-unsure": (527, 446, 845, 652),
    "water-empty_bowl": (142, 162, 326, 360),
    "water-refills": (469, 162, 653, 360),
    "water-longer": (681, 162, 935, 310),
    "water-none": (181, 446, 499, 652),
    "water-unsure": (600, 450, 845, 650),
    "urination-larger": (27, 138, 326, 362),
    "urination-more": (354, 138, 653, 362),
    "urination-both": (681, 138, 980, 362),
    "urination-same": (181, 446, 499, 652),
    "urination-unsure": (527, 446, 845, 652),
    "weight-ribs": (27, 142, 326, 360),
    "weight-slight": (354, 142, 653, 360),
    "weight-same": (681, 142, 980, 360),
    "weight-heavier": (181, 446, 499, 652),
    "weight-unsure": (527, 446, 845, 652),
    "vomiting-four_plus": (26, 188, 188, 578),
    "vomiting-two_three": (218, 188, 396, 578),
    "vomiting-once": (424, 188, 596, 578),
    "vomiting-never": (626, 188, 794, 578),
    "vomiting-unsure": (824, 188, 998, 578),
}

SOURCES = {
    "appetite": "ChatGPT_Image_Jun_26__2026__06_16_18_PM-bcd4a7b6-855c-4ae2-855b-ac5ff209647b.png",
    "water": "ChatGPT_Image_Jun_26__2026__06_09_12_PM-0cd08175-7ea9-4ee7-aeb7-063beb96a3f0.png",
    "urination": "ChatGPT_Image_Jun_26__2026__06_12_10_PM-1d9afc67-2723-4187-a6d6-e42180c823e1.png",
    "weight": "ChatGPT_Image_Jun_26__2026__06_15_15_PM-66e4f4ad-388b-49fb-8c4f-3de413417060.png",
    "vomiting": "ChatGPT_Image_Jun_26__2026__06_24_29_PM-fbfd17f2-536e-48a9-b713-066914bb20c6.png",
}


def crop_and_trim(img: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    x0, y0, x1, y1 = box
    crop = img.crop((x0, y0, x1, y1))
    w, h = crop.size
    if w > EDGE_TRIM * 4 and h > EDGE_TRIM * 4:
        crop = crop.crop((EDGE_TRIM, EDGE_TRIM, w - EDGE_TRIM, h - EDGE_TRIM))
    return crop


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    loaded = {
        prefix: Image.open(ASSETS / filename).convert("RGB")
        for prefix, filename in SOURCES.items()
    }

    for key, box in PHOTO_BOXES.items():
        prefix = key.split("-", 1)[0]
        src = ASSETS / SOURCES[prefix]
        if not src.exists():
            raise FileNotFoundError(f"Missing source infographic: {src}")
        crop = crop_and_trim(loaded[prefix], box)
        crop.save(OUT_DIR / f"{key}.png", optimize=True)
        print(f"{key}.png: {crop.size}")


if __name__ == "__main__":
    main()
