// apps/web/__tests__/ramadan.test.ts
import { computeScore, getCurrentDayNumber, canEditLog } from "../lib/ramadan";
import type { GroupSettings } from "@shared/types";

const baseSettings: GroupSettings = {
  id: "test",
  groupId: "group1",
  ramadanStartDate: "2025-03-01T00:00:00Z",
  numDays: 30,
  timezone: "Africa/Cairo",
  resetRule: "MIDNIGHT",
  editCutoffHour: 3,
  taraweehCap: 11,
  tahajjudCap: 11,
  quranPagesCap: 20,
  pointsWeightTaraweeh: 1.0,
  pointsWeightTahajjud: 1.0,
  pointsWeightQuran: 1.0,
  allowSpectatorLink: false,
};

describe("computeScore", () => {
  it("sums all three fields", () => {
    const score = computeScore(8, 4, 15, baseSettings);
    expect(score).toBe(27);
  });

  it("caps taraweeh at taraweehCap", () => {
    const score = computeScore(15, 0, 0, baseSettings);
    expect(score).toBe(11); // capped
  });

  it("caps quran pages at quranPagesCap", () => {
    const score = computeScore(0, 0, 25, baseSettings);
    expect(score).toBe(20); // capped at 20
  });

  it("returns 0 for all zeros", () => {
    const score = computeScore(0, 0, 0, baseSettings);
    expect(score).toBe(0);
  });

  it("applies weights correctly", () => {
    const weightedSettings = { ...baseSettings, pointsWeightTaraweeh: 2.0 };
    const score = computeScore(5, 0, 0, weightedSettings);
    expect(score).toBe(10);
  });
});

describe("getCurrentDayNumber", () => {
  it("returns null before Ramadan starts", () => {
    const futureSettings = {
      ...baseSettings,
      ramadanStartDate: "2030-03-01T00:00:00Z",
    };
    const day = getCurrentDayNumber(futureSettings);
    expect(day).toBeNull();
  });

  it("returns null after Ramadan ends", () => {
    const pastSettings = {
      ...baseSettings,
      ramadanStartDate: "2020-03-01T00:00:00Z",
    };
    const day = getCurrentDayNumber(pastSettings);
    expect(day).toBeNull();
  });
});

describe("canEditLog", () => {
  it("allows admin override always", () => {
    const result = canEditLog(1, baseSettings, true);
    expect(result).toBe(true);
  });
});
