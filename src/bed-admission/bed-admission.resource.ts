import { FetchResponse, openmrsFetch, useConfig } from "@openmrs/esm-framework";
import { useMemo } from "react";
import useSWR from "swr";

export async function assignPatientBed(
  requestPayload,
  bedId
): Promise<FetchResponse> {
  const abortController = new AbortController();
  abortController.abort();
  const response: FetchResponse = await openmrsFetch(
    `/ws/rest/v1/beds/${bedId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestPayload,
    }
  );
  return response;
}

export async function endPatientQueue(
  queueStatus,
  queueUuid
): Promise<FetchResponse> {
  const abortController = new AbortController();
  abortController.abort();
  const response: FetchResponse = await openmrsFetch(
    `/ws/rest/v1/patientqueue/${queueUuid}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: queueStatus,
    }
  );
  return response;
}

export function findLatestClinicalEncounter(
  patientUuid: string,
  encounterTypeUuid: string,
  data,
  admissionFormUuid
) {
  const clinicalEncounters =
    data?.data?.results?.filter(
      (enc) => enc?.form?.uuid === admissionFormUuid
    ) ?? [];
  const encounterUuid = clinicalEncounters?.[0]?.uuid ?? "";

  return { data: encounterUuid };
}
