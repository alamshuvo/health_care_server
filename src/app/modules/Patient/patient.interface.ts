import { BloodGroup, Gender, martialStatus } from "@prisma/client";

export type IPatientFilterRequest = {
  searchTerm?: string | undefined;
  email?: string | undefined;
  contactNo?: string | undefined;
};
type IPatientHealthData = {
  gender: Gender;
  dateOfBirth: string;
  height: number;
  weight: number;
  bloodGroup: BloodGroup;
  hasAllergies?: boolean;
  hasDiabetes?: boolean;
  smokingStatus?: boolean;
  dietaryPreferences?: string;
  pregencyStatus?: boolean;
  mentalHealthHistory?: string;
  immunizationStatus?: string;
  hasPastSurgeries?: boolean;
  recentAnxiety?: boolean;
  recentDepression?: boolean;
  maritalStatus?: martialStatus;
};
type IMedicalReport = {
  reportName: string;
  reportLink: string;
};
export type IPatientUpdate = {
  name: string;
  contactNumber: string;
  address: string;
  patientHealthData: IPatientHealthData;
  medicalReport: IMedicalReport;
};
