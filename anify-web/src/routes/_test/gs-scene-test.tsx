import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import {
  boundaryToWalls,
  type BoundaryPoint,
  GaussSplattingScene,
  getCursorWorldPosition,
  getPlayerPosition,
  type InteractionPoint,
  type InteractionPointConfig,
  type WallConfig,
  type DialogContent,
  type InteractionAction,
  type InteractionActionType,
  type SceneSwitchConfig,
} from "../../components/GaussSplattingScene";
import { InteractionDialog } from "../../components/InteractionDialog";

export const Route = createFileRoute("/_test/gs-scene-test")({
  component: GsSceneTestPage,
});

// 场景配置
const SPLAT_URL = "https://oss.anify.ai/gs/8e89431f-2b32-4000-bd98-d33607486863_ceramic.spz";
const WALLS_JSON_URL = "/assets/walls/test-scene.json";
const INTERACTION_POINTS_JSON_URL = "/assets/walls/test-scene-interaction.json";
const FLOOR_CONFIG_URL = "/assets/walls/test-scene-floor.json";

// 地板配置类型
interface FloorConfig {
  cameraHeight: number;
  groundY?: number;  // 地面Y坐标，用于光圈位置
}

const generatePointId = () => `point_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

function GsSceneTestPage() {
  const [wallConfig, setWallConfig] = useState<null | WallConfig>(null);
  const [loading, setLoading] = useState(true);
  const [showDebugWalls, setShowDebugWalls] = useState(false);

  // Boundary editing state
  const [editMode, setEditMode] = useState(false);
  const [boundaryPoints, setBoundaryPoints] = useState<BoundaryPoint[]>([]);
  const [boundaryClosed, setBoundaryClosed] = useState(false);
  const [savedWallConfig, setSavedWallConfig] = useState<null | WallConfig>(null);

  // Interaction point editing state
  const [interactionEditMode, setInteractionEditMode] = useState(false);
  const [interactionPoints, setInteractionPoints] = useState<InteractionPoint[]>([]);
  const [savedInteractionPoints, setSavedInteractionPoints] = useState<InteractionPoint[]>([]);
  const [pendingImageUrl, setPendingImageUrl] = useState<string>("");  // 待添加交互点的图片URL
  const [pendingImageScale, setPendingImageScale] = useState<string>("1");  // 待添加交互点的图片缩放

  // Interaction action editing state
  const [pendingActionType, setPendingActionType] = useState<InteractionActionType>("alert");
  const [pendingAlertMessage, setPendingAlertMessage] = useState("");
  const [pendingDialogTitle, setPendingDialogTitle] = useState("");
  const [pendingDialogContentType, setPendingDialogContentType] = useState<"text" | "image">("text");
  const [pendingDialogText, setPendingDialogText] = useState("");
  const [pendingDialogImageUrl, setPendingDialogImageUrl] = useState("");
  const [pendingSceneSplatUrl, setPendingSceneSplatUrl] = useState("");
  const [pendingSceneWallsUrl, setPendingSceneWallsUrl] = useState("");
  const [pendingSceneInteractionUrl, setPendingSceneInteractionUrl] = useState("");
  const [pendingSceneFloorUrl, setPendingSceneFloorUrl] = useState("");

  // Dialog display state
  const [dialogContent, setDialogContent] = useState<DialogContent | null>(null);

  // Scene URL state (for scene switching)
  const [splatUrl, setSplatUrl] = useState(SPLAT_URL);

  // Editing existing point state
  const [editingPointId, setEditingPointId] = useState<string | null>(null);

  // Camera height state
  const [cameraHeight, setCameraHeight] = useState<number>(0.8);
  const [cameraHeightEditMode, setCameraHeightEditMode] = useState(false);

  // Ground Y state (for interaction point ring position)
  const [groundY, setGroundY] = useState<number>(-1.5);
  const [groundYEditMode, setGroundYEditMode] = useState(false);

  // 加载墙面配置、交互点配置和地板配置
  useEffect(() => {
    Promise.all([
      fetch(WALLS_JSON_URL).then(async (res) => await res.json()),
      fetch(INTERACTION_POINTS_JSON_URL)
        .then(async (res) => await res.json())
        .catch(() => ({ interactionPoints: [] })), // 文件不存在时返回空数组
      fetch(FLOOR_CONFIG_URL)
        .then(async (res) => await res.json())
        .catch(() => ({ cameraHeight: 0.8 })), // 文件不存在时使用默认值
    ])
      .then(([wallData, interactionData, floorData]: [WallConfig, InteractionPointConfig, FloorConfig]) => {
        setWallConfig(wallData);
        setInteractionPoints(interactionData.interactionPoints);
        setCameraHeight(floorData.cameraHeight);
        if (floorData.groundY !== undefined) {
          setGroundY(floorData.groundY);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Failed to load config:", err); // eslint-disable-line no-console
        setLoading(false);
      });
  }, []);

  // B key handler for marking boundary points
  useEffect(() => {
    if (!editMode || boundaryClosed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyB") {
        const pos = getPlayerPosition();
        setBoundaryPoints((prev) => [
          ...prev,
          { id: generatePointId(), x: pos.x, z: pos.z },
        ]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editMode, boundaryClosed]);

  // Build action object from pending state
  const buildAction = useCallback((): InteractionAction | undefined => {
    switch (pendingActionType) {
      case "alert":
        return pendingAlertMessage.trim()
          ? { type: "alert", message: pendingAlertMessage.trim() }
          : undefined;
      case "dialog":
        return {
          type: "dialog",
          dialog: {
            title: pendingDialogTitle || "提示",
            contentType: pendingDialogContentType,
            ...(pendingDialogContentType === "text"
              ? { text: pendingDialogText }
              : { imageUrl: pendingDialogImageUrl }),
          },
        };
      case "scene-switch":
        return {
          type: "scene-switch",
          scene: {
            splatUrl: pendingSceneSplatUrl,
            wallsConfigUrl: pendingSceneWallsUrl,
            interactionPointsUrl: pendingSceneInteractionUrl,
            floorConfigUrl: pendingSceneFloorUrl,
          },
        };
    }
  }, [pendingActionType, pendingAlertMessage, pendingDialogTitle, pendingDialogContentType, pendingDialogText, pendingDialogImageUrl, pendingSceneSplatUrl, pendingSceneWallsUrl, pendingSceneInteractionUrl, pendingSceneFloorUrl]);

  // N key handler for marking interaction points
  useEffect(() => {
    if (!interactionEditMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyN") {
        const pos = getCursorWorldPosition();
        const action = buildAction();
        const newPoint: InteractionPoint = {
          id: generatePointId(),
          position: pos,
          ...(action && { action }),
        };
        // 如果有图片URL，添加到交互点
        if (pendingImageUrl.trim()) {
          newPoint.imageUrl = pendingImageUrl.trim();
          // 解析缩放值
          const scale = parseFloat(pendingImageScale);
          if (!isNaN(scale) && scale > 0 && scale !== 1) {
            newPoint.imageScale = scale;
          }
        }
        setInteractionPoints((prev) => [...prev, newPoint]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [interactionEditMode, pendingImageUrl, pendingImageScale, buildAction]);

  // Z/X key handler for adjusting camera height
  useEffect(() => {
    if (!cameraHeightEditMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyZ") {
        // Z 降低高度
        setCameraHeight((prev) => Math.max(-10, prev - 0.1));
      } else if (e.code === "KeyX") {
        // X 升高高度
        setCameraHeight((prev) => Math.min(10, prev + 0.1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cameraHeightEditMode]);

  // C/V key handler for adjusting ground Y
  useEffect(() => {
    if (!groundYEditMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyC") {
        // C 降低地面
        setGroundY((prev) => Math.max(-20, prev - 0.1));
      } else if (e.code === "KeyV") {
        // V 升高地面
        setGroundY((prev) => Math.min(10, prev + 0.1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [groundYEditMode]);

  const handleStartEdit = useCallback(() => {
    setSavedWallConfig(wallConfig); // 保存当前配置
    // 保留地板但清除墙面，让玩家自由移动
    if (wallConfig) {
      setWallConfig({
        defaultHeight: wallConfig.defaultHeight,
        floorY: wallConfig.floorY,
        walls: [], // 清空墙面
      });
    }
    setEditMode(true);
    setBoundaryPoints([]);
    setBoundaryClosed(false);
  }, [wallConfig]);

  const handleCancelEdit = useCallback(() => {
    setWallConfig(savedWallConfig); // 恢复原配置
    setSavedWallConfig(null);
    setEditMode(false);
    setBoundaryPoints([]);
    setBoundaryClosed(false);
  }, [savedWallConfig]);

  const handleUndoPoint = useCallback(() => {
    setBoundaryPoints((prev) => prev.slice(0, -1));
  }, []);

  const handleCompleteBoundary = useCallback(() => {
    if (boundaryPoints.length < 3) {
      alert("至少需要3个点才能形成闭合边界"); // eslint-disable-line no-alert
      return;
    }
    setBoundaryClosed(true);
  }, [boundaryPoints.length]);

  const handleExportBoundary = useCallback(async () => {
    // 使用原配置的 floorY，默认 -2
    const floorY = savedWallConfig?.floorY ?? -2;
    const wallHeight = savedWallConfig?.defaultHeight ?? 3;

    // 直接生成 WallConfig 格式（与 test-scene.json 一致）
    const config = boundaryToWalls({
      floorY,
      points: boundaryPoints,
      wallHeight,
    });

    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      alert("已复制到剪贴板！粘贴到 test-scene.json 即可"); // eslint-disable-line no-alert
    } catch {
      // Fallback: 在控制台输出
      console.log("WallConfig JSON:", JSON.stringify(config, null, 2)); // eslint-disable-line no-console
      alert("复制失败，请查看控制台"); // eslint-disable-line no-alert
    }
  }, [boundaryPoints, savedWallConfig]);

  const handleApplyBoundary = useCallback(() => {
    const floorY = savedWallConfig?.floorY ?? -2;
    const wallHeight = savedWallConfig?.defaultHeight ?? 3;

    setWallConfig(boundaryToWalls({ floorY, points: boundaryPoints, wallHeight }));
    setSavedWallConfig(null);
    setEditMode(false);
    setBoundaryClosed(false);
  }, [boundaryPoints, savedWallConfig]);

  // Reset action editing state
  const resetActionState = useCallback(() => {
    setPendingActionType("alert");
    setPendingAlertMessage("");
    setPendingDialogTitle("");
    setPendingDialogContentType("text");
    setPendingDialogText("");
    setPendingDialogImageUrl("");
    setPendingSceneSplatUrl("");
    setPendingSceneWallsUrl("");
    setPendingSceneInteractionUrl("");
    setPendingSceneFloorUrl("");
  }, []);

  // Load point config into form for editing
  const loadPointToForm = useCallback((point: InteractionPoint) => {
    setPendingImageUrl(point.imageUrl ?? "");
    setPendingImageScale(String(point.imageScale ?? 1));

    const action = point.action;
    if (!action) {
      setPendingActionType("alert");
      setPendingAlertMessage("");
    } else if (action.type === "alert") {
      setPendingActionType("alert");
      setPendingAlertMessage(action.message ?? "");
    } else if (action.type === "dialog") {
      setPendingActionType("dialog");
      setPendingDialogTitle(action.dialog.title);
      setPendingDialogContentType(action.dialog.contentType);
      setPendingDialogText(action.dialog.text ?? "");
      setPendingDialogImageUrl(action.dialog.imageUrl ?? "");
    } else if (action.type === "scene-switch") {
      setPendingActionType("scene-switch");
      setPendingSceneSplatUrl(action.scene.splatUrl);
      setPendingSceneWallsUrl(action.scene.wallsConfigUrl);
      setPendingSceneInteractionUrl(action.scene.interactionPointsUrl);
      setPendingSceneFloorUrl(action.scene.floorConfigUrl);
    }
  }, []);

  // Handle clicking on existing point in edit mode
  const handleEditPoint = useCallback((pointId: string, point: InteractionPoint) => {
    setEditingPointId(pointId);
    loadPointToForm(point);
  }, [loadPointToForm]);

  // Update the currently editing point
  const handleUpdateEditingPoint = useCallback(() => {
    if (!editingPointId) return;

    const action = buildAction();
    setInteractionPoints((prev) =>
      prev.map((p) => {
        if (p.id !== editingPointId) return p;
        return {
          ...p,
          imageUrl: pendingImageUrl.trim() || undefined,
          imageScale: pendingImageScale !== "1" ? parseFloat(pendingImageScale) : undefined,
          action,
        };
      })
    );

    // Reset editing state
    setEditingPointId(null);
    resetActionState();
    setPendingImageUrl("");
    setPendingImageScale("1");
  }, [editingPointId, buildAction, pendingImageUrl, pendingImageScale, resetActionState]);

  // Cancel editing existing point
  const handleCancelEditPoint = useCallback(() => {
    setEditingPointId(null);
    resetActionState();
    setPendingImageUrl("");
    setPendingImageScale("1");
  }, [resetActionState]);

  // Delete the currently editing point
  const handleDeleteEditingPoint = useCallback(() => {
    if (!editingPointId) return;
    setInteractionPoints((prev) => prev.filter((p) => p.id !== editingPointId));
    setEditingPointId(null);
    resetActionState();
    setPendingImageUrl("");
    setPendingImageScale("1");
  }, [editingPointId, resetActionState]);

  // Interaction point editing handlers
  const handleStartInteractionEdit = useCallback(() => {
    setSavedInteractionPoints([...interactionPoints]);
    setPendingImageUrl("");
    setPendingImageScale("1");
    resetActionState();
    setInteractionEditMode(true);
  }, [interactionPoints, resetActionState]);

  const handleCancelInteractionEdit = useCallback(() => {
    setInteractionPoints(savedInteractionPoints);
    setSavedInteractionPoints([]);
    setPendingImageUrl("");
    setPendingImageScale("1");
    resetActionState();
    setEditingPointId(null);
    setInteractionEditMode(false);
  }, [savedInteractionPoints, resetActionState]);

  const handleUndoInteractionPoint = useCallback(() => {
    setInteractionPoints((prev) => prev.slice(0, -1));
  }, []);

  const handleExportInteractionPoints = useCallback(async () => {
    const config: InteractionPointConfig = { interactionPoints };

    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      alert("已复制到剪贴板！粘贴到 test-scene-interaction.json 即可"); // eslint-disable-line no-alert
    } catch {
      console.log("InteractionPointConfig JSON:", JSON.stringify(config, null, 2)); // eslint-disable-line no-console
      alert("复制失败，请查看控制台"); // eslint-disable-line no-alert
    }
  }, [interactionPoints]);

  const handleApplyInteractionPoints = useCallback(() => {
    setSavedInteractionPoints([]);
    setPendingImageUrl("");
    setPendingImageScale("1");
    resetActionState();
    setEditingPointId(null);
    setInteractionEditMode(false);
  }, [resetActionState]);
  // Handle scene switching
  const handleSceneSwitch = useCallback(async (config: SceneSwitchConfig) => {
    try {
      const [wallData, interactionData, floorData] = await Promise.all([
        fetch(config.wallsConfigUrl)
          .then(async (res) => await res.json())
          .catch(() => null),
        fetch(config.interactionPointsUrl)
          .then(async (res) => await res.json())
          .catch(() => ({ interactionPoints: [] })),
        fetch(config.floorConfigUrl)
          .then(async (res) => await res.json())
          .catch(() => ({ cameraHeight: 0.8 })),
      ]);

      setSplatUrl(config.splatUrl);
      setWallConfig(wallData);
      setInteractionPoints(interactionData.interactionPoints);
      setCameraHeight(floorData.cameraHeight);
      if (floorData.groundY !== undefined) {
        setGroundY(floorData.groundY);
      }
    } catch (error) {
      console.error("场景切换失败:", error); // eslint-disable-line no-console
      alert("场景切换失败，请检查配置URL"); // eslint-disable-line no-alert
    }
  }, []);

  const handleInteractionPointInteract = useCallback((pointId: string, point: InteractionPoint) => {
    const action = point.action ?? { type: "alert" as const };

    switch (action.type) {
      case "alert":
        alert(action.message ?? `交互点 ${pointId} 被触发！`); // eslint-disable-line no-alert
        break;
      case "dialog":
        setDialogContent(action.dialog);
        break;
      case "scene-switch":
        handleSceneSwitch(action.scene);
        break;
    }
  }, [handleSceneSwitch]);

  // Camera height editing handlers
  const handleStartCameraHeightEdit = useCallback(() => {
    setCameraHeightEditMode(true);
  }, []);

  const handleCancelCameraHeightEdit = useCallback(() => {
    // 重新加载原始值
    fetch(FLOOR_CONFIG_URL)
      .then(async (res) => await res.json())
      .then((data: FloorConfig) => setCameraHeight(data.cameraHeight))
      .catch(() => setCameraHeight(0.8));
    setCameraHeightEditMode(false);
  }, []);

  const handleExportCameraHeight = useCallback(async () => {
    const config: FloorConfig = {
      cameraHeight: Math.round(cameraHeight * 100) / 100,
      groundY: Math.round(groundY * 100) / 100,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      alert("已复制到剪贴板！粘贴到 test-scene-floor.json 即可"); // eslint-disable-line no-alert
    } catch {
      console.log("FloorConfig JSON:", JSON.stringify(config, null, 2)); // eslint-disable-line no-console
      alert("复制失败，请查看控制台"); // eslint-disable-line no-alert
    }
  }, [cameraHeight, groundY]);

  const handleApplyCameraHeight = useCallback(() => {
    setCameraHeightEditMode(false);
  }, []);

  // Ground Y editing handlers
  const handleStartGroundYEdit = useCallback(() => {
    setGroundYEditMode(true);
  }, []);

  const handleCancelGroundYEdit = useCallback(() => {
    // 重新加载原始值
    fetch(FLOOR_CONFIG_URL)
      .then(async (res) => await res.json())
      .then((data: FloorConfig) => setGroundY(data.groundY ?? -1.5))
      .catch(() => setGroundY(-1.5));
    setGroundYEditMode(false);
  }, []);

  const handleExportGroundY = useCallback(async () => {
    const config: FloorConfig = {
      cameraHeight: Math.round(cameraHeight * 100) / 100,
      groundY: Math.round(groundY * 100) / 100,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      alert("已复制到剪贴板！粘贴到 test-scene-floor.json 即可"); // eslint-disable-line no-alert
    } catch {
      console.log("FloorConfig JSON:", JSON.stringify(config, null, 2)); // eslint-disable-line no-console
      alert("复制失败，请查看控制台"); // eslint-disable-line no-alert
    }
  }, [cameraHeight, groundY]);

  const handleApplyGroundY = useCallback(() => {
    setGroundYEditMode(false);
  }, []);

  if (loading) {
    return (
      <div style={{ alignItems: "center", background: "#000", color: "#fff", display: "flex", height: "100vh", justifyContent: "center" }}>
        加载中...
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", position: "relative", width: "100vw" }}>
      <GaussSplattingScene
        boundaryEditor={editMode ? { closed: boundaryClosed, points: boundaryPoints } : undefined}
        cameraHeight={cameraHeight}
        config={{ interactables: [], splatUrl, walls: wallConfig ?? undefined }}
        debugWalls={showDebugWalls}
        interactionPointDisplay={
          interactionPoints.length > 0
            ? { groundY, onInteract: interactionEditMode ? handleEditPoint : handleInteractionPointInteract, points: interactionPoints }
            : undefined
        }
        interactionPointEditor={interactionEditMode ? { enabled: true } : undefined}
      />

      {/* Instructions overlay */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          borderRadius: "8px",
          color: "white",
          fontSize: "14px",
          left: "50%",
          padding: "15px",
          position: "fixed",
          textAlign: "center",
          top: "20px",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <strong>GS Scene Test</strong>
        <br />
        Desktop: Drag to look | WASD to move | Space to jump
        <br />
        Mobile: Left joystick to move | Right joystick to look

        {/* Debug walls toggle */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.3)", marginTop: "10px", paddingTop: "10px" }}>
          <label style={{ cursor: "pointer", userSelect: "none" }}>
            <input
              checked={showDebugWalls}
              onChange={(e) => setShowDebugWalls(e.target.checked)}
              style={{ marginRight: "6px" }}
              type="checkbox"
            />
            显示调试墙面
          </label>
        </div>

        {/* Boundary editing controls */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.3)", marginTop: "10px", paddingTop: "10px" }}>
          {!editMode ? (
            <button
              disabled={interactionEditMode || cameraHeightEditMode || groundYEditMode}
              onClick={handleStartEdit}
              style={{
                background: interactionEditMode || cameraHeightEditMode || groundYEditMode ? "#666" : "#3b82f6",
                border: "none",
                borderRadius: "4px",
                color: "white",
                cursor: interactionEditMode || cameraHeightEditMode || groundYEditMode ? "not-allowed" : "pointer",
                padding: "6px 12px",
              }}
              type="button"
            >
              配置边界
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ color: "#4ade80", fontSize: "12px" }}>
                已标记 {boundaryPoints.length} 个点 | 按 B 键标记当前位置
              </div>
              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                {!boundaryClosed ? (
                  <>
                    <button
                      disabled={boundaryPoints.length === 0}
                      onClick={handleUndoPoint}
                      style={{
                        background: boundaryPoints.length === 0 ? "#666" : "#f59e0b",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: boundaryPoints.length === 0 ? "not-allowed" : "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      撤销
                    </button>
                    <button
                      disabled={boundaryPoints.length < 3}
                      onClick={handleCompleteBoundary}
                      style={{
                        background: boundaryPoints.length < 3 ? "#666" : "#22c55e",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: boundaryPoints.length < 3 ? "not-allowed" : "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      完成
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        background: "#ef4444",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      取消
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleExportBoundary}
                      style={{
                        background: "#3b82f6",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      复制JSON
                    </button>
                    <button
                      onClick={handleApplyBoundary}
                      style={{
                        background: "#22c55e",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      应用边界
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        background: "#ef4444",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      取消
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Camera height editing controls */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.3)", marginTop: "10px", paddingTop: "10px" }}>
          {!cameraHeightEditMode ? (
            <button
              disabled={editMode || interactionEditMode || groundYEditMode}
              onClick={handleStartCameraHeightEdit}
              style={{
                background: editMode || interactionEditMode || groundYEditMode ? "#666" : "#06b6d4",
                border: "none",
                borderRadius: "4px",
                color: "white",
                cursor: editMode || interactionEditMode || groundYEditMode ? "not-allowed" : "pointer",
                padding: "6px 12px",
              }}
              type="button"
            >
              配置镜头高度
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ color: "#67e8f9", fontSize: "12px" }}>
                当前高度: {cameraHeight.toFixed(2)} | Z 降低 | X 升高
              </div>
              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                <button
                  onClick={handleExportCameraHeight}
                  style={{
                    background: "#3b82f6",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                    padding: "4px 8px",
                  }}
                  type="button"
                >
                  复制JSON
                </button>
                <button
                  onClick={handleApplyCameraHeight}
                  style={{
                    background: "#22c55e",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                    padding: "4px 8px",
                  }}
                  type="button"
                >
                  完成
                </button>
                <button
                  onClick={handleCancelCameraHeightEdit}
                  style={{
                    background: "#ef4444",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                    padding: "4px 8px",
                  }}
                  type="button"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Ground Y editing controls */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.3)", marginTop: "10px", paddingTop: "10px" }}>
          {!groundYEditMode ? (
            <button
              disabled={editMode || interactionEditMode || cameraHeightEditMode}
              onClick={handleStartGroundYEdit}
              style={{
                background: editMode || interactionEditMode || cameraHeightEditMode ? "#666" : "#f59e0b",
                border: "none",
                borderRadius: "4px",
                color: "white",
                cursor: editMode || interactionEditMode || cameraHeightEditMode ? "not-allowed" : "pointer",
                padding: "6px 12px",
              }}
              type="button"
            >
              配置地面高度
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ color: "#fcd34d", fontSize: "12px" }}>
                地面Y: {groundY.toFixed(2)} | C 降低 | V 升高
              </div>
              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                <button
                  onClick={handleExportGroundY}
                  style={{
                    background: "#3b82f6",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                    padding: "4px 8px",
                  }}
                  type="button"
                >
                  复制JSON
                </button>
                <button
                  onClick={handleApplyGroundY}
                  style={{
                    background: "#22c55e",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                    padding: "4px 8px",
                  }}
                  type="button"
                >
                  完成
                </button>
                <button
                  onClick={handleCancelGroundYEdit}
                  style={{
                    background: "#ef4444",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                    padding: "4px 8px",
                  }}
                  type="button"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Interaction point editing controls */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.3)", marginTop: "10px", paddingTop: "10px" }}>
          {!interactionEditMode ? (
            <button
              disabled={editMode || cameraHeightEditMode || groundYEditMode}
              onClick={handleStartInteractionEdit}
              style={{
                background: editMode || cameraHeightEditMode || groundYEditMode ? "#666" : "#8b5cf6",
                border: "none",
                borderRadius: "4px",
                color: "white",
                cursor: editMode || cameraHeightEditMode || groundYEditMode ? "not-allowed" : "pointer",
                padding: "6px 12px",
              }}
              type="button"
            >
              配置交互点
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ color: editingPointId ? "#fbbf24" : "#c4b5fd", fontSize: "12px" }}>
                {editingPointId
                  ? `正在编辑交互点 | 点击其他点切换编辑`
                  : `已标记 ${interactionPoints.length} 个交互点 | 按 N 键标记 | 点击已有点编辑`}
              </div>
              {/* 图片URL输入框 */}
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                <input
                  onChange={(e) => setPendingImageUrl(e.target.value)}
                  placeholder="图片URL (可选立绘)"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "4px",
                    color: "white",
                    flex: 1,
                    fontSize: "12px",
                    padding: "4px 8px",
                  }}
                  type="text"
                  value={pendingImageUrl}
                />
                {pendingImageUrl && (
                  <>
                    <input
                      onChange={(e) => setPendingImageScale(e.target.value)}
                      placeholder="缩放"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "4px",
                        color: "white",
                        fontSize: "12px",
                        padding: "4px 8px",
                        textAlign: "center",
                        width: "50px",
                      }}
                      type="text"
                      value={pendingImageScale}
                    />
                    <button
                      onClick={() => {
                        setPendingImageUrl("");
                        setPendingImageScale("1");
                      }}
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "10px",
                        padding: "4px 6px",
                      }}
                      type="button"
                    >
                      清除
                    </button>
                  </>
                )}
              </div>

              {/* 交互类型选择 */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", whiteSpace: "nowrap" }}>交互类型:</span>
                <select
                  onChange={(e) => setPendingActionType(e.target.value as InteractionActionType)}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "12px",
                    padding: "4px 8px",
                  }}
                  value={pendingActionType}
                >
                  <option value="alert">触发提示</option>
                  <option value="dialog">显示对话框</option>
                  <option value="scene-switch">切换场景</option>
                </select>
              </div>

              {/* Alert 配置 */}
              {pendingActionType === "alert" && (
                <input
                  onChange={(e) => setPendingAlertMessage(e.target.value)}
                  placeholder="提示消息 (可选，留空使用默认)"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "12px",
                    padding: "4px 8px",
                  }}
                  type="text"
                  value={pendingAlertMessage}
                />
              )}

              {/* Dialog 配置 */}
              {pendingActionType === "dialog" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <input
                    onChange={(e) => setPendingDialogTitle(e.target.value)}
                    placeholder="对话框标题"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "12px",
                      padding: "4px 8px",
                    }}
                    type="text"
                    value={pendingDialogTitle}
                  />
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>内容:</span>
                    <select
                      onChange={(e) => setPendingDialogContentType(e.target.value as "text" | "image")}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "4px",
                        color: "white",
                        fontSize: "12px",
                        padding: "4px 8px",
                      }}
                      value={pendingDialogContentType}
                    >
                      <option value="text">文字</option>
                      <option value="image">图片</option>
                    </select>
                  </div>
                  {pendingDialogContentType === "text" ? (
                    <textarea
                      onChange={(e) => setPendingDialogText(e.target.value)}
                      placeholder="对话框文字内容"
                      rows={3}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "4px",
                        color: "white",
                        fontSize: "12px",
                        padding: "4px 8px",
                        resize: "vertical",
                      }}
                      value={pendingDialogText}
                    />
                  ) : (
                    <input
                      onChange={(e) => setPendingDialogImageUrl(e.target.value)}
                      placeholder="对话框图片URL"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "4px",
                        color: "white",
                        fontSize: "12px",
                        padding: "4px 8px",
                      }}
                      type="text"
                      value={pendingDialogImageUrl}
                    />
                  )}
                </div>
              )}

              {/* Scene Switch 配置 */}
              {pendingActionType === "scene-switch" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <input
                    onChange={(e) => setPendingSceneSplatUrl(e.target.value)}
                    placeholder="场景 .spz URL"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "12px",
                      padding: "4px 8px",
                    }}
                    type="text"
                    value={pendingSceneSplatUrl}
                  />
                  <input
                    onChange={(e) => setPendingSceneWallsUrl(e.target.value)}
                    placeholder="墙面配置 JSON URL"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "12px",
                      padding: "4px 8px",
                    }}
                    type="text"
                    value={pendingSceneWallsUrl}
                  />
                  <input
                    onChange={(e) => setPendingSceneInteractionUrl(e.target.value)}
                    placeholder="交互点配置 JSON URL"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "12px",
                      padding: "4px 8px",
                    }}
                    type="text"
                    value={pendingSceneInteractionUrl}
                  />
                  <input
                    onChange={(e) => setPendingSceneFloorUrl(e.target.value)}
                    placeholder="地板配置 JSON URL"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "12px",
                      padding: "4px 8px",
                    }}
                    type="text"
                    value={pendingSceneFloorUrl}
                  />
                </div>
              )}

              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                {editingPointId ? (
                  <>
                    <button
                      onClick={handleUpdateEditingPoint}
                      style={{
                        background: "#22c55e",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      更新
                    </button>
                    <button
                      onClick={handleDeleteEditingPoint}
                      style={{
                        background: "#ef4444",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      删除
                    </button>
                    <button
                      onClick={handleCancelEditPoint}
                      style={{
                        background: "#6b7280",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      取消编辑
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      disabled={interactionPoints.length === 0}
                      onClick={handleUndoInteractionPoint}
                      style={{
                        background: interactionPoints.length === 0 ? "#666" : "#f59e0b",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: interactionPoints.length === 0 ? "not-allowed" : "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      撤销
                    </button>
                    <button
                      disabled={interactionPoints.length === 0}
                      onClick={handleExportInteractionPoints}
                      style={{
                        background: interactionPoints.length === 0 ? "#666" : "#3b82f6",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: interactionPoints.length === 0 ? "not-allowed" : "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      复制JSON
                    </button>
                    <button
                      onClick={handleApplyInteractionPoints}
                      style={{
                        background: "#22c55e",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      完成
                    </button>
                    <button
                      onClick={handleCancelInteractionEdit}
                      style={{
                        background: "#ef4444",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                      type="button"
                    >
                      取消
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interaction Dialog */}
      {dialogContent && (
        <InteractionDialog
          content={dialogContent}
          onClose={() => setDialogContent(null)}
        />
      )}
    </div>
  );
}
