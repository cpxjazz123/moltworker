import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Outfit {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  isOwned: boolean;
}

// Mock outfits data
const OUTFITS: Outfit[] = [
  {
    id: "daily-dress",
    name: "日常便装",
    description: "舒适的日常穿搭",
    thumbnail: "/Character_sample.png",
    rarity: "common",
    isOwned: true,
  },
  {
    id: "battle-armor",
    name: "战斗铠甲",
    description: "为战斗而生的护甲",
    thumbnail: "/Character_sample.png",
    rarity: "rare",
    isOwned: true,
  },
  {
    id: "summer-breeze",
    name: "夏日微风",
    description: "清凉的夏季服装",
    thumbnail: "/Character_sample.png",
    rarity: "common",
    isOwned: true,
  },
  {
    id: "night-gala",
    name: "星夜晚宴",
    description: "华丽的晚礼服",
    thumbnail: "/Character_sample.png",
    rarity: "epic",
    isOwned: true,
  },
  {
    id: "ancient-robe",
    name: "上古法袍",
    description: "蕴含古老魔力的法袍",
    thumbnail: "/Character_sample.png",
    rarity: "legendary",
    isOwned: false,
  },
  {
    id: "school-uniform",
    name: "学院制服",
    description: "魔法学院的标准制服",
    thumbnail: "/Character_sample.png",
    rarity: "rare",
    isOwned: true,
  },
];

// Default outfit ID
const DEFAULT_OUTFIT_ID = 'daily-dress';

interface OutfitStore {
  equippedOutfitId: string;
  outfits: Outfit[];
  setEquippedOutfit: (id: string) => void;
  getEquippedOutfit: () => Outfit | undefined;
  getOutfit: (id: string) => Outfit | undefined;
}

export const useOutfitStore = create<OutfitStore>()(
  persist(
    (set, get) => ({
      equippedOutfitId: DEFAULT_OUTFIT_ID,
      outfits: OUTFITS,
      setEquippedOutfit: (id) => {
        const outfit = get().outfits.find((o) => o.id === id);
        if (outfit?.isOwned) {
          set({ equippedOutfitId: id });
        }
      },
      getEquippedOutfit: () => {
        const state = get();
        return state.outfits.find((o) => o.id === state.equippedOutfitId);
      },
      getOutfit: (id) => {
        return get().outfits.find((o) => o.id === id);
      },
    }),
    {
      name: 'anify-equipped-outfit',
      partialize: (state) => ({ equippedOutfitId: state.equippedOutfitId }),
    }
  )
);
