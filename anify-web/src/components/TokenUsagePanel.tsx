import React from "react";

import type { TokenUsage } from "../types/token";

import styles from "./TokenUsagePanel.module.css";

interface TokenUsagePanelProps {
  usage: null | TokenUsage;
}

export const TokenUsagePanel: React.FC<TokenUsagePanelProps> = ({ usage }) => {
  if (!usage) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.main}>
        <span className={styles.label}>Last request tokens</span>
        <span className={styles.value}>
          {usage.totalTokens}
          {usage.estimatedCostUsd != null && <> (~${usage.estimatedCostUsd.toFixed(4)})</>}
        </span>
      </div>
      <div className={styles.sub}>
        prompt: {usage.promptTokens} · completion: {usage.completionTokens}
      </div>
    </div>
  );
};
