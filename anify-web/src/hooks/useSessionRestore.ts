/**
 * Hook for restoring user session state on login.
 * Fetches player profile and tutorial progress from Data Connect
 * and navigates to appropriate page based on state.
 */

import { useNavigate } from "@tanstack/react-router";
import { onAuthStateChanged } from "firebase/auth";
import * as React from "react";

import { useTutorial } from "@/contexts/TutorialContext";
import { auth, dataConnect } from "@/firebase";
import { getPlayerStateSummary } from "@/lib/dataconnect";
import { type TutorialStep } from "@/lib/api";

/**
 * Route mapping for tutorial steps.
 * Maps tutorial steps to their corresponding routes.
 */
const TUTORIAL_STEP_ROUTES: Partial<Record<TutorialStep, string>> = {
    landing: "/landing",
    character_create: "/landing",
    chat_intro: "/",
    chat_respond: "/",
    voice_transition: "/",
    voice_call: "/",
    equipment_check: "/",
    explore_intro: "/",
};

interface UseSessionRestoreOptions {
    /** Whether to enable session restore. Default: true */
    enabled?: boolean;
    /** Called when restore is complete */
    onRestoreComplete?: () => void;
}

interface UseSessionRestoreResult {
    /** Whether session restore is in progress */
    isRestoring: boolean;
    /** Any error that occurred during restore */
    error: Error | null;
}

/**
 * Hook that restores user session state on login.
 *
 * Behavior:
 * 1. Waits for Firebase auth to resolve
 * 2. If user is logged in, fetches player state summary
 * 3. Navigates based on state:
 *    - Not initialized → character creation (landing page)
 *    - Tutorial in progress → current tutorial step route
 *    - Tutorial complete → home page
 *
 * @example
 * ```tsx
 * function App() {
 *   const { isRestoring } = useSessionRestore();
 *
 *   if (isRestoring) {
 *     return <LoadingScreen />;
 *   }
 *
 *   return <MainApp />;
 * }
 * ```
 */
export function useSessionRestore(
    options: UseSessionRestoreOptions = {}
): UseSessionRestoreResult {
    const { enabled = true, onRestoreComplete } = options;

    const navigate = useNavigate();
    const { goToStep, skipTutorial, setPlayerName } = useTutorial();

    const [isRestoring, setIsRestoring] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        if (!enabled) {
            setIsRestoring(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                // Not logged in, nothing to restore
                setIsRestoring(false);
                return;
            }

            try {
                const result = await getPlayerStateSummary(dataConnect);
                const user = result.data.user;
                const profile = user?.playerProfile_on_user;
                const tutorial = user?.playerTutorial_on_user;

                // Case 1: Profile not initialized → go to character creation
                if (!profile?.isInitialized) {
                    goToStep("landing");
                    navigate({ to: "/landing" });
                    setIsRestoring(false);
                    onRestoreComplete?.();
                    return;
                }

                // Restore player name from backend
                if (profile.characterName) {
                    setPlayerName(profile.characterName);
                }

                // Case 2: Tutorial not completed → resume at current step
                if (tutorial && !tutorial.isCompleted) {
                    const currentStep = tutorial.currentStep;
                    if (currentStep) {
                        goToStep(currentStep as TutorialStep);
                        const route = TUTORIAL_STEP_ROUTES[currentStep as TutorialStep] || "/";
                        navigate({ to: route });
                        setIsRestoring(false);
                        onRestoreComplete?.();
                        return;
                    }
                }

                // Case 3: Tutorial completed → go to home
                if (tutorial?.isCompleted) {
                    // Mark tutorial as complete in local state
                    skipTutorial();
                }

                // Navigate to home
                navigate({ to: "/" });
                setIsRestoring(false);
                onRestoreComplete?.();
            } catch (err) {
                console.error("Session restore failed:", err);
                setError(err instanceof Error ? err : new Error("Session restore failed"));
                // On error, still navigate to home and let normal flow handle it
                navigate({ to: "/" });
                setIsRestoring(false);
                onRestoreComplete?.();
            }
        });

        return () => unsubscribe();
    }, [enabled, navigate, goToStep, skipTutorial, setPlayerName, onRestoreComplete]);

    return { isRestoring, error };
}
