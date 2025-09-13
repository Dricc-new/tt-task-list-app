<template>
  <div class="space-y-2 flex justify-end">
    <q-btn
      class="min-w-32"
      @click="showForm = true"
      color="primary"
      label="Nueva Tarea"
    />
  </div>
  <q-dialog v-model="showForm" @before-hide="ResetForm">
    <q-card class="w-full max-w-md">
      <form @submit.prevent="submitForm">
        <q-card-section>
          <div class="text-h6">{{ captionDialog }}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            dense
            v-model="form.title"
            label="Título de la tarea"
            class="mb-4"
          />

          <q-select
            filled
            label="Keywords"
            v-model="form.keywords"
            use-input
            use-chips
            multiple
            dense
            input-debounce="0"
            @new-value="createValue"
            :options="filterOptions"
            @filter="filterFn"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn class="min-w-32" type="submit" color="primary" label="Guardar" />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
  <fieldset class="flex justify-end"></fieldset>
</template>

<script setup lang="ts">
import type { Task } from "src/services/interfaces";
import { inject, reactive, ref, watch } from "vue";

const props = defineProps<{
  task: Task | null;
}>();

const tasksContext = inject<{
  createTask: (title: string, keywords: Array<string>) => void;
  editTask: (id: string, newValue: Task) => void;
}>("tasksContext");

const showForm = ref(false);
const captionDialog = ref("Nueva Tarea");
const form = reactive<{ title: string; keywords: Array<string> }>({
  title: "",
  keywords: [],
});

// Function to handle form submission for creating or editing a task
function submitForm() {
  if (tasksContext) {
    if (props.task) {
      tasksContext?.editTask(props.task.id, { ...props.task, ...form });
    } else {
      tasksContext?.createTask(form.title, form.keywords);
    }

    ResetForm();
    showForm.value = false;
  }
}

// Function to reset the form fields
function ResetForm() {
  Object.assign(form, { title: "", keywords: [] });
}

// Options for the keywords select input
const stringOptions = ["Urgente", "Trabajo", "Personal", "Estudio", "Importante"];
const filterOptions = ref(stringOptions);

type TypeDoneFn = (item?: string, mode?: "toggle" | "add" | "add-unique") => void;

// Function to handle creation of new keyword options
function createValue(val: string, done: TypeDoneFn) {
  if (val.length > 0) {
    if (!stringOptions.includes(val)) {
      stringOptions.push(val);
    }
    done(val, "add-unique");
  }
}

// Function to filter the keyword options based on user input
type TypeUpdateFn = (callbackFn: () => void) => void;
function filterFn(val: string, update: TypeUpdateFn) {
  update(() => {
    if (val === "") {
      filterOptions.value = stringOptions;
    } else {
      const needle = val.toLowerCase();
      filterOptions.value = stringOptions.filter(
        (v) => v.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}

watch(
  () => props.task, // Observar la prop
  (newTask) => {
    if (newTask) {
      captionDialog.value = "Editar Tarea";
      Object.assign(form, {
        title: newTask.title,
        keywords: newTask.keywords,
      });
      showForm.value = true;
    } else {
      captionDialog.value = "Nueva Tarea";
      ResetForm();
    }
  }
);
</script>
