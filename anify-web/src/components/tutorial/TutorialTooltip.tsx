import { motion } from "motion/react";

interface TutorialTooltipProps {
  message: string;
  position?: "top" | "bottom" | "left" | "right";
  targetRect?: DOMRect | null;
}

export function TutorialTooltip({
  message,
  position = "top",
  targetRect,
}: TutorialTooltipProps) {
  // Calculate position based on target element
  const getPositionStyles = () => {
    if (!targetRect) {
      return {
        left: "50%",
        bottom: "120px",
        transform: "translateX(-50%)",
      };
    }

    const padding = 12;

    switch (position) {
      case "top":
        return {
          left: `${targetRect.left + targetRect.width / 2}px`,
          top: `${targetRect.top - padding}px`,
          transform: "translate(-50%, -100%)",
        };
      case "bottom":
        return {
          left: `${targetRect.left + targetRect.width / 2}px`,
          top: `${targetRect.bottom + padding}px`,
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          left: `${targetRect.left - padding}px`,
          top: `${targetRect.top + targetRect.height / 2}px`,
          transform: "translate(-100%, -50%)",
        };
      case "right":
        return {
          left: `${targetRect.right + padding}px`,
          top: `${targetRect.top + targetRect.height / 2}px`,
          transform: "translateY(-50%)",
        };
      default:
        return {
          left: "50%",
          bottom: "120px",
          transform: "translateX(-50%)",
        };
    }
  };

  const getArrowStyles = () => {
    switch (position) {
      case "top":
        return "bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-transparent border-t-amber-500/80";
      case "bottom":
        return "top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-transparent border-b-amber-500/80";
      case "left":
        return "right-0 top-1/2 translate-x-full -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-amber-500/80";
      case "right":
        return "left-0 top-1/2 -translate-x-full -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-amber-500/80";
      default:
        return "";
    }
  };

  return (
    <motion.div
      className="fixed z-[10001] pointer-events-none"
      style={getPositionStyles()}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className="relative px-4 py-3 rounded-xl max-w-[250px] text-center"
        style={{
          background: "linear-gradient(135deg, rgba(251, 191, 36, 0.9), rgba(245, 158, 11, 0.9))",
          boxShadow: "0 4px 20px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.2)",
        }}
      >
        <p className="text-sm font-medium text-black">{message}</p>
        {/* Arrow */}
        <div
          className={`absolute w-0 h-0 border-8 ${getArrowStyles()}`}
        />
      </div>
    </motion.div>
  );
}
