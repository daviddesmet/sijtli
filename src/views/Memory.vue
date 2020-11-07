<template>
  <div class="mt-4">
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
