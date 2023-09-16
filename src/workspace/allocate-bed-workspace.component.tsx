import React, { useCallback, useState } from "react";
import { Stack, Grid, ButtonSet, Button } from "@carbon/react";
import { useTranslation } from "react-i18next";
import { useLayoutType } from "@openmrs/esm-framework";
import styles from "./allocate-bed.scss";
import Overlay from "./overlay.component";
import { useBedsForLocation } from "../summary/summary.resource";
import { assignPatientBed } from "../bed-admission/bed-admission.resource";
import MinBedLayout from "../bed-admission/bed-layout/min-bed-layout.component";
import BedLayoutList from "../bed-admission/bed-layout/bed-layout-list.component";

interface WorkSpaceProps {
  closePanel: () => void;
  headerTitle?: string;
  patientDetails: {
    name: string;
    patientUuid: string;
  };
}

interface BedProps {
  id: number;
  number: string;
  name: string;
  description: string;
  status: string;
}

const AllocateBedWorkSpace: React.FC<WorkSpaceProps> = ({
  headerTitle,
  closePanel,
  patientDetails,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === "tablet";
  const [selectedBed, setSelectedBed] = useState<BedProps>();
  const casualityWard = "062c1e31-7ebb-497a-bd68-ecea4387f808";
  const { isLoading, bedData, error } = useBedsForLocation(casualityWard);

  const handleClick = (bed) => {
    setSelectedBed(bed);
  };

  const handleAssignBedToPatient = useCallback(() => {
    const patientAndEncounterUuids = {
      encounterUuid: "",
      patientUuid: patientDetails.patientUuid,
    };
    assignPatientBed(patientAndEncounterUuids, selectedBed.id);
  }, [patientDetails, selectedBed]);

  return (
    <>
      <Overlay header={headerTitle} closePanel={closePanel}>
        <div className={styles.container}>
          <MinBedLayout />
          <Stack gap={8} className={styles.container}>
            <section className={styles.section}>
              <Grid>
                {" "}
                <BedLayoutList
                  isLoading={isLoading}
                  error={error}
                  bedData={bedData}
                  handleClick={handleClick}
                />{" "}
              </Grid>
            </section>
          </Stack>
        </div>
        {selectedBed && (
          <span className={styles.admitPatientInfo}>
            {" "}
            {t(
              "admittingPatientToBedText",
              `Admitting ${patientDetails.name} to bed ${selectedBed.number} - click save button to continue`
            )}
          </span>
        )}
        <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
          <Button
            className={styles.button}
            kind="secondary"
            onClick={closePanel}
          >
            {t("discard", "Discard")}
          </Button>
          <Button
            onClick={handleAssignBedToPatient}
            className={styles.button}
            kind="primary"
            type="submit"
          >
            {t("save", "Save")}
          </Button>
        </ButtonSet>
      </Overlay>
    </>
  );
};

export default AllocateBedWorkSpace;
