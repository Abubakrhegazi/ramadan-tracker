// apps/web/app/api/groups/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, forbidden, notFound } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateGroupSettingsSchema } from "@shared/schemas";
import { writeAuditLog, getRequestMeta } from "@/lib/audit";

async function getGroupAndMembership(slug: string, userId: string) {
  const group = await prisma.group.findUnique({
    where: { slug },
    include: {
      settings: true,
      memberships: { where: { userId } },
    },
  });
  const membership = group?.memberships?.[0] || null;
  return { group, membership };
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const { group, membership } = await getGroupAndMembership(params.slug, session.id);
  if (!group) return notFound();
  if (!membership) return forbidden();

  const lockedDays = await prisma.lockedDay.findMany({ where: { groupId: group.id }, select: { dayNumber: true } });

  return NextResponse.json({
    data: {
      ...group,
      memberships: undefined,
      myRole: membership.role,
      lockedDays: lockedDays.map((d) => d.dayNumber),
    },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const { group, membership } = await getGroupAndMembership(params.slug, session.id);
  if (!group) return notFound();
  if (!membership || membership.role !== "ADMIN") return forbidden();

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = UpdateGroupSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { name, ...settingsData } = parsed.data;

  const oldSettings = group.settings;

  // Update group name if provided
  if (name) {
    await prisma.group.update({ where: { id: group.id }, data: { name } });
  }

  // Update settings
  const settingsUpdate: Record<string, unknown> = {};
  if (settingsData.ramadanStartDate) settingsUpdate.ramadanStartDate = new Date(settingsData.ramadanStartDate);
  if (settingsData.numDays !== undefined) settingsUpdate.numDays = settingsData.numDays;
  if (settingsData.timezone) settingsUpdate.timezone = settingsData.timezone;
  if (settingsData.resetRule) settingsUpdate.resetRule = settingsData.resetRule;
  if (settingsData.editCutoffHour !== undefined) settingsUpdate.editCutoffHour = settingsData.editCutoffHour;
  if (settingsData.taraweehCap !== undefined) settingsUpdate.taraweehCap = settingsData.taraweehCap;
  if (settingsData.tahajjudCap !== undefined) settingsUpdate.tahajjudCap = settingsData.tahajjudCap;

  if (Object.keys(settingsUpdate).length > 0) {
    await prisma.groupSettings.update({ where: { groupId: group.id }, data: settingsUpdate });
  }

  const meta = getRequestMeta(req);
  await writeAuditLog({
    userId: session.id,
    groupId: group.id,
    actionType: "SETTINGS_UPDATE",
    entity: "GroupSettings",
    entityId: group.settings?.id,
    oldValue: oldSettings,
    newValue: { name, ...settingsData },
    ...meta,
  });

  return NextResponse.json({ message: "Settings updated" });
}
