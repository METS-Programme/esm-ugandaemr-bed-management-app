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

  const navLink = useMemo(
    () => decodeURIComponent(last(location.pathname.split("/"))),
    [location.pathname]
  );

  const activeClassName =
    name === navLink ? "active-left-nav-link" : "non-active";

  return (
    <div className={activeClassName}>
      <ConfigurableLink
        to={`${window.getOpenmrsSpaBase()}bed-management/${name}`}
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
