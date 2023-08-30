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

export const adminCardLink = getAsyncLifecycle(
  () => import("./admin-card-link.component"),
  options
);

export const adminDashboardLink = getSyncLifecycle(
  createDashboardLink({
    name: "administration",
    title: "Ward Allocation",
  }),
  options
);

export const homeDashboardLink = getSyncLifecycle(
  createDashboardLink({
    name: "summary",
    title: "Summary",
  }),
  options
);
