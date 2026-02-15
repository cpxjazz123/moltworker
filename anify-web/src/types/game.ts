export interface Character {
  description: string;
  inventory: string[];
  name: string;
  role: string;
  stats: Record<string, number>;
  status_effects: string[];
}

export interface GameState {
  history: string[];
  location: string;
  location_description: string;
  npcs: Character[];
  player: Character;
  turn_count: number;
}
