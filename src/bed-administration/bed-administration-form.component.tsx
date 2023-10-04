import React, { useState } from "react";
import capitalize from "lodash-es/capitalize";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  ComboBox,
  ComposedModal,
  Form,
  FormGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Select,
  SelectItem,
  Stack,
  TextArea,
  TextInput,
  InlineNotification,
  Row,
  Column,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { Location } from "@openmrs/esm-framework";
import type { BedType, InitialData } from "../types";
import styles from "./bed-administration-form.scss";

const numberInString = z.string().transform((val, ctx) => {
  const parsed = parseInt(val);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please enter a valid number",
    });
    return z.NEVER;
  }
  return parsed;
});

const BedAdministrationSchema = z.object({
  bedId: z.string().min(5).max(255),
  description: z.string().max(255),
  bedRow: numberInString,
  bedColumn: numberInString,
  location: z
    .object({ display: z.string(), uuid: z.string() })
    .refine((value) => value.display != "", "Please select a valid location"),
  occupancyStatus: z
    .string()
    .refine((value) => value != "", "Please select a valid occupied status"),
  bedType: z
    .string()
    .refine((value) => value != "", "Please select a valid bed type"),
});

interface BedAdministrationData {
  bedId: string;
  description: string;
  bedRow: number;
  bedColumn: number;
  location: string;
  occupancyStatus: string;
  bedType: string;
}

interface BedAdministrationFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  availableBedTypes: Array<BedType>;
  allLocations: Location[];
  handleCreateQuestion?: (formData: BedAdministrationData) => void;
  headerTitle: string;
  occupancyStatuses: string[];
  initialData: InitialData;
}

const BedAdministrationForm: React.FC<BedAdministrationFormProps> = ({
  showModal,
  onModalChange,
  availableBedTypes,
  allLocations,
  handleCreateQuestion,
  headerTitle,
  occupancyStatuses,
  initialData,
}) => {
  const { t } = useTranslation();

  // const [bedLabel, setBedIdLabel] = useState(initialData.bedNumber);
  // const [descriptionLabel, setDescriptionLabel] = useState(
  //   initialData.description
  // );
  // const [selectedLocationId, setSelectedLocationId] = useState("");
  // const [selectedLocationName, setSelectedLocationName] = useState(
  //   initialData.location.display
  // );
  // const [bedRow, setBedRow] = useState(initialData.row);
  // const [bedColumn, setBedColumn] = useState(initialData.column);
  const [occupancyStatus, setOccupancyStatus] = useState(
    capitalize(initialData.status)
  );
  const [selectedBedType] = useState(initialData.bedType.name);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [formStateError, setFormStateError] = useState("");

  const filterLocationNames = (location) => {
    return (
      location.item.display
        ?.toLowerCase()
        .includes(location?.inputValue?.toLowerCase()) ?? []
    );
  };

  const {
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm<BedAdministrationData>({
    mode: "all",
    resolver: zodResolver(BedAdministrationSchema),
    defaultValues: {
      bedId: initialData.bedNumber || "",
      description: initialData.description || "",
      bedRow: initialData.row || 0,
      bedColumn: initialData.column || 0,
      location: initialData.location.display || "",
      occupancyStatus: capitalize(initialData.status) || occupancyStatus,
      bedType: initialData.bedType.name || "",
    },
  });

  const onSubmit = (formData: BedAdministrationData) => {
    // console.log(">>>>>>> formData", formData);

    // Validate form data with zod schema
    const result = BedAdministrationSchema.safeParse(formData);

    if (result.success) {
      // console.log("yeesdsss");

      setShowErrorNotification(false);
      handleCreateQuestion(formData);
    } else {
      // Handle validation errors
      setShowErrorNotification(true);
      // console.log("noo", errors);
    }
  };

  // const onSubmity = handleSubmit((data: BedAdministrationData) => {
  //   BedAdministrationSchema.safeParse(data);
  //   console.log(">>>data>>", data)
  // })

  interface ErrorType {
    message: string;
    // other properties
  }

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
              {/* <TextInput
                id="bedId"
                labelText={t("bedId", "Bed number")}
                placeholder={t("bedIdPlaceholder", "e.g. BMW-201")}
                invalidText={t(
                  "bedIdExists",
                  "This bed number has already been generated for this ward"
                )}
                value={bedLabel ?? ""}
                onChange={(event) => setBedIdLabel(event.target.value)}
                required
              /> */}
              <Controller
                name="bedId"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <TextInput
                      id="bedId"
                      labelText={t("bedId", "Bed number")}
                      placeholder={t("bedIdPlaceholder", "e.g. BMW-201")}
                      invalidText={fieldState.error?.message}
                      {...field}
                    />
                    {/* <p className={styles.errorMessage}> {fieldState?.error?.message}</p> */}
                  </>
                )}
              />
            </FormGroup>

            <FormGroup>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <TextArea
                      rows={2}
                      id="description"
                      invalidText={fieldState?.error?.message}
                      labelText={t("description", "Bed description")}
                      {...field}
                      // onChange={(event) => setDescriptionLabel(event.target.value)}
                      // value={descriptionLabel}
                      placeholder={t(
                        "description",
                        "Enter the bed description"
                      )}
                    />
                    <p className={styles.errorMessage}>
                      {fieldState?.error?.message}
                    </p>
                  </>
                )}
              />
            </FormGroup>

            <FormGroup>
              <Controller
                name="bedRow"
                control={control}
                render={({ field, fieldState }) => (
                  <NumberInput
                    hideSteppers
                    id="bedRow"
                    labelText="Bed row"
                    invalidText={fieldState?.error?.message}
                    {...field}
                  />
                )}
              />
            </FormGroup>

            <FormGroup>
              <Controller
                name="bedColumn"
                control={control}
                render={({ field, fieldState }) => (
                  <NumberInput
                    hideSteppers
                    id="bedColumn"
                    labelText="Bed column"
                    invalidText={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </FormGroup>

            <FormGroup>
              {/* <ComboBox
                aria-label={t("location", "Locations")}
                id="location"
                label={t("location", "Locations")}
                shouldFilterItem={filterLocationNames}
                items={allLocations}
                onChange={({ selectedItem }) => {
                  setSelectedLocationId(selectedItem?.uuid);
                  setSelectedLocationName(selectedItem?.display);
                }}
                selectedItem={allLocations?.find(
                  (location) => location?.uuid === selectedLocationId
                )}
                itemToString={(location) => location?.display ?? ""}
                placeholder={t("selectBedLocation", "Select a bed location")}
                titleText={t("bedLocation", "Locations")}
                title={selectedLocationId}
                initialSelectedItem={allLocations?.find(
                  (location) => location?.display === selectedLocationName
                )}
                required
              /> */}
              <Controller
                name="location"
                control={control}
                render={({
                  fieldState,
                  field: { onChange, onBlur, value, ref },
                }) => (
                  <ComboBox
                    aria-label={t("location", "Locations")}
                    shouldFilterItem={filterLocationNames}
                    id="location"
                    label={t("location", "Locations")}
                    invalidText={fieldState?.error?.message}
                    items={allLocations}
                    onBlur={onBlur}
                    ref={ref}
                    selectedItem={value}
                    onChange={({ selectedItem }) => onChange(selectedItem)}
                    itemToString={(location) => location?.display ?? ""}
                    placeholder={t(
                      "selectBedLocation",
                      "Select a bed location"
                    )}
                    titleText={t("bedLocation", "Locations")}
                  />
                )}
              />
            </FormGroup>

            <FormGroup>
              <Controller
                name="occupancyStatus"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    id="occupancyStatus"
                    labelText={t("occupancyStatus", "Occupied Status")}
                    invalidText={fieldState.error?.message}
                    defaultValue={occupancyStatus}
                    onChange={(event) => setOccupancyStatus(event.target.value)}
                    value={occupancyStatus}
                    {...field}
                  >
                    <SelectItem
                      text={t("chooseOccupiedStatus", "Choose occupied status")}
                      value=""
                    />
                    {occupancyStatuses.map((occupancyStatus, index) => (
                      <SelectItem
                        text={t("occupancyStatus", `${occupancyStatus}`)}
                        value={t("occupancyStatus", `${occupancyStatus}`)}
                        key={`occupancyStatus-${index}`}
                      />
                    ))}
                  </Select>
                )}
              />
            </FormGroup>

            <FormGroup>
              <Controller
                name="bedType"
                control={control}
                render={({ field }) => (
                  <Select
                    id="bedType"
                    labelText={t("bedType", "Bed type")}
                    invalidText={t("required", "Required")}
                    defaultValue={selectedBedType}
                    {...field}
                  >
                    <SelectItem
                      text={t("chooseBedtype", "Choose a bed type")}
                    />
                    {availableBedTypes.map((bedType, index) => (
                      <SelectItem
                        text={bedType.name}
                        value={bedType.name}
                        key={`bedType-${index}`}
                      >
                        {bedType.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </FormGroup>
            <Row>
              {showErrorNotification && (
                <Column>
                  <InlineNotification
                    lowContrast
                    title={t("error", "Error")}
                    subtitle={t("pleaseFillField", formStateError) + "."}
                    onClose={() => setShowErrorNotification(false)}
                  />
                </Column>
              )}
            </Row>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => onModalChange(false)} kind="secondary">
            {t("cancel", "Cancel")}
          </Button>
          <Button type="submit">
            <span>{t("save", "Save")}</span>
          </Button>
        </ModalFooter>
      </Form>
    </ComposedModal>
  );
};

export default BedAdministrationForm;
