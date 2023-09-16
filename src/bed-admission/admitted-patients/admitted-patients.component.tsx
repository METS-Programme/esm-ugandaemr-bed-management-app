import React from "react";
import ActivePatientsTable from "../active-patients/active-patients-table.component";

const AdmittedPatientsList: React.FC = () => {
  return (
    <>
      <ActivePatientsTable status="active" />
    </>
  );
};

export default AdmittedPatientsList;
