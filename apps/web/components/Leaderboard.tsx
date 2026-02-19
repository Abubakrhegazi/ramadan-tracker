// apps/web/components/Leaderboard.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { LeaderboardEntry } from "@shared/types";

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_CLASSES = ["rank-1", "rank-2", "rank-3"];

interface Props {
  groupSlug: string;
  currentUserId: string;
  autoRefresh?: boolean;
}

export function Leaderboard({ groupSlug, currentUserId, autoRefresh = true }: Props) {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<"overall" | "daily">("overall");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/groups/${groupSlug}/leaderboard?type=${tab}`);
      if (!res.ok) return;
      const { data } = await res.json();
      setEntries(data);
      setLastUpdated(new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US"));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [groupSlug, tab, lang]);

  useEffect(() => {
    setLoading(true);
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchLeaderboard, 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard, autoRefresh]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const tabItems = [
    { key: "overall", label: t("overallRanking") },
    { key: "daily", label: t("todaysRanking") },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex bg-night-700/50 rounded-xl p-1">
        {tabItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key as any)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === item.key
              ? "bg-night-800 text-white shadow"
              : "text-white/40 hover:text-white/60"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl shimmer" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-8 text-center text-white/40">
          <div className="text-4xl mb-2">📊</div>
          <p>{t("noDataYet")}</p>
        </div>
      ) : (
        <>
          {/* Podium - top 3 */}
          {top3.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* 2nd place */}
              <div className={`card p-4 text-center ${top3[1] ? "" : "invisible"}`}>
                <div className="text-3xl mb-2">🥈</div>
                <div className="font-bold text-sm truncate">{top3[1]?.userName}</div>
                <div className="text-white/40 text-xs mt-0.5">{top3[1]?.totalPoints?.toFixed(0)} {t("pts")}</div>
              </div>
              {/* 1st place */}
              <div className="card-gold p-4 text-center border-gold-500/30 -mt-2">
                <div className="text-3xl mb-2">🥇</div>
                <div className="font-bold text-sm truncate">{top3[0]?.userName}</div>
                <div className="text-gold-400 text-xs mt-0.5 font-bold">{top3[0]?.totalPoints?.toFixed(0)} {t("pts")}</div>
              </div>
              {/* 3rd place */}
              <div className={`card p-4 text-center ${top3[2] ? "" : "invisible"}`}>
                <div className="text-3xl mb-2">🥉</div>
                <div className="font-bold text-sm truncate">{top3[2]?.userName}</div>
                <div className="text-white/40 text-xs mt-0.5">{top3[2]?.totalPoints?.toFixed(0)} {t("pts")}</div>
              </div>
            </div>
          )}

          {/* Full table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-start py-3 px-4 text-xs text-white/40 font-medium">#</th>
                    <th className="text-start py-3 px-4 text-xs text-white/40 font-medium">{t("name")}</th>
                    <th className="text-center py-3 px-3 text-xs text-white/40 font-medium">🌙</th>
                    <th className="text-center py-3 px-3 text-xs text-white/40 font-medium">⭐</th>
                    <th className="text-center py-3 px-3 text-xs text-white/40 font-medium">📖</th>
                    <th className="text-center py-3 px-4 text-xs text-gold-500/60 font-bold">{t("total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const isMe = entry.userId === currentUserId;
                    const rankClass = entry.rank <= 3 ? RANK_CLASSES[entry.rank - 1] : "";

                    return (
                      <tr
                        key={entry.userId}
                        className={`border-b border-white/5 last:border-0 transition-colors ${isMe
                          ? "bg-gold-500/5"
                          : "hover:bg-white/2"
                          }`}
                      >
                        <td className={`py-3 px-4 font-bold ${rankClass}`}>
                          {entry.rank <= 3 ? MEDALS[entry.rank - 1] : entry.rank}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${isMe ? "text-gold-400" : ""}`}>
                            {entry.userName}
                            {isMe && <span className="text-xs text-gold-400/60 ms-2">{t("me")}</span>}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center text-sm tabular-nums text-white/70">
                          {entry.taraweehTotal}
                        </td>
                        <td className="py-3 px-3 text-center text-sm tabular-nums text-white/70">
                          {entry.tahajjudTotal}
                        </td>
                        <td className="py-3 px-3 text-center text-sm tabular-nums text-white/70">
                          {entry.quranPagesTotal}
                        </td>
                        <td className={`py-3 px-4 text-center font-bold tabular-nums ${rankClass || "text-white"}`}>
                          {entry.totalPoints.toFixed(0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {lastUpdated && (
            <p className="text-center text-xs text-white/20">
              {t("lastUpdate")} {lastUpdated} · {t("refreshesEveryMin")}
            </p>
          )}
        </>
      )}
    </div>
  );
}
