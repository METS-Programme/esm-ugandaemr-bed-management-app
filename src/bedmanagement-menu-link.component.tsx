import React from "react";
import { useTranslation } from "react-i18next";
import { Layer, ClickableTile } from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";

export default function BedManagementMenuLink() {
  const { t } = useTranslation();
  return (
    <Layer>
      <ClickableTile
        href={`${window.spaBase}/bedmanagement`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>
          <div className="heading">{t("manageBed", "Manage Beds")}</div>
          <div className="content">{t("bedManagement", "Bed Management")}</div>
        </div>
        <div className="iconWrapper">
          <ArrowRight size={16} />
        </div>
      </ClickableTile>
    </Layer>
  );
}
