/**
 * 场景活动状态追踪器
 * 用于检测场景是否处于静止状态，以便动态控制刷新率
 *
 * 支持两种使用场景：
 * 1. React Three Fiber (使用 frameloop="demand" + invalidate)
 * 2. 原生 Three.js 渲染循环 (使用 startRendering/stopRendering)
 */

export interface ActivityState {
  /** 相机四元数是否稳定 */
  cameraStable: boolean;
  /** 当前帧是否有用户输入 */
  hasInput: boolean;
  /** 是否有动画正在播放 */
  hasAnimation: boolean;
}

export interface AnimationValues {
  current: number;
  target: number;
}

/**
 * 检测数值是否已经收敛到目标值
 */
export function isValueSettled(current: number, target: number, threshold = 0.001): boolean {
  return Math.abs(target - current) < threshold;
}

/**
 * 检测多个动画值是否都已收敛
 */
export function areAnimationsSettled(animations: AnimationValues[], threshold = 0.001): boolean {
  return animations.every((anim) => isValueSettled(anim.current, anim.target, threshold));
}

/**
 * 检测四元数是否接近单位四元数（静止状态）
 * @param quaternion 四元数 { x, y, z, w }
 * @param threshold 角度阈值（弧度）
 */
export function isQuaternionSettled(
  quaternion: { w: number; x: number; y: number; z: number },
  threshold = 0.001,
): boolean {
  // 计算与单位四元数的夹角
  // 单位四元数: (0, 0, 0, 1)
  // 两个四元数的夹角 = 2 * acos(|q1 · q2|)
  const dot = Math.abs(quaternion.w); // q1·q2 = w (因为单位四元数的 w=1)
  const angle = 2 * Math.acos(Math.min(1, dot));

  return angle < threshold;
}

/**
 * 检测是否有用户输入（移动或视角控制）
 */
export function hasUserInput(input: { look: { x: number; y: number }; move: { x: number; y: number } }): boolean {
  return input.move.x !== 0 || input.move.y !== 0 || input.look.x !== 0 || input.look.y !== 0;
}

/**
 * 创建活动状态检测器
 * 返回一个函数，该函数根据当前状态判断是否需要继续渲染
 */
export function createActivityChecker(options: {
  /** 是否总是保持渲染（如启用了镜头晃动） */
  alwaysRender?: boolean;
  /** 入场动画是否正在播放 */
  isPlayingIntro?: boolean;
}) {
  return function shouldContinueRendering(state: ActivityState): boolean {
    // 入场动画播放中，必须继续渲染
    if (options.isPlayingIntro) {
      return true;
    }

    // 如果设置了总是渲染，持续渲染
    if (options.alwaysRender) {
      return true;
    }

    // 有用户输入时，继续渲染
    if (state.hasInput) {
      return true;
    }

    // 有动画未完成时，继续渲染
    if (state.hasAnimation) {
      return true;
    }

    // 相机未稳定时，继续渲染
    if (!state.cameraStable) {
      return true;
    }

    // 所有条件都满足静止状态，可以停止渲染
    return false;
  };
}

/**
 * 追踪键盘按下状态
 */
export function isAnyKeyPressed(keyState: Record<string, boolean>): boolean {
  return Object.values(keyState).some((pressed) => pressed);
}
