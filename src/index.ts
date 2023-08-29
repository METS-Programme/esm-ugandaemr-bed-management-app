import {
  getAsyncLifecycle,
  defineConfigSchema,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createDashboardLink } from "./create-dashboard-link.component";

const moduleName = "@ugandaemr/esm-bed-management-app";

const options = {
  featureName: "bed-management",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getAsyncLifecycle(
  () => import("./root.component"),
  options
);

export const bedLocation = getAsyncLifecycle(
  () => import("./bed-location/bed-location.component"),
  options
);

export const bedManagementNavItems = getAsyncLifecycle(
  () => import("./side-nav/bed-management-nav-link.component"),
  {
    featureName: "bed-management-nav-items",
    moduleName,
  }
);

export const bedManagementAdminCardLink = getAsyncLifecycle(
  () => import("./bed-management-admin-card-link.component"),
  options
);

export const sideNavMenu = getAsyncLifecycle(
  () => import("./side-nav/side-nav.component"),
  options
);

export const bedManagementDashboard = getAsyncLifecycle(
  () => import("./dashboard/bed-management-dashboard.component"),
  options
);

export const homeDashboardLink = getSyncLifecycle(
  createDashboardLink({
    name: "home",
    title: "Home",
  }),
  options
);

export const bedAdministrationDashboardLink = getSyncLifecycle(
  createDashboardLink({
    name: "administration",
    title: "Administration",
  }),
  options
);

export const bedManagementSummary = getAsyncLifecycle(
  () => import("./bed-management-summary/summary.component"),
  options
);
