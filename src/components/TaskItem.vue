<template>
  <q-item class="q-pa-sm q-card q-rounded-borders bg-white">
    <q-item-section side>
      <q-checkbox v-model="completed" color="teal" />
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
          {{ tag }}
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
import { inject, ref, watch } from "vue";
import TaskMenuSettings from "./TaskMenuSettings.vue";
import type { Task } from "src/services/interfaces";

const props = defineProps<{
  id: string;
  state: boolean;
  title: string;
  keywords: Array<string>;
}>();

const completed = ref(props.state);

const tasksContext = inject<{
  editTask: (id: string, newValue: Task) => void;
}>("tasksContext");

watch(completed, (newVal) => {
  if (tasksContext) {
    tasksContext.editTask(props.id, { ...props, state: newVal });
  }
});
</script>
