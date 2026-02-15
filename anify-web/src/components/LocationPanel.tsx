import React from "react";

import styles from "./LocationPanel.module.css";

interface LocationPanelProps {
  description: string;
  location: string;
}

export const LocationPanel: React.FC<LocationPanelProps> = ({ description, location }) => (
  <div className={styles.locationBox}>
    <h3>Location</h3>
    <p>Current: {location}</p>
    <p className="text-sm text-gray-500">{description}</p>
    <div className={styles.locationList}>
      {/* Placeholder for now */}
      <span>Village</span>
      <span>Cave</span>
    </div>
    <a
      className={styles.mapLink}
      href="/map"
    >
      Map
    </a>
  </div>
);
