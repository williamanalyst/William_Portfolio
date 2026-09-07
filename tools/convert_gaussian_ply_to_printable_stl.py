"""Convert a Gaussian-splat/point-cloud PLY into a printable STL.

The supplied PLY has vertices only, not polygon faces. This script reconstructs
a watertight printable visual hull from the front, side, and top point-cloud
silhouettes, then exports a smoothed STL.
"""
from collections import deque
from pathlib import Path
import math
import struct
import sys

import numpy as np


INPUT = Path(sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\willi\Downloads\object_0.ply")
OUTPUT = Path("models/object_0_detailed_tail_muzzle_adjusted.stl")
VOXEL_MM = 0.85
TARGET_HEIGHT_MM = 155.0
PROJECTION_DILATE = 2
SMOOTHING_PASSES = 2
ISO_LEVEL = 0.5


def smoothstep(edge0, edge1, value):
    t = np.clip((value - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def read_gaussian_ply(path):
    data = path.read_bytes()
    header_end = data.find(b"end_header\n") + len(b"end_header\n")
    header = data[:header_end].decode("ascii", errors="replace")
    vertex_count = None
    properties = 0
    in_vertex = False
    for line in header.splitlines():
        if line.startswith("element vertex "):
            vertex_count = int(line.split()[-1])
            in_vertex = True
            continue
        if line.startswith("element ") and not line.startswith("element vertex "):
            in_vertex = False
        if in_vertex and line.startswith("property "):
            properties += 1
    if vertex_count is None or properties < 3:
        raise ValueError("Expected a binary little-endian PLY with vertex positions")
    records = np.frombuffer(data[header_end:], dtype="<f4").reshape(vertex_count, properties)
    return np.array(records[:, :3], dtype=np.float32)


def apply_requested_shape_changes(points):
    adjusted = points.copy()
    x, y, z = adjusted[:, 0], adjusted[:, 1], adjusted[:, 2]

    # Tail: rear and upper cluster. Narrow left-right width by 20%, with a
    # smooth transition so the tail does not pinch abruptly into the body.
    tail_weight = smoothstep(0.22, 0.31, y) * smoothstep(-0.02, 0.07, z)
    tail_centre_x = np.median(x[tail_weight > 0.5])
    adjusted[:, 0] = tail_centre_x + (adjusted[:, 0] - tail_centre_x) * (1.0 - 0.20 * tail_weight)

    # "Mouse" is treated as mouth/muzzle: front lower head cluster. Make it
    # 10% wider left-right while keeping the nose-to-tail length intact.
    frontness = smoothstep(-0.30, -0.39, y)
    lower = smoothstep(0.02, 0.08, z)
    upper = 1.0 - smoothstep(0.24, 0.31, z)
    muzzle_weight = frontness * lower * upper
    muzzle_centre_x = np.median(x[muzzle_weight > 0.4])
    adjusted[:, 0] = muzzle_centre_x + (adjusted[:, 0] - muzzle_centre_x) * (1.0 + 0.10 * muzzle_weight)
    return adjusted


def dilate2d(mask, radius):
    result = mask.copy()
    offsets = [
        (dx, dy)
        for dx in range(-radius, radius + 1)
        for dy in range(-radius, radius + 1)
        if dx * dx + dy * dy <= radius * radius
    ]
    padded = np.pad(mask, radius, mode="constant", constant_values=False)
    for dx, dy in offsets:
        result |= padded[radius + dx : radius + dx + mask.shape[0], radius + dy : radius + dy + mask.shape[1]]
    return result


def fill_2d(mask):
    h, w = mask.shape
    outside = np.zeros_like(mask, dtype=bool)
    queue = deque()
    for x in range(h):
        for y in (0, w - 1):
            if not mask[x, y] and not outside[x, y]:
                outside[x, y] = True
                queue.append((x, y))
    for y in range(w):
        for x in (0, h - 1):
            if not mask[x, y] and not outside[x, y]:
                outside[x, y] = True
                queue.append((x, y))
    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < h and 0 <= ny < w and not mask[nx, ny] and not outside[nx, ny]:
                outside[nx, ny] = True
                queue.append((nx, ny))
    return ~outside


def make_projection(points, axes, dims):
    coords = np.rint(points[:, axes] / VOXEL_MM).astype(np.int32)
    coords = np.clip(coords, 0, np.array(dims) - 1)
    mask = np.zeros(dims, dtype=bool)
    mask[coords[:, 0], coords[:, 1]] = True
    return fill_2d(dilate2d(mask, PROJECTION_DILATE))


def smooth_volume(solid):
    field = solid.astype(np.float32)
    for _ in range(SMOOTHING_PASSES):
        padded = np.pad(field, 1, mode="constant", constant_values=0.0)
        field = (
            padded[1:-1, 1:-1, 1:-1] * 2.0
            + padded[:-2, 1:-1, 1:-1]
            + padded[2:, 1:-1, 1:-1]
            + padded[1:-1, :-2, 1:-1]
            + padded[1:-1, 2:, 1:-1]
            + padded[1:-1, 1:-1, :-2]
            + padded[1:-1, 1:-1, 2:]
        ) / 8.0
    return ISO_LEVEL - field


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


def mesh_triangles(values):
    corners = [
        values[:-1, :-1, :-1],
        values[1:, :-1, :-1],
        values[1:, 1:, :-1],
        values[:-1, 1:, :-1],
        values[:-1, :-1, 1:],
        values[1:, :-1, 1:],
        values[1:, 1:, 1:],
        values[:-1, 1:, 1:],
    ]
    cell_min = np.minimum.reduce(corners)
    cell_max = np.maximum.reduce(corners)
    candidates = np.argwhere((cell_min <= 0) & (cell_max > 0))
    for ix, iy, iz in candidates:
        points = [(ix + dx, iy + dy, iz + dz) for dx, dy, dz in CORNERS]
        cube_values = [values[ix + dx, iy + dy, iz + dz] for dx, dy, dz in CORNERS]
        for tetra in TETRAS:
            tetra_points = [points[index] for index in tetra]
            tetra_values = [cube_values[index] for index in tetra]
            yield from triangles_for_tetra(tetra_points, tetra_values)


def normal(a, b, c):
    u = np.subtract(b, a)
    v = np.subtract(c, a)
    cross = np.cross(u, v)
    length = np.linalg.norm(cross) or 1.0
    return tuple(cross / length)


def write_stl(path, triangles):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("wb") as stl:
        stl.write(b"Printable STL reconstructed from Gaussian PLY point model".ljust(80, b" "))
        stl.write(struct.pack("<I", len(triangles)))
        for triangle in triangles:
            stl.write(struct.pack("<3f", *normal(*triangle)))
            for vertex in triangle:
                stl.write(struct.pack("<3f", *vertex))
            stl.write(struct.pack("<H", 0))


def main():
    points = read_gaussian_ply(INPUT)
    points = apply_requested_shape_changes(points)

    # Put points in millimetres, with z as build height and paws near z=0.
    mins = points.min(axis=0)
    points = points - mins
    scale = TARGET_HEIGHT_MM / points[:, 2].max()
    points *= scale
    points += np.array([5.0, 5.0, 2.0], dtype=np.float32)

    dims = tuple((np.ceil(points.max(axis=0) / VOXEL_MM).astype(int) + 8).tolist())
    print(f"grid: {dims[0]} x {dims[1]} x {dims[2]}")

    front = make_projection(points, (0, 2), (dims[0], dims[2]))
    side = make_projection(points, (1, 2), (dims[1], dims[2]))
    top = make_projection(points, (0, 1), (dims[0], dims[1]))
    solid = front[:, None, :] & side[None, :, :] & top[:, :, None]
    print(f"solid voxels: {int(solid.sum()):,}")

    field = smooth_volume(solid)
    triangles = []
    for triangle in mesh_triangles(field):
        scaled = tuple(tuple(round(component * VOXEL_MM, 3) for component in vertex) for vertex in triangle)
        if len(set(scaled)) == 3:
            triangles.append(scaled)

    write_stl(OUTPUT, triangles)
    print(f"Created {OUTPUT} with {len(triangles):,} triangles")
    maxes = np.array([vertex for triangle in triangles for vertex in triangle]).max(axis=0)
    print(f"Approx size: {maxes[0]:.1f} x {maxes[1]:.1f} x {maxes[2]:.1f} mm")


if __name__ == "__main__":
    main()
