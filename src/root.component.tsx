import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import BedManagementDashboard from "./dashboard/bed-management-dashboard.component";
import BedLocation from "./bed-location/bed-location.component";
import styles from "./root.scss";

const Root: React.FC = () => {
  return (
    <main className={styles.container}>
      <BrowserRouter basename={window.getOpenmrsSpaBase()}>
        <Routes>
          <Route path="bed-management" element={<BedManagementDashboard />} />
          <Route path="bed-management/:location" element={<BedLocation />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
};

export default Root;
