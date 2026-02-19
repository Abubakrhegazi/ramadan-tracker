// packages/shared/schemas/index.ts
import { z } from "zod";

export const SignupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
  name: z.string().min(2, "Name too short").max(80),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const CreateGroupSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  ramadanStartDate: z.string().datetime({ offset: true }).or(z.string().date()),
  numDays: z.number().int().min(29).max(30).default(30),
  timezone: z.string().default("Africa/Cairo"),
  taraweehCap: z.number().int().min(0).max(20).default(11),
  tahajjudCap: z.number().int().min(0).max(20).default(11),
});

export const UpdateGroupSettingsSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  ramadanStartDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().date())
    .optional(),
  numDays: z.number().int().min(29).max(30).optional(),
  timezone: z.string().optional(),
  resetRule: z.enum(["MIDNIGHT", "MAGHRIB"]).optional(),
  editCutoffHour: z.number().int().min(0).max(23).optional(),
  taraweehCap: z.number().int().min(0).max(20).optional(),
  tahajjudCap: z.number().int().min(0).max(20).optional(),
});

export const JoinGroupSchema = z.object({
  inviteCode: z.string().min(1).max(100),
});

export const UpsertLogSchema = z.object({
  taraweehRakaat: z.number().int().min(0).max(20),
  tahajjudRakaat: z.number().int().min(0).max(20),
  quranPages: z.number().int().min(0).max(20),
  notes: z.string().max(500).optional(),
});

export const AdminOverrideLogSchema = UpsertLogSchema.extend({
  userId: z.string(),
  dayNumber: z.number().int().min(1).max(30),
  reason: z.string().min(1).max(500),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;
export type UpdateGroupSettingsInput = z.infer<typeof UpdateGroupSettingsSchema>;
export type JoinGroupInput = z.infer<typeof JoinGroupSchema>;
export type UpsertLogInput = z.infer<typeof UpsertLogSchema>;
export type AdminOverrideLogInput = z.infer<typeof AdminOverrideLogSchema>;
