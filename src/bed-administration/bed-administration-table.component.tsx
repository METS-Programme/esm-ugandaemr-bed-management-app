import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useLayoutType,
  isDesktop as desktopLayout,
  usePagination,
} from "@openmrs/esm-framework";
import { findBedByLocation, useWards } from "../summary/summary.resource";
import { LOCATION_TAG_UUID } from "../constants";
import { CardHeader, ErrorState } from "@openmrs/esm-patient-common-lib";
import {
  DataTable,
  TableContainer,
  DataTableSkeleton,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  InlineLoading,
  TableHead,
  Table,
  Pagination,
  Button,
  Tag,
  Dropdown,
} from "@carbon/react";
import { Add, Edit } from "@carbon/react/icons";
import type { InitialData, Location } from "../types";
import NewBedForm from "./new-bed-form.component";
import Header from "../header/header.component";
import styles from "./bed-administration-table.scss";
import EditBedForm from "./edit-bed-form.component";
import EmptyState from "../empty-state/empty-state.component";

const BedAdminstration: React.FC = () => {
  const { t } = useTranslation();
  const headerTitle = t("wardAllocation", "Ward Allocation");
  const layout = useLayoutType();
  const isTablet = layout === "tablet";
  const responsiveSize = isTablet ? "lg" : "sm";
  const isDesktop = desktopLayout(layout);

  const [wardsGroupedByLocations, setWardsGroupedByLocation] = useState(
    Array<Location>
  );
  const [isBedDataLoading, setIsBedDataLoading] = useState(false);
  const [showAddBedModal, setShowAddBedModal] = useState(false);
  const [showEditBedModal, setShowEditBedModal] = useState(false);
  const [editData, setEditData] = useState<InitialData>();
  const [filteroption, setFilterOption] = useState("ALL");
  const [refetchBedData, setRefetchBedData] = useState(false);

  function CustomTag({ condition }: { condition: boolean }) {
    const { t } = useTranslation();

    if (condition) {
      return (
        <Tag type="green" size="md" title="Clear Filter" data-testid="yes-tag">
          {t("yes", "Yes")}
        </Tag>
      );
    }

    return (
      <Tag type="red" size="md" title="Clear Filter" data-testid="no-tag">
        {t("no", "No")}
      </Tag>
    );
  }

  const handleBedStatusChange = ({ selectedItem }: { selectedItem: string }) =>
    setFilterOption(selectedItem.trim().toUpperCase());

  const bedsMappedToLocation = wardsGroupedByLocations?.length
    ? [].concat(...wardsGroupedByLocations)
    : [];

  const { data, isLoading, error, isValidating } = useWards(LOCATION_TAG_UUID);

  const [currentPageSize, setPageSize] = useState(10);
  const pageSizes = [10, 20, 30, 40, 50];
  const { results, currentPage, totalPages, goTo } = usePagination(
    filteroption === "ALL"
      ? bedsMappedToLocation
      : bedsMappedToLocation.filter((bed) => bed.status === filteroption) ?? [],
    currentPageSize
  );

  useEffect(() => {
    if (
      (!isLoading && data && !wardsGroupedByLocations.length) ||
      refetchBedData
    ) {
      setIsBedDataLoading(true);
      const fetchData = async () => {
        const promises = data.data.results.map(async (ward) => {
          const bedLocations = await findBedByLocation(ward.uuid);
          if (bedLocations.data.results.length) {
            return bedLocations.data.results.map((bed) => ({
              ...bed,
              location: ward,
            }));
          }
          return null;
        });

        const updatedWards = (await Promise.all(promises)).filter(Boolean);
        setWardsGroupedByLocation(updatedWards);
        setIsBedDataLoading(false);
      };
      setRefetchBedData(false);
      fetchData().finally(() => setIsBedDataLoading(false));
    }
  }, [data, isLoading, refetchBedData, wardsGroupedByLocations.length]);

  const tableHeaders = [
    {
      key: "bedNumber",
      header: t("bedId", "Bed ID"),
    },
    {
      key: "location",
      header: t("location", "Location"),
    },
    {
      key: "occupancyStatus",
      header: t("occupancyStatus", "Occupied"),
    },
    {
      key: "allocationStatus",
      header: t("allocationStatus", "Allocated"),
    },
    {
      key: "actions",
      header: t("actions", "Actions"),
    },
  ];

  const tableRows = useMemo(() => {
    return results.map((ward) => {
      return {
        id: ward.uuid,
        bedNumber: ward.bedNumber,
        location: ward.location.display,
        occupancyStatus: <CustomTag condition={ward?.status === "OCCUPIED"} />,
        allocationStatus: <CustomTag condition={ward.location?.uuid} />,
        actions: (
          <>
            <Button
              enterDelayMs={300}
              renderIcon={Edit}
              onClick={(e) => {
                e.preventDefault();
                setEditData(ward);
                setShowEditBedModal(true);
                setShowAddBedModal(false);
              }}
              kind={"ghost"}
              iconDescription={t("editBed", "Edit Bed")}
              hasIconOnly
              size={responsiveSize}
              tooltipAlignment="start"
            />
          </>
        ),
      };
    });
  }, [responsiveSize, results, t]);

  return (
    <>
      <Header route={"Ward Allocation"} />
      <div className={styles.flexContainer}>
        <div className={styles.filterContainer}>
          <Dropdown
            id="occupancyStatus"
            initialSelectedItem={"All"}
            label=""
            titleText={
              t("filterByoccupancyStatus", "Filter by occupancy status") + ":"
            }
            type="inline"
            items={["All", "Available", "Occupied"]}
            onChange={handleBedStatusChange}
          />
        </div>
      </div>
      {isBedDataLoading || isLoading ? (
        <div className={styles.widgetCard}>
          <DataTableSkeleton role="progressbar" compact={isDesktop} zebra />
        </div>
      ) : null}
      {!isLoading && !tableRows.length && !error && !isBedDataLoading ? (
        <div className={styles.widgetCard}>
          <EmptyState msg="No bed details found" helper="" />
        </div>
      ) : null}
      {error ? (
        <div className={styles.widgetCard}>
          <ErrorState error={error} headerTitle={headerTitle} />
        </div>
      ) : null}
      {tableRows?.length && !isBedDataLoading ? (
        <div className={styles.widgetCard}>
          {showAddBedModal ? (
            <NewBedForm
              onModalChange={setShowAddBedModal}
              showModal={showAddBedModal}
              refetchBedData={setRefetchBedData}
            />
          ) : null}
          {showEditBedModal ? (
            <EditBedForm
              onModalChange={setShowEditBedModal}
              showModal={showEditBedModal}
              editData={editData}
              refetchBedData={setRefetchBedData}
            />
          ) : null}
          <CardHeader title={headerTitle}>
            <span>
              {isValidating ? (
                <InlineLoading />
              ) : (
                <Button
                  kind="ghost"
                  renderIcon={(props) => <Add size={16} {...props} />}
                  onClick={() => setShowAddBedModal(true)}
                >
                  {t("addBed", "Add bed")}
                </Button>
              )}
            </span>
          </CardHeader>
          <DataTable
            rows={tableRows}
            headers={tableHeaders}
            isSortable
            size={isTablet ? "lg" : "sm"}
            useZebraStyles
          >
            {({ rows, headers, getTableProps }) => (
              <TableContainer>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader>
                          {header.header?.content ?? header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.value?.content ?? cell.value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  backwardText="Previous page"
                  forwardText="Next page"
                  page={currentPage}
                  pageNumberText="Page Number"
                  pageSize={totalPages}
                  pageSizes={pageSizes?.length > 0 ? pageSizes : [10]}
                  totalItems={bedsMappedToLocation.length ?? 0}
                  onChange={({ pageSize, page }) => {
                    if (pageSize !== currentPageSize) {
                      setPageSize(pageSize);
                    }
                    if (page !== currentPage) {
                      goTo(page);
                    }
                  }}
                />
              </TableContainer>
            )}
          </DataTable>
        </div>
      ) : null}
    </>
  );
};

export default BedAdminstration;
