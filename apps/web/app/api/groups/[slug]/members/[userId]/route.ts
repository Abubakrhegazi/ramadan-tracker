// apps/web/app/api/groups/[slug]/members/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, forbidden, notFound } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog, getRequestMeta } from "@/lib/audit";
import { z } from "zod";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string; userId: string } }
) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  if (session.id === params.userId) {
    return NextResponse.json({ error: "Cannot kick yourself" }, { status: 400 });
  }

  const group = await prisma.group.findUnique({ where: { slug: params.slug } });
  if (!group) return notFound();

  const adminMembership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: session.id, groupId: group.id } },
  });
  if (!adminMembership || adminMembership.role !== "ADMIN") return forbidden();

  const targetMembership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: params.userId, groupId: group.id } },
  });
  if (!targetMembership) return notFound("Member not found");

  await prisma.groupMembership.delete({
    where: { userId_groupId: { userId: params.userId, groupId: group.id } },
  });

  const meta = getRequestMeta(req);
  await writeAuditLog({
    userId: session.id,
    groupId: group.id,
    actionType: "MEMBER_KICK",
    entity: "GroupMembership",
    entityId: targetMembership.id,
    oldValue: { userId: params.userId, role: targetMembership.role },
    ...meta,
  });

  return NextResponse.json({ message: "Member removed" });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string; userId: string } }
) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const group = await prisma.group.findUnique({ where: { slug: params.slug } });
  if (!group) return notFound();

  const adminMembership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: session.id, groupId: group.id } },
  });
  if (!adminMembership || adminMembership.role !== "ADMIN") return forbidden();

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const schema = z.object({ role: z.enum(["ADMIN", "MEMBER"]) });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  const updated = await prisma.groupMembership.update({
    where: { userId_groupId: { userId: params.userId, groupId: group.id } },
    data: { role: parsed.data.role },
  });

  const meta = getRequestMeta(req);
  await writeAuditLog({
    userId: session.id,
    groupId: group.id,
    actionType: "MEMBER_ROLE_CHANGE",
    entity: "GroupMembership",
    entityId: updated.id,
    newValue: { role: parsed.data.role },
    ...meta,
  });

  return NextResponse.json({ data: updated });
}
