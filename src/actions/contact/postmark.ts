import { FROM_EMAIL_ADDRESS } from "astro:env/server";
import type { ContactInput } from "./schema";

type PostmarkErrorBody = { ErrorCode?: number; Message?: string };

export async function sendContactPostmark(
  input: ContactInput,
  formattedMessage: string,
) {
  const POSTMARK_SERVER_TOKEN = import.meta.env.POSTMARK_SERVER_TOKEN;

  if (!POSTMARK_SERVER_TOKEN || !FROM_EMAIL_ADDRESS) {
    return {
      status: "env_missing" as const,
      message: "Missing Postmark configuration",
    };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    "X-Postmark-Server-Token": POSTMARK_SERVER_TOKEN,
  };

  const emailObject = {
    From: FROM_EMAIL_ADDRESS,
    To: input.topicDestination,
    Subject: `Contact Form | ${input.topicName}: ${input.name} ${input.email}`,
    TextBody: formattedMessage,
    MessageStream: "broadcast",
  };

  try {
    const resp = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers,
      body: JSON.stringify(emailObject),
    });

    const response = (await resp.json()) as PostmarkErrorBody;

    return {
      statusCode: resp.ok ? 200 : response.ErrorCode,
      status: resp.ok ? ("ok" as const) : ("error" as const),
      body: resp.ok
        ? "Your message was sent successfully! We'll be in touch."
        : response.Message,
    };
  } catch (error) {
    console.error("Postmark API error:", error);
    return {
      status: "error" as const,
      message: "An error occurred while sending the message",
    };
  }
}
