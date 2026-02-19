// apps/web/components/DashboardContent.tsx
"use client";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface GroupInfo {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    role: string;
    numDays: number | null;
}

interface Props {
    userName: string;
    groups: GroupInfo[];
}

export function DashboardContent({ userName, groups }: Props) {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen">
            {/* Header */}
            <nav className="border-b border-white/5 px-6 py-4">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🌙</span>
                        <span className="font-display text-gold-400 font-bold">{t("appName")}</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <span className="text-white/50 text-sm">{userName}</span>
                        <LogoutButton />
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">{t("myGroups")}</h1>
                        <p className="text-white/40 text-sm mt-1">{t("welcome")} {userName}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/join" className="btn-secondary text-sm py-2.5 px-4">
                            {t("joinAGroup")}
                        </Link>
                        <Link href="/groups/create" className="btn-primary text-sm py-2.5 px-4">
                            {t("newGroup")}
                        </Link>
                    </div>
                </div>

                {groups.length === 0 ? (
                    <div className="card-gold p-12 text-center">
                        <div className="text-6xl mb-4">🌙</div>
                        <h2 className="text-xl font-bold mb-2">{t("noGroupsYet")}</h2>
                        <p className="text-white/40 mb-6">{t("noGroupsDesc")}</p>
                        <div className="flex justify-center gap-3">
                            <Link href="/groups/create" className="btn-primary">{t("createGroup")}</Link>
                            <Link href="/join" className="btn-secondary">{t("joinWithCode")}</Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groups.map((group) => (
                            <Link
                                key={group.id}
                                href={`/groups/${group.slug}`}
                                className="card p-6 hover:border-gold-500/30 transition-all duration-200 hover:-translate-y-0.5 group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-2xl">
                                        {group.logoUrl ? (
                                            <img src={group.logoUrl} alt="" className="w-full h-full rounded-xl object-cover" />
                                        ) : (
                                            "🌙"
                                        )}
                                    </div>
                                    {group.role === "ADMIN" && (
                                        <span className="badge-gold">{t("admin")}</span>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg mb-1 group-hover:text-gold-400 transition-colors">
                                    {group.name}
                                </h3>
                                <p className="text-white/40 text-sm" dir="ltr">/{group.slug}</p>
                                {group.numDays && (
                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/30">
                                        <span>{group.numDays} {t("days")}</span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            {t("active")}
                                        </span>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
