import { useCallback, useEffect, useState } from "react";

import {
  resetMoveInput,
  setMoveInput,
  setRunning,
  triggerInteract,
  triggerJump,
} from "./inputState";
import { VirtualJoystick } from "./VirtualJoystick";

interface MobileControlsProps {
  /** Joystick size in pixels */
  joystickSize?: number;
}

const RUN_ICON_URL = "/assets/icons/run.svg";
const JUMP_ICON_URL = "/assets/icons/jump.svg";
const TAP_ICON_URL = "/assets/icons/tap.svg";

const ACTION_BTN_SIZE = 52;
const ACTION_BTN_GAP = 14;

/** Shared styles for action buttons */
const baseBtnStyle: React.CSSProperties = {
  alignItems: "center",
  backdropFilter: "blur(4px)",
  border: "1.5px solid rgba(255, 255, 255, 0.25)",
  borderRadius: "50%",
  display: "flex",
  flexShrink: 0,
  height: ACTION_BTN_SIZE,
  justifyContent: "center",
  minHeight: ACTION_BTN_SIZE,
  minWidth: ACTION_BTN_SIZE,
  padding: 0,
  pointerEvents: "auto",
  touchAction: "none",
  width: ACTION_BTN_SIZE,
};

export function MobileControls({ joystickSize = 120 }: MobileControlsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const hasTouchScreen =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error - msMaxTouchPoints is IE-specific
        navigator.msMaxTouchPoints > 0;

      const isSmallScreen = window.innerWidth <= 1024;

      setIsMobile(hasTouchScreen && isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleRunStart = useCallback(() => {
    setIsRunning(true);
    setRunning(true);
  }, []);

  const handleRunEnd = useCallback(() => {
    setIsRunning(false);
    setRunning(false);
  }, []);

  const handleJump = useCallback(() => {
    triggerJump();
  }, []);

  const handleInteract = useCallback(() => {
    triggerInteract();
  }, []);

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Left joystick - Movement */}
      <VirtualJoystick
        onEnd={resetMoveInput}
        onMove={(x, y) => setMoveInput(x, y)}
        position="left"
        size={joystickSize}
      />

      {/* Right side - Action buttons */}
      <div
        style={{
          bottom: 40,
          display: "flex",
          flexDirection: "column",
          gap: ACTION_BTN_GAP,
          pointerEvents: "none",
          position: "fixed",
          right: 28,
          zIndex: 1000,
        }}
      >
        {/* Interact button (top) */}
        <button
          aria-label="交互"
          onTouchStart={(e) => {
            e.stopPropagation();
            handleInteract();
          }}
          style={{
            ...baseBtnStyle,
            background: "rgba(255, 255, 255, 0.15)",
          }}
          type="button"
        >
          <img
            alt="交互"
            src={TAP_ICON_URL}
            style={{
              flexShrink: 0,
              height: 28,
              objectFit: "contain",
              width: 28,
            }}
          />
        </button>

        {/* Jump button (middle) */}
        <button
          aria-label="跳跃"
          onTouchStart={(e) => {
            e.stopPropagation();
            handleJump();
          }}
          style={{
            ...baseBtnStyle,
            background: "rgba(255, 255, 255, 0.15)",
          }}
          type="button"
        >
          <img
            alt="跳跃"
            src={JUMP_ICON_URL}
            style={{
              flexShrink: 0,
              height: 36,
              objectFit: "contain",
              width: 36,
            }}
          />
        </button>

        {/* Run button - hold to sprint (bottom) */}
        <button
          aria-label="奔跑"
          onTouchEnd={(e) => {
            e.stopPropagation();
            handleRunEnd();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleRunStart();
          }}
          style={{
            ...baseBtnStyle,
            background: isRunning
              ? "rgba(251, 191, 36, 0.4)"
              : "rgba(255, 255, 255, 0.15)",
            boxShadow: isRunning
              ? "0 0 12px rgba(251, 191, 36, 0.5)"
              : "none",
          }}
          type="button"
        >
          <img
            alt="奔跑"
            src={RUN_ICON_URL}
            style={{
              filter: isRunning ? "brightness(1.2) sepia(1) saturate(3) hue-rotate(10deg)" : "none",
              flexShrink: 0,
              height: 26,
              objectFit: "contain",
              width: 26,
            }}
          />
        </button>
      </div>
    </>
  );
}
