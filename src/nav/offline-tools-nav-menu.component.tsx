import React from "react";
import { useTranslation } from "react-i18next";
import BedManagementNavLink from "./bed-management-nav-link.component";

const OfflineToolsNavMenu: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <BedManagementNavLink title={t("home", "Home")} />
    </>
  );
};

export default OfflineToolsNavMenu;
