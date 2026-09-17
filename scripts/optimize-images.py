from pathlib import Path

from PIL import Image


SOURCE_DIRS = (
    Path("frontend/src/assets"),
    Path("frontend/public/products"),
    Path("admin/src/assets"),
)

for source_dir in SOURCE_DIRS:
    for source in source_dir.glob("*.png"):
        if source.stat().st_size < 300_000:
            continue

        destination = source.with_suffix(".webp")
        with Image.open(source) as image:
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
            image.save(destination, "WEBP", quality=82, method=6)

        print(f"{destination}: {destination.stat().st_size:,} bytes")
