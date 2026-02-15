import { AnimatePresence } from "motion/react";

import { useTutorial } from "@/contexts/TutorialContext";

import { TutorialProgress } from "./TutorialProgress";

export function TutorialOverlay() {
  const { isActive, currentStep, completedSteps } = useTutorial();

  if (!isActive || !currentStep) return null;

  return (
    <AnimatePresence>
      {currentStep !== "landing" && currentStep !== "character_create" && (
        <TutorialProgress
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      )}
    </AnimatePresence>
  );
}
