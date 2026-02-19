// apps/web/app/groups/[slug]/settings/AdminSettingsClient.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { GroupSettings } from "@shared/types";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

interface Props {
  group: {
    id: string;
    name: string;
    slug: string;
    inviteCode: string;
    settings: GroupSettings;
  };
  members: Member[];
  currentUserId: string;
  lockedDays: number[];
}

export function AdminSettingsClient({ group, members: initialMembers, currentUserId, lockedDays: initialLockedDays }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"general" | "members" | "days">("general");
  const [settings, setSettings] = useState(group.settings);
  const [members, setMembers] = useState(initialMembers);
  const [lockedDays, setLockedDays] = useState(initialLockedDays);
  const [inviteCode, setInviteCode] = useState(group.inviteCode);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function saveSettings() {
    setSaving(true);
    setMsg("");
    const res = await fetch(`/api/groups/${group.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: group.name,
        taraweehCap: settings.taraweehCap,
        tahajjudCap: settings.tahajjudCap,
        resetRule: settings.resetRule,
        timezone: settings.timezone,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg(t("saved"));
      router.refresh();
    } else {
      const data = await res.json();
      setMsg(`❌ ${data.error}`);
    }
  }

  async function kickMember(userId: string) {
    if (!confirm(t("removeMemberConfirm"))) return;
    const res = await fetch(`/api/groups/${group.slug}/members/${userId}`, { method: "DELETE" });
    if (res.ok) setMembers((m) => m.filter((x) => x.id !== userId));
  }

  async function toggleDayLock(dayNumber: number) {
    const isLocked = lockedDays.includes(dayNumber);
    const action = isLocked ? "unlock" : "lock";
    const res = await fetch(`/api/groups/${group.slug}/days/${dayNumber}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      setLockedDays((d) =>
        isLocked ? d.filter((x) => x !== dayNumber) : [...d, dayNumber]
      );
    }
  }

  async function regenerateInvite() {
    if (!confirm(t("regenerateWarn"))) return;
    const res = await fetch(`/api/groups/${group.slug}/invite`, { method: "POST" });
    if (res.ok) {
      const { data } = await res.json();
      setInviteCode(data.inviteCode);
    }
  }

  const tabItems = [
    { key: "general", label: t("generalTab") },
    { key: "members", label: t("membersTab") },
    { key: "days", label: t("daysTab") },
  ];

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/5 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/groups/${group.slug}`} className="text-white/40 hover:text-white transition-colors">
              {t("back")}
            </Link>
            <h1 className="font-bold">{group.name} {t("settingsTitle")}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex bg-night-700/50 rounded-xl p-1">
          {tabItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.key ? "bg-night-800 text-white shadow" : "text-white/40"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {activeTab === "general" && (
          <div className="space-y-4 animate-fade-in">
            {/* Invite code */}
            <div className="card p-6 space-y-3">
              <h2 className="font-bold">{t("inviteCode")}</h2>
              <div className="flex items-center justify-between gap-4">
                <code className="text-gold-400 font-mono text-2xl font-bold tracking-widest bg-night-700 px-4 py-2 rounded-xl">
                  {inviteCode}
                </code>
                <button onClick={regenerateInvite} className="btn-danger text-sm">
                  {t("regenerateCode")}
                </button>
              </div>
            </div>

            {/* Settings form */}
            <div className="card p-6 space-y-5">
              <h2 className="font-bold border-b border-white/5 pb-4">{t("competitionSettings")}</h2>

              <div>
                <label className="label">{t("taraweehCap")} {settings.taraweehCap}</label>
                <input type="range" min={0} max={20} value={settings.taraweehCap}
                  onChange={(e) => setSettings({ ...settings, taraweehCap: +e.target.value })}
                  className="w-full accent-gold-500" dir="ltr" />
              </div>

              <div>
                <label className="label">{t("tahajjudCap")} {settings.tahajjudCap}</label>
                <input type="range" min={0} max={20} value={settings.tahajjudCap}
                  onChange={(e) => setSettings({ ...settings, tahajjudCap: +e.target.value })}
                  className="w-full accent-gold-500" dir="ltr" />
              </div>

              <div>
                <label className="label">{t("dayResetRule")}</label>
                <div className="flex gap-3">
                  {["MIDNIGHT", "MAGHRIB"].map((r) => (
                    <button key={r} type="button"
                      onClick={() => setSettings({ ...settings, resetRule: r as any })}
                      className={`flex-1 py-3 rounded-xl border font-medium text-sm transition-all ${settings.resetRule === r
                        ? "bg-gold-500/20 border-gold-500/40 text-gold-400"
                        : "bg-night-700 border-white/10 text-white/40"
                        }`}
                    >
                      {r === "MIDNIGHT" ? t("midnight") : t("maghrib")}
                    </button>
                  ))}
                </div>
              </div>

              {msg && (
                <div className={`p-3 rounded-xl text-sm ${msg.startsWith("✅") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                  {msg}
                </div>
              )}

              <button onClick={saveSettings} className="btn-primary w-full" disabled={saving}>
                {saving ? t("saving") : t("saveSettings")}
              </button>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="space-y-3 animate-fade-in">
            {members.map((member) => (
              <div key={member.id} className="card p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-white/40 text-sm" dir="ltr">{member.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  {member.role === "ADMIN" ? (
                    <span className="badge-gold">{t("admin")}</span>
                  ) : (
                    <span className="text-white/30 text-xs">{t("member")}</span>
                  )}
                  {member.id !== currentUserId && (
                    <button
                      onClick={() => kickMember(member.id)}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      {t("remove")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "days" && (
          <div className="animate-fade-in">
            <div className="card p-4 mb-4 text-sm text-white/40">
              {t("daysLockHelp")}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {Array.from({ length: group.settings.numDays }, (_, i) => i + 1).map((day) => {
                const isLocked = lockedDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDayLock(day)}
                    className={`aspect-square rounded-xl font-bold text-sm transition-all active:scale-95 ${isLocked
                      ? "bg-red-500/20 border border-red-500/30 text-red-400"
                      : "bg-night-700 border border-white/10 text-white/60 hover:border-gold-500/30"
                      }`}
                  >
                    {isLocked ? "🔒" : day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
