"""Create a printable, solid STL lithophane from an image.

The dark areas become thicker and the light areas thinner. This gives the
portrait its detail when it is illuminated from behind.
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps
import math
import struct

SOURCE = Path(r"C:\Users\willi\Downloads\piggle_image.HEIC")
OUTPUT = Path("models/piggle_lithophane.stl")
WIDTH_MM = 100.0
PIXELS_WIDE = 150
MIN_THICKNESS_MM = 0.8
RELIEF_MM = 2.4


def normal(a, b, c):
    ux, uy, uz = (b[i] - a[i] for i in range(3))
    vx, vy, vz = (c[i] - a[i] for i in range(3))
    nx, ny, nz = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
    magnitude = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
    return nx / magnitude, ny / magnitude, nz / magnitude


def main():
    image = Image.open(SOURCE).convert("L")
    height = round(PIXELS_WIDE * image.height / image.width)
    image = image.resize((PIXELS_WIDE, height), Image.Resampling.LANCZOS)
    image = ImageEnhance.Contrast(ImageOps.autocontrast(image, cutoff=1)).enhance(1.25)

    width, height_px = image.size
    height_mm = WIDTH_MM * height_px / width
    dx, dy = WIDTH_MM / (width - 1), height_mm / (height_px - 1)
    pixels = image.load()

    def top(x, y):
        # Invert luminance: dark details are thickest, white details thinnest.
        thickness = MIN_THICKNESS_MM + (1 - pixels[x, y] / 255) * RELIEF_MM
        return (x * dx, (height_px - 1 - y) * dy, thickness)

    def bottom(x, y):
        return (x * dx, (height_px - 1 - y) * dy, 0.0)

    triangles = []
    for y in range(height_px - 1):
        for x in range(width - 1):
            a, b, c, d = top(x, y), top(x + 1, y), top(x + 1, y + 1), top(x, y + 1)
            triangles.extend(((a, b, c), (a, c, d)))
            a, b, c, d = bottom(x, y), bottom(x + 1, y), bottom(x + 1, y + 1), bottom(x, y + 1)
            triangles.extend(((a, c, b), (a, d, c)))

    # Seal all four edges so the STL is a watertight solid.
    for x in range(width - 1):
        for y in (0, height_px - 1):
            a, b, c, d = top(x, y), top(x + 1, y), bottom(x + 1, y), bottom(x, y)
            triangles.extend(((a, b, c), (a, c, d)) if y == 0 else ((a, c, b), (a, d, c)))
    for y in range(height_px - 1):
        for x in (0, width - 1):
            a, b, c, d = top(x, y), top(x, y + 1), bottom(x, y + 1), bottom(x, y)
            triangles.extend(((a, b, c), (a, c, d)) if x == 0 else ((a, c, b), (a, d, c)))

    OUTPUT.parent.mkdir(exist_ok=True)
    with OUTPUT.open("wb") as stl:
        stl.write(b"Piggle portrait lithophane".ljust(80, b" "))
        stl.write(struct.pack("<I", len(triangles)))
        for triangle in triangles:
            stl.write(struct.pack("<3f", *normal(*triangle)))
            for vertex in triangle:
                stl.write(struct.pack("<3f", *vertex))
            stl.write(struct.pack("<H", 0))
    print(f"Created {OUTPUT} — {WIDTH_MM:.0f} × {height_mm:.1f} × {MIN_THICKNESS_MM + RELIEF_MM:.1f} mm")


if __name__ == "__main__":
    main()
