<template>
  <div id="hangman">
    <div>
      <button v-if="allowPlayAgain" class="border border-white text-white rounded p-4 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700" @click.prevent="playAgain">
        {{ playAgainMessage }}
      </button>
    </div>

    <!-- canvas where hangman is drawn -->
    <div id="board" ref="board" class="bg-white rounded-lg shadow-md">
      <canvas ref="boardCanvas" id="board-canvas"></canvas>
    </div>

    <!-- row of blank letters for the selected word -->
    <div id="word">
      <div class="word-blankletter" v-for="(letter, key) in wordDivs" :key="key" v-cloak>
        {{ letter }}
      </div>
    </div>

    <!-- keyboard -->
    <div id="keyboard">
      <div v-for="(row, key) in letters" :key="key" class="keyboard-row">
        <letter-button v-for="letter in row" :key="letter" :letter="letter" :two-players="twoPlayers" @check="check(letter)" :game-over="gameOver" v-cloak />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, prop, Vue } from "vue-class-component";
import LetterButton from "./HangmanGameLetterButton.vue";

class Props {
  words = prop<string[]>({ default: () => ["Pear", "Apple", "Tomatoe", "Blackberry", "Strawberry"] });
  allowPlayAgain = prop<boolean>({ default: true });
  lang = prop({
    type: String,
    default: "EN",
    validator: (value: string) => ["EN", "ES"].indexOf(value) !== -1
  });
}

@Options({
  components: {
    LetterButton
  }
})
export default class HangmanGame extends Vue.props(Props) {
  // keyboard letters
  letters = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];
  // currentWord will be set to a random word from above list
  currentWord = "";
  // each element in this array is a letter in the word
  wordDivs: string[] = [];
  // to count the number of wrong guesses
  guesses = 0;
  gameOver = false;
  lose = false;
  twoPlayers = false;

  canvas: HTMLCanvasElement | undefined = undefined;
  // will be set to the canvas 2d context
  ctx: CanvasRenderingContext2D | null = null;

  get wordsUpperCased(): string[] {
    return this.words.map((word) => word.toUpperCase());
  }

  get playAgainMessage(): string {
    switch (this.lang) {
      case "ES":
        return "Jugar de nuevo";
      default:
        return "Play Again";
    }
  }

  get winMessage(): string {
    let winMessage;
    switch (this.lang) {
      case "ES":
        winMessage = "Ganaste!";
        break;
      default:
        winMessage = "You won!";
        break;
    }
    return winMessage;
  }

  get loseMessage(): string {
    let loseMessage;
    switch (this.lang) {
      case "ES":
        loseMessage = "Ohh, haz perdido!";
        break;
      default:
        loseMessage = "Ohh, you lost!";
        break;
    }
    return loseMessage;
  }

  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  drawGallows(ctx: CanvasRenderingContext2D): void {
    if (this.canvas) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "#FF9800";
      ctx.strokeStyle = "#FF9800";
      ctx.beginPath();
      // left side
      ctx.moveTo(this.canvas.width / 10, this.canvas.height / 10);
      ctx.lineTo(this.canvas.width / 10, this.canvas.height * 0.95);
      // bottom side
      ctx.lineTo(this.canvas.width * 0.8, this.canvas.height * 0.95);
      // top side
      ctx.moveTo(this.canvas.width / 10, this.canvas.height / 10);
      ctx.lineTo(this.canvas.width * 0.4, this.canvas.height / 10);
      // hanging notch
      ctx.lineTo(this.canvas.width * 0.4, this.canvas.height / 5);
      ctx.stroke();
      ctx.closePath();
    }
  }

  // fill this.wordDivs with empty strings to create the orange blanks
  makeBlanks(): void {
    for (var i = 0; i < this.currentWord.length; i++) {
      this.wordDivs.push("");
    }
  }

  // draws the appropriate part of the hanging man and/or 'game over'
  updateCanvas(ctx: CanvasRenderingContext2D): void {
    if (!this.canvas) return;

    // this.drawGallows(ctx);
    // draw the head
    if (this.guesses === 0) {
      ctx.beginPath();
      ctx.arc(this.canvas.width * 0.4, this.canvas.height / 5 + 20, 20, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    }
    // draw the torso
    else if (this.guesses === 1) {
      ctx.beginPath();
      ctx.moveTo(this.canvas.width * 0.4, this.canvas.height / 5 + 40);
      ctx.lineTo(this.canvas.width * 0.4, this.canvas.height / 2);
      ctx.stroke();
      ctx.closePath();
    }
    // draw the right leg
    else if (this.guesses === 2) {
      ctx.beginPath();
      ctx.moveTo(this.canvas.width * 0.4, this.canvas.height / 2);
      ctx.lineTo(this.canvas.width * 0.4 + 30, this.canvas.height * 0.7);
      ctx.stroke();
      ctx.closePath();
    }
    // draw the left leg
    else if (this.guesses === 3) {
      ctx.beginPath();
      ctx.moveTo(this.canvas.width * 0.4, this.canvas.height / 2);
      ctx.lineTo(this.canvas.width * 0.4 - 30, this.canvas.height * 0.7);
      ctx.stroke();
      ctx.closePath();
    }
    // draw the right arm
    else if (this.guesses === 4) {
      ctx.beginPath();
      ctx.moveTo(this.canvas.width * 0.4, this.canvas.height / 5 + 55);
      ctx.lineTo(this.canvas.width * 0.4 + 35, this.canvas.height / 2 + 10);
      ctx.stroke();
      ctx.closePath();
    }
    // draw the left arm and handle game over
    else if (this.guesses === 5) {
      ctx.beginPath();
      ctx.moveTo(this.canvas.width * 0.4, this.canvas.height / 5 + 55);
      ctx.lineTo(this.canvas.width * 0.4 - 35, this.canvas.height / 2 + 10);
      ctx.stroke();
      ctx.closePath();
      // game over
      ctx.font = "24px Roboto, sans-serif";
      ctx.fillText(this.loseMessage, this.canvas.width * 0.4 - 30, this.canvas.height * 0.9);
      this.gameOver = true;
      this.lose = true;
      this.$emit("finished", this.currentWord, this.lose);
      // fill in the word with the correct answer
      for (var i = 0; i < this.currentWord.length; i++) {
        this.wordDivs[i] = this.currentWord[i];
        // this.$set(this.wordDivs, i, this.currentWord[i]);
      }
    }
    this.guesses++;
  }

  // check the chosen letter when a letter component emits 'check'
  check(letter: string): void {
    if (!this.ctx || !this.canvas) return;

    if (!this.gameOver) {
      var guessCorrect = false;
      // check if the letter is in the word, if so, fill it in
      for (var i = 0; i < this.currentWord.length; i++) {
        if (letter == this.currentWord[i]) {
          this.wordDivs[i] = letter;
          // this.$set(this.wordDivs, i, letter);
          guessCorrect = true;
        }
      }
      // if there are no more blanks in the word, you win
      if (!this.wordDivs.some((value) => value == "")) {
        this.gameOver = true;
        this.ctx.font = "24px Roboto, sans-serif";
        this.ctx.fillText(this.winMessage, this.canvas.width * 0.4 - 30, this.canvas.height * 0.9);
        this.$emit("finished", this.currentWord, this.lose);
      }
      // if they guess wrong, draw the man
      if (!guessCorrect) {
        this.updateCanvas(this.ctx);
      }
    }
  }

  restart(): void {
    this.gameOver = false;
    this.lose = false;
    this.guesses = 0;
    this.wordDivs.splice(0);
    if (this.ctx) {
      this.drawGallows(this.ctx);
    }
    this.makeBlanks();
  }

  playAgain(): void {
    this.currentWord = this.getRandomWord();
    this.restart();
  }

  getRandomWord(): string {
    return this.wordsUpperCased[this.randomInteger(0, this.wordsUpperCased.length - 1)];
  }

  mounted(): void {
    // identify the canvas element and initialize it, draw the gallows, choose a word, and draw the blanks.
    this.canvas = this.$refs.boardCanvas as HTMLCanvasElement;
    const board = this.$refs.board as HTMLDivElement;
    this.canvas.width = board.offsetWidth;
    this.canvas.height = board.offsetHeight;
    this.ctx = this.canvas.getContext("2d");
    if (this.ctx) {
      this.ctx.lineWidth = 2;

      this.drawGallows(this.ctx);
      this.currentWord = this.getRandomWord();
      this.makeBlanks();
    }
  }
}
</script>

<style lang="scss" scoped>
/*
HANGMAN
https://github.com/joebeachjoebeach/hangman
Table of Contents
I. global element selectors
II. helper classes applied by js
III. the app
	A. title bar / header
	B. canvas
	C. blank letters
	D. keyboard
	E. game-option buttons
*/
/* I. global element selectors */
html,
body {
  align-items: center;
  background-color: #f5f5f6;
  color: #333;
  display: flex;
  flex-direction: column;
  font-family: "Roboto", sans-serif;
  height: 100%;
  width: 100%;
}
/* II. helper classes applied by js */
.hidden {
  display: none;
}
.orange {
  background-color: #ff9800;
}
/* III. the app and its contents */
#hangman {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  width: 100%;
}
/* B. canvas container */
#board {
  flex: 2 1 auto;
  margin: 10px 0 0;
  max-width: 500px;
  min-height: 400px;
  width: 95%;
}
/* C. blank letters */
#word {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0 18px;
}
.word-blankletter {
  align-items: flex-end;
  background-color: #ff9800;
  box-shadow: 0 2px 5px #d0d0d0;
  display: flex;
  height: 30px;
  justify-content: center;
  margin: 0 2px 2px;
  width: 20px;
}
/* D. keyboard */
#keyboard {
  align-items: center;
  display: flex;
  flex: 2 1 auto;
  flex-direction: column;
}
.keyboard-row {
  display: flex;
}
/* E. game-option buttons */
#buttons {
  display: flex;
  justify-content: space-between;
  margin: 0 0 5px;
  max-width: 700px;
  width: 95%;
}
.buttons-button {
  font-size: 1em;
  height: 25px;
  margin: auto;
}
</style>
