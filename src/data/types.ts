// src/data/types.ts
export type Role = "EMPLOYEE" | "APPROVER" | "ADMIN";
export type AreaKey = "kasse" | "reparation" | "returemballage" | "pda";

export type AuthUser = {
  id: string;
  payrollNumber: string;
  role: Role;
};

export type Guide = {
  id: string;
  area: AreaKey;
  title: string;
  slug: string;
  shortDescription: string;
  tags: string[];
};

export type GuideVersion = {
  id: string;
  guideId: string;
  versionNumber: number;
  updatedAt: string;
  quickAnswer: string;
  steps: string[];
  troubleshooting: string[];
  escalation: string[];
};

export type GuideWithVersion = Guide & { latestVersion: GuideVersion };

export type AllowlistEntry = {
  payrollNumber: string;
  role: Role;
  isApproved: boolean;
  isActivated: boolean;
};

export type UserRow = {
  id: string;
  payrollNumber: string;
  role: Role;
  passwordHash: string;
  isActive: boolean;
};

export type SessionRow = {
  token: string;
  userId: string;
  createdAt: string;
};
