// apps/web/app/groups/create/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function CreateGroupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    ramadanStartDate: "2025-03-01",
    numDays: 30,
    timezone: "Africa/Cairo",
    taraweehCap: 11,
    tahajjudCap: 11,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]/g, "")
      .slice(0, 50);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("createGroupError"));
        return;
      }
      router.push(`/groups/${form.slug}`);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors text-sm">
            {t("back")}
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t("createNewGroup")}</h1>
          <p className="text-white/40 text-sm mt-1">{t("createGroupDesc")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6 space-y-5">
            <h2 className="font-bold text-lg border-b border-white/5 pb-4">{t("groupInfo")}</h2>

            <div>
              <label className="label">{t("groupName")}</label>
              <input
                type="text"
                className="input"
                placeholder={t("groupNamePlaceholder")}
                value={form.name}
                onChange={(e) => {
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: form.slug || generateSlug(e.target.value),
                  });
                }}
                required
                minLength={2}
                maxLength={100}
              />
            </div>

            <div>
              <label className="label">{t("shortLink")}</label>
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-sm shrink-0">ramadan.app/groups/</span>
                <input
                  type="text"
                  className="input"
                  placeholder="ahmed-family"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                  required
                  minLength={3}
                  maxLength={50}
                  pattern="[a-z0-9-]+"
                  dir="ltr"
                />
              </div>
              <p className="text-white/30 text-xs mt-1">{t("slugHelp")}</p>
            </div>
          </div>

          <div className="card p-6 space-y-5">
            <h2 className="font-bold text-lg border-b border-white/5 pb-4">{t("ramadanSettings")}</h2>

            <div>
              <label className="label">{t("ramadanStartDate")}</label>
              <input
                type="date"
                className="input"
                value={form.ramadanStartDate}
                onChange={(e) => setForm({ ...form, ramadanStartDate: e.target.value })}
                required
                dir="ltr"
              />
            </div>

            <div>
              <label className="label">{t("numDays")}</label>
              <div className="flex gap-3">
                {[29, 30].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`flex-1 py-3 rounded-xl border font-bold transition-all ${form.numDays === n
                      ? "bg-gold-500/20 border-gold-500/50 text-gold-400"
                      : "bg-night-700 border-white/10 text-white/40 hover:border-white/20"
                      }`}
                    onClick={() => setForm({ ...form, numDays: n })}
                  >
                    {n} {t("days")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">{t("timezone")}</label>
              <select
                className="input"
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                dir="ltr"
              >
                <option value="Africa/Cairo">Africa/Cairo ({t("tzEgypt")})</option>
                <option value="Asia/Riyadh">Asia/Riyadh ({t("tzSaudi")})</option>
                <option value="Asia/Dubai">Asia/Dubai ({t("tzUAE")})</option>
                <option value="Asia/Kuwait">Asia/Kuwait ({t("tzKuwait")})</option>
                <option value="Africa/Casablanca">Africa/Casablanca ({t("tzMorocco")})</option>
                <option value="Asia/Beirut">Asia/Beirut ({t("tzLebanon")})</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
              </select>
            </div>
          </div>

          <div className="card p-6 space-y-5">
            <h2 className="font-bold text-lg border-b border-white/5 pb-4">{t("rakaatLimits")}</h2>

            <div>
              <label className="label">{t("maxTaraweeh")} {form.taraweehCap}</label>
              <input
                type="range"
                min={0}
                max={20}
                value={form.taraweehCap}
                onChange={(e) => setForm({ ...form, taraweehCap: parseInt(e.target.value) })}
                className="w-full accent-gold-500"
                dir="ltr"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1" dir="ltr">
                <span>0</span>
                <span>20</span>
              </div>
            </div>

            <div>
              <label className="label">{t("maxTahajjud")} {form.tahajjudCap}</label>
              <input
                type="range"
                min={0}
                max={20}
                value={form.tahajjudCap}
                onChange={(e) => setForm({ ...form, tahajjudCap: parseInt(e.target.value) })}
                className="w-full accent-gold-500"
                dir="ltr"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full text-base py-4" disabled={loading}>
            {loading ? t("creating") : t("createGroupBtn")}
          </button>
        </form>
      </main>
    </div>
  );
}
