// apps/web/app/join/page.tsx
"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function extractCode(input: string): string {
    const trimmed = input.trim();
    // If pasted a URL like http://…/join?code=XXXX, extract the code
    try {
      const url = new URL(trimmed);
      const codeParam = url.searchParams.get("code");
      if (codeParam) return codeParam;
    } catch {
      // not a URL — treat as raw code
    }
    return trimmed;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("invalidCode"));
        return;
      }
      router.push(`/groups/${data.data.slug}`);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🤝</div>
          <h1 className="font-display text-3xl font-bold text-gradient-gold">{t("joinAGroup")}</h1>
          <p className="text-white/40 mt-2">{t("enterInviteCode")}</p>
        </div>

        <div className="card p-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t("inviteCode")}</label>
              <input
                type="text"
                className="input text-center text-xl font-bold tracking-widest"
                placeholder="DEMO2024"
                value={code}
                onChange={(e) => setCode(extractCode(e.target.value))}
                required
                dir="ltr"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? t("joining") : t("joinNow")}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            <Link href="/dashboard" className="text-gold-400 hover:text-gold-300">
              {t("backToGroups")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinForm />
    </Suspense>
  );
}
