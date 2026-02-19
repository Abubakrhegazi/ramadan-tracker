// packages/shared/types/index.ts

export type Role = "ADMIN" | "MEMBER";
export type ResetRule = "MIDNIGHT" | "MAGHRIB";
export type ActionType =
  | "LOG_CREATE"
  | "LOG_UPDATE"
  | "LOG_DELETE"
  | "LOG_ADMIN_OVERRIDE"
  | "DAY_LOCK"
  | "DAY_UNLOCK"
  | "MEMBER_KICK"
  | "MEMBER_ROLE_CHANGE"
  | "SETTINGS_UPDATE"
  | "INVITE_REGENERATE";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  slug: string;
  inviteCode: string;
  logoUrl?: string | null;
  settings?: GroupSettings | null;
  createdAt: string;
}

export interface GroupSettings {
  id: string;
  groupId: string;
  ramadanStartDate: string;
  numDays: number;
  timezone: string;
  resetRule: ResetRule;
  editCutoffHour: number;
  taraweehCap: number;
  tahajjudCap: number;
  quranPagesCap: number;
  pointsWeightTaraweeh: number;
  pointsWeightTahajjud: number;
  pointsWeightQuran: number;
  allowSpectatorLink: boolean;
}

export interface GroupMembership {
  id: string;
  userId: string;
  groupId: string;
  role: Role;
  joinedAt: string;
  user: Pick<User, "id" | "name" | "avatarUrl" | "email">;
}

export interface DailyLog {
  id: string;
  userId: string;
  groupId: string;
  dayNumber: number;
  taraweehRakaat: number;
  tahajjudRakaat: number;
  quranPages: number;
  notes?: string | null;
  updatedAt: string;
  user?: Pick<User, "id" | "name" | "avatarUrl">;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatarUrl?: string | null;
  taraweehTotal: number;
  tahajjudTotal: number;
  quranPagesTotal: number;
  totalPoints: number;
  daysLogged: number;
  lastUpdated?: string | null;
}

export interface DayInfo {
  dayNumber: number;
  date: string; // ISO date string
  isToday: boolean;
  isLocked: boolean;
  canEdit: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}
