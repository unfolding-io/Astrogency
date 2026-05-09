import { renderRichText } from "@storyblok/astro";
import type { StoryblokRichTextNode } from "@storyblok/js";

export function renderBlokRichText(
  content: RichtextStoryblok | undefined | null,
): string {
  if (content == null) return "";
  return renderRichText(content as StoryblokRichTextNode<string>) ?? "";
}
