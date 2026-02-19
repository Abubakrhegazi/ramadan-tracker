// apps/web/app/dashboard/page.tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardContent } from "@/components/DashboardContent";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const memberships = await prisma.groupMembership.findMany({
    where: { userId: session.id },
    include: { group: { include: { settings: true } } },
    orderBy: { joinedAt: "desc" },
  });

  const groups = memberships.map(({ group, role }) => ({
    id: group.id,
    name: group.name,
    slug: group.slug,
    logoUrl: group.logoUrl,
    role,
    numDays: group.settings?.numDays ?? null,
  }));

  return <DashboardContent userName={session.name} groups={groups} />;
}
