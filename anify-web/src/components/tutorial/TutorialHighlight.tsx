import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface TutorialHighlightProps {
  targetId: string | string[];
  padding?: number;
}

// Calculate merged bounding rect for multiple elements
function getMergedRect(ids: string[]): DOMRect | null {
  const rects = ids
    .map((id) => document.getElementById(id)?.getBoundingClientRect())
    .filter((r): r is DOMRect => r !== null);

  if (rects.length === 0) return null;

  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.right));
  const bottom = Math.max(...rects.map((r) => r.bottom));

  return new DOMRect(left, top, right - left, bottom - top);
}

export function TutorialHighlight({ targetId, padding = 8 }: TutorialHighlightProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const targetIds = Array.isArray(targetId) ? targetId : [targetId];

  useEffect(() => {
    const updateRect = () => {
      setRect(getMergedRect(targetIds));
    };

    updateRect();

    // Update on resize and scroll
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect);

    // Also set up a MutationObserver to detect when the element appears
    const observer = new MutationObserver(updateRect);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
      observer.disconnect();
    };
  }, [targetIds.join(",")]);

  if (!rect) return null;

  return (
    <>
      {/* Overlay with cutout */}
      <div
        className="fixed inset-0 z-[10000] pointer-events-none"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          maskImage: `radial-gradient(ellipse ${rect.width + padding * 2}px ${rect.height + padding * 2}px at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px, transparent 50%, black 51%)`,
          WebkitMaskImage: `radial-gradient(ellipse ${rect.width + padding * 2}px ${rect.height + padding * 2}px at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px, transparent 50%, black 51%)`,
        }}
      />

      {/* Pulsing ring around target */}
      <motion.div
        className="fixed z-[10000] pointer-events-none rounded-full"
        style={{
          left: rect.left - padding,
          top: rect.top - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        }}
        initial={{ boxShadow: "0 0 0 0 rgba(251, 191, 36, 0.6)" }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(251, 191, 36, 0.6)",
            "0 0 0 8px rgba(251, 191, 36, 0)",
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />

      {/* Border glow */}
      <div
        className="fixed z-[10000] pointer-events-none rounded-full border-2 border-amber-400"
        style={{
          left: rect.left - padding,
          top: rect.top - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
          boxShadow: "0 0 20px rgba(251, 191, 36, 0.5), inset 0 0 20px rgba(251, 191, 36, 0.2)",
        }}
      />
    </>
  );
}

export function getTargetRect(targetId: string | string[]): DOMRect | null {
  const ids = Array.isArray(targetId) ? targetId : [targetId];
  return getMergedRect(ids);
}
