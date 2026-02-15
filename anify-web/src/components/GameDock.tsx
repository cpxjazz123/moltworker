import { useNavigate } from "@tanstack/react-router";
import { Backpack, ClipboardList, Gamepad2, Map, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { usePanelStore } from "@/stores/panelStore";
import type { PanelType } from "@/types";

import { Dock, DockIcon } from "./ui/dock";

export function GameDock() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const openPanelStore = usePanelStore((state) => state.openPanel);
  const activePanel = usePanelStore((state) => state.activePanel);

  const openPanel = (type: PanelType) => {
    openPanelStore(type);
  };

  const iconStroke = (panelType: PanelType) =>
    activePanel?.panelType === panelType ? "url(#game-dock-gradient)" : "white";

  const handleGoHome = () => {
    setIsExiting(true);
  };

  const handleAnimationComplete = () => {
    if (isExiting) {
      navigate({ to: "/" });
    }
  };

  return (
    <motion.div
      style={{ position: "relative", zIndex: 9999 }}
      initial={{ y: -100, opacity: 0 }}
      animate={isExiting ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onAnimationComplete={handleAnimationComplete}
    >
      <svg height="0" style={{ position: "absolute" }} width="0">
        <defs>
          <linearGradient
            id="game-dock-gradient"
            gradientUnits="userSpaceOnUse"
            x1="12" x2="12" y1="2" y2="22"
          >
            <stop offset="11%" stopColor="#ffb60b" />
            <stop offset="55%" stopColor="#FFFF00" />
            <stop offset="88%" stopColor="#e5e4e2" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>
      </svg>

      <nav className="top-nav">
        <Dock direction="middle" iconMagnification={50}>
          {/* Character - 角色 */}
          <DockIcon onClick={() => openPanel('character')}>
            <div className="flex size-full items-center justify-center cursor-pointer">
              <User style={{ stroke: iconStroke('character') }} />
            </div>
          </DockIcon>

          {/* Inventory - 背包 */}
          <DockIcon onClick={() => openPanel('inventory')}>
            <div className="flex size-full items-center justify-center cursor-pointer">
              <Backpack style={{ stroke: iconStroke('inventory') }} />
            </div>
          </DockIcon>

          {/* Home - 回到首页 */}
          <DockIcon className="scale-130" onClick={handleGoHome}>
            <Gamepad2 style={{ stroke: "url(#game-dock-gradient)" }} />
          </DockIcon>

          {/* Tasks - 任务 */}
          <DockIcon onClick={() => openPanel('tasks')}>
            <div className="flex size-full items-center justify-center cursor-pointer">
              <ClipboardList style={{ stroke: iconStroke('tasks') }} />
            </div>
          </DockIcon>

          {/* Map - 地图 */}
          <DockIcon onClick={() => openPanel('map')}>
            <div className="flex size-full items-center justify-center cursor-pointer">
              <Map style={{ stroke: iconStroke('map') }} />
            </div>
          </DockIcon>
        </Dock>
      </nav>
    </motion.div>
  );
}
