import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";

interface NavLinkProps {
  page?: string;
  title: string;
}

export default function NavLink({ page, title }: NavLinkProps) {
  return (
    <div key={page}>
      <ConfigurableLink
        to={`${window.getOpenmrsSpaBase()}/bed-management`}
        className="cds--side-nav__link"
      >
        {title}
      </ConfigurableLink>
    </div>
  );
}
