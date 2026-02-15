import { useEffect, useRef } from "react";

import { gaussSplattingRenderer } from "../lib/gaussSplattingRenderer";
import { useSceneStore } from "../stores/sceneStore";

interface GaussSplattingBackgroundProps {
  isChatMode?: boolean;
  pathname?: string;
  style?: React.CSSProperties;
  url?: string;
}

const DEFAULT_SPLAT_URL = "https://oss.anify.ai/gs/3b5320a4-72b4-4eb4-98fe-13c78ae1c070_ceramic_500k.spz";

export const GaussSplattingBackground = ({
  isChatMode = false,
  pathname = "/",
  style = {},
  url,
}: GaussSplattingBackgroundProps) => {
  // Get active scene from store
  const { getActiveScene } = useSceneStore();
  const activeScene = getActiveScene();
  const splatUrl = url ?? activeScene?.splatUrl ?? DEFAULT_SPLAT_URL;
  const ref = useRef<HTMLDivElement>(null);

  // Initialize renderer once on mount, update when scene changes
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    gaussSplattingRenderer.initialize(ref.current, splatUrl);

    // Note: We don't dispose on unmount because we want to keep the renderer alive
    // across route changes. The renderer is a singleton.
  }, [splatUrl]);

  // Update pathname without recreating the scene
  useEffect(() => {
    gaussSplattingRenderer.setPathname(pathname);
  }, [pathname]);

  // Update chat mode for camera effects
  useEffect(() => {
    gaussSplattingRenderer.setChatMode(isChatMode);
  }, [isChatMode]);

  return (
    <div
      ref={ref}
      style={{
        background: "#000",
        height: "calc(var(--ios-lvh, 100dvh) + var(--ios-blur-offset, 0px))",
        left: 0,
        pointerEvents: "auto",
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex: 0,
        ...style,
      }}
    />
  );
};
