// apps/web/components/CalendarGrid.tsx
"use client";
import { useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { DailyLog, GroupSettings, DayInfo } from "@shared/types";

interface Props {
  logs: DailyLog[];
  days: DayInfo[];
  members: { id: string; name: string }[];
  settings: GroupSettings;
}

function heatLevel(pages: number, max: number): number {
  if (pages === 0) return 0;
  const pct = pages / max;
  if (pct < 0.2) return 1;
  if (pct < 0.4) return 2;
  if (pct < 0.7) return 3;
  if (pct < 1) return 4;
  return 5;
}

export function CalendarGrid({ logs, days, members, settings }: Props) {
  const { t } = useLanguage();
  const logMap = useMemo(() => {
    const map = new Map<string, DailyLog>();
    for (const log of logs) {
      map.set(`${log.userId}:${log.dayNumber}`, log);
    }
    return map;
  }, [logs]);

  if (members.length === 0) {
    return (
      <div className="card p-8 text-center text-white/40">
        <p>{t("noMembersYet")}</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-start py-3 px-4 text-xs text-white/40 font-medium sticky start-0 bg-night-800">
                {t("member")}
              </th>
              {days.map((day) => (
                <th
                  key={day.dayNumber}
                  className={`text-center py-2 px-1 text-xs font-medium ${day.isToday ? "text-gold-400" : "text-white/40"
                    }`}
                >
                  <div>{day.dayNumber}</div>
                  {day.isLocked && <div className="text-xs">🔒</div>}
                </th>
              ))}
              <th className="text-center py-3 px-4 text-xs text-gold-500/60 font-bold">
                {t("total")}
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const totalPoints = days.reduce((sum, day) => {
                const log = logMap.get(`${member.id}:${day.dayNumber}`);
                if (!log) return sum;
                return sum + log.taraweehRakaat + log.tahajjudRakaat + log.quranPages;
              }, 0);

              return (
                <tr key={member.id} className="border-b border-white/5 last:border-0">
                  <td className="py-2 px-4 font-medium text-sm sticky start-0 bg-night-800 whitespace-nowrap">
                    {member.name}
                  </td>
                  {days.map((day) => {
                    const log = logMap.get(`${member.id}:${day.dayNumber}`);
                    const points = log
                      ? log.taraweehRakaat + log.tahajjudRakaat + log.quranPages
                      : 0;
                    const heat = log ? heatLevel(log.quranPages, settings.quranPagesCap) : 0;
                    const hasAnyData = log && points > 0;

                    return (
                      <td key={day.dayNumber} className="text-center py-2 px-1">
                        <div className="mx-auto relative group">
                          <div
                            className={`w-7 h-7 rounded-md mx-auto flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 cursor-default heat-${heat}`}
                            title={
                              log
                                ? `${t("taraweeh")}: ${log.taraweehRakaat}, ${t("tahajjud")}: ${log.tahajjudRakaat}, ${t("quranReading")}: ${log.quranPages}`
                                : t("noLog")
                            }
                          >
                            {hasAnyData ? (
                              <span className={heat >= 4 ? "text-black" : "text-white/70"}>
                                {points}
                              </span>
                            ) : day.isToday ? (
                              <span className="text-white/10">·</span>
                            ) : (
                              ""
                            )}
                          </div>
                          {/* Tooltip */}
                          {log && (
                            <div className="absolute z-50 bottom-full mb-1 left-1/2 -translate-x-1/2 bg-night-700 border border-white/10 rounded-lg p-2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              <div>🌙 {log.taraweehRakaat}</div>
                              <div>⭐ {log.tahajjudRakaat}</div>
                              <div>📖 {log.quranPages}/{settings.quranPagesCap}</div>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="text-center py-2 px-4 font-bold text-gold-400 tabular-nums">
                    {totalPoints}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="border-t border-white/5 p-3 flex items-center gap-3 text-xs text-white/30">
        <span>{t("density")}</span>
        {[0, 1, 2, 3, 4, 5].map((h) => (
          <div key={h} className={`w-5 h-5 rounded heat-${h}`} />
        ))}
        <span>{t("quranPages")}</span>
      </div>
    </div>
  );
}
