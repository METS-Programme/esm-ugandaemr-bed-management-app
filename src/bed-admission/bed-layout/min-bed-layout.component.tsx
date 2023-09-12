import React from "react";
import styles from "./bed-layout.scss";
import BedLayout from "./bed-layout.component";

const MinBedLayout: React.FC = () => {
  const minBedUnavailableStyles = {
    height: "1.5rem",
    width: "2.5rem",
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgb(66, 190, 101)",
    padding: "0 6px",
    borderRadius: "5px",
    PointerEvents: "none",
  };

  const minBedAvailableStyles = {
    height: "1.5rem",
    width: "2.5rem",
    color: "",
    backgroundColor: "#fff",
    padding: "0 6px",
    borderRadius: "5px",
    PointerEvents: "none",
  };

  const minPillowStyles = {
    width: "7px",
    height: "1rem",
  };

  return (
    <div className={styles.bedInfoContainer}>
      <div className={styles.bedInfoMain}>
        <BedLayout
          handleBedAssignment={() => null}
          bedNumber=""
          bedPillowStyles={minPillowStyles}
          layOutStyles={minBedUnavailableStyles}
        />{" "}
        <span className={styles.bedInfoText}>Occupied</span>
      </div>
      <div className={styles.bedInfoMain}>
        <BedLayout
          handleBedAssignment={() => null}
          bedNumber=""
          bedPillowStyles={minPillowStyles}
          layOutStyles={minBedAvailableStyles}
        />{" "}
        <span className={styles.bedInfoText}>Available</span>
      </div>
    </div>
  );
};

export default MinBedLayout;
