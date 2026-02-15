import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { LiquidGlass } from "@/components/ui/liquid-glass";

interface CharacterCreationProps {
  onComplete: (name: string) => void;
  onSkip: () => void;
}

export function CharacterCreation({ onComplete, onSkip }: CharacterCreationProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));
    onComplete(name.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-8 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="mb-4"
        >
          <Sparkles
            size={48}
            className="mx-auto text-amber-400"
            style={{
              filter:
                "drop-shadow(0 0 8px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 16px rgba(251, 191, 36, 0.4))",
            }}
          />
        </motion.div>
        <h2
          className="text-2xl font-bold text-white mb-2"
          style={{
            fontFamily: "Georgia, serif",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          Welcome, Adventurer
        </h2>
        <p className="text-white/60 text-sm">
          What shall the world call you?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <LiquidGlass
          padding="16px 20px"
          cornerRadius={24}
          displacementScale={40}
          aberrationIntensity={1}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your name..."
            maxLength={20}
            className="w-full bg-transparent border-none outline-none text-white text-center text-lg placeholder:text-white/40"
            autoFocus
          />
        </LiquidGlass>

        <div className="flex flex-col gap-3 mt-6">
          <motion.button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            whileHover={{ scale: name.trim() ? 1.02 : 1 }}
            whileTap={{ scale: name.trim() ? 0.98 : 1 }}
            className={`
              w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300
              ${
                name.trim()
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              }
            `}
            style={{
              fontFamily: "Georgia, serif",
            }}
          >
            {isSubmitting ? "Starting..." : "Begin Adventure"}
          </motion.button>

          <button
            type="button"
            onClick={onSkip}
            className="text-white/40 text-sm hover:text-white/60 transition-colors"
          >
            Skip Tutorial
          </button>
        </div>
      </form>
    </motion.div>
  );
}
