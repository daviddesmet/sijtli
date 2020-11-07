<template>
  <div class="home">
    <div id="max-w-xl mx-auto sm:px-6 lg:px-8">
      <router-link to="/">Inicio</router-link> |
      <router-link to="/game/memory">Memoria</router-link>
    </div>
    <img alt="logo" class="w-64 h-64" src="../assets/img/logo.png" />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Home extends Vue {}
</script>
