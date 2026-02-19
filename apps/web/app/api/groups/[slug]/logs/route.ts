// apps/web/app/api/groups/[slug]/logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, forbidden, notFound } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { UpsertLogSchema } from "@shared/schemas";
import { getCurrentDayNumber, canEditLog } from "@/lib/ramadan";
import { writeAuditLog, getRequestMeta } from "@/lib/audit";

async function getMembershipAndGroup(slug: string, userId: string) {
  const group = await prisma.group.findUnique({
    where: { slug },
    include: {
      settings: true,
      lockedDays: { select: { dayNumber: true } },
    },
  });
  if (!group || !group.settings) return { group: null, membership: null };
  const membership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId, groupId: group.id } },
  });
  return { group, membership };
}

// GET /api/groups/[slug]/logs - get all logs for group
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const { group, membership } = await getMembershipAndGroup(params.slug, session.id);
  if (!group) return notFound();
  if (!membership) return forbidden();

  const url = new URL(req.url);
  const dayParam = url.searchParams.get("day");

  const where: Record<string, unknown> = { groupId: group.id };
  if (dayParam) where.dayNumber = parseInt(dayParam);

  const logs = await prisma.dailyLog.findMany({
    where,
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    orderBy: [{ dayNumber: "asc" }, { updatedAt: "asc" }],
  });

  return NextResponse.json({ data: logs });
}

// PUT /api/groups/[slug]/logs - upsert today's log for current user
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const { success } = rateLimit(req, { maxRequests: 30, windowMs: 60 * 1000, keyPrefix: "log" });
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const { group, membership } = await getMembershipAndGroup(params.slug, session.id);
  if (!group || !group.settings) return notFound();
  if (!membership) return forbidden();

  const dayNumber = getCurrentDayNumber(group.settings as any);
  if (!dayNumber) {
    return NextResponse.json({ error: "Ramadan has not started or has ended" }, { status: 400 });
  }

  // Check if day is locked
  const isLocked = group.lockedDays.some((d: any) => d.dayNumber === dayNumber);
  if (isLocked) {
    return NextResponse.json({ error: "This day is locked by an admin" }, { status: 403 });
  }

  // (Edit cutoff removed — users can always edit the current day)

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = UpsertLogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { taraweehRakaat, tahajjudRakaat, quranPages, notes } = parsed.data;

  // Enforce caps
  const settings = group.settings as any;
  const cappedTaraweeh = Math.min(taraweehRakaat, settings.taraweehCap);
  const cappedTahajjud = Math.min(tahajjudRakaat, settings.tahajjudCap);
  const cappedQuran = Math.min(quranPages, settings.quranPagesCap);

  const existing = await prisma.dailyLog.findUnique({
    where: { userId_groupId_dayNumber: { userId: session.id, groupId: group.id, dayNumber } },
  });

  const log = await prisma.dailyLog.upsert({
    where: { userId_groupId_dayNumber: { userId: session.id, groupId: group.id, dayNumber } },
    create: {
      userId: session.id,
      groupId: group.id,
      dayNumber,
      taraweehRakaat: cappedTaraweeh,
      tahajjudRakaat: cappedTahajjud,
      quranPages: cappedQuran,
      notes,
    },
    update: {
      taraweehRakaat: cappedTaraweeh,
      tahajjudRakaat: cappedTahajjud,
      quranPages: cappedQuran,
      notes,
    },
  });

  const meta = getRequestMeta(req);
  await writeAuditLog({
    userId: session.id,
    groupId: group.id,
    actionType: existing ? "LOG_UPDATE" : "LOG_CREATE",
    entity: "DailyLog",
    entityId: log.id,
    oldValue: existing ? { taraweehRakaat: existing.taraweehRakaat, tahajjudRakaat: existing.tahajjudRakaat, quranPages: existing.quranPages } : null,
    newValue: { taraweehRakaat: cappedTaraweeh, tahajjudRakaat: cappedTahajjud, quranPages: cappedQuran },
    ...meta,
  });

  return NextResponse.json({ data: log });
}
