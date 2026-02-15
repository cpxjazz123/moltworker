import React from "react";

import styles from "./CharacterStatus.module.css";

interface CharacterStatusProps {
  hp: number;
  maxHp: number;
  maxMp: number;
  maxSp: number;
  mp: number;
  sp: number;
}

export const CharacterStatus: React.FC<CharacterStatusProps> = ({ hp, maxHp, maxMp, maxSp, mp, sp }) => {
  const getPercentage = (current: number, max: number) => Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div className={styles.container}>
      <div className={`${styles.statusRow} ${styles.hpRow}`}>
        <span className={styles.statusLabel}>HP</span>
        <div className={styles.statusBarBg}>
          <div
            className={`${styles.statusBarFill} ${styles.hpFill}`}
            style={{ width: `${getPercentage(hp, maxHp)}%` }}
          />
          <span className={styles.statusText}>
            {hp} / {maxHp}
          </span>
        </div>
      </div>

      <div className={`${styles.statusRow} ${styles.mpRow}`}>
        <span className={styles.statusLabel}>MP</span>
        <div className={styles.statusBarBg}>
          <div
            className={`${styles.statusBarFill} ${styles.mpFill}`}
            style={{ width: `${getPercentage(mp, maxMp)}%` }}
          />
          <span className={styles.statusText}>
            {mp} / {maxMp}
          </span>
        </div>
      </div>

      <div className={`${styles.statusRow} ${styles.spRow}`}>
        <span className={styles.statusLabel}>SP</span>
        <div className={styles.statusBarBg}>
          <div
            className={`${styles.statusBarFill} ${styles.spFill}`}
            style={{ width: `${getPercentage(sp, maxSp)}%` }}
          />
          <span className={styles.statusText}>
            {sp} / {maxSp}
          </span>
        </div>
      </div>
    </div>
  );
};
