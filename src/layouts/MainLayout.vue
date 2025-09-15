<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-grey-3 text-primary">
      <q-toolbar>
        <q-toolbar-title class="md:text-center"> TASK LIST </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>
