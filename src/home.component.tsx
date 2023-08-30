import React from "react";
import Header from "./header/header.component";
import BedManagementSummary from "./summary/summary.component";
import styles from "./home.scss";

const Home: React.FC = () => {
  return (
    <section className={styles.section}>
      <Header route="Summary" />
      <BedManagementSummary />
    </section>
  );
};

export default Home;
