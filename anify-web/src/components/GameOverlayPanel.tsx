import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { setInputDisabled } from "./GaussSplattingScene/inputState";
import { LiquidGlass } from "./ui/liquid-glass";

interface GameOverlayPanelProps {
  children: ReactNode;
  /** 点击背景是否关闭面板 */
  closeOnBackdropClick?: boolean;
  onClose: () => void;
  /** 面板垂直位置：center 居中，top 顶部偏移 */
  position?: "center" | "top";
  /** 面板标题，传入后统一渲染标题栏 + 关闭按钮 */
  title?: string;
  /** 面板宽度样式 */
  widthClass?: string;
}

/**
 * 通用游戏覆盖面板组件
 * - 打开时自动禁用玩家移动和镜头旋转
 * - 统一的 LiquidGlass 样式
 * - 透明背景，点击可关闭
 * - 传入 title 时自动渲染标题栏和关闭按钮
 */
export function GameOverlayPanel({
  children,
  closeOnBackdropClick = true,
  onClose,
  position = "center",
  title,
  widthClass = "w-[80vw] max-w-[600px]",
}: GameOverlayPanelProps) {
  // Disable player movement and camera rotation when panel is open
  useEffect(() => {
    setInputDisabled(true);
    return () => setInputDisabled(false);
  }, []);

  const positionClass = position === "top"
    ? "items-start pt-[110px]"
    : "items-center";

  return createPortal(
    <div
      className={`fixed inset-0 z-[300] flex justify-center ${positionClass}`}
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      {/* Backdrop - transparent */}
      <div className="absolute inset-0" />

      {/* Panel */}
      <div
        className="relative z-10 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <LiquidGlass
          aberrationIntensity={0}
          backgroundColor="rgba(255, 255, 255, 0.15)"
          cornerRadius={24}
          displacementScale={70}
          mode="prominent"
          padding="0"
        >
          <div className={`${widthClass} p-4`}>
            {title && (
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-base font-medium text-white/80"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                >
                  {title}
                </span>
                <X
                  size={18}
                  className="text-white/60 cursor-pointer"
                  style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
                  onClick={onClose}
                />
              </div>
            )}
            {children}
          </div>
        </LiquidGlass>
      </div>
    </div>,
    document.body,
  );
}
