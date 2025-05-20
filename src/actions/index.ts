import { defineAction } from "astro:actions";
import mailchimp from "@mailchimp/mailchimp_marketing";
import { z } from "astro:schema";
/* TODO debug getSecret netlify bug */
import {
  MAILGUN_API_URL,
  MAILGUN_DOMAIN,
  FROM_EMAIL_ADDRESS,
  CONTACT_FORM_ENDPOINT,
  MAILCHIMP_SERVER_PREFIX,
  MAILCHIMP_LIST_ID,
  NEWSLETTER_ENDPOINT,
  /* getSecret, */
} from "astro:env/server";

export const server = {
  newsletter: defineAction({
    input: z.object({
      email: z.string().email(),
      name: z.string().optional(),
      opt_in: z.boolean(),
      lang: z.string().optional(),
      include_newsletter: z.boolean(),
      list_id: z.string().optional(),
      status: z.string().optional(),
    }),
    handler: async ({ email, name, opt_in, include_newsletter, list_id }) => {
      if (NEWSLETTER_ENDPOINT === "none") {
        return {
          status: "env_missing",
          message: "No newsletter form provider found",
        };
      }

      if (NEWSLETTER_ENDPOINT !== "mailchimp") {
        return { status: "error", message: "Unsupported newsletter provider" };
      }
      /* TODO debug getSecret netlify bug */
      /*  const MAILCHIMP_API_KEY = getSecret("MAILCHIMP_API_KEY"); */
      const MAILCHIMP_API_KEY = import.meta.env.MAILCHIMP_API_KEY;
      if (
        !MAILCHIMP_API_KEY ||
        !MAILCHIMP_SERVER_PREFIX ||
        !MAILCHIMP_LIST_ID
      ) {
        return {
          status: "env_missing",
          message: "Missing Mailchimp configuration",
        };
      }

      mailchimp.setConfig({
        apiKey: MAILCHIMP_API_KEY,
        server: MAILCHIMP_SERVER_PREFIX,
      });

      const createListEntry = (
        listId: string,
        status: "pending" | "subscribed",
      ) => ({
        list_id: listId,
        status: status,
        email: email.toLowerCase(),
        merge_fields: { FNAME: name },
      });

      const lists: MailchimpListEntry[] = [];

      if (list_id && list_id !== "") {
        lists.push(createListEntry(list_id, opt_in ? "pending" : "subscribed"));
      }
      if (include_newsletter) {
        lists.push(createListEntry(MAILCHIMP_LIST_ID, "pending"));
      }

      try {
        const results = await Promise.all(
          lists.map(async (data) => {
            const response = await mailchimp.lists.setListMember(
              data.list_id,
              data.email,
              {
                email_address: data.email,
                status_if_new: data.status,
                merge_fields: data.merge_fields,
              },
            );
            return response;
          }),
        );

        const allSubscribed = results.every((response: any) =>
          ["subscribed", "pending"].includes(response.status),
        );

        return {
          message: "ok",
          status:
            results.length === 1
              ? results[0].status
              : allSubscribed
                ? "pending"
                : "error",
        };
      } catch (error: any) {
        console.error("Mailchimp API error:", error?.status, "end_error!!!!");

        if (error?.status == 404) {
          return {
            status: "error",
            message: "The list ID does not exist",
          };
        }
        return {
          status: "error",
          message: "An error occurred",
        };
      }
    },
  }),

  contact: defineAction({
    input: z.object({
      email: z.string().email(),
      name: z.string(),
      phone: z.string().optional(),
      message: z.string(),
      topicName: z.string(),
      topicDestination: z.string(),
      lang: z.string(),
    }),
    handler: async ({
      email,
      topicName,
      topicDestination,
      name,
      phone,
      message,
      lang,
    }) => {

      
      if (CONTACT_FORM_ENDPOINT === "none") {
        return {
          status: "env_missing",
          message: "No contact form provider found",
        };
      }

      const formattedMessage = `
Topic: ${topicName}
Lang: ${lang}
Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Message: ${message}
      `.trim();
      /* MAILGUN */
      if (CONTACT_FORM_ENDPOINT === "mailgun") {
        /*  const MAILGUN_API_KEY = getSecret("MAILGUN_API_KEY"); */
        const MAILGUN_API_KEY = import.meta.env.MAILGUN_API_KEY;
        if (
          !MAILGUN_API_KEY ||
          !MAILGUN_API_URL ||
          !MAILGUN_DOMAIN ||
          !FROM_EMAIL_ADDRESS
        ) {
          console.log("MAILGUN_API_KEY", MAILGUN_API_KEY);
          console.log("MAILGUN_API_URL", MAILGUN_API_URL);
          console.log("MAILGUN_DOMAIN", MAILGUN_DOMAIN);
          console.log("FROM_EMAIL_ADDRESS", FROM_EMAIL_ADDRESS);
          return {
            status: "env_missing",
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
          to: topicDestination,
          "h:Reply-To": email,
          subject: `Contact Form | ${topicName}: ${name} ${email}`,
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

          const response = await resp.json();

          return {
            statusCode: resp.ok ? 200 : response.ErrorCode,
            status: resp.ok ? "ok" : "error",
            body: resp.ok
              ? "Your message was sent successfully! We'll be in touch."
              : response.Message,
          };
        } catch (error) {
          console.error("Mailgun API error:", error);
          return {
            status: "error",
            message: "An error occurred while sending the message",
          };
        }
      }
      /* POSTMARK */
      if (CONTACT_FORM_ENDPOINT === "postmark") {
        /* const POSTMARK_SERVER_TOKEN = getSecret("POSTMARK_SERVER_TOKEN"); */
        const POSTMARK_SERVER_TOKEN = import.meta.env.POSTMARK_SERVER_TOKEN;

        if (!POSTMARK_SERVER_TOKEN || !FROM_EMAIL_ADDRESS) {
          return {
            status: "env_missing",
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
          To: topicDestination,
          Subject: `Contact Form | ${topicName}: ${name} ${email}`,
          TextBody: formattedMessage,
          MessageStream: "broadcast",
        };

        try {
          const resp = await fetch(`https://api.postmarkapp.com/email`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(emailObject),
          });

          let response = await resp.json();

          return {
            statusCode: resp.ok ? 200 : response.ErrorCode,
            status: resp.ok ? "ok" : "error",
            body: resp.ok
              ? "Your message was sent successfully! We'll be in touch."
              : response.Message,
          };
        } catch (error) {
          console.error("Postmark API error:", error);
          return {
            status: "error",
            message: "An error occurred while sending the message",
          };
        }
      }
      /* SLACK */
      if (CONTACT_FORM_ENDPOINT === "slack") {
        /*  const SLACK_TOKEN = getSecret("SLACK_TOKEN"); */
        const SLACK_TOKEN = import.meta.env.SLACK_TOKEN;
        if (!SLACK_TOKEN) {
          return {
            status: "env_missing",
            message: "Missing Slack configuration",
          };
        }

        const formUrl = "https://slack.com/api/chat.postMessage";

        const headers = {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          Authorization: `Bearer ${SLACK_TOKEN}`,
        };

        const data = {
          channel: topicDestination,
          text: `Contact Form: \n \n ${formattedMessage}`,
          icon_emoji: ":ok_hand:",
        };

        try {
          const resp = await fetch(formUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
          });

          const response = await resp.json();

          return {
            statusCode: response.ok !== false ? 200 : 404,
            status: response.ok ? "ok" : "error",
            body:
              response.ok !== false
                ? "Your message was sent successfully! We'll be in touch."
                : response.error,
          };
        } catch (error) {
          console.error("Slack API error:", error);
          return {
            status: "error",
            message: "An error occurred while sending the message",
          };
        }
      }

      return { status: "error", message: "Unsupported contact form provider" };
    },
  }),
};
