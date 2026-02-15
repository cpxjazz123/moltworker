import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";

import type { Wall, WallConfig } from "./types";

interface WallCollidersProps {
  config: WallConfig;
  /** 显示半透明调试墙面 */
  debug?: boolean;
  /** 地板范围（用于生成地板碰撞体） */
  floorSize?: [number, number];
}

const WALL_THICKNESS = 0.1;
const FLOOR_THICKNESS = 0.1;

/** 计算墙面的几何属性 */
const calcWallGeometry = (wall: Wall, floorY: number, defaultHeight: number) => {
  const [x1, z1] = wall.start;
  const [x2, z2] = wall.end;
  const dx = x2 - x1;
  const dz = z2 - z1;

  const length = Math.sqrt(dx * dx + dz * dz);
  const height = wall.height ?? defaultHeight;

  return {
    angle: Math.atan2(dx, dz),
    height,
    length,
    position: [(x1 + x2) / 2, floorY + height / 2, (z1 + z2) / 2] as [number, number, number],
  };
};

export function WallColliders({ config, debug = false, floorSize = [100, 100] }: WallCollidersProps) {
  const { defaultHeight, floorY, walls } = config;

  // 预计算所有墙面的几何数据
  const wallGeometries = useMemo(
    () => walls.map((wall) => ({ id: wall.id, ...calcWallGeometry(wall, floorY, defaultHeight) })),
    [walls, floorY, defaultHeight]
  );

  return (
    <RigidBody colliders={false} type="fixed">
      <CuboidCollider
        args={[floorSize[0] / 2, FLOOR_THICKNESS, floorSize[1] / 2]}
        position={[0, floorY, 0]}
      />

      {wallGeometries.map(({ angle, height, id, length, position }) => (
        <group key={id}>
          <CuboidCollider
            args={[WALL_THICKNESS, height / 2, length / 2]}
            position={position}
            rotation={[0, angle, 0]}
          />
          {debug && (
            <mesh position={position} renderOrder={999} rotation={[0, angle, 0]}>
              <boxGeometry args={[WALL_THICKNESS * 2, height, length]} />
              <meshBasicMaterial color="#FFF" depthTest={false} opacity={0.3} transparent />
            </mesh>
          )}
        </group>
      ))}
    </RigidBody>
  );
}
