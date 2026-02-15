import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { LiquidGlass } from '@/components/ui/liquid-glass';
import { QuestList } from '@/components/quest/QuestList';
import { useQuests } from '@/hooks/useQuests';

export const Route = createFileRoute('/_game/quest')({
  component: QuestPage,
});

function QuestPage() {
  const { quests, isLoading, error } = useQuests();

  return (
    <div className="min-h-[100dvh] p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/explore">
          <LiquidGlass padding="12px" displacementScale={40} aberrationIntensity={1}>
            <ArrowLeft size={20} />
          </LiquidGlass>
        </Link>
        <div>
          <h1
            className="text-xl font-bold text-white"
            style={{
              fontFamily: 'Georgia, serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            Quest Log
          </h1>
          <p className="text-sm text-white/60">Your active quests</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-white/60" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8 text-red-400">
          Failed to load quests. Please try again.
        </div>
      )}

      {/* Quest List */}
      {!isLoading && !error && <QuestList quests={quests} />}
    </div>
  );
}

