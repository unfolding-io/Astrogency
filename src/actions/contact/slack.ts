import type { ContactInput } from "./schema";

type SlackPostMessageResponse = {
  ok?: boolean;
  error?: string;
};

export async function sendContactSlack(
  input: ContactInput,
  formattedMessage: string,
) {
  const SLACK_TOKEN = import.meta.env.SLACK_TOKEN;
  if (!SLACK_TOKEN) {
    return {
      status: "env_missing" as const,
      message: "Missing Slack configuration",
    };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    Authorization: `Bearer ${SLACK_TOKEN}`,
  };

  const data = {
    channel: input.topicDestination,
    text: `Contact Form:\n\n${formattedMessage}`,
    icon_emoji: ":ok_hand:",
  };

  try {
    const resp = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const response = (await resp.json()) as SlackPostMessageResponse;

    return {
      statusCode: response.ok !== false ? 200 : 404,
      status: response.ok ? ("ok" as const) : ("error" as const),
      body:
        response.ok !== false
          ? "Your message was sent successfully! We'll be in touch."
          : response.error,
    };
  } catch (error) {
    console.error("Slack API error:", error);
    return {
      status: "error" as const,
      message: "An error occurred while sending the message",
    };
  }
}
