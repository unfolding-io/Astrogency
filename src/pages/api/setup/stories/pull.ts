import type { APIRoute } from "astro";
import { pullStories } from "@lib/storyblokApi";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
 
  const type = url.searchParams.get("type");
  const grouped = url.searchParams.get("grouped");
  const parent =  url.searchParams.get("parent");


 
  try {
    let stories = await pullStories();


    
    if (type === "is_folder") {
      
      stories = stories.filter((story) => story?.is_folder === true);

      if(parent === "1") {

      stories = stories.filter((story) => story?.parent !== null);

      }
      else {

      stories = stories.filter((story) => story?.parent === null);

      }
    }
    if (!!type && type !== "is_folder") { 
      stories = stories.filter((story) => story?.content?.component === type);
    }

    if(grouped) {
      // remove folders
      stories = stories.filter((story) => story?.is_folder === false);
      // group by story?.content?.component
      const grouped = stories.reduce((acc, story) => {
        const type = story?.content?.component;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(story);
        return acc;
      }, {});
      stories = grouped;
    }
    
    return new Response(JSON.stringify(stories || []), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Storyblok Error:", error);
  }

  return new Response(null, { status: 400 });
};
