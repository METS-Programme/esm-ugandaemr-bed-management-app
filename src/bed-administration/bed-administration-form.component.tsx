import React, { SyntheticEvent, useState } from "react";
import capitalize from "lodash-es/capitalize";
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
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { Location } from "@openmrs/esm-framework";
import type { BedType, InitialData } from "../types";

interface BedAdministrationFormProps {
  showModal: boolean;
  onModalChange: (showModal: boolean) => void;
  availableBedTypes: Array<BedType>;
  allLocations: Location[];
  handleCreateQuestion: (
    event: SyntheticEvent<{ name: { value: string } }>
  ) => void;
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

  const [bedLabel, setBedIdLabel] = useState(initialData.bedNumber);
  const [descriptionLabel, setDescriptionLabel] = useState(
    initialData.description
  );
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [selectedLocationName, setSelectedLocationName] = useState(
    initialData.location.display
  );

  const [bedRow, setBedRow] = useState(initialData.row);
  const [bedColumn, setBedColumn] = useState(initialData.column);
  const [occupancyStatus, setOccupancyStatus] = useState(
    capitalize(initialData.status)
  );
  const [selectedBedType, setSelectedBedType] = useState(
    initialData.bedType.name
  );

  const filterLocationNames = (location) => {
    return (
      location.item.display
        ?.toLowerCase()
        .includes(location?.inputValue?.toLowerCase()) ?? []
    );
  };

  return (
    <ComposedModal
      open={showModal}
      onClose={() => onModalChange(false)}
      preventCloseOnClickOutside
    >
      <ModalHeader title={headerTitle} />
      <Form onSubmit={handleCreateQuestion}>
        <ModalBody hasScrollingContent>
          <Stack gap={3}>
            <FormGroup legendText={""}>
              <TextInput
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
              />
            </FormGroup>

            <FormGroup>
              <TextArea
                rows={2}
                id="description"
                labelText={t("description", "Bed description")}
                onChange={(event) => setDescriptionLabel(event.target.value)}
                value={descriptionLabel}
                placeholder={t("description", "Enter the bed description")}
              />
            </FormGroup>

            <FormGroup>
              <NumberInput
                hideSteppers
                id="bedRow"
                label="Bed row"
                value={bedRow}
                onChange={(event) => setBedRow(event.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <NumberInput
                hideSteppers
                id="bedColumn"
                label="Bed column"
                value={bedColumn}
                onChange={(event) => setBedColumn(event.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <ComboBox
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
              />
            </FormGroup>

            <FormGroup>
              <Select
                defaultValue={occupancyStatus}
                onChange={(event) => setOccupancyStatus(event.target.value)}
                id="occupancyStatus"
                invalidText={t("typeRequired", "Type is required")}
                labelText={t("occupancyStatus", "Occupied Status")}
                value={occupancyStatus}
                required
              >
                {occupancyStatuses.map((occupancyStatus, index) => (
                  <SelectItem
                    text={t("occupancyStatus", `${occupancyStatus}`)}
                    value={t("occupancyStatus", `${occupancyStatus}`)}
                    key={`occupancyStatus-${index}`}
                  />
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Select
                defaultValue={selectedBedType}
                onChange={(event) => setSelectedBedType(event.target.value)}
                id="bedType"
                invalidText={t("typeRequired", "Type is required")}
                labelText={t("bedType", "Bed type")}
                required
              >
                {availableBedTypes.map((bedType, index) => (
                  <SelectItem
                    text={bedType.name}
                    value={t("bedType", `${bedType.name}`)}
                    key={`bedType-${index}`}
                  >
                    {t("bedType", `${bedType.name}`)}
                  </SelectItem>
                ))}
              </Select>
            </FormGroup>
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
