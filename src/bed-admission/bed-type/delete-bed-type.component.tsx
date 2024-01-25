import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { showToast, showNotification } from "@openmrs/esm-framework";
import { deleteBedType } from "../../summary/summary.resource";
import { BedTagDataAdministration } from "../../bed-administration/bed-administration-types";
import { BedTagData, Mutator } from "../../types";
import DeleteBedTypesForm from "./deleteBedtypeForm.component";

interface DeleteBedTypeFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  editData: BedTagData;
  mutate: Mutator;
}

const DeleteBedType: React.FC<DeleteBedTypeFormProps> = ({
  showModal,
  onModalChange,
  editData,
  mutate,
}) => {
  const { t } = useTranslation();
  const headerTitle = t("deleteBedType", "Delete bed Type");
  const handleDeleteQuestion = useCallback(
    (formData: BedTagDataAdministration) => {
      const bedUuid = editData.uuid;
      const { name } = formData;
      deleteBedType(bedUuid)
        .then(() => {
          showToast({
            title: t("bedTypeDeleted", "Bed Type Deleted"),
            kind: "success",
            critical: true,
            description:
              name +
              " " +
              t("bedTypeDeleteSuccessMessage", "was deleted successfully."),
          });

          mutate();
          onModalChange(false);
        })
        .catch((error) => {
          showNotification({
            title: t("errorDeletingBedType", "Error deleting bed type"),
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
      <DeleteBedTypesForm
        onModalChange={onModalChange}
        showModal={showModal}
        handleDeleteBedTag={handleDeleteQuestion}
        headerTitle={headerTitle}
        initialData={editData}
      />
    </>
  );
};

export default DeleteBedType;
