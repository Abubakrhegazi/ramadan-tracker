// apps/web/lib/audit.ts
import { prisma } from "./prisma";
import type { ActionType } from "@shared/types";

interface AuditParams {
  userId?: string;
  groupId: string;
  actionType: ActionType;
  entity: string;
  entityId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  ip?: string;
  userAgent?: string;
}

export async function writeAuditLog(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        groupId: params.groupId,
        actionType: params.actionType as any,
        entity: params.entity,
        entityId: params.entityId,
        oldValue: params.oldValue ? JSON.parse(JSON.stringify(params.oldValue)) : undefined,
        newValue: params.newValue ? JSON.parse(JSON.stringify(params.newValue)) : undefined,
        ip: params.ip,
        userAgent: params.userAgent,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

export function getRequestMeta(req: Request): { ip?: string; userAgent?: string } {
  const ip =
    (req.headers as any).get?.("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req.headers as any).get?.("x-real-ip") ||
    undefined;
  const userAgent = (req.headers as any).get?.("user-agent") || undefined;
  return { ip, userAgent };
}
