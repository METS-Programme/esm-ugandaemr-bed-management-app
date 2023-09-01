import useSWR from "swr";
import { openmrsFetch } from "@openmrs/esm-framework";
import { LOCATION_TAG_UUID } from "../constants";
import { useMemo } from "react";

type MappedBedData = Array<{
  id: number;
  number: string;
  name: string;
  description: string;
  status: string;
}>;

export const useLocationsByTag = (locationUuid: string) => {
  const locationsUrl = `/ws/rest/v1/location?tag=${locationUuid}&v=full`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data },
    Error
  >(locationUuid ? locationsUrl : null, openmrsFetch);

  return {
    data: data?.data?.results ?? [],
    error,
    isLoading,
    isValidating,
    mutate,
  };
};

export const getBedsForLocation = (locationUuid: string) => {
  const locationsUrl = `/ws/rest/v1/bed?locationUuid=${locationUuid}`;

  return openmrsFetch(locationsUrl, {
    method: "GET",
  }).then((res) => res?.data?.results ?? []);
};

export const useBedsForLocation = (locationUuid: string) => {
  const apiUrl = `/ws/rest/v1/bed?locationUuid=${locationUuid}&v=full`;

  const { data, isLoading, error } = useSWR<{ data }, Error>(
    locationUuid ? apiUrl : null,
    openmrsFetch
  );

  const mappedBedData: MappedBedData = (data?.data?.results ?? []).map(
    (bed) => ({
      id: bed.id,
      number: bed.bedNumber,
      name: bed.bedType?.displayName,
      description: bed.bedType?.description,
      status: bed.status,
    })
  );

  return {
    bedData: mappedBedData,
    isLoading,
    error,
  };
};

export const useLocationName = (locationUuid: string) => {
  const apiUrl = `/ws/rest/v1/location/${locationUuid}`;

  const { data, isLoading } = useSWR<{ data }, Error>(
    locationUuid ? apiUrl : null,
    openmrsFetch
  );

  return {
    name: data?.data?.display ?? null,
    isLoadingLocationData: isLoading,
  };
};

export const findBedByLocation = (locationUuid: string) => {
  const locationsUrl = `/ws/rest/v1/bed?locationUuid=${locationUuid}`;
  return openmrsFetch(locationsUrl, {
    method: "GET",
  });
};

export function useBedLocations() {
  const locationsUrl = `/ws/rest/v1/bed?locationUuid=${LOCATION_TAG_UUID}`;
  const { data, error, isLoading } = useSWR<{ data }>(
    locationsUrl,
    openmrsFetch
  );

  const bedLocations = useMemo(
    () => data?.data?.results?.map((response) => response.resource) ?? [],
    [data?.data?.results]
  );
  return { bedLocations: bedLocations ? bedLocations : [], isLoading, error };
}

export const useWards = (locationUuid: string) => {
  const locationsUrl = `/ws/rest/v1/location?tag=${locationUuid}&v=full`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data },
    Error
  >(locationUuid ? locationsUrl : null, openmrsFetch);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
