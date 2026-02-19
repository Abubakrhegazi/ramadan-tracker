// apps/web/components/TodayLogCard.tsx
"use client";
import { useState, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { DailyLog, GroupSettings, DayInfo } from "@shared/types";

interface Props {
  groupSlug: string;
  todayInfo: DayInfo;
  existingLog?: DailyLog | null;
  settings: GroupSettings;
  onSaved?: () => void;
}

function RakaatSelector({
  label,
  value,
  max,
  onChange,
  icon,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (v: number) => void;
  icon: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="font-bold text-sm">{label}</span>
        </div>
        <span className="text-gold-400 font-bold text-xl tabular-nums">{value}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: max + 1 }, (_, i) => i).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`rakaat-btn ${value === n ? "rakaat-btn-active" : "rakaat-btn-inactive"
              }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-white/20">
        <span>0 {t("rakaat")}</span>
        <span>{max} {t("rakaatMax")}</span>
      </div>
    </div>
  );
}

function QuranSelector({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const { t } = useLanguage();
  const pct = (value / max) * 100;
  const completed = value >= max;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <span className="font-bold text-sm">{t("quranReading")}</span>
        </div>
        <div className="flex items-center gap-2">
          {completed && <span className="badge-emerald">{t("dailyGoal")}</span>}
          <span className="text-gold-400 font-bold text-xl tabular-nums">
            {value}/{max}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-night-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: completed
              ? "linear-gradient(90deg, #10b981, #34d399)"
              : "linear-gradient(90deg, #eab308, #fde047)",
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: max + 1 }, (_, i) => i).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-150 ${value === n
              ? "bg-gold-500 text-black shadow-lg shadow-gold-500/30"
              : n < value
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-night-700 text-white/30 hover:border hover:border-white/20"
              }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/30">{max} {t("pagesPerSection")}</p>
    </div>
  );
}

export function TodayLogCard({ groupSlug, todayInfo, existingLog, settings, onSaved }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    taraweehRakaat: existingLog?.taraweehRakaat ?? 0,
    tahajjudRakaat: existingLog?.tahajjudRakaat ?? 0,
    quranPages: existingLog?.quranPages ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const totalPoints = form.taraweehRakaat + form.tahajjudRakaat + form.quranPages;

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch(`/api/groups/${groupSlug}/logs`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("saveFailed"));
        return;
      }
      setSaved(true);
      onSaved?.();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError(t("error"));
    } finally {
      setSaving(false);
    }
  }, [form, groupSlug, onSaved, t]);

  if (!todayInfo.isToday) {
    return (
      <div className="card p-6 text-center text-white/40">
        <div className="text-4xl mb-2">📅</div>
        <p>{t("onlyCurrentDay")}</p>
        {todayInfo.dayNumber && <p className="text-sm mt-1">{t("day")} {todayInfo.dayNumber} {t("dayOfRamadan")}</p>}
      </div>
    );
  }

  if (todayInfo.isLocked) {
    return (
      <div className="card p-6 text-center text-white/40">
        <div className="text-4xl mb-2">🔒</div>
        <p>{t("lockedByAdmin")}</p>
      </div>
    );
  }

  return (
    <div className="card-gold p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-bold text-lg">{t("day")} {todayInfo.dayNumber} {t("dayLog")}</h2>
          <p className="text-white/40 text-sm">{todayInfo.date}</p>
        </div>
        <div className="text-end">
          <div className="text-2xl font-bold text-gradient-gold">{totalPoints}</div>
          <div className="text-xs text-white/30">{t("todaysPoints")}</div>
        </div>
      </div>

      <div className="space-y-6 border-t border-white/5 pt-6">
        <RakaatSelector
          label={t("taraweeh")}
          icon="🌙"
          value={form.taraweehRakaat}
          max={settings.taraweehCap}
          onChange={(v) => setForm((f) => ({ ...f, taraweehRakaat: v }))}
        />
        <div className="border-t border-white/5" />
        <RakaatSelector
          label={t("tahajjud")}
          icon="⭐"
          value={form.tahajjudRakaat}
          max={settings.tahajjudCap}
          onChange={(v) => setForm((f) => ({ ...f, tahajjudRakaat: v }))}
        />
        <div className="border-t border-white/5" />
        <QuranSelector
          value={form.quranPages}
          max={settings.quranPagesCap}
          onChange={(v) => setForm((f) => ({ ...f, quranPages: v }))}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 ${saved
          ? "bg-emerald-600 text-white"
          : "btn-primary animate-pulse-gold"
          }`}
      >
        {saving ? t("saving") : saved ? t("saved") : t("saveTodaysProgress")}
      </button>
    </div>
  );
}
