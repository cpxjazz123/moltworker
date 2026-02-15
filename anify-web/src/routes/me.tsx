import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect } from "react";

import {
  MeTabs,
  type MeCategoryId,
  type CharacterSubTabId,
  type InventorySubTabId,
  CharacterTab,
  EquipmentTab,
  GrimoireTab,
  AchievementsTab,
  InventoryTab,
} from "@/components/me";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { useGameData } from "@/contexts/GameDataContext";
import { useTutorial } from "@/contexts/TutorialContext";

const VALID_CATEGORIES: MeCategoryId[] = ['character', 'inventory'];
const CHARACTER_TABS: CharacterSubTabId[] = ['stats', 'equipment', 'grimoire', 'achievements'];
const INVENTORY_TABS: InventorySubTabId[] = ['equipment', 'consumable', 'material', 'other'];

const DEFAULT_SUB_TAB: Record<MeCategoryId, string> = {
  character: 'equipment',
  inventory: 'equipment',
};

interface MeSearchParams {
  cat?: MeCategoryId;
  tab?: string;
}

export const Route = createFileRoute("/me")({
  component: MePage,
  validateSearch: (search: Record<string, unknown>): MeSearchParams => {
    const cat = search.cat as string | undefined;
    const tab = search.tab as string | undefined;

    const validCat = cat && VALID_CATEGORIES.includes(cat as MeCategoryId)
      ? (cat as MeCategoryId)
      : undefined;

    const validTabs = validCat === 'inventory' ? INVENTORY_TABS : CHARACTER_TABS;
    const validTab = tab && validTabs.includes(tab as never)
      ? tab
      : undefined;

    return { cat: validCat, tab: validTab };
  },
});

function MePage() {
  const navigate = useNavigate();
  const { cat, tab } = useSearch({ from: "/me" });
  const { character } = useGameData();
  const { isActive: isTutorialActive, currentStep, advanceStep } = useTutorial();

  const activeCategory: MeCategoryId = cat || 'character';
  const activeSubTab = tab || DEFAULT_SUB_TAB[activeCategory];

  const handleCategoryChange = useCallback(
    (newCat: MeCategoryId) => {
      navigate({
        to: "/me",
        search: { cat: newCat, tab: DEFAULT_SUB_TAB[newCat] },
        replace: true,
      });
    },
    [navigate]
  );

  const handleSubTabChange = useCallback(
    (newTab: string) => {
      navigate({
        to: "/me",
        search: { cat: activeCategory, tab: newTab },
        replace: true,
      });
    },
    [navigate, activeCategory]
  );

  // Advance tutorial immediately when reaching /me
  useEffect(() => {
    if (isTutorialActive && currentStep === "equipment_check") {
      advanceStep();
    }
  }, [isTutorialActive, currentStep, advanceStep]);

  const renderTabContent = () => {
    if (activeCategory === 'inventory') {
      return <InventoryTab subTab={activeSubTab as InventorySubTabId} />;
    }

    switch (activeSubTab) {
      case 'stats':
        return <CharacterTab />;
      case 'equipment':
        return <EquipmentTab />;
      case 'grimoire':
        return <GrimoireTab />;
      case 'achievements':
        return <AchievementsTab />;
      default:
        return <EquipmentTab />;
    }
  };

  return (
    <div className="min-h-[100dvh] p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <LiquidGlass
          padding="12px"
          displacementScale={40}
          aberrationIntensity={1}
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft size={20} />
        </LiquidGlass>
        <div>
          <h1
            className="text-xl font-bold text-white"
            style={{
              fontFamily: "Georgia, serif",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {character?.name || "Adventurer"}
          </h1>
          <p className="text-sm text-white/60">Level {character?.level || 1}</p>
        </div>
      </div>

      {/* Tutorial overlay message */}
      {isTutorialActive && currentStep === "equipment_check" && (
        <motion.div
          className="mb-4 p-4 rounded-xl bg-purple-500/20 border border-purple-500/30"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-purple-200 text-sm text-center">
            This is your equipment panel. As a new adventurer, you've been given starter gear.
          </p>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="mb-4">
        <MeTabs
          activeCategory={activeCategory}
          activeSubTab={activeSubTab}
          onCategoryChange={handleCategoryChange}
          onSubTabChange={handleSubTabChange}
        />
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
}
