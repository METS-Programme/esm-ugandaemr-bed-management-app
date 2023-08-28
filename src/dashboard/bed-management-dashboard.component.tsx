import React from "react";
import BedManagementHeader from "../bed-management-header/bed-management-header.component";
import BedManagementSummary from "../bed-management-summary/summary.component";
import styles from "./bed-management-dashboard.scss";

export default function BedManagementDashboard() {
  return (
    <div className={styles.container}>
      <BedManagementHeader />
      <BedManagementSummary />
    </div>
  );
}
