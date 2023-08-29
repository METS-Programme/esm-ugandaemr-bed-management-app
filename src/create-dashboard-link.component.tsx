import React, { useMemo } from "react";
import last from "lodash-es/last";
import { ConfigurableLink } from "@openmrs/esm-framework";
import { BrowserRouter, useLocation } from "react-router-dom";

export interface DashboardLinkConfig {
  name: string;
  title: string;
  slot?: string;
}

function DashboardExtension({
  dashboardLinkConfig,
}: {
  dashboardLinkConfig: DashboardLinkConfig;
}) {
  const { name, title } = dashboardLinkConfig;
  const location = useLocation();

  let navLink = useMemo(
    () => decodeURIComponent(last(location.pathname.split("/"))),
    [location.pathname]
  );

  const isUUID = (value) => {
    const regex =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
    return regex.test(value);
  };

  if (isUUID(navLink)) {
    navLink = "home";
  }

  const activeClassName =
    name === navLink || (isUUID(navLink) && name === "home")
      ? "active-left-nav-link"
      : "";

  return (
    <div className={activeClassName}>
      <ConfigurableLink
        to={`${window.getOpenmrsSpaBase()}bed-management${
          name ? `/${name}` : ""
        }`}
        className={`cds--side-nav__link ${
          name === navLink && "active-left-nav-link"
        }`}
      >
        {title}
      </ConfigurableLink>
    </div>
  );
}

export const createDashboardLink =
  (dashboardLinkConfig: DashboardLinkConfig) => () =>
    (
      <BrowserRouter>
        <DashboardExtension dashboardLinkConfig={dashboardLinkConfig} />
      </BrowserRouter>
    );
