import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";

import { BoundaryEditor } from "./BoundaryEditor";
import { CameraController } from "./CameraController";
import { DemandRenderingController } from "./DemandRenderingController";
import { InteractionPointDisplay } from "./InteractionPointDisplay";
import { InteractionPointEditor } from "./InteractionPointEditor";
import { Interactable } from "./InteractionSystem";
import { MobileControls } from "./MobileControls";
import { PlayerController } from "./PlayerController";
import { SplatMeshComponent } from "./SplatMeshComponent";
import type { BoundaryPoint, InteractionCallbacks, InteractionPoint, SceneConfig } from "./types";
import { WallColliders } from "./WallColliders";

interface BoundaryEditorConfig {
  closed: boolean;
  points: BoundaryPoint[];
}

interface InteractionPointEditorConfig {
  /** 是否启用编辑模式 */
  enabled: boolean;
}

interface InteractionPointDisplayConfig {
  /** 地面Y坐标，用于光圈位置 */
  groundY?: number;
  /** 交互回调，传递点ID和完整的交互点数据 */
  onInteract?: (pointId: string, point: InteractionPoint) => void;
  /** 要显示的交互点列表 */
  points: InteractionPoint[];
}

interface GaussSplattingSceneProps {
  /** Optional boundary editor configuration for editing mode */
  boundaryEditor?: BoundaryEditorConfig;
  callbacks?: InteractionCallbacks;
  /**
   * 摄像机相对于玩家的高度偏移
   * Camera height offset from player position (eye level)
   */
  cameraHeight?: number;
  config: SceneConfig;
  /** 显示半透明调试墙面 */
  debugWalls?: boolean;
  /** 交互点显示配置 */
  interactionPointDisplay?: InteractionPointDisplayConfig;
  /** 交互点编辑器配置 */
  interactionPointEditor?: InteractionPointEditorConfig;
  style?: React.CSSProperties;
}

export function GaussSplattingScene({ boundaryEditor, callbacks, cameraHeight, config, debugWalls = false, interactionPointDisplay, interactionPointEditor, style }: GaussSplattingSceneProps) {
  return (
    <div
      style={{
        background: "#000",
        height: "calc(var(--ios-lvh, 100dvh) + var(--ios-blur-offset, 0px))",
        left: 0,
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex: 0,
        ...style,
      }}
    >
      <Canvas
        camera={{ far: 1000, fov: 60, near: 0.1, position: [0, 1.6, 0] }}
        frameloop="demand"
        gl={{
          alpha: false,
          antialias: false,
          depth: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
      >
        {/* 按需渲染控制器 - 场景静止时暂停渲染 */}
        <DemandRenderingController />

        <Suspense fallback={null}>
          {/* Gaussian Splatting Background */}
          <SplatMeshComponent url={config.splatUrl} />

          <Physics gravity={[0, -9.81, 0]}>
            {config.walls && <WallColliders config={config.walls} debug={debugWalls} />}

            {/* Player Controller with Physics */}
            <PlayerController cameraHeight={cameraHeight} />

            {/* Interactable Objects */}
            {config.interactables.map((obj) => (
              <Interactable
                key={obj.id}
                modelUrl={obj.modelUrl}
                onEnter={() => callbacks?.onEnter?.(obj.id)}
                onExit={() => callbacks?.onExit?.(obj.id)}
                onInteract={() => callbacks?.onInteract?.(obj.id)}
                position={obj.position}
                rotation={obj.rotation}
                scale={obj.scale}
                triggerDistance={obj.triggerDistance}
              />
            ))}
          </Physics>

          {/* Camera Controls for mouse/touch look */}
          <CameraController />

          {/* Boundary Editor visualization */}
          {boundaryEditor && (
            <BoundaryEditor
              closed={boundaryEditor.closed}
              points={boundaryEditor.points}
            />
          )}

          {/* Interaction Point Editor (配置模式下的光标) */}
          {interactionPointEditor?.enabled && <InteractionPointEditor />}

          {/* Interaction Point Display (显示已保存的交互点) */}
          {interactionPointDisplay && (
            <InteractionPointDisplay
              groundY={interactionPointDisplay.groundY}
              onInteract={interactionPointDisplay.onInteract}
              points={interactionPointDisplay.points}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Mobile virtual joysticks overlay */}
      <MobileControls />
    </div>
  );
}

// Re-export utilities
export { boundaryToWalls } from "./boundaryUtils";
export { setInputDisabled } from "./inputState";
export { getCursorWorldPosition } from "./InteractionPointEditor";
export { getPlayerPosition } from "./playerState";

// Re-export types for convenience
export type {
  BoundaryConfig,
  BoundaryPoint,
  DialogContent,
  InteractableConfig,
  InteractionAction,
  InteractionActionType,
  InteractionCallbacks,
  InteractionPoint,
  InteractionPointConfig,
  MapActionConfig,
  PanelActionType,
  SceneConfig,
  SceneSwitchConfig,
  Wall,
  WallConfig,
} from "./types";
