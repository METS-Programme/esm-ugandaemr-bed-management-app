import React from "react";
import BedManagementHeader from "./bed-management-header/bed-management-header.component";
import BedManagementSummary from "./bed-management-summary/summary.component";
import styles from "./home.scss";

const Home: React.FC = () => {
  return (
    <section className={styles.section}>
      <BedManagementHeader route="Home" />
      <BedManagementSummary />
    </section>
  );
};

export default Home;
