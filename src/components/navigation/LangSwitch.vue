<template>
  <div class="contents" >
    <DropdownMenu :modal="false" v-model:open="show" >
      <DropdownMenuTrigger asChild>
        <button aria-label="select language"
        
        
          :class="`${surface || 'surface-primary'} btn btn-icon sm:text-md rounded-input text-sm shadow-md sm:p-2.5`">
          {{ lang }}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent :class="`${surface || 'surface-primary'} w-fit min-w-0 rounded-input border-0`"
        align="center" :sideOffset="10">
        <DropdownMenuItem v-for="{ locale, url } in localeUrls" :key="lang" asChild>
          <a :href="url" class="cursor-pointer text-lg ">
            {{ locale }}</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

defineProps<{
  localeUrls: Record<string, string>[];
  lang: string;
  surface?: string | undefined;
}>();

const show = ref(false)
</script>
