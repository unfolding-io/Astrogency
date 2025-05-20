import { defineConfig, envField } from "astro/config";
import { loadEnv } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tailwind from "@astrojs/tailwind";
import { storyblok } from '@storyblok/astro';
import vue from "@astrojs/vue";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";
import vercel from "@astrojs/vercel"; 

const env = loadEnv("", process.cwd(), ["STORYBLOK", "NETLIFY"]);
 
// https://astro.build/config
export default defineConfig({
  site: "https://astrogency.unfolding.io/", // change this to your domain

  adapter: env.NETLIFY ? netlify() : vercel(), // vercel() or netlify()
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_PREVIEW_TOKEN,
      bridge: false,
      components: {
        page: "components/bloks/Page",
        post: "components/bloks/Post",
        hero: "components/bloks/Hero",
        text_media: "components/bloks/TextMedia", 
        blog_and_work_items: "components/bloks/BlogAndWorkItems",
        richtext: "components/bloks/RichText",
        banner: "components/bloks/Banner",
        features: "components/bloks/Features",
        work: "components/bloks/Work",
        service: "components/bloks/Service",
        gallery: "components/bloks/Gallery",
        services: "components/bloks/Services",
        stack_items: "components/bloks/StackItems",
        accordion: "components/bloks/premium/Accordion",
        pricing: "components/bloks/premium/Pricing",
        contact_form: "components/bloks/premium/ContactForm",
        carousel: "components/bloks/premium/Carousel",
        card_grid: "components/bloks/premium/CardGrid",
        newsletter: "components/bloks/premium/Newsletter",
      },
      apiOptions: {
        region: env.STORYBLOK_REGION, // Possible values: "ap", "eu", "us", "ca", "cn" (Default: "eu")
      },
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    vue({
      appEntrypoint: "/src/pages/_app",
    }),
    icon(
      {
        iconDir: "src/icons",
        include: {
          lucide: [
            'chevron-right', 
            'chevron-left', 
            'chevron-up', 
            'chevron-down', 
            'arrow-right',
            'arrow-left',
            'arrow-up',
            'arrow-down',
            'external-link',
            'mail',
            'home',
            'coffee', 
            'phone', 
            'smartphone', 
            'laptop', 
            'menu', 
            'newspaper', 
            'map', 
            'map-pin', 
            'search', 
            'image', 
            'badge-percent', 
            'facebook',
            'banana',
            'bitcoin',
            'bookmark',
            'bot',
            'boxes',
            'calendar-check',
            'circle-check-big',
            'download',
            'cloud-download',
            'github',
            'messages-square',
            'navigation',
            'qr-code',
            'play',
            'shield-check',
            'slack',
            'star',
            'thumbs-up',
            'user-round',
            'instagram'
          ],
        }
      }
    ),
    sitemap({
      filter: (page) =>
        !page.includes('/setup/') &&
        !page.includes('/cms/')
    }),
  ],
  trailingSlash: "ignore",
  compressHTML: true,
  scopedStyleStrategy: "attribute",
  build: {
    format: "directory",
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [basicSsl()],
    server: {
      https: true,
    },
  },
  experimental: { 
    
    
  },
  env: {
    schema: {
      STORYBLOK_PREVIEW_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      STORYBLOK_SPACE_ID: envField.number({
        context: "server",
        access: "public",
        optional: true,
      }),
      STORYBLOK_REGION: envField.string({
        context: "server",
        access: "public",
        default: "eu", // Possible values: "ap", "eu", "us", "ca", "cn" (Default: "eu")
      }),
      STORYBLOK_PERSONAL_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SITE_LANG: envField.string({
        context: "client",
        access: "public",
        default: "en",
      }),
      CURRENCY: envField.string({
        context: "client",
        access: "public",
        default: "USD",
      }),
      LOCALE: envField.string({
        context: "client",
        access: "public",
        default: "en-US",
      }),
      NEWSLETTER_ENDPOINT: envField.string({
        context: "server",
        access: "public",
        default: "none",
      }),
      MAILCHIMP_SERVER_PREFIX: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),
      MAILCHIMP_LIST_ID: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),
      MAILCHIMP_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),

      MAILGUN_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),

      MAILGUN_API_URL: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),

      MAILGUN_DOMAIN: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),

      FROM_EMAIL_ADDRESS: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),

      TO_EMAIL_ADDRESS: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),
      POSTMARK_SERVER_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SLACK_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SLACK_CHANNEL_ID: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),
      CONTACT_FORM_ENDPOINT: envField.string({
        context: "server",
        access: "public",
        default: "none",
      }),
      NEWSLETTER_ENDPOINT: envField.string({
        context: "server",
        access: "public",
        default: "none",
      }),
    },
  },
});
