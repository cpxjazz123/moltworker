import { Check } from "lucide-react";

import { useAllCharacters } from "@/hooks/useAllCharacters";
import type { CharacterInfo } from "@/hooks/useCharacters";
import { useCharacterStore } from "@/stores/characterStore";

import { GameOverlayPanel } from "./GameOverlayPanel";

function CharacterCard({
  character,
  isSelected,
  onSelect,
}: {
  character: CharacterInfo;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className={`group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-200 active:scale-[0.97] ${
        isSelected
          ? "border-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
          : "border-transparent"
      }`}
      onClick={() => onSelect(character.id)}
    >
      {/* Half-body portrait */}
      <img
        src={character.portrait || "/Character_sample.png"}
        alt={character.name}
        className="h-full w-full object-cover object-top transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
        style={{
          animation: "card-breathing 4s ease-in-out infinite",
        }}
      />

      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.8)]">
          <Check size={14} className="text-black" strokeWidth={3} />
        </div>
      )}

      {/* Bottom gradient info area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
        {/* Affinity bar */}
        <div
          className="mb-2 h-1 overflow-hidden rounded-full bg-white/20"
          style={{
            boxShadow: "inset 0 0 4px rgba(244,114,182,0.3)",
          }}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-500"
            style={{
              width: `${character.favorability}%`,
              boxShadow: "0 0 6px rgba(244,114,182,0.6)",
            }}
          />
        </div>

        {/* Name */}
        <span
          className="block truncate font-semibold text-white"
          style={{
            fontFamily: "Georgia, serif",
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}
        >
          {character.name}
        </span>

        {/* Title */}
        <span className="block truncate text-xs text-white/60">
          {character.title || character.description}
        </span>
      </div>
    </div>
  );
}

interface ContactsModalProps {
  onClose: () => void;
}

export function ContactsModal({ onClose }: ContactsModalProps) {
  const { characters } = useAllCharacters();
  const { activeCharacterId, setActiveCharacter } = useCharacterStore();

  const handleSelectContact = (characterId: string) => {
    setActiveCharacter(characterId);
  };

  return (
    <GameOverlayPanel
      onClose={onClose}
      title="通讯录"
      widthClass="w-[95vw] max-w-[800px]"
    >
      {/* Contacts grid */}
      <div className="max-h-[calc(75vh-4rem)] overflow-y-auto overscroll-contain">
        <div className="grid grid-cols-2 gap-4 pb-2 md:grid-cols-3 lg:grid-cols-4">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isSelected={activeCharacterId === character.id}
              onSelect={handleSelectContact}
            />
          ))}
        </div>
      </div>
    </GameOverlayPanel>
  );
}
