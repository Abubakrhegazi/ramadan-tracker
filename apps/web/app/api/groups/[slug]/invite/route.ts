// apps/web/app/api/groups/[slug]/invite/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, forbidden, notFound } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog, getRequestMeta } from "@/lib/audit";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const group = await prisma.group.findUnique({ where: { slug: params.slug } });
  if (!group) return notFound();

  const membership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: session.id, groupId: group.id } },
  });
  if (!membership || membership.role !== "ADMIN") return forbidden();

  const newCode = randomBytes(6).toString("hex").toUpperCase();

  await prisma.group.update({
    where: { id: group.id },
    data: { inviteCode: newCode },
  });

  const meta = getRequestMeta(req);
  await writeAuditLog({
    userId: session.id,
    groupId: group.id,
    actionType: "INVITE_REGENERATE",
    entity: "Group",
    entityId: group.id,
    ...meta,
  });

  return NextResponse.json({ data: { inviteCode: newCode } });
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const group = await prisma.group.findUnique({ where: { slug: params.slug } });
  if (!group) return notFound();

  const membership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: session.id, groupId: group.id } },
  });
  if (!membership) return forbidden();

  return NextResponse.json({ data: { inviteCode: group.inviteCode } });
}
