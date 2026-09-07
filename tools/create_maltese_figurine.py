"""Create a stylised, watertight Maltese resting-dog STL for FDM printing.

The form is inferred from the supplied front and three-quarter reference photos.
It intentionally uses smooth, sturdy forms so it slices reliably in a single
white filament, rather than attempting unsupported individual strands of fur.
"""
from pathlib import Path
import math
import struct
import numpy as np

OUTPUT = Path("models/maltese_resting_figurine.stl")
STEP = 1.35  # mm — balances smoothness, file size, and Bambu print detail


def ellipsoid(x, y, z, centre, radii):
    """Negative inside, positive outside; approximate ellipsoid signed distance."""
    cx, cy, cz = centre
    rx, ry, rz = radii
    return (np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2) - 1) * min(radii)


def capsule(x, y, z, start, end, radius):
    a = np.array(start, dtype=float)
    b = np.array(end, dtype=float)
    pa = np.stack((x - a[0], y - a[1], z - a[2]), axis=-1)
    ba = b - a
    h = np.clip(np.sum(pa * ba, axis=-1) / np.dot(ba, ba), 0, 1)
    qx, qy, qz = x - (a[0] + ba[0] * h), y - (a[1] + ba[1] * h), z - (a[2] + ba[2] * h)
    return np.sqrt(qx * qx + qy * qy + qz * qz) - radius


def add_union(field, shape):
    return np.minimum(field, shape)


def add_dimple(field, shape):
    # Difference operation: recesses eye and nose markers into the white model.
    return np.maximum(field, -shape)


def model_field(x, y, z):
    d = np.full_like(x, 1e6, dtype=float)
    # Curled, resting body and chest.
    d = add_union(d, ellipsoid(x, y, z, (92, 3, 29), (56, 35, 28)))
    d = add_union(d, ellipsoid(x, y, z, (65, -6, 34), (34, 29, 30)))
    # Raised head and rounded Maltese muzzle.
    d = add_union(d, ellipsoid(x, y, z, (39, -6, 58), (29, 25, 29)))
    d = add_union(d, ellipsoid(x, y, z, (17, -18, 51), (20, 17, 14)))
    d = add_union(d, ellipsoid(x, y, z, (27, -23, 50), (16, 14, 13)))
    # Soft drooping ears.
    d = add_union(d, ellipsoid(x, y, z, (48, -25, 59), (12, 10, 22)))
    d = add_union(d, ellipsoid(x, y, z, (51, 14, 59), (12, 10, 20)))
    # Forelegs extended in front, plus wider paws for a stable contact patch.
    d = add_union(d, capsule(x, y, z, (42, -17, 35), (2, -30, 11), 11))
    d = add_union(d, capsule(x, y, z, (47, 8, 33), (13, -3, 10), 10))
    d = add_union(d, ellipsoid(x, y, z, (0, -31, 8), (17, 12, 8)))
    d = add_union(d, ellipsoid(x, y, z, (10, -4, 8), (16, 11, 8)))
    # Hind leg and a curled tail, both visible in the reference pose.
    d = add_union(d, ellipsoid(x, y, z, (118, 3, 20), (33, 31, 20)))
    d = add_union(d, capsule(x, y, z, (126, 25, 30), (145, 31, 38), 9))
    d = add_union(d, capsule(x, y, z, (145, 31, 38), (139, 14, 48), 8))
    # A few strong facial-fur and chest tufts retain the Maltese character.
    for centre, radii in [
        ((31, -19, 76), (10, 9, 13)), ((43, -19, 77), (10, 9, 13)),
        ((25, -26, 59), (12, 8, 9)), ((46, -22, 49), (11, 8, 11)),
        ((39, -13, 31), (15, 14, 18)), ((78, -26, 31), (22, 12, 13)),
    ]:
        d = add_union(d, ellipsoid(x, y, z, centre, radii))
    # Shallow features show in white filament without needing a second colour.
    d = add_dimple(d, ellipsoid(x, y, z, (23, -29, 64), (5.5, 4, 5)))
    d = add_dimple(d, ellipsoid(x, y, z, (42, -28, 65), (5.5, 4, 5)))
    d = add_dimple(d, ellipsoid(x, y, z, (8, -31, 52), (5, 4, 4)))
    return d


TETRAS = ((0, 5, 1, 6), (0, 1, 2, 6), (0, 2, 3, 6), (0, 3, 7, 6), (0, 7, 4, 6), (0, 4, 5, 6))
CORNERS = ((0, 0, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0), (0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1))


def intersect(point_a, point_b, value_a, value_b):
    ratio = value_a / (value_a - value_b)
    return tuple(point_a[index] + (point_b[index] - point_a[index]) * ratio for index in range(3))


def triangles_for_tetra(points, values):
    inside = [index for index, value in enumerate(values) if value <= 0]
    outside = [index for index, value in enumerate(values) if value > 0]
    if not inside or not outside:
        return ()
    if len(inside) == 1 or len(inside) == 3:
        pivot = inside[0] if len(inside) == 1 else outside[0]
        other = outside if len(inside) == 1 else inside
        triangle = tuple(intersect(points[pivot], points[index], values[pivot], values[index]) for index in other)
        return (triangle if len(inside) == 1 else (triangle[0], triangle[2], triangle[1]),)
    # Two vertices are inside. The four crossing edges form one quadrilateral.
    i0, i1 = inside
    o0, o1 = outside
    p0 = intersect(points[i0], points[o0], values[i0], values[o0])
    p1 = intersect(points[i0], points[o1], values[i0], values[o0 if False else o1])
    p2 = intersect(points[i1], points[o1], values[i1], values[o1])
    p3 = intersect(points[i1], points[o0], values[i1], values[o0])
    return ((p0, p1, p2), (p0, p2, p3))


def mesh_triangles(values, xs, ys, zs):
    candidates = np.argwhere((values[:-1, :-1, :-1] <= 0) != (values[1:, 1:, 1:] <= 0))
    # Add cells where a diagonal alone did not change sign.
    cell_min = np.minimum.reduce([values[:-1, :-1, :-1], values[1:, :-1, :-1], values[1:, 1:, :-1], values[:-1, 1:, :-1], values[:-1, :-1, 1:], values[1:, :-1, 1:], values[1:, 1:, 1:], values[:-1, 1:, 1:]])
    cell_max = np.maximum.reduce([values[:-1, :-1, :-1], values[1:, :-1, :-1], values[1:, 1:, :-1], values[:-1, 1:, :-1], values[:-1, :-1, 1:], values[1:, :-1, 1:], values[1:, 1:, 1:], values[:-1, 1:, 1:]])
    candidates = np.argwhere((cell_min <= 0) & (cell_max > 0))
    for ix, iy, iz in candidates:
        points = [(xs[ix + dx], ys[iy + dy], zs[iz + dz]) for dx, dy, dz in CORNERS]
        cube_values = [values[ix + dx, iy + dy, iz + dz] for dx, dy, dz in CORNERS]
        for tetra in TETRAS:
            tetra_points = [points[index] for index in tetra]
            tetra_values = [cube_values[index] for index in tetra]
            yield from triangles_for_tetra(tetra_points, tetra_values)


def normal(a, b, c):
    u = np.subtract(b, a)
    v = np.subtract(c, a)
    cross = np.cross(u, v)
    length = np.linalg.norm(cross) or 1
    return tuple(cross / length)


def main():
    xs = np.arange(-18, 166 + STEP, STEP)
    ys = np.arange(-55, 56 + STEP, STEP)
    zs = np.arange(-8, 98 + STEP, STEP)
    x, y, z = np.meshgrid(xs, ys, zs, indexing="ij")
    values = model_field(x, y, z)
    triangles = list(mesh_triangles(values, xs, ys, zs))
    min_z = min(vertex[2] for triangle in triangles for vertex in triangle)
    clean_triangles = []
    for triangle in triangles:
        translated = tuple(tuple(round(component, 3) for component in (vertex[0], vertex[1], vertex[2] - min_z)) for vertex in triangle)
        if len(set(translated)) == 3:
            clean_triangles.append(translated)
    OUTPUT.parent.mkdir(exist_ok=True)
    with OUTPUT.open("wb") as stl:
        stl.write(b"Stylised resting Maltese, inferred from reference photos".ljust(80, b" "))
        stl.write(struct.pack("<I", len(clean_triangles)))
        for translated in clean_triangles:
            # Quantise shared vertices before STL output to prevent microscopic
            # floating-point seams along the flat contact surface.
            stl.write(struct.pack("<3f", *normal(*translated)))
            for vertex in translated:
                stl.write(struct.pack("<3f", *vertex))
            stl.write(struct.pack("<H", 0))
    print(f"Created {OUTPUT} with {len(clean_triangles):,} triangles")


if __name__ == "__main__":
    main()
