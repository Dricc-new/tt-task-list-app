<template>
  <div class="q-pa-md full-width q-mx-auto max-w-3xl">
    <TaskFrom :task="selectedTask" />
    <q-list class="q-mt-md q-gutter-y-sm rounded-borders full-width full-height">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :id="task.id"
        :state="task.state"
        :keywords="task.keywords"
        :title="task.title"
      />
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";
import TaskFrom from "./TaskForm.vue";
import TaskItem from "./TaskItem.vue";
import type { Task } from "src/services/interfaces";

const selectedTask = ref<Task | null>(null);
const tasks = ref<Task[]>([
  {
    id: "1",
    title: "Task 1",
    state: false,
    keywords: ["Urgente", "Trabajo"],
  },
  { id: "2", title: "Task 2", state: true, keywords: ["Personal"] },
  {
    id: "3",
    title: "Task 3",
    state: false,
    keywords: ["Estudio", "Importante", "Mañana"],
  },
]);

// Function to generate a unique ID for new tasks
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

// Function to create a new task
function createTask(title: string, keywords: Array<string>) {
  const id = generateId();
  tasks.value.push({ id, title, keywords, state: false });
}

// Function to edit a task using its ID
function editTask(id: string, newValue: Task) {
  const index = tasks.value.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.value[index] = newValue;
  }
}

// Function to delete a task using its ID
function deleteTask(id: string) {
  tasks.value.splice(
    tasks.value.findIndex((task) => task.id === id),
    1
  );
}

// Function to select a task for editing
function selectTaskToEdit(id: string) {
  const task = tasks.value.find((task) => task.id === id) || null;
  selectedTask.value = task;
}

provide("tasksContext", { createTask, editTask, deleteTask, selectTaskToEdit });
</script>
