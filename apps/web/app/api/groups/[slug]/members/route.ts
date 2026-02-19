// apps/web/app/api/groups/[slug]/members/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, forbidden, notFound } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const group = await prisma.group.findUnique({ where: { slug: params.slug } });
  if (!group) return notFound();

  const membership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: session.id, groupId: group.id } },
  });
  if (!membership) return forbidden();

  const members = await prisma.groupMembership.findMany({
    where: { groupId: group.id },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    orderBy: { joinedAt: "asc" },
  });

  return NextResponse.json({ data: members });
}
