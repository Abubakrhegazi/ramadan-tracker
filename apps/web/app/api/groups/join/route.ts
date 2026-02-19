// apps/web/app/api/groups/join/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { JoinGroupSchema } from "@shared/schemas";

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const { success } = rateLimit(req, { maxRequests: 10, windowMs: 60 * 1000, keyPrefix: "joingroup" });
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = JoinGroupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 400 });
  }

  const { inviteCode } = parsed.data;

  const group = await prisma.group.findUnique({ where: { inviteCode } });
  if (!group) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  const existing = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: session.id, groupId: group.id } },
  });

  if (existing) {
    return NextResponse.json({ data: { slug: group.slug, alreadyMember: true } });
  }

  await prisma.groupMembership.create({
    data: { userId: session.id, groupId: group.id, role: "MEMBER" },
  });

  return NextResponse.json({ data: { slug: group.slug, alreadyMember: false } }, { status: 201 });
}
