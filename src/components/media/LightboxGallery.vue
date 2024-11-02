<template>
    <div :class="className" ref="gallery">
        <slot />
    </div>
 
 
</template>

<script setup>
import { ref, onMounted } from "vue";
import PhotoSwipeLightbox from "photoswipe/lightbox";

import "photoswipe/style.css";
const lightbox = ref(null);
const gallery = ref(null);

const props = defineProps({ 
  className: {
    type: String,
    required: true,
  },  
  id: {
    type: String,
    required: true,
  },
});
 

onMounted(() => {

  if (!lightbox.value) {
    lightbox.value = new PhotoSwipeLightbox({
      gallery: gallery.value,
      children: 'a',
      pswpModule: () => import("photoswipe"),
    });
    lightbox.value.init();

    lightbox.value.addFilter(
      "useContentPlaceholder",
      (useContentPlaceholder, content) => {

        return useContentPlaceholder;
      },
    );
  }
});
</script>
