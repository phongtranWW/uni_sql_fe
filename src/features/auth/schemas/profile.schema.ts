import z from "zod";

export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
});
export type Profile = z.infer<typeof ProfileSchema>;