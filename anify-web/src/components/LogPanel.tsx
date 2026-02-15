import React from "react";

import styles from "./LogPanel.module.css";

interface LogPanelProps {
  history: string[];
}

export const LogPanel: React.FC<LogPanelProps> = ({ history }) => {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div className={`${styles.panel} w-full mb-5 flex flex-col h-[60vh]`}>
      <div className={styles.titleWrapper}>
        <h3 className={styles.title}>Log</h3>
      </div>
      <div className={styles.entries}>
        {history.map((entry, i) => (
          <p
            className={styles.entry}
            key={i}
          >
            {entry}
          </p>
        ))}
        {history.length === 0 && <div className={styles.empty}>No log entries...</div>}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
