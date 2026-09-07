"""Create a detailed, watertight standing Maltese STL for FDM printing.

The model combines the supplied standing front photos and side reference into a
single printable sculpture: upright tail, rounded Maltese head, dropped ears,
short standing legs, fluffy chest, paw tufts, facial recesses, and surface fur
grooves. It is intentionally a single white-filament mesh; colour details such
as the eyes and nose are modeled as shallow recesses so they can be painted
after printing if desired.
"""
from pathlib import Path
import math
import struct
import numpy as np

OUTPUT = Path("models/maltese_standing_detailed.stl")
STEP = 1.08  # mm. Smaller is more detailed but increases STL size quickly.


def ellipsoid(x, y, z, centre, radii):
    cx, cy, cz = centre
    rx, ry, rz = radii
    return (np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2) - 1) * min(radii)


def capsule(x, y, z, start, end, radius):
    a = np.array(start, dtype=float)
    b = np.array(end, dtype=float)
    pa = np.stack((x - a[0], y - a[1], z - a[2]), axis=-1)
    ba = b - a
    h = np.clip(np.sum(pa * ba, axis=-1) / np.dot(ba, ba), 0, 1)
    qx = x - (a[0] + ba[0] * h)
    qy = y - (a[1] + ba[1] * h)
    qz = z - (a[2] + ba[2] * h)
    return np.sqrt(qx * qx + qy * qy + qz * qz) - radius


def union(field, shape):
    return np.minimum(field, shape)


def subtract(field, shape):
    return np.maximum(field, -shape)


def add_body(field, x, y, z):
    # Compact, slightly long Maltese body and chest from the side reference.
    field = union(field, ellipsoid(x, y, z, (68, 0, 63), (48, 23, 27)))
    field = union(field, ellipsoid(x, y, z, (38, 0, 66), (28, 24, 31)))
    field = union(field, ellipsoid(x, y, z, (101, 0, 61), (34, 22, 25)))
    field = union(field, ellipsoid(x, y, z, (33, 0, 79), (24, 22, 28)))
    field = union(field, capsule(x, y, z, (30, 0, 83), (17, 0, 99), 15))
    return field


def add_head(field, x, y, z):
    # Head and muzzle: front photos show large round eyes, a soft square muzzle,
    # droopy ears, and a little top-knot of unruly hair.
    field = union(field, ellipsoid(x, y, z, (9, 0, 108), (24, 22, 24)))
    field = union(field, ellipsoid(x, y, z, (-8, 0, 101), (18, 16, 13)))
    field = union(field, ellipsoid(x, y, z, (-16, 0, 100), (10, 11, 8)))
    field = union(field, ellipsoid(x, y, z, (-21, 0, 101), (5.5, 7, 5)))
    field = union(field, ellipsoid(x, y, z, (4, -20, 105), (9, 8, 20)))
    field = union(field, ellipsoid(x, y, z, (4, 20, 105), (9, 8, 20)))
    field = union(field, ellipsoid(x, y, z, (6, -24, 98), (10, 6, 17)))
    field = union(field, ellipsoid(x, y, z, (6, 24, 98), (10, 6, 17)))

    # Raised brows, moustache pads, beard, and forehead wisps.
    for centre, radii in [
        ((-2, -10, 119), (12, 6, 6)), ((-2, 10, 119), (12, 6, 6)),
        ((-14, -9, 108), (12, 6, 6)), ((-14, 9, 108), (12, 6, 6)),
        ((-12, -9, 92), (13, 5, 8)), ((-12, 9, 92), (13, 5, 8)),
        ((6, 0, 130), (7, 5, 13)), ((12, -5, 132), (5, 4, 11)),
        ((12, 6, 132), (5, 4, 11)), ((0, 0, 87), (11, 10, 9)),
    ]:
        field = union(field, ellipsoid(x, y, z, centre, radii))

    for start, end, radius in [
        ((-3, -9, 129), (-11, -14, 144), 2.7),
        ((5, 0, 131), (2, 0, 148), 2.6),
        ((-3, 9, 129), (-11, 14, 144), 2.7),
        ((-15, -7, 106), (-26, -17, 101), 2.0),
        ((-15, 7, 106), (-26, 17, 101), 2.0),
        ((-13, -12, 96), (-26, -18, 91), 1.8),
        ((-13, 12, 96), (-26, 18, 91), 1.8),
        ((-8, -2, 91), (-18, -2, 82), 2.1),
        ((-8, 2, 91), (-18, 2, 82), 2.1),
    ]:
        field = union(field, capsule(x, y, z, start, end, radius))

    # Recessed eyes, nose, nostrils, and mouth line for single-colour printing.
    for centre in [(-10, -9.5, 111), (-10, 9.5, 111)]:
        field = subtract(field, ellipsoid(x, y, z, centre, (5.8, 4.2, 5.0)))
    field = subtract(field, ellipsoid(x, y, z, (-23.2, 0, 101), (4.4, 6.0, 3.6)))
    field = subtract(field, ellipsoid(x, y, z, (-25.2, -3.7, 101), (1.5, 1.7, 1.1)))
    field = subtract(field, ellipsoid(x, y, z, (-25.2, 3.7, 101), (1.5, 1.7, 1.1)))
    field = subtract(field, capsule(x, y, z, (-19, -6, 92), (-18, 6, 92), 1.8))
    field = subtract(field, capsule(x, y, z, (-17, 0, 96), (-17, 0, 90), 1.2))
    return field


def add_legs_and_tail(field, x, y, z):
    # Four standing legs with broader paws. Paws are clipped flat later.
    legs = [
        ((31, -13, 55), (24, -15, 12), 8.3), ((31, 13, 55), (24, 15, 12), 8.3),
        ((91, -13, 52), (92, -14, 12), 8.0), ((91, 13, 52), (92, 14, 12), 8.0),
    ]
    for start, end, radius in legs:
        field = union(field, capsule(x, y, z, start, end, radius))
    for centre in [(22, -16, 6), (22, 16, 6), (92, -15, 6), (92, 15, 6)]:
        field = union(field, ellipsoid(x, y, z, centre, (12, 8, 6)))

    # Raised plume tail from the standing front photos.
    field = union(field, capsule(x, y, z, (114, 0, 77), (123, 0, 111), 7.5))
    field = union(field, capsule(x, y, z, (123, 0, 111), (111, 0, 134), 6.5))
    for centre, radii in [
        ((116, -5, 124), (11, 7, 16)), ((116, 5, 124), (11, 7, 16)),
        ((111, 0, 139), (9, 8, 9)), ((124, 0, 104), (10, 8, 10)),
    ]:
        field = union(field, ellipsoid(x, y, z, centre, radii))
    return field


def add_printable_fur(field, x, y, z):
    # Raised surface wisps. These are thick enough for 0.4 mm nozzle FDM.
    ridges = []
    for offset in [-17, -11, -5, 4, 11, 17]:
        ridges.append(((50, offset, 87), (97, offset * 0.85, 79), 1.7))
    for offset in [-19, -12, -5, 5, 12, 19]:
        ridges.append(((42, offset, 48), (91, offset * 0.9, 39), 1.6))
    for offset in [-12, -6, 0, 6, 12]:
        ridges.append(((23, offset, 77), (35, offset * 0.8, 43), 1.8))
    for side in [-1, 1]:
        ridges.extend([
            ((7, side * 22, 117), (2, side * 30, 93), 1.6),
            ((11, side * 20, 110), (8, side * 31, 88), 1.5),
            ((25, side * 12, 50), (22, side * 16, 8), 1.4),
            ((93, side * 12, 48), (94, side * 16, 8), 1.4),
            ((109, side * 3, 130), (117, side * 12, 113), 1.5),
            ((119, side * 4, 120), (128, side * 13, 106), 1.5),
        ])
    for start, end, radius in ridges:
        field = union(field, capsule(x, y, z, start, end, radius))

    # Shallow carved grooves create directional hair texture without fragile
    # individual strands. They are kept broad enough to survive slicing.
    grooves = []
    for offset in [-18, -9, 0, 9, 18]:
        grooves.append(((54, offset, 91), (104, offset * 0.9, 84), 1.3))
        grooves.append(((51, offset, 34), (101, offset * 0.9, 30), 1.2))
    for offset in [-13, -7, 7, 13]:
        grooves.append(((-5, offset, 122), (-15, offset * 1.3, 111), 1.1))
        grooves.append(((-9, offset, 96), (-25, offset * 1.5, 90), 1.0))
    for side in [-1, 1]:
        grooves.append(((5, side * 24, 112), (3, side * 30, 94), 1.1))
        grooves.append(((10, side * 22, 102), (9, side * 30, 88), 1.1))
        grooves.append(((119, side * 4, 126), (127, side * 11, 111), 1.1))
    for start, end, radius in grooves:
        field = subtract(field, capsule(x, y, z, start, end, radius))

    # Toe grooves on the four paws.
    for px, py in [(21, -16), (21, 16), (92, -15), (92, 15)]:
        field = subtract(field, capsule(x, y, z, (px - 6, py - 2, 8), (px - 11, py - 2, 2), 0.9))
        field = subtract(field, capsule(x, y, z, (px - 6, py + 2, 8), (px - 11, py + 2, 2), 0.9))
    return field


def model_field(x, y, z):
    d = np.full_like(x, 1e6, dtype=float)
    d = add_body(d, x, y, z)
    d = add_head(d, x, y, z)
    d = add_legs_and_tail(d, x, y, z)
    d = add_printable_fur(d, x, y, z)
    # Flat soles only, not a background/base. This makes the four paws usable as
    # the build-plate contact surface.
    d = np.maximum(d, -z)
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
    i0, i1 = inside
    o0, o1 = outside
    p0 = intersect(points[i0], points[o0], values[i0], values[o0])
    p1 = intersect(points[i0], points[o1], values[i0], values[o1])
    p2 = intersect(points[i1], points[o1], values[i1], values[o1])
    p3 = intersect(points[i1], points[o0], values[i1], values[o0])
    return ((p0, p1, p2), (p0, p2, p3))


def mesh_triangles(values, xs, ys, zs):
    corners = [
        values[:-1, :-1, :-1], values[1:, :-1, :-1], values[1:, 1:, :-1], values[:-1, 1:, :-1],
        values[:-1, :-1, 1:], values[1:, :-1, 1:], values[1:, 1:, 1:], values[:-1, 1:, 1:],
    ]
    cell_min = np.minimum.reduce(corners)
    cell_max = np.maximum.reduce(corners)
    for ix, iy, iz in np.argwhere((cell_min <= 0) & (cell_max > 0)):
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
    xs = np.arange(-34, 142 + STEP, STEP)
    ys = np.arange(-42, 43 + STEP, STEP)
    zs = np.arange(-6, 154 + STEP, STEP)
    x, y, z = np.meshgrid(xs, ys, zs, indexing="ij")
    values = model_field(x, y, z)
    triangles = list(mesh_triangles(values, xs, ys, zs))

    min_x = min(vertex[0] for triangle in triangles for vertex in triangle)
    min_y = min(vertex[1] for triangle in triangles for vertex in triangle)
    min_z = min(vertex[2] for triangle in triangles for vertex in triangle)
    clean_triangles = []
    for triangle in triangles:
        translated = tuple(
            tuple(round(component, 3) for component in (vertex[0] - min_x, vertex[1] - min_y, vertex[2] - min_z))
            for vertex in triangle
        )
        if len(set(translated)) == 3:
            clean_triangles.append(translated)

    OUTPUT.parent.mkdir(exist_ok=True)
    with OUTPUT.open("wb") as stl:
        stl.write(b"Detailed standing Maltese, inferred from supplied photos".ljust(80, b" "))
        stl.write(struct.pack("<I", len(clean_triangles)))
        for triangle in clean_triangles:
            stl.write(struct.pack("<3f", *normal(*triangle)))
            for vertex in triangle:
                stl.write(struct.pack("<3f", *vertex))
            stl.write(struct.pack("<H", 0))

    width = max(vertex[0] for triangle in clean_triangles for vertex in triangle)
    depth = max(vertex[1] for triangle in clean_triangles for vertex in triangle)
    height = max(vertex[2] for triangle in clean_triangles for vertex in triangle)
    print(f"Created {OUTPUT} with {len(clean_triangles):,} triangles")
    print(f"Approx size: {width:.1f} x {depth:.1f} x {height:.1f} mm")


if __name__ == "__main__":
    main()
