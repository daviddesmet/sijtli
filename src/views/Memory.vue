<template>
  <div>
    <div id="max-w-xl mx-auto sm:px-6 lg:px-8">
      <router-link to="/">Inicio</router-link> | <router-link to="/game/memory">Memoria</router-link> |
      <router-link to="/game/puzzle">Rompecabezas</router-link>
    </div>
    <memory-game />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MemoryGame from "@/components/MemoryGame.vue";

@Options({
  components: {
    MemoryGame
  }
})
export default class Memory extends Vue {}
</script>
