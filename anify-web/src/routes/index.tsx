import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookUser, ChevronDown, ChevronUp, Flame, Heart, Images, MessageCircle, Phone, Shirt, Sparkles, Star, X } from "lucide-react";

import { ContactsModal } from "@/components/ContactsModal";
import { OutfitModal } from "@/components/OutfitModal";
import { SceneModal } from "@/components/SceneModal";
import { ChatBubble } from "@/components/tutorial/ChatBubble";
import { VoiceChat } from "@/components/VoiceChat";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { useChatMode } from "@/contexts/ChatModeContext";
import { useGameData } from "@/contexts/GameDataContext";
import { useTutorial, type TutorialStep } from "@/contexts/TutorialContext";
import { useAllCharacters } from "@/hooks/useAllCharacters";
import { useCharacterStore } from "@/stores/characterStore";

import characterImg from "/Character_sample.png";

// Legacy tutorial messages - kept for backward compatibility
// TODO: Remove once migrated to WorldContext data
interface LegacyTutorialMessage {
  id: string;
  sender: "iris" | "player" | "system";
  content: string;
  delay: number;
  step: string;
  isVoice?: boolean;
}

const LEGACY_TUTORIAL_MESSAGES: LegacyTutorialMessage[] = [
  // chat_intro step
  { id: "intro-1", sender: "iris", content: "终于联系上你了！我是虹彩守护者 Iris。", delay: 0, step: "chat_intro" },
  { id: "intro-2", sender: "iris", content: "暮光森林出现了异常，古老的结界正在崩溃...", delay: 1500, step: "chat_intro" },
  { id: "intro-3", sender: "iris", content: "我需要你的帮助！", delay: 3000, step: "chat_intro" },
  // voice_transition step
  { id: "voice-trans-1", sender: "iris", content: "太好了，你愿意帮忙！", delay: 0, step: "voice_transition" },
  { id: "voice-trans-2", sender: "iris", content: "情况紧急，我需要用语音和你详细说明，这样更快。", delay: 1500, step: "voice_transition" },
  { id: "voice-trans-3", sender: "iris", content: "请切换到语音模式。", delay: 3000, step: "voice_transition" },
  // voice_call step
  { id: "voice-1", sender: "iris", content: "现在我们可以更好地沟通了。", delay: 0, step: "voice_call", isVoice: true },
  { id: "voice-2", sender: "iris", content: "在你出发之前，先检查一下你的装备。", delay: 2000, step: "voice_call", isVoice: true },
  { id: "voice-3", sender: "iris", content: "点击下方的'我'查看你的装备。", delay: 4000, step: "voice_call", isVoice: true },
];

function getMessagesForStep(step: TutorialStep): LegacyTutorialMessage[] {
  if (!step) return [];
  return LEGACY_TUTORIAL_MESSAGES.filter((m) => m.step === step);
}

type SearchParams = {
  mode?: "voice" | "chat";
};

export const Route = createFileRoute("/")({
  component: Dashboard,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    mode: search.mode === "voice" ? "voice" : search.mode === "chat" ? "chat" : undefined,
  }),
});

// Request gyroscope permission (needed for iOS 13+)
async function requestGyroPermission() {
  if (typeof DeviceOrientationEvent !== "undefined") {
    const DeviceOrientation = DeviceOrientationEvent as any;

    if (typeof DeviceOrientation.requestPermission === "function") {
      try {
        const permission = await DeviceOrientation.requestPermission();

        if (permission === "granted") {
          window.dispatchEvent(new CustomEvent("gyro-permission-granted"));
        }
      } catch (error) {
        console.error("Gyro permission error:", error);
      }
    } else {
      // Non-iOS or older browsers don't need permission
      window.dispatchEvent(new CustomEvent("gyro-permission-granted"));
    }
  }
}

function Dashboard() {
  const { isChatMode, setChatMode, chatMode } = useChatMode();
  const { mode } = Route.useSearch();
  const [showContacts, setShowContacts] = useState(false);
  const [showOutfits, setShowOutfits] = useState(false);
  const [showScenes, setShowScenes] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isActive: isTutorialActive, currentStep, advanceStep, goToStep } = useTutorial();
  const { currentCharacterMessages: messages, addMessage, refreshHistory } = useGameData();
  const [tutorialMessagesPlayed, setTutorialMessagesPlayed] = useState<Set<string>>(new Set());
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const stepStartTimeRef = useRef<{ step: string; time: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Refresh history when opening chat panel
  useEffect(() => {
    if (chatMode === "text") {
      console.log('[Dashboard] Chat mode entered, refreshing history...');
      setIsHistoryLoading(true);
      refreshHistory().finally(() => {
        setIsHistoryLoading(false);
      });
    }
  }, [chatMode, refreshHistory]);

  // Character state
  const { activeCharacterId } = useCharacterStore();
  const { getCharacter } = useAllCharacters();
  const activeCharacter = activeCharacterId ? getCharacter(activeCharacterId) : null;

  // Scroll to bottom when messages change (for text chat mode)
  useEffect(() => {
    if (chatMode === "text") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatMode]);

  // Play tutorial messages for voice_transition, voice_call, and chat_intro steps
  useEffect(() => {
    if (!isTutorialActive || !currentStep) return;
    if (currentStep !== "voice_transition" && currentStep !== "voice_call" && currentStep !== "chat_intro") return;

    const stepMessages = getMessagesForStep(currentStep);
    const unplayedMessages = stepMessages.filter((m) => !tutorialMessagesPlayed.has(m.id));

    // Record step start time only once per step
    if (!stepStartTimeRef.current || stepStartTimeRef.current.step !== currentStep) {
      stepStartTimeRef.current = { step: currentStep, time: Date.now() };
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const stepStartTime = stepStartTimeRef.current.time;

    // Schedule unplayed messages with delay relative to step start
    unplayedMessages.forEach((tutorialMsg) => {
      const elapsed = Date.now() - stepStartTime;
      const remainingDelay = Math.max(0, tutorialMsg.delay - elapsed);

      const timeout = setTimeout(() => {
        addMessage({
          sender: tutorialMsg.sender,
          content: tutorialMsg.content,
          isVoice: tutorialMsg.isVoice,
        });
        setTutorialMessagesPlayed((prev) => new Set([...prev, tutorialMsg.id]));
      }, remainingDelay);
      timeouts.push(timeout);
    });

    // Auto-advance after voice_call or chat_intro messages
    if (currentStep === "voice_call" || currentStep === "chat_intro") {
      const allStepMessages = getMessagesForStep(currentStep);
      const maxDelay = Math.max(...allStepMessages.map((m) => m.delay));
      const advanceDelay = currentStep === "voice_call" ? 2000 : 1500;

      const elapsed = Date.now() - stepStartTime;
      const remainingAdvanceDelay = Math.max(0, maxDelay + advanceDelay - elapsed);

      const advanceTimeout = setTimeout(() => {
        advanceStep();
      }, remainingAdvanceDelay);
      timeouts.push(advanceTimeout);
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isTutorialActive, currentStep, tutorialMessagesPlayed, addMessage, advanceStep]);

  // Handle tutorial step progression: entering voice mode completes step 3/5
  useEffect(() => {
    if (isTutorialActive && (currentStep === "voice_transition" || currentStep === "voice_call") && chatMode === "voice") {
      goToStep("equipment_check"); // Skip to equipment_check (4/5)
    }
  }, [isTutorialActive, currentStep, chatMode, goToStep]);

  // Track whether URL mode has been processed to avoid overriding manual mode changes
  const processedModeRef = useRef<string | undefined>(undefined);

  // Auto-trigger chat mode based on URL params (only on initial load or when mode param changes)
  useEffect(() => {
    // Skip if we've already processed this mode value
    if (processedModeRef.current === mode) return;

    if (mode === "voice" && chatMode !== "voice") {
      requestGyroPermission().then(() => {
        setChatMode("voice");
        processedModeRef.current = mode;
      });
    } else if (mode === "chat" && chatMode !== "text") {
      setChatMode("text");
      processedModeRef.current = mode;
    } else if (mode) {
      // Mode matches current state, mark as processed
      processedModeRef.current = mode;
    }
  }, [mode, chatMode, setChatMode]);

  const enterTextMode = () => {
    setChatMode("text");
  };

  const enterVoiceMode = async () => {
    if (!isChatMode) {
      await requestGyroPermission();
    }
    setChatMode("voice");
  };

  // Normal mode menu items
  const normalModeMenuItems: Array<{ icon: typeof BookUser; label: string; action: () => void; id?: string }> = [
    { icon: BookUser, label: "通讯录", action: () => setShowContacts(true) },
    { icon: Shirt, label: "换装", action: () => setShowOutfits(true) },
    { icon: Images, label: "换场景", action: () => setShowScenes(true) },
    { icon: MessageCircle, label: "对话", action: enterTextMode },
    { icon: Phone, label: "语音通话", action: enterVoiceMode, id: "voice-call-button" },
  ];

  // Voice mode menu items
  const voiceModeMenuItems: Array<{ icon: typeof BookUser; label: string; action: () => void; id?: string }> = [
    { icon: BookUser, label: "通讯录", action: () => setShowContacts(true) },
    { icon: Shirt, label: "换装", action: () => setShowOutfits(true) },
    { icon: Images, label: "换场景", action: () => setShowScenes(true) },
    { icon: MessageCircle, label: "对话", action: enterTextMode },
    { icon: X, label: "关闭", action: () => setChatMode("off") },
  ];

  // Text/Chat mode menu items
  const textModeMenuItems: Array<{ icon: typeof BookUser; label: string; action: () => void; id?: string }> = [
    { icon: BookUser, label: "通讯录", action: () => setShowContacts(true) },
    { icon: Shirt, label: "换装", action: () => setShowOutfits(true) },
    { icon: Images, label: "换场景", action: () => setShowScenes(true) },
    { icon: Phone, label: "语音通话", action: enterVoiceMode },
    { icon: X, label: "关闭", action: () => setChatMode("off") },
  ];

  const menuItems = chatMode === "voice" ? voiceModeMenuItems : chatMode === "text" ? textModeMenuItems : normalModeMenuItems;

  // Character data from store (with fallbacks)
  const characterName = activeCharacter?.name ?? "未选择角色";
  const favorability = activeCharacter?.favorability ?? 0;
  // Convert favorability (0-100) to level and progress
  const affectionLevel = Math.floor(favorability / 10) + 1;
  const affectionProgress = (favorability % 10) * 10;
  // These are still mock data (no source in characters.json yet)
  const characterLevel = 25;
  const characterProgress = 40; // percentage
  const streakDays = 7;

  return (
    <div className="home-container">
      {/* Left side status indicators */}
      <div className="fixed left-4 top-4 z-50 flex flex-col gap-4 items-start">
        {/* Character Name */}
        <div className="flex items-center gap-2">
          <div className="flex w-8 items-center justify-center">
            <Sparkles
              size={26}
              className="text-purple-400"
              fill="currentColor"
              style={{ filter: 'drop-shadow(0 0 1px white) drop-shadow(0 0 2px white) drop-shadow(1px 2px 2px rgba(192, 132, 252, 0.6)) drop-shadow(2px 4px 4px rgba(192, 132, 252, 0.6))' }}
            />
          </div>
          <span
            className="text-lg italic font-bold tracking-wider text-white"
            style={{
              fontFamily: 'Georgia, serif',
              WebkitTextStroke: '0.5px rgba(180, 180, 180, 0.6)',
              textShadow: '0 1px 2px rgba(180, 180, 180, 0.4), 0 0 6px rgba(255, 255, 255, 0.3), 0 0 12px rgba(255, 255, 255, 0.15)',
              filter: 'drop-shadow(0 1px 1px rgba(180, 180, 180, 0.4))',
              letterSpacing: '0.1em',
            }}
          >
            {characterName}
          </span>
        </div>

        {/* Character Level */}
        <div className="flex items-center gap-2">
          <div className="relative flex w-8 items-center justify-center">
            <Star
              size={28}
              className="text-yellow-400"
              fill="currentColor"
              style={{ filter: 'drop-shadow(0 0 1px white) drop-shadow(0 0 2px white) drop-shadow(1px 2px 2px rgba(250, 204, 21, 0.6)) drop-shadow(2px 4px 4px rgba(250, 204, 21, 0.6))' }}
            />
            <span
              className="absolute font-semibold text-white italic"
              style={{ fontSize: '18px', fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5)', transform: 'translateY(-2px)' }}
            >
              {characterLevel}
            </span>
          </div>
          <div
            className="h-2 w-20 rounded-full bg-white/10"
            style={{
              boxShadow: '0 0 10px rgba(250, 204, 21, 0.5), 0 0 16px rgba(250, 204, 21, 0.25), inset 0 0 0 1px rgba(250, 204, 21, 0.5), 0 0 0 1px rgba(255, 255, 255, 1)'
            }}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"
              style={{ width: `${characterProgress}%`, boxShadow: '0 0 8px rgba(250, 204, 21, 0.9), 0 0 14px rgba(250, 204, 21, 0.4)' }}
            />
          </div>
        </div>

        {/* Affection Level */}
        <div className="flex items-center gap-2">
          <div className="relative flex w-8 items-center justify-center">
            <Heart
              size={28}
              className="text-pink-400"
              fill="currentColor"
              style={{ filter: 'drop-shadow(0 0 1px white) drop-shadow(0 0 2px white) drop-shadow(1px 2px 2px rgba(244, 114, 182, 0.6)) drop-shadow(2px 4px 4px rgba(244, 114, 182, 0.6))' }}
            />
            <span
              className="absolute font-semibold text-white italic"
              style={{ fontSize: '18px', fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5)', transform: 'translateY(-2px)' }}
            >
              {affectionLevel}
            </span>
          </div>
          <div
            className="h-2 w-10 rounded-full bg-white/10"
            style={{
              boxShadow: '0 0 10px rgba(244, 114, 182, 0.5), 0 0 16px rgba(244, 114, 182, 0.25), inset 0 0 0 1px rgba(244, 114, 182, 0.5), 0 0 0 1px rgba(255, 255, 255, 1)'
            }}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-500"
              style={{ width: `${affectionProgress}%`, boxShadow: '0 0 8px rgba(244, 114, 182, 0.9), 0 0 14px rgba(244, 114, 182, 0.4)' }}
            />
          </div>
        </div>

        {/* Streak Days */}
        <div className="flex items-center gap-2">
          <div className="relative flex w-8 items-center justify-center">
            <Flame
              size={30}
              className="text-orange-400"
              fill="currentColor"
              style={{ filter: 'drop-shadow(0 0 1px white) drop-shadow(0 0 2px white) drop-shadow(1px 2px 3px rgba(251, 146, 60, 0.8)) drop-shadow(2px 4px 6px rgba(251, 146, 60, 0.7))' }}
            />
            <span
              className="absolute font-semibold text-white italic"
              style={{ fontSize: '18px', fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5)', transform: 'translateY(1px)' }}
            >
              {streakDays}
            </span>
          </div>
        </div>
      </div>

      {/* Right side menu buttons */}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-3">
        {menuItems.map(({ icon: Icon, label, action, id }) => (
          <LiquidGlass
            key={label}
            id={id}
            padding="12px"
            displacementScale={40}
            aberrationIntensity={1}
            onClick={action}
          >
            <Icon size={24} strokeWidth={2} />
          </LiquidGlass>
        ))}
      </div>

      {/* Character display */}
      <main className="character-stage">
        <div className="character-wrapper">
          {/* In a real Live2D implementation, this would be a Canvas */}
          <img alt="Character Stand-in" src={characterImg} />
        </div>
      </main>

      {/* Chat messages container - only visible in text mode */}
      {chatMode === "text" && (
        <div
          className={`fixed inset-x-0 bottom-[86px] z-[60] flex flex-col transition-all duration-300 ${isExpanded ? "h-[calc(100dvh-98px)]" : "h-[320px]"
            }`}
        >
          {/* Expand/Collapse button */}
          <div className="mx-auto mb-2 flex-shrink-0">
            <LiquidGlass
              padding="8px"
              displacementScale={40}
              aberrationIntensity={1}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </LiquidGlass>
          </div>
          <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-40 xl:mx-60 overflow-y-auto rounded-2xl border border-white/30 bg-black/20 px-4 py-4 flex-1 min-h-0">
            <div className="flex flex-col gap-3">
              {isHistoryLoading && messages.length === 0 && (
                <div className="flex justify-center p-4">
                  <div className="flex items-center gap-2 text-xs text-white/40 italic">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50 animate-pulse" />
                    Syncing conversation...
                  </div>
                </div>
              )}
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  isPlayer={message.sender === "player"}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Voice chat interface - only visible in voice mode */}
      {chatMode === "voice" && (
        <div className="fixed inset-x-0 bottom-[86px] top-0 z-[60] flex items-center justify-center">
          <VoiceChat
            onClose={() => setChatMode("off")}
            characterName={characterName}
          />
        </div>
      )}

      {showContacts && (
        <ContactsModal onClose={() => setShowContacts(false)} />
      )}
      {showOutfits && (
        <OutfitModal onClose={() => setShowOutfits(false)} />
      )}
      {showScenes && (
        <SceneModal onClose={() => setShowScenes(false)} />
      )}
    </div>
  );
}
