// apps/web/app/api/groups/[slug]/leaderboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, forbidden, notFound } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeOverallLeaderboard, computeDailyLeaderboard } from "@/lib/leaderboard";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const group = await prisma.group.findUnique({
    where: { slug: params.slug },
    include: { settings: true },
  });
  if (!group || !group.settings) return notFound();

  const membership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: session.id, groupId: group.id } },
  });
  if (!membership) return forbidden();

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "overall"; // overall | daily | weekly
  const day = url.searchParams.get("day");

  const settings = group.settings as any;

  let leaderboard;
  if (type === "daily" && day) {
    leaderboard = await computeDailyLeaderboard(group.id, parseInt(day), settings);
  } else {
    leaderboard = await computeOverallLeaderboard(group.id, settings);
  }

  return NextResponse.json({ data: leaderboard });
}
