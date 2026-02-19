// apps/web/lib/leaderboard.ts
import { prisma } from "./prisma";
import type { LeaderboardEntry, GroupSettings } from "@shared/types";
import { computeScore } from "./ramadan";

export async function computeOverallLeaderboard(
  groupId: string,
  settings: GroupSettings
): Promise<LeaderboardEntry[]> {
  const logs = await prisma.dailyLog.findMany({
    where: { groupId },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  });

  const userMap = new Map<
    string,
    {
      userId: string;
      userName: string;
      avatarUrl: string | null;
      taraweehTotal: number;
      tahajjudTotal: number;
      quranPagesTotal: number;
      totalPoints: number;
      daysLogged: number;
      lastUpdated: string | null;
    }
  >();

  for (const log of logs) {
    const existing = userMap.get(log.userId) || {
      userId: log.userId,
      userName: log.user.name,
      avatarUrl: log.user.avatarUrl,
      taraweehTotal: 0,
      tahajjudTotal: 0,
      quranPagesTotal: 0,
      totalPoints: 0,
      daysLogged: 0,
      lastUpdated: null,
    };

    existing.taraweehTotal += log.taraweehRakaat;
    existing.tahajjudTotal += log.tahajjudRakaat;
    existing.quranPagesTotal += log.quranPages;
    existing.totalPoints += computeScore(
      log.taraweehRakaat,
      log.tahajjudRakaat,
      log.quranPages,
      settings
    );
    existing.daysLogged += 1;
    const updatedAt = log.updatedAt.toISOString();
    if (!existing.lastUpdated || updatedAt > existing.lastUpdated) {
      existing.lastUpdated = updatedAt;
    }

    userMap.set(log.userId, existing);
  }

  const entries = Array.from(userMap.values());

  // Sort: totalPoints -> quranPagesTotal -> taraweehTotal -> earliest lastUpdated
  entries.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.quranPagesTotal !== a.quranPagesTotal)
      return b.quranPagesTotal - a.quranPagesTotal;
    if (b.taraweehTotal !== a.taraweehTotal)
      return b.taraweehTotal - a.taraweehTotal;
    if (a.lastUpdated && b.lastUpdated) {
      return a.lastUpdated.localeCompare(b.lastUpdated); // earliest wins
    }
    return 0;
  });

  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}

export async function computeDailyLeaderboard(
  groupId: string,
  dayNumber: number,
  settings: GroupSettings
): Promise<LeaderboardEntry[]> {
  const logs = await prisma.dailyLog.findMany({
    where: { groupId, dayNumber },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  });

  const entries: LeaderboardEntry[] = logs
    .map((log) => ({
      rank: 0,
      userId: log.userId,
      userName: log.user.name,
      avatarUrl: log.user.avatarUrl,
      taraweehTotal: log.taraweehRakaat,
      tahajjudTotal: log.tahajjudRakaat,
      quranPagesTotal: log.quranPages,
      totalPoints: computeScore(
        log.taraweehRakaat,
        log.tahajjudRakaat,
        log.quranPages,
        settings
      ),
      daysLogged: 1,
      lastUpdated: log.updatedAt.toISOString(),
    }))
    .sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.quranPagesTotal !== a.quranPagesTotal)
        return b.quranPagesTotal - a.quranPagesTotal;
      if (b.taraweehTotal !== a.taraweehTotal)
        return b.taraweehTotal - a.taraweehTotal;
      if (a.lastUpdated && b.lastUpdated)
        return a.lastUpdated.localeCompare(b.lastUpdated);
      return 0;
    });

  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}
