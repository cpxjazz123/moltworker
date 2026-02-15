export interface TokenUsage {
  completionTokens: number;
  estimatedCostUsd?: number;
  promptTokens: number;
  totalTokens: number;
}
