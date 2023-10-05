import React, { SyntheticEvent, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { showToast, showNotification, useConfig } from "@openmrs/esm-framework";

import type { InitialData, Mutator } from "../types";
import { useBedType, saveBed } from "./bed-administration.resource";
import BedAdministrationForm from "./bed-administration-form.component";
import { useLocationsByTag } from "../summary/summary.resource";

interface NewBedFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  mutate: Mutator;
}

const NewBedForm: React.FC<NewBedFormProps> = ({
  showModal,
  onModalChange,
  mutate,
}) => {
  const { t } = useTranslation();
  const { admissionLocationTagUuid } = useConfig();
  const { data: admissionLocations } = useLocationsByTag(
    admissionLocationTagUuid
  );
  const headerTitle = t("createNewBed", "Create a new bed");
  const occupancyStatuses = ["Available", "Occupied"];
  const { bedTypes } = useBedType();
  const availableBedTypes = bedTypes ? bedTypes : [];

  const initialData: InitialData = {
    uuid: "",
    bedNumber: "",
    status: "",
    description: "",
    row: 0,
    column: 0,
    location: {
      display: "",
      uuid: "",
    },
    bedType: {
      name: "",
    },
  };

  const handleCreateQuestion = useCallback(
    (event: SyntheticEvent<{ name: { value: string } }>) => {
      const target = event.target as typeof event.target & {
        occupancyStatus: { value: string };
        bedId: { value: string };
        bedRow: { value: string };
        description: { value: string };
        bedColumn: { value: string };
        location: { title: string };
        bedType: { value: string };
      };

      const bedNumber = target.bedId.value;
      const description = target.description.value;
      const occupancyStatus = target.occupancyStatus.value;
      const bedRow = target.bedRow.value;
      const bedColumn = target.bedColumn.value;
      const bedLocation = target.location.title;
      const bedType = target.bedType.value;

      const bedObject = {
        bedNumber,
        bedType,
        description,
        status: occupancyStatus.toUpperCase(),
        row: parseInt(bedRow),
        column: parseInt(bedColumn),
        locationUuid: bedLocation,
      };

      saveBed({ bedPayload: bedObject })
        .then(() => {
          showToast({
            title: t("formCreated", "New bed created"),
            kind: "success",
            critical: true,
            description: `Bed ${bedNumber} was created successfully.`,
          });

          mutate();
          onModalChange(false);
        })
        .catch((error) => {
          showNotification({
            title: t("errorCreatingForm", "Error creating bed"),
            kind: "error",
            critical: true,
            description: error?.message,
          });
          onModalChange(false);
        });
      onModalChange(false);
    },
    [onModalChange, mutate, t]
  );

  return (
    <>
      <BedAdministrationForm
        onModalChange={onModalChange}
        allLocations={admissionLocations}
        availableBedTypes={availableBedTypes}
        showModal={showModal}
        handleCreateQuestion={handleCreateQuestion}
        headerTitle={headerTitle}
        occupancyStatuses={occupancyStatuses}
        initialData={initialData}
      />
    </>
  );
};

export default NewBedForm;
