// apps/web/app/page.tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LandingContent } from "@/components/LandingContent";

export default async function LandingPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return <LandingContent />;
}
