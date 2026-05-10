import { CONTACT_FORM_ENDPOINT } from "astro:env/server";
import type { ContactInput } from "./schema";
import { formatContactMessage } from "./format-message";
import { sendContactMailgun } from "./mailgun";
import { sendContactPostmark } from "./postmark";
import { sendContactSlack } from "./slack";

export async function handleContact(input: ContactInput) {
  if (CONTACT_FORM_ENDPOINT === "none") {
    return {
      status: "env_missing" as const,
      message: "No contact form provider found",
    };
  }

  const formattedMessage = formatContactMessage(input);

  if (CONTACT_FORM_ENDPOINT === "mailgun") {
    return sendContactMailgun(input, formattedMessage);
  }

  if (CONTACT_FORM_ENDPOINT === "postmark") {
    return sendContactPostmark(input, formattedMessage);
  }

  if (CONTACT_FORM_ENDPOINT === "slack") {
    return sendContactSlack(input, formattedMessage);
  }

  return {
    status: "error" as const,
    message: "Unsupported contact form provider",
  };
}
