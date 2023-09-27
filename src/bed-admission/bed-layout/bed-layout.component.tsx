import React, { useRef } from "react";
import classnames from "classnames";
import styles from "./bed-layout.scss";
import { patientDetailsProps } from "../types";

interface BedProps {
  bedNumber: string;
  handleBedAssignment?: () => void;
  isBedSelected?: boolean;
  layOutStyles?: string;
  bedPillowStyles?: string;
  patientDetails?: patientDetailsProps;
}

const BedLayout: React.FC<BedProps> = ({
  bedNumber,
  layOutStyles,
  bedPillowStyles,
  handleBedAssignment,
  isBedSelected,
}) => {
  const bedRef = useRef(null);

  return (
    <>
      <div
        ref={bedRef}
        role="button"
        tabIndex={0} // Make the div focusable
        onClick={() => handleBedAssignment()}
        className={classnames(styles.bedLayout, {
          [layOutStyles]: layOutStyles,
          [styles.bedLayoutSelected]: isBedSelected,
        })}
      >
        <div
          className={classnames(styles.bedPillow, {
            [bedPillowStyles]: bedPillowStyles,
          })}
        ></div>
        <div style={{ display: "grid" }}>
          <span className={styles.bedNumber}>{bedNumber}</span>
          {/* <span className={styles.bedNumber}>006</span> */}
        </div>
      </div>
    </>
  );
};

export default BedLayout;
