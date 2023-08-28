import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";
// import { routes } from "../constants";

interface BedManagementNavLinkProps {
  page?: string;
  title: string;
}

export default function BedManagementNavLink({
  page,
  title,
}: BedManagementNavLinkProps) {
  return (
    <div key={page}>
      <ConfigurableLink
        to={
          "${openmrsSpaBase}/" +
          "routes.offlineToolsl" +
          (page ? `/${page}` : "")
        }
        className="cds--side-nav__link"
      >
        {title}
      </ConfigurableLink>
    </div>
  );
}
