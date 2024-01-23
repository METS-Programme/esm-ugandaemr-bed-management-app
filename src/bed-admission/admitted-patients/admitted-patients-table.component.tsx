import {
  DataTable,
  DataTableSkeleton,
  DefinitionTooltip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Layer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableExpandedRow,
  TableExpandHeader,
  TableExpandRow,
} from "@carbon/react";

import {
  isDesktop,
  useConfig,
  useLayoutType,
  usePagination,
  useSession,
} from "@openmrs/esm-framework";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getOriginFromPathName } from "../helpers/functions";
import styles from "../active-patients/styles.scss";
import { useActiveAdmissions } from "./active-admissions.resource";
import EmptyState from "../../empty-state/empty-state.component";
import { patientDetailsProps } from "../types";

interface ActiveVisitsTableProps {
  status: string;
  setPatientCount?: (value: number) => void;
}

const AdmittedPatientsTable: React.FC<ActiveVisitsTableProps> = ({
  status,
  setPatientCount,
}) => {
  const { t } = useTranslation();
  const session = useSession();
  const currentPathName: string = window.location.pathname;
  const fromPage: string = getOriginFromPathName(currentPathName);
  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedPatientDetails, setSelectedPatientDetails] =
    useState<patientDetailsProps>();

  const layout = useLayoutType();

  const { patientQueueEntries, isLoading } = useActiveAdmissions();
  const { restrictWardAdministrationToLoginLocation } = useConfig();

  const handleBedAssigmentModal = useCallback(
    (entry) => {
      setSelectedPatientDetails({
        name: entry.name,
        patientUuid: entry.patientUuid,
        encounter: entry.encounter,
        locationUuid: session?.sessionLocation?.uuid,
        locationTo: entry.locationTo,
        locationFrom: entry.locationFrom,
        queueUuid: entry.uuid,
      });
      setShowOverlay(true);
    },
    [session?.sessionLocation?.uuid]
  );

  const renderActionButton = useCallback(
    (entry) => {
      const buttonTexts = {
        pending: "Assign Bed",
        completed: "Transfer",
      };
      const buttonText = buttonTexts[status] || "Un-assign";

      // return (
      //   <AdmissionActionButton
      //     entry={entry}
      //     handleBedAssigmentModal={handleBedAssigmentModal}
      //     buttonText={buttonText}
      //   />
      // );
    },
    [status]
  );

  const {
    goTo,
    results: paginatedQueueEntries,
    currentPage,
  } = usePagination(patientQueueEntries, currentPageSize);

  const tableHeaders = useMemo(
    () => [
      {
        id: 0,
        header: t("name", "Name"),
        key: "patientName",
      },
      {
        id: 1,
        header: t("age", "Age"),
        key: "age",
      },
      {
        id: 2,
        header: t("gender", "Gender"),
        key: "gender",
      },
      {
        id: 3,
        header: t("ward", "Ward"),
        key: "ward",
      },
      {
        id: 4,
        header: t("bedNumber", "Bed Number"),
        key: "bedNumber",
      },
      {
        id: 5,
        header: t("actions", "Action"),
        key: "actions",
      },
    ],
    [t]
  );

  const tableRows = useMemo(() => {
    return paginatedQueueEntries?.map((entry: any, index) => ({
      ...(entry as object),
      id: `${entry?.patientUuid}`,
      actions: {
        content: (
          <div className={styles.displayFlex}>
            {/* {renderActionButton(entry)} */}
          </div>
        ),
      },
    }));
  }, [paginatedQueueEntries]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (
    (!isLoading && patientQueueEntries && status === "pending") ||
    status === "completed" ||
    status === ""
  ) {
    setPatientCount(patientQueueEntries.length);
  }

  if (patientQueueEntries?.length) {
    return (
      <div className={styles.container}>
        <div className={styles.headerBtnContainer}></div>

        <DataTable
          data-floating-menu-container
          headers={tableHeaders}
          overflowMenuOnHover={isDesktop(layout) ? true : false}
          rows={tableRows}
          isSortable
          size="xs"
          useZebraStyles
        >
          {({ rows, headers, getTableProps, getRowProps, onInputChange }) => (
            <TableContainer className={styles.tableContainer}>
              <TableToolbar
                style={{
                  position: "static",
                  height: "3rem",
                  overflow: "visible",
                  backgroundColor: "color",
                }}
              >
                <TableToolbarContent className={styles.toolbarContent}>
                  <Layer>
                    <TableToolbarSearch
                      className={styles.search}
                      onChange={onInputChange}
                      placeholder={t("searchThisList", "Search this list")}
                      size="sm"
                    />
                  </Layer>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()} className={styles.activeVisitsTable}>
                <TableHead>
                  <TableRow>
                    <TableExpandHeader />
                    {headers.map((header) => (
                      <TableHeader>
                        {header.header?.content ?? header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => {
                    return (
                      <>
                        <TableExpandRow {...getRowProps({ row })} key={row.id}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>
                              {cell.value?.content ?? cell.value}
                            </TableCell>
                          ))}
                        </TableExpandRow>

                        {row.isExpanded ? (
                          <TableExpandedRow
                            className={styles.expandedLabQueueVisitRow}
                            colSpan={headers.length + 2}
                          ></TableExpandedRow>
                        ) : (
                          <TableExpandedRow
                            className={styles.hiddenRow}
                            colSpan={headers.length + 2}
                          />
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
              <Pagination
                forwardText="Next page"
                backwardText="Previous page"
                page={currentPage}
                pageSize={currentPageSize}
                pageSizes={pageSizes}
                totalItems={patientQueueEntries?.length}
                className={styles.pagination}
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
        {/* {showOverlay && (
          <AssignBedWorkSpace
            patientDetails={selectedPatientDetails}
            closePanel={() => setShowOverlay(false)}
            queueStatus={status}
            headerTitle={t(
              "assignBedToPatient",
              restrictWardAdministrationToLoginLocation === true
                ? `Assign Bed to Patient  ${selectedPatientDetails.name} in the ${session?.sessionLocation?.display} Ward`
                : `Assign Bed to Patient  ${selectedPatientDetails.name}`
            )}
          />
        )} */}
      </div>
    );
  }

  return (
    <EmptyState msg={t("noQueueItems", "No admissions to display")} helper="" />
  );
};
export default AdmittedPatientsTable;
