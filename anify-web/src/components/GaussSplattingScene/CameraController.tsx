import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { inputState } from "./inputState";

interface CameraControllerProps {
  /** 最大俯仰角（弧度） */
  maxPitch?: number;
  /**
   * 桌面端鼠标拖拽灵敏度（视角旋转）
   * Desktop: Mouse drag sensitivity for view rotation
   */
  rotateSpeed?: number;
}

export function CameraController({
  maxPitch = Math.PI / 2.1,
  rotateSpeed = 0.002,
}: CameraControllerProps) {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const activeTouchId = useRef<null | number>(null);
  const lastTouchPos = useRef({ x: 0, y: 0 });

  // Desktop: Mouse drag controls
  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || inputState.disabled) {
        return;
      }

      const deltaX = e.clientX - lastPos.current.x;
      const deltaY = e.clientY - lastPos.current.y;

      yaw.current -= deltaX * rotateSpeed;
      pitch.current = Math.max(
        -maxPitch,
        Math.min(maxPitch, pitch.current - deltaY * rotateSpeed),
      );
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [gl, rotateSpeed, maxPitch]);

  // Mobile: Touch drag controls
  // Sensitivity: half screen width = 90°, half screen height = 60°
  useEffect(() => {
    const canvas = gl.domElement;

    const onTouchStart = (e: TouchEvent) => {
      if (activeTouchId.current !== null || inputState.disabled) {return;}

      const touch = e.changedTouches[0];
      activeTouchId.current = touch.identifier;
      lastTouchPos.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (activeTouchId.current === null || inputState.disabled) {return;}

      for (const touch of Array.from(e.changedTouches)) {
        if (touch.identifier === activeTouchId.current) {
          const deltaX = touch.clientX - lastTouchPos.current.x;
          const deltaY = touch.clientY - lastTouchPos.current.y;

          // π radians per screenWidth pixels (half screen = 90°)
          const yawSensitivity = Math.PI / window.innerWidth;
          // 2π/3 radians per screenHeight pixels (half screen = 60°)
          const pitchSensitivity = (2 * Math.PI) / (3 * window.innerHeight);

          yaw.current -= deltaX * yawSensitivity;
          pitch.current = Math.max(
            -maxPitch,
            Math.min(maxPitch, pitch.current - deltaY * pitchSensitivity),
          );

          lastTouchPos.current = { x: touch.clientX, y: touch.clientY };
          break;
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (activeTouchId.current === null) {return;}

      let touchStillActive = false;
      for (const touch of Array.from(e.touches)) {
        if (touch.identifier === activeTouchId.current) {
          touchStillActive = true;
          break;
        }
      }

      if (!touchStillActive) {
        activeTouchId.current = null;
      }
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [gl, maxPitch]);

  useFrame(() => {
    // Skip camera rotation if input is disabled
    if (inputState.disabled) {
      return;
    }

    const euler = new THREE.Euler(pitch.current, yaw.current, 0, "YXZ");

    camera.quaternion.setFromEuler(euler);
  });

  return null;
}
