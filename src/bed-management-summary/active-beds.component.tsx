import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@carbon/react";
import type { Bed } from "../types";
import styles from "./summary.scss";

interface WardType {
  name: string;
  beds: Array<Bed>;
}

interface ActiveBedSummaryProps {
  ward: WardType;
}

const ActiveBedSummary: React.FC<ActiveBedSummaryProps> = ({ ward }) => {
  const { t } = useTranslation();
  return (
    <Button
      kind="tertiary"
      iconDescription={t("wardType", `${ward.name}`)}
      className={styles.buttonMain}
      style={{ margin: "1rem", marginBottom: "0.5rem" }}
    >
      <div className={styles.buttonContainer}>
        <div className={styles.buttonItems}>
          {t("wardType", `${ward.name}`)}
        </div>
        <div className={styles.buttonItems}>{`(${ward.beds.length})`}</div>
      </div>
    </Button>
  );
};

export default ActiveBedSummary;
