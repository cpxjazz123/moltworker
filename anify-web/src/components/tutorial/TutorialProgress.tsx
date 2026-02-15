import { motion } from "motion/react";

import { type TutorialStep, TUTORIAL_STEP_ORDER } from "@/contexts/TutorialContext";

interface TutorialProgressProps {
  currentStep: TutorialStep;
  completedSteps?: TutorialStep[];
}

// Milestone descriptions
const MILESTONE_DESCRIPTIONS: Record<string, string> = {
  character_create: "创建角色",
  chat_respond: "和 Iris 对话",
  voice_call: "语音通话",
  equipment_check: "查看装备",
  tutorial_complete: "进入世界",
};

export function TutorialProgress({ currentStep }: TutorialProgressProps) {
  // Filter to only show main milestones (not every micro-step)
  const milestones: TutorialStep[] = [
    "character_create",
    "chat_respond",
    "voice_call",
    "equipment_check",
    "tutorial_complete",
  ];

  const getCurrentIndex = () => {
    if (!currentStep) return milestones.length;
    const stepIndex = TUTORIAL_STEP_ORDER.indexOf(currentStep);
    let milestoneIndex = 0;
    for (let i = 0; i < milestones.length; i++) {
      const mIndex = TUTORIAL_STEP_ORDER.indexOf(milestones[i]);
      if (stepIndex <= mIndex) {
        milestoneIndex = i;
        break;
      }
      if (i === milestones.length - 1) {
        milestoneIndex = milestones.length;
      }
    }
    return milestoneIndex;
  };

  const currentMilestoneIndex = getCurrentIndex();
  const progress = (currentMilestoneIndex / milestones.length) * 100;
  const currentMilestone = milestones[currentMilestoneIndex];
  const currentDescription = currentMilestone ? MILESTONE_DESCRIPTIONS[currentMilestone] : "";

  return (
    <motion.div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[10002]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div
        className="px-4 py-2 rounded-2xl"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="flex flex-col items-center gap-1.5">
          {/* Top row: step count + progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60 font-medium whitespace-nowrap">
              {currentMilestoneIndex + 1}/{milestones.length}
            </span>
            <div className="w-24 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  boxShadow: "0 0 10px rgba(251, 191, 36, 0.6)",
                }}
              />
            </div>
          </div>
          {/* Description */}
          <motion.span
            key={currentMilestone}
            className="text-xs text-white/80 font-medium"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentDescription}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
