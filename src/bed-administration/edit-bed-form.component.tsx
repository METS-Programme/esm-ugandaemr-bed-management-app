import React, { SyntheticEvent, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  useLocations,
  showToast,
  showNotification,
} from "@openmrs/esm-framework";

import type { InitialData } from "../types";
import { useBedType, saveBed } from "./bed-administration.resource";
import BedAdministrationForm from "./bed-administration-form.component";

interface NewBedFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  editData: InitialData;
}

const EditBedForm: React.FC<NewBedFormProps> = ({
  showModal,
  onModalChange,
  editData,
}) => {
  const { t } = useTranslation();
  const headerTitle = t("editBed", "Edit bed");
  const occupiedStatuses = ["Available", "Occupied"];
  const { bedTypes } = useBedType();
  const allLocations = useLocations();
  const availableBedTypes = bedTypes ? bedTypes : [];

  const handleCreateQuestion = useCallback(
    (event: SyntheticEvent<{ name: { value: string } }>) => {
      const target = event.target as typeof event.target & {
        occupiedStatus: { value: string };
        bedId: { value: string };
        bedRow: { value: string };
        description: { value: string };
        bedColumn: { value: string };
        location: { title: string };
        bedType: { value: string };
      };

      const bedNumber = target.bedId.value;
      const description = target.description.value;
      const occupiedStatus = target.occupiedStatus.value;
      const bedRow = target.bedRow.value;
      const bedColumn = target.bedColumn.value;
      const bedLocation = target.location.title;
      const bedType = target.bedType.value;

      const bedObject = {
        bedNumber,
        bedType,
        description,
        status: occupiedStatus.toUpperCase(),
        row: parseInt(bedRow),
        column: parseInt(bedColumn),
        locationUuid: bedLocation,
      };

      saveBed({ bedObject })
        .then(() => {
          showToast({
            title: t("formCreated", "New bed created"),
            kind: "success",
            critical: true,
            description:
              bedNumber +
              " " +
              t("saveSuccessMessage", "was created successfully."),
          });
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
    [onModalChange, t]
  );

  return (
    <>
      <BedAdministrationForm
        onModalChange={onModalChange}
        allLocations={allLocations}
        availableBedTypes={availableBedTypes}
        showModal={showModal}
        handleCreateQuestion={handleCreateQuestion}
        headerTitle={headerTitle}
        occupiedStatuses={occupiedStatuses}
        initialData={editData}
      />
    </>
  );
};

export default EditBedForm;
