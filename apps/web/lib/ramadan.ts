// apps/web/lib/ramadan.ts
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { addDays, startOfDay, format } from "date-fns";
import type { GroupSettings, DayInfo } from "@shared/types";

export function getCurrentDayNumber(settings: GroupSettings): number | null {
  const tz = settings.timezone;
  const startDate = new Date(settings.ramadanStartDate);
  const nowInTz = toZonedTime(new Date(), tz);
  const startInTz = toZonedTime(startDate, tz);

  const diffMs = nowInTz.getTime() - startInTz.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const dayNumber = diffDays + 1; // Day 1 = first day of Ramadan

  if (dayNumber < 1 || dayNumber > settings.numDays) return null;
  return dayNumber;
}

export function canEditLog(
  dayNumber: number,
  settings: GroupSettings,
  isAdminOverride = false
): boolean {
  if (isAdminOverride) return true;

  const currentDay = getCurrentDayNumber(settings);
  return currentDay === dayNumber;
}

export function getDayInfo(
  dayNumber: number,
  settings: GroupSettings,
  lockedDays: number[]
): DayInfo {
  const tz = settings.timezone;
  const startDate = new Date(settings.ramadanStartDate);
  const dayDate = addDays(startDate, dayNumber - 1);
  const currentDay = getCurrentDayNumber(settings);

  const isToday = currentDay === dayNumber;
  const isLocked = lockedDays.includes(dayNumber);
  const canEdit = !isLocked && canEditLog(dayNumber, settings);

  return {
    dayNumber,
    date: format(dayDate, "yyyy-MM-dd"),
    isToday,
    isLocked,
    canEdit,
  };
}

export function getAllDays(
  settings: GroupSettings,
  lockedDays: number[]
): DayInfo[] {
  return Array.from({ length: settings.numDays }, (_, i) =>
    getDayInfo(i + 1, settings, lockedDays)
  );
}

export function computeScore(
  taraweehRakaat: number,
  tahajjudRakaat: number,
  quranPages: number,
  settings: GroupSettings
): number {
  const t = Math.min(taraweehRakaat, settings.taraweehCap) * settings.pointsWeightTaraweeh;
  const j = Math.min(tahajjudRakaat, settings.tahajjudCap) * settings.pointsWeightTahajjud;
  const q = Math.min(quranPages, settings.quranPagesCap) * settings.pointsWeightQuran;
  return t + j + q;
}
