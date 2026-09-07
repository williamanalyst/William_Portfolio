"""Create orthographic projection previews for a binary Gaussian-splat PLY."""
from pathlib import Path
import sys

import numpy as np
from PIL import Image


INPUT = Path(sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\willi\Downloads\object_0.ply")
OUTPUT = Path("models/ply_projection_previews")


def main():
    data = INPUT.read_bytes()
    header_end = data.find(b"end_header\n") + len(b"end_header\n")
    header = data[:header_end].decode("ascii", errors="replace")
    vertex_count = None
    for line in header.splitlines():
        if line.startswith("element vertex "):
            vertex_count = int(line.split()[-1])
            break
    if vertex_count is None:
        raise ValueError("No vertex count found in PLY header")

    records = np.frombuffer(data[header_end:], dtype="<f4").reshape(vertex_count, -1)
    points = records[:, :3]
    print(f"points: {len(points):,}")
    print(f"min: {points.min(axis=0)}")
    print(f"max: {points.max(axis=0)}")
    print(f"q01: {np.quantile(points, 0.01, axis=0)}")
    print(f"q99: {np.quantile(points, 0.99, axis=0)}")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, axes in {"xy": (0, 1), "xz": (0, 2), "yz": (1, 2)}.items():
        projected = points[:, axes]
        mn = projected.min(axis=0)
        mx = projected.max(axis=0)
        size = 1200
        pad = 50
        scale = min((size - 2 * pad) / (mx[0] - mn[0]), (size - 2 * pad) / (mx[1] - mn[1]))
        image = Image.new("RGB", (size, size), "white")
        pixels = image.load()
        for first, second in projected:
            px = int((first - mn[0]) * scale + pad)
            py = int(size - ((second - mn[1]) * scale + pad))
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    xx, yy = px + dx, py + dy
                    if 0 <= xx < size and 0 <= yy < size:
                        pixels[xx, yy] = (20, 20, 20)
        path = OUTPUT / f"{name}.png"
        image.save(path)
        print(path)


if __name__ == "__main__":
    main()
