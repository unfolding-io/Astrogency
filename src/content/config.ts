import { defineCollection, z } from "astro:content";
import { getSettings, getLocales, getCollectionData } from "@lib/storyblokApi";
/* This is the first start on migrating to the data layer (WIP) */
import {
  pageSchema,
  postSchema,
  workSchema,
  serviceSchema,
  workCategorySchema,
  blogCategorySchema,
  contactTopicsSchema,
  stackSchema,
  settingsSchema,
} from "./storyBlockSchema";

//check if the settings are valid
const isSetup = await getSettings(
  undefined,
);

if (!!isSetup.setup) {
  console.log("No settings found");
  throw new Error("No settings found, Import all data sources, components and stories, then restart the server.");
}

// Define entry types


const siteLocales = await getLocales();

/* First experiment on using a data layer on settings */
const settings = defineCollection({
  loader: async () => {
    const data = await Promise.all(
      siteLocales.map(async (lang) => {
        const settings = await getSettings(
          lang === siteLocales[0] ? undefined : lang,
        );
        return {
          id: lang,
          lang: lang,
          ...settings,
        };
      }),
    );
    return data;
  },
  schema: z.union([settingsSchema, z.null()])
});

const page = defineCollection({
  loader: async () => {
    const data = await Promise.all(
      siteLocales.map(async (lang) => {
        const pages = await getCollectionData({
          lang: lang === siteLocales[0] ? undefined : lang,
          collection: "page",
          status: import.meta.env.DEV ? "draft" : "published",
        });
        return pages.map((page) => {
          return {
            id: `${lang}/${page.uuid}`,
            lang: lang,
            ...page,
          };
        });
      }),
    );
    return data.flat();
  },
  schema: pageSchema,
});

const post = defineCollection({
  loader: async () => {
    const data = await Promise.all(
      siteLocales.map(async (lang) => {
        const posts = await getCollectionData({
          lang: lang === siteLocales[0] ? undefined : lang,
          collection: "post",
          status: import.meta.env.DEV ? "draft" : "published",
        });
        return posts.map((page) => {
          return {
            id: `${lang}/${page.uuid}`,
            lang: lang,
            ...page,
          };
        });
      }),
    );
    return data.flat();
  },
  schema: postSchema,
});

const work = defineCollection({
  loader: async () => {
    const data = await Promise.all(
      siteLocales.map(async (lang) => {
        const posts = await getCollectionData({
          lang: lang === siteLocales[0] ? undefined : lang,
          collection: "work",
          status: import.meta.env.DEV ? "draft" : "published",
        });
        return posts.map((page) => {
          return {
            id: `${lang}/${page.uuid}`,
            lang: lang,
            ...page,
          };
        });
      }),
    );
    return data.flat();
  },
  schema: workSchema,
});

const service = defineCollection({
  loader: async () => {
    const data = await Promise.all(
      siteLocales.map(async (lang) => {
        const posts = await getCollectionData({
          lang: lang === siteLocales[0] ? undefined : lang,
          collection: "service",
          status: import.meta.env.DEV ? "draft" : "published",
        });
        return posts.map((page) => {
          return {
            id: `${lang}/${page.uuid}`,
            lang: lang,
            ...page,
          };
        });
      }),
    );
    return data.flat();
  },
  schema: serviceSchema,
});

const work_category = defineCollection({
  loader: async () => {
    const data = await Promise.all(
      siteLocales.map(async (lang) => {
        const posts = await getCollectionData({
          lang: lang === siteLocales[0] ? undefined : lang,
          collection: "work_category",
          status: import.meta.env.DEV ? "draft" : "published",
        });
        return posts.map((page) => {
          return {
            id: `${lang}/${page.uuid}`,
            lang: lang,
            ...page,
          };
        });
      }),
    );
    return data.flat();
  },
  schema: workCategorySchema,
});

const blog_category = defineCollection({
  loader: async () => {
    const data = await Promise.all(
      siteLocales.map(async (lang) => {
        const posts = await getCollectionData({
          lang: lang === siteLocales[0] ? undefined : lang,
          collection: "blog_category",
          status: import.meta.env.DEV ? "draft" : "published",
        });
        return posts.map((page) => {
          return {
            id: `${lang}/${page.uuid}`,
            lang: lang,
            ...page,
          };
        });
      }),
    );
    return data.flat();
  },
  schema: blogCategorySchema,
});

const locales = defineCollection({
  loader: () => {
    return siteLocales.map((locale) => {
      return {
        id: locale,
        lang: locale,
      };
    });
  },
  schema: z.object({
    id: z.string(),
    lang: z.string(),
  }),
});


const contact_topics = defineCollection({
  loader: async () => {
    const data = await Promise.all(
      siteLocales.map(async (lang) => {
        const posts = await getCollectionData({
          lang: lang === siteLocales[0] ? undefined : lang,
          collection: "contact_topics",
          status: import.meta.env.DEV ? "draft" : "published",
        });
        return posts.map((page) => {
          return {
            id: `${lang}/${page.uuid}`,
            lang: lang,
            ...page,
          };
        });
      }),
    );
    return data.flat();
  },
  schema: contactTopicsSchema,
});

const stack = defineCollection({
  loader: async () => {
    const data = await Promise.all(
      siteLocales.map(async (lang) => {
        const posts = await getCollectionData({
          lang: lang === siteLocales[0] ? undefined : lang,
          collection: "stack",
          status: import.meta.env.DEV ? "draft" : "published",
        });
        return posts.map((page) => {
          return {
            id: `${lang}/${page.uuid}`,
            lang: lang,
            ...page,
          };
        });
      }),
    );
    return data.flat();
  },
  schema: stackSchema,
});

export const collections = {
  page,
  post,
  work,
  service,
  work_category,
  blog_category,
  locales,
  settings,
  contact_topics,
  stack,
};
