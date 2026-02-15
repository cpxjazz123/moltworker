// src/hooks/useWorldSwitch.ts

import { useCallback, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useWorld } from '@/contexts/WorldContext';

interface UseWorldSwitchOptions {
  onBeforeSwitch?: (fromWorld: string, toWorld: string) => Promise<boolean> | boolean;
  onAfterSwitch?: (worldId: string) => void;
  onError?: (error: Error) => void;
}

/**
 * 世界切换 hook
 * 处理世界切换时的导航和状态重置
 */
export function useWorldSwitch(options: UseWorldSwitchOptions = {}) {
  const { loadWorld, currentWorldId, unloadWorld, availableWorlds } = useWorld();
  const navigate = useNavigate();
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState<Error | null>(null);

  const switchWorld = useCallback(async (targetWorldId: string) => {
    if (targetWorldId === currentWorldId) {
      console.log('[WorldSwitch] Already in this world');
      return true;
    }

    // 检查世界是否可用
    const targetWorld = availableWorlds.find(w => w.id === targetWorldId);
    if (!targetWorld?.available) {
      const error = new Error(`World ${targetWorldId} is not available`);
      setSwitchError(error);
      options.onError?.(error);
      return false;
    }

    setIsSwitching(true);
    setSwitchError(null);

    try {
      // 调用 beforeSwitch 钩子
      if (options.onBeforeSwitch) {
        const shouldContinue = await options.onBeforeSwitch(currentWorldId ?? '', targetWorldId);
        if (!shouldContinue) {
          setIsSwitching(false);
          return false;
        }
      }

      // 卸载当前世界
      unloadWorld();

      // 加载新世界
      await loadWorld(targetWorldId);

      // 导航到新世界的默认页面
      await navigate({ to: '/' });

      // 调用 afterSwitch 钩子
      options.onAfterSwitch?.(targetWorldId);

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setSwitchError(error);
      options.onError?.(error);
      return false;
    } finally {
      setIsSwitching(false);
    }
  }, [currentWorldId, availableWorlds, loadWorld, unloadWorld, navigate, options]);

  // 检查是否可以切换到指定世界
  const canSwitchTo = useCallback((worldId: string): boolean => {
    const world = availableWorlds.find(w => w.id === worldId);
    return world?.available ?? false;
  }, [availableWorlds]);

  return {
    switchWorld,
    canSwitchTo,
    isSwitching,
    switchError,
    currentWorldId,
  };
}
