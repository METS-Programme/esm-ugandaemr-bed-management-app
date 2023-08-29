import React from "react";
import {
  useLayoutType,
  isDesktop,
  ExtensionSlot,
} from "@openmrs/esm-framework";
import styles from "./bed-management-dashboard.scss";

export default function BedManagementDashboard() {
  const layout = useLayoutType();

  return (
    <section className={isDesktop(layout) && styles.dashboardContainer}>
      <>
        {isDesktop(layout) && (
          <ExtensionSlot name="bed-management-sidebar-slot" key={layout} />
        )}
        <ExtensionSlot name="bed-management-dashboard-slot" />
      </>
    </section>
  );
}
