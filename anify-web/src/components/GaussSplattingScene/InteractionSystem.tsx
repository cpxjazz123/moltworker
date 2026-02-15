import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface InteractableProps {
  modelUrl: string;
  onEnter?: () => void;
  onExit?: () => void;
  onInteract?: () => void;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  triggerDistance: number;
}

export function Interactable({
  modelUrl,
  onEnter,
  onExit,
  onInteract,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  triggerDistance,
}: InteractableProps) {
  const { scene } = useGLTF(modelUrl);
  const meshRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [isInRange, setIsInRange] = useState(false);
  const wasInRangeRef = useRef(false);

  // Temp vector for world position calculation (avoid allocation in loop)
  const tempWorldPos = useRef(new THREE.Vector3());

  // Check distance each frame
  useFrame(() => {
    if (!meshRef.current) {return;}

    meshRef.current.getWorldPosition(tempWorldPos.current);
    const distance = camera.position.distanceTo(tempWorldPos.current);
    const nowInRange = distance <= triggerDistance;

    if (nowInRange !== wasInRangeRef.current) {
      wasInRangeRef.current = nowInRange;
      setIsInRange(nowInRange);

      if (nowInRange) {
        onEnter?.();
      } else {
        onExit?.();
      }
    }
  });

  // E key interaction (desktop)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyE" && isInRange) {
        onInteract?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isInRange, onInteract]);

  return (
    <RigidBody colliders="trimesh" position={position} type="fixed">
      <group ref={meshRef} rotation={rotation} scale={scale}>
        <primitive object={scene.clone()} />
      </group>
    </RigidBody>
  );
}
