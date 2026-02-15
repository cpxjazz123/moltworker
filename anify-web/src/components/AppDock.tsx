import { Link, type LinkProps, useNavigate } from "@tanstack/react-router";
import { CircleUserRound, Gamepad2, Home, Images, Settings } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { useTutorial } from "@/contexts/TutorialContext";

import { Dock, DockIcon } from "./ui/dock";

// NavLink component for active state detection
interface NavLinkProps extends Omit<LinkProps, "children"> {
  children: (isActive: boolean) => React.ReactNode;
}

function NavLink({ children, ...props }: NavLinkProps) {
  return (
    <Link className="flex size-full items-center justify-center" {...props}>
      {({ isActive }: { isActive: boolean }) => children(isActive)}
    </Link>
  );
}

// SVG gradient definition for active icons
const GRADIENT_ID = "dock-icon-gradient";
const GRADIENT_ACTIVE_ID = "dock-icon-gradient-active";

function DockGradientDefs() {
  return (
    <svg height="0" width="0" style={{ position: "absolute" }}>
      <defs>
        {/* Default white gradient for inactive icons */}
        <linearGradient id={GRADIENT_ID} gradientUnits="userSpaceOnUse" x1="12" x2="12" y1="2" y2="22">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.6)" />
        </linearGradient>
        {/* Active gradient with gold highlight effect */}
        <linearGradient id={GRADIENT_ACTIVE_ID} gradientUnits="userSpaceOnUse" x1="12" x2="12" y1="2" y2="22">
          <stop offset="11%" stopColor="#ffb60b" />
          <stop offset="55%" stopColor="#FFFF00" />
          <stop offset="88%" stopColor="#e5e4e2" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Helper to get stroke style based on active state
function getIconStroke(isActive: boolean) {
  return isActive ? `url(#${GRADIENT_ACTIVE_ID})` : `url(#${GRADIENT_ID})`;
}

export function AppDock() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const { isActive: isTutorialActive, currentStep, advanceStep } = useTutorial();

  const handleGoExplore = () => {
    if (isTutorialActive && currentStep === "explore_intro") {
      advanceStep();
    }
    setIsExiting(true);
  };

  const handleGoMe = (e: React.MouseEvent) => {
    if (isTutorialActive && currentStep === "equipment_check") {
      e.preventDefault();
      navigate({ to: "/me" });
    }
  };

  const handleAnimationComplete = () => {
    if (isExiting) {
      navigate({ to: "/explore" });
    }
  };

  return (
    <motion.div
      style={{ position: "relative", zIndex: 9999 }}
      initial={{ y: 100, opacity: 0 }}
      animate={isExiting ? { y: 100, opacity: 0 } : { y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onAnimationComplete={handleAnimationComplete}
    >
      <DockGradientDefs />

      <nav className="bottom-nav">
        <Dock direction="middle" iconMagnification={50}>
          <DockIcon>
            <NavLink activeOptions={{ exact: true }} to="/">
              {(isActive) => <Home style={{ stroke: getIconStroke(isActive) }} />}
            </NavLink>
          </DockIcon>
          <DockIcon>
            <NavLink to="/memories">
              {(isActive) => <Images style={{ stroke: getIconStroke(isActive) }} />}
            </NavLink>
          </DockIcon>
          <DockIcon id="dock-explore" className="scale-130" onClick={handleGoExplore}>
            <Gamepad2 style={{ stroke: `url(#${GRADIENT_ID})` }} />
          </DockIcon>
          <DockIcon id="dock-me" onClick={handleGoMe}>
            <NavLink to="/me">
              {(isActive) => <CircleUserRound style={{ stroke: getIconStroke(isActive) }} />}
            </NavLink>
          </DockIcon>
          <DockIcon>
            <NavLink to="/settings">
              {(isActive) => <Settings style={{ stroke: getIconStroke(isActive) }} />}
            </NavLink>
          </DockIcon>
        </Dock>
      </nav>
    </motion.div>
  );
}
