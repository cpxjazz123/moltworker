/**
 * Interaction point types for the game panel system
 */

/** Type of action that an interaction point triggers */
export type InteractionActionType = 'panel' | 'scene-switch' | 'open-map' | 'dialogue';

/** Available panel types in the game */
export type PanelType = 'shop' | 'forge' | 'guild' | 'residence' | 'storage' | 'tasks' | 'achievements' | 'character' | 'inventory' | 'map';

/** Configuration for panel action */
export interface PanelConfig {
  /** Type of panel to open */
  panelType: PanelType;
  /** Optional initial tab or category */
  initialTab?: string;
  /** Optional NPC ID for personalized interactions */
  npcId?: string;
}

/** Configuration for scene switch action */
export interface SceneSwitchConfig {
  /** Target scene/location ID */
  targetSceneId: string;
  /** Optional spawn point ID within the target scene */
  spawnPointId?: string;
  /** Optional transition animation type */
  transition?: 'fade' | 'slide' | 'warp';
}

/** Configuration for opening the map */
export interface OpenMapConfig {
  /** Whether the player can travel from this map view */
  canTravel?: boolean;
  /** Optional world to focus on */
  focusWorldId?: string;
  /** Optional location to highlight */
  highlightLocationId?: string;
}

/** Configuration for dialogue action */
export interface DialogueConfig {
  /** NPC ID to start dialogue with */
  npcId: string;
  /** Optional specific dialogue tree ID */
  dialogueTreeId?: string;
}

/** Union type for action configurations */
export type InteractionActionConfig =
  | { type: 'panel'; config: PanelConfig }
  | { type: 'scene-switch'; config: SceneSwitchConfig }
  | { type: 'open-map'; config: OpenMapConfig }
  | { type: 'dialogue'; config: DialogueConfig };

/** Action that an interaction point can trigger */
export interface InteractionPointAction {
  /** Type of the action */
  type: InteractionActionType;
  /** Action-specific configuration */
  config: PanelConfig | SceneSwitchConfig | OpenMapConfig | DialogueConfig;
}

/** An interaction point in the 3D scene */
export interface InteractionPoint {
  /** Unique identifier for the interaction point */
  id: string;
  /** Display label shown to the player */
  label: string;
  /** Optional description shown on hover */
  description?: string;
  /** Position in 3D space [x, y, z] */
  position: [number, number, number];
  /** Interaction radius for triggering proximity detection */
  interactionRadius?: number;
  /** Icon to display at the interaction point */
  icon?: string;
  /** Action to execute when interacted with */
  action: InteractionPointAction;
  /** Whether this interaction point is currently active */
  isActive?: boolean;
  /** Required conditions for this interaction point to appear */
  requirements?: {
    /** Minimum player level */
    minLevel?: number;
    /** Required quest completion IDs */
    completedQuests?: string[];
    /** Required items in inventory */
    requiredItems?: string[];
  };
}
