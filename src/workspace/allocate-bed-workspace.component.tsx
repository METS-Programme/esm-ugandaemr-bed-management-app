import React, { useCallback, useState } from "react";
import {
  Stack,
  InlineLoading,
  Grid,
  Column,
  ButtonSet,
  Button,
} from "@carbon/react";
import Overlay from "./overlay.component";
import { useTranslation } from "react-i18next";
import { useLayoutType } from "@openmrs/esm-framework";
import styles from "./allocate-bed.scss";
import BedLayout from "../bed-admission/bed-layout/bed-layout.component";
import { useBedsForLocation } from "../summary/summary.resource";
import MinBedLayout from "../bed-admission/bed-layout/min-bed-layout.component";
import { assignPatientBed } from "../bed-admission/bed-admission.resource";

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
  const [availableColor] = useState<string>("#42be65");
  const [selectedBed, setSelectedBed] = useState<BedProps>();
  const casualityWard = "062c1e31-7ebb-497a-bd68-ecea4387f808";
  const { isLoading, bedData } = useBedsForLocation(casualityWard);

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
                {!isLoading && bedData ? (
                  bedData.map((bed) => {
                    return (
                      <Column key={bed.number} lg={5} md={5} sm={5}>
                        <BedLayout
                          handleBedAssignment={() => handleClick(bed)}
                          bedNumber={bed.number}
                          bedPillowStyles={pillowStyles}
                          layOutStyles={{
                            ...bedStyles,
                            color:
                              bed.status === "AVAILABLE" ? "#fff" : "#525252",
                            opacity: bed.status === "AVAILABLE" ? 0.5 : 1,
                            pointerEvents:
                              bed.status === "AVAILABLE" ? "none" : "auto",
                            backgroundColor: getBackgroundColor(bed.status),
                          }}
                        />
                      </Column>
                    );
                  })
                ) : (
                  <InlineLoading
                    status="active"
                    iconDescription={t("loading", "Loading")}
                    description={t("loadingx", "Loading...")}
                  />
                )}
              </Grid>
            </section>
          </Stack>
        </div>
        {selectedBed ? (
          <span className={styles.admitPatientInfo}>
            {" "}
            {t(
              "admittingPatientToBedText",
              `Admitting ${patientDetails.name} to bed ${selectedBed.number} - click save button to continue`
            )}
          </span>
        ) : null}
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
