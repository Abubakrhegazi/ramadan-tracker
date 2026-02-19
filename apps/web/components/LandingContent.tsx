// apps/web/components/LandingContent.tsx
"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function LandingContent() {
    const { t } = useLanguage();

    const features = [
        { icon: "🌙", title: t("featureTaraweehTitle"), desc: t("featureTaraweehDesc"), color: "from-gold-500/10 to-gold-500/5" },
        { icon: "⭐", title: t("featureTahajjudTitle"), desc: t("featureTahajjudDesc"), color: "from-emerald-500/10 to-emerald-500/5" },
        { icon: "📖", title: t("featureQuranTitle"), desc: t("featureQuranDesc"), color: "from-blue-500/10 to-blue-500/5" },
    ];

    const steps = [
        { step: "1", title: t("step1Title"), desc: t("step1Desc") },
        { step: "2", title: t("step2Title"), desc: t("step2Desc") },
        { step: "3", title: t("step3Title"), desc: t("step3Desc") },
        { step: "4", title: t("step4Title"), desc: t("step4Desc") },
    ];

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
                {Array.from({ length: 40 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-px h-px bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.1,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                {/* Header */}
                <nav className="flex justify-between items-center px-6 py-5 max-w-5xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-2xl">
                            🌙
                        </div>
                        <span className="font-display text-gold-400 text-xl font-bold">{t("appName")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link href="/auth/login" className="text-white/60 hover:text-white transition-colors text-sm px-4 py-2">
                            {t("logIn")}
                        </Link>
                        <Link href="/auth/signup" className="btn-primary text-sm py-2.5 px-5">
                            {t("getStarted")}
                        </Link>
                    </div>
                </nav>

                {/* Hero */}
                <section className="text-center pt-20 pb-16 px-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm mb-8 font-medium animate-fade-in">
                        <span>{t("landingBadge")}</span>
                    </div>

                    <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
                        <span className="text-gradient-gold">{t("landingH1a")}</span>
                        <br />
                        <span className="text-white">{t("landingH1b")}</span>
                    </h1>

                    <p className="text-white/50 text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        {t("landingDesc")}
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                        <Link href="/auth/signup" className="btn-primary text-lg py-4 px-8 inline-flex items-center justify-center gap-2">
                            <span>{t("createGroup")}</span>
                            <span className="text-xl">🏆</span>
                        </Link>
                        <Link href="/join" className="btn-secondary text-lg py-4 px-8 inline-flex items-center justify-center gap-2">
                            <span>{t("joinGroup")}</span>
                            <span className="text-xl">👥</span>
                        </Link>
                    </div>
                </section>

                {/* Features */}
                <section className="max-w-5xl mx-auto px-6 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className={`card p-6 bg-gradient-to-br ${feature.color} animate-fade-in`}
                                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* How it works */}
                    <div className="mt-16 text-center">
                        <h2 className="font-display text-3xl font-bold mb-10 text-white">
                            {t("howItWorks")}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {steps.map((item, i) => (
                                <div key={i} className="relative animate-fade-in" style={{ animationDelay: `${0.7 + i * 0.1}s` }}>
                                    <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-xl mx-auto mb-4">
                                        {item.step}
                                    </div>
                                    <h4 className="font-bold mb-2">{item.title}</h4>
                                    <p className="text-white/40 text-sm">{item.desc}</p>
                                    {i < 3 && (
                                        <div className="hidden md:block absolute top-6 left-0 w-full h-px border-t border-dashed border-white/10" style={{ left: "50%", width: "100%" }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/5 py-8 text-center text-white/30 text-sm">
                    <p>{t("footer")}</p>
                </footer>
            </div>
        </main>
    );
}
