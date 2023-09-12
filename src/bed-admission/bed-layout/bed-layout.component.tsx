import React, { useRef } from "react";
import styles from "./bed-layout.scss";

interface BedProps {
  bedNumber: string;
  handleBedAssignment: () => void;
  layOutStyles: {
    backgroundColor: string;
    height: string;
    width: string;
    color: string;
    opacity?: number | string;
    pointerEvents?: "none" | "auto";
  };
  bedPillowStyles: {
    height: string;
    width: string;
  };
}

const BedLayout: React.FC<BedProps> = ({
  bedNumber,
  layOutStyles,
  bedPillowStyles,
  handleBedAssignment,
}) => {
  const bedRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBedAssignment();
    }
  };

  return (
    <>
      <div
        ref={bedRef}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0} // Make the div focusable
        onClick={handleBedAssignment}
        className={styles.bedLayout}
        style={{ ...layOutStyles }}
      >
        <div className={styles.bedPillow} style={{ ...bedPillowStyles }}></div>
        <span className={styles.bedNumber}>{bedNumber}</span>
      </div>
    </>
  );
};

export default BedLayout;
