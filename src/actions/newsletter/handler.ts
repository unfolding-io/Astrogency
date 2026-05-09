import {
  MAILCHIMP_LIST_ID,
  MAILCHIMP_SERVER_PREFIX,
  NEWSLETTER_ENDPOINT,
} from "astro:env/server";
import type { NewsletterInput } from "./schema";
import { runMailchimpNewsletter } from "./mailchimp";

export async function handleNewsletter(input: NewsletterInput) {
  if (NEWSLETTER_ENDPOINT === "none") {
    return {
      status: "env_missing" as const,
      message: "No newsletter form provider found",
    };
  }

  if (NEWSLETTER_ENDPOINT !== "mailchimp") {
    return {
      status: "error" as const,
      message: "Unsupported newsletter provider",
    };
  }

  const MAILCHIMP_API_KEY = import.meta.env.MAILCHIMP_API_KEY;
  if (
    !MAILCHIMP_API_KEY ||
    !MAILCHIMP_SERVER_PREFIX ||
    !MAILCHIMP_LIST_ID
  ) {
    return {
      status: "env_missing" as const,
      message: "Missing Mailchimp configuration",
    };
  }

  return runMailchimpNewsletter(input, MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID);
}
