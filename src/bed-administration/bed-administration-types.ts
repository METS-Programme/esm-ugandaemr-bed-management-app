export interface BedAdministrationData {
  bedId: string;
  description: string;
  bedRow: string;
  bedColumn: string;
  location: {
    display: string;
    uuid: string;
  };
  occupancyStatus: string;
  bedType: string;
}
