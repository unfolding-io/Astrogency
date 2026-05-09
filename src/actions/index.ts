import { defineAction } from "astro:actions";
import { newsletterInputSchema } from "./newsletter/schema";
import { handleNewsletter } from "./newsletter/handler";
import { contactInputSchema } from "./contact/schema";
import { handleContact } from "./contact/handler";

export const server = {
  newsletter: defineAction({
    input: newsletterInputSchema,
    handler: handleNewsletter,
  }),

  contact: defineAction({
    input: contactInputSchema,
    handler: handleContact,
  }),
};
