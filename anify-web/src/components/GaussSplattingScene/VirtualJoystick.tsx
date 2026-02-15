import { useCallback, useEffect, useRef, useState } from "react";

interface VirtualJoystickProps {
  /** Base color */
  baseColor?: string;
  /** Knob color */
  knobColor?: string;
  /** Called when joystick is released */
  onEnd?: () => void;
  /** Called continuously while joystick is active with normalized values (-1 to 1) */
  onMove?: (x: number, y: number) => void;
  /** Position on screen */
  position: "left" | "right";
  /** Joystick base size in pixels */
  size?: number;
}

export function VirtualJoystick({
  baseColor = "rgba(255, 255, 255, 0.2)",
  knobColor = "rgba(255, 255, 255, 0.5)",
  onEnd,
  onMove,
  position,
  size = 120,
}: VirtualJoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const activeTouchId = useRef<null | number>(null);
  const centerRef = useRef({ x: 0, y: 0 });

  const knobSize = size * 0.4;
  const maxDistance = (size - knobSize) / 2;

  const updateKnobPosition = useCallback(
    (clientX: number, clientY: number) => {
      const deltaX = clientX - centerRef.current.x;
      const deltaY = clientY - centerRef.current.y;

      // Calculate distance from center
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Clamp to max distance
      let clampedX = deltaX;
      let clampedY = deltaY;

      if (distance > maxDistance) {
        const scale = maxDistance / distance;

        clampedX = deltaX * scale;
        clampedY = deltaY * scale;
      }

      setKnobOffset({ x: clampedX, y: clampedY });

      // Normalize to -1 to 1 range
      const normalizedX = clampedX / maxDistance;
      const normalizedY = clampedY / maxDistance;

      onMove?.(normalizedX, normalizedY);
    },
    [maxDistance, onMove],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (activeTouchId.current !== null) {return;}

      const touch = e.changedTouches[0];
      const rect = containerRef.current?.getBoundingClientRect();

      if (!rect) {return;}

      activeTouchId.current = touch.identifier;
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      setIsActive(true);
      updateKnobPosition(touch.clientX, touch.clientY);
    },
    [updateKnobPosition],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (activeTouchId.current === null) {return;}

      for (const touch of Array.from(e.touches)) {
        if (touch.identifier === activeTouchId.current) {
          updateKnobPosition(touch.clientX, touch.clientY);
          break;
        }
      }
    },
    [updateKnobPosition],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (activeTouchId.current === null) {return;}

      // Check if our touch ended
      let touchStillActive = false;

      for (const touch of Array.from(e.touches)) {
        if (touch.identifier === activeTouchId.current) {
          touchStillActive = true;
          break;
        }
      }

      if (!touchStillActive) {
        activeTouchId.current = null;
        setIsActive(false);
        setKnobOffset({ x: 0, y: 0 });
        onEnd?.();
      }
    },
    [onEnd],
  );

  useEffect(() => {
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd]);

  return (
    <div
      onTouchStart={handleTouchStart}
      ref={containerRef}
      style={{
        alignItems: "center",
        background: baseColor,
        borderRadius: "50%",
        bottom: "40px",
        display: "flex",
        height: `${size}px`,
        justifyContent: "center",
        left: position === "left" ? "40px" : undefined,
        position: "fixed",
        right: position === "right" ? "40px" : undefined,
        touchAction: "none",
        userSelect: "none",
        width: `${size}px`,
        zIndex: 1000,
      }}
    >
      {/* Knob */}
      <div
        style={{
          background: isActive ? "rgba(255, 255, 255, 0.8)" : knobColor,
          borderRadius: "50%",
          height: `${knobSize}px`,
          pointerEvents: "none",
          transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
          transition: isActive ? "none" : "transform 0.1s ease-out",
          width: `${knobSize}px`,
        }}
      />
    </div>
  );
}
