/**
 * Shared input state for mobile controls.
 * This allows the VirtualJoystick UI components to communicate with
 * the 3D PlayerController and CameraController without prop drilling.
 */

export interface InputState {
  /** Whether movement is disabled (e.g., when dialog is open) */
  disabled: boolean;
  /** Whether jump is requested (consumed after one frame) */
  jump: boolean;
  /** Look joystick: -1 to 1 for each axis */
  look: { x: number; y: number };
  /** Movement joystick: -1 to 1 for each axis */
  move: { x: number; y: number };
  /** Whether sprint is active */
  run: boolean;
}

// Module-level state that persists across renders
export const inputState: InputState = {
  disabled: false,
  jump: false,
  look: { x: 0, y: 0 },
  move: { x: 0, y: 0 },
  run: false,
};

export function resetLookInput() {
  inputState.look.x = 0;
  inputState.look.y = 0;
}

export function resetMoveInput() {
  inputState.move.x = 0;
  inputState.move.y = 0;
}

export function setLookInput(x: number, y: number) {
  inputState.look.x = x;
  inputState.look.y = y;
}

export function setMoveInput(x: number, y: number) {
  inputState.move.x = x;
  inputState.move.y = y;
}

export function setInputDisabled(disabled: boolean) {
  inputState.disabled = disabled;
}

export function setRunning(running: boolean) {
  inputState.run = running;
}

export function triggerJump() {
  inputState.jump = true;
}

export function triggerInteract() {
  // Dispatch a synthetic 'E' keydown event to trigger interaction points
  window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyE" }));
}
