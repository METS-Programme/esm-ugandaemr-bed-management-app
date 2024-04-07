import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DataTable,
  DataTableSkeleton,
  InlineLoading,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
} from "@carbon/react";
import { Add } from "@carbon/react/icons";
import {
  isDesktop as desktopLayout,
  useLayoutType,
} from "@openmrs/esm-framework";
import { CardHeader, ErrorState } from "@openmrs/esm-patient-common-lib";
import Header from "../../header/header.component";
import styles from "../../bed-administration/bed-administration-table.scss";
import { useWard } from "../../summary/summary.resource";
import NewWardForm from "./new-ward-form.component";

const WardAdministrationTable: React.FC = () => {
  const { t } = useTranslation();
  const headerTitle = t("wardList", "List of Wards");
  const layout = useLayoutType();
  const isTablet = layout === "tablet";
  const responsiveSize = isTablet ? "lg" : "sm";
  const isDesktop = desktopLayout(layout);
  const [isBedDataLoading] = useState(false);
  const [showWardModal, setAddWardModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(100);
  const { wardList, isError, loading, validate, mutate } = useWard();

  const tableHeaders = [
    {
      header: t("display", "Name"),
      key: "display",
    },
  ];
  const tableRows = useMemo(() => {
    return wardList?.map((entry) => ({
      id: entry.uuid,
      display: entry?.display,
    }));
  }, [wardList]);

  if (isBedDataLoading || loading) {
    return (
      <>
        <Header route="List of Wards" />
        <div className={styles.widgetCard}>
          <DataTableSkeleton role="progressbar" compact={isDesktop} zebra />
        </div>
      </>
    );
  }
  if (isError) {
    return (
      <>
        <Header route="List of Wards" />
        <div className={styles.widgetCard}>
          <ErrorState error={isError} headerTitle={headerTitle} />
        </div>
      </>
    );
  }
  return (
    <>
      <Header route="List of Wards" />

      <div className={styles.widgetCard}>
        {showWardModal ? (
          <NewWardForm
            onModalChange={setAddWardModal}
            showModal={showWardModal}
            mutate={mutate}
          />
        ) : null}
        <CardHeader title={headerTitle}>
          <span className={styles.backgroundDataFetchingIndicator}>
            <span>{validate ? <InlineLoading /> : null}</span>
          </span>
          {wardList?.length ? (
            <Button
              kind="ghost"
              renderIcon={(props) => <Add size={16} {...props} />}
              onClick={() => setAddWardModal(true)}
            >
              {t("createWard", "Create Ward")}
            </Button>
          ) : null}
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
              {rows.length === 0 ? (
                <div className={styles.tileContainer}>
                  <Tile className={styles.tile}>
                    <div className={styles.tileContent}>
                      <p className={styles.content}>
                        {t("No data", "No data to display")}
                      </p>
                      <p className={styles.helper}>
                        {t("checkFilters", "Check the filters above")}
                      </p>
                    </div>
                    <p className={styles.separator}>{t("or", "or")}</p>
                    <Button
                      kind="ghost"
                      size="sm"
                      renderIcon={(props) => <Add size={16} {...props} />}
                      onClick={() => setAddWardModal(true)}
                    >
                      {t("createWard", "Create Ward")}
                    </Button>
                  </Tile>
                </div>
              ) : null}
              <Pagination
                page={currentPage}
                pageSize={pageSize}
                pageSizes={[10, 20, 30, 40, 50]}
                totalItems={wardList.length}
                onChange={({ page, pageSize }) => {
                  setCurrentPage(page);
                  pageSize(pageSize);
                }}
              />
            </TableContainer>
          )}
        </DataTable>
      </div>
    </>
  );
};
export default WardAdministrationTable;
