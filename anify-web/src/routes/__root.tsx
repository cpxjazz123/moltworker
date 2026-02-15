import { createRootRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { onAuthStateChanged } from "firebase/auth";
import { AnimatePresence } from "motion/react";
import * as React from "react";

import { AppDock } from "../components/AppDock";
import { ChatInput } from "../components/ChatInput";

import { GaussSplattingBackground } from "../components/GaussSplattingBackground";
import { GamePanel } from "../components/panels";
import { TutorialOverlay } from "../components/tutorial/TutorialOverlay";
import { ChatModeProvider, useChatMode } from "../contexts/ChatModeContext";
import { GameDataProvider, useGameData } from "../contexts/GameDataContext";
import { TutorialProvider, useTutorial, type TutorialStep } from "../contexts/TutorialContext";
import { WorldProvider } from "../contexts/WorldContext";
import { WorldGate } from "../components/WorldGate";
import { LoadingScreen } from "../components/LoadingScreen";
import { auth, dataConnect } from "../firebase";
// import { getPlayerStateSummary, createUser } from "@/lib/dataconnect";
import { getPlayerStateSummary, createUser } from "@/lib/dataconnect-mock";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <WorldProvider>
      <WorldGate fallback={<LoadingScreen />}>
        <TutorialProvider>
          <GameDataProvider>
            <ChatModeProvider>
              <RootLayout />
            </ChatModeProvider>
          </GameDataProvider>
        </TutorialProvider>
      </WorldGate>
    </WorldProvider>
  );
}

// Route mapping for tutorial steps - used for initial state restore only
const TUTORIAL_STEP_ROUTES: Partial<Record<Exclude<TutorialStep, null>, string>> = {
  landing: "/landing",
  character_create: "/landing",
  chat_intro: "/",
  chat_respond: "/",
  voice_transition: "/",
  voice_call: "/",
  equipment_check: "/",
  explore_intro: "/me",
};

function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [isLoadingPlayerState, setIsLoadingPlayerState] = React.useState(true);
  const [hasCheckedBackend, setHasCheckedBackend] = React.useState(false);
  const { chatMode, isChatMode } = useChatMode();
  const { isActive: isTutorialActive, currentStep, goToStep, advanceStep, skipTutorial } = useTutorial();
  const { sendMessage } = useGameData();

  // Handle message send with tutorial progression
  const handleSendMessage = React.useCallback(
    async (message: string) => {
      await sendMessage(message);

      // Advance tutorial if in chat_respond step
      if (isTutorialActive && currentStep === "chat_respond") {
        // Small delay to show the message before advancing
        setTimeout(() => {
          advanceStep();
        }, 500);
      }
    },
    [sendMessage, isTutorialActive, currentStep, advanceStep]
  );

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (!user) {
        setIsLoadingPlayerState(false);
        setHasCheckedBackend(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load player state from backend when authenticated
  React.useEffect(() => {
    if (!isAuthenticated || hasCheckedBackend) {
      return;
    }

    // Dev mode: Skip backend restore if flag is set (used for tutorial reset)
    const skipBackendRestore = sessionStorage.getItem('anify_skip_backend_restore');
    if (skipBackendRestore) {
      console.log('[Dev] Skipping backend state restore');
      sessionStorage.removeItem('anify_skip_backend_restore');
      setIsLoadingPlayerState(false);
      setHasCheckedBackend(true);
      return;
    }

    async function loadPlayerState() {
      try {
        const result = await getPlayerStateSummary(dataConnect) as any;
        let user = result?.data?.user;

        // If user record doesn't exist in SQL yet, create it
        if (!user) {
          console.log('[Root] User record missing in SQL, creating...');
          await createUser(dataConnect);
          // Refetch to get initialized objects
          const retryResult = await getPlayerStateSummary(dataConnect) as any;
          user = retryResult?.data?.user;
        }

        const profile = user?.playerProfile_on_user;
        const tutorial = user?.playerTutorial_on_user;

        // Case 1: Profile not initialized → go to character creation
        if (!profile?.isInitialized) {
          goToStep("landing");
          navigate({ to: "/landing" });
          setIsLoadingPlayerState(false);
          setHasCheckedBackend(true);
          return;
        }

        // Case 2: Tutorial not completed → resume at current step
        if (tutorial && !tutorial.isCompleted && tutorial.currentStep) {
          const step = tutorial.currentStep as Exclude<TutorialStep, null>;
          goToStep(step);
          const route = TUTORIAL_STEP_ROUTES[step] || "/";
          navigate({ to: route });
          setIsLoadingPlayerState(false);
          setHasCheckedBackend(true);
          return;
        }

        // Case 3: Tutorial completed → mark as complete in local state
        if (tutorial?.isCompleted) {
          skipTutorial();
        }

        setIsLoadingPlayerState(false);
        setHasCheckedBackend(true);
      } catch (error) {
        console.error("Failed to load player state:", error);
        // On error, allow normal flow
        setIsLoadingPlayerState(false);
        setHasCheckedBackend(true);
      }
    }

    loadPlayerState();
  }, [isAuthenticated, hasCheckedBackend, navigate, goToStep, skipTutorial]);

  React.useEffect(() => {
    // If auth status is still loading, do nothing yet
    if (isAuthenticated === null) {
      return;
    }

    const publicPaths = ["/login", "/register", "/forgot-password", "/forgot-password-reset", "/micro-web-test", "/landing"];

    // Check if current path starts with any of the public paths
    // (using startsWith to handle potential sub-routes or trailing slashes,
    // though exact match might be safer if we want to be strict.
    // Given the routes, exact match or simple inclusion is likely fine.
    // Let's use exact match for the list provided.)
    const isPublic = publicPaths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));

    if (!isAuthenticated && !isPublic) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // iOS 18+ Safari 透明地址栏适配：自动滚动并锁定
  React.useEffect(() => {
    const ua = navigator.userAgent;
    const isIPhone = /iPhone/i.test(ua);
    const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/i.test(ua);
    const safariVersion = parseInt(/Version\/(\d+)/.exec(ua)?.[1] || "0", 10);

    if (!(isIPhone && isSafari && safariVersion >= 26)) {
      return;
    }

    const timer = setTimeout(() => {
      // 测量视口高度
      const container = document.createElement("div");

      container.style.cssText = "position:fixed;visibility:hidden";
      document.body.appendChild(container);

      const measure = (h: string) => {
        const d = document.createElement("div");

        d.style.height = h;
        container.appendChild(d);

        return d.getBoundingClientRect().height;
      };

      const lvh = measure("100lvh") || measure("100vh");
      const dvh = measure("100dvh") || measure("100vh");

      document.body.removeChild(container);

      const diff = Math.max(0, lvh - dvh);
      const isLargeBar = diff >= 108;

      // 设置 CSS 变量供全局使用
      // 滚动值：顶部地址栏 122px，其他 62px
      // 底部虚化 offset：顶部地址栏 106px，其他 120px
      const scrollTarget = isLargeBar ? 122 : 62;
      const blurOffset = isLargeBar ? 106 : 120;

      document.documentElement.style.setProperty("--ios-scroll-target", `${scrollTarget}px`);
      document.documentElement.style.setProperty("--ios-blur-offset", `${blurOffset}px`);
      document.documentElement.style.setProperty("--ios-lvh", `${lvh}px`);

      window.scrollTo(0, scrollTarget);

      // ========== 键盘弹出/关闭时的滚动位置恢复 ==========
      const visualViewport = window.visualViewport;

      if (visualViewport) {
        let isKeyboardOpen = false;
        let restoreTimer: ReturnType<typeof setTimeout> | null = null;
        const initialHeight = visualViewport.height;

        const handleViewportResize = () => {
          const heightDiff = initialHeight - visualViewport.height;
          const keyboardNowOpen = heightDiff > 150;

          if (keyboardNowOpen && !isKeyboardOpen) {
            // 键盘弹出，清除恢复计时器
            isKeyboardOpen = true;
            if (restoreTimer) {
              clearTimeout(restoreTimer);
              restoreTimer = null;
            }
          } else if (!keyboardNowOpen && isKeyboardOpen) {
            // 键盘关闭，延迟恢复滚动位置
            isKeyboardOpen = false;
            restoreTimer = setTimeout(() => {
              window.scrollTo({ top: scrollTarget, behavior: "instant" });
            }, 100);
          }
        };

        visualViewport.addEventListener("resize", handleViewportResize);

        // 扩展清理函数
        const originalCleanup = (window as any).__iosScrollCleanup;

        (window as any).__iosScrollCleanup = () => {
          originalCleanup?.();
          visualViewport.removeEventListener("resize", handleViewportResize);
          if (restoreTimer) clearTimeout(restoreTimer);
        };
      }

      // 锁定滚动，但允许 .app-content 内部的可滚动元素滚动
      document.documentElement.classList.add("scroll-locked");

      const isScrollableElement = (el: Element | null): boolean => {
        while (el && el !== document.body) {
          const style = window.getComputedStyle(el);
          const overflowY = style.overflowY;
          const isScrollable = overflowY === "auto" || overflowY === "scroll";

          if (isScrollable && el.scrollHeight > el.clientHeight) {
            return true;
          }
          el = el.parentElement;
        }

        return false;
      };

      const preventScroll = (e: TouchEvent) => {
        // 如果触摸目标在可滚动元素内部，允许滚动
        if (e.target instanceof Element && isScrollableElement(e.target)) {
          return;
        }
        e.preventDefault();
      };

      document.addEventListener("touchmove", preventScroll, { passive: false });

      (window as any).__iosScrollCleanup = () => {
        document.documentElement.classList.remove("scroll-locked");
        document.removeEventListener("touchmove", preventScroll);
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      (window as any).__iosScrollCleanup?.();
      delete (window as any).__iosScrollCleanup;
    };
  }, []);

  if (isAuthenticated === null || (isAuthenticated && isLoadingPlayerState)) {
    // Loading state - waiting for auth or player state
    return (
      <div className="login-page">
        <div className="login-bg-overlay">
          <div
            className="login-card"
            style={{ textAlign: "center" }}
          >
            <h1 className="login-title">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  const showBackground = ["/", "/me", "/memories", "/settings"].some(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
  );

  const showAppDock = ["/", "/me", "/memories", "/settings"].some(
    (path) => location.pathname === path || (location.pathname.startsWith(path) && path !== "/"),
  );

  // Show ChatInput on home page when in voice or text mode
  const isHomePage = location.pathname === "/";
  const showChatInput = isHomePage && isChatMode;
  const shouldShowAppDock = showAppDock && !showChatInput;
  const chatInputMode = chatMode === "off" ? "text" : chatMode;

  return (
    <div className="app-viewport">
      {showBackground && <GaussSplattingBackground isChatMode={isChatMode} pathname={location.pathname} />}
      <div className="app-content">
        <Outlet />
        <AnimatePresence>
          {shouldShowAppDock && <AppDock key="app-dock" />}
        </AnimatePresence>
        <AnimatePresence>
          {showChatInput && (
            <ChatInput
              key="chat-input"
              mode={chatInputMode}
              onSendMessage={handleSendMessage}
            />
          )}
        </AnimatePresence>
      </div>
      {/* Tutorial overlay */}
      <TutorialOverlay />
      {/* Game panel overlay */}
      <GamePanel />
    </div>
  );
}
