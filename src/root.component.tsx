import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { setLeftNav, unsetLeftNav } from "@openmrs/esm-framework";
import BedAdminstration from "./bed-administration/bed-administration-table.component";
import BedLocation from "./bed-location/bed-location.component";
import Home from "./home.component";
import SideMenu from "./side-nav/side-nav.component";
import styles from "./root.scss";

const Root: React.FC = () => {
  const spaBasePath = window.spaBase;

  useEffect(() => {
    setLeftNav({
      name: "bed-management-nav-menu-slot",
      basePath: spaBasePath,
    });
    return () => unsetLeftNav("bed-management-nav-menu-slot");
  }, [spaBasePath]);

  return (
    <BrowserRouter basename={`${window.getOpenmrsSpaBase()}bed-management`}>
      <SideMenu />
      <main className={styles.container}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/location/:location" element={<BedLocation />} />
          <Route path="/administration" element={<BedAdminstration />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default Root;
