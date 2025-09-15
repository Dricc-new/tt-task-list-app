<template>
  <div class="full-width h-full relative mx-auto max-w-3xl">
    <TaskFrom :task="selectedTask" />
    <div v-if="loading" class="flex w-full justify-center items-center min-h-64">
      <q-circular-progress
        indeterminate
        rounded
        size="50px"
        color="light-green-14"
        class="q-ma-md"
      />
    </div>
    <p v-else-if="!tasks.length && !loading" class="text-center font-medium">
      Aun no hay tareas, se el primero en crear una
    </p>
    <q-list v-else class="q-px-md q-gutter-y-sm rounded-borders full-width full-height">
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
import { onMounted, provide, ref } from "vue";
import TaskFrom from "./TaskForm.vue";
import TaskItem from "./TaskItem.vue";
import type { Keyword, Task, TaskResponse } from "src/utils/interfaces";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";

const selectedTask = ref<Task | null>(null);
const quasar = useQuasar();
const tasks = ref<Task[]>([]);
const loading = ref(true);
// Fetch tasks from the API when the component is mounted
onMounted(async () => {
  try {
    const { data } = await api.get("/tasks");
    tasks.value = data.map(({ id, title, keywords, is_done }: TaskResponse) => ({
      id,
      title,
      keywords,
      state: is_done > 0,
    }));
  } catch (error) {
    quasar.notify({
      position: "top-right",
      type: "negative",
      message: "No se pudieron cargar las tareas. Error Interno del Servidor",
    });

    if (process.env.NODE_ENV == "development")
      console.error("Error cargando tareas:", error);
  } finally {
    loading.value = false;
  }
});

// Function to create a new task
async function createTask(title: string, keywords: Array<Keyword>) {
  try {
    const { data } = await api.post("/tasks", {
      title,
      keyword_ids: keywords.map((item) => item.id),
    });

    const { task } = data;
    tasks.value.push({
      id: task.id,
      title: task.title,
      keywords: task.keywords,
      state: task.is_done > 0,
    });

    quasar.notify({
      position: "top-right",
      type: "submission",
      message: "La tarea fue creada con exito",
    });
  } catch (error) {
    quasar.notify({
      position: "top-right",
      type: "negative",
      message: "No se pudio crear la tarea. Error Interno del Servidor",
    });

    if (process.env.NODE_ENV == "development")
      console.error("Error creando tarea:", error);
  }
}

// Function to edit a task using its ID
async function editTask(
  id: string,
  newValue: { title: string; keywords: Array<Keyword> }
) {
  try {
    const { data } = await api.patch(`/tasks/${id}`, {
      title: newValue.title,
      keyword_ids: newValue.keywords.map((item) => item.id),
    });

    const index = tasks.value.findIndex((task) => task.id === id);
    if (index !== -1) {
      const { task } = data;
      tasks.value[index] = {
        id: task.id,
        title: task.title,
        keywords: task.keywords,
        state: task.is_done > 0,
      };
    }

    quasar.notify({
      position: "top-right",
      type: "submission",
      message: "La tarea fue modificada con exito",
    });
  } catch (error) {
    quasar.notify({
      position: "top-right",
      type: "negative",
      message: "No se pudio editar la tarea. Error Interno del Servidor",
    });

    if (process.env.NODE_ENV == "development")
      console.error("Error editando tarea:", error);
  }
}

// Function to toggle the completion state of a task using its ID
async function toogleTask(id: string): Promise<void> {
  try {
    const { data } = await api.patch(`/tasks/${id}/toggle`);
    const index = tasks.value.findIndex((task) => task.id === id);
    if (index !== -1) {
      const { task } = data;
      tasks.value[index] = {
        id: task.id,
        title: task.title,
        keywords: task.keywords,
        state: task.is_done > 0,
      };
    }
  } catch (error) {
    quasar.notify({
      position: "top-right",
      type: "negative",
      message: "No se pudio editar la tarea. Error Interno del Servidor",
    });

    if (process.env.NODE_ENV == "development")
      console.error("Error editando tarea:", error);

    throw error;
  }
}

// Function to delete a task using its ID
async function deleteTask(id: string) {
  try {
    await api.delete(`/tasks/${id}`);
    tasks.value.splice(
      tasks.value.findIndex((task) => task.id === id),
      1
    );

    quasar.notify({
      position: "top-right",
      type: "submission",
      message: "La tarea fue eliminada con exito",
    });
  } catch (error) {
    quasar.notify({
      position: "top-right",
      type: "negative",
      message: "No se pudio eliminar la tarea. Error Interno del Servidor",
    });

    if (process.env.NODE_ENV == "development")
      console.error("Error eliminando tarea:", error);
  }
}

// Function to select a task for editing
function selectTaskToEdit(id: string | null) {
  const task = tasks.value.find((task) => task.id === id) || null;
  selectedTask.value = task;
}

provide("tasksContext", {
  createTask,
  editTask,
  deleteTask,
  selectTaskToEdit,
  toogleTask,
});
</script>
