import React, { useEffect, useState } from "react";
import { InlineLoading } from "@carbon/react";
import { findBedByLocation, useWards } from "./summary.resource";
import { LOCATION_TAG_UUID } from "../constants";
import type { Location } from "../types";
import ActiveBedSummary from "./active-beds.component";
import Header from "./header.component";
import InactiveBedSummary from "./inactive-beds.component";
import styles from "./summary.scss";

const BedManagementSummary: React.FC = () => {
  const [wardsGroupedByLocations, setWardsGroupedByLocation] = useState(
    Array<Location>
  );

  const { data, isLoading } = useWards(LOCATION_TAG_UUID);
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

  const wardsWithBeds = wardsGroupedByLocations.filter(
    (wards) => wards.beds.length > 0
  );

  let wardsWithRetiredBeds = [];

  if (wardsWithBeds.length) {
    wardsWithRetiredBeds = wardsWithBeds.map((ward) => ({
      ...ward,
      retiredBeds: ward.beds.filter((bed) => bed.status !== "AVAILABLE"),
    }));
  }

  return (
    <div style={{ marginLeft: "16rem" }}>
      <section className={styles.inactiveMain}>
        <Header title="Active" />
        <div className={styles.container}>
          <div className={styles.section}>
            {!wardsGroupedByLocations.length ? (
              <span className={styles.sectionLoader}>
                <InlineLoading />{" "}
              </span>
            ) : (
              wardsGroupedByLocations.map((ward) => {
                return <ActiveBedSummary ward={ward} />;
              })
            )}
          </div>
        </div>
      </section>
      <section>
        <Header title="Inactive" />
        <div className={styles.container}>
          <div className={styles.section}>
            {!wardsWithRetiredBeds.length ? (
              <InlineLoading />
            ) : (
              wardsWithRetiredBeds.map((ward) => {
                return <InactiveBedSummary ward={ward} />;
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BedManagementSummary;
