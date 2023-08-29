import React, { SyntheticEvent, useCallback, useState } from "react";
import styles from "./bed-adminstration-table.scss";
import {
  SelectItem,
  ModalHeader,
  Stack,
  ModalFooter,
  ComposedModal,
  Button,
  ModalBody,
  FormGroup,
  TextInput,
  Select,
  Form,
  TextArea,
  ComboBox,
  NumberInput,
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { saveBed } from "./bed-adminstration.resource";
import { Location, showNotification, showToast } from "@openmrs/esm-framework";
import { BedType } from "../types";

interface BedFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  availableBedTypes: Array<BedType>;
  allLocations: Location[];
}

const AddBedModal: React.FC<BedFormProps> = ({
  showModal,
  onModalChange,
  availableBedTypes,
  allLocations,
}: BedFormProps) => {
  const { t } = useTranslation();
  const occupiedStatuses = ["Available", "Occupied"];

  const [bedLabel, setBedIdLabel] = useState("");
  const [descriptionLabel, setDescriptionLabel] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [bedRow, setBedRow] = useState(0);
  const [bedColumn, setBedColumn] = useState(0);

  const changebedNumber = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setBedIdLabel(event.target.value),
    []
  );

  const filterLocationNames = (location) => {
    return location.item.display
      ?.toLowerCase()
      .includes(location?.inputValue?.toLowerCase());
  };

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
    <ComposedModal
      open={showModal}
      onClose={() => onModalChange(false)}
      preventCloseOnClickOutside
    >
      <ModalHeader title={t("createNewBed", "Create a new bed")} />
      <Form className={styles.form} onSubmit={handleCreateQuestion}>
        <ModalBody hasScrollingContent>
          <FormGroup legendText={""}>
            <Stack gap={5}>
              <TextInput
                id="bedId"
                labelText={t("bedId", "Bed Number")}
                placeholder={t("bedIdPlaceholder", "e.g. BMW-201")}
                invalidText={t(
                  "bedIdExists",
                  "This bed ID already exists in your schema"
                )}
                value={bedLabel}
                onChange={changebedNumber}
                required
              />

              <TextArea
                id="description"
                labelText={t("description", "Bed description")}
                onChange={(event) => {
                  setDescriptionLabel(event.target.value);
                }}
                value={descriptionLabel}
                placeholder={t("description", "Enter the bed description")}
              />

              <div className={styles["input-container"]}>
                <NumberInput
                  id="bedRow"
                  invalidText="Bed row number is not valid"
                  label="Bed Row"
                  min={0}
                  value={t("bedRow", `${bedRow}`)}
                  onChange={(event) => setBedRow(event.target.value)}
                />

                <NumberInput
                  id="bedColumn"
                  invalidText="Bed column number is not valid"
                  label="Bed Column"
                  min={0}
                  value={t("bedColumn", `${bedColumn}`)}
                  onChange={(event) => setBedColumn(event.target.value)}
                />
              </div>

              <ComboBox
                aria-label={t("location", "Locations")}
                id="location"
                label={t("location", "Locations")}
                shouldFilterItem={filterLocationNames}
                items={allLocations}
                onChange={({ selectedItem }) =>
                  setSelectedLocation(selectedItem?.uuid)
                }
                selectedItem={allLocations?.find(
                  (location) => location?.uuid === selectedLocation
                )}
                itemToString={(location) => location.display}
                placeholder={t("selectBedLocation", "Select a bed Location")}
                titleText={t("bedLocation", "Locations")}
                title={selectedLocation}
                required
              />

              <Select
                onChange={(event) => event.target.value}
                id="occupiedStatus"
                invalidText={t("typeRequired", "Type is required")}
                labelText={t("occupiedStatus", "Occupied Status")}
                required
              >
                {occupiedStatuses.map((element, key) => (
                  <SelectItem text={element} value={element} key={key}>
                    {t("occupiedStatus", `${element}`)}
                  </SelectItem>
                ))}
              </Select>

              <Select
                onChange={(event) => event.target.value}
                id="bedType"
                invalidText={t("typeRequired", "Type is required")}
                labelText={t("bedType", "Bed Type")}
                required
              >
                {availableBedTypes.map((element, key) => (
                  <SelectItem
                    text={element.name}
                    value={t("bedType", `${element.name}`)}
                    key={key}
                  >
                    {t("bedType", `${element.name}`)}
                  </SelectItem>
                ))}
              </Select>
            </Stack>
          </FormGroup>
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

export default AddBedModal;
