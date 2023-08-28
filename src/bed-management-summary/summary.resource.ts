import useSWR from "swr";

import { openmrsFetch } from "@openmrs/esm-framework";

export const customRepresentation = `full`;

export const findBedByLocation = (locationUuid: string) => {
  const locationsUrl = `/ws/rest/v1/bed?locationUuid=${locationUuid}`;
  return openmrsFetch(locationsUrl, {
    method: "GET",
  });
};

export const useWards = (locationUuid: string) => {
  const locationsUrl = `/ws/rest/v1/location?tag=${locationUuid}&v=${customRepresentation}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    { data },
    Error
  >(locationUuid ? locationsUrl : null, openmrsFetch);

  return {
    data,
    isError: error,
    isLoading,
    isValidating,
    mutateEnrollments: mutate,
  };
};
