<template>
  <Accordion type="single" :collapsible="true" class="w-full">
    <AccordionItem v-for="(item, index) in items" :key="index" :value="`item_${index}`">
      <AccordionTrigger class="text-xl text-left text-balance">{{ item.title }}</AccordionTrigger>
      <AccordionContent>
        <div class="richtext max-w-2xl text-balance pt-2 pb-8" v-html="item.content"></div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>

<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface AccordionItem {
  title: string;
  content: string;
}

interface Props {
  items: AccordionItem[];
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
});
</script>