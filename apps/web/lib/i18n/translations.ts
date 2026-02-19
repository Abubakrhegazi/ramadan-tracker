// apps/web/lib/i18n/translations.ts
export type Lang = "en" | "ar";

export const translations = {
    // ── Global / Layout ──
    appName: { en: "Ramadan Tracker", ar: "مسابقة رمضان" },
    appDesc: {
        en: "Track your daily worship during Ramadan with your family and friends.",
        ar: "تتبع عباداتك اليومية في رمضان مع مجموعتك",
    },
    appTitle: {
        en: "Ramadan Tracker | Compete in Worship",
        ar: "مسابقة رمضان | Ramadan Tracker",
    },

    // ── Nav / Common ──
    back: { en: "← Back", ar: "← العودة" },
    backToHome: { en: "← Back to Home", ar: "← العودة للرئيسية" },
    backToGroups: { en: "← Back to My Groups", ar: "← العودة لمجموعاتي" },
    logIn: { en: "Log In", ar: "دخول" },
    logOut: { en: "Log Out", ar: "خروج" },
    getStarted: { en: "Get Started", ar: "ابدأ الآن" },
    save: { en: "Save", ar: "حفظ" },
    saving: { en: "Saving...", ar: "جاري الحفظ..." },
    saved: { en: "✅ Saved!", ar: "✅ تم الحفظ!" },
    creating: { en: "Creating...", ar: "جاري الإنشاء..." },
    error: { en: "An error occurred. Please try again.", ar: "حدث خطأ. يرجى المحاولة مرة أخرى." },
    remove: { en: "Remove", ar: "إزالة" },
    member: { en: "Member", ar: "عضو" },
    members: { en: "Members", ar: "عضو" },
    admin: { en: "Admin", ar: "مشرف" },
    active: { en: "Active", ar: "نشط" },
    days: { en: "days", ar: "يوم" },
    total: { en: "Total", ar: "المجموع" },
    pts: { en: "pts", ar: "نقطة" },
    name: { en: "Name", ar: "الاسم" },
    email: { en: "Email", ar: "البريد الإلكتروني" },
    password: { en: "Password", ar: "كلمة المرور" },

    // ── Landing Page ──
    landingBadge: { en: "✨ Ramadan Competition 1446", ar: "✨ مسابقة رمضان 1446" },
    landingH1a: { en: "Compete", ar: "تنافسوا" },
    landingH1b: { en: "in Worship This Ramadan", ar: "في العبادة هذا رمضان" },
    landingDesc: {
        en: "Track Taraweeh, Tahajjud, and Quran reading with your family and friends. Daily and overall leaderboards to motivate positive competition.",
        ar: "تتبع التراويح والتهجد وقراءة القرآن مع عائلتك وأصدقائك. لوحات متصدرة يومية وشاملة لتحفيزكم على المنافسة الإيجابية.",
    },
    createGroup: { en: "Create a Group", ar: "إنشاء مجموعة" },
    joinGroup: { en: "Join a Group", ar: "انضم لمجموعة" },
    featureTaraweehTitle: { en: "Taraweeh", ar: "التراويح" },
    featureTaraweehDesc: {
        en: "Track your Taraweeh rakaat every night, up to 11 rakaat",
        ar: "تتبع ركعات التراويح كل ليلة، حتى 11 ركعة",
    },
    featureTahajjudTitle: { en: "Tahajjud", ar: "التهجد" },
    featureTahajjudDesc: {
        en: "Log your Tahajjud prayers and stay consistent throughout Ramadan",
        ar: "سجّل صلاة التهجد وحافظ على الاستمرارية طوال رمضان",
    },
    featureQuranTitle: { en: "Quran Reading", ar: "قراءة القرآن" },
    featureQuranDesc: {
        en: "Daily 20 pages — complete the entire Quran in one month",
        ar: "20 صفحة يومياً — أكمل القرآن كاملاً في شهر",
    },
    howItWorks: { en: "How It Works", ar: "كيف يعمل؟" },
    step1Title: { en: "Create an Account", ar: "أنشئ حساباً" },
    step1Desc: { en: "Sign up with your email and password", ar: "سجّل بالبريد الإلكتروني وكلمة المرور" },
    step2Title: { en: "Create a Group", ar: "أنشئ مجموعة" },
    step2Desc: { en: "Give it a name and a unique link", ar: "أعطها اسماً ورابطاً مميزاً" },
    step3Title: { en: "Invite Friends", ar: "ادعُ أصدقاءك" },
    step3Desc: { en: "Share the invite code with your family", ar: "شارك كود الدعوة مع عائلتك" },
    step4Title: { en: "Compete!", ar: "تنافسوا!" },
    step4Desc: { en: "Log your worship daily and see the leaderboard", ar: "سجّل عباداتك يومياً وشاهد الترتيب" },
    footer: { en: "Ramadan Tracker — Open Source, Ad-Free 🌙", ar: "مسابقة رمضان — مفتوح المصدر، بدون إعلانات 🌙" },

    // ── Auth Pages ──
    welcomeBack: { en: "Welcome back", ar: "أهلاً بعودتك" },
    loginTitle: { en: "Log In", ar: "تسجيل الدخول" },
    loggingIn: { en: "Logging in...", ar: "جاري الدخول..." },
    loginFailed: { en: "Login failed", ar: "فشل تسجيل الدخول" },
    noAccount: { en: "Don't have an account?", ar: "ليس لديك حساب؟" },
    signUp: { en: "Sign Up", ar: "سجّل الآن" },
    demoAccount: { en: "Demo Account:", ar: "حساب تجريبي:" },
    startCompetition: { en: "Start your Ramadan competition", ar: "ابدأ مسابقة رمضان" },
    createAccountTitle: { en: "Create Account", ar: "إنشاء الحساب" },
    creatingAccount: { en: "Creating...", ar: "جاري الإنشاء..." },
    createAccountFailed: { en: "Failed to create account", ar: "فشل إنشاء الحساب" },
    fullName: { en: "Your full name", ar: "اسمك الكامل" },
    atLeast8: { en: "At least 8 characters", ar: "8 أحرف على الأقل" },
    haveAccount: { en: "Already have an account?", ar: "لديك حساب؟" },

    // ── Dashboard ──
    myGroups: { en: "My Groups", ar: "مجموعاتي" },
    welcome: { en: "Welcome,", ar: "أهلاً،" },
    joinAGroup: { en: "Join a Group", ar: "انضم لمجموعة" },
    newGroup: { en: "+ New Group", ar: "+ مجموعة جديدة" },
    noGroupsYet: { en: "No Groups Yet", ar: "لا توجد مجموعات بعد" },
    noGroupsDesc: { en: "Create a new group or join an existing one", ar: "أنشئ مجموعة جديدة أو انضم لمجموعة موجودة" },
    joinWithCode: { en: "Join with Code", ar: "انضم بكود" },

    // ── Create Group ──
    createNewGroup: { en: "Create New Group", ar: "إنشاء مجموعة جديدة" },
    createGroupDesc: { en: "Set up the competition settings for your group", ar: "اضبط إعدادات المسابقة لمجموعتك" },
    groupInfo: { en: "Group Info", ar: "معلومات المجموعة" },
    groupName: { en: "Group Name *", ar: "اسم المجموعة *" },
    groupNamePlaceholder: { en: "e.g. Ahmed's Family", ar: "مثال: عائلة أحمد" },
    shortLink: { en: "Short Link (slug) *", ar: "الرابط المختصر (slug) *" },
    slugHelp: { en: "Lowercase letters, numbers, and hyphens only", ar: "أحرف إنجليزية صغيرة وأرقام وشرطة فقط" },
    ramadanSettings: { en: "Ramadan Settings", ar: "إعدادات رمضان" },
    ramadanStartDate: { en: "Ramadan Start Date *", ar: "تاريخ بداية رمضان *" },
    numDays: { en: "Number of Days", ar: "عدد أيام رمضان" },
    timezone: { en: "Timezone", ar: "المنطقة الزمنية" },
    rakaatLimits: { en: "Rakaat Limits", ar: "حدود الركعات" },
    maxTaraweeh: { en: "Max Taraweeh Rakaat:", ar: "الحد الأقصى لركعات التراويح:" },
    maxTahajjud: { en: "Max Tahajjud Rakaat:", ar: "الحد الأقصى لركعات التهجد:" },
    createGroupBtn: { en: "Create Group 🌙", ar: "إنشاء المجموعة 🌙" },
    createGroupError: { en: "Failed to create group", ar: "خطأ في إنشاء المجموعة" },

    // ── Join Page ──
    enterInviteCode: { en: "Enter the invite code from your friend", ar: "أدخل كود الدعوة من صديقك" },
    inviteCode: { en: "Invite Code", ar: "كود الدعوة" },
    invalidCode: { en: "Invalid invite code", ar: "كود الدعوة غير صحيح" },
    joining: { en: "Joining...", ar: "جاري الانضمام..." },
    joinNow: { en: "Join Now", ar: "انضم الآن" },

    // ── Group Dashboard ──
    invite: { en: "🔗 Invite", ar: "🔗 دعوة" },
    settings: { en: "⚙️ Settings", ar: "⚙️ إعدادات" },
    inviteCodeLabel: { en: "Invite Code:", ar: "كود الدعوة:" },
    copied: { en: "✅ Copied!", ar: "✅ نُسخ!" },
    copyLink: { en: "Copy Link", ar: "نسخ الرابط" },
    day: { en: "Day", ar: "يوم" },
    today: { en: "(Today)", ar: "(اليوم)" },
    daysInRamadan: { en: "Days in Ramadan", ar: "يوم في رمضان" },
    tabToday: { en: "Today", ar: "اليوم" },
    tabLeaderboard: { en: "Leaderboard", ar: "الترتيب" },
    tabCalendar: { en: "Calendar", ar: "التقويم" },
    ramadanNotStarted: { en: "Ramadan Has Not Started Yet", ar: "رمضان لم يبدأ بعد" },
    startsOn: { en: "Starts on", ar: "يبدأ في" },

    // ── TodayLogCard ──
    taraweeh: { en: "Taraweeh", ar: "التراويح" },
    tahajjud: { en: "Tahajjud", ar: "التهجد" },
    quranReading: { en: "Quran Reading", ar: "قراءة القرآن" },
    rakaat: { en: "rakaat", ar: "ركعات" },
    rakaatMax: { en: "rakaat (max)", ar: "ركعة (الحد الأقصى)" },
    dailyGoal: { en: "✅ Daily Goal", ar: "✅ ختمة اليوم" },
    pagesPerSection: { en: "pages per section", ar: "صفحة للجزء" },
    saveFailed: { en: "Failed to save", ar: "خطأ في الحفظ" },
    onlyCurrentDay: { en: "Logging is only available for the current day", ar: "يتاح التسجيل فقط لليوم الحالي" },
    dayOfRamadan: { en: "of Ramadan", ar: "من رمضان" },
    lockedByAdmin: { en: "This day has been locked by an admin", ar: "هذا اليوم مقفل من قِبل المشرف" },
    dayLog: { en: "Log", ar: "تسجيل اليوم" },
    todaysPoints: { en: "Today's Points", ar: "نقطة اليوم" },
    saveTodaysProgress: { en: "Save Today's Progress", ar: "حفظ إنجازات اليوم" },

    // ── Leaderboard ──
    overallRanking: { en: "Overall Ranking", ar: "الترتيب العام" },
    todaysRanking: { en: "Today's Ranking", ar: "ترتيب اليوم" },
    noDataYet: { en: "No data yet", ar: "لا توجد بيانات بعد" },
    me: { en: "(Me)", ar: "(أنا)" },
    lastUpdate: { en: "Last update:", ar: "آخر تحديث:" },
    refreshesEveryMin: { en: "Refreshes every minute", ar: "تتجدد كل دقيقة" },

    // ── CalendarGrid ──
    noMembersYet: { en: "No members yet", ar: "لا يوجد أعضاء بعد" },
    noLog: { en: "No log", ar: "لا يوجد تسجيل" },
    density: { en: "Density:", ar: "الكثافة:" },
    quranPages: { en: "Quran Pages", ar: "صفحات القرآن" },

    // ── Admin Settings ──
    settingsTitle: { en: "Settings", ar: "إعدادات" },
    generalTab: { en: "⚙️ General", ar: "⚙️ عام" },
    membersTab: { en: "👥 Members", ar: "👥 الأعضاء" },
    daysTab: { en: "📅 Days", ar: "📅 الأيام" },
    regenerateCode: { en: "Regenerate Code", ar: "تجديد الرمز" },
    regenerateWarn: { en: "This will invalidate the old link. Are you sure?", ar: "هذا سيبطل الرابط القديم. متأكد؟" },
    competitionSettings: { en: "Competition Settings", ar: "إعدادات المسابقة" },
    taraweehCap: { en: "Taraweeh Cap:", ar: "حد التراويح:" },
    tahajjudCap: { en: "Tahajjud Cap:", ar: "حد التهجد:" },
    dayResetRule: { en: "Day Reset Rule", ar: "قاعدة إعادة ضبط اليوم" },
    midnight: { en: "Midnight", ar: "منتصف الليل" },
    maghrib: { en: "Maghrib", ar: "المغرب" },
    saveSettings: { en: "Save Settings", ar: "حفظ الإعدادات" },
    removeMemberConfirm: { en: "Remove this member?", ar: "هل تريد إزالة هذا العضو؟" },
    daysLockHelp: {
        en: "Click on a day to lock or unlock it. Locked days cannot be edited by members.",
        ar: "انقر على يوم لقفله أو فتحه. الأيام المقفلة لا يمكن تعديلها من قِبل الأعضاء.",
    },

    // ── 404 ──
    pageNotFound: { en: "This page does not exist", ar: "هذه الصفحة غير موجودة" },

    // ── Group page ──
    settingsIncomplete: { en: "Group settings are incomplete", ar: "إعدادات المجموعة غير مكتملة" },

    // ── Timezone names ──
    tzEgypt: { en: "Egypt", ar: "مصر" },
    tzSaudi: { en: "Saudi Arabia", ar: "السعودية" },
    tzUAE: { en: "UAE", ar: "الإمارات" },
    tzKuwait: { en: "Kuwait", ar: "الكويت" },
    tzMorocco: { en: "Morocco", ar: "المغرب" },
    tzLebanon: { en: "Lebanon", ar: "لبنان" },
} as const;

export type TranslationKey = keyof typeof translations;
