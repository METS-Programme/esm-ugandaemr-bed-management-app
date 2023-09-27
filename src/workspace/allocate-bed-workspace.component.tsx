import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { Stack, Grid, ButtonSet, Button } from "@carbon/react";
import { useTranslation } from "react-i18next";
import {
  showNotification,
  showToast,
  useLayoutType,
} from "@openmrs/esm-framework";
import styles from "./allocate-bed.scss";
import Overlay from "./overlay.component";
import { useBedsForLocation } from "../summary/summary.resource";
import {
  assignPatientBed,
  endPatientQueue,
} from "../bed-admission/bed-admission.resource";
import MinBedLayout from "../bed-admission/bed-layout/min-bed-layout.component";
import BedLayoutList from "../bed-admission/bed-layout/bed-layout-list.component";
import LocationComboBox from "../bed-admission/admitted-patients/location-combo-box.component";

interface WorkSpaceProps {
  closePanel: (e: boolean) => void;
  headerTitle?: string;
  queueStatus: string;
  patientDetails: {
    name: string;
    patientUuid: string;
    locationUuid: string;
    locationTo: string;
    queueUuid: string;
    encounter: {
      uuid: string;
    };
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
  queueStatus,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === "tablet";
  const [selectedBed, setSelectedBed] = useState<BedProps>();
  const [isBedAssigned, setIsBedAssigned] = useState(false);
  const [isQueueEnded, setIsQueueEnded] = useState(false);
  const [locationUuid, setLocation] = useState(patientDetails.locationUuid);
  const { isLoading, bedData, error } = useBedsForLocation(locationUuid);

  const handleClick = (bed) => {
    setSelectedBed(bed);
  };

  if (isBedAssigned) {
    endPatientQueue({ status: "completed" }, patientDetails.queueUuid)
      .then(() => setIsQueueEnded(true))
      .catch((error) => {
        showNotification({
          title: t("errorEndingQueue", "Error Ending Queve"),
          kind: "error",
          critical: true,
          description: error?.message,
        });
      });
  }

  if (isQueueEnded) {
    showToast({
      title: t("bedAssigned", "Bed Assigned"),
      kind: "success",
      critical: true,
      description: `Bed ${selectedBed.number} was assigned to ${patientDetails.name} successfully.`,
    });
    closePanel(false);
  }

  const handleAssignBedToPatient = useCallback(() => {
    const patientAndEncounterUuids = {
      encounterUuid: patientDetails?.encounter?.uuid,
      patientUuid: patientDetails.patientUuid,
    };

    assignPatientBed(patientAndEncounterUuids, selectedBed.id)
      .then(() => setIsBedAssigned(true))
      .catch((error) => {
        showNotification({
          title: t("errorAssigningBed", "Error assigning bed"),
          kind: "error",
          critical: true,
          description: error?.message,
        });
      });
  }, [patientDetails, selectedBed, t]);

  return (
    <>
      <Overlay header={headerTitle} closePanel={() => closePanel(false)}>
        <div className={styles.container}>
          <MinBedLayout />
          <Stack gap={8} className={styles.container}>
            {queueStatus !== "completed" ? (
              ""
            ) : (
              <LocationComboBox setLocationUuid={setLocation} />
            )}
            <section className={styles.section}>
              <Grid>
                {" "}
                <BedLayoutList
                  isLoading={isLoading}
                  error={error}
                  bedData={bedData}
                  handleClick={handleClick}
                  patientDetails={patientDetails}
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
              `Click Save button to admit patient to Bed ${selectedBed.number}`
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
            className={classNames(styles.button, {
              [styles.disabled]: !bedData.length,
            })}
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
