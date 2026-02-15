import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CharacterStore {
  activeCharacterId: string | null;
  setActiveCharacter: (id: string) => void;
  clearActiveCharacter: () => void;
}

// Default character ID (Iris from tutorial)
const DEFAULT_CHARACTER_ID = 'iris';

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      activeCharacterId: DEFAULT_CHARACTER_ID,
      setActiveCharacter: (id) => set({ activeCharacterId: id }),
      clearActiveCharacter: () => set({ activeCharacterId: DEFAULT_CHARACTER_ID }),
    }),
    {
      name: 'anify-active-character',
    }
  )
);