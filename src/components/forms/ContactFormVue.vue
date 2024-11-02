<template>
  <div ref="container">
    <form @submit.prevent="submit" class="grid w-full grid-cols-1 gap-2 max-w-2xl">
      <div class="pb-3">
        <slot />
      </div>
      <div v-if="show_topics" class="input-group z-40 min-w-[12rem] flex-1">
        <Select v-model="selectedTopicName">
          <SelectTrigger class="w-full border border-current bg-light">
            <SelectValue :placeholder="t('select_a_topic')" />
          </SelectTrigger>
          <SelectContent :bodyLock="false" style="z-index: 9999999">
            <SelectGroup>
              <SelectLabel>{{ t("select_a_topic") }}</SelectLabel>
              <SelectItem
                v-for="topic in topics"
                :value="topic.name"
                :key="topic.name"
              >
                {{ topic.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="flex flex-wrap gap-2">
        <div class="input-group min-w-[12rem] flex-1">
          <Input
            v-model="form.name"
            type="text"
            name="name"
            :placeholder="t('name')"
            :class="{ error: hasError('name') }"
          />
        </div>
        <div class="input-group min-w-[12rem] flex-1">
          <Input
            v-model="form.phone"
            type="text"
            name="phone"
            :placeholder="t('phone')"
          />
        </div>
      </div>
      <div class="input-group min-w-[12rem] flex-1">
        <Input
          v-model="form.email"
          type="email"
          name="email"
          :placeholder="t('email')"
          :class="{ error: hasError('email') }"
        />
      </div>
      <div class="input-group min-w-[12rem]">
        <Textarea
          v-model="form.message"
          ref="textarea"
          name="message"
          cols="30"
          rows="4"
          :placeholder="t('message')"
          class="hide-scrollbar no-scrollbar"
          :class="{ error: hasError('message') }"
        />
      </div>
      <div class="pointer-events-none flex justify-start">
        <button
          type="submit"
          :disabled="loading"
          :class="surface_accent"
          class="btn group pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ t("submit") }}
        </button>
      </div>
      <Loading :loading="loading" />
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useTranslations } from "@lib/translate"; 
import { toastMessage, showDialog } from "@/store";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Loading from "@components/common/Loading.vue";
import { actions } from "astro:actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const props = defineProps({
  topics: Array,
  topic: Object,
  lang: {
    type: String,
    required: true,
  },
  show_topics: Boolean,
  thank_you: {
    type: String,
    default: "Thank you for your message",
  },
  endpoint: {
    type: String,
    default: "none",
  },
  surface_accent: {
    type: String,
    default: "surface-dark",
  },
});

const emit = defineEmits(["update:open"]);

const t = useTranslations(props.lang);
const form = reactive({ email: "", name: "", message: "", phone: "" });
const submitted = ref(false);
const loading = ref(false);
const selectedTopic = ref(null);
const selectedTopicName = ref(null);
const container = ref(null);

const rules = {
  email: [{ type: "email", required: true }],
  name: [{ type: "string", required: true }],
  message: [{ type: "string", min: 2, required: true }],
};

const { pass, isFinished, errorFields } = useAsyncValidator(form, rules);

const canSubmit = computed(() => isFinished.value && pass.value);

const hasError = (field) =>
  errorFields.value?.[field]?.length && submitted.value;

const submit = async () => {
  if (!canSubmit.value) {
    submitted.value = true;
    toastMessage.set({
      message: t("contact_missing_fields"),
      type: "error",
      date: new Date(),
    });
    return;
  }

  loading.value = true;
  const { data, error } = await actions.contact({
    ...form,
    lang: props.lang,
    topicName: selectedTopic.value?.name,
    topicDestination: selectedTopic.value?.destination,
  });

  loading.value = false;

  if (error || data?.status !== "ok") {
    toastMessage.set({
      message: "error",
      type: "error",
      description:
        data?.status === "env_missing" ? data.message : t("contact_error"),
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
    form.name = "";
    form.message = "";
    form.phone = "";
    selectedTopicName.value = null;
    selectedTopic.value = null;
    showDialog.set({ id: props.id, show: false });
  }
};

onMounted(() => {
  selectedTopic.value = props.topic;
  selectedTopicName.value = props.topic?.name;
});
</script>

<style lang="postcss" scoped>
.input-group {
  @apply relative flex flex-col justify-center text-current;
}
</style>
