import React from "react";
import AdmittedPatientsTable from "./admitted-patients-table.component";
interface AdmittedPatientsListProps {
  status: string;
  setPatientCount: (value: number) => void;
}

const AdmittedPatientsList: React.FC<AdmittedPatientsListProps> = ({
  status,
  setPatientCount,
}) => {
  return (
    <>
      <AdmittedPatientsTable
        status={status}
        setPatientCount={setPatientCount}
      />
    </>
  );
};

export default AdmittedPatientsList;
