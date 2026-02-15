import { createFileRoute, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { GameDock } from "@/components/GameDock";
import {
  GaussSplattingScene,
  type DialogContent,
  type InteractionPoint,
  type WallConfig,
} from "@/components/GaussSplattingScene";
import { InteractionDialog } from "@/components/InteractionDialog";
import { useTutorial } from "@/contexts/TutorialContext";
import { useWorld } from "@/contexts/WorldContext";
import { useSceneLoader } from "@/hooks/useSceneLoader";
import { usePanelStore } from "@/stores/panelStore";

interface ExploreSearch {
  area?: string;
  world?: string;
}

export const Route = createFileRoute("/_game/_trpg/explore")({
  component: ExplorePage,
  validateSearch: (search: Record<string, unknown>): ExploreSearch => ({
    area: typeof search.area === "string" ? search.area : undefined,
    world: typeof search.world === "string" ? search.world : undefined,
  }),
});

/**
 * 将 world-metadata 的 WallSegment[] 转换为 GaussSplattingScene 的 WallConfig
 */
function buildWallConfig(
  walls: { start: { x: number; y: number; z: number }; end: { x: number; y: number; z: number }; height: number }[],
  floorY: number,
): WallConfig {
  return {
    defaultHeight: walls[0]?.height ?? 3,
    floorY,
    walls: walls.map((w, i) => ({
      id: `wall-${i}`,
      start: [w.start.x, w.start.z] as [number, number],
      end: [w.end.x, w.end.z] as [number, number],
      height: w.height,
    })),
  };
}

/**
 * 将 world-metadata 的 SceneInteractionPoint[] 转换为 GaussSplattingScene 的 InteractionPoint[]
 */
function buildInteractionPoints(
  points: {
    id: string;
    name: string;
    position: { x: number; y: number; z: number };
    radius: number;
    icon?: string;
    imageUrl?: string;
    imageScale?: number;
    displayType?: 'default' | 'portrait' | 'navigation' | 'treasure';
    action: { type: string; target?: string; panel?: string; canTravel?: boolean };
  }[],
): InteractionPoint[] {
  return points.map((p) => ({
    id: p.id,
    label: p.name,
    position: [p.position.x, p.position.y, p.position.z] as [number, number, number],
    triggerDistance: p.radius,
    imageUrl: p.imageUrl,
    imageScale: p.imageScale,
    displayType: p.displayType,
    icon: p.icon,
    action: mapAction(p.action),
  }));
}

function mapAction(
  action: { type: string; target?: string; panel?: string; canTravel?: boolean },
): InteractionPoint["action"] {
  switch (action.type) {
    case "dialogue":
      return {
        type: "dialog",
        dialog: {
          title: "对话",
          contentType: "text" as const,
          text: `对话目标: ${action.target ?? "unknown"}`,
        },
      };
    case "scene-switch":
      return { type: "alert", message: `场景切换: ${action.target ?? "unknown"}` };
    case "open-map":
      return { type: "open-map", map: { canTravel: action.canTravel } };
    case "panel":
      return {
        type: "panel",
        panel: (action.panel ?? "shop") as "shop" | "forge" | "guild" | "inn",
      };
    default:
      return { type: "alert", message: `未知交互: ${action.type}` };
  }
}

function ExplorePage() {
  const { area: areaId, world: worldId } = useSearch({ from: "/_game/_trpg/explore" });
  const { currentWorldId, loadWorld } = useWorld();

  // Auto-switch world if needed
  useEffect(() => {
    if (worldId && worldId !== currentWorldId) {
      console.log(`[ExplorePage] Switching world from ${currentWorldId} to ${worldId}`);
      loadWorld(worldId).catch(err => console.error("Failed to switch world:", err));
    }
  }, [worldId, currentWorldId, loadWorld]);

  const { scene, areaName, isLoading, error } = useSceneLoader(areaId);
  const { isActive: isTutorialActive, currentStep, skipTutorial } = useTutorial();
  const { openPanel } = usePanelStore();

  const [dialogContent, setDialogContent] = useState<DialogContent | null>(null);
  const [showTutorialComplete, setShowTutorialComplete] = useState(false);

  // Handle tutorial completion when arriving at explore page
  useEffect(() => {
    if (isTutorialActive && (currentStep === "equipment_check" || currentStep === "explore_intro" || currentStep === "tutorial_complete")) {
      setShowTutorialComplete(true);
      const timer = setTimeout(() => {
        skipTutorial();
        setTimeout(() => {
          setShowTutorialComplete(false);
        }, 2000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isTutorialActive, currentStep, skipTutorial]);

  // 从场景配置构建 GaussSplattingScene 所需的 props
  const wallConfig = useMemo(
    () => (scene ? buildWallConfig(scene.walls, scene.floorY) : undefined),
    [scene],
  );

  const interactionPoints = useMemo(
    () => (scene ? buildInteractionPoints(scene.interactionPoints) : []),
    [scene],
  );

  const handleInteractionPointInteract = useCallback(
    (pointId: string, point: InteractionPoint) => {
      const action = point.action ?? { type: "alert" as const };

      switch (action.type) {
        case "alert":
          alert(action.message ?? `交互点 ${pointId} 被触发！`); // eslint-disable-line no-alert
          break;
        case "dialog":
          setDialogContent(action.dialog);
          break;
        case "scene-switch":
          console.log("Scene switch to:", action.scene); // eslint-disable-line no-console
          break;
        case "open-map":
          openPanel('map');
          break;
      }
    },
    [openPanel],
  );

  // 加载中状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">加载场景中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error || !scene) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center max-w-md px-6">
          <h2 className="text-xl font-bold text-white mb-2">场景加载失败</h2>
          <p className="text-white/60 mb-4">{error || "请先选择一个世界"}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", position: "relative", width: "100vw" }}>
      {/* 区域名称显示 */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg">
          <h1 className="text-white font-semibold">{areaName || scene.name}</h1>
        </div>
      </div>

      {/* 3D 场景 */}
      <GaussSplattingScene
        cameraHeight={scene.cameraHeight ?? scene.floorY + 0.88}
        config={{
          splatUrl: scene.splatUrl,
          walls: wallConfig,
          interactables: [],
        }}
        interactionPointDisplay={
          interactionPoints.length > 0
            ? {
              points: interactionPoints,
              groundY: scene.groundY ?? scene.floorY,
              onInteract: handleInteractionPointInteract,
            }
            : undefined
        }
      />

      {/* 游戏 Dock */}
      <AnimatePresence>
        <GameDock key="game-dock" />
      </AnimatePresence>

      {/* 交互对话框 */}
      {dialogContent && (
        <InteractionDialog
          content={dialogContent}
          onClose={() => setDialogContent(null)}
        />
      )}

      {/* Tutorial completion overlay */}
      <AnimatePresence>
        {showTutorialComplete && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(0, 0, 0, 0.7)" }}
          >
            <motion.div
              className="text-center px-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2
                className="text-3xl font-bold text-white mb-4"
                style={{
                  fontFamily: "Georgia, serif",
                  textShadow: "0 0 20px rgba(251, 191, 36, 0.8)",
                }}
              >
                Welcome to Twilight Forest
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Use the joystick to move and find Iris&apos;s marker
              </p>
              <motion.div
                className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                style={{
                  boxShadow: "0 0 30px rgba(251, 191, 36, 0.5)",
                }}
              >
                Tutorial Complete!
              </motion.div>
              <p className="text-white/60 text-sm mt-6">
                Your adventure begins now...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
