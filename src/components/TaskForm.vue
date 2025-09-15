<template>
  <div
    class="sticky top-[3.25rem] p-3 px-4 shadow bg-white z-10 space-b-2 flex justify-end"
  >
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
            class="mb-2"
          />

          <q-select
            filled
            label="Keywords"
            v-model="form.keywords"
            use-input
            use-chips
            multiple
            dense
            options-dense
            input-debounce="0"
            @new-value="createValue"
            option-label="name"
            option-value="id"
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
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import type { Keyword, Task } from "src/utils/interfaces";
import { inject, onMounted, reactive, ref, watch } from "vue";

const props = defineProps<{ task: Task | null }>();

const tasksContext = inject<{
  createTask: (title: string, keywords: Array<Keyword>) => Promise<void>;
  editTask: (
    id: string,
    newValue: { title: string; keywords: Array<Keyword> }
  ) => Promise<void>;
  selectTaskToEdit: (id: string | null) => void;
}>("tasksContext");

const showForm = ref(false);
const captionDialog = ref("Nueva Tarea");
const quasar = useQuasar();
const form = reactive<{ title: string; keywords: Array<Keyword> }>({
  title: "",
  keywords: [],
});

// Function to handle form submission for creating or editing a task
async function submitForm() {
  if (tasksContext) {
    if (props.task) {
      const payload = JSON.parse(JSON.stringify(form));
      await tasksContext?.editTask(props.task.id, payload);
    } else {
      await tasksContext?.createTask(form.title, form.keywords);
    }

    showForm.value = false;
  }
}

// Function to reset the form fields
function ResetForm() {
  Object.assign(form, { title: "", keywords: [] });
}

// Options for the keywords select input
const stringOptions = ref<Keyword[]>([]);
const filterOptions = ref<Keyword[]>([]);

// Fetch existing keywords from the API when the component is mounted
onMounted(async () => {
  try {
    const { data } = await api.get("/keywords");
    stringOptions.value = data;
    filterOptions.value = data;
  } catch (err) {
    quasar.notify({
      position: "top-right",
      type: "negative",
      message: "rror cargando tareas",
    });

    if (process.env.NODE_ENV == "development")
      console.error("Error cargando tareas:", err);
  }
});

// Function to handle creation of new keyword options
type TypeDoneFn = (item?: Keyword, mode?: "toggle" | "add" | "add-unique") => void;
async function createValue(val: string, done: TypeDoneFn) {
  try {
    if (val.length > 0) {
      let keyword = stringOptions.value.find((k) => k.name === val);

      if (!keyword) {
        const { data } = await api.post("/keywords", { name: val });
        keyword = { id: data.id, name: data.name };
        stringOptions.value.push(keyword);
        filterOptions.value.push(keyword);
      }

      done(keyword, "add-unique");
    }
  } catch (error) {
    quasar.notify({
      position: "top-right",
      type: "negative",
      message: "Error Interno del Servidor",
    });
    if (process.env.NODE_ENV == "development")
      console.error("Error creando nueva keyword:", error);
  }
}

// Function to filter the keyword options based on user input
type TypeUpdateFn = (callbackFn: () => void) => void;
function filterFn(val: string, update: TypeUpdateFn) {
  update(() => {
    if (val === "") {
      filterOptions.value = stringOptions.value;
    } else {
      const needle = val.toLowerCase();
      filterOptions.value = stringOptions.value.filter(
        (v) => v.name.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}

// Watch for changes in the selected task to edit and update the form accordingly
watch(
  () => props.task,
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

// When the dialog is closed, clear the selected task to edit
watch(showForm, (newVal) => {
  if (!newVal) {
    tasksContext?.selectTaskToEdit(null);
    ResetForm();
  }
});
</script>
