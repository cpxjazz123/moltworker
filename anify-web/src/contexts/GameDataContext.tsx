import * as React from "react";

import {
  type TutorialCharacter,
  type TutorialContact,
  type TutorialEquipment,
  createTutorialCharacter,
  tutorialContacts,
  tutorialEquipment,
} from "@/data/tutorial";
import { useCharacterStore } from "@/stores/characterStore";
import { useTutorial } from "./TutorialContext";
import { useWorld } from "./WorldContext";
import { useLocations, type Location } from "@/hooks/useLocations";
import { useCharacters, type CharacterInfo } from "@/hooks/useCharacters";
import { useOpenClawStream } from "@/hooks/useOpenClawStream";

export type GameMode = "tutorial" | "production";

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isVoice?: boolean;
  /** Audio URL for voice messages */
  audioUrl?: string;
  /** Voice-to-text transcription */
  transcription?: string;
  /** The character session this message belongs to (for filtering per-character history) */
  characterId?: string;
  /** System message type for special messages like character switch */
  systemType?: "character-switch";
  /** The run ID from OpenClaw (for updating streaming messages) */
  runId?: string;
  /** Streaming status */
  status?: 'streaming' | 'final';
}

export interface GameDataContextType {
  mode: GameMode;
  contacts: TutorialContact[];
  /** All messages (full conversation history for AI context) */
  messages: Message[];
  /** Messages for current active character only */
  currentCharacterMessages: Message[];
  equipment: TutorialEquipment[];
  character: TutorialCharacter | null;
  sendMessage: (content: string) => Promise<void>;
  sendVoiceMessage: (input: Blob | string) => Promise<void>;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  clearMessages: () => void;
  // WorldContext integration
  locations: Location[];
  worldCharacters: CharacterInfo[];
  currentLocation: string | null;
  setCurrentLocation: (id: string) => void;
  /** Manually refresh chat history from OpenClaw */
  refreshHistory: () => Promise<void>;
  /** Internal use only: direct access to message state setter */
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const GameDataContext = React.createContext<GameDataContextType | null>(null);

export function GameDataProvider({ children }: { children: React.ReactNode }) {
  const { isActive, playerName } = useTutorial();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentLocation, setCurrentLocation] = React.useState<string | null>(null);

  // WorldContext integration
  const { currentWorld } = useWorld();
  const { locations } = useLocations();
  const { characters: worldCharacters } = useCharacters();

  // Get active character for responses
  const { activeCharacterId } = useCharacterStore();

  // Track previous character to detect switches
  const prevCharacterIdRef = React.useRef<string | null>(null);

  const mode: GameMode = isActive ? "tutorial" : "production";

  // Session key for OpenClaw (per character)
  const sessionKey = React.useMemo(() => {
    const key = `anify-${activeCharacterId || 'default'}`;
    console.log('[GameDataContext] Derived session key:', key, { mode, activeCharacterId });
    return key;
  }, [activeCharacterId]);

  console.log('[GameDataContext] Render:', { mode, isActive, activeCharacterId, sessionKey });

  // Reset current location when world changes
  React.useEffect(() => {
    if (currentWorld?.world.defaultArea) {
      setCurrentLocation(currentWorld.world.defaultArea);
    }
  }, [currentWorld]);

  // Insert system message when character switches (only if there are existing messages)
  React.useEffect(() => {
    const prevId = prevCharacterIdRef.current;

    // Only insert switch message if:
    // 1. There was a previous character (not initial load)
    // 2. Character actually changed
    // 3. There are existing messages in the conversation
    if (prevId !== null && prevId !== activeCharacterId && messages.length > 0) {
      const switchMessage: Message = {
        id: `msg-${Date.now()}-switch`,
        sender: "system",
        content: `对话已切换`,
        timestamp: Date.now(),
        systemType: "character-switch",
        characterId: activeCharacterId ?? undefined,
      };
      setMessages((prev) => [...prev, switchMessage]);
    }

    prevCharacterIdRef.current = activeCharacterId;
  }, [activeCharacterId, messages.length]);

  // Tutorial mode: use static data
  // Production mode: would call backend APIs
  const contacts = React.useMemo(() => {
    if (mode === "tutorial") {
      return tutorialContacts;
    }
    // TODO: Fetch from backend in production mode
    return tutorialContacts;
  }, [mode]);

  const equipment = React.useMemo(() => {
    if (mode === "tutorial") {
      return tutorialEquipment;
    }
    // TODO: Fetch from backend in production mode
    return tutorialEquipment;
  }, [mode]);

  const character = React.useMemo(() => {
    if (mode === "tutorial" && playerName) {
      return createTutorialCharacter(playerName);
    }
    // TODO: Fetch from backend in production mode
    return playerName ? createTutorialCharacter(playerName) : null;
  }, [mode, playerName]);

  const addMessage = React.useCallback(
    (message: Omit<Message, "id" | "timestamp">) => {
      setMessages((prev) => {
        // If message has runId, check if it already exists to avoid duplication during streaming
        if (message.runId) {
          const existingIndex = prev.findIndex((m) => m.runId === message.runId);
          if (existingIndex !== -1) {
            const updatedMessages = [...prev];
            updatedMessages[existingIndex] = {
              ...updatedMessages[existingIndex],
              content: message.content,
              status: message.status || updatedMessages[existingIndex].status,
            };
            return updatedMessages;
          }
        }

        const newMessage: Message = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          timestamp: Date.now(),
          // Tag message with current character session (unless already specified)
          characterId: message.characterId ?? activeCharacterId ?? undefined,
          status: message.status || (message.runId ? 'streaming' : 'final'),
        };
        return [...prev, newMessage];
      });
    },
    [activeCharacterId]
  );

  // Initialize OpenClaw streaming (must be after addMessage is defined)
  useOpenClawStream(sessionKey, addMessage, activeCharacterId);

  const isRefreshingHistoryRef = React.useRef(false);

  // Load history from OpenClaw
  const refreshHistory = React.useCallback(async () => {
    if (!sessionKey || isRefreshingHistoryRef.current) {
      console.log('[GameDataContext] Skipping history load:', !sessionKey ? 'No sessionKey' : 'Already refreshing');
      return;
    }

    isRefreshingHistoryRef.current = true;
    try {
      const { openclawClient, GATEWAY_URL } = await import("@/lib/openclaw-client");

      console.log(`[GameDataContext] Attempting to load history from ${GATEWAY_URL}:`, { sessionKey, activeCharacterId });

      // Ensure connected
      if (!openclawClient.isConnected) {
        console.log('[GameDataContext] Client not connected, connecting...');
        openclawClient.connect();
        await new Promise<void>((resolve) => {
          const check = () => {
            if (openclawClient.isConnected) {
              openclawClient.off('connected', check);
              resolve();
            }
          };
          openclawClient.on('connected', check);
          setTimeout(resolve, 5000);
        });
      }

      console.log('[GameDataContext] Fetching history for session:', sessionKey);
      const data = await openclawClient.request('chat.history', {
        sessionKey,
        limit: 100
      });

      console.log('[GameDataContext] Received history data:', {
        success: !!data,
        messageCount: data?.messages?.length,
        sessionKeyFromData: data?.sessionKey
      });

      if (data?.messages && Array.isArray(data.messages)) {
        const historyMessages = data.messages.map((msg: any) => {
          let content = '';
          if (Array.isArray(msg.content)) {
            content = msg.content
              .map((c: any) => c.text || '')
              .filter(Boolean)
              .join('\n');
          } else if (msg.text) {
            content = msg.text;
          } else if (typeof msg.content === 'string') {
            content = msg.content;
          }

          // More robust timestamp detection
          const timestamp = msg.timestamp || msg.createdAt || msg.created_at || msg.ts || Date.now();

          // Map sender role correctly
          let sender = 'system';
          if (msg.role === 'user' || msg.role === 'human') {
            sender = 'player';
          } else if (msg.role === 'assistant' || msg.role === 'bot') {
            sender = activeCharacterId || 'iris';
          }

          return {
            id: `msg-hist-${timestamp}-${Math.random().toString(36).slice(2, 6)}`,
            sender,
            content,
            timestamp,
            characterId: activeCharacterId || undefined,
          };
        });

        console.log(`[GameDataContext] Setting ${historyMessages.length} messages to state (merging with local messages)`);

        if (historyMessages.length > 0) {
          setMessages((prev) => {
            // Identify "active" local messages that should be preserved:
            // 1. Messages currently streaming (have a runId)
            // 2. Very recent player messages (within last 60s) that might not be in history yet
            const now = Date.now();
            const activeLocalMessages = prev.filter((m: Message) => {
              const matchesCharacter = !m.characterId || m.characterId === activeCharacterId;
              const isStreaming = !!m.runId;
              const isRecentPlayerMsg = m.sender === 'player' && (now - m.timestamp < 60000);
              return matchesCharacter && (isStreaming || isRecentPlayerMsg);
            });

            // Find max timestamp in history to avoid duplicates
            const maxHistoryTs = Math.max(...historyMessages.map((m: Message) => m.timestamp), 0);

            // Filter active local messages to only those NOT already in history (by simple timestamp/content check)
            const uniqueActiveLocal = activeLocalMessages.filter(local => {
              // If it has runId, it's likely newer than history
              if (local.runId) return true;
              return local.timestamp > maxHistoryTs;
            });

            console.log(`[GameDataContext] Merge details: History=${historyMessages.length}, Preserved Local=${uniqueActiveLocal.length}`);
            return [...historyMessages, ...uniqueActiveLocal];
          });
        } else {
          console.log('[GameDataContext] History is empty, keeping local messages');
        }
      }
    } catch (err) {
      console.error('[GameDataContext] Failed to load history:', err);
    } finally {
      isRefreshingHistoryRef.current = false;
    }
  }, [sessionKey, activeCharacterId]);

  // Load history on session change
  React.useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  // Filter messages for current character session
  // Includes: messages from current character session + system messages
  const currentCharacterMessages = React.useMemo(() => {
    if (!activeCharacterId) return messages;

    // Find the last character switch point for current character
    let switchIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.systemType === "character-switch" && msg.characterId === activeCharacterId) {
        switchIndex = i;
        break;
      }
    }

    // If no switch found, return all messages tagged with current character
    // or messages before any character was set
    if (switchIndex === -1) {
      return messages.filter(
        (msg) => !msg.characterId || msg.characterId === activeCharacterId
      );
    }

    // Return messages from switch point onwards
    return messages.slice(switchIndex);
  }, [messages, activeCharacterId]);

  const sendMessage = React.useCallback(
    async (content: string) => {
      // Add the player's message
      addMessage({
        sender: "player",
        content,
      });

      // Production mode or Chat steps: use OpenClaw API
      try {
        const { openclawClient, GATEWAY_URL } = await import("@/lib/openclaw-client");

        // Ensure connected
        if (!openclawClient.isConnected) {
          console.log('[GameDataContext] Connecting to OpenClaw Gateway...');
          openclawClient.connect();

          // Wait for connection (with timeout)
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error(`Connection timeout to Gateway (${GATEWAY_URL})`)), 10000);
            const checkConnection = () => {
              if (openclawClient.isConnected) {
                clearTimeout(timeout);
                openclawClient.off('connected', checkConnection);
                resolve();
              }
            };
            openclawClient.on('connected', checkConnection);
            checkConnection(); // Check immediately in case already connected
          });
        }

        // Send message via OpenClaw
        console.log(`[GameDataContext] Sending message to OpenClaw via ${sessionKey}...`);
        await openclawClient.request('chat.send', {
          sessionKey: sessionKey,
          message: content,
          idempotencyKey: crypto.randomUUID(),
        });

        console.log('[GameDataContext] Message sent successfully');
        // Response will be handled by useOpenClawStream hook via WebSocket events
      } catch (err) {
        console.error('[GameDataContext] Failed to send message:', err);
        // Add error message to chat
        addMessage({
          sender: "system",
          content: `Failed to send message: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    },
    [mode, addMessage, activeCharacterId]
  );

  const sendVoiceMessage = React.useCallback(
    async (input: Blob | string) => {
      try {
        let content: string;
        let audioUrl: string | undefined;

        if (input instanceof Blob) {
          // Legacy/Blob mode
          console.log('[GameDataContext] Processing voice blob, size:', input.size);
          audioUrl = URL.createObjectURL(input);
          content = `[Voice Message - ${Math.round(input.size / 1024)}KB]`;
        } else {
          // Call Mode/Text mode
          content = input;
          // No audio URL for text input unless we generate one, but for Call Mode we usually don't need local playback of our own voice
        }

        // Add the player's voice message
        addMessage({
          sender: "player",
          content: content,
          isVoice: true,
          audioUrl,
        });

        const { openclawClient } = await import("@/lib/openclaw-client");

        // Wait for connection if not already connected
        if (!openclawClient.isConnected) {
          console.log('[GameDataContext] Waiting for existing OpenClaw connection...');
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Connection timeout - please try again')), 10000);
            const checkConnection = () => {
              if (openclawClient.isConnected) {
                clearTimeout(timeout);
                openclawClient.off('connected', checkConnection);
                resolve();
              }
            };
            openclawClient.on('connected', checkConnection);
            checkConnection();
          });
        }

        // Send message
        console.log(`[GameDataContext] Sending voice message (${typeof input}) to OpenClaw via ${sessionKey}...`);
        await openclawClient.request('chat.send', {
          sessionKey: sessionKey,
          message: content,
          idempotencyKey: crypto.randomUUID(),
        });

        console.log('[GameDataContext] Voice message sent successfully');
      } catch (err) {
        console.error('[GameDataContext] Failed to send voice message:', err);
        addMessage({
          sender: "system",
          content: `Failed to send voice message: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    },
    [sessionKey, addMessage]
  );

  const clearMessages = React.useCallback(() => {
    setMessages([]);
  }, []);

  const value = React.useMemo(
    () => ({
      mode,
      contacts,
      messages,
      currentCharacterMessages,
      equipment,
      character,
      sendMessage,
      sendVoiceMessage,
      addMessage,
      clearMessages,
      // WorldContext integration
      locations,
      worldCharacters,
      currentLocation,
      setCurrentLocation,
      setMessages,
      refreshHistory,
    }),
    [mode, contacts, messages, currentCharacterMessages, equipment, character, sendMessage, sendVoiceMessage, addMessage, clearMessages, locations, worldCharacters, currentLocation, refreshHistory]
  );

  return (
    <GameDataContext.Provider value={value}>
      {children}
    </GameDataContext.Provider>
  );
}

export function useGameData() {
  const context = React.useContext(GameDataContext);
  if (!context) {
    throw new Error("useGameData must be used within a GameDataProvider");
  }
  return context;
}
