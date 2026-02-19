// apps/web/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { LoginSchema } from "@shared/schemas";

export async function POST(req: NextRequest) {
  const { success } = rateLimit(req, {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000,
    keyPrefix: "login",
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

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // constant-time response
    await bcrypt.compare(password, "$2b$12$invalidhashtopreventtiming");
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSession({ id: user.id, email: user.email, name: user.name });
  const res = NextResponse.json({
    data: { id: user.id, email: user.email, name: user.name },
  });
  setSessionCookie(res, token);
  return res;
}
