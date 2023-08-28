import {
  getAsyncLifecycle,
  defineConfigSchema,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createDashboardLink } from "./create-dashboard-link.component";
import { dashboardMeta } from "./dashboard.meta";

const moduleName = "@ugandaemr/esm-bed-management-app";

const options = {
  featureName: "esm-bed-management-app",
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

export const bedManagement = getAsyncLifecycle(
  () => import("./root.component"),
  options
);

export const bedManagementAdminCardLink = getAsyncLifecycle(
  () => import("./bed-management-admin-card-link.component"),
  options
);

export const bedManagementSummary = getAsyncLifecycle(
  () => import("./bed-management-summary/summary.component"),
  options
);

export const bedHomeDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...dashboardMeta }),
  options
);

export const bedManagementDashboard = getAsyncLifecycle(
  () => import("./dashboard/bed-management-dashboard.component"),
  options
);
