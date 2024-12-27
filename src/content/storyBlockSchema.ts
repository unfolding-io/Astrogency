import { z } from "zod"

// Basic types
export const richtextSchema = z.object({
  type: z.string(),
  content: z.array(z.lazy(() => richtextSchema)).optional(),
  marks: z.array(z.lazy(() => richtextSchema)).optional(),
  attrs: z.any().optional(),
  text: z.string().optional(),
}).passthrough()

export const assetSchema = z.object({
  alt: z.string().nullable().optional(),
  copyright: z.string().nullable().optional(),
  fieldtype: z.literal('asset'),
  id: z.number().or(z.string()).or(z.null()).optional(),
  filename: z.string().nullable().optional(),
  name: z.string().optional(),
  title: z.string().nullable().optional(),    
  src: z.string().optional(), 
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  aspect_ratio: z.number().nullable().optional(), 
  content_type: z.string().optional(),
}).passthrough()

export const multiassetSchema = z.array(assetSchema)

export const multilinkSchema = z.union([
  z.object({
    linktype: z.literal('story'),
    cached_url: z.string(),
    target: z.enum(['_blank', '_self']).optional(),
    prep: z.union([z.string(), z.boolean()]).optional(),
    id: z.string().optional(),
    fieldtype: z.literal('multilink').optional(),
    url: z.string().optional(),
  }).passthrough(),
  z.object({
    linktype: z.literal('url'),
    url: z.string(),
    target: z.enum(['_blank', '_self']).optional(),
    fieldtype: z.literal('multilink').optional(),
    cached_url: z.string().optional(),
  }).passthrough(),
  z.object({
    linktype: z.literal('email'),
    cached_url: z.string(),
  }).passthrough(),
  z.object({
    linktype: z.literal('asset'),
    url: z.string(),
  }).passthrough(),
])

// Component schemas
export const linkSchema = z.object({
  label: z.string(),
  href: multilinkSchema,
  icon: z.union([z.number(), z.string()]).optional(),
  surface: z.string().optional(),
  hide_label: z.boolean().optional(),
  component: z.literal('link'),
  _uid: z.string(),
}).passthrough()

export const accordionItemSchema = z.object({
  title: z.string(),
  content: richtextSchema,
  component: z.literal('accordion_item'),
  _uid: z.string(),
}).passthrough()

export const accordionSchema = z.object({
  is_faq: z.boolean().optional(),
  items: z.array(accordionItemSchema).optional(),
  content: richtextSchema,
  surface: z.string().optional(),
  align: z.string().optional(),
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  component: z.literal('accordion'),
  _uid: z.string(),
}).passthrough()

export const bannerSchema = z.object({
  surface: z.string().optional(),
  surface_banner: z.string().optional(),
  align: z.string().optional(),
  container: z.string().optional(),
  image: assetSchema.optional(),
  video: assetSchema.optional(),
  content: richtextSchema,
  opacity: z.enum(['', 'opacity-10', 'opacity-20', 'opacity-30', 'opacity-40', 'opacity-50', 'opacity-60', 'opacity-70', 'opacity-80', 'opacity-90']).optional(),
  links: z.array(linkSchema).optional(),
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  component: z.literal('banner'),
  _uid: z.string(),
}).passthrough()

export const blogCategorySchema = z.object({
  uuid: z.string().optional(),
  title: z.string(),
  content: richtextSchema.optional(),
  og_title: z.string(),
  og_description: z.string(),
  og_image: assetSchema,
  surface: z.string().optional(),
  component: z.literal('blog_category'),
  _uid: z.string(),
}).passthrough()

export const blogAndWorkItemsSchema = z.object({
  surface: z.string().optional(),
  container: z.string().optional(),
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  content: richtextSchema.optional(),
  items: z.array(z.string()).optional(),
  category: z.string().optional(),
  max_items: z.union([z.number(), z.string()]).optional(),
  component: z.literal('blog_and_work_items'),
  _uid: z.string(),
  title: z.string().optional(),
  _editable: z.string().optional()
}).passthrough()

export const contactTopicsSchema = z.object({
  name: z.string(),
  destination: z.string(),
  component: z.literal('contact_topics'),
  _uid: z.string(),
}).passthrough()

export const contactFormSchema = z.object({
  content: richtextSchema.optional(),
  container: z.string().optional(),
  topic: z.union([z.lazy(() => contactTopicsSchema), z.string()]).optional(),
  show_topics: z.boolean().optional(),
  thank_you: z.string(),
  surface: z.string().optional(),
  component: z.literal('contact_form'),
  _uid: z.string(),
}).passthrough()

export const featureItemSchema = z.object({
  content: richtextSchema,
  icon: z.union([z.number(), z.string()]).optional(),
  links: z.array(linkSchema).optional(),
  component: z.literal('feature_item'),
  _uid: z.string(),
}).passthrough()

export const featuresSchema = z.object({
  content: richtextSchema.optional(),
  items: z.array(featureItemSchema).optional(),
  surface: z.string().optional(),
  accent_surface: z.string().optional(),
  align: z.string().optional(),
  container: z.string().optional(),
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  component: z.literal('features'),
  _uid: z.string(),
}).passthrough()

export const gallerySchema = z.object({
  surface: z.string().optional(),
  align: z.string().optional(),
  container: z.string(),
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  aspect_ratio: z.string().or(z.number()).optional(),
  columns_xs: z.number().or(z.string()).optional(),
  columns_sm: z.number().or(z.string()).optional(),
  columns_md: z.number().or(z.string()).optional(),
  columns_lg: z.number().or(z.string()).optional(),
  columns_xl: z.number().or(z.string()).optional(),
  lightbox: z.boolean().optional(),
  content: richtextSchema.optional(),
  items: multiassetSchema.optional(),
  component: z.literal('gallery'),
  _uid: z.string(),
}).passthrough()

export const heroSchema = z.object({
  surface: z.string().optional(),
  accent_color: z.enum([
    '',
    '--primary-bg',
    '--secondary-bg',
    '--accent-bg',
    '--dark-bg',
    '--light-bg',
    '--success-bg',
    '--info-bg',
    '--warning-bg',
    '--danger-bg'
  ]).optional(),
  bg_opacity: z.enum([
    '',
    'opacity-10',
    'opacity-20',
    'opacity-30',
    'opacity-40',
    'opacity-50',
    'opacity-60',
    'opacity-70',
    'opacity-80',
    'opacity-90',
    'opacity-100'
  ]).optional(),
  title: z.string().optional(),
  content: richtextSchema,
  links: z.array(linkSchema).optional(),
  thumbnail: assetSchema.optional(),
  video: assetSchema.optional(),
  component: z.literal('hero'),
  _uid: z.string(),
}).passthrough()

export const imageCardSchema = z.object({
  image: assetSchema,
  aspect_ratio: z.string().or(z.number()).optional(),
  content: richtextSchema,
  component: z.literal('image_card'),
  _uid: z.string(),
}).passthrough()

export const imageCardsSchema = z.object({
  lightbox: z.boolean().optional(),
  surface: z.string().optional(),
  align: z.string().optional(),
  container: z.string(),
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  aspect_ratio: z.string().or(z.number()).optional(),
  columns_xs: z.number().optional(),
  columns_sm: z.number().optional(),
  columns_md: z.number().optional(),
  columns_lg: z.number().optional(),
  columns_xl: z.number().optional(),
  content: richtextSchema.optional(),
  items: z.array(imageCardSchema),
  component: z.literal('image_cards'),
  _uid: z.string(),
}).passthrough()

/* export const menuItemsSchema = z.object({
  title: z.string().optional(),
  content: richtextSchema.optional(),
  price: z.string().optional(),
  component: z.literal('menu_items'),
  _uid: z.string(),
}).passthrough()

export const menusSchema = z.object({
  content: richtextSchema.optional(),
  items: z.array(menuItemsSchema).optional(),
  surface: z.string().optional(),
  align: z.string().optional(),
  container: z.string().optional(),
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  component: z.literal('menus'),
  _uid: z.string(),
}).passthrough() */

export const newsletterSchema = z.object({
  list_id: z.string().optional(),
  show_name_field: z.boolean().optional(),
  opt_in: z.boolean().optional(),
  add_main_list_option: z.boolean().optional(),
  content: richtextSchema.optional(),
  thank_you: z.string(),
  container: z.string().optional(),
  surface: z.string().optional(),
  component: z.literal('newsletter'),
  _uid: z.string(),
}).passthrough()

export const priceItemSchema = z.object({
  title: z.string().optional(),
  icon: z.union([z.number(), z.string()]).optional(),
  price_prefix: z.string().optional(),
  price: z.string().optional(),
  price_suffix: z.string().optional(),
  content: richtextSchema,
  links: z.array(linkSchema).optional(),
  surface: z.string().optional(),
  accent_surface: z.string().optional(),
  component: z.literal('price_item'),
  _uid: z.string(),
}).passthrough()

export const pricingSchema = z.object({
  content: richtextSchema.optional(),
  items: z.array(priceItemSchema).optional(),
  surface: z.string().optional(),
  align: z.string().optional(),
  container: z.string().optional(),
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  component: z.literal('pricing'),
  _uid: z.string(),
}).passthrough()

export const richtextBlokSchema = z.object({
  _uid: z.string(),
  surface: z.string().optional(),
  align: z.string().optional(),
  container: z.string().optional(),
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  content: richtextSchema,
  links: z.array(linkSchema).optional(),
  component: z.literal('richtext'),
  _editable: z.string().optional()
}).passthrough()

export const textMediaSchema = z.object({
    uuid: z.string().optional(),
    _uid: z.string(),
    image: assetSchema,
    media_width: z.string().optional(),
    aspect_ratio: z.string().optional(),
    video: assetSchema.optional(),
    reverse: z.boolean().optional(),
    surface: z.string().optional(),
    align: z.string().optional(),
    container: z.string().optional(),
    content: richtextSchema,
    links: z.array(linkSchema).optional(),
    padding_top: z.string().optional(),
    padding_bottom: z.string().optional(),
    component: z.literal('text_media'),
    layout: z.string().optional(),
    _editable: z.string().optional(),
}).passthrough()

  export const stackSchema = z.object({
    name: z.string().optional(),
    logo: assetSchema.optional(),
    intro: z.string().optional(),
    url: multilinkSchema.optional(),
    content: richtextSchema.optional(),
    component: z.literal('stack'),
    _uid: z.string(),
  }).passthrough()

  export const stackItemsSchema = z.object({
    content: richtextSchema.optional(),
    surface: z.string().optional(),
    accent_surface: z.string().optional(),
    align: z.string().optional(),
    container: z.string().optional(),
    items: z.array(z.union([stackSchema, z.string()])).optional(),
    component: z.literal('stack_items'),
    _uid: z.string(),
  }).passthrough()





export const settingsSchema = z.object({
  surface_light: z.string().optional(),
  surface_dark: z.string().optional(),
  surface_muted: z.string().optional(),
  surface_primary: z.string().optional(),
  surface_secondary: z.string().optional(),
  surface_accent: z.string().optional(),
  surface_success: z.string().optional(),
  surface_info: z.string().optional(),
  surface_warning: z.string().optional(),
  surface_danger: z.string().optional(),
  surface_footer: z.string().optional(),
  surface_page: z.string().optional(),
  surface_menu: z.string().optional(),
  contact_form: z.array(contactFormSchema).optional(),
  newsletter: z.any(),
  newsletter_in_footer: z.boolean().optional(),
  newsletter_content: richtextSchema.optional(),
  newsletter_thank_you: z.string(),
  main_menu: z.array(linkSchema),
  footer_text: richtextSchema.optional(),
  footer_menu_1_label: z.string(),
  footer_menu_1: z.array(linkSchema).optional(),
  footer_menu_2_label: z.string(),
  footer_menu_2: z.array(linkSchema).optional(),
  company_name: z.string().optional(),
  address: z.string().optional(),
  font_headings: z.union([z.number(), z.string()]),
  font_weight_headings: z.union([z.string(), z.number()]),
  font_body: z.union([z.number(), z.string()]),
  font_weight_body: z.union([z.string(), z.number()]),
  blog_title: z.string(),
  blog_content: richtextSchema.optional(),
  blog_og_title: z.string(),
  blog_og_description: z.string(),
  blog_og_image: assetSchema,
  email: z.string(),
  phone: z.string(),
  phone_label: z.string(),
  whatsapp: z.string(),
  links: z.array(linkSchema).optional(),
  work_title: z.string(),
  work_content: richtextSchema,
  work_og_title: z.string(),
  work_og_description: z.string(),
  work_og_image: assetSchema,
  tiny_analytics_id: z.string().optional(),
  radius_media: z.union([z.string(), z.number()]),
  radius_input: z.union([z.string(), z.number()]),
  component: z.literal('settings'),
  _uid: z.string(),
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
}).passthrough()

export const carouselSchema = z.object({
  overflow_hidden: z.boolean().optional(),
  container: z.enum(['', 'normal', 'breakout', 'full-width']).optional(),
  surface: z.string().optional(),
  carousel_surface: z.string().optional(),
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  min_height: z.string().optional(),
  loop: z.boolean().optional(),
  drag_free: z.boolean().optional(),
  navigation: z.boolean().optional(),
  arrows_overlay: z.boolean().optional(),
  autoplay: z.enum(['', 'none', 'autoplay', 'autoscroll']).optional(),
  delay: z.string().optional(),
  auto_scroll_speed: z.string().optional(),
  auto_scroll_direction: z.enum(['', 'forward', 'backward']).optional(),
  type: z.enum(['', 'images', 'items', 'cards']).optional(),
  align_slides: z.enum(['', 'start', 'center', 'end']).optional(),
  item_width_xs: z.string(),
  item_width_sm: z.string(),
  item_width_md: z.string(), 
  item_width_lg: z.string(),
  item_width_xl: z.string().optional(),
  gap_xs: z.string().optional(),
  gap_sm: z.string().optional(),
  gap_md: z.string().optional(),
  gap_lg: z.string().optional(),
  gap_xl: z.string().optional(),
  aspect_ratio: z.union([z.string(), z.number()]).optional(),
  images: z.array(z.any()).optional(), // MultiassetStoryblok
  items: z.array(z.any()).optional(),
  cards: z.array(imageCardSchema).optional(),
  component: z.literal('carousel'),
  _uid: z.string()
}).passthrough()

export const cardGridSchema = z.object({
  surface: z.string().optional(),
  align: z.string().optional(),
  container: z.string(),
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  columns_xs: z.string().optional(),
  columns_sm: z.string().optional(), 
  columns_md: z.string().optional(),
  columns_lg: z.string().optional(),
  columns_xl: z.string().optional(),
  content: richtextSchema.optional(),
  gap_xs: z.string().optional(),
  items: z.array(imageCardSchema).optional(),
  gap_md: z.string().optional(),
  gap_xl: z.string().optional(),
  min_height: z.string().optional(),
  component: z.literal('card_grid'),
  _uid: z.string()
}).passthrough()

export const workCategorySchema = z.object({
  uuid: z.string().optional(),
  title: z.string(),
  page_title: z.string().optional(),
  content: richtextSchema.optional(),
  og_title: z.string(),
  og_description: z.string(),
  og_image: assetSchema,
  surface: z.string().optional(),
  component: z.literal('work_category'),
  _uid: z.string(),
}).passthrough()



export const serviceSchema = z.object({
  uuid: z.string().optional(),
  title: z.string().optional(),
  page_title: z.string().optional(),
  intro: z.string().optional(),
  content: richtextSchema.optional(),
  thumbnail: assetSchema.optional(),
  body: z.array(z.union([
      heroSchema,
      //menuItemsSchema,
      //menusSchema,
    richtextBlokSchema,
    textMediaSchema,
    bannerSchema,
    pricingSchema,
    featuresSchema,
    blogAndWorkItemsSchema,
    gallerySchema,
    stackItemsSchema,
    accordionSchema,
    cardGridSchema,
    carouselSchema,
    newsletterSchema,
    contactFormSchema,
  ])).optional(),
  og_title: z.string(),
  og_description: z.string(),
  og_image: assetSchema,
  surface: z.string().optional(),
  component: z.literal('service'),
  _uid: z.string(),
}).passthrough()

export const servicesSchema = z.object({
  surface: z.string().optional(),
  container: z.string().optional(),
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  content: richtextSchema.optional(),
  items: z.array(z.union([serviceSchema, z.string()])).optional(),
  breadcrumb: z.boolean().optional(),
  max_items: z.union([z.number(), z.string(), z.null()]).optional(),
  component: z.literal('services'),
  _uid: z.string(),
}).passthrough()

export const workSchema = z.object({
  uuid: z.string().optional(),
  title: z.string(),
  intro: z.string().optional(),
  content: richtextSchema.optional(),
  links: z.array(linkSchema).optional(),
  thumbnail: assetSchema.optional(),
  category: z.array(z.union([workCategorySchema, z.string()])).optional(),
  categories: z.array(z.union([workCategorySchema, z.string()])).optional(),
  services: z.array(z.union([serviceSchema, z.string()])).optional(),
  body: z.array(z.union([
    heroSchema, 
    richtextBlokSchema,
    textMediaSchema,
    bannerSchema,
    pricingSchema,
    featuresSchema,
    gallerySchema,
    blogAndWorkItemsSchema,
    servicesSchema,
    imageCardsSchema,
    cardGridSchema,
    carouselSchema,
    stackItemsSchema,
    contactFormSchema,
    accordionSchema,
    newsletterSchema,
    
  ])).optional(),
  og_title: z.string(),
  og_description: z.string(),
  og_image: assetSchema,
  surface: z.string().optional(),
  component: z.literal('work'),
  _uid: z.string(),
}).passthrough()

export const postSchema = z.object({
  uuid: z.string().optional(),
  category: z.array(z.union([blogCategorySchema, z.string()])),
  title: z.string(),
  intro: z.string(),
  content: richtextSchema,
  thumbnail: assetSchema,
  categories: z.array(z.union([blogCategorySchema, z.string(), z.any()])).optional(),
  body: z.array(z.union([
    heroSchema, 
    richtextBlokSchema,
    textMediaSchema,
    bannerSchema,
    pricingSchema,
    featuresSchema,
    blogAndWorkItemsSchema,
    gallerySchema,
    servicesSchema,
    imageCardsSchema,
    cardGridSchema,
    carouselSchema,
    stackItemsSchema,
    contactFormSchema,
    accordionSchema,
    newsletterSchema,
  ])).optional(),
  og_title: z.string(),
  og_description: z.string(),
  og_image: assetSchema,
  surface: z.string().optional(),
  component: z.literal('post'),
  _uid: z.string(),
}).passthrough()

// Main page schema that combines everything
export const pageSchema = z.object({
  uuid: z.string().optional(),
  body: z.array(z.union([
    heroSchema, 
    textMediaSchema,
    richtextBlokSchema,
    bannerSchema,
    featuresSchema,
    pricingSchema,
    blogAndWorkItemsSchema,
    gallerySchema,
    servicesSchema,
    imageCardsSchema,
    stackItemsSchema,
    contactFormSchema,
    accordionSchema,
    cardGridSchema,
    carouselSchema,
    newsletterSchema,
  ])).optional(),
  lang: z.string().optional(),
  og_title: z.string(),
  og_description: z.string(),
  og_image: assetSchema,
  surface: z.string().optional(),
  component: z.literal('page'),
  data: z.any().optional(), 
  _uid: z.string(),
}).passthrough()

// Helper types
/* 
const pageResponseSchema = z.object({
  data: z.array(z.any()),
  start: z.number(),
  end: z.number(),
  total: z.number(),
  currentPage: z.number(),
  size: z.number(),
  lastPage: z.number(),
  url: z.object({
    current: z.string(),
    prev: z.string().optional(),
    next: z.string().optional(),
  }),
}) */

/* export type Page<T = any> = z.infer<typeof pageResponseSchema> */
export type PageData = z.infer<typeof pageSchema>
export type PostData = z.infer<typeof postSchema>
export type WorkData = z.infer<typeof workSchema>
export type ServiceData = z.infer<typeof serviceSchema>
export type BlogCategoryData = z.infer<typeof blogCategorySchema>
export type WorkCategoryData = z.infer<typeof workCategorySchema>

export type GroupedByWorkCategory = Record<string, z.infer<typeof workSchema>[]>
export type GroupedByPostCategory = Record<string, z.infer<typeof postSchema>[]>