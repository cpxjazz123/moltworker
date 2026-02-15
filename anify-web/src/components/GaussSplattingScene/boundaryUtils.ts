import type { BoundaryConfig, BoundaryPoint, Wall, WallConfig } from "./types";

/** 默认向外扩展距离（米） */
const DEFAULT_EXPAND_DISTANCE = 0.7;

/**
 * Convert boundary points to wall configuration.
 * Each consecutive pair of points becomes a wall segment.
 * Points are expanded outward from centroid to ensure marked positions remain accessible.
 */
export function boundaryToWalls(
  boundary: BoundaryConfig,
  expandDistance: number = DEFAULT_EXPAND_DISTANCE
): WallConfig {
  const { floorY, points, wallHeight } = boundary;
  const walls: Wall[] = [];

  if (points.length < 2) {
    return { defaultHeight: wallHeight, floorY, walls: [] };
  }

  // 计算质心并扩展所有点
  const centroid = calcCentroid(points);
  const expandedPoints = points.map((p) => expandPoint(p, centroid, expandDistance));

  for (let i = 0; i < expandedPoints.length; i++) {
    const start = expandedPoints[i];
    const end = expandedPoints[(i + 1) % expandedPoints.length];

    walls.push({
      end: [end.x, end.z],
      id: `wall_${i}`,
      start: [start.x, start.z],
    });
  }

  return { defaultHeight: wallHeight, floorY, walls };
}

/** 计算多边形质心 */
function calcCentroid(points: BoundaryPoint[]): { x: number; z: number } {
  const sum = points.reduce(
    (acc, p) => ({ x: acc.x + p.x, z: acc.z + p.z }),
    { x: 0, z: 0 }
  );

  return { x: sum.x / points.length, z: sum.z / points.length };
}

/** 将点向外扩展（远离质心方向） */
function expandPoint(
  point: BoundaryPoint,
  centroid: { x: number; z: number },
  distance: number
): { x: number; z: number } {
  const dx = point.x - centroid.x;
  const dz = point.z - centroid.z;
  const len = Math.sqrt(dx * dx + dz * dz);

  if (len === 0) {
    return { x: point.x, z: point.z };
  }

  // 沿远离质心的方向扩展
  return {
    x: point.x + (dx / len) * distance,
    z: point.z + (dz / len) * distance,
  };
}
