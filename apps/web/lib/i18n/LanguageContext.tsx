// apps/web/lib/i18n/LanguageContext.tsx
"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { translations, type Lang, type TranslationKey } from "./translations";

interface LanguageContextType {
    lang: Lang;
    dir: "ltr" | "rtl";
    toggleLanguage: () => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("lang") as Lang | null;
        if (stored === "ar" || stored === "en") {
            setLang(stored);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem("lang", lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }, [lang, mounted]);

    const toggleLanguage = useCallback(() => {
        setLang((prev) => (prev === "en" ? "ar" : "en"));
    }, []);

    const t = useCallback(
        (key: TranslationKey): string => {
            const entry = translations[key];
            if (!entry) return key;
            return entry[lang] || entry.en;
        },
        [lang]
    );

    const dir = lang === "ar" ? "rtl" : "ltr";

    return (
        <LanguageContext.Provider value={{ lang, dir, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextType {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
    return ctx;
}
