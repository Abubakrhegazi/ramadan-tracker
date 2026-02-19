// apps/web/app/not-found.tsx
"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="text-8xl mb-6">🌙</div>
        <h1 className="text-4xl font-bold mb-3 text-gradient-gold">404</h1>
        <p className="text-xl text-white/60 mb-8">{t("pageNotFound")}</p>
        <Link href="/" className="btn-primary">
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}
