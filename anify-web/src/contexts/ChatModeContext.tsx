import * as React from "react";

export type ChatMode = "off" | "text" | "voice";

interface ChatModeContextType {
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  isChatMode: boolean; // Compatibility: chatMode !== "off"
}

const ChatModeContext = React.createContext<ChatModeContextType | null>(null);

export function ChatModeProvider({ children }: { children: React.ReactNode }) {
  const [chatMode, setChatModeState] = React.useState<ChatMode>("off");

  const setChatMode = React.useCallback((mode: ChatMode) => {
    setChatModeState(mode);
  }, []);

  const isChatMode = chatMode !== "off";

  return (
    <ChatModeContext.Provider value={{ chatMode, setChatMode, isChatMode }}>
      {children}
    </ChatModeContext.Provider>
  );
}

export function useChatMode() {
  const context = React.useContext(ChatModeContext);

  if (!context) {
    throw new Error("useChatMode must be used within a ChatModeProvider");
  }

  return context;
}
