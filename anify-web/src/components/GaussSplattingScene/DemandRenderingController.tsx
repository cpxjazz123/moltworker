import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import { hasUserInput } from "../../lib/sceneActivity";

import { inputState } from "./inputState";

/**
 * 按需渲染控制器组件
 *
 * 放置在 Canvas 内部，自动检测场景活动状态并控制渲染
 * 当场景静止时停止渲染，当有输入时恢复渲染
 */
export function DemandRenderingController() {
  const { invalidate } = useThree();

  // 追踪上一帧是否有输入
  const hadInputLastFrame = useRef(false);
  // 追踪键盘状态
  const keyState = useRef<Record<string, boolean>>({});
  // 追踪鼠标拖拽状态
  const isDragging = useRef(false);
  // 静止帧计数器（连续多帧无活动后才停止渲染）
  const idleFrameCount = useRef(0);
  // 静止阈值（连续多少帧无活动后停止）
  const IDLE_THRESHOLD = 30;

  // 监听键盘事件
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keyState.current[e.code] = true;
      idleFrameCount.current = 0;
      invalidate();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keyState.current[e.code] = false;
    };

    const onMouseDown = () => {
      isDragging.current = true;
      idleFrameCount.current = 0;
      invalidate();
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onMouseMove = () => {
      if (isDragging.current) {
        idleFrameCount.current = 0;
        invalidate();
      }
    };

    const onTouchStart = () => {
      idleFrameCount.current = 0;
      invalidate();
    };

    const onTouchMove = () => {
      idleFrameCount.current = 0;
      invalidate();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [invalidate]);

  useFrame(() => {
    const hasInput = hasUserInput(inputState);
    const hasKeyPressed = Object.values(keyState.current).some(Boolean);

    // 判断是否需要继续渲染
    const isActive =
      hasInput || // 有摇杆输入
      hadInputLastFrame.current || // 上一帧有输入（平滑过渡）
      hasKeyPressed || // 有键盘按下
      isDragging.current; // 鼠标拖拽中

    hadInputLastFrame.current = hasInput;

    if (isActive) {
      // 活跃状态，重置计数器并持续渲染
      idleFrameCount.current = 0;
      invalidate();
    } else {
      // 非活跃状态，增加计数器
      idleFrameCount.current += 1;

      // 还未达到静止阈值，继续渲染几帧让动画平滑结束
      if (idleFrameCount.current < IDLE_THRESHOLD) {
        invalidate();
      }
      // 达到阈值后停止调用 invalidate，渲染自动暂停
    }
  });

  return null;
}
