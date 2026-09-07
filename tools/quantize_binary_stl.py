"""Quantize binary STL vertices to seal tiny floating-point seams."""
from pathlib import Path
import struct
import sys

import numpy as np


INPUT = Path(sys.argv[1])
OUTPUT = Path(sys.argv[2]) if len(sys.argv) > 2 else INPUT
DECIMALS = int(sys.argv[3]) if len(sys.argv) > 3 else 2


def normal(a, b, c):
    u = np.subtract(b, a)
    v = np.subtract(c, a)
    cross = np.cross(u, v)
    length = np.linalg.norm(cross) or 1.0
    return tuple(cross / length)


def main():
    with INPUT.open("rb") as source:
        header = source.read(80)
        count = struct.unpack("<I", source.read(4))[0]
        triangles = []
        for _ in range(count):
            data = source.read(50)
            vertices = [
                tuple(round(component, DECIMALS) for component in struct.unpack_from("<3f", data, 12 + index * 12))
                for index in range(3)
            ]
            if len(set(vertices)) == 3:
                triangles.append(tuple(vertices))

    with OUTPUT.open("wb") as target:
        target.write(header)
        target.write(struct.pack("<I", len(triangles)))
        for triangle in triangles:
            target.write(struct.pack("<3f", *normal(*triangle)))
            for vertex in triangle:
                target.write(struct.pack("<3f", *vertex))
            target.write(struct.pack("<H", 0))
    print(f"Quantized {OUTPUT} to {DECIMALS} decimals with {len(triangles):,} triangles")


if __name__ == "__main__":
    main()
