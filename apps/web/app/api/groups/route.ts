// apps/web/app/api/groups/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { CreateGroupSchema } from "@shared/schemas";

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorized();

  const { success } = rateLimit(req, { maxRequests: 5, windowMs: 60 * 60 * 1000, keyPrefix: "creategroup" });
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = CreateGroupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Validation failed" }, { status: 400 });
  }

  const { name, slug, ramadanStartDate, numDays, timezone, taraweehCap, tahajjudCap } = parsed.data;

  const existingSlug = await prisma.group.findUnique({ where: { slug } });
  if (existingSlug) {
    return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
  }

  const group = await prisma.group.create({
    data: {
      name,
      slug,
      settings: {
        create: {
          ramadanStartDate: new Date(ramadanStartDate),
          numDays,
          timezone: timezone || "Africa/Cairo",
          taraweehCap,
          tahajjudCap,
        },
      },
      memberships: {
        create: { userId: session.id, role: "ADMIN" },
      },
    },
    include: { settings: true },
  });

  return NextResponse.json({ data: group }, { status: 201 });
}
