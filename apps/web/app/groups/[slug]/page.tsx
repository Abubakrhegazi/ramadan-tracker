// apps/web/app/groups/[slug]/page.tsx
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { GroupDashboardClient } from "./GroupDashboardClient";
import { getCurrentDayNumber, getDayInfo, getAllDays } from "@/lib/ramadan";

export default async function GroupPage({ params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const group = await prisma.group.findUnique({
    where: { slug: params.slug },
    include: {
      settings: true,
      memberships: {
        include: { user: { select: { id: true, name: true, avatarUrl: true, email: true } } },
        orderBy: { joinedAt: "asc" },
      },
      lockedDays: { select: { dayNumber: true } },
    },
  });

  if (!group) notFound();

  const membership = group.memberships.find((m) => m.userId === session.id);
  if (!membership) redirect(`/join?code=${group.inviteCode}`);

  if (!group.settings) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/40">
        Group settings are incomplete
      </div>
    );
  }

  const settings = group.settings as any;
  const lockedDayNumbers = group.lockedDays.map((d: any) => d.dayNumber);
  const currentDayNumber = getCurrentDayNumber(settings);
  const allDays = getAllDays(settings, lockedDayNumbers);

  // Fetch today's log for current user
  let todayLog = null;
  if (currentDayNumber) {
    const rawLog = await prisma.dailyLog.findUnique({
      where: {
        userId_groupId_dayNumber: {
          userId: session.id,
          groupId: group.id,
          dayNumber: currentDayNumber,
        },
      },
    });
    if (rawLog) {
      const { createdAt, ...rest } = rawLog;
      todayLog = {
        ...rest,
        updatedAt: rawLog.updatedAt.toISOString(),
      };
    }
  }

  const todayInfo = currentDayNumber
    ? getDayInfo(currentDayNumber, settings, lockedDayNumbers)
    : null;

  const members = group.memberships.map((m: any) => ({
    id: m.user.id,
    name: m.user.name,
    avatarUrl: m.user.avatarUrl,
    email: m.user.email,
    role: m.role,
  }));

  return (
    <GroupDashboardClient
      group={{
        id: group.id,
        name: group.name,
        slug: group.slug,
        inviteCode: group.inviteCode,
        settings: settings,
      }}
      members={members}
      myMembership={{ role: membership.role }}
      currentUserId={session.id}
      todayInfo={todayInfo}
      todayLog={todayLog}
      allDays={allDays}
    />
  );
}
