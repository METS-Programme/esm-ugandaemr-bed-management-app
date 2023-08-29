import React from "react";
import { useTranslation } from "react-i18next";
import BedManagementHeader from "../bed-management-header/bed-management-header.component";
import BedManagementSummary from "../bed-management-summary/summary.component";
import styles from "./bed-management-dashboard.scss";

export default function BedManagementDashboard() {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <BedManagementHeader route={t("home", "Home")} />
      <BedManagementSummary />
    </div>
  );
}
