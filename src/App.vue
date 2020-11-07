<template>
  <div class="relative flex items-top justify-center min-h-screen bg-gray-200 dark:bg-gray-900 sm:items-center sm:pt-0 font-sans">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class App extends Vue {}
</script>

<style lang="scss">
@import "./assets/sass/main";
</style>
