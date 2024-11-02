<template>
  <Carousel
    :opts="{
      align,
      loop,
      dragFree,
      skipSnaps: true,
      inViewThreshold: 0,
    }"
    :plugins="plugins"
  >
    <CarouselContent
      class="carousel-wrap grid h-fit w-full"
      :class="`${loop ? 'loop' : ''} `"
    >
      <CarouselItem
        v-for="(item, index) in links"
        :key="index"
        class="item-slide"
        :class="className"
      >
        <div
          v-html="item"
          class="h-full w-full flex-1 overflow-hidden"
          :class="index + 1 === links.length ? 'last' : ''"
        ></div>
      </CarouselItem>
    </CarouselContent>
    <div
      class="carousel-nav flex justify-end gap-2 py-4"
      :class="arrows_overlay ? 'absolute inset-x-0 bottom-0' : ''"
      v-if="navigation"
    >
      <div class="embla__dots mr-auto"></div>
      <CarouselPrevious :class="` ${className} btn-icon relative`" />
      <CarouselNext :class="`${className} btn-icon relative`" />
    </div>
  </Carousel>
</template>

<script setup>
import { useSlots, computed } from "vue";
import { renderToString } from "@vue/server-renderer";
import Autoplay from "embla-carousel-autoplay";
import AutoScroll from "embla-carousel-auto-scroll";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const props = defineProps({
  bottom: {
    type: Boolean,
    default: false,
  },

  loop: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  autoscroll: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String,
    default: "start",
  },
  dragFree: {
    type: Boolean,
    default: false,
  },
  navigation: {
    type: Boolean,
    default: true,
  },
  className: {
    type: String,
    default: "",
  },
  arrows_overlay: {
    type: Boolean,
    default: false,
  },
  auto_scroll_speed: {
    type: Number,
    default: 2,
  },
  auto_scroll_direction: {
    type: String,
    default: "forward",
  },
  delay: {
    type: Number,
    default: 4000,
  },
});
const plugins = computed(() => {
  const pluginsArray = [WheelGesturesPlugin()];
  if (props.autoplay) {
    pluginsArray.push(Autoplay({ delay: props.delay }));
  }
  if (props.autoscroll) {
    pluginsArray.push(
      AutoScroll({
        speed: props.auto_scroll_speed,
        direction: props.auto_scroll_direction,
      }),
    );
  }
  return pluginsArray;
});

const slots = useSlots();
const vnode = slots.default().pop();
const htmlString = await renderToString(vnode);

const innerHtml = htmlString
  .replace("<astro-slot>", "")
  .replace("</astro-slot>", "");

// Split the string into an array of <slide> elements
const links = innerHtml
  .split("</slide>")
  .filter(Boolean)
  .map((link) => link.replace(/<slide[^>]*>/g, ""))
  .filter((link) => link !== "<!----><!--]--></slide>");
</script>

<style lang="postcss">
.carousel-container {
  --carousel-gap: var(--gap-xs);
  @screen sm {
    --carousel-gap: var(--gap-sm);
  }
  @screen md {
    --carousel-gap: var(--gap-md);
  }

  @screen lg {
    --carousel-gap: var(--gap-lg);
  }
  @screen xl {
    --carousel-gap: var(--gap-xl);
  }
}

.rounded .carousel-container {
  border-radius: var(--radius-media);
  overflow: hidden;
}
.crop .carousel-container {
  overflow: hidden;
}
.full-width {
  .carousel-container {
    padding-inline: var(--carousel-gap);
  }
}
.full-width .carousel-nav {
  @apply px-2 sm:px-4;
}

.rounded .carousel-nav.absolute {
  @apply px-2 sm:px-4;
}
.carousel-wrap {
  gap: var(--carousel-gap);

  grid-auto-flow: column;
  grid-auto-columns: calc(
    var(--width-xs) - var(--carousel-gap) * var(--correction-xs)
  );

  @screen sm {
    grid-auto-columns: calc(
      var(--width-sm) - var(--carousel-gap) * var(--correction-sm)
    );
  }
  @screen md {
    grid-auto-columns: calc(
      var(--width-md) - var(--carousel-gap) * var(--correction-md)
    );
  }

  @screen lg {
    grid-auto-columns: calc(
      var(--width-lg) - var(--carousel-gap) * var(--correction-lg)
    );
  }
  @screen xl {
    grid-auto-columns: calc(
      var(--width-xl) - (var(--carousel-gap) * var(--correction-xl))
    );
  }
  &.loop {
    padding-left: var(--carousel-gap);
  }
}
.carousel-nav {
  button {
    --tw-bg-opacity: 0;
    &:hover {
      --tw-bg-opacity: 100;
    }
  }
}
</style>
