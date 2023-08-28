import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ConfigObject,
  formatDate,
  formatDatetime,
  useConfig,
  useLayoutType,
  isDesktop as desktopLayout,
} from '@openmrs/esm-framework';
import { findBedByLocation, useWards } from "../bed-management-summary/summary.resource";
import { LOCATION_UUID } from "../constants";
import { CardHeader, EmptyState, ErrorState } from "@openmrs/esm-patient-common-lib";
import { DataTable, TableContainer, DataTableSkeleton, TableBody, TableCell, TableHeader, TableRow, InlineLoading, TableHead, Table } from "@carbon/react";
import styles from './bed-ward-allocation-table.scss'
import { Location } from "../types";


const BedWardAllocation: React.FC = () => {
  const { t } = useTranslation();
  // const config = useConfig() as ConfigObject;
  const displayText = t('awardAllocation', 'Award Allocation');
  const headerTitle = t('awardAllocation', 'Award Allocation');
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const isDesktop = desktopLayout(layout);

  const [wardsGroupedByLocations, setWardsGroupedByLocation] = useState(
    Array<Location>
  );

  const { data, isLoading, isError, isValidating } = useWards(LOCATION_UUID);

  useEffect(() => {
    if (!isLoading && data) {
      const fetchData = async () => {
        const promises = data.data.results.map(async (ward) => {
          try {
            const bedData = await findBedByLocation(ward.uuid);
            return {
              ...ward,
              beds: bedData.data.results,
            };
          } catch (error) {
            return {
              ...ward,
              beds: [],
            };
          }
        });

        const updatedWards = await Promise.all(promises);
        setWardsGroupedByLocation(updatedWards);
      };

      fetchData();
    }
  }, [data, isLoading]);

  let results = []

  const tableHeaders = [
    {
      key: 'display',
      header: t('bedId', 'Bed ID'),
    },
    {
      key: 'location',
      header: t('location', 'Location'),
    },
    {
      key: 'occupationStatus',
      header: t('occupationStatus', 'Occupation Status'),
    },
    {
      key: 'currentStatus',
      header: t('currentStatus', 'Current Status'),
    },
    {
      key: 'actions',
      header: t('actions', 'Actions'),
    },
  ];

  if (!isLoading && data) {
    results = data.data.results
  }

  const tableRows = React.useMemo(() => {
    return wardsGroupedByLocations.map((ward) => { 
      console.log(">>>>>>>>>>>>>> wardsGroupedByLocations", ward);
           
      let status = '--';
      return {
        id: ward.uuid,
        display: ward.display,
        location: '--',
        dateEnrolled: '--',
        status,
        actions: null,
      };
    });
  }, [results, t]);

  console.log("++++++ > >>", results);
  
  

  if (isLoading) return <DataTableSkeleton role="progressbar" compact={isDesktop} zebra />;
  if (isError) return <ErrorState error={isError} headerTitle={headerTitle} />;
  if (tableRows.length) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={headerTitle}>
          <span>{isValidating ? <InlineLoading /> : null}</span>
        </CardHeader>
        <DataTable rows={tableRows} headers={tableHeaders} isSortable size={isTablet ? 'lg' : 'sm'} useZebraStyles>
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <TableContainer>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader
                        className={`${styles.productiveHeading01} ${styles.text02}`}
                        {...getHeaderProps({
                          header,
                          isSortable: header.isSortable,
                        })}
                      >
                        {header.header?.content ?? header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </div>
    );
  }
  return <EmptyState displayText={displayText} headerTitle={headerTitle} />;
};

export default BedWardAllocation;