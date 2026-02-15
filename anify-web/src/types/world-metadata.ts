// src/types/world-metadata.ts

/**
 * World Metadata Types
 * 定义世界元数据 JSON 的 TypeScript 类型
 *
 * Note: Types prefixed with "WorldMeta" to avoid conflicts with existing
 * types in location.ts, quest.ts, and interaction.ts
 */

// ============================================================================
// ENUMS
// ============================================================================

export type WorldMetaType = 'tutorial' | 'campaign' | 'sandbox';
export type AreaType = 'town' | 'adventure';
export type CharacterRole = 'guide' | 'companion' | 'merchant' | 'quest-giver' | 'enemy' | 'npc';
export type ItemType = 'weapon' | 'armor' | 'accessory' | 'helm' | 'boots' | 'gloves' | 'consumable' | 'material' | 'quest';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type DialogueNodeType = 'npc' | 'player' | 'choice' | 'system' | 'action';

// ============================================================================
// WORLD
// ============================================================================

export interface WorldSettings {
  difficulty: 'easy' | 'normal' | 'hard';
  permadeath: boolean;
  timeScale: number;
}

export interface WorldFeatures {
  combat: boolean;
  exploration: boolean;
  dialogue: boolean;
  tutorial: boolean;
  crafting: boolean;
  trading: boolean;
}

export interface WorldRequirements {
  minLevel: number;
  completedWorlds: string[];
}

export interface WorldMeta {
  id: string;
  name: string;
  description: string;
  version: string;
  type: WorldMetaType;
  coverImage?: string;
  available: boolean;
  defaultArea: string;
  defaultCharacter?: string;
  settings: WorldSettings;
  features: WorldFeatures;
  requirements: WorldRequirements;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// AREA
// ============================================================================

export interface Area {
  id: string;
  name: string;
  description: string;
  type: AreaType;
  mapX: number;
  mapY: number;
  icon: string;
  dangerLevel: number;
  levelRange?: string;
  scene?: string;           // scene ID reference
  characters: string[];     // character ID references
  connectedAreas: string[]; // area ID references
  unlocked: boolean;
  requirements: string[];
}

export interface AreasFile {
  areas: Area[];
}

// ============================================================================
// CHARACTER
// ============================================================================

export interface CharacterAttributes {
  perception: number;
  agility: number;
  strength: number;
  intelligence: number;
  charisma: number;
  [key: string]: number;    // 允许扩展属性
}

export interface WorldMetaCharacter {
  id: string;
  name: string;
  title?: string;
  description: string;
  portrait?: string;
  role: CharacterRole;
  personality?: string;
  backstory?: string;
  location?: string;        // area ID reference
  baseFavorability: number;
  greeting?: string;
  attributes: CharacterAttributes;
  dialogueTree?: string;    // dialogue tree ID reference
  quests?: string[];        // quest ID references
}

export interface CharactersFile {
  characters: WorldMetaCharacter[];
}

// ============================================================================
// EQUIPMENT & ITEMS
// ============================================================================

export interface ItemStat {
  name: string;
  value: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
  level: number;
  stats: ItemStat[];
  description: string;
  equipped?: boolean;
}

export interface StarterKit {
  enabled: boolean;
  items: string[];          // equipment ID references
}

export interface EquipmentFile {
  starterKit: StarterKit;
  equipment: Equipment[];
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
  description: string;
  stackable: boolean;
  maxStack: number;
  price?: number;
  effects?: Record<string, number>;
}

export interface ItemsFile {
  items: Item[];
}

// ============================================================================
// QUESTS
// ============================================================================

export interface WorldMetaQuestObjective {
  id: string;
  description: string;
  type: 'kill' | 'collect' | 'talk' | 'explore' | 'custom';
  target?: string;
  count: number;
}

export interface WorldMetaQuestReward {
  type: 'exp' | 'gold' | 'item' | 'equipment';
  id?: string;
  amount: number;
}

export interface WorldMetaQuest {
  id: string;
  name: string;
  description: string;
  category: 'main' | 'side' | 'daily' | 'tutorial';
  level: number;
  giver?: string;           // character ID
  location?: string;        // area ID
  objectives: WorldMetaQuestObjective[];
  rewards: WorldMetaQuestReward[];
  prerequisites?: string[]; // quest IDs
  timeLimit?: number;       // minutes, 0 = no limit
}

export interface QuestsFile {
  quests: WorldMetaQuest[];
}

// ============================================================================
// DIALOGUES
// ============================================================================

export interface DialogueChoice {
  text: string;
  next: string;             // node ID
  favorability?: number;
  condition?: string;
}

export interface DialogueNode {
  id: string;
  type: DialogueNodeType;
  character?: string;       // character ID for npc type
  content?: string;
  delay?: number;           // ms
  next?: string;            // node ID
  options?: DialogueChoice[];
  action?: string;          // action to trigger
  isVoice?: boolean;
}

export interface DialogueTree {
  id: string;
  character?: string;       // primary character
  nodes: DialogueNode[];
  entryNode: string;        // starting node ID
}

export interface DialoguesFile {
  dialogues: Record<string, DialogueTree>;
}

// ============================================================================
// SCENES (3D Configuration)
// ============================================================================

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface SceneInteractionPoint {
  id: string;
  name: string;
  position: Vector3;
  radius: number;
  icon?: string;
  imageUrl?: string;
  imageScale?: number;
  displayType?: 'default' | 'portrait' | 'navigation' | 'treasure';
  action: {
    type: 'panel' | 'scene-switch' | 'open-map' | 'dialogue' | 'teleport';
    target?: string;
    panel?: string;
    canTravel?: boolean;
  };
}

export interface WallSegment {
  start: Vector3;
  end: Vector3;
  height: number;
}

export interface SceneConfig {
  id: string;
  name: string;
  description?: string;
  splatUrl: string;
  spawnPosition: Vector3;
  spawnRotation?: number;
  floorY: number;
  cameraHeight?: number;  // Camera eye height, defaults to floorY + 0.88
  groundY?: number;       // Ground plane for interaction points, defaults to floorY
  walls: WallSegment[];
  interactionPoints: SceneInteractionPoint[];
  ambientLight?: number;
  skybox?: string;
}

// ============================================================================
// TUTORIAL (Official-Intro Specific)
// ============================================================================

export interface TutorialStep {
  id: string;
  route: string;
  nextStep: string | null;
  requiresAction: boolean;
  action?: string;
  messages?: string[];      // dialogue node IDs
  character?: string;       // character ID
  highlightElement?: string;
  tooltip?: string;
}

export interface TutorialConfig {
  enabled: boolean;
  steps: TutorialStep[];
  stepOrder: string[];
}

// ============================================================================
// FACTIONS (Anthromyth Specific)
// ============================================================================

export interface Faction {
  id: string;
  name: string;
  description: string;
  leader?: string;          // character ID
  headquarters?: string;    // area ID
  allies: string[];         // faction IDs
  enemies: string[];        // faction IDs
}

export interface FactionsFile {
  factions: Faction[];
}

// ============================================================================
// ENEMIES
// ============================================================================

export interface Enemy {
  id: string;
  name: string;
  description: string;
  level: number;
  health: number;
  attributes: CharacterAttributes;
  abilities: string[];
  drops: { itemId: string; chance: number }[];
  experience: number;
  gold: number;
}

export interface EnemiesFile {
  enemies: Enemy[];
}

// ============================================================================
// WORLD INDEX
// ============================================================================

export type WorldSummary = Pick<WorldMeta, 'id' | 'name' | 'description' | 'type' | 'coverImage' | 'available' | 'requirements'>;

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category?: 'combat' | 'exploration' | 'social' | 'collection' | 'story';
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: { current: number; max: number };
  reward?: { type: string; amount: number };
}

// ============================================================================
// SHOP
// ============================================================================

export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: number;
  currency: 'gold' | 'gem' | 'token';
  category: 'consumable' | 'equipment' | 'material' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stock?: number;
  discount?: number;
  new?: boolean;
  hot?: boolean;
}

// ============================================================================
// TASKS
// ============================================================================

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: {
    type: 'gold' | 'exp' | 'item' | 'gem';
    amount: number;
    name?: string;
  };
  progress: number;
  total: number;
  completed: boolean;
  claimed: boolean;
}

// ============================================================================
// GUILD
// ============================================================================

export interface GuildQuestObjective {
  id: string;
  description: string;
  current: number;
  target: number;
  completed: boolean;
}

export interface GuildQuest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'event';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  status: 'available' | 'in_progress' | 'completed';
  objectives?: GuildQuestObjective[];
  reward: {
    gold: number;
    exp: number;
    item?: string;
  };
  location?: string;
  npc?: string;
}

// ============================================================================
// CRAFTING (MINTING)
// ============================================================================

export interface CraftingMaterial {
  id: string;
  name: string;
  icon: string;
  owned: number;
  required: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  icon: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  materials: CraftingMaterial[];
  craftTime: number;
  description: string;
  stats?: { name: string; value: string }[];
}

// ============================================================================
// TOWNS
// ============================================================================

export interface Town {
  id: string;
  name: string;
  background: string;
  description: string;
  initialPosition: { x: number; y: number };
}

export interface TownInteractionAction {
  type: 'trade' | 'talk' | 'quest' | 'adventure' | 'rest' | 'travel';
  label: string;
  target?: string;
}

export interface TownSubMap {
  background: string;
  intro: string;
}

export interface TownInteractionPoint {
  id: string;
  type: 'shop' | 'adventure' | 'rest' | 'transport' | 'npc';
  name: string;
  position: { x: number; y: number };
  icon: string;
  subMap: TownSubMap;
  actions: TownInteractionAction[];
}

// ============================================================================
// FULL WORLD METADATA (Loaded State)
// ============================================================================

export interface WorldMetadata {
  world: WorldMeta;
  areas: Area[];
  characters: WorldMetaCharacter[];
  equipment: Equipment[];
  items: Item[];
  quests: WorldMetaQuest[];
  dialogues: Record<string, DialogueTree>;
  scenes: Record<string, SceneConfig>;
  tutorial?: TutorialConfig;
  factions?: Faction[];
  enemies?: Enemy[];
  shop?: ShopItem[];
  achievements?: Achievement[];
  tasks?: Task[];
  guild?: GuildQuest[];
  minting?: CraftingRecipe[];
  towns?: Town[];
  interactions?: Record<string, TownInteractionPoint[]>;
}
