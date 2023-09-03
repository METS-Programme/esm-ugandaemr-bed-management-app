import React, { SyntheticEvent, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  useLocations,
  showToast,
  showNotification,
} from "@openmrs/esm-framework";

import type { InitialData, Mutator } from "../types";
import { useBedType, editBed } from "./bed-administration.resource";
import BedAdministrationForm from "./bed-administration-form.component";

interface EditBedFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  editData: InitialData;
  mutate: Mutator;
}

const EditBedForm: React.FC<EditBedFormProps> = ({
  showModal,
  onModalChange,
  editData,
  mutate,
}) => {
  const { t } = useTranslation();
  const headerTitle = t("editBed", "Edit bed");
  const occupancyStatuses = ["Available", "Occupied"];
  const { bedTypes } = useBedType();
  const allLocations = useLocations();
  const availableBedTypes = bedTypes ? bedTypes : [];

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

      const bedId = editData.uuid;

      const bedNumber = target.bedId.value
        ? target.bedId.value
        : editData.bedNumber;
      const description = target.description.value
        ? target.description.value
        : editData.description;
      const occupancyStatus = target.occupancyStatus.value
        ? target.occupancyStatus.value
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

      const bedPayload = {
        bedNumber,
        bedType,
        description,
        status: occupancyStatus.toUpperCase(),
        row: bedRow,
        column: bedColumn,
        locationUuid: bedLocation,
      };

      editBed({ bedPayload, bedId })
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
    [onModalChange, mutate, editData, t]
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
        occupancyStatuses={occupancyStatuses}
        initialData={editData}
      />
    </>
  );
};

export default EditBedForm;
