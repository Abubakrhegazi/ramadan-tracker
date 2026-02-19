// apps/web/app/api/groups/[slug]/days/[day]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, forbidden, notFound } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog, getRequestMeta } from "@/lib/audit";
import { z } from "zod";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string; day: string } }
) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const dayNumber = parseInt(params.day);
  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 30) {
    return NextResponse.json({ error: "Invalid day number" }, { status: 400 });
  }

  const group = await prisma.group.findUnique({ where: { slug: params.slug } });
  if (!group) return notFound();

  const membership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: session.id, groupId: group.id } },
  });
  if (!membership || membership.role !== "ADMIN") return forbidden();

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const schema = z.object({ action: z.enum(["lock", "unlock"]) });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "action must be lock or unlock" }, { status: 400 });

  const { action } = parsed.data;
  const meta = getRequestMeta(req);

  if (action === "lock") {
    await prisma.lockedDay.upsert({
      where: { groupId_dayNumber: { groupId: group.id, dayNumber } },
      create: { groupId: group.id, dayNumber, lockedBy: session.id },
      update: { lockedBy: session.id, lockedAt: new Date() },
    });
    await writeAuditLog({
      userId: session.id,
      groupId: group.id,
      actionType: "DAY_LOCK",
      entity: "LockedDay",
      newValue: { dayNumber },
      ...meta,
    });
  } else {
    await prisma.lockedDay.deleteMany({ where: { groupId: group.id, dayNumber } });
    await writeAuditLog({
      userId: session.id,
      groupId: group.id,
      actionType: "DAY_UNLOCK",
      entity: "LockedDay",
      newValue: { dayNumber },
      ...meta,
    });
  }

  return NextResponse.json({ message: `Day ${dayNumber} ${action}ed` });
}
