<template>
  <hangman-game :words="words" lang="ES" @finished="gameFinished" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HangmanGame from "@/components/HangmanGame.vue";

@Options({
  components: {
    HangmanGame
  }
})
export default class Hangman extends Vue {
  words = ["Cultura", "Muerto", "Pan", "Altar", "Calavera"];

  gameFinished(word: string, lose: boolean): void {
    // console.log("game finished!!!");
    // console.log("user was guessing word:", word);
    // console.log("she/he/it lost?", lose);
  }
}
</script>
