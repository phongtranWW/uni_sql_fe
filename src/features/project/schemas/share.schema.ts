import { z } from "zod";

// ─── Share User ───────────────────────────────────────────────────────────────
export const ShareUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
  avatar: z.string().optional(),
});

// ─── Share Item ───────────────────────────────────────────────────────────────
export const ShareSchema = z.object({
  userId: z.string(),
  expiresAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  user: ShareUserSchema.optional(),
});

// ─── Share List ───────────────────────────────────────────────────────────────
export const ShareListSchema = z.array(ShareSchema);

// ─── Share Payload ────────────────────────────────────────────────────────────
export const SharePayloadSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1),
  expiresAt: z.string().datetime().optional(),
});

export type ShareUser = z.infer<typeof ShareUserSchema>;
export type Share = z.infer<typeof ShareSchema>;
export type ShareList = z.infer<typeof ShareListSchema>;
export type SharePayload = z.infer<typeof SharePayloadSchema>;
