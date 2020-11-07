<template>
  <div>
    <div class="header">
      <div>
        <span class="label">Tiempo:</span> <span class="value">{{ elapsedTime }} </span>
      </div>
      <div>
        <span class="label">Turnos:</span> <span class="value">{{ turns }} </span>
      </div>
    </div>
    <div class="cards flex flex-wrap justify-center mx-auto max-w-5xl">
      <div class="card cursor-pointer" v-for="(card, index) in deck" :key="index" :class="{ flipped: card.flipped, matched: card.matched }" @click="flipCard(card)">
        <div class="back bg-white border border-gray-400 rounded-lg shadow"></div>
        <div class="front bg-white border border-gray-400 rounded-lg shadow" :style="{ backgroundImage: 'url(' + card.img + ')' }"></div>
      </div>
    </div>
    <div class="splash" v-if="finished">
      <div class="overlay"></div>
      <div class="content">
        <div class="title">Tiempo: {{ elapsedTime }}</div>
        <button @click.prevent="resetGame">Jugar de nuevo!</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import cloneDeep from "lodash-es/cloneDeep";
// import each from "lodash-es/each";
import filter from "lodash-es/filter";
// import map from "lodash-es/map";
import shuffle from "lodash-es/shuffle";
import Card from "./Card.vue";

interface CardType {
  name: string;
  img: string;
  flipped: boolean;
  matched: boolean;
}

@Options({
  components: {
    Card
  }
})
export default class MemoryGame extends Vue {
  started = false;
  finished = false;
  startTime = 0;
  elapsedTime = "--:--";
  timer?: number;
  turns = 0;

  // https://www.vexels.com/png-svg/preview/145631/day-of-the-dead-woman-mask
  // https://www.vexels.com/png-svg/preview/213958/hand-drawn-skeleton-mexican-day-of-dead
  // https://www.vexels.com/png-svg/preview/145862/sombrero-illustration
  // https://www.vexels.com/png-svg/preview/145517/candle-illustration
  // https://www.vexels.com/png-svg/preview/145699/hand-drawn-heart-day-of-the-dead
  // https://www.vexels.com/png-svg/preview/196130/cinco-de-mayo-skeleton-lady-flat
  // https://www.vexels.com/download-png-svg/196131/cinco-de-mayo-skeleton-man-flat

  deck: CardType[] = [];
  cardTypes: CardType[] = [
    { name: "catrina", img: "/img/cards/catrina.jpg", flipped: false, matched: false },
    { name: "skeleton-flat-man", img: "/img/cards/skeleton-flat-man.jpg", flipped: false, matched: false },
    { name: "calaca-m-baila", img: "/img/cards/calaca-m-baila.jpg", flipped: false, matched: false },
    { name: "calaca-h-baila", img: "/img/cards/calaca-h-baila.jpg", flipped: false, matched: false },
    { name: "calaca", img: "/img/cards/calaca.jpg", flipped: false, matched: false },
    { name: "skeleton-flat-woman", img: "/img/cards/skeleton-flat-woman.jpg", flipped: false, matched: false }
  ];

  get flippedCards(): CardType[] {
    return filter(this.deck, (card) => {
      return card.flipped;
    });
  }

  get flippedCardsMatch(): boolean {
    let flippedCards = this.flippedCards;
    if (flippedCards.length == 2 && flippedCards[0].name == flippedCards[1].name) {
      return true;
    }

    return false;
  }

  startGame(): void {
    this.started = true;
    this.startTime = new Date().getTime();

    this.timer = window.setInterval(() => {
      const distance = new Date().getTime() - this.startTime;

      // Time calculations for days, hours, minutes and seconds
      // const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      // const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.elapsedTime = `${(minutes < 10 ? "0" : "") + minutes}:${(seconds < 10 ? "0" : "") + seconds}`;
    }, 1000);
  }

  resetGame(): void {
    const cards = this.shuffleDeck();
    this.started = false;
    this.finished = false;
    this.startTime = 0;
    this.elapsedTime = "--:--";
    this.turns = 0;

    // each(cards, (card) => {
    //   card.flipped = false;
    //   card.found = false;
    // });
    this.deck.forEach((card) => {
      card.flipped = false;
      card.matched = false;
    });

    this.deck = cards;
  }

  endGame(): void {
    this.started = false;
    clearInterval(this.timer);
    this.finished = true;
  }

  shuffleDeck(): CardType[] {
    const cards1 = cloneDeep(this.cardTypes);
    const cards2 = cloneDeep(this.cardTypes);
    return shuffle<CardType>(cards1.concat(cards2));
  }

  matchFlips(): void {
    // each(this.deck, (card) => {
    //   if (card.flipped)
    //     card.found = true;
    // });
    this.deck.forEach((card) => {
      if (card.flipped) card.matched = true;
    });
  }

  clearFlips(): void {
    // map(this.deck, (card) => { return card.flipped = false; });
    this.deck.forEach((card) => {
      card.flipped = false;
    });
  }

  flipCard(card: CardType): void {
    if (card.matched || card.flipped) return;

    if (!this.started) {
      this.startGame();
    }

    let flipCount = this.flippedCards.length;
    if (flipCount == 0) {
      card.flipped = !card.flipped;
      return;
    }

    if (flipCount == 1) {
      card.flipped = !card.flipped;
      this.turns++;

      if (this.flippedCardsMatch) {
        setTimeout(() => {
          this.matchFlips();
          this.clearFlips();

          if (this.deck.every((card) => card.matched === true)) {
            this.endGame();
          }
        }, 400);
      } else {
        setTimeout(() => {
          this.clearFlips();
        }, 800);
      }
    }
  }

  created(): void {
    this.resetGame();
  }
}
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Press+Start+2P");

.header {
  border-bottom: 1px solid #ffaf01;
  font-family: "Press Start 2P", "Helvetica", "Arial", sans-serif;
  padding-bottom: 10px;
  text-align: center;

  div {
    display: inline-block;
    width: 30%;
  }

  .label {
    color: #ffaf01;
  }

  .value {
    color: #76ffc1;
  }
}

.cards .card {
  display: inline-block;
  height: 260px;
  margin: 1em 2em;
  position: relative;
  transition: opacity 0.5s;
  transition: opacity 0.5s;
  transition: opacity 0.5s;
  transition: opacity 0.5s;
  width: 180px;
}

.cards .card .front,
.cards .card .back {
  backface-visibility: hidden;
  backface-visibility: hidden;
  backface-visibility: hidden;
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transform: translateZ(0);
  transform: translateZ(0);
  transform: translateZ(0);
  transform: translateZ(0);
  transform-style: preserve-3d;
  transform-style: preserve-3d;
  transform-style: preserve-3d;
  transition: -moz-transform 0.6s;
  transition: -o-transform 0.6s;
  transition: -webkit-transform 0.6s;
  transition: transform 0.6s;
  width: 100%;
}

.cards .card .back {
  background-image: url("../assets/img/cards/card-pattern.jpg"); // https://www.vexels.com/vectors/preview/145290/bright-day-of-the-dead-seamless-pattern
  background-position: center;
  background-repeat: no-repeat;
  // background-size: 90%;
  background-size: cover;
  font-size: 12px;
}

.cards .card .front {
  background-position: center;
  background-repeat: no-repeat;
  // background-size: 90%;
  background-size: cover;
  transform: rotateY(-180deg);
  transform: rotateY(-180deg);
  transform: rotateY(-180deg);
  transform: rotateY(-180deg);
}

.cards .card.flipped .back,
.cards .card.matched .back {
  transform: rotateY(180deg);
  transform: rotateY(180deg);
  transform: rotateY(180deg);
  transform: rotateY(180deg);
}

.cards .card.flipped .front,
.cards .card.matched .front {
  transform: rotateY(0deg);
  transform: rotateY(0deg);
  transform: rotateY(0deg);
  transform: rotateY(0deg);
}

.cards .card.matched {
  opacity: 0.3;
}

.splash {
  bottom: 0;
  color: #fff;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;

  .overlay {
    background-color: rgba(0, 0, 0, 0.6);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .content {
    background-color: rgba(51, 51, 51, 0.9);
    border-radius: 10px;
    border-radius: 10px;
    border-radius: 10px;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.8);
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.8);
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.8);
    left: 0;
    margin: auto;
    max-width: 500px;
    padding: 1em;
    position: absolute;
    right: 0;
    text-align: center;
    top: 30px;

    .title {
      font-size: 1.8em;
      padding: 0.5em;
    }

    button {
      background-color: #444;
      border: 1px solid #555;
      border-radius: 4px;
      border-radius: 4px;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font-family: "Press Start 2P", "Helvetica", "Arial", sans-serif;
      font-size: 1.4em;
      margin-top: 1em;
      margin-top: 1em;
      padding: 20px;
    }
  }
}
</style>
