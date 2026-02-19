// apps/web/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  clearSessionCookie(res);
  return res;
}
