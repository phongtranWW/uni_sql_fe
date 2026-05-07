import z from "zod";

export const EditorSettingsSchema = z.object({
  show: z.object({
    issuePanel: z.boolean(),
    sidebar: z.boolean(),
    minimap: z.boolean(),
    control: z.boolean(),
    autoFocus: z.boolean().default(false),
  }),
});

export type EditorSettings = z.infer<typeof EditorSettingsSchema>;
