// apps/web/components/LanguageSwitcher.tsx
"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
    const { lang, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-night-700/80 border border-white/10 hover:border-gold-500/30 text-sm font-medium transition-all duration-200 hover:scale-105 ${className}`}
            title={lang === "en" ? "Switch to Arabic" : "التبديل للإنجليزية"}
        >
            <span className="text-base">{lang === "en" ? "🇸🇦" : "🇬🇧"}</span>
            <span className="text-white/60">{lang === "en" ? "العربية" : "English"}</span>
        </button>
    );
}
