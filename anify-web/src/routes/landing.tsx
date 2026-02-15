import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect } from "react";

import { CharacterCreation } from "@/components/tutorial/CharacterCreation";
import { useTutorial } from "@/contexts/TutorialContext";
import { dataConnect } from "@/firebase";
import { initializePlayer, updatePlayerProfile, createUser } from "@/lib/dataconnect";

export const Route = createFileRoute("/landing")({
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const { isActive, currentStep, goToStep, setPlayerName, skipTutorial } = useTutorial();

  // If tutorial is not active and user lands here, start it
  useEffect(() => {
    if (!isActive && currentStep === null) {
      goToStep("landing");
    }
  }, [isActive, currentStep, goToStep]);

  const handleCharacterCreated = async (name: string) => {
    // Save to local state and localStorage
    setPlayerName(name);

    // Ensure user exists first, then persist profile
    createUser(dataConnect).finally(() => {
      Promise.all([
        initializePlayer(dataConnect, { characterName: name }),
        updatePlayerProfile(dataConnect, { characterName: name }),
      ]).catch((err) => {
        console.error("Failed to save player profile:", err);
      });
    });

    goToStep("chat_intro");
    navigate({ to: "/", search: { mode: "chat" } });
  };

  const handleSkip = () => {
    // Ensure user exists first, then initialize profile
    createUser(dataConnect).finally(() => {
      initializePlayer(dataConnect, { characterName: "Adventurer" }).catch((err) => {
        console.error("Failed to initialize player profile:", err);
      });
    });

    skipTutorial();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, rgba(0, 0, 0, 0) 70%)",
        }}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            initial={{
              x: Math.random() * 100 + "%",
              y: "110%",
              opacity: 0,
            }}
            animate={{
              y: "-10%",
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1
          className="text-5xl md:text-6xl font-bold text-white mb-4"
          style={{
            fontFamily: "Georgia, serif",
            textShadow:
              "0 0 40px rgba(139, 92, 246, 0.5), 0 4px 12px rgba(0, 0, 0, 0.5)",
          }}
        >
          Anify
        </h1>
        <p
          className="text-white/60 text-lg"
          style={{
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          Your adventure awaits
        </p>
      </motion.div>

      {/* Character Creation */}
      <CharacterCreation onComplete={handleCharacterCreated} onSkip={handleSkip} />
    </div>
  );
}
