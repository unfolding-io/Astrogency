<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";

interface Labels {
  close: string;
  menu: string;
  back_to_home: string;
}

defineProps<{
  labels: Labels;
  surface?: string;
}>();

const html = ref<HTMLHtmlElement | null>(null);
const isOpen = ref(false);
const clicked = ref(false);

onMounted(() => {
  html.value = document.getElementsByTagName("html")[0];
});
</script>

<template>
  <div class="z-50 contents sm:hidden">
    <Drawer direction="bottom" v-model:open="isOpen">
      <DrawerTrigger
        asChild
        :aria-label="labels.menu"
        class="menu-btn pointer-events-auto z-50 aspect-square overflow-hidden p-2"
        :class="`p-2 ${isOpen && 'is-open'} ${!isOpen && clicked && 'close'} `"
        @click="
          isOpen = true;
          clicked = true;
        "
      >
        <slot name="icon" />
      </DrawerTrigger>
      <DrawerContent :class="surface">
        <DrawerHeader>
          <DrawerTitle class="hidden">{{ labels.menu }}</DrawerTitle>
          <DrawerDescription class="hidden">{{
            labels.menu
          }}</DrawerDescription>
        </DrawerHeader>

        <slot name="menu" />

        <DrawerFooter class="mt-0 h-fit">
          <DrawerClose class="hidden">
            <button variant="outline">{{ labels.close }}</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>

<style>
.menu-btn svg path {
  transform-origin: 50% 8px;
  transition:
    stroke 0.3s ease-in-out,
    fill 0.3s ease-in-out;
}
.menu-btn svg path:nth-of-type(1) {
  /* animation: hamburgerTopReset 300ms ease-in-out forwards; */
}
.menu-btn svg path:nth-of-type(2) {
  transform-origin: 50% 15px;
  /* animation: hamburgerMiddleReset 300ms ease-in-out forwards; */
}
.menu-btn svg path:nth-of-type(3) {
  transform-origin: 50% 22px;
  /*  animation: hamburgerBottomReset 300ms ease-in-out forwards; */
}

/*
 * Hamburger turns into X, i.e. menu open
 */
.is-open svg path:nth-of-type(1) {
  animation: hamburgerTopDeform 300ms ease-in-out forwards;
}
.is-open svg path:nth-of-type(2) {
  animation: hamburgerMiddleDeform 300ms ease-in-out forwards;
}
.is-open svg path:nth-of-type(3) {
  animation: hamburgerBottomDeform 300ms ease-in-out forwards;
}

.menu-btn.close svg path:nth-of-type(1) {
  animation: hamburgerTopReset 300ms ease-in-out forwards;
}
.menu-btn.close svg path:nth-of-type(2) {
  animation: hamburgerMiddleReset 300ms ease-in-out forwards;
}
.menu-btn.close svg path:nth-of-type(3) {
  animation: hamburgerBottomReset 300ms ease-in-out forwards;
}

@keyframes hamburgerTopReset {
  0% {
    transform: translateY(7px) rotate(45deg);
  }
  50% {
    transform: translateY(7px) rotate(0deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

@keyframes hamburgerMiddleReset {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

@keyframes hamburgerBottomReset {
  0% {
    transform: translateY(-7px) rotate(-45deg);
  }
  50% {
    transform: translateY(-7px) rotate(0deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

@keyframes hamburgerTopDeform {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(7px) rotate(0deg);
  }
  100% {
    transform: translateY(7px) rotate(45deg);
  }
}

@keyframes hamburgerMiddleDeform {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes hamburgerBottomDeform {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-7px) rotate(0deg);
  }
  100% {
    transform: translateY(-7px) rotate(-45deg);
  }
}
</style>
