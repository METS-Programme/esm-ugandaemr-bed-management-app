import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { showToast, showNotification } from "@openmrs/esm-framework";
import { deleteBedTag, useBedTag } from "../../summary/summary.resource";
import { BedTagDataAdministration } from "../../bed-administration/bed-administration-types";
import { BedTagData, Mutator } from "../../types";
import DeleteBedTagsForm from "./delete-bedForm.component";

interface DeleteBedTagFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  editData: BedTagData;
  mutate: Mutator;
}

const DeleteBedTag: React.FC<DeleteBedTagFormProps> = ({
  showModal,
  onModalChange,
  editData,
  mutate,
}) => {
  const { t } = useTranslation();
  const headerTitle = t("deleteBedTag", "Delete bed Tag");
  const handleDeleteQuestion = useCallback(
    (formData: BedTagDataAdministration) => {
      const bedUuid = editData.uuid;
      const { name } = formData;
      deleteBedTag(bedUuid)
        .then(() => {
          showToast({
            title: t("bedTagDeleted", "Bed Tag Deleted"),
            kind: "success",
            critical: true,
            description:
              name +
              " " +
              t("bedTagDeleteSuccessMessage", "was deleted successfully."),
          });

          mutate();
          onModalChange(false);
        })
        .catch((error) => {
          showNotification({
            title: t("errorDeletingBedTag", "Error deleting bed tag"),
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
      <DeleteBedTagsForm
        onModalChange={onModalChange}
        showModal={showModal}
        handleDeleteBedTag={handleDeleteQuestion}
        headerTitle={headerTitle}
        initialData={editData}
      />
    </>
  );
};

export default DeleteBedTag;
