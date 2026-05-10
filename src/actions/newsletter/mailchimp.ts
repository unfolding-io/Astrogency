import mailchimp from "@mailchimp/mailchimp_marketing";
import { MAILCHIMP_SERVER_PREFIX } from "astro:env/server";
import type { NewsletterInput } from "./schema";

type MailchimpMemberResponse = { status?: string };

function createListEntry(
  email: string,
  name: string | undefined,
  listId: string,
  status: "pending" | "subscribed",
): MailchimpListEntry {
  return {
    list_id: listId,
    status,
    email: email.toLowerCase(),
    merge_fields: { FNAME: name ?? "" },
  };
}

export async function runMailchimpNewsletter(
  input: NewsletterInput,
  apiKey: string,
  defaultListId: string,
) {
  const { email, name, opt_in, include_newsletter, list_id } = input;

  mailchimp.setConfig({
    apiKey,
    server: MAILCHIMP_SERVER_PREFIX,
  });

  const lists: MailchimpListEntry[] = [];

  if (list_id && list_id !== "") {
    lists.push(
      createListEntry(email, name, list_id, opt_in ? "pending" : "subscribed"),
    );
  }
  if (include_newsletter) {
    lists.push(createListEntry(email, name, defaultListId, "pending"));
  }

  try {
    const results = (await Promise.all(
      lists.map((data) =>
        mailchimp.lists.setListMember(data.list_id, data.email, {
          email_address: data.email,
          status_if_new: data.status,
          merge_fields: data.merge_fields,
        }),
      ),
    )) as MailchimpMemberResponse[];

    const allSubscribed = results.every((response) =>
      ["subscribed", "pending"].includes(response.status ?? ""),
    );

    return {
      message: "ok" as const,
      status:
        results.length === 1
          ? results[0].status
          : allSubscribed
            ? "pending"
            : "error",
    };
  } catch (error: unknown) {
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : undefined;

    console.error("Mailchimp API error:", status);

    if (status === 404) {
      return {
        status: "error" as const,
        message: "The list ID does not exist",
      };
    }
    return {
      status: "error" as const,
      message: "An error occurred",
    };
  }
}
