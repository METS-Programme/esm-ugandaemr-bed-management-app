import React, { SyntheticEvent, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  useLocations,
  showToast,
  showNotification,
} from "@openmrs/esm-framework";

import type { InitialData } from "../types";
import { useBedType, editBed } from "./bed-administration.resource";
import BedAdministrationForm from "./bed-administration-form.component";

interface NewBedFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  editData: InitialData;
  refetchBedData: (showModal: boolean) => void;
}

const EditBedForm: React.FC<NewBedFormProps> = ({
  showModal,
  onModalChange,
  editData,
  refetchBedData,
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

      const bedId = editData.uuid;

      const bedNumber = target.bedId.value
        ? target.bedId.value
        : editData.bedNumber;
      const description = target.description.value
        ? target.description.value
        : editData.description;
      const occupiedStatus = target.occupiedStatus.value
        ? target.occupiedStatus.value
        : editData.status;
      const bedRow = target.bedRow.value
        ? parseInt(target.bedRow.value)
        : editData.row;
      const bedColumn = target.bedColumn.value
        ? parseInt(target.bedColumn.value)
        : editData.column;
      const bedLocation = target.location.title
        ? target.location.title
        : editData.location.uuid;
      const bedType = target.bedType.value
        ? target.bedType.value
        : editData.bedType.name;

      const bedObject = {
        bedNumber,
        bedType,
        description,
        status: occupiedStatus.toUpperCase(),
        row: bedRow,
        column: bedColumn,
        locationUuid: bedLocation,
      };

      editBed({ bedObject, bedId })
        .then(() => {
          showToast({
            title: t("formSaved", "Bed saved"),
            kind: "success",
            critical: true,
            description:
              bedNumber +
              " " +
              t("saveSuccessMessage", "was saved successfully."),
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
      refetchBedData(true);
    },
    [onModalChange, refetchBedData, editData, t]
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
