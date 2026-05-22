export interface PetInfo {
  type: "cat" | "dog";
  name: string;
  breed: string;
  ageYears: number;
  ageMonths: number;
  weight: number;
  weightUnit: "lbs" | "kg";
  gender: "male" | "female";
  neutered: boolean;
}

export interface PersonalityInfo {
  activityLevel: number; // 1–5
  traits: string[];
  feedingSchedule: string;
  healthConditions: string;
  environment: "indoor" | "outdoor" | "mixed";
}

export interface OwnerInfo {
  experience: "first-time" | "some" | "experienced";
  livingSituation: "apartment" | "house-yard" | "house-no-yard";
  hoursHome: number;
  goals: string[];
}

export interface FormData {
  pet: PetInfo;
  personality: PersonalityInfo;
  owner: OwnerInfo;
}

export interface GuideSection {
  icon: string;
  title: string;
  summary: string;
  content: string;
  tips: string[];
}

export interface Guide {
  id: string;
  petName: string;
  petType: "cat" | "dog";
  sections: GuideSection[];
  isPaid: boolean;
  createdAt: number;
}
