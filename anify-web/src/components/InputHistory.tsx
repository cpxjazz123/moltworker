import React from "react";

import styles from "./InputHistory.module.css";

interface InputHistoryProps {
  history: string[];
}

export const InputHistory: React.FC<InputHistoryProps> = ({ history }) => {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div className={`${styles.panel} w-full mb-5`}>
      <h3 className={styles.title}>Chat History</h3>
      <div className={styles.list}>
        {history.map((item, index) => (
          <div
            className={styles.item}
            key={index}
          >
            {item}
          </div>
        ))}
        {history.length === 0 && <div className={styles.empty}>No history yet...</div>}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
