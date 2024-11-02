/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/env.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@storyblok/astro" />
interface SpaceData {
  id: number;
  name: string;
  domain: string;
  version: string;
  language_codes: string[];
}
interface Space {
  space: SpaceData;
}

interface SpaceObj {
  data: Space;
}
type StoryStatus = "draft" | "published" | undefined;
interface RouteParams {
  slug: string | undefined;
  lang: string | undefined;
}
interface MenuParams {
  status?: StoryStatus;
  categories: string[];
  lang: string;
}
interface PostParams {
  status?: StoryStatus;
  lang: string;
}

interface Locale {
  [key: string]: string;
}

interface DataSourceParams {
  name: string;
  slug: string;
}

interface DataSourceEntry {
  name: string;
  value: string;
}

interface DataSource {
  name: string;
  slug: string;
  dimensions?: any[]; // Assuming dimensions is an array of a type not specified here
  datasource_entries: DataSourceEntry[];
}

interface IStoryblokDatasourceParams {
  datasource_id: string;
  dimension?: string; // Marked as optional since it may not always be needed
}

interface ISbManagmentApiResult {
  data: any;
  headers?: any;
}

interface Color {
  color: string;
}

interface ColorVars {
  [key: string]: string;
}

type GroupedByWorkCategory = {
  [key: string]: WorkStoryblok[];
};

type GroupedByPostCategory = {
  [key: string]: PostStoryblok[];
};

interface Page<T = any> {
  /** result */
  data: T[];
  /** metadata */
  /** the count of the first item on the page, starting from 0 */
  start: number;
  /** the count of the last item on the page, starting from 0 */
  end: number;
  /** total number of results */
  total: number;
  /** the current page number, starting from 1 */
  currentPage: number;
  /** number of items per page (default: 25) */
  size: number;
  /** number of last page */
  lastPage: number;
  url: {
    /** url of the current page */
    current: string;
    /** url of the previous page (if there is one) */
    prev: string | undefined;
    /** url of the next page (if there is one) */
    next: string | undefined;
  };
}

interface MailchimpListEntry {
  list_id: string;
  status: "pending" | "subscribed";
  email: string;
  merge_fields: { FNAME: string | undefined };
}

/* STORYBLOK COMPONENTS */

interface RichtextStoryblok {
  type: string;
  content?: RichtextStoryblok[];
  marks?: RichtextStoryblok[];
  attrs?: any;
  text?: string;
  [k: string]: any;
}

interface AccordionStoryblok {
  is_faq?: boolean;
  items?: AccordionItemStoryblok[];
  content: RichtextStoryblok;
  surface?: string;
  align?:
    | ""
    | "text-left mr-atuo justify-items-start"
    | "text-right ml-auto justify-items-end"
    | "text-center mx-auto justify-items-center";
  padding_top?:
    | ""
    | "pt-0"
    | "pt-xs"
    | "pt-sm"
    | "pt-md"
    | "pt-lg"
    | "pt-xl"
    | "pt-2xl";
  padding_bottom?:
    | ""
    | "pb-0"
    | "pb-xs"
    | "pb-sm"
    | "pb-md"
    | "pb-lg"
    | "pb-xl"
    | "pb-2xl";
  component: "accordion";
  _uid: string;
  [k: string]: any;
}

interface AccordionItemStoryblok {
  title: string;
  content: RichtextStoryblok;
  component: "accordion_item";
  _uid: string;
  [k: string]: any;
}

interface AssetStoryblok {
  alt: string | null;
  copyright?: string | null;
  fieldtype: "asset";
  id: number;
  filename: string;
  name: string;
  title: string | null;
  focus: string | null;
  meta_data?: {
    [k: string]: any;
  };
  source?: string | null;
  is_external_url?: boolean;
  is_private?: boolean;
  src?: string;
  updated_at?: string;
  width?: number | null;
  height?: number | null;
  aspect_ratio?: number | null;
  public_id?: string | null;
  content_type?: string;
  [k: string]: any;
}

interface BannerStoryblok {
  surface?: string;
  surface_banner?: string;
  align?:
    | ""
    | "text-left mr-auto justify-items-start"
    | "text-right ml-auto justify-items-end"
    | "text-center mx-auto justify-items-center";
  container?: "" | "normal" | "breakout" | "full-width";
  image: AssetStoryblok;
  video?: AssetStoryblok;
  content: RichtextStoryblok;
  opacity?:
    | ""
    | "opacity-10"
    | "opacity-20"
    | "opacity-30"
    | "opacity-40"
    | "opacity-50"
    | "opacity-60"
    | "opacity-70"
    | "opacity-80"
    | "opacity-90";
  links?: LinkStoryblok[];
  padding_top?: "" | "pt-0" | "pt-xs" | "pt-sm" | "pt-md" | "pt-lg" | "pt-xl";
  padding_bottom?: "" | "pb-" | "pb-xs" | "pb-sm" | "pb-md" | "pb-lg" | "pb-xl";
  component: "banner";
  _uid: string;
  [k: string]: any;
}

interface BlogAndWorkItemsStoryblok {
  surface?: string;
  container?: "" | "normal" | "breakout" | "full-width";
  padding_top?:
    | ""
    | "pt-0"
    | "pt-xs"
    | "pt-sm"
    | "pt-md"
    | "pt-lg"
    | "pt-xl"
    | "pt-2xl";
  padding_bottom?:
    | ""
    | "pb-0"
    | "pb-xs"
    | "pb-sm"
    | "pb-md"
    | "pb-lg"
    | "pb-xl"
    | "pb-2xl";
  content?: RichtextStoryblok;
  items?: (
    | ISbStoryData<PostStoryblok>
    | ISbStoryData<WorkStoryblok>
    | string
  )[];
  category?:
    | ISbStoryData<BlogCategoryStoryblok>
    | ISbStoryData<WorkCategoryStoryblok>
    | string;
  max_items: number;
  component: "blog_and_work_items";
  _uid: string;
  [k: string]: any;
}

interface BlogCategoryStoryblok {
  title: string;
  content?: RichtextStoryblok;
  og_title: string;
  og_description: string;
  og_image: AssetStoryblok;
  surface?: string;
  component: "blog_category";
  _uid: string;
  [k: string]: any;
}

interface ContactFormStoryblok {
  content?: RichtextStoryblok;
  container?: "" | "normal" | "breakout" | "full-width";
  topic: ISbStoryData<ContactTopicsStoryblok> | string;
  show_topics?: boolean;
  thank_you: string;
  surface?: string;
  component: "contact_form";
  _uid: string;
  [k: string]: any;
}

interface ContactTopicsStoryblok {
  name: string;
  destination: string;
  component: "contact_topics";
  _uid: string;
  [k: string]: any;
}

interface FeatureItemStoryblok {
  content: RichtextStoryblok;
  icon?: number | string;
  links?: LinkStoryblok[];
  component: "feature_item";
  _uid: string;
  [k: string]: any;
}

interface FeaturesStoryblok {
  content?: RichtextStoryblok;
  items?: FeatureItemStoryblok[];
  surface?: string;
  accent_surface?: string;
  align?:
    | ""
    | "text-left mr-auto justify-items-start"
    | "text-right ml-auto justify-items-end"
    | "text-center mx-auto justify-items-center";
  container?: "" | "normal" | "breakout" | "full-width";
  padding_top?:
    | ""
    | "pt-0"
    | "pt-xs"
    | "pt-sm"
    | "pt-md"
    | "pt-lg"
    | "pt-xl"
    | "pt-2xl";
  padding_bottom?:
    | ""
    | "pb-0"
    | "pb-xs"
    | "pb-sm"
    | "pb-md"
    | "pb-lg"
    | "pb-xl"
    | "pb-2xl";
  component: "features";
  _uid: string;
  [k: string]: any;
}

type MultiassetStoryblok = {
  alt: string | null;
  copyright?: string | null;
  fieldtype: "asset";
  id: number;
  filename: string;
  name: string;
  title: string | null;
  focus: string | null;
  meta_data?: {
    [k: string]: any;
  };
  source?: string | null;
  is_external_url?: boolean;
  is_private?: boolean;
  src?: string;
  updated_at?: string;
  width?: number | null;
  height?: number | null;
  aspect_ratio?: number | null;
  public_id?: string | null;
  content_type?: string;
  [k: string]: any;
}[];

interface GalleryStoryblok {
  surface?: string;
  align?:
    | ""
    | "text-left mr-auto justify-items-start"
    | "text-right ml-auto justify-items-end"
    | "text-center mx-auto justify-items-center";
  container: "" | "normal" | "breakout" | "full-width";
  padding_top?:
    | ""
    | "pt-0"
    | "pt-xs"
    | "pt-sm"
    | "pt-md"
    | "pt-lg"
    | "pt-xl"
    | "pt-2xl";
  padding_bottom?:
    | ""
    | "pb-0"
    | "pb-xs"
    | "pb-sm"
    | "pb-md"
    | "pb-lg"
    | "pb-xl"
    | "pb-2xl";
  aspect_ratio?: "" | "1.777" | "1.25" | "1" | "0.8" | "0.5625";
  columns_xs: number;
  columns_sm: number;
  columns_md: number;
  columns_lg: number;
  columns_xl: number;
  lightbox?: boolean;
  content?: RichtextStoryblok;
  items?: MultiassetStoryblok;
  component: "gallery";
  _uid: string;
  [k: string]: any;
}

interface HeroStoryblok {
  surface?: string;
  accent_color?:
    | ""
    | "--primary-bg"
    | "--secondary-bg"
    | "--accent-bg"
    | "--dark-bg"
    | "--light-bg"
    | "--success-bg"
    | "--info-bg"
    | "--warning-bg"
    | "--danger-bg";
  bg_opacity?:
    | ""
    | "opacity-10"
    | "opacity-20"
    | "opacity-30"
    | "opacity-40"
    | "opacity-50"
    | "opacity-60"
    | "opacity-70"
    | "opacity-80"
    | "opacity-90"
    | "opacity-100";
  title: string;
  content: RichtextStoryblok;
  links?: LinkStoryblok[];
  thumbnail?: AssetStoryblok;
  video?: AssetStoryblok;
  component: "hero";
  _uid: string;
  [k: string]: any;
}

interface ImageCardStoryblok {
  image: AssetStoryblok;
  aspect_ratio?: "" | "1.777" | "1.25" | "1" | "0.8" | "0.5625";
  content: RichtextStoryblok;
  component: "image_card";
  _uid: string;
  [k: string]: any;
}

interface ImageCardsStoryblok {
  lightbox?: boolean;
  surface?: string;
  align?:
    | ""
    | "text-left mr-auto justify-items-start"
    | "text-right ml-auto justify-items-end"
    | "text-center mx-auto justify-items-center";
  container: "" | "normal" | "breakout" | "full-width";
  padding_top?:
    | ""
    | "pt-0"
    | "pt-xs"
    | "pt-sm"
    | "pt-md"
    | "pt-lg"
    | "pt-xl"
    | "pt-2xl";
  padding_bottom?:
    | ""
    | "pb-0"
    | "pb-xs"
    | "pb-sm"
    | "pb-md"
    | "pb-lg"
    | "pb-xl"
    | "pb-2xl";
  aspect_ratio?: "" | "1.777" | "1.25" | "1" | "0.8" | "0.5625";
  columns_xs: number;
  columns_sm: number;
  columns_md: number;
  columns_lg: number;
  columns_xl: number;
  content?: RichtextStoryblok;
  items: ImageCardStoryblok[];
  component: "image_cards";
  _uid: string;
  [k: string]: any;
}

type MultilinkStoryblok =
  | {
      fieldtype: "multilink";
      id: string;
      url: string;
      cached_url: string;
      target?: "_blank" | "_self";
      anchor?: string;
      rel?: string;
      title?: string;
      prep?: string;
      linktype: "story";
      story?: {
        name: string;
        created_at?: string;
        published_at?: string;
        id: number;
        uuid: string;
        content?: {
          [k: string]: any;
        };
        slug: string;
        full_slug: string;
        sort_by_date?: null | string;
        position?: number;
        tag_list?: string[];
        is_startpage?: boolean;
        parent_id?: null | number;
        meta_data?: null | {
          [k: string]: any;
        };
        group_id?: string;
        first_published_at?: string;
        release_id?: null | number;
        lang?: string;
        path?: null | string;
        alternates?: any[];
        default_full_slug?: null | string;
        translated_slugs?: null | any[];
        [k: string]: any;
      };
      [k: string]: any;
    }
  | {
      fieldtype: "multilink";
      id: string;
      url: string;
      cached_url: string;
      target?: "_blank" | "_self";
      linktype: "url";
      rel?: string;
      title?: string;
      [k: string]: any;
    }
  | {
      fieldtype: "multilink";
      id: string;
      url: string;
      cached_url: string;
      target?: "_blank" | "_self";
      email?: string;
      linktype: "email";
      [k: string]: any;
    }
  | {
      fieldtype: "multilink";
      id: string;
      url: string;
      cached_url: string;
      target?: "_blank" | "_self";
      linktype: "asset";
      [k: string]: any;
    };

interface LinkStoryblok {
  label: string;
  href: Exclude<MultilinkStoryblok, { linktype?: "asset" }>;
  icon?: number | string;
  surface?: string;
  hide_label?: boolean;
  component: "link";
  _uid: string;
  [k: string]: any;
}

interface OpeningHourStoryblok {
  day?: "" | "1" | "2" | "3" | "4" | "5" | "6" | "0";
  component: "opening_hour";
  _uid: string;
  [k: string]: any;
}

interface PageStoryblok {
  body?: (
    | HeroStoryblok
    | MenuItemsStoryblok
    | MenusStoryblok
    | TextMediaStoryblok
    | RichtextBlokStoryblok
    | BannerStoryblok
    | FeaturesStoryblok
    | PricingStoryblok
    | BlogAndWorkItemsStoryblok
    | GalleryStoryblok
    | ServicesStoryblok
    | ImageCardsStoryblok
    | StackItemsStoryblok
    | ContactFormStoryblok
    | AccordionStoryblok
  )[];
  og_title: string;
  og_description: string;
  og_image: AssetStoryblok;
  surface?: string;
  component: "page";
  _uid: string;
  [k: string]: any;
}

interface NewsletterStoryblok {
  list_id?: string;
  show_name_field?: boolean;
  opt_in?: boolean;
  add_main_list_option?: boolean;
  content?: RichtextStoryblok;
  thank_you: string;
  container?: "" | "breakout" | "normal";
  surface?: number | string;
  component: "newsletter";
  _uid: string;
  [k: string]: any;
}

interface PostStoryblok {
  category: (ISbStoryData<BlogCategoryStoryblok> | string)[];
  title: string;
  intro: string;
  content: RichtextStoryblok;
  thumbnail: AssetStoryblok;
  body?: (
    | HeroStoryblok
    | MenuItemsStoryblok
    | MenusStoryblok
    | RichtextBlokStoryblok
    | TextMediaStoryblok
    | BannerStoryblok
    | PricingStoryblok
    | FeaturesStoryblok
    | BlogAndWorkItemsStoryblok
    | GalleryStoryblok
    | ServicesStoryblok
    | ImageCardsStoryblok
    | StackItemsStoryblok
    | ContactFormStoryblok
    | AccordionStoryblok
  )[];
  og_title: string;
  og_description: string;
  og_image: AssetStoryblok;
  surface?: string;
  component: "post";
  _uid: string;
  [k: string]: any;
}

interface PriceItemStoryblok {
  title?: string;
  icon?: number | string;
  price_prefix?: string;
  price?: string;
  price_suffix?: string;
  content: RichtextStoryblok;
  links?: LinkStoryblok[];
  surface?: string;
  accent_surface?: string;
  component: "price_item";
  _uid: string;
  [k: string]: any;
}

interface PricingStoryblok {
  content?: RichtextStoryblok;
  items?: PriceItemStoryblok[];
  surface?: string;
  align?:
    | ""
    | "text-left mr-auto justify-items-start"
    | "text-right ml-auto justify-items-end"
    | "text-center mx-auto justify-items-center";
  container?: "" | "normal" | "breakout" | "full-width";
  padding_top?:
    | ""
    | "pt-0"
    | "pt-xs"
    | "pt-sm"
    | "pt-md"
    | "pt-lg"
    | "pt-xl"
    | "pt-2xl";
  padding_bottom?:
    | ""
    | "pb-none"
    | "pb-xs"
    | "pb-sm"
    | "pb-md"
    | "pb-lg"
    | "pb-xl"
    | "pb-2xl";
  component: "pricing";
  _uid: string;
  [k: string]: any;
}

interface RichtextBlokStoryblok {
  surface?: string;
  align?:
    | ""
    | "text-left mr-atuo justify-items-start"
    | "text-right ml-auto justify-items-end"
    | "text-center mx-auto justify-items-center";
  container?: "" | "normal" | "breakout" | "full-width";
  padding_top?:
    | ""
    | "pt-0"
    | "pt-xs"
    | "pt-sm"
    | "pt-md"
    | "pt-lg"
    | "pt-xl"
    | "pt-2xl";
  padding_bottom?:
    | ""
    | "pb-0"
    | "pb-xs"
    | "pb-sm"
    | "pb-md"
    | "pb-lg"
    | "pb-xl"
    | "pb-2xl";
  content: RichtextStoryblok;
  links?: LinkStoryblok[];
  component: "richtext";
  _uid: string;
  [k: string]: any;
}

interface ServiceStoryblok {
  title: string;
  page_title?: string;
  intro: string;
  content: RichtextStoryblok;
  thumbnail: AssetStoryblok;
  body?: (
    | HeroStoryblok
    | MenuItemsStoryblok
    | MenusStoryblok
    | RichtextBlokStoryblok
    | TextMediaStoryblok
    | BannerStoryblok
    | PricingStoryblok
    | FeaturesStoryblok
    | BlogAndWorkItemsStoryblok
    | GalleryStoryblok
    | StackItemsStoryblok
    | AccordionStoryblok
  )[];
  og_title: string;
  og_description: string;
  og_image: AssetStoryblok;
  surface?: string;
  component: "service";
  _uid: string;
  [k: string]: any;
}

interface ServicesStoryblok {
  surface?: string;
  container?: "" | "normal" | "breakout" | "full-width";
  padding_top?:
    | ""
    | "pt-0"
    | "pt-xs"
    | "pt-sm"
    | "pt-md"
    | "pt-lg"
    | "pt-xl"
    | "pt-2xl";
  padding_bottom?:
    | ""
    | "pb-0"
    | "pb-xs"
    | "pb-sm"
    | "pb-md"
    | "pb-lg"
    | "pb-xl"
    | "pb-2xl";
  content?: RichtextStoryblok;
  items?: (ISbStoryData<ServiceStoryblok> | string)[];
  breadcrumb?: boolean;
  max_items: number;
  component: "services";
  _uid: string;
  [k: string]: any;
}

interface SettingsStoryblok {
  surface_light?: string;
  surface_dark?: string;
  surface_muted?: string;
  surface_primary?: string;
  surface_secondary?: string;
  surface_accent?: string;
  surface_success?: string;
  surface_info?: string;
  surface_warning?: string;
  surface_danger?: string;
  surface_footer?: string;
  surface_page?: string;
  surface_menu?: string;
  contact_form?: ContactFormStoryblok[];
  newsletter?: any;
  newsletter_in_footer?: boolean;
  newsletter_content?: RichtextStoryblok;
  newsletter_thank_you?: string;
  main_menu: LinkStoryblok[];
  footer_text?: RichtextStoryblok;
  footer_menu_1_label: string;
  footer_menu_1?: LinkStoryblok[];
  footer_menu_2_label: string;
  footer_menu_2?: LinkStoryblok[];
  company_name?: string;
  address?: string;
  font_headings?: number | string;
  font_weight_headings?:
    | ""
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  font_body?: number | string;
  font_weight_body?:
    | ""
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  blog_title: string;
  blog_content?: RichtextStoryblok;
  blog_og_title: string;
  blog_og_description: string;
  blog_og_image: AssetStoryblok;
  email: string;
  phone?: string;
  phone_label?: string;
  whatsapp?: string;
  links?: LinkStoryblok[];
  work_title: string;
  work_content: RichtextStoryblok;
  work_og_title: string;
  work_og_description: string;
  work_og_image: AssetStoryblok;
  tiny_analytics_id?: string;
  radius_media?: string;
  radius_input: string;
  component: "settings";
  _uid: string;
  [k: string]: any;
}

interface StackStoryblok {
  name?: string;
  logo?: AssetStoryblok;
  intro?: string;
  url?: Exclude<
    MultilinkStoryblok,
    { linktype?: "email" } | { linktype?: "asset" }
  >;
  content?: RichtextStoryblok;
  component: "stack";
  _uid: string;
  [k: string]: any;
}

interface StackItemsStoryblok {
  content?: RichtextStoryblok;
  surface?: string;
  accent_surface?: string;
  align?:
    | ""
    | "text-left mr-auto justify-items-start"
    | "text-right ml-auto justify-items-end"
    | "text-center mx-auto justify-items-center";
  container?: "" | "normal" | "breakout" | "full-width";
  items?: (ISbStoryData<StackStoryblok> | string)[];
  component: "stack_items";
  _uid: string;
  [k: string]: any;
}

interface TextMediaStoryblok {
  image: AssetStoryblok;
  media_width: "" | "33.33" | "50" | "66.66";
  aspect_ratio?: "" | "1.777" | "1.25" | "1" | "0.8" | "0.5625";
  video?: AssetStoryblok;
  reverse?: boolean;
  surface?: string;
  align?:
    | ""
    | "text-left mr-auto justify-items-start"
    | "text-right ml-auto justify-items-end"
    | "text-center mx-auto justify-items-center";
  container: "" | "normal" | "breakout" | "full-width";
  content: RichtextStoryblok;
  links?: LinkStoryblok[];
  padding_top?:
    | ""
    | "pt-0"
    | "pt-xs"
    | "pt-sm"
    | "pt-md"
    | "pt-lg"
    | "pt-xl"
    | "pt-2xl";
  padding_bottom?:
    | ""
    | "pb-0"
    | "pb-xs"
    | "pb-sm"
    | "pb-md"
    | "pb-lg"
    | "pb-xl"
    | "pb-2xl";
  component: "text_media";
  _uid: string;
  [k: string]: any;
}

interface WorkStoryblok {
  title: string;
  intro: string;
  content: RichtextStoryblok;
  links?: LinkStoryblok[];
  thumbnail: AssetStoryblok;
  category?: (ISbStoryData<WorkCategoryStoryblok> | string)[];
  services?: (ISbStoryData<ServiceStoryblok> | string)[];
  body?: (
    | HeroStoryblok
    | MenuItemsStoryblok
    | MenusStoryblok
    | RichtextBlokStoryblok
    | TextMediaStoryblok
    | BannerStoryblok
    | PricingStoryblok
    | FeaturesStoryblok
    | GalleryStoryblok
    | BlogAndWorkItemsStoryblok
    | ServicesStoryblok
    | ImageCardsStoryblok
    | StackItemsStoryblok
    | ContactFormStoryblok
    | AccordionStoryblok
  )[];
  og_title: string;
  og_description: string;
  og_image: AssetStoryblok;
  surface?: string;
  component: "work";
  _uid: string;
  [k: string]: any;
}

interface WorkCategoryStoryblok {
  title: string;
  page_title?: string;
  content?: RichtextStoryblok;
  og_title: string;
  og_description: string;
  og_image: AssetStoryblok;
  surface?: string;
  component: "work_category";
  _uid: string;
  [k: string]: any;
}
