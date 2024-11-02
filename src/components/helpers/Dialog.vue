<template>
  <Dialog :open="show" @update:open="hide">
    <DialogContent :class="['border-0 rounded-media sm:max-w-[650px]', surface]">
      <DialogHeader>
        <DialogTitle class="sr-only">{{ title }}</DialogTitle>
      </DialogHeader>
      <div class="hide-scrollbars dialog__content">
        <slot />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import { showDialog } from "@/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogProps {
  id: string;
  title: string;
  surface?: string;
}

const props = withDefaults(defineProps<DialogProps>(), {
  surface: "surface-light",
});

const $show = useStore(showDialog);

const show = computed(() => $show.value.show && $show.value.id === props.id);

const hide = () => {
  if (show.value) {
    showDialog.set({ id: props.id, show: false });
  }
};

onMounted(() => {
  const selector = `a[href="#${props.id}"]`;
  const handleClick = (event: Event) => {
    event.preventDefault();
    showDialog.set({ id: props.id, show: true });
  };

  document.querySelectorAll(selector).forEach((link) => {
    link.addEventListener("click", handleClick);
  });

  return () => {
    document.querySelectorAll(selector).forEach((link) => {
      link.removeEventListener("click", handleClick);
    });
  };
});
</script>

<style lang="postcss" scoped>
.dialog__content {
  max-height: calc(100vh - 2rem);
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
