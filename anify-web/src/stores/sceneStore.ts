import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Scene {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  splatUrl: string;
  type: "indoor" | "outdoor" | "fantasy";
  isUnlocked: boolean;
}

// Default splat URL (ceramic room)
const DEFAULT_SPLAT_URL = "https://oss.anify.ai/gs/3b5320a4-72b4-4eb4-98fe-13c78ae1c070_ceramic_500k.spz";

// Placeholder thumbnail for scenes without preview images
const PLACEHOLDER_THUMBNAIL = "/background.jpg";

// Mock scenes data
const SCENES: Scene[] = [
  {
    id: "cozy-bedroom",
    name: "温馨卧室",
    description: "舒适温暖的私人空间",
    thumbnail: PLACEHOLDER_THUMBNAIL,
    splatUrl: DEFAULT_SPLAT_URL,
    type: "indoor",
    isUnlocked: true,
  },
  {
    id: "moonlit-garden",
    name: "月光花园",
    description: "月光洒落的神秘花园",
    thumbnail: PLACEHOLDER_THUMBNAIL,
    splatUrl: DEFAULT_SPLAT_URL, // TODO: Replace with actual splat URL
    type: "outdoor",
    isUnlocked: true,
  },
  {
    id: "crystal-cavern",
    name: "水晶洞穴",
    description: "闪烁着魔法光芒的洞穴",
    thumbnail: PLACEHOLDER_THUMBNAIL,
    splatUrl: DEFAULT_SPLAT_URL, // TODO: Replace with actual splat URL
    type: "fantasy",
    isUnlocked: true,
  },
  {
    id: "city-rooftop",
    name: "城市天台",
    description: "俯瞰城市夜景的高处",
    thumbnail: PLACEHOLDER_THUMBNAIL,
    splatUrl: DEFAULT_SPLAT_URL, // TODO: Replace with actual splat URL
    type: "outdoor",
    isUnlocked: true,
  },
  {
    id: "ancient-library",
    name: "古老图书馆",
    description: "藏有无数秘密的图书馆",
    thumbnail: PLACEHOLDER_THUMBNAIL,
    splatUrl: DEFAULT_SPLAT_URL, // TODO: Replace with actual splat URL
    type: "indoor",
    isUnlocked: false,
  },
  {
    id: "starfall-realm",
    name: "星陨之境",
    description: "星辰坠落的奇幻空间",
    thumbnail: PLACEHOLDER_THUMBNAIL,
    splatUrl: DEFAULT_SPLAT_URL, // TODO: Replace with actual splat URL
    type: "fantasy",
    isUnlocked: false,
  },
];

// Default scene ID
const DEFAULT_SCENE_ID = 'cozy-bedroom';

interface SceneStore {
  activeSceneId: string;
  scenes: Scene[];
  setActiveScene: (id: string) => void;
  getActiveScene: () => Scene | undefined;
  getScene: (id: string) => Scene | undefined;
}

export const useSceneStore = create<SceneStore>()(
  persist(
    (set, get) => ({
      activeSceneId: DEFAULT_SCENE_ID,
      scenes: SCENES,
      setActiveScene: (id) => {
        const scene = get().scenes.find((s) => s.id === id);
        if (scene?.isUnlocked) {
          set({ activeSceneId: id });
        }
      },
      getActiveScene: () => {
        const state = get();
        return state.scenes.find((s) => s.id === state.activeSceneId);
      },
      getScene: (id) => {
        return get().scenes.find((s) => s.id === id);
      },
    }),
    {
      name: 'anify-active-scene',
      partialize: (state) => ({ activeSceneId: state.activeSceneId }),
    }
  )
);
