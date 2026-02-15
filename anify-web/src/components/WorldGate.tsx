// src/components/WorldGate.tsx

import * as React from 'react';
import { useWorld } from '@/contexts/WorldContext';

interface WorldGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DEFAULT_TUTORIAL_WORLD = 'official-intro';
const DEFAULT_MAIN_WORLD = 'anthromyth';
const LAST_WORLD_KEY = 'anify_last_world';
const TUTORIAL_COMPLETED_KEY = 'anify_user_initialized';

/**
 * WorldGate 负责在应用启动时加载正确的世界
 * - 新用户 → official-intro (教程)
 * - 老用户 → 上次选择的世界 或 anthromyth
 */
export function WorldGate({ children, fallback }: WorldGateProps) {
  const { loadWorld, isLoading, error, worldsLoaded } = useWorld();

  const [initialized, setInitialized] = React.useState(false);

  // 检查教程是否完成
  const checkTutorialCompleted = React.useCallback((): boolean => {
    // TODO: 优先从后端数据检查 (playerProfile?.tutorialCompleted)
    // 降级到本地存储
    try {
      return localStorage.getItem(TUTORIAL_COMPLETED_KEY) === 'true';
    } catch {
      return false;
    }
  }, []);

  // 获取上次加载的世界
  const getLastWorld = React.useCallback((): string | null => {
    try {
      return localStorage.getItem(LAST_WORLD_KEY);
    } catch {
      return null;
    }
  }, []);

  // 初始化世界加载
  React.useEffect(() => {
    if (initialized || !worldsLoaded) return;

    const initializeWorld = async () => {
      try {
        // 检查是否已完成教程
        const tutorialCompleted = checkTutorialCompleted();

        if (!tutorialCompleted) {
          // 新用户，加载教程世界
          console.log('[WorldGate] New user, loading tutorial world');
          await loadWorld(DEFAULT_TUTORIAL_WORLD);
        } else {
          // 老用户，尝试恢复上次世界
          const lastWorld = getLastWorld();
          const worldToLoad = lastWorld ?? DEFAULT_MAIN_WORLD;
          console.log(`[WorldGate] Returning user, loading world: ${worldToLoad}`);
          await loadWorld(worldToLoad);
        }

        setInitialized(true);
      } catch (err) {
        console.error('[WorldGate] Failed to initialize world:', err);
        // 降级：尝试加载默认世界
        try {
          await loadWorld(DEFAULT_MAIN_WORLD);
          setInitialized(true);
        } catch {
          // 完全失败
        }
      }
    };

    initializeWorld();
  }, [worldsLoaded, initialized, loadWorld, checkTutorialCompleted, getLastWorld]);

  // 加载中状态
  if (!initialized || isLoading) {
    return (
      <>
        {fallback ?? (
          <div className="world-loading">
            <div className="spinner" />
            <p>加载世界中...</p>
          </div>
        )}
      </>
    );
  }

  // 加载失败
  if (error) {
    return (
      <div className="world-error">
        <h2>世界加载失败</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          重试
        </button>
      </div>
    );
  }

  // 世界已加载
  return <>{children}</>;
}
