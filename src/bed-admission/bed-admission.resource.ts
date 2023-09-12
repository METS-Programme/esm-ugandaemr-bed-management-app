import { FetchResponse, openmrsFetch } from "@openmrs/esm-framework";

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
      signal: abortController.signal,
    }
  );
  return response;
}
