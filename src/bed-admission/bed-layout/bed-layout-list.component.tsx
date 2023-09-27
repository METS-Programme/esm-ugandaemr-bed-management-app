import React, { useState } from "react";
import { Column, InlineLoading } from "@carbon/react";
import BedLayout from "./bed-layout.component";
import { ErrorState } from "@openmrs/esm-patient-common-lib";
import { useTranslation } from "react-i18next";
import styles from "./bed-layout.scss";
import EmptyState from "../../empty-state/empty-state.component";

const BedLayoutList = ({
  isLoading,
  error,
  bedData,
  handleClick,
  patientDetails,
}) => {
  const { t } = useTranslation();
  const [selectedBed, setSelectedBed] = useState(null);

  const getLayoutClass = (status: string) =>
    status === "AVAILABLE" ? styles.available : styles.occupied;

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

  if (!bedData?.length) {
    return (
      <div className={styles.errorContainer}>
        <EmptyState
          msg={t("noBedItems", "No bed to display in this ward")}
          helper=""
        />
      </div>
    );
  }

  return bedData?.map((bed) => (
    <Column key={bed.number} lg={5} md={5} sm={5}>
      <BedLayout
        handleBedAssignment={() => {
          setSelectedBed(bed.number);
          handleClick(bed);
        }}
        bedNumber={bed.number}
        bedPillowStyles={styles.pillow}
        layOutStyles={`${styles.bed} ${getLayoutClass(bed.status)}`}
        isBedSelected={selectedBed === bed.number}
        patientDetails={patientDetails}
      />
    </Column>
  ));
};

export default BedLayoutList;
