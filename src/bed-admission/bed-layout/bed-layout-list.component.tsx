import React, { useState } from "react";
import { Column, InlineLoading } from "@carbon/react";
import BedLayout from "./bed-layout.component";
import { ErrorState } from "@openmrs/esm-patient-common-lib";
import { useTranslation } from "react-i18next";
import styles from "./bed-layout.scss";

const BedLayoutList = ({ isLoading, error, bedData, handleClick }) => {
  const { t } = useTranslation();
  const [availableColor] = useState<string>("#42be65");

  const bedStyles = {
    height: "60px",
    width: "8rem",
  };

  const pillowStyles = {
    width: "10px",
    height: "40px",
  };

  const getBackgroundColor = (bedStatus: string) => {
    return bedStatus === "AVAILABLE" ? availableColor : "#fff";
  };

  const getLayoutStyles = (status: string) => ({
    ...bedStyles,
    color: status === "AVAILABLE" ? "#fff" : "#525252",
    opacity: status === "AVAILABLE" ? 0.5 : 1,
    pointerEvents:
      status === "AVAILABLE" ? "none" : ("auto" as "none" | "auto"),
    backgroundColor: getBackgroundColor(status),
  });

  if (isLoading) {
    return (
      <InlineLoading
        status="active"
        iconDescription={t("loading", "Loading")}
        description={t("loading", "Loading...")}
      />
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <ErrorState
          headerTitle={t(
            "errorFetchingbedInformation",
            "Error fetching bed information"
          )}
          error={error}
        />
      </div>
    );
  }

  return bedData?.map((bed) => (
    <Column key={bed.number} lg={5} md={5} sm={5}>
      <BedLayout
        handleBedAssignment={() => handleClick(bed)}
        bedNumber={bed.number}
        bedPillowStyles={pillowStyles}
        layOutStyles={getLayoutStyles(bed.status)}
      />
    </Column>
  ));
};

export default BedLayoutList;
