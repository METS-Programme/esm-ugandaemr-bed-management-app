import React, { useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  ComposedModal,
  Form,
  FormGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  TextInput,
  InlineNotification,
  ComboBox,
  Dropdown,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { Location } from "@openmrs/esm-framework";
import type { LocationTagData } from "../../types";
import { useLocationTags } from "../../summary/summary.resource";

const WardAdministrationSchema = z.object({
  name: z.string().max(255),
  tagLocation: z
    .object({ display: z.string(), uuid: z.string() })
    .refine(
      (value) => value.display != "",
      "Please select a valid location Tag"
    ),
});

interface WardAdministrationFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  allLocations: Location[];
  handleCreateQuestion?: (formData: LocationTagData) => void;
  handleDeleteBedTag?: () => void;
  headerTitle: string;
  initialData: LocationTagData;
}
interface ErrorType {
  message: string;
}
const WardAdministrationForm: React.FC<WardAdministrationFormProps> = ({
  showModal,
  onModalChange,
  handleCreateQuestion,
  headerTitle,
  initialData,
}) => {
  const { t } = useTranslation();
  const { tagList, tagError, tagLoading, tagValidate, tagMutate } =
    useLocationTags();
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [formStateError, setFormStateError] = useState("");

  const filterLocationNames = (tagLocation) => {
    return (
      tagLocation.display
        ?.toLowerCase()
        .includes(tagLocation?.inputValue?.toLowerCase()) ?? []
    );
  };
  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm<LocationTagData>({
    mode: "all",
    resolver: zodResolver(WardAdministrationSchema),
    defaultValues: {
      name: initialData.name || "",
      tagLocation: initialData.tagLocation || {},
    },
  });

  const onSubmit = (formData: LocationTagData) => {
    const result = WardAdministrationSchema.safeParse(formData);
    if (result.success) {
      setShowErrorNotification(false);
      handleCreateQuestion(formData);
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
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <ModalBody hasScrollingContent>
          <Stack gap={3}>
            <FormGroup legendText={""}>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <>
                    <TextInput
                      id="ward"
                      labelText={t("ward", "Ward Name")}
                      placeholder={t("wardPlaceholder", "")}
                      invalidText={fieldState.error?.message}
                      {...field}
                    />
                  </>
                )}
              />
            </FormGroup>
            {/* <FormGroup>
              <Controller
                name="tagLocation"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Dropdown
                    label={t("selectTag", "Select a Tag...")}
                    onChange={({ selectedItem }) =>
                      field.onChange(selectedItem?.uuid)
                    }
                    id="locationTags"
                    items={tagList}
                    itemToString={(item) => (item ? `${item.display}` : "")}
                  />
                )}
              />
            </FormGroup> */}
            <FormGroup>
              <Controller
                name="tagLocation"
                control={control}
                render={({
                  fieldState,
                  field: { onChange, onBlur, value, ref },
                }) => (
                  <ComboBox
                    aria-label={t("selectTag", "Select location Tag")}
                    shouldFilterItem={filterLocationNames}
                    id="locationTags"
                    label={t("selectTag", "Select location Tag...")}
                    invalidText={fieldState?.error?.message}
                    items={tagList}
                    onBlur={onBlur}
                    ref={ref}
                    selectedItem={value}
                    onChange={({ selectedItem }) => onChange(selectedItem)}
                    itemToString={(location) => location?.display ?? ""}
                    placeholder={t(
                      "selectBedLocation",
                      "Select a bed location Tag"
                    )}
                    titleText={t("bedLocation", "Location")}
                  />
                )}
              />
            </FormGroup>
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
          <Button disabled={!isDirty} type="submit">
            <span>{t("save", "Save")}</span>
          </Button>
        </ModalFooter>
      </Form>
    </ComposedModal>
  );
};

export default WardAdministrationForm;
