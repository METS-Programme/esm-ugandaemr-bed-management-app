import {
  attach,
  detach,
  ExtensionSlot,
  isDesktop,
  useLayoutType,
} from "@openmrs/esm-framework";
import { SideNav } from "@carbon/react";
import React, { useEffect } from "react";
import styles from "./desktop-side-nav.scss";

const DesktopSideNav: React.FC = () => {
  const layout = useLayoutType();

  useEffect(() => {
    attach("nav-menu-slot", "bed-management-nav-menu-slot");
    return () => detach("nav-menu-slot", "bed-management-nav-menu-slot");
  }, []);

  return (
    isDesktop(layout) && (
      <SideNav
        expanded
        aria-label="Bed management side menu"
        className={styles.link}
      >
        <ExtensionSlot name="bed-management-nav-menu-slot" />
      </SideNav>
    )
  );
};

export default DesktopSideNav;
