import { Line } from "@react-three/drei";
import { useMemo } from "react";

import type { BoundaryPoint } from "./types";

interface BoundaryEditorProps {
  /** Whether the boundary loop is closed */
  closed: boolean;
  /** Height at which to render the boundary visualization */
  displayHeight?: number;
  /** Ordered list of boundary points */
  points: BoundaryPoint[];
}

const COLORS = {
  closedLine: "#3b82f6",    // Blue when closed
  closedPoint: "#60a5fa",   // Light blue point when closed
  openLine: "#22c55e",      // Green when editing
  openPoint: "#4ade80",     // Light green point when editing
  pendingLine: "#ef4444",   // Red for unclosed gap
};

const POINT_RADIUS = 0.15;

export function BoundaryEditor({ closed, displayHeight = 0.5, points }: BoundaryEditorProps) {
  // Convert 2D boundary points to 3D positions for rendering
  const linePoints = useMemo(() => {
    if (points.length < 2) {
      return null;
    }

    const pts: Array<[number, number, number]> = points.map((p) => [p.x, displayHeight, p.z]);

    if (closed && points.length >= 3) {
      // Add first point to close the loop
      pts.push([points[0].x, displayHeight, points[0].z]);
    }

    return pts;
  }, [points, displayHeight, closed]);

  // Points for the unclosed gap (first to last) when not closed
  const pendingLinePoints = useMemo(() => {
    if (closed || points.length < 3) {
      return null;
    }

    const first = points[0];
    const last = points[points.length - 1];

    return [
      [first.x, displayHeight, first.z] as [number, number, number],
      [last.x, displayHeight, last.z] as [number, number, number],
    ];
  }, [points, displayHeight, closed]);

  const lineColor = closed ? COLORS.closedLine : COLORS.openLine;
  const pointColor = closed ? COLORS.closedPoint : COLORS.openPoint;

  return (
    <group>
      {/* Render boundary line segments */}
      {linePoints && (
        <Line
          color={lineColor}
          lineWidth={3}
          points={linePoints}
        />
      )}

      {/* Render pending closure line (dashed) */}
      {pendingLinePoints && (
        <Line
          color={COLORS.pendingLine}
          dashed
          dashScale={2}
          dashSize={0.3}
          gapSize={0.2}
          lineWidth={2}
          points={pendingLinePoints}
        />
      )}

      {/* Render boundary point markers */}
      {points.map((point) => (
        <mesh
          key={point.id}
          position={[point.x, displayHeight, point.z]}
          renderOrder={1000}
        >
          <sphereGeometry args={[POINT_RADIUS, 16, 16]} />
          <meshBasicMaterial color={pointColor} depthTest={false} />
        </mesh>
      ))}
    </group>
  );
}
