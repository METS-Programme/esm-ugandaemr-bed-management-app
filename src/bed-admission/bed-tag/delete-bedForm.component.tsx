import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "../../bed-administration/bed-administration-table.scss";
import {
  Button,
  ComposedModal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  InlineNotification,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
interface BedTagData {
  name: string;
}

const BedTagAdministrationSchema = z.object({
  name: z.string().max(255),
});

interface BedTagAdministrationFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  handleDeleteBedTag?: (formData: BedTagData) => void;
  headerTitle: string;
  initialData: BedTagData;
}

interface ErrorType {
  message: string;
}

const DeleteBedTagsForm: React.FC<BedTagAdministrationFormProps> = ({
  showModal,
  onModalChange,
  handleDeleteBedTag,
  headerTitle,
  initialData,
}) => {
  const { t } = useTranslation();

  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [formStateError, setFormStateError] = useState("");

  const { handleSubmit } = useForm<BedTagData>({
    mode: "all",
    resolver: zodResolver(BedTagAdministrationSchema),
    defaultValues: {
      name: initialData.name || "",
    },
  });

  const onSubmit = (formData: BedTagData) => {
    const result = BedTagAdministrationSchema.safeParse(formData);
    if (result.success) {
      setShowErrorNotification(false);
      if (handleDeleteBedTag) {
        handleDeleteBedTag(formData);
      }
    }
  };

  const onError = (error: { [key: string]: ErrorType }) => {
    setFormStateError(Object.entries(error)[0][1].message);
    setShowErrorNotification(true);
  };

  return (
    <ComposedModal
      open={showModal}
      onClose={() => onModalChange(false)}
      preventCloseOnClickOutside
    >
      <ModalHeader title={headerTitle} />
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <ModalBody hasScrollingContent>
          <Stack gap={3}>
            <ModalBody>Are you sure you want to delete this bed tag?</ModalBody>
            {showErrorNotification && (
              <InlineNotification
                lowContrast
                title={t("error", "Error")}
                style={{ minWidth: "100%", margin: "0rem", padding: "0rem" }}
                role="alert"
                kind="error"
                subtitle={t("pleaseFillField", formStateError) + "."}
                onClose={() => setShowErrorNotification(false)}
              />
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => onModalChange(false)} kind="secondary">
            {t("cancel", "Cancel")}
          </Button>
          <Button type="submit" className={styles.deleteButton}>
            <span>{t("delete", "Delete")}</span>
          </Button>
        </ModalFooter>
      </form>
    </ComposedModal>
  );
};

export default DeleteBedTagsForm;
