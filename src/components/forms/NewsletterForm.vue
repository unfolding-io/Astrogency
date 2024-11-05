<template>
  <form
    name="newsletter-subscribes"
    class="grid grid-cols-1 gap-3"
    :class="className"
    @submit.prevent="submit"
  >
    <div class="flex pb-3 empty:hidden">
      <slot />
    </div>
    <div
      class="input-group relative w-full min-w-[10rem] max-w-sm"
      v-if="show_name_field"
    >
      <Input
        id="name"
        name="first_name"
        class="input w-full rounded-2xl bg-dark/10 px-4 py-2.5 pr-14 text-inherit sm:rounded-3xl"
        v-model="form.first_name"
        :class="errorFields?.first_name?.length ? '' : ''"
        :placeholder="t('name')"
      />
    </div>
    <div class="input-group relative w-full min-w-[10rem] max-w-sm">
      <Input
        type="email"
        id="email"
        name="email"
        class="input w-full rounded-2xl bg-dark/10 px-4 py-2.5 pr-14 text-inherit sm:rounded-3xl"
        v-model="form.email"
        :class="errorFields?.email?.length ? '' : ''"
        :placeholder="t('email')"
      />

      <button
        v-if="!show_name_field && !include_main_list"
        type="submit"
        :disabled="loading"
        :class="inputClass || 'surface-primary'"
        class="btn-icon-s group absolute inset-y-1 right-1 p-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          class="group-hover:scale-110 transform transition-transform duration-200"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 12h14m-7-7l7 7l-7 7"
          />
        </svg>
      </button>
    </div>
    <div class="flex items-center space-x-2" v-if="include_main_list">
      <Switch
        id="newsletter"
        v-if="include_main_list"
        v-model:checked="main_list"
        :class="inputClass"
      />
      <label
        for="newsletter"
        class="text-xs"
        :class="!main_list && 'line-through'"
        >{{ t("subscribe_to_newsletter") }}</label
      >
    </div>
    <div v-if="show_name_field || include_main_list">
      <button
        type="submit"
        :disabled="loading"
        :class="`${inputClass} btn-sm group disabled:pointer-events-none disabled:cursor-not-allowed`"
      >
        {{ t("subscribe") }}
      </button>
    </div>

    <Loading :loading="loading" />
  </form>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useTranslations } from "@lib/translate";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import Loading from "@components/common/Loading.vue";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { actions } from "astro:actions";

import { toastMessage } from "@/store";

const props = defineProps({
  list_id: String,
  endpoint: String,

  lang: {
    type: String,
    required: false,
    default: "nl",
  },
  thank_you: {
    type: String,
    required: true,
    default: "Thank you for subscribing!",
  },
  include_main_list: {
    type: Boolean,
    default: false,
  },
  opt_in: {
    type: Boolean,
    default: false,
  },
  show_name_field: {
    type: Boolean,
    default: false,
  },
  list: {
    type: String,
    required: false,
    default: "",
  },
  className: {
    type: String,
    required: false,
    default: "",
  },
  inputClass: {
    type: String,
    required: false,
    default: "",
  },
});
const t = useTranslations(props.lang);
const loading = ref(false);
const main_list = ref(false);
const form = reactive({ email: "", first_name: "" });
const rules = {
  email: [
    {
      type: "email",
      required: true,
    },
  ],
  first_name: [
    {
      type: "string",
      required: props.show_name_field,
    },
  ],
};
const { pass, isFinished, errorFields } = useAsyncValidator(form, rules);
const canSubmit = computed(() => {
  return isFinished.value && pass.value;
});

const submit = async () => {
  if (!canSubmit.value) {
    toastMessage.set({
      message: t("missing_email"),
      description: "",
      type: "error",
      date: new Date(),
    });
    return;
  }
  loading.value = true;

  const { data, error } = await actions.newsletter({
    ...form,
    lang: props.lang,
    email: form.email,
    name: form.first_name,
    include_newsletter: main_list.value,
    list_id: props.list,
    opt_in: props.opt_in,
  });

  loading.value = false;

  if (error) {
    toastMessage.set({
      message: error?.message || t("newsletter_error"),
      description: "",
      type: "error",
      date: new Date(),
    });
  }

  if (data?.message !== "ok") {
    console.error("data error", data);
    toastMessage.set({
      message: data?.message || t("newsletter_error"),
      description: "",
      type: "error",
      date: new Date(),
    });
  } else {
    toastMessage.set({
      message: props.thank_you,
      type: "success",
      date: new Date(),
    });
    /* Clear form data and close modal */
    form.email = "";
    form.first_name = "";
  }
};
</script>
