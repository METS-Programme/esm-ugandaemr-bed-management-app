import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useLayoutType,
  isDesktop as desktopLayout,
  usePagination,
} from "@openmrs/esm-framework";
import {
  findBedByLocation,
  useWards,
} from "../bed-management-summary/summary.resource";
import { LOCATION_TAG_UUID } from "../constants";
import {
  CardHeader,
  EmptyState,
  ErrorState,
} from "@openmrs/esm-patient-common-lib";
import {
  Button,
  DataTable,
  DataTableSkeleton,
  InlineLoading,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import { Location } from "../types";
import { Add } from "@carbon/react/icons";
import styles from "./bed-administration-table.scss";
import BedManagementHeader from "../bed-management-header/bed-management-header.component";

const BedAdminstration: React.FC = () => {
  const { t } = useTranslation();
  const displayText = t("awardAllocation", "Award Allocation");
  const headerTitle = t("awardAllocation", "Award Allocation");
  const layout = useLayoutType();
  const isTablet = layout === "tablet";
  const isDesktop = desktopLayout(layout);

  const [wardsGroupedByLocations, setWardsGroupedByLocation] = useState(
    Array<Location>
  );
  const [isBedDataLoading, setIsBedDataLoading] = useState(false);

  const bedsMappedToLocation = wardsGroupedByLocations?.length
    ? [].concat(...wardsGroupedByLocations)
    : [];

  const { data, isLoading, error, isValidating } = useWards(LOCATION_TAG_UUID);
  const [currentPageSize, setPageSize] = useState(10);
  const pageSizes = [10, 20, 30, 40, 50];
  const { results, currentPage, totalPages, goTo } = usePagination(
    bedsMappedToLocation ?? [],
    currentPageSize
  );

  useEffect(() => {
    if (!isLoading && data) {
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
      fetchData();
    }
  }, [data, isLoading]);

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
      key: "occupationStatus",
      header: t("occupationStatus", "Occupation Status"),
    },
    {
      key: "currentStatus",
      header: t("currentStatus", "Current Status"),
    },
    {
      key: "actions",
      header: t("actions", "Actions"),
    },
  ];

  const bedActions = useMemo(
    () => [
      {
        label: t("allocate", "Allocate"),
        form: {
          name: "bed-adminstration-form",
        },
        mode: "view",
        intent: "*",
      },
      {
        label: t("editBed", "Edit"),
        form: {
          name: "bed-adminstration-form",
        },
        mode: "view",
        intent: "*",
      },
    ],
    [t]
  );

  const tableRows = useMemo(() => {
    return results.map((ward) => {
      return {
        id: ward.uuid,
        bedNumber: ward.bedNumber,
        location: ward.location.display,
        currentStatus: ward.status,
        occupationStatus: "--",
        actions: (
          <OverflowMenu flipped className={styles.flippedOverflowMenu}>
            {bedActions.map((actionItem, index) => (
              <OverflowMenuItem
                key={`action-item-${index}`}
                itemText={actionItem.label}
                onClick={(e) => {
                  e.preventDefault();
                }}
              />
            ))}
          </OverflowMenu>
        ),
      };
    });
  }, [bedActions, results]);

  return (
    <>
      <BedManagementHeader route={"Administration"} />
      {/* {isBedDataLoading || isLoading ? (
        <div className={styles.widgetCard}>
          <DataTableSkeleton role="progressbar" compact={isDesktop} zebra />
        </div>
      ) : null} */}
      {error ? (
        <div className={styles.widgetCard}>
          <ErrorState error={error} headerTitle={headerTitle} />
        </div>
      ) : null}
      {tableRows?.length ? (
        <div className={styles.widgetCard}>
          <CardHeader title={headerTitle}>
            <span>
              {isValidating ? (
                <InlineLoading />
              ) : (
                <Button
                  kind="ghost"
                  size="sm"
                  renderIcon={(props) => <Add size={16} {...props} />}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
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
