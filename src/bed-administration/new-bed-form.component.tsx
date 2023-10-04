import React, { useCallback } from "react";
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

  interface BedAdministrationData {
    bedId: string;
    description: string;
    bedRow: number;
    bedColumn: number;
    location: string;
    occupancyStatus: string;
    bedType: string;
  }

  const handleCreateQuestion = useCallback(
    (formData: BedAdministrationData) => {
      // console.log(">><<<<<<<>>?<<<<<<<> event", formData);

      const bedNumber = formData.bedId;
      const description = formData.description;
      const occupancyStatus = formData.occupancyStatus;
      const bedRow = formData.bedRow;
      const bedColumn = formData.bedColumn;
      const bedLocation = formData.location;
      const bedType = formData.bedType;

      const bedObject = {
        bedNumber,
        bedType,
        description,
        status: occupancyStatus.toUpperCase(),
        row: bedRow,
        column: bedColumn,
        locationUuid: bedLocation,
      };

      saveBed({ bedPayload: bedObject })
        .then(() => {
          showToast({
            title: t("formCreated", "New bed created"),
            kind: "success",
            critical: true,
            description: `Bed was created successfully.`,
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
