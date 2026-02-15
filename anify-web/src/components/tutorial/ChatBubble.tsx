import { motion } from "motion/react";

import type { Message } from "@/contexts/GameDataContext";
import { useAllCharacters } from "@/hooks/useAllCharacters";

interface ChatBubbleProps {
  message: Message;
  isPlayer: boolean;
}

export function ChatBubble({ message, isPlayer }: ChatBubbleProps) {
  const { getCharacter } = useAllCharacters();
  
  // Look up character by message.sender (the character ID)
  const senderCharacter = getCharacter(message.sender);
  // Display real character name, fallback to sender ID if not found
  const senderDisplayName = senderCharacter?.name ?? message.sender;
  
  // For character switch messages, get the new character name
  const switchToCharacter = message.characterId ? getCharacter(message.characterId) : null;
  const isCharacterSwitch = message.systemType === "character-switch";

  // Character switch message - render as centered divider
  if (isCharacterSwitch) {
    return (
      <motion.div
        className="flex justify-center my-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
          <div className="w-8 h-[1px] bg-white/20" />
          <span className="text-xs text-white/50">
            切换至 <span className="text-amber-400/80">{switchToCharacter?.name ?? "未知角色"}</span>
          </span>
          <div className="w-8 h-[1px] bg-white/20" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`flex ${isPlayer ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className={`
          max-w-[80%] px-4 py-3 rounded-2xl
          ${
            isPlayer
              ? "bg-gradient-to-br from-amber-500/80 to-orange-500/80 text-white rounded-tr-sm"
              : message.sender === "system"
                ? "bg-purple-500/20 text-purple-200 border border-purple-500/30"
                : "bg-white/10 text-white rounded-tl-sm"
          }
        `}
        style={{
          backdropFilter: "blur(10px)",
          boxShadow: isPlayer
            ? "0 4px 12px rgba(251, 191, 36, 0.2)"
            : "0 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        {!isPlayer && message.sender !== "system" && (
          <div className="text-xs text-amber-400 font-medium mb-1">
            {senderDisplayName}
          </div>
        )}
        <p className="text-sm leading-relaxed">{message.content}</p>
        {message.isVoice && (
          <div className="flex items-center gap-1 mt-2 text-xs text-white/50">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Voice
          </div>
        )}
      </div>
    </motion.div>
  );
}
