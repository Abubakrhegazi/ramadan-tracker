// apps/web/app/api/groups/[slug]/logs/admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, forbidden, notFound } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminOverrideLogSchema } from "@shared/schemas";
import { writeAuditLog, getRequestMeta } from "@/lib/audit";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const group = await prisma.group.findUnique({
    where: { slug: params.slug },
    include: { settings: true },
  });
  if (!group) return notFound();

  const membership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: session.id, groupId: group.id } },
  });
  if (!membership || membership.role !== "ADMIN") return forbidden();

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = AdminOverrideLogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { userId, dayNumber, taraweehRakaat, tahajjudRakaat, quranPages, notes, reason } = parsed.data;

  // Verify target user is a member
  const targetMembership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId, groupId: group.id } },
  });
  if (!targetMembership) {
    return NextResponse.json({ error: "User is not a member of this group" }, { status: 400 });
  }

  const existing = await prisma.dailyLog.findUnique({
    where: { userId_groupId_dayNumber: { userId, groupId: group.id, dayNumber } },
  });

  const log = await prisma.dailyLog.upsert({
    where: { userId_groupId_dayNumber: { userId, groupId: group.id, dayNumber } },
    create: { userId, groupId: group.id, dayNumber, taraweehRakaat, tahajjudRakaat, quranPages, notes },
    update: { taraweehRakaat, tahajjudRakaat, quranPages, notes },
  });

  const meta = getRequestMeta(req);
  await writeAuditLog({
    userId: session.id,
    groupId: group.id,
    actionType: "LOG_ADMIN_OVERRIDE",
    entity: "DailyLog",
    entityId: log.id,
    oldValue: existing ? { taraweehRakaat: existing.taraweehRakaat, tahajjudRakaat: existing.tahajjudRakaat, quranPages: existing.quranPages } : null,
    newValue: { taraweehRakaat, tahajjudRakaat, quranPages, reason },
    ...meta,
  });

  return NextResponse.json({ data: log });
}
