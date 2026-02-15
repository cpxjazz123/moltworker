import { AudioLines, Mic, MicOff, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { LiquidGlass } from "./ui/liquid-glass";

interface ChatInputProps {
  mode: "text" | "voice";
  onSendMessage?: (message: string) => void;
}

export function ChatInput({ mode, onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) {
      return;
    }
    // Call the callback if provided
    if (onSendMessage) {
      onSendMessage(message.trim());
    }
    console.log("[ChatInput] Send message:", message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    console.log("[ChatInput] Voice call:", !isVoiceActive ? "started" : "stopped");
  };

  const handleMicMuteToggle = () => {
    setIsMicMuted(!isMicMuted);
    console.log("[ChatInput] Mic muted:", !isMicMuted);
  };

  return (
    <motion.div
      style={{ position: "relative", zIndex: 9999 }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <nav className="bottom-nav">
        <div className="flex items-center justify-center gap-3 w-full">
          {mode === "text" ? (
            <>
              {/* Text Mode: [Text Input] [Send] */}
              <LiquidGlass
                id="chat-input"
                className="flex-1"
                padding="12px 16px"
                cornerRadius={28}
                displacementScale={40}
                aberrationIntensity={1}
              >
                <input
                  className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-white/40"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Say something..."
                  type="text"
                  value={message}
                />
              </LiquidGlass>

              <LiquidGlass
                id="chat-send-button"
                padding="12px"
                displacementScale={40}
                aberrationIntensity={1}
                onClick={message.trim() ? handleSendMessage : undefined}
                className={!message.trim() ? "opacity-40" : ""}
              >
                <Send size={24} strokeWidth={2} />
              </LiquidGlass>
            </>
          ) : (
            <>
              {/* Voice Mode: [Voice Call] [Mute] */}
              <LiquidGlass
                className="flex-1"
                padding="12px 16px"
                cornerRadius={28}
                displacementScale={40}
                aberrationIntensity={1}
                onClick={handleVoiceToggle}
                fullWidth
                backgroundColor={isVoiceActive ? "rgba(34, 197, 94, 0.3)" : undefined}
              >
                <AudioLines
                  size={24}
                  strokeWidth={2}
                  className={isVoiceActive ? "text-green-400" : ""}
                />
              </LiquidGlass>

              <LiquidGlass
                padding="12px"
                displacementScale={40}
                aberrationIntensity={1}
                onClick={handleMicMuteToggle}
                backgroundColor={isMicMuted ? "rgba(239, 68, 68, 0.3)" : undefined}
              >
                {isMicMuted ? (
                  <MicOff size={24} strokeWidth={2} className="text-red-400" />
                ) : (
                  <Mic size={24} strokeWidth={2} />
                )}
              </LiquidGlass>
            </>
          )}
        </div>
      </nav>
    </motion.div>
  );
}
