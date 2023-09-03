import React, { useEffect, useState } from "react";
import { DataTableSkeleton } from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";
import { getBedsForLocation, useLocationsByTag } from "./summary.resource";
import { useTranslation } from "react-i18next";
import { ConfigurableLink, useConfig } from "@openmrs/esm-framework";
import EmptyState from "../empty-state/empty-state.component";
import WardCard from "../ward-card/ward-card.component";
import styles from "./summary.scss";

const Summary: React.FC = () => {
  const { t } = useTranslation();
  const { admissionLocationTagUuid } = useConfig();

  const [bedsForLocation, setBedsForLocation] = useState([]);
  const [isLoadingBedData, setIsLoadingBedData] = useState(true);
  const { data, isLoading } = useLocationsByTag(admissionLocationTagUuid);

  useEffect(() => {
    if (!isLoading && data) {
      const fetchData = async () => {
        const promises = data.map(async (ward) => {
          try {
            const bedData = await getBedsForLocation(ward.uuid);
            return {
              ...ward,
              beds: bedData,
            };
          } catch (error) {
            return {
              ...ward,
              beds: [],
            };
          }
        });

        const bedsForLocation = await Promise.all(promises);
        setBedsForLocation(bedsForLocation);
        setIsLoadingBedData(false);
      };

      fetchData();
    }
  }, [data, isLoading]);

  if (isLoadingBedData) {
    return (
      <div className={styles.loader}>
        <DataTableSkeleton role="progressbar" zebra />
      </div>
    );
  }

  if (bedsForLocation?.length) {
    return (
      <div className={styles.cardContainer}>
        {bedsForLocation.map((locationWithBeds) => {
          const routeSegment = `${window.getOpenmrsSpaBase()}bed-management/location/${
            locationWithBeds.uuid
          }`;

          return (
            <WardCard
              headerLabel={locationWithBeds.display}
              label={t("beds", "Beds")}
              value={locationWithBeds?.beds?.length}
            >
              {locationWithBeds?.beds?.length ? (
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

  if (!isLoadingBedData && bedsForLocation?.length === 0) {
    return <EmptyState msg="No data to display" helper={""} />;
  }
};

export default Summary;
