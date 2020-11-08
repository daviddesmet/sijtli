<template>
  <button class="keyboard-row-letter text-black bg-white shadow-sm border-none" type="button" :id="letter" @click="clicked" :disabled="isDisabled">
    {{ letter }}
  </button>
</template>

<script lang="ts">
import { prop, Vue } from "vue-class-component";

class Props {
  letter = prop<string>({ default: "" });
  gameOver = prop<boolean>({ default: false });
  twoPlayers = prop<boolean>({ default: false });
}

export default class HangmanGameLetterButton extends Vue.props(Props) {
  disabled = false;

  get isDisabled(): boolean {
    if (this.gameOver) return true;
    return this.disabled;
  }

  clicked(): void {
    this.disabled = true;
    this.$emit("check");
  }
}
</script>

<style lang="scss" scoped>
.keyboard-row-letter {
  height: 40px;
  width: 28px;
}

button {
  font-family: "Roboto", sans-serif;
  margin: 2px;
}
button:disabled {
  color: #ccc;
}
</style>
