<template>
  <q-btn flat round @click="menuShow = true" icon="more_vert" />
  <q-menu>
    <q-list dense style="min-width: 100px">
      <q-item clickable @click="tasksContext?.selectTaskToEdit(id)" v-close-popup>
        <q-item-section>Editar</q-item-section>
      </q-item>
      <q-item clickable @click="tasksContext?.deleteTask(id)" v-close-popup>
        <q-item-section>Eliminar</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
defineProps<{ id: string }>();
const menuShow = ref(false);

const tasksContext = inject<{
  deleteTask: (id: string) => void;
  selectTaskToEdit: (id: string) => void;
}>("tasksContext");
</script>
