import { Check } from "lucide-react";

import { useOutfitStore, type Outfit } from "@/stores/outfitStore";

import { GameOverlayPanel } from "./GameOverlayPanel";

const rarityStyles: Record<Outfit["rarity"], {
  border: string;
  borderSelected: string;
  badge: string;
  badgeBg: string;
  glow?: string;
  glowSelected: string;
}> = {
  common: {
    border: "border-gray-400/50",
    borderSelected: "border-gray-400/80",
    badge: "bg-gray-500 text-white",
    badgeBg: "bg-gray-500",
    glowSelected: "shadow-[0_0_12px_rgba(156,163,175,0.5)]",
  },
  rare: {
    border: "border-blue-400/50",
    borderSelected: "border-blue-400/80",
    badge: "bg-blue-500 text-white",
    badgeBg: "bg-blue-500",
    glowSelected: "shadow-[0_0_12px_rgba(59,130,246,0.5)]",
  },
  epic: {
    border: "border-purple-400/50",
    borderSelected: "border-purple-400/80",
    badge: "bg-purple-500 text-white",
    badgeBg: "bg-purple-500",
    glowSelected: "shadow-[0_0_12px_rgba(168,85,247,0.5)]",
  },
  legendary: {
    border: "border-amber-400/50",
    borderSelected: "border-amber-400/80",
    badge: "bg-amber-500 text-black",
    badgeBg: "bg-amber-500",
    glow: "shadow-[0_0_12px_rgba(251,191,36,0.6)]",
    glowSelected: "shadow-[0_0_16px_rgba(251,191,36,0.7)]",
  },
};

const rarityLabels: Record<Outfit["rarity"], string> = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
  legendary: "传说",
};

function OutfitCard({
  outfit,
  isEquipped,
  onSelect,
}: {
  outfit: Outfit;
  isEquipped: boolean;
  onSelect: (id: string) => void;
}) {
  const style = rarityStyles[outfit.rarity];

  return (
    <div
      className={`group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-200 active:scale-[0.97] ${
        isEquipped
          ? `${style.borderSelected} ${style.glowSelected}`
          : `${style.border} ${style.glow || ""}`
      } ${!outfit.isOwned ? "opacity-60" : ""}`}
      onClick={() => outfit.isOwned && onSelect(outfit.id)}
    >
      {/* Thumbnail */}
      <img
        src={outfit.thumbnail}
        alt={outfit.name}
        className="h-full w-full object-cover object-top transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
        style={{
          animation: "card-breathing 4s ease-in-out infinite",
        }}
      />

      {/* Rarity badge */}
      <div
        className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
      >
        {rarityLabels[outfit.rarity]}
      </div>

      {/* Equipped checkmark */}
      {isEquipped && (
        <div className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full ${style.badgeBg} shadow-[0_0_8px_rgba(0,0,0,0.3)]`}>
          <Check size={14} className={outfit.rarity === "legendary" ? "text-black" : "text-white"} strokeWidth={3} />
        </div>
      )}

      {/* Lock overlay for unowned outfits */}
      {!outfit.isOwned && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="rounded-full bg-black/60 p-3">
            <svg
              className="h-8 w-8 text-white/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
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
          {outfit.name}
        </span>

        {/* Description */}
        <span className="block truncate text-xs text-white/60">
          {outfit.description}
        </span>
      </div>
    </div>
  );
}

interface OutfitModalProps {
  onClose: () => void;
}

export function OutfitModal({ onClose }: OutfitModalProps) {
  const { outfits, equippedOutfitId, setEquippedOutfit } = useOutfitStore();

  const handleSelectOutfit = (outfitId: string) => {
    setEquippedOutfit(outfitId);
  };

  return (
    <GameOverlayPanel
      onClose={onClose}
      title="换装"
      widthClass="w-[95vw] max-w-[800px]"
    >
      {/* Outfits grid */}
      <div className="max-h-[calc(75vh-4rem)] overflow-y-auto overscroll-contain">
        <div className="grid grid-cols-2 gap-4 pb-2 md:grid-cols-3 lg:grid-cols-4">
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              isEquipped={equippedOutfitId === outfit.id}
              onSelect={handleSelectOutfit}
            />
          ))}
        </div>
      </div>
    </GameOverlayPanel>
  );
}
