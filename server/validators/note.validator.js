import { z } from "zod";

export const NoteSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(15)
    .trim()
    .transform((title) => {
      return title.charAt(0).toUpperCase() + title.slice(1);
    }),
  description: z.string().max(100).optional().nullable(),
});
