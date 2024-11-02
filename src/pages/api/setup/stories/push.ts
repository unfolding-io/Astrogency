import type { APIRoute } from "astro";
import { pushStories, pullStories } from "@lib/storyblokApi";

import folders from "@/seed/folders.json";
import subfolders from "@/seed/subfolders.json";
import settings from "@/seed/settings.json";
import pages from "@/seed/pages.json";
import posts from "@/seed/posts.json";
import work_categories from "@/seed/work_categories.json";
import blog_categories from "@/seed/blog_categories.json";
import services from "@/seed/services.json";
import contact_topics from "@/seed/contact_topics.json";
import work from "@/seed/work.json";

export const prerender = false;

export const POST: APIRoute = async () => {
  try {
    const currentStories = await pullStories();
    const res = await pushStories(
      {
        folders,
        subfolders,
        settings,
        stories: {
          pages,
          posts,
          work_categories,
          blog_categories,
          services,
          contact_topics,
          work,
        },
      },
      currentStories,
    );
    return new Response(JSON.stringify(res), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Storyblok Error:", error);
  }

  return new Response(null, { status: 400 });
};
