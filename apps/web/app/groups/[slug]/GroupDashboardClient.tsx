// apps/web/app/groups/[slug]/GroupDashboardClient.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { TodayLogCard } from "@/components/TodayLogCard";
import { Leaderboard } from "@/components/Leaderboard";
import { CalendarGrid } from "@/components/CalendarGrid";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { DayInfo, DailyLog, GroupSettings } from "@shared/types";

interface Props {
  group: {
    id: string;
    name: string;
    slug: string;
    inviteCode: string;
    settings: GroupSettings;
  };
  members: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    email: string;
    role: string;
  }[];
  myMembership: { role: string };
  currentUserId: string;
  todayInfo: DayInfo | null;
  todayLog: DailyLog | null;
  allDays: DayInfo[];
}

export function GroupDashboardClient({
  group,
  members,
  myMembership,
  currentUserId,
  todayInfo,
  todayLog,
  allDays,
}: Props) {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"today" | "calendar" | "leaderboard">("today");
  const [allLogs, setAllLogs] = useState<DailyLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await fetch(`/api/groups/${group.slug}/logs`);
      if (res.ok) {
        const { data } = await res.json();
        setAllLogs(data);
      }
    } finally {
      setLogsLoading(false);
    }
  }, [group.slug]);

  useEffect(() => {
    if (activeTab === "calendar") {
      fetchLogs();
    }
  }, [activeTab, fetchLogs]);

  function copyInvite() {
    const url = `${window.location.origin}/join?code=${group.inviteCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isAdmin = myMembership.role === "ADMIN";

  const tabs = [
    { key: "today", label: t("tabToday"), icon: "📝" },
    { key: "leaderboard", label: t("tabLeaderboard"), icon: "🏆" },
    { key: "calendar", label: t("tabCalendar"), icon: "📅" },
  ];

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-white/5 px-4 py-3 sticky top-0 z-40 bg-night-900/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors shrink-0">
              ←
            </Link>
            <div className="min-w-0">
              <h1 className="font-bold truncate">{group.name}</h1>
              <p className="text-white/30 text-xs" dir="ltr">/{group.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setShowInvite(!showInvite)}
              className="btn-secondary text-xs py-2 px-3"
            >
              {t("invite")}
            </button>
            {isAdmin && (
              <Link href={`/groups/${group.slug}/settings`} className="btn-secondary text-xs py-2 px-3">
                {t("settings")}
              </Link>
            )}
          </div>
        </div>

        {/* Invite banner */}
        {showInvite && (
          <div className="max-w-5xl mx-auto mt-3 p-4 card-gold rounded-xl flex items-center justify-between gap-4 animate-fade-in">
            <div>
              <p className="text-xs text-white/40 mb-1">{t("inviteCodeLabel")}</p>
              <p className="font-bold text-xl tracking-widest text-gold-400 font-mono" dir="ltr">
                {group.inviteCode}
              </p>
            </div>
            <button onClick={copyInvite} className="btn-primary text-sm py-2.5 px-4 shrink-0">
              {copied ? t("copied") : t("copyLink")}
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="card p-3 text-center">
            <div className="text-2xl font-bold text-gold-400">{members.length}</div>
            <div className="text-xs text-white/40 mt-0.5">{t("members")}</div>
          </div>
          <div className="card p-3 text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {todayInfo?.dayNumber || "–"}
            </div>
            <div className="text-xs text-white/40 mt-0.5">{t("day")} {todayInfo?.isToday ? t("today") : ""}</div>
          </div>
          <div className="card p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{group.settings.numDays}</div>
            <div className="text-xs text-white/40 mt-0.5">{t("daysInRamadan")}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-night-700/50 rounded-xl p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.key
                ? "bg-night-800 text-white shadow"
                : "text-white/40 hover:text-white/60"
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "today" && (
          <div className="animate-fade-in">
            {todayInfo ? (
              <TodayLogCard
                groupSlug={group.slug}
                todayInfo={todayInfo}
                existingLog={todayLog}
                settings={group.settings}
              />
            ) : (
              <div className="card p-10 text-center text-white/40">
                <div className="text-5xl mb-4">🌙</div>
                <h2 className="text-xl font-bold mb-2">{t("ramadanNotStarted")}</h2>
                <p className="text-sm">
                  {t("startsOn")}{" "}
                  {new Date(group.settings.ramadanStartDate).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="animate-fade-in">
            <Leaderboard
              groupSlug={group.slug}
              currentUserId={currentUserId}
            />
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="animate-fade-in">
            {logsLoading ? (
              <div className="card h-48 shimmer" />
            ) : (
              <CalendarGrid
                logs={allLogs}
                days={allDays}
                members={members}
                settings={group.settings}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
