// apps/web/components/LogoutButton.tsx
"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LogoutButton() {
    const { t } = useLanguage();
    return (
        <form action="/api/auth/logout" method="POST">
            <button
                type="submit"
                className="text-white/30 hover:text-white/60 text-sm transition-colors"
                onClick={async (e) => {
                    e.preventDefault();
                    await fetch("/api/auth/logout", { method: "POST" });
                    window.location.href = "/";
                }}
            >
                {t("logOut")}
            </button>
        </form>
    );
}
