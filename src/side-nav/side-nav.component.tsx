import React, { useEffect } from "react";
import {
  attach,
  detach,
  ExtensionSlot,
  isDesktop,
  useLayoutType,
} from "@openmrs/esm-framework";
import { SideNav } from "@carbon/react";
import styles from "./side-nav.scss";

const DesktopSideNav: React.FC = () => {
  const layout = useLayoutType();

  useEffect(() => {
    attach("nav-menu-slot", "bed-management-nav-menu-slot");
    return () => detach("nav-menu-slot", "bed-management-nav-menu-slot");
  }, []);

  return (
    isDesktop(layout) && (
      <SideNav expanded aria-label="Menu" className={styles.sideNav}>
        <ExtensionSlot name="bed-management-nav-menu-slot" />
      </SideNav>
    )
  );
};

export default DesktopSideNav;
