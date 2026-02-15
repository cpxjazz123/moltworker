import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface InteractionPointEditorProps {
  /** 光点相对于镜头的固定距离 */
  cursorDistance?: number;
  /** 获取当前光标位置的回调，用于外部组件读取 */
  onPositionUpdate?: (position: [number, number, number]) => void;
}

// 模块级状态，用于存储当前光标位置
let currentCursorPosition: [number, number, number] = [0, 0, 0];

/**
 * 获取当前光标世界坐标位置
 */
export function getCursorWorldPosition(): [number, number, number] {
  return [...currentCursorPosition] as [number, number, number];
}

/**
 * 交互点编辑器组件
 * 在配置模式下显示一个跟随镜头的白色光点
 */
export function InteractionPointEditor({
  cursorDistance = 1.5,
  onPositionUpdate,
}: InteractionPointEditorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  // 复用的向量对象，避免每帧分配
  const direction = useRef(new THREE.Vector3());
  const position = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!meshRef.current) return;

    // 获取镜头朝向
    camera.getWorldDirection(direction.current);

    // 计算光点位置：镜头位置 + 朝向 * 距离
    position.current
      .copy(camera.position)
      .add(direction.current.multiplyScalar(cursorDistance));

    // 更新光点位置
    meshRef.current.position.copy(position.current);

    // 更新模块级状态
    currentCursorPosition = [
      position.current.x,
      position.current.y,
      position.current.z,
    ];

    // 回调通知
    onPositionUpdate?.(currentCursorPosition);
  });

  return (
    <mesh ref={meshRef} renderOrder={1000}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial
        color="#ffffff"
        depthTest={false}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}
