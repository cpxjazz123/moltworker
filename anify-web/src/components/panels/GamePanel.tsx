import { usePanelStore } from '@/stores/panelStore';
import type { PanelType } from '@/types';

import { GameOverlayPanel } from '../GameOverlayPanel';

import { CharacterPanel } from './CharacterPanel';
import { ForgePanel } from './ForgePanel';
import { GuildPanel } from './GuildPanel';
import { InventoryPanel } from './InventoryPanel';
import { ResidencePanel } from './ResidencePanel';
import { ShopPanel } from './ShopPanel';
import { StoragePanel } from './StoragePanel';

import { MapPanel } from './MapPanel';
import { TasksPanel } from './TasksPanel';
import { AchievementsPanel } from './AchievementsPanel';

const PANEL_COMPONENTS: Record<PanelType, React.ComponentType<{ onClose?: () => void }>> = {
  shop: ShopPanel,
  forge: ForgePanel,
  guild: GuildPanel,
  residence: ResidencePanel,
  storage: StoragePanel,
  tasks: TasksPanel,
  achievements: AchievementsPanel,
  character: CharacterPanel,
  inventory: InventoryPanel,
  map: MapPanel,
};

const PANEL_TITLES: Record<PanelType, string> = {
  shop: '商店',
  forge: '🔨 锻造炉',
  guild: '⚔️ 冒险者公会',
  residence: '我的住所',
  storage: '公共仓库',
  tasks: '📋 每日任务',
  achievements: '🏆 成就',
  character: '👤 角色',
  inventory: '🎒 背包',
  map: '🗺️ 地图',
};

const PANEL_WIDTH_CLASSES: Record<PanelType, string> = {
  shop: 'w-[90vw] max-w-[800px]',
  forge: 'w-[85vw] max-w-[700px]',
  guild: 'w-[85vw] max-w-[700px]',
  residence: 'w-[80vw] max-w-[600px]',
  storage: 'w-[90vw] max-w-[800px]',
  tasks: 'w-[85vw] max-w-[500px]',
  achievements: 'w-[85vw] max-w-[600px]',
  character: 'w-[85vw] max-w-[600px]',
  inventory: 'w-[90vw] max-w-[600px]',
  map: 'w-[90vw] max-w-4xl',
};

export function GamePanel() {
  const { isOpen, activePanel, closePanel } = usePanelStore();

  if (!isOpen || !activePanel) {
    return null;
  }

  const PanelComponent = PANEL_COMPONENTS[activePanel.panelType];
  const widthClass = PANEL_WIDTH_CLASSES[activePanel.panelType];
  const title = PANEL_TITLES[activePanel.panelType];

  return (
    <GameOverlayPanel
      closeOnBackdropClick
      onClose={closePanel}
      position="center"
      title={title}
      widthClass={widthClass}
    >
      <PanelComponent onClose={closePanel} />
    </GameOverlayPanel>
  );
}
