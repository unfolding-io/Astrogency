import {
  FROM_EMAIL_ADDRESS,
  MAILGUN_API_URL,
  MAILGUN_DOMAIN,
} from "astro:env/server";
import type { ContactInput } from "./schema";

type MailgunErrorBody = { ErrorCode?: number; Message?: string };

export async function sendContactMailgun(
  input: ContactInput,
  formattedMessage: string,
) {
  const MAILGUN_API_KEY = import.meta.env.MAILGUN_API_KEY;
  if (
    !MAILGUN_API_KEY ||
    !MAILGUN_API_URL ||
    !MAILGUN_DOMAIN ||
    !FROM_EMAIL_ADDRESS
  ) {
    return {
      status: "env_missing" as const,
      message: "Missing Mailgun configuration",
    };
  }

  const authHeader = `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`;
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: authHeader,
  };

  const payload = new URLSearchParams({
    from: FROM_EMAIL_ADDRESS,
    to: input.topicDestination,
    "h:Reply-To": input.email,
    subject: `Contact Form | ${input.topicName}: ${input.name} ${input.email}`,
    text: formattedMessage,
  });

  try {
    const resp = await fetch(
      `${MAILGUN_API_URL}/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers,
        body: payload,
      },
    );

    const response = (await resp.json()) as MailgunErrorBody;

    return {
      statusCode: resp.ok ? 200 : response.ErrorCode,
      status: resp.ok ? ("ok" as const) : ("error" as const),
      body: resp.ok
        ? "Your message was sent successfully! We'll be in touch."
        : response.Message,
    };
  } catch (error) {
    console.error("Mailgun API error:", error);
    return {
      status: "error" as const,
      message: "An error occurred while sending the message",
    };
  }
}
