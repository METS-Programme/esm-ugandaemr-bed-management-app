import React from "react";
import { ExtensionSlot } from "@openmrs/esm-framework";
import NavLink from "./nav-link.component";

const BedManagementNavMenu: React.FC = () => {
  return (
    <>
      <NavLink title="Home" />
      <ExtensionSlot name="bed-management-sidebar-slot" />
    </>
  );
};

export default BedManagementNavMenu;
