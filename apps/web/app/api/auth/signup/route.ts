// apps/web/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { SignupSchema } from "@shared/schemas";

export async function POST(req: NextRequest) {
  const { success } = rateLimit(req, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    keyPrefix: "signup",
  });
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Validation failed" },
      { status: 400 }
    );
  }

  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  const token = await createSession({ id: user.id, email: user.email, name: user.name });
  const res = NextResponse.json(
    { data: { id: user.id, email: user.email, name: user.name } },
    { status: 201 }
  );
  setSessionCookie(res, token);
  return res;
}
