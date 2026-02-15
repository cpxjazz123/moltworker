import { Check, Lock } from "lucide-react";

import { useSceneStore, type Scene } from "@/stores/sceneStore";

import { GameOverlayPanel } from "./GameOverlayPanel";

const typeStyles: Record<Scene["type"], {
  badge: string;
  badgeBg: string;
  label: string;
  border: string;
  borderSelected: string;
  glowSelected: string;
}> = {
  indoor: {
    badge: "bg-amber-500/80 text-white",
    badgeBg: "bg-amber-500",
    label: "室内",
    border: "border-transparent",
    borderSelected: "border-amber-400/80",
    glowSelected: "shadow-[0_0_12px_rgba(251,191,36,0.5)]",
  },
  outdoor: {
    badge: "bg-green-500/80 text-white",
    badgeBg: "bg-green-500",
    label: "户外",
    border: "border-transparent",
    borderSelected: "border-green-400/80",
    glowSelected: "shadow-[0_0_12px_rgba(34,197,94,0.5)]",
  },
  fantasy: {
    badge: "bg-purple-500/80 text-white",
    badgeBg: "bg-purple-500",
    label: "幻境",
    border: "border-transparent",
    borderSelected: "border-purple-400/80",
    glowSelected: "shadow-[0_0_12px_rgba(168,85,247,0.5)]",
  },
};

function SceneCard({
  scene,
  isActive,
  onSelect,
}: {
  scene: Scene;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  const typeStyle = typeStyles[scene.type];

  return (
    <div
      className={`group relative aspect-[16/9] cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
        isActive
          ? `${typeStyle.borderSelected} ${typeStyle.glowSelected}`
          : typeStyle.border
      } ${!scene.isUnlocked ? "opacity-60" : ""}`}
      onClick={() => scene.isUnlocked && onSelect(scene.id)}
    >
      {/* Thumbnail */}
      <img
        src={scene.thumbnail}
        alt={scene.name}
        className="h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
        style={{
          animation: "card-breathing 4s ease-in-out infinite",
        }}
      />

      {/* Type badge */}
      <div
        className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${typeStyle.badge}`}
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
      >
        {typeStyle.label}
      </div>

      {/* Active checkmark */}
      {isActive && (
        <div className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full ${typeStyle.badgeBg} shadow-[0_0_8px_rgba(0,0,0,0.3)]`}>
          <Check size={14} className="text-white" strokeWidth={3} />
        </div>
      )}

      {/* Lock overlay for locked scenes */}
      {!scene.isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="rounded-full bg-black/60 p-3">
            <Lock className="h-8 w-8 text-white/80" />
          </div>
        </div>
      )}

      {/* Bottom gradient info area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
        {/* Name */}
        <span
          className="block truncate font-semibold text-white"
          style={{
            fontFamily: "Georgia, serif",
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}
        >
          {scene.name}
        </span>

        {/* Description */}
        <span className="block truncate text-xs text-white/60">
          {scene.description}
        </span>
      </div>
    </div>
  );
}

interface SceneModalProps {
  onClose: () => void;
}

export function SceneModal({ onClose }: SceneModalProps) {
  const { scenes, activeSceneId, setActiveScene } = useSceneStore();

  const handleSelectScene = (sceneId: string) => {
    setActiveScene(sceneId);
  };

  return (
    <GameOverlayPanel
      onClose={onClose}
      title="换场景"
      widthClass="w-[95vw] max-w-[900px]"
    >
      {/* Scenes grid */}
      <div className="max-h-[calc(75vh-4rem)] overflow-y-auto overscroll-contain">
        <div className="grid grid-cols-1 gap-4 pb-2 md:grid-cols-2 lg:grid-cols-3">
          {scenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              isActive={activeSceneId === scene.id}
              onSelect={handleSelectScene}
            />
          ))}
        </div>
      </div>
    </GameOverlayPanel>
  );
}
