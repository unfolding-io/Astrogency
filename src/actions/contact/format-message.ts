import type { ContactInput } from "./schema";

export function formatContactMessage(
  input: Pick<
    ContactInput,
    "topicName" | "lang" | "name" | "email" | "phone" | "message"
  >,
): string {
  const { topicName, lang, name, email, phone, message } = input;
  return `
Topic: ${topicName}
Lang: ${lang}
Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Message: ${message}
  `.trim();
}
