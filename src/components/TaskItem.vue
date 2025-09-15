<template>
  <q-item class="q-pa-sm q-card q-rounded-borders bg-white">
    <q-item-section side>
      <q-checkbox
        v-model="completed"
        @update:model-value="onCheckboxChange"
        color="teal"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption class="row q-gutter-xs q-mt-xs">
        <q-badge
          v-for="(tag, i) in keywords"
          :key="i"
          color="primary"
          text-color="white"
          class="q-px-sm"
          rounded
        >
          {{ tag.name }}
        </q-badge>
      </q-item-label>
      <q-item-label caption>
        Estado: {{ completed ? "Completada" : "Pendiente" }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <TaskMenuSettings :id="id" />
    </q-item-section>
  </q-item>
</template>
<script setup lang="ts">
import { inject, ref } from "vue";
import TaskMenuSettings from "./TaskMenuSettings.vue";

const props = defineProps<{
  id: string;
  state: boolean;
  title: string;
  keywords: Array<{ id: string; name: string }>;
}>();

const completed = ref(props.state);

const tasksContext = inject<{
  toogleTask: (id: string) => Promise<void>;
}>("tasksContext");

async function onCheckboxChange() {
  try {
    if (tasksContext) {
      await tasksContext.toogleTask(props.id);
    }
  } catch (error) {
    // Revert the checkbox state in case of an error
    completed.value = !completed.value;
    if (process.env.NODE_ENV == "development")
      console.error("Error toggling task state:", error);
  }
}
</script>
