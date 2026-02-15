import type { GameState } from "./game";
import type { TokenUsage } from "./token";

export interface ChatApiResponse {
  gameState: GameState;
  response: string;
  usage?: TokenUsage;
}
