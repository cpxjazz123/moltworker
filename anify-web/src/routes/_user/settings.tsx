import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  GlassCard,
  GlassContainer,
  PageHeader,
  GlassButton,
} from '../../components/ui/glass-card';
import {
  SettingsGroup,
  SettingsToggle,
  SettingsSlider,
  SettingsSelect,
} from '../../components/settings';
import { useTutorial } from '../../contexts/TutorialContext';
import { useSettingsStore } from '../../stores/settingsStore';
import { dataConnect } from '../../firebase';
import { getPlayerStateSummary } from '@/lib/dataconnect';

export const Route = createFileRoute('/_user/settings')({
  component: SettingsPage,
});

interface SettingSection {
  id: string;
  title: string;
  icon: string;
}

const sections: SettingSection[] = [
  { id: 'display', title: 'Display', icon: '🖥️' },
  { id: 'audio', title: 'Audio', icon: '🔊' },
  { id: 'notifications', title: 'Notifications', icon: '🔔' },
  { id: 'privacy', title: 'Privacy', icon: '🔒' },
  { id: 'game', title: 'Game', icon: '🎮' },
  { id: 'developer', title: 'Developer', icon: '🛠️' },
  { id: 'about', title: 'About', icon: 'ℹ️' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
];

const fontSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const themeOptions = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'auto', label: 'Auto' },
];

const graphicsOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'ultra', label: 'Ultra' },
];

const combatSpeedOptions = [
  { value: 'slow', label: 'Slow' },
  { value: 'normal', label: 'Normal' },
  { value: 'fast', label: 'Fast' },
];

function SettingsPage() {
  const navigate = useNavigate();
  const { resetTutorial } = useTutorial();
  const [activeSection, setActiveSection] = useState('display');
  const [playerState, setPlayerState] = useState<{
    isInitialized: boolean;
    characterName: string;
    tutorialCompleted: boolean;
    tutorialStep: string | null;
  } | null>(null);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const {
    display,
    audio,
    notifications,
    privacy,
    game,
    updateDisplay,
    updateAudio,
    updateNotifications,
    updatePrivacy,
    updateGame,
    resetSettings,
  } = useSettingsStore();

  const renderContent = () => {
    switch (activeSection) {
      case 'display':
        return (
          <div className="space-y-6">
            <SettingsGroup title="Theme" icon="🎨">
              <SettingsSelect
                label="Color Theme"
                value={display.theme}
                onChange={(value) =>
                  updateDisplay({ theme: value as typeof display.theme })
                }
                options={themeOptions}
              />
            </SettingsGroup>

            <SettingsGroup title="Language & Text" icon="🌐">
              <SettingsSelect
                label="Language"
                value={display.language}
                onChange={(value) =>
                  updateDisplay({ language: value as typeof display.language })
                }
                options={languageOptions}
              />
              <SettingsSelect
                label="Font Size"
                value={display.fontSize}
                onChange={(value) =>
                  updateDisplay({ fontSize: value as typeof display.fontSize })
                }
                options={fontSizeOptions}
              />
            </SettingsGroup>

            <SettingsGroup title="Graphics" icon="📺">
              <SettingsSelect
                label="Quality"
                description="Higher quality requires more processing power"
                value={display.graphicsQuality}
                onChange={(value) =>
                  updateDisplay({
                    graphicsQuality: value as typeof display.graphicsQuality,
                  })
                }
                options={graphicsOptions}
              />
              <SettingsSlider
                label="Brightness"
                value={display.brightness}
                onChange={(value) => updateDisplay({ brightness: value })}
              />
              <SettingsToggle
                label="Show FPS"
                description="Display frames per second counter"
                value={display.showFPS}
                onChange={(value) => updateDisplay({ showFPS: value })}
              />
            </SettingsGroup>
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-6">
            <SettingsGroup title="Volume Settings" icon="🔊">
              <SettingsSlider
                label="Master Volume"
                icon="🔊"
                value={audio.masterVolume}
                onChange={(value) => updateAudio({ masterVolume: value })}
              />
              <SettingsSlider
                label="Music"
                icon="🎵"
                value={audio.musicVolume}
                onChange={(value) => updateAudio({ musicVolume: value })}
              />
              <SettingsSlider
                label="Sound Effects"
                icon="🎮"
                value={audio.sfxVolume}
                onChange={(value) => updateAudio({ sfxVolume: value })}
              />
            </SettingsGroup>

            <SettingsGroup title="Voice" icon="🎤">
              <SettingsToggle
                label="Voice Enabled"
                description="Enable character voice lines"
                value={audio.voiceEnabled}
                onChange={(value) => updateAudio({ voiceEnabled: value })}
              />
            </SettingsGroup>
          </div>
        );

      case 'notifications':
        return (
          <SettingsGroup title="Notification Preferences" icon="🔔">
            <SettingsToggle
              label="Push Notifications"
              description="Receive push notifications on your device"
              value={notifications.pushEnabled}
              onChange={(value) => updateNotifications({ pushEnabled: value })}
            />
            <SettingsToggle
              label="Email Notifications"
              description="Receive important updates via email"
              value={notifications.emailEnabled}
              onChange={(value) => updateNotifications({ emailEnabled: value })}
            />
            <SettingsToggle
              label="Quest Reminders"
              description="Get notified about quest updates and deadlines"
              value={notifications.questReminders}
              onChange={(value) =>
                updateNotifications({ questReminders: value })
              }
            />
            <SettingsToggle
              label="Daily Reminders"
              description="Get daily login and activity reminders"
              value={notifications.dailyReminders}
              onChange={(value) =>
                updateNotifications({ dailyReminders: value })
              }
            />
          </SettingsGroup>
        );

      case 'privacy':
        return (
          <SettingsGroup title="Privacy Settings" icon="🔒">
            <SettingsToggle
              label="Show Online Status"
              description="Let others see when you are online"
              value={privacy.showOnlineStatus}
              onChange={(value) => updatePrivacy({ showOnlineStatus: value })}
            />
            <SettingsToggle
              label="Allow Friend Requests"
              description="Allow other players to send you friend requests"
              value={privacy.allowFriendRequests}
              onChange={(value) =>
                updatePrivacy({ allowFriendRequests: value })
              }
            />
            <SettingsToggle
              label="Share Progress"
              description="Let friends see your game progress and achievements"
              value={privacy.shareProgress}
              onChange={(value) => updatePrivacy({ shareProgress: value })}
            />
          </SettingsGroup>
        );

      case 'game':
        return (
          <div className="space-y-6">
            <SettingsGroup title="Gameplay" icon="🎮">
              <SettingsToggle
                label="Auto Save"
                description="Automatically save your progress"
                value={game.autoSave}
                onChange={(value) => updateGame({ autoSave: value })}
              />
              <SettingsToggle
                label="Tutorial Hints"
                description="Show helpful hints during gameplay"
                value={game.tutorialHints}
                onChange={(value) => updateGame({ tutorialHints: value })}
              />
              <SettingsSelect
                label="Combat Speed"
                description="Animation speed during combat"
                value={game.combatSpeed}
                onChange={(value) =>
                  updateGame({ combatSpeed: value as typeof game.combatSpeed })
                }
                options={combatSpeedOptions}
              />
            </SettingsGroup>
          </div>
        );

      case 'developer':
        return (
          <div className="space-y-6">
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">
                Player State (Debug)
              </h3>
              <div className="space-y-4">
                <GlassButton
                  variant="secondary"
                  className="w-full"
                  onClick={async () => {
                    setIsLoadingState(true);
                    try {
                      const result = await getPlayerStateSummary(dataConnect);
                      const user = result.data.user;
                      setPlayerState({
                        isInitialized:
                          user?.playerProfile_on_user?.isInitialized ?? false,
                        characterName:
                          user?.playerProfile_on_user?.characterName ?? '',
                        tutorialCompleted:
                          user?.playerTutorial_on_user?.isCompleted ?? false,
                        tutorialStep:
                          user?.playerTutorial_on_user?.currentStep ?? null,
                      });
                    } catch (error) {
                      console.error('Failed to fetch player state:', error);
                      setPlayerState(null);
                    } finally {
                      setIsLoadingState(false);
                    }
                  }}
                >
                  {isLoadingState ? 'Loading...' : 'Fetch Player State'}
                </GlassButton>

                {playerState && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm font-mono">
                    <div className="text-white/60 mb-2">Current State:</div>
                    <div className="space-y-1 text-white/80">
                      <div>
                        Profile Initialized:{' '}
                        <span
                          className={
                            playerState.isInitialized
                              ? 'text-green-400'
                              : 'text-red-400'
                          }
                        >
                          {playerState.isInitialized ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        Character Name:{' '}
                        {playerState.characterName || '(not set)'}
                      </div>
                      <div>
                        Tutorial Completed:{' '}
                        <span
                          className={
                            playerState.tutorialCompleted
                              ? 'text-green-400'
                              : 'text-white/60'
                          }
                        >
                          {playerState.tutorialCompleted ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        Current Tutorial Step:{' '}
                        {playerState.tutorialStep || '(none)'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard className="border-white/30">
              <h3 className="text-lg font-semibold text-white/80 mb-4">
                Reset Tutorial (Dev)
              </h3>
              <p className="text-white/60 text-sm mb-4">
                Reset tutorial state to test the onboarding flow from the
                beginning.
              </p>
              <div className="space-y-3">
                <GlassButton
                  variant="danger"
                  className="w-full"
                  onClick={async () => {
                    localStorage.removeItem('anify_tutorial_state');
                    localStorage.removeItem('anify_user_initialized');
                    sessionStorage.setItem(
                      'anify_skip_backend_restore',
                      'true'
                    );
                    await resetTutorial();
                    navigate({ to: '/landing' });
                  }}
                >
                  Reset Tutorial & Start Over
                </GlassButton>
                <p className="text-white/40 text-xs">
                  Clears username, tutorial progress, and redirects to the
                  initial landing page. Backend state will be ignored until the
                  session ends.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="border-red-500/30">
              <h3 className="text-lg font-semibold text-red-400 mb-4">
                Database Operations
              </h3>
              <p className="text-white/60 text-sm mb-4">
                To reset database state, use Firebase Console or run SQL
                directly on the Cloud SQL instance.
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/60">
                <div className="mb-2">-- Reset player profile</div>
                <div>DELETE FROM player_profiles WHERE user_id = 'YOUR_UID';</div>
                <div className="mt-2 mb-2">-- Reset tutorial</div>
                <div>DELETE FROM player_tutorials WHERE user_id = 'YOUR_UID';</div>
              </div>
            </GlassCard>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <GlassCard>
              <div className="text-center py-6">
                <div className="text-4xl mb-4">🎮</div>
                <h2 className="text-2xl font-bold text-white mb-2">Anify</h2>
                <p className="text-white/60 mb-4">TRPG Adventure System</p>
                <div className="text-sm text-white/40 space-y-1">
                  <div>Version 0.1.0</div>
                  <div>Build: dev</div>
                </div>
              </div>
            </GlassCard>

            <SettingsGroup title="Reset All Settings" icon="⚠️">
              <div className="py-3">
                <p className="text-white/60 text-sm mb-4">
                  Reset all settings to their default values. This cannot be
                  undone.
                </p>
                <GlassButton
                  variant="danger"
                  className="w-full"
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to reset all settings to defaults?'
                      )
                    ) {
                      resetSettings();
                    }
                  }}
                >
                  Reset All Settings
                </GlassButton>
              </div>
            </SettingsGroup>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 transition-colors">
                  Terms of Service
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 transition-colors">
                  Privacy Policy
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 transition-colors">
                  Open Source Licenses
                </button>
              </div>
            </GlassCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <GlassContainer>
      <PageHeader title="Settings" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <GlassCard size="sm" className="sticky top-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeSection === section.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </GlassCard>
        </div>

        {/* Content */}
        <div className="md:col-span-3">{renderContent()}</div>
      </div>
    </GlassContainer>
  );
}
