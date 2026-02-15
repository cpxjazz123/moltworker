import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Display settings
export type Theme = 'dark' | 'light' | 'auto';
export type Language = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr' | 'de';
export type FontSize = 'small' | 'medium' | 'large';
export type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra';
export type CombatSpeed = 'slow' | 'normal' | 'fast';

interface DisplaySettings {
  theme: Theme;
  language: Language;
  fontSize: FontSize;
  graphicsQuality: GraphicsQuality;
  brightness: number;
  showFPS: boolean;
}

interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  voiceEnabled: boolean;
}

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  questReminders: boolean;
  dailyReminders: boolean;
}

interface PrivacySettings {
  showOnlineStatus: boolean;
  allowFriendRequests: boolean;
  shareProgress: boolean;
}

interface GameSettings {
  autoSave: boolean;
  tutorialHints: boolean;
  combatSpeed: CombatSpeed;
}

interface SettingsState {
  display: DisplaySettings;
  audio: AudioSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  game: GameSettings;
}

interface SettingsActions {
  updateDisplay: (settings: Partial<DisplaySettings>) => void;
  updateAudio: (settings: Partial<AudioSettings>) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  updateGame: (settings: Partial<GameSettings>) => void;
  updateSetting: <K extends keyof SettingsState>(
    category: K,
    key: keyof SettingsState[K],
    value: SettingsState[K][keyof SettingsState[K]]
  ) => void;
  resetSettings: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

const defaultSettings: SettingsState = {
  display: {
    theme: 'dark',
    language: 'en',
    fontSize: 'medium',
    graphicsQuality: 'high',
    brightness: 80,
    showFPS: false,
  },
  audio: {
    masterVolume: 80,
    musicVolume: 70,
    sfxVolume: 90,
    voiceEnabled: true,
  },
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    questReminders: true,
    dailyReminders: true,
  },
  privacy: {
    showOnlineStatus: true,
    allowFriendRequests: true,
    shareProgress: true,
  },
  game: {
    autoSave: true,
    tutorialHints: true,
    combatSpeed: 'normal',
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateDisplay: (settings) =>
        set((state) => ({
          display: { ...state.display, ...settings },
        })),

      updateAudio: (settings) =>
        set((state) => ({
          audio: { ...state.audio, ...settings },
        })),

      updateNotifications: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),

      updatePrivacy: (settings) =>
        set((state) => ({
          privacy: { ...state.privacy, ...settings },
        })),

      updateGame: (settings) =>
        set((state) => ({
          game: { ...state.game, ...settings },
        })),

      updateSetting: (category, key, value) =>
        set((state) => ({
          [category]: {
            ...state[category],
            [key]: value,
          },
        })),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'anify-settings',
    }
  )
);
