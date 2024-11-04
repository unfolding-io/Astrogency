<template>
  <div
    class="pointer-events none sticky inset-x-0 bottom-4 z-40 -mb-5 -mt-5 flex h-8 items-center justify-end"
  >
    <button
      aria-label="scroll down or up"
      class="scroll-down btn-icon pointer-events-auto m-4 text-xl"
      :class="surface || 'surface-secondary'"
      @click="scrollUpOrDown"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        class="transition-transform duration-300 ease-in-out"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 5v14m7-7l-7 7l-7-7"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  surface?: string | undefined;
}>();

const scrollUpOrDown = () => {
  window.scrollTo({
    top: window.scrollY >= window.innerHeight / 2 ? 0 : window.innerHeight,
    behavior: "smooth",
  });
};
</script>

<style lang="postcss">
[data-is-hero="false"] {
  .scroll-down svg {
    @apply rotate-180;
  }
}
</style>
