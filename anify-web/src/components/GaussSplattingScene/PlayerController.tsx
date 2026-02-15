import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, type RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { inputState } from "./inputState";
import { updatePlayerPosition } from "./playerState";

interface PlayerControllerProps {
  /**
   * 摄像机相对于玩家的高度偏移
   * Camera height offset from player position (eye level)
   */
  cameraHeight?: number;
  /**
   * 跳跃力度
   * Jump impulse strength
   */
  jumpForce?: number;
  /**
   * 移动速度（同时影响键盘和左摇杆）
   * Movement speed for both keyboard (WASD) and mobile left joystick
   */
  moveSpeed?: number;
  /** 玩家初始位置 */
  startPosition?: [number, number, number];
}

export function PlayerController({
  cameraHeight = 0.8,
  jumpForce = 3,
  moveSpeed = 1,
  startPosition = [0, 1, 0],
}: PlayerControllerProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { camera } = useThree();

  // Keyboard state
  const moveState = useRef({
    backward: false,
    forward: false,
    jump: false,
    left: false,
    right: false,
  });

  // Track if player can jump (grounded check)
  const canJump = useRef(true);

  // Setup keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowDown":
        case "KeyS":
          moveState.current.backward = true;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveState.current.left = true;
          break;
        case "ArrowRight":
        case "KeyD":
          moveState.current.right = true;
          break;
        case "ArrowUp":
        case "KeyW":
          moveState.current.forward = true;
          break;
        case "Space":
          moveState.current.jump = true;
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowDown":
        case "KeyS":
          moveState.current.backward = false;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveState.current.left = false;
          break;
        case "ArrowRight":
        case "KeyD":
          moveState.current.right = false;
          break;
        case "ArrowUp":
        case "KeyW":
          moveState.current.forward = false;
          break;
        case "Space":
          moveState.current.jump = false;
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Update physics and camera each frame
  useFrame(() => {
    if (!rigidBodyRef.current) {return;}

    // Get current velocity (preserve Y for gravity)
    const currentVelocity = rigidBodyRef.current.linvel();

    // Check if grounded (Y velocity near zero means on ground)
    const isGrounded = Math.abs(currentVelocity.y) < 0.1;

    if (isGrounded) {
      canJump.current = true;
    }

    // If input is disabled, stop horizontal movement but preserve gravity
    if (inputState.disabled) {
      rigidBodyRef.current.setLinvel(
        { x: 0, y: currentVelocity.y, z: 0 },
        true,
      );

      // Still sync camera position
      const position = rigidBodyRef.current.translation();
      camera.position.set(position.x, position.y + cameraHeight, position.z);
      updatePlayerPosition(position.x, position.y, position.z);
      return;
    }

    // Get camera forward direction (horizontal only)
    const forward = new THREE.Vector3();

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    // Get right direction
    const right = new THREE.Vector3();

    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    // Calculate movement direction from keyboard
    const moveDirection = new THREE.Vector3();

    if (moveState.current.forward) {
      moveDirection.add(forward);
    }

    if (moveState.current.backward) {
      moveDirection.sub(forward);
    }

    if (moveState.current.right) {
      moveDirection.add(right);
    }

    if (moveState.current.left) {
      moveDirection.sub(right);
    }

    // Add mobile joystick input (inputState.move is -1 to 1)
    // Note: joystick Y is inverted (up = negative screen Y = forward)
    if (inputState.move.x !== 0 || inputState.move.y !== 0) {
      moveDirection.addScaledVector(right, inputState.move.x);
      moveDirection.addScaledVector(forward, -inputState.move.y);
    }

    if (moveDirection.length() > 0) {
      moveDirection.normalize();
    }

    // Handle jump (keyboard or mobile button)
    let newYVelocity = currentVelocity.y;
    const jumpRequested = moveState.current.jump || inputState.jump;

    if (jumpRequested && canJump.current && isGrounded) {
      newYVelocity = jumpForce;
      canJump.current = false;
    }

    // Consume mobile jump signal (one-shot)
    if (inputState.jump) {
      inputState.jump = false;
    }

    // Sprint multiplier (mobile run button)
    const speed = inputState.run ? moveSpeed * 2 : moveSpeed;

    // Apply movement velocity
    rigidBodyRef.current.setLinvel(
      {
        x: moveDirection.x * speed,
        y: newYVelocity,
        z: moveDirection.z * speed,
      },
      true,
    );

    // Sync camera position with rigid body (eye height offset)
    const position = rigidBodyRef.current.translation();

    camera.position.set(position.x, position.y + cameraHeight, position.z);

    // Update shared player state for boundary editor
    updatePlayerPosition(position.x, position.y, position.z);
  });

  return (
    <RigidBody
      colliders={false}
      lockRotations
      mass={1}
      position={startPosition}
      ref={rigidBodyRef}
      type="dynamic"
    >
      {/* Capsule collider: half-height 0.5, radius 0.3 */}
      <CapsuleCollider args={[0.5, 0.3]} />
    </RigidBody>
  );
}
