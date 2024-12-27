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
} from "./storyBlockSchema";

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
  schema: z.object({
    surface_footer: z.string(),
    surface_page: z.string(),
    surface_menu: z.string(),
    contact_form: z.array(
      z.object({
        content: z.any(),
        container: z.string(),
        topic: z.union([z.string(), z.object({})]),
        show_topics: z.boolean(),
        thank_you: z.string(),
        surface: z.string(),
        component: z.string(),
        _uid: z.string(),
      }),
    ),
    newsletter_in_footer: z.boolean(),
    newsletter_content: z.any().optional(),
    newsletter_thank_you: z.string(),
    main_menu: z.array(
      z.object({
        label: z.string(),
        href: z.any(),
        icon: z.string().optional(),
        surface: z.string().optional(),
        hide_label: z.boolean().optional(),
        component: z.string(),
        _uid: z.string(),
      }),
    ),
    footer_text: z.any().optional(),
    footer_menu_1_label: z.string().optional(),
    footer_menu_1: z.array(
      z.object({
        label: z.string(),
        href: z.any(),
        icon: z.string().optional(),
        surface: z.string().optional(),
        hide_label: z.boolean().optional(),
        component: z.string(),
        _uid: z.string(),
      }),
    ),
    footer_menu_2_label: z.string().optional(),
    footer_menu_2: z.array(
      z.object({
        label: z.string(),
        href: z.any(),
        icon: z.string().optional(),
        surface: z.string().optional(),
        hide_label: z.boolean().optional(),
        component: z.string(),
        _uid: z.string(),
      }),
    ),
    links: z.array(
      z.object({
        label: z.string(),
        href: z.any(),
        icon: z.string().optional(),
        surface: z.string().optional(),
        hide_label: z.boolean().optional(),
        component: z.string(),
        _uid: z.string(),
      }),
    ),
    company_name: z.string(),
    address: z.string(),
    font_headings: z.union([z.number(), z.string()]),
    font_weight_headings: z.union([z.string(), z.number()]),
    font_body: z.union([z.number(), z.string()]),
    font_weight_body: z.union([z.string(), z.number()]),
    blog_title: z.string(),
    blog_content: z.any().optional(),
    blog_og_title: z.string(),
    blog_og_description: z.string(),
    blog_og_image: z.object({
      alt: z.string(),
      copyright: z.string(),
      fieldtype: z.string(),
      id: z.number(),
      filename: z.string(),
      name: z.string(),
      title: z.string(),
      meta_data: z.record(z.any()),
      source: z.string().optional(),
      is_external_url: z.boolean().optional(),
      src: z.string().optional(),
    }),
    work_title: z.string(),
    work_content: z.any().optional(),
    work_og_title: z.string(),
    work_og_description: z.string(),
    work_og_image: z.object({
      alt: z.string(),
      copyright: z.string(),
      fieldtype: z.string(),
      id: z.number(),
      filename: z.string(),
      name: z.string(),
      title: z.string(),
      meta_data: z.record(z.any()),
      source: z.string().optional(),
      is_external_url: z.boolean().optional(),
      src: z.string().optional(),
    }),
    email: z.string(),
    phone: z.string(),
    phone_label: z.string(),
    whatsapp: z.string(),

    dark_fg: z.any(),
    dark_bg: z.any(),
    light_fg: z.any(),
    light_bg: z.any(),
    primary_fg: z.any(),
    primary_bg: z.any(),
    secondary_fg: z.any(),
    secondary_bg: z.any(),
    accent_fg: z.any(),
    accent_bg: z.any(),
    info_fg: z.any(),
    info_bg: z.any(),
    warning_fg: z.any(),
    warning_bg: z.any(),
    danger_fg: z.any(),
    danger_bg: z.any(),
    success_fg: z.any(),
    success_bg: z.any(),
    muted_fg: z.any(),
    muted_bg: z.any(),
    tiny_analytics_id: z.string().optional(),
    radius_media: z.string().or(z.number()).optional(),
    radius_input: z.string().or(z.number()).optional(),
  }),
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

export const collections = {
  page,
  post,
  work,
  service,
  work_category,
  blog_category,
  locales,
  settings,
};
