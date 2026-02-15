/**
 * Location types for the unified map system
 */

/** Type of location - determines gameplay mode */
export type LocationType = 'town' | 'adventure';

/** A location on the map that players can visit */
export interface Location {
  /** Unique identifier for the location */
  id: string;
  /** Display name of the location */
  name: string;
  /** Description of the location */
  description: string;
  /** Type of gameplay at this location */
  type: LocationType;
  /** ID of the world this location belongs to */
  worldId?: string;
  /** X coordinate on the map (0-100 percentage) */
  mapX: number;
  /** Y coordinate on the map (0-100 percentage) */
  mapY: number;
  /** Optional icon name for the location marker */
  icon?: string;
  /** Optional Gaussian splat URL for 3D scene */
  splatUrl?: string;
  /** Danger level for adventure locations (1-10) */
  dangerLevel?: number;
  /** Whether the player has unlocked this location */
  unlocked?: boolean;
  /** IDs of locations connected to this one */
  connectedLocations?: string[];
}

/** A world containing multiple locations */
export interface World {
  /** Unique identifier for the world */
  id: string;
  /** Display name of the world */
  name: string;
  /** Description of the world */
  description: string;
  /** Background image URL for the world map */
  backgroundUrl?: string;
  /** Whether this world is unlocked */
  unlocked?: boolean;
}

/** Map zoom level */
export type MapZoomLevel = 'world' | 'region' | 'town';

/** State for the map system */
export interface MapState {
  /** Current zoom level */
  zoomLevel: MapZoomLevel;
  /** Currently selected world ID */
  selectedWorldId: string | null;
  /** Currently selected location ID */
  selectedLocationId: string | null;
  /** Whether the map overlay is open */
  isOpen: boolean;
  /** Whether the player can travel to selected location */
  canTravel: boolean;
}
