/**
 * Shared player position state.
 * This allows components outside the Canvas to read the player's current position.
 */

export interface PlayerPosition {
  x: number;
  y: number;
  z: number;
}

// Module-level state that persists across renders
export const playerState: { position: PlayerPosition } = {
  position: { x: 0, y: 0, z: 0 },
};

export function getPlayerPosition(): PlayerPosition {
  return { ...playerState.position };
}

export function updatePlayerPosition(x: number, y: number, z: number) {
  playerState.position.x = x;
  playerState.position.y = y;
  playerState.position.z = z;
}
