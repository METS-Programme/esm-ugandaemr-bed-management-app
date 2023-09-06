import React, { useEffect, useState } from "react";
import { DataTableSkeleton } from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";
import {
  getBedsForLocation,
  useAdmissionLocations,
  useLocationsByTag,
} from "./summary.resource";
import { useTranslation } from "react-i18next";
import { ConfigurableLink, useConfig } from "@openmrs/esm-framework";
import EmptyState from "../empty-state/empty-state.component";
import WardCard from "../ward-card/ward-card.component";
import styles from "./summary.scss";

const Summary: React.FC = () => {
  const { t } = useTranslation();
  const { data: admissionLocations, isLoading } = useAdmissionLocations();

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <DataTableSkeleton role="progressbar" zebra />
      </div>
    );
  }

  if (admissionLocations?.length) {
    return (
      <div className={styles.cardContainer}>
        {admissionLocations.map((locationWithBeds) => {
          const routeSegment = `${window.getOpenmrsSpaBase()}bed-management/location/${
            locationWithBeds.ward.uuid
          }`;

          return (
            <WardCard
              headerLabel={locationWithBeds.ward.display}
              label={t("beds", "Beds")}
              value={locationWithBeds?.totalBeds}
            >
              {locationWithBeds?.totalBeds ? (
                <div className={styles.link}>
                  <ConfigurableLink className={styles.link} to={routeSegment}>
                    {t("viewBeds", "View beds")}
                  </ConfigurableLink>
                  <ArrowRight size={16} />
                </div>
              ) : null}
            </WardCard>
          );
        })}
      </div>
    );
  }

  if (!isLoading && admissionLocations?.length === 0) {
    return <EmptyState msg="No data to display" helper={""} />;
  }
};

export default Summary;
