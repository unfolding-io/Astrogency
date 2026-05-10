import { z } from "astro/zod";

export const newsletterInputSchema = z.object({
  email: z.email(),
  name: z.string().optional(),
  opt_in: z.boolean(),
  lang: z.string().optional(),
  include_newsletter: z.boolean(),
  list_id: z.string().optional(),
  status: z.string().optional(),
});

export type NewsletterInput = z.infer<typeof newsletterInputSchema>;
