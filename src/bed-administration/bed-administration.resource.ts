import useSWR from "swr";
import { FetchResponse, openmrsFetch } from "@openmrs/esm-framework";
import { useMemo } from "react";

interface BedForm {
  bedNumber: string;
  bedType: string;
  row: number;
  column: number;
  status: string;
  locationUuid: string;
}

export async function saveBed({ bedObject }): Promise<FetchResponse<BedForm>> {
  const response: FetchResponse = await openmrsFetch(`/ws/rest/v1/bed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: bedObject,
  });
  return response;
}

export function useBedType() {
  const locationsUrl = `/ws/rest/v1/bedtype`;
  const { data, error, isLoading } = useSWR<{ data }>(
    locationsUrl,
    openmrsFetch
  );

  const bedTypes = useMemo(
    () => data?.data?.results?.map((response) => response) ?? [],
    [data?.data?.results]
  );
  return { bedTypes: bedTypes ? bedTypes : [], isLoading, error };
}