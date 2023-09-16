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
} from "@carbon/react";

import {
  isDesktop,
  useLayoutType,
  usePagination,
  useSession,
} from "@openmrs/esm-framework";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  formatWaitTime,
  getTagColor,
  getTagType,
  trimVisitNumber,
} from "../helpers/functions";
import styles from "./styles.scss";
import { usePatientQueuesList } from "./patient-queues.resource";
import EmptyState from "../../empty-state/empty-state.component";
import AssignBedWorkSpace from "../../workspace/allocate-bed-workspace.component";
import AdmissionActionButton from "./admission-action-button.component";

interface ActiveVisitsTableProps {
  status: string;
}

interface patientDetailsProps {
  name: string;
  patientUuid: string;
  encounter: string;
}

const ActivePatientsTable: React.FC<ActiveVisitsTableProps> = ({ status }) => {
  const { t } = useTranslation();
  const session = useSession();

  const { patientQueueEntries, isLoading } = usePatientQueuesList(
    session?.sessionLocation?.uuid,
    status
  );

  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedPatientDetails, setSelectedPatientDetails] =
    useState<patientDetailsProps>();

  const layout = useLayoutType();

  const handleBedAssigmentModal = useCallback((entry) => {
    setSelectedPatientDetails({
      name: entry.name,
      patientUuid: entry.patientUuid,
      encounter: entry.encounter,
    });
    setShowOverlay(true);
  }, []);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);

  const {
    goTo,
    results: paginatedQueueEntries,
    currentPage,
  } = usePagination(patientQueueEntries, currentPageSize);

  const tableHeaders = useMemo(
    () => [
      {
        id: 0,
        header: t("visitNumber", "Visit Number"),
        key: "visitNumber",
      },
      {
        id: 1,
        header: t("name", "Name"),
        key: "name",
      },
      {
        id: 2,
        header: t("priority", "Priority"),
        key: "priority",
      },
      {
        id: 3,
        header: t("priorityLevel", "Priority Level"),
        key: "priorityLevel",
      },
      {
        id: 4,
        header: t("waitTime", "Wait time"),
        key: "waitTime",
      },
      {
        id: 5,
        header: t("actions", "Actions"),
        key: "actions",
      },
    ],
    [t]
  );
  const tableRows = useMemo(() => {
    return paginatedQueueEntries?.map((entry) => ({
      ...entry,
      visitNumber: {
        content: <span>{trimVisitNumber(entry.visitNumber)}</span>,
      },
      name: {
        content: entry.name,
      },
      priority: {
        content: (
          <>
            {entry?.priorityComment ? (
              <DefinitionTooltip
                className={styles.tooltip}
                align="bottom-left"
                definition={entry.priorityComment}
              >
                <Tag
                  role="tooltip"
                  className={
                    entry.priority === "Priority"
                      ? styles.priorityTag
                      : styles.tag
                  }
                  type={getTagType(entry.priority as string)}
                >
                  {entry.priority}
                </Tag>
              </DefinitionTooltip>
            ) : (
              <Tag
                className={
                  entry.priority === "Priority"
                    ? styles.priorityTag
                    : styles.tag
                }
                type={getTagType(entry.priority as string)}
              >
                {entry.priority}
              </Tag>
            )}
          </>
        ),
      },
      priorityLevel: {
        content: <span>{entry.priorityLevel}</span>,
      },
      waitTime: {
        content: (
          <Tag>
            <span
              className={styles.statusContainer}
              style={{ color: `${getTagColor(entry.waitTime)}` }}
            >
              {formatWaitTime(entry.waitTime, t)}
            </span>
          </Tag>
        ),
      },
      actions: {
        content: (
          <>
            {status === "pending" ? (
              <AdmissionActionButton
                entry={entry}
                handleBedAssigmentModal={handleBedAssigmentModal}
                buttonText={"Assign Bed"}
              />
            ) : status === "active" ? (
              <AdmissionActionButton
                entry={entry}
                handleBedAssigmentModal={handleBedAssigmentModal}
                buttonText={"Discharge"}
              />
            ) : null}
          </>
        ),
      },
    }));
  }, [paginatedQueueEntries, t, handleBedAssigmentModal]);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
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
          {({ rows, headers, getTableProps }) => (
            <TableContainer className={styles.tableContainer}>
              <Table {...getTableProps()} className={styles.activeVisitsTable}>
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
        {showOverlay && (
          <AssignBedWorkSpace
            patientDetails={selectedPatientDetails}
            closePanel={() => setShowOverlay(false)}
            headerTitle={t("assignBedToPatient", "Assign bed to patient")}
          />
        )}
      </div>
    );
  }

  return (
    <EmptyState
      msg={t("noQueueItems", "No queue items to display")}
      helper=""
    />
  );
};
export default ActivePatientsTable;
