import React from "react";
import ActivePatientsTable from "./active-patients-table.component";
import Header from "../../header/header.component";
import styles from "./styles.scss";

const ActivePatientsHome: React.FC = () => {
  return (
    <section className={styles.section}>
      <Header route="Admission" />
      <ActivePatientsTable status="pending" />
    </section>
  );
};

export default ActivePatientsHome;
