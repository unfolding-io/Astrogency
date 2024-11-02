import { defineAction } from "astro:actions";

export const server = {
  newsletter: defineAction({
    handler: async ({}) => {
      return {
        status: "premium_missing",
        message: "Please upgrade and install premium components and actions",
      };
    },
  }),

  contact: defineAction({
    handler: async ({}) => {
      return {
        status: "premium_missing",
        message: "Please upgrade and install premium components and actions",
      };
    },
  }),
};
