import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@carbon/react";
import React from "react";
import styles from "./bed-admission-tabs-styles.scss";
import { useTranslation } from "react-i18next";
import ActivePatientsTable from "./active-patients/active-patients-table.component";
import AdmittedPatientsList from "./admitted-patients/admitted-patients.component";
import DischargedPatientsList from "./discharged-patients/discharged-patients.componet";

const BedAdmissionTabs: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Tabs>
        <TabList contained fullWidth className={styles.tabsContainer}>
          <Tab className={styles.tab}>{t("toAdmit", "To Admit")}</Tab>
          <Tab className={styles.tab}>{t("admitted", "Admitted")}</Tab>
          <Tab className={styles.tab}>
            {t("discharged", "Discharged")}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ActivePatientsTable status="pending" />
          </TabPanel>
          <TabPanel>
            <AdmittedPatientsList />
          </TabPanel>
          <TabPanel>
            <DischargedPatientsList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default BedAdmissionTabs;
