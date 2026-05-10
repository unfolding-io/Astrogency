import { z } from "astro/zod";

export const contactInputSchema = z.object({
  email: z.email(),
  name: z.string(),
  phone: z.string().optional(),
  message: z.string(),
  topicName: z.string(),
  topicDestination: z.string(),
  lang: z.string(),
});

export type ContactInput = z.infer<typeof contactInputSchema>;
