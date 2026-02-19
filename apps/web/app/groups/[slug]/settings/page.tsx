// apps/web/app/groups/[slug]/settings/page.tsx
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminSettingsClient } from "./AdminSettingsClient";

export default async function GroupSettingsPage({ params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const group = await prisma.group.findUnique({
    where: { slug: params.slug },
    include: {
      settings: true,
      memberships: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { joinedAt: "asc" },
      },
      lockedDays: { select: { dayNumber: true } },
    },
  });

  if (!group) notFound();

  const membership = group.memberships.find((m) => m.userId === session.id);
  if (!membership || membership.role !== "ADMIN") {
    redirect(`/groups/${params.slug}`);
  }

  const members = group.memberships.map((m: any) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
    role: m.role,
    joinedAt: m.joinedAt.toISOString(),
  }));

  return (
    <AdminSettingsClient
      group={{
        id: group.id,
        name: group.name,
        slug: group.slug,
        inviteCode: group.inviteCode,
        settings: group.settings as any,
      }}
      members={members}
      currentUserId={session.id}
      lockedDays={group.lockedDays.map((d: any) => d.dayNumber)}
    />
  );
}
