import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { showToast, showNotification, useConfig } from "@openmrs/esm-framework";
import { saveWard, useLocationsByTag } from "../../summary/summary.resource";
import { LocationTagData, Mutator } from "../../types";
import WardAdministrationForm from "./ward-admin-form.component";

interface WardFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  mutate: Mutator;
}
const NewWardForm: React.FC<WardFormProps> = ({
  showModal,
  onModalChange,
  mutate,
}) => {
  const { t } = useTranslation();
  const { admissionLocationTagUuid } = useConfig();
  const { data: admissionLocations } = useLocationsByTag(
    admissionLocationTagUuid
  );
  const headerTitle = t("addWard", "Create new Ward");
  const initialData: LocationTagData = {
    uuid: "",
    name: "",
    tagLocation: {
      display: "",
      uuid: "",
    },
  };

  const handleCreateQuestion = useCallback(
    (formData: LocationTagData) => {
      const { name, tagLocation } = formData;
      const wardObject = {
        name,
        tags: [tagLocation.uuid],
      };

      saveWard({ wardPayload: wardObject })
        .then(() => {
          showToast({
            title: t("formCreated", "Add Ward"),
            kind: "success",
            critical: true,
            description: `Ward ${name} was created successfully.`,
          });

          mutate();
          onModalChange(false);
        })
        .catch((error) => {
          showNotification({
            title: t("errorCreatingForm", "Error creating ward"),
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
      <WardAdministrationForm
        onModalChange={onModalChange}
        allLocations={admissionLocations}
        showModal={showModal}
        handleCreateQuestion={handleCreateQuestion}
        headerTitle={headerTitle}
        initialData={initialData}
      />
    </>
  );
};

export default NewWardForm;
