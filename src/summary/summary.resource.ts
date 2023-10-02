import useSWR from "swr";
import { openmrsFetch } from "@openmrs/esm-framework";
import type { AdmissionLocation, Bed, MappedBedData } from "../types";

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

  const { data, isLoading, error } = useSWR<
    { data: { results: Array<Bed> } },
    Error
  >(locationUuid ? apiUrl : null, openmrsFetch);

  const mappedBedData: MappedBedData = (data?.data?.results ?? []).map(
    (bed) => ({
      id: bed.id,
      number: bed.bedNumber,
      name: bed.bedType?.displayName,
      description: bed.bedType?.description,
      status: bed.status,
      uuid: bed.uuid,
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

export const useAdmissionLocations = () => {
  const locationsUrl = `/ws/rest/v1/admissionLocation?v=full`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: { results: Array<AdmissionLocation> } },
    Error
  >(locationsUrl, openmrsFetch);

  return {
    data: data?.data?.results ?? [],
    error,
    isLoading,
    isValidating,
    mutate,
  };
};

export const useAdmissionLocationBedLayout = (locationUuid: string) => {
  const locationsUrl = `/ws/rest/v1/admissionLocation/${locationUuid}?v=full`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data: AdmissionLocation },
    Error
  >(locationsUrl, openmrsFetch);

  return {
    data: data?.data?.bedLayouts ?? [],
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
