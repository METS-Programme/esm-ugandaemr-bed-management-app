import React, { SyntheticEvent, useCallback, useState } from "react";
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
import { Location } from "@openmrs/esm-framework";
import type { BedType } from "../types";
import styles from "./bed-administration-table.scss";

interface BedFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  availableBedTypes: Array<BedType>;
  allLocations: Location[];
  handleCreateQuestion: (
    event: SyntheticEvent<{ name: { value: string } }>
  ) => void;
  headerTitle: string;
  occupiedStatuses: string[];
  initialData
}

const BedAdministrationForm: React.FC<BedFormProps> = ({
  showModal,
  onModalChange,
  availableBedTypes,
  allLocations,
  handleCreateQuestion,
  headerTitle,
  occupiedStatuses,
  initialData,
}: BedFormProps) => {
  const { t } = useTranslation();

  const [bedLabel, setBedIdLabel] = useState(initialData.bedNumber);
  const [descriptionLabel, setDescriptionLabel] = useState(initialData.description);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [selectedLocationName, setSelectedLocationName] = useState(initialData.location.display);
  const [bedRow, setBedRow] = useState(initialData.row);
  const [bedColumn, setBedColumn] = useState(initialData.column);
  
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

  return (
    <ComposedModal
      open={showModal}
      onClose={() => onModalChange(false)}
      preventCloseOnClickOutside
    >
      <ModalHeader title={headerTitle} />
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

              <NumberInput
                hideSteppers
                id="bedRow"
                invalidText="Bed row number is not valid"
                label="Bed Row"
                min={0}
                value={t("bedRow", `${bedRow}`)}
                onChange={(event) => setBedRow(event.target.value)}
              />

              <NumberInput
                hideSteppers
                id="bedColumn"
                invalidText="Bed column number is not valid"
                label="Bed Column"
                min={0}
                value={t("bedColumn", `${bedColumn}`)}
                onChange={(event) => setBedColumn(event.target.value)}
              />

              <ComboBox
                aria-label={t("location", "Locations")}
                id="location"
                label={t("location", "Locations")}
                shouldFilterItem={filterLocationNames}
                items={allLocations}
                onChange={({ selectedItem }) => {
                  setSelectedLocationId(selectedItem?.uuid)
                  setSelectedLocationName(selectedItem?.display)
                }}
                selectedItem={allLocations?.find(
                  (location) => location?.uuid === selectedLocationId
                )}
                itemToString={(location) => location?.display ?? ""}
                placeholder={t("selectBedLocation", "Select a bed Location")}
                titleText={t("bedLocation", "Locations")}
                title={selectedLocationId}
                value={selectedLocationName}
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

export default BedAdministrationForm;
