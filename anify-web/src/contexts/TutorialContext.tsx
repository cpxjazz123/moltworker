import * as React from "react";

import { useWorld, useCurrentWorld } from "@/contexts/WorldContext";
import { useTutorialData, type TutorialMessage } from "@/hooks/useTutorialData";
import { dataConnect } from "@/firebase";
import {
  startTutorial as dcStartTutorial,
  advanceTutorial as dcAdvanceTutorial,
  completeTutorial as dcCompleteTutorial,
  resetTutorial as dcResetTutorial,
  createUser,
} from "@/lib/dataconnect";
import type { TutorialStep as WorldTutorialStep, WorldMetaCharacter } from "@/types/world-metadata";

const STORAGE_KEY = "anify_tutorial_state";
const USER_INITIALIZED_KEY = "anify_user_initialized";

// Backend sync mode: when true, syncs tutorial state to Data Connect
// Set to false for local-only development/testing
const ENABLE_BACKEND_SYNC = true;

// Legacy TutorialStep type for backward compatibility
// Will be phased out as we migrate to WorldContext data
export type TutorialStep =
  | "landing"
  | "character_create"
  | "chat_intro"
  | "chat_respond"
  | "voice_transition"
  | "voice_call"
  | "equipment_check"
  | "explore_intro"
  | "tutorial_complete"
  | null;

// Legacy step order for backward compatibility
export const TUTORIAL_STEP_ORDER: TutorialStep[] = [
  "landing",
  "character_create",
  "chat_intro",
  "chat_respond",
  "voice_transition",
  "voice_call",
  "equipment_check",
  "explore_intro",
  "tutorial_complete",
];

// Legacy step config for backward compatibility
const LEGACY_STEP_CONFIG: Record<Exclude<TutorialStep, null>, { nextStep: TutorialStep }> = {
  landing: { nextStep: "character_create" },
  character_create: { nextStep: "chat_intro" },
  chat_intro: { nextStep: "chat_respond" },
  chat_respond: { nextStep: "voice_transition" },
  voice_transition: { nextStep: "voice_call" },
  voice_call: { nextStep: "equipment_check" },
  equipment_check: { nextStep: "explore_intro" },
  explore_intro: { nextStep: "tutorial_complete" },
  tutorial_complete: { nextStep: null },
};

export interface TutorialState {
  isActive: boolean;
  currentStep: TutorialStep;
  completedSteps: TutorialStep[];
  playerName: string;
}

// Legacy contact format for backward compatibility
export interface LegacyContact {
  id: string;
  name: string;
  avatar: string;
  title: string;
  greeting: string;
}

interface TutorialContextType extends TutorialState {
  advanceStep: () => void;
  goToStep: (step: TutorialStep) => void;
  skipTutorial: () => void;
  resetTutorial: () => Promise<void>;
  setPlayerName: (name: string) => void;
  isNewUser: boolean;
  // New WorldContext-based data
  currentStepConfig: WorldTutorialStep | null;
  currentMessages: TutorialMessage[];
  currentCharacter: WorldMetaCharacter | undefined;
  // Message playback state
  messageQueue: TutorialMessage[];
  currentMessageIndex: number;
  isShowingMessage: boolean;
  currentDisplayMessage: TutorialMessage | null;
  // Utility methods
  isTutorialStep: (stepId: string) => boolean;
  // Backward compatibility API
  getLegacyContact: (characterId: string) => LegacyContact | null;
  getContacts: () => LegacyContact[];
}

const TutorialContext = React.createContext<TutorialContextType | null>(null);

function loadTutorialState(): TutorialState {
  // Try to load from localStorage cache first
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore parse errors
  }
  return {
    isActive: false,
    currentStep: null,
    completedSteps: [],
    playerName: "",
  };
}

function saveTutorialState(state: TutorialState) {
  // Always save to localStorage as cache
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Sync tutorial state to Data Connect (fire and forget).
 * Errors are logged but don't affect local state.
 */
async function syncToBackend(
  action: "start" | "advance" | "complete" | "reset",
  currentStep?: TutorialStep,
  completedSteps?: string[]
): Promise<void> {
  if (!ENABLE_BACKEND_SYNC) return;

  try {
    // Ensure user record exists in SQL before creating dependent records (profile/tutorial)
    await createUser(dataConnect);

    switch (action) {
      case "start":
        await dcStartTutorial(dataConnect);
        break;
      case "advance":
        if (currentStep && completedSteps) {
          await dcAdvanceTutorial(dataConnect, {
            currentStep: currentStep,
            completedSteps: completedSteps,
          });
        }
        break;
      case "complete":
        await dcCompleteTutorial(dataConnect);
        break;
      case "reset":
        await dcResetTutorial(dataConnect);
        break;
    }
  } catch (error) {
    console.error(`Failed to sync tutorial ${action} to Data Connect:`, error);
    // Don't throw - backend sync failures shouldn't break local experience
  }
}

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<TutorialState>(loadTutorialState);
  const [isNewUser, setIsNewUser] = React.useState(false);

  // Message playback state
  const [messageQueue, setMessageQueue] = React.useState<TutorialMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);
  const [isShowingMessage, setIsShowingMessage] = React.useState(false);

  // WorldContext integration
  const { isTutorialWorld, getCharacter } = useWorld();
  const currentWorld = useCurrentWorld();
  const {
    isEnabled: worldTutorialEnabled,
    stepOrder: worldStepOrder,
    getStep,
    getStepMessages,
    getStepCharacter,
    getNextStep: worldGetNextStep,
  } = useTutorialData();

  // Check if we should use WorldContext data
  const useWorldData = isTutorialWorld() && worldTutorialEnabled;

  // Current step configuration from WorldContext
  const currentStepConfig = React.useMemo(() => {
    if (!useWorldData || !state.currentStep) return null;
    return getStep(state.currentStep) ?? null;
  }, [useWorldData, state.currentStep, getStep]);

  // Current messages from WorldContext
  const currentMessages = React.useMemo(() => {
    if (!useWorldData || !state.currentStep) return [];
    return getStepMessages(state.currentStep);
  }, [useWorldData, state.currentStep, getStepMessages]);

  // Current character from WorldContext
  const currentCharacter = React.useMemo(() => {
    if (!useWorldData || !state.currentStep) return undefined;
    return getStepCharacter(state.currentStep);
  }, [useWorldData, state.currentStep, getStepCharacter]);

  // Get step order - prefer WorldContext if available
  const stepOrder = React.useMemo(() => {
    if (useWorldData && worldStepOrder.length > 0) {
      return worldStepOrder;
    }
    return TUTORIAL_STEP_ORDER.filter((s): s is Exclude<TutorialStep, null> => s !== null);
  }, [useWorldData, worldStepOrder]);

  // Current display message
  const currentDisplayMessage = React.useMemo(() => {
    return messageQueue[currentMessageIndex] ?? null;
  }, [messageQueue, currentMessageIndex]);

  // When step changes, update message queue and start playback
  React.useEffect(() => {
    if (!state.currentStep) {
      setMessageQueue([]);
      setCurrentMessageIndex(0);
      setIsShowingMessage(false);
      return;
    }

    const messages = getStepMessages(state.currentStep);
    if (messages.length > 0) {
      setMessageQueue(messages);
      setCurrentMessageIndex(0);
      setIsShowingMessage(true);

      // Play message sequence with delays
      let cancelled = false;
      const playMessages = async () => {
        for (let i = 0; i < messages.length; i++) {
          if (cancelled) break;

          setCurrentMessageIndex(i);
          const msg = messages[i];

          // Wait for delay before showing next message
          if (msg.delay && msg.delay > 0 && i < messages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, msg.delay));
          }
        }
        if (!cancelled) {
          setIsShowingMessage(false);
        }
      };

      playMessages();

      return () => {
        cancelled = true;
      };
    } else {
      setMessageQueue([]);
      setCurrentMessageIndex(0);
      setIsShowingMessage(false);
    }
  }, [state.currentStep, getStepMessages]);

  // Check if new user on mount
  // Uses localStorage cache, backend state is loaded via useSessionRestore hook
  React.useEffect(() => {
    const initialized = localStorage.getItem(USER_INITIALIZED_KEY);
    console.log('[TutorialContext] Initialized check:', { initialized, USER_INITIALIZED_KEY });
    setIsNewUser(!initialized);
  }, []);

  // Persist state changes
  React.useEffect(() => {
    saveTutorialState(state);
  }, [state]);

  const advanceStep = React.useCallback(() => {
    setState((prev) => {
      if (!prev.currentStep) return prev;

      const currentStep = prev.currentStep;

      // Try WorldContext first, then fallback to legacy config
      let nextStep: TutorialStep = null;
      if (useWorldData) {
        const worldNextStep = worldGetNextStep(currentStep);
        nextStep = (worldNextStep as TutorialStep) ?? null;
      } else {
        nextStep = LEGACY_STEP_CONFIG[currentStep]?.nextStep ?? null;
      }

      const newCompletedSteps = currentStep
        ? [...prev.completedSteps, currentStep]
        : prev.completedSteps;

      // Sync to backend (fire and forget)
      if (nextStep === null || nextStep === "tutorial_complete") {
        console.log('[TutorialContext] Tutorial completed via advanceStep');
        syncToBackend("complete");
        localStorage.setItem(USER_INITIALIZED_KEY, "true");
        return {
          ...prev,
          isActive: false,
          currentStep: null,
          completedSteps: newCompletedSteps,
        };
      }

      // Sync step advancement to backend
      // Filter out null values for the API call
      const stepsForApi = newCompletedSteps.filter((s): s is Exclude<TutorialStep, null> => s !== null);
      syncToBackend("advance", nextStep, stepsForApi);

      return {
        ...prev,
        currentStep: nextStep,
        completedSteps: newCompletedSteps,
      };
    });
  }, [useWorldData, worldGetNextStep]);

  const goToStep = React.useCallback((step: TutorialStep) => {
    setState((prev) => {
      // If starting tutorial from beginning, sync to backend
      if (step === "landing" && !prev.isActive) {
        syncToBackend("start");
      }
      return {
        ...prev,
        isActive: step !== null,
        currentStep: step,
      };
    });
  }, []);

  const skipTutorial = React.useCallback(() => {
    // Sync completion to backend
    syncToBackend("complete");

    localStorage.setItem(USER_INITIALIZED_KEY, "true");
    setState({
      isActive: false,
      currentStep: null,
      completedSteps: [...stepOrder] as TutorialStep[],
      playerName: state.playerName || "Adventurer",
    });
    setIsNewUser(false);
  }, [state.playerName, stepOrder]);

  const resetTutorial = React.useCallback(async () => {
    localStorage.removeItem(USER_INITIALIZED_KEY);

    // Get first step from stepOrder
    const firstStep = (stepOrder[0] as TutorialStep) ?? "landing";

    setState({
      isActive: true,
      currentStep: firstStep,
      completedSteps: [],
      playerName: "",
    });
    setIsNewUser(true);
    // Sync reset to backend and wait for completion
    try {
      await dcResetTutorial(dataConnect);
      console.log("[Tutorial] Backend reset successful");
    } catch (error) {
      console.error("[Tutorial] Backend reset failed:", error);
    }
  }, [stepOrder]);

  const setPlayerName = React.useCallback((name: string) => {
    setState((prev) => ({ ...prev, playerName: name }));
  }, []);

  const isTutorialStep = React.useCallback((stepId: string) => {
    return state.currentStep === stepId;
  }, [state.currentStep]);

  // Backward compatibility: convert WorldMetaCharacter to legacy contact format
  const getLegacyContact = React.useCallback((characterId: string): LegacyContact | null => {
    const char = getCharacter(characterId);
    if (!char) return null;

    return {
      id: char.id,
      name: char.name,
      avatar: char.portrait ?? '',
      title: char.title ?? '',
      greeting: char.greeting ?? '',
    };
  }, [getCharacter]);

  // Backward compatibility: get all guide characters as contacts
  const getContacts = React.useCallback((): LegacyContact[] => {
    return (currentWorld?.characters ?? [])
      .filter(c => c.role === 'guide')
      .map(c => getLegacyContact(c.id))
      .filter((c): c is LegacyContact => c !== null);
  }, [currentWorld, getLegacyContact]);

  const value = React.useMemo(
    () => ({
      ...state,
      advanceStep,
      goToStep,
      skipTutorial,
      resetTutorial,
      setPlayerName,
      isNewUser,
      // WorldContext data
      currentStepConfig,
      currentMessages,
      currentCharacter,
      // Message playback
      messageQueue,
      currentMessageIndex,
      isShowingMessage,
      currentDisplayMessage,
      // Utility
      isTutorialStep,
      // Backward compatibility
      getLegacyContact,
      getContacts,
    }),
    [
      state,
      advanceStep,
      goToStep,
      skipTutorial,
      resetTutorial,
      setPlayerName,
      isNewUser,
      currentStepConfig,
      currentMessages,
      currentCharacter,
      messageQueue,
      currentMessageIndex,
      isShowingMessage,
      currentDisplayMessage,
      isTutorialStep,
      getLegacyContact,
      getContacts,
    ]
  );

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = React.useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}
