import { useStoryblokApi } from "@storyblok/astro";

import StoryblokClient from "storyblok-js-client";
import type { ISbStoryData, ISbResult } from "@storyblok/astro";
import slugify from "@sindresorhus/slugify";
import {
  STORYBLOK_SPACE_ID,
  STORYBLOK_REGION,
  /* getSecret, */
} from "astro:env/server";
import { SITE_LANG } from "astro:env/client";

/* const token = getSecret("STORYBLOK_PERSONAL_TOKEN");
const previewToken = getSecret("STORYBLOK_PREVIEW_TOKEN"); */
const token = import.meta.env.STORYBLOK_PERSONAL_TOKEN;
const previewToken = import.meta.env.STORYBLOK_PREVIEW_TOKEN;

const Storyblok = new StoryblokClient({
  oauthToken: token,
  region: STORYBLOK_REGION,
});

const StoryblokApi = new StoryblokClient({
  accessToken: previewToken,
  region: STORYBLOK_REGION, // Possible values: "ap", "eu", "us", "ca", "cn" (Default: "eu")
});

export async function getLocales() {
  const { data } = (await StoryblokApi.get("cdn/spaces/me", {})) as SpaceObj;
  return [SITE_LANG, ...data.space.language_codes];
}

export const getIdFromContent = (content: any) => {
  if (!content) return "div_" + new Date().getTime().toString(36);
  const firstContent = content?.content?.[0]?.content?.[0];
  if (firstContent) {
    return slugify(firstContent.text);
  }
  return "div_" + new Date().getTime().toString(36);
};

function extractDataSlug(slug: string, lang: string) {
  if (lang === SITE_LANG) return slug.replace(/\/$/, "");
  return slug.replace(`${lang}/`, "");
}

export async function collectionToRoutes(collection:any[]) {
  return collection.map((item:any) => {
    return {
      params: {
        lang: item.data.lang === SITE_LANG ? undefined : item.data.lang,
        slug:
          item.data.slug === "index"
            ? undefined
            : extractDataSlug(item.data.full_slug, item.data.lang),
      },
      props: {
        full_slug: item.data.full_slug,
        lang: item.data.lang,
        component: item.data.component,
        id: item.id,
      },
    };
  });
}

export const getSettings = async (lang: string | undefined) => {
  try {
    const { data: settingsData } = (await StoryblokApi.get(
      "cdn/stories/site-settings/settings",
      {
        version: import.meta.env.DEV ? "draft" : "published",
        language: !lang ? "default" : lang,
      },
    )) as ISbResult;

    return settingsData?.story?.content as SettingsStoryblok;
  } catch (e) {
    return {
      setup: true,
    };
  }
};

/* FOR CMS ROUTE */
export const getPage = async (
  slug: string | undefined,
  lang: string | undefined,
) => {
  const api = useStoryblokApi();

  const { data } = (await api.get(
    `cdn/stories/${slug !== undefined ? slug : "index"}`,
    {
      version: "draft",
      language: !lang ? "default" : lang,
    },
  )) as ISbResult;
  return data.story.content;
};

export async function getCollectionData({
  lang,
  collection,
  status,
}: {
  lang: string | undefined;
  collection: string;
  status: "draft" | "published" | undefined;
}) {
  const stories = await getData(lang, collection, status);
  const work_categories = await getData(lang, "work_category", status);
  const blog_categories = await getData(lang, "blog_category", status);
  const work_services = await getData(lang, "service", status);

  let categories:BlogCategoryData[] | WorkCategoryData[] = [], services:ServiceData[] = [];
  return stories.flatMap((story) => {
    if (story.component === "post") {
     
      categories = blog_categories.filter((c) =>
        story?.category?.includes(c.uuid),
      );
    } 
    if(story.component === "work") {
      categories = work_categories.filter((c) =>
        story?.category?.includes(c.uuid),
      );
      services = work_services.filter((c) =>
        story?.services?.includes(c.uuid),
      );
    }
    return {
      ...story,
      categories,
      services,
    };
  });
}

/* GET COLLECTION DATA */
export const getData = async (
  lang: string | undefined,
  collection: string,
  status: "draft" | "published" | undefined,
) => {
  const per_page = 50;
  let stories:any[] = [];
  let page = 1; // Initialize page counter

  while (true) {
    const data = (await StoryblokApi.get(`cdn/stories`, {
      version: status || "published",
      content_type: collection,
      language: lang,
      per_page,
      page: page,
    })) as any;

    stories = [...stories, ...(data.data.stories as any)];

    if (data.data.stories.length < per_page) {
      break;
    }
    page++; // Increment page counter after each loop
  }

  const data = stories.flatMap((story) => {
    return {
      uuid: story.uuid,
      slug: story.slug,
      full_slug: story.full_slug,
      dataSlug: story.slug,
      ...story.content,
    };
  });
  return data;
};






export const pullDataSources = async () => {
  try {
    const dataSources = await Storyblok.get(
      `/spaces/${STORYBLOK_SPACE_ID}/datasources/`,
      {
        per_page: 100,
      },
    );

    let result: DataSource[] | [] = [];

    if (
      dataSources &&
      dataSources?.data?.datasources &&
      dataSources.data.datasources.length > 0
    ) {
      result = await Promise.all(
        dataSources.data.datasources.map(async (ds: any) => {
          const params: IStoryblokDatasourceParams = {
            datasource_id: ds.id,
          };
          const data = (await Storyblok.get(
            `/spaces/${STORYBLOK_SPACE_ID}/datasource_entries/`,
            {
              ...params,
              per_page: 100,
            },
          )) as any;
          return {
            name: ds.name,
            slug: ds.slug,
            dimensions: [],
            datasource_entries: data?.data?.datasource_entries.map(
              (entry: DataSourceEntry) => {
                return {
                  name: entry.name,
                  value: entry.value,
                };
              },
            ),
          };
        }),
      );
    }

    return result;
  } catch (e) {
    console.error("ERROR:::", e);
    return [];
  }
};

export const pushDataSources = async (
  data: DataSource[],
  current: DataSource[],
) => {
  if (!data) return;

  for (const item of data) {
    if (!current || !current.some((ds: DataSource) => ds.slug === item.slug)) {
      const params: any = {
        datasource: {
          name: item.name,
          slug: item.slug,
        },
      };

      const datasources = (await Storyblok.post(
        `/spaces/${STORYBLOK_SPACE_ID}/datasources/`,
        params,
      )) as any;
      if (datasources.data.datasource) {
        await Promise.all(
          item.datasource_entries.map(async (entry: DataSourceEntry) => {
            const params: any = {
              datasource_entry: {
                datasource_id: datasources.data.datasource.id,
                name: entry.name,
                value: entry.value,
              },
            };

            await Storyblok.post(
              `/spaces/${STORYBLOK_SPACE_ID}/datasource_entries/`,
              params,
            );
          }),
        );
      }
    }
  }

  return { ok: "ok" };
};

export const removeDataSources = async () => {
  const dataSources = await Storyblok.get(
    `/spaces/${STORYBLOK_SPACE_ID}/datasources/`,
    {},
  );

  for (const item of dataSources?.data?.datasources) {
    await Storyblok.delete(
      `/spaces/${STORYBLOK_SPACE_ID}/datasources/${item.id}`,
      {},
    );
  }

  return { ok: "ok" };
};

export const pullComponents = async () => {
  const components = await Storyblok.get(
    `/spaces/${STORYBLOK_SPACE_ID}/components/`,
    { per_page: 100 },
  );

  return components?.data?.components;
};

export const pushComponents = async (data: any, current: any) => {
  if (!data) return;

  for (const item of data) {
    const existing = current?.find((comp: any) => comp.name === item.name);

    if (!existing) {
      // add component
      try {
        await Storyblok.post(`/spaces/${STORYBLOK_SPACE_ID}/components/`, {
          component: item,
        });
      } catch (error) {
        console.error("Cant update Component:", error);
      }
    } else {
      //update component
      try {
        await Storyblok.put(
          `/spaces/${STORYBLOK_SPACE_ID}/components/${existing.id}`,
          {
            component: item,
          },
        );
      } catch (error) {
        console.error("Cant create Component:", error);
      }
    }
  }

  return { ok: "ok" };
};

export const removeComponents = async () => {
  const components = await Storyblok.get(
    `/spaces/${STORYBLOK_SPACE_ID}/components/`,
    {},
  );

  for (const item of components?.data?.components) {
    // cant remove page component
    if (item?.name !== "page") {
      await Storyblok.delete(
        `/spaces/${STORYBLOK_SPACE_ID}/components/${item.id}`,
        {},
      );
    }
  }

  return { ok: "ok" };
};

export const pullStories = async () => {
  const stories = await Storyblok.get(
    `/spaces/${STORYBLOK_SPACE_ID}/stories/`,
    {
      page: 1,
      per_page: 100,
    },
  );

  const data = await Promise.all(
    stories.data.stories.map(async (story: any) => {
      const s = await Storyblok.get(
        `/spaces/${STORYBLOK_SPACE_ID}/stories/${story.id}`,
        {},
      );
      return s.data.story;
    }),
  );

  return data;
};

async function createStory(story: any, current: any, parent?: any) {
  if (
    !current ||
    !current.some((comp: any) => comp.full_slug === story.full_slug)
  ) {
    try {
      const data = (await Storyblok.post(
        `/spaces/${STORYBLOK_SPACE_ID}/stories/`,
        {
          story: {
            ...story,
            parent_id: parent?.id,
            parent,
          },
        },
      )) as any;

      let item = data?.data?.story;
      if (!item || !item.is_folder) return;
      return {
        name: item?.name,
        slug: item?.slug,
        full_slug: item?.full_slug,
        id: item?.id,
        uuid: item?.uuid,
      };
    } catch (error) {
      console.error("ERROR:::", error);
    }
  }
}

export const pushStories = async (data: any, current: any) => {
  if (!data) return;

  let folders: any, subfolders: any;
  /* Create folders */
  if (data.folders) {
    try {
      folders = await Promise.all(
        data.folders.map(async (item: any) => {
          return await createStory(item, current);
        }),
      );
    } catch (error) {
      console.error("Can't create folders:", error);
    }
  }

  if (folders && data.subfolders) {
    /* Create subfolders */
    try {
      subfolders = await Promise.all(
        data.subfolders.map(async (item: any) => {
          const parent = folders.find(
            (f: ISbStoryData) => f.slug === item.parent.slug,
          );
          return await createStory(item, current, parent);
        }),
      );
      folders = [...folders, ...subfolders];
    } catch (error) {
      console.error("Can't create subfolders:", error);
    }
  }

  /* create settings */
  if (folders && data.settings) {
    try {
      const parent = folders.find(
        (f: ISbStoryData) => f.slug === data.settings.parent.slug,
      );
      await createStory(data.settings, current, parent);
    } catch (error) {
      console.error("Can't create settings:", error);
    }
  }

  /* create pages */

  if (folders && data.stories) {
    try {
      for (const key of Object.keys(data.stories)) {
        console.log("add stories:", key);
        await Promise.all(
          data.stories[key].map(async (item: any) => {
            const parent = folders.find(
              (f: any) => f.slug === item?.parent?.slug,
            );
            await createStory(item, current, parent);
          }),
        );
      }
    } catch (error) {
      console.error(`Can't create stories`, error);
    }
  }

  /* create pages */

  if (folders && data.pages) {
    try {
      await Promise.all(
        data.pages.map(async (item: any) => {
          const parent = folders.find(
            (f: any) => f.slug === item?.parent?.slug,
          );
          await createStory(item, current, parent);
        }),
      );
    } catch (error) {
      console.error("Can't create pages:", error);
    }
  }

  /* create posts */

  if (folders && data.posts) {
    try {
      await Promise.all(
        data.posts.map(async (item: any) => {
          const parent = folders.find(
            (f: any) => f.slug === item?.parent?.slug,
          );
          await createStory(item, current, parent);
        }),
      );
    } catch (error) {
      console.error("Can't create posts:", error);
    }
  }

  /* create menu categories */
  if (folders && data.menu_categories) {
    try {
      await Promise.all(
        data.menu_categories.map(async (item: any) => {
          const parent = folders.find(
            (f: any) => f.slug === item?.parent?.slug,
          );
          await createStory(item, current, parent);
        }),
      );
    } catch (error) {
      console.error("Can't create menu categories:", error);
    }
  }

  /* create menu items */
  if (folders && data.menu_items) {
    try {
      await Promise.all(
        data.menu_items.map(async (item: any) => {
          const parent = folders.find(
            (f: any) => f.slug === item?.parent?.slug,
          );
          await createStory(item, current, parent);
        }),
      );
    } catch (error) {
      console.error("Can't create menu items:", error);
    }
  }

  return { ok: "ok" };
};

export const removeStories = async () => {
  const stories = await Storyblok.get(
    `/spaces/${STORYBLOK_SPACE_ID}/stories/`,
    {},
  );
  const folders = stories?.data?.stories.filter((item: any) => item.is_folder);
  const st = stories?.data?.stories.filter((item: any) => !item.is_folder);
  for (const item of st) {
    await Storyblok.delete(
      `/spaces/${STORYBLOK_SPACE_ID}/stories/${item.id}`,
      {},
    );
  }

  // remove folders

  for (const item of folders) {
    await Storyblok.delete(
      `/spaces/${STORYBLOK_SPACE_ID}/stories/${item.id}`,
      {},
    );
  }

  return { ok: "ok" };
};


