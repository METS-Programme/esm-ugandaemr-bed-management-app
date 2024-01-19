import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import last from "lodash-es/last";
import {
  openmrsFetch,
  useSession,
  type FetchResponse,
} from "@openmrs/esm-framework";
import { AdmissionLocation } from "../../types";

dayjs.extend(isToday);

interface VisitResponse {
  results: Array<AdmissionLocation>;
  links: Array<{ rel: "prev" | "next" }>;
  totalCount: number;
}

export interface BedPatientAssignment {
  patientUuid: string;
  age: number;
  gender: string;
  patientName: string;
  ward: string;
  bedNumber: string;
}
export function useActiveAdmissions() {
  const session = useSession();
  const sessionLocation = session?.sessionLocation?.uuid;

  const getUrl = (
    pageIndex,
    previousPageData: FetchResponse<VisitResponse>
  ) => {
    if (
      pageIndex &&
      !previousPageData?.data?.links?.some((link) => link.rel === "next")
    ) {
      return null;
    }

    const url = `/ws/rest/v1/admissionLocation?v=full`;
    const urlSearchParams = new URLSearchParams();

    if (pageIndex) {
      urlSearchParams.append("startIndex", `${pageIndex * 50}`);
    }

    return url + urlSearchParams.toString();
  };

  const {
    data,
    error,
    isLoading,
    isValidating,
    size: pageNumber,
    setSize,
    mutate,
  } = useSWRInfinite<FetchResponse<VisitResponse>, Error>(
    sessionLocation ? getUrl : null,
    openmrsFetch
  );

  useEffect(() => {
    if (
      data &&
      data?.[pageNumber - 1]?.data?.links?.some((link) => link.rel === "next")
    ) {
      setSize((currentSize) => currentSize + 1);
    }
  }, [data, pageNumber]);

  const formattedActiveVisits: any = (data: FetchResponse<VisitResponse>) => {
    const result = data
      ? data[0].data?.results?.map((wardEntry) => {
          return wardEntry.bedLayouts;
        })
      : [];

    const allBeds = [];

    result?.forEach((elemnt) => {
      elemnt.forEach((b) => {
        allBeds.push(b);
      });
    });
    const finalFinalList = allBeds
      ?.filter((b) => b.status === "OCCUPIED")
      .map((bedEntry) => {
        const patient: BedPatientAssignment = {
          patientUuid: bedEntry.patient.uuid,
          age: bedEntry.patient.person.age,
          gender: bedEntry.patient.person.gender,
          patientName: bedEntry.patient.person.preferredName.givenName
            .concat(" ")
            .concat(bedEntry.patient.person.preferredName.familyName),
          ward: bedEntry.location,
          bedNumber: bedEntry.bedNumber,
        };
        return patient;
      });
    return finalFinalList;
  };

  return {
    patientQueueEntries: formattedActiveVisits(data),
    isError: error,
    isLoading,
    isValidating,
    patientQueueCount: data?.[0]?.data?.totalCount ?? 0,
    mutate,
  };
}

export const getOriginFromPathName = (pathname = "") => {
  const from = pathname.split("/");
  return last(from);
};
