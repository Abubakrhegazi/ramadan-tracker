// apps/web/app/auth/signup/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("createAccountFailed"));
        return;
      }
      router.push("/dashboard");
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌙</div>
          <h1 className="font-display text-3xl font-bold text-gradient-gold">{t("appName")}</h1>
          <p className="text-white/40 mt-2">{t("startCompetition")}</p>
        </div>

        <div className="card p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{t("createAccountTitle")}</h2>
            <LanguageSwitcher />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t("name")}</label>
              <input
                type="text"
                className="input"
                placeholder={t("fullName")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                minLength={2}
                maxLength={80}
              />
            </div>

            <div>
              <label className="label">{t("email")}</label>
              <input
                type="email"
                className="input"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                dir="ltr"
              />
            </div>

            <div>
              <label className="label">{t("password")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input pe-12"
                  placeholder={t("atLeast8")}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors text-sm select-none"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full text-base" disabled={loading}>
              {loading ? t("creatingAccount") : t("createAccountTitle")}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            {t("haveAccount")}{" "}
            <Link href="/auth/login" className="text-gold-400 hover:text-gold-300">
              {t("logIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
