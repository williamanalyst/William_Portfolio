from collections import Counter
from pathlib import Path
import struct
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else "models/piggle_lithophane.stl")
with path.open("rb") as source:
    source.read(80)
    count = struct.unpack("<I", source.read(4))[0]
    edges = Counter()
    for _ in range(count):
        data = source.read(50)
        vertices = [struct.unpack_from("<3f", data, 12 + index * 12) for index in range(3)]
        for first, second in ((vertices[0], vertices[1]), (vertices[1], vertices[2]), (vertices[2], vertices[0])):
            edges[tuple(sorted((first, second)))] += 1

print(f"file: {path}")
print(f"triangles: {count}")
print(f"boundary edges: {sum(number == 1 for number in edges.values())}")
print(f"non-manifold edges: {sum(number > 2 for number in edges.values())}")
for edge, number in edges.items():
    if number == 1:
        print(f"boundary: {edge}")
    if number > 2:
        print(f"non-manifold: {edge} ({number} faces)")
