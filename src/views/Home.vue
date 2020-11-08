<template>
  <!-- <div class="container mx-auto flex flex-wrap items-start self-start mt-24"> -->
  <div class="container mx-auto flex flex-wrap items-start">
    <div class="w-full md:w-5/12 text-center lg:text-left px-8 md:px-12">
      <div class="p-12 rounded-lg shadow-md" style="background-color: rgb(160, 159, 208); height: 580px">
        <img v-show="!talking" alt="logo" class="mx-auto" src="/img/alebrije-static.png" style="height: 150px; width: 135px" />
        <div v-show="talking" ref="alebrijeTalking" class="mx-auto" style="background: url('/img/alebrije-talk-sprite.png') 0 0; height: 150px; width: 135px" />
        <div class="text-center text-yellow-500">
          <!-- <button class="absolute top-0 right-0 p-4">EN</button>
          <button class="absolute top-0 right-0 p-4">ES</button> -->
          <button class="mt-4 mr-4" :class="{ 'text-indigo-800': lang === 'ES' }" @click.prevent="switchLanguage('EN')">EN</button>
          <button class="mt-4" :class="{ 'text-indigo-800': lang === 'EN' }" @click.prevent="switchLanguage('ES')">ES</button>
          <button
            v-if="!noMore"
            class="block uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded mt-4"
            @click.prevent="startJourney"
          >
            {{ beginTalkText }}
          </button>
          <!-- <div>
            <button class="border border-white rounded p-2 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700 mr-2" @click.prevent="zoomToSelectedPolygon('MX-MIC')">
              Ir a Michoacán
            </button>
            <button class="border border-white rounded p-2 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700 mr-2" @click.prevent="zoomToSelectedPolygon('MX-OAX')">
              Ir a Oaxaca
            </button>
            <button class="border border-white rounded p-2 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700" @click.prevent="resetZoomLevel"> Reset </button>
          </div>
          <div class="mt-2">
            <div class="text-gray-800 mt-2">Al hacer zoom a Michoacán u Oaxaca</div>
            <button class="border border-white rounded p-2 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700 mr-2" @click.prevent="showSomeLove(true)">
              Convertir a Love
            </button>
            <button class="border border-white rounded p-2 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700" @click.prevent="showSomeLove(false)">
              Regresar a Normal
            </button>
          </div> -->
        </div>
        <div class="mt-4 text-center text-yellow-500">
          <!-- <h2 class="text-lg">{{ speechTitle }}</h2> -->
          <div v-show="step === -1" class="text-gray-800 text-lg mt-16">{{ textLanguage(1) }}</div>
          <div v-show="step === 0" class="text-gray-800 text-lg mt-16">{{ textLanguage(2) }}</div>
          <div v-show="step === 1" class="text-gray-800 text-lg mt-16">{{ textLanguage(3) }}</div>
          <div v-show="step === 2" class="text-gray-800 text-lg mt-16">{{ textLanguage(4) }}</div>
          <div v-show="step === 3" class="text-gray-800 text-lg mt-16">{{ textLanguage(5) }}</div>
          <div v-show="step === 4" class="text-gray-800 text-lg mt-16">{{ textLanguage(6) }}</div>
          <div v-show="step === 5" class="text-gray-800 text-lg mt-16">{{ textLanguage(7) }}</div>
          <div v-show="step === 6" class="text-gray-800 text-lg mt-16">{{ textLanguage(8) }}</div>
          <div v-show="step === 7" class="text-gray-800 text-lg mt-16">{{ textLanguage(9) }}</div>
          <div v-show="step === 8" class="text-gray-800 text-lg mt-16">{{ textLanguage(10) }}</div>
        </div>
      </div>
    </div>
    <!-- <div v-show="step === 0" class="bg-indigo-800 rounded-lg shadow-md w-full md:w-7/12 flex content-center" style="height: 580px">
      <div class="text-center text-yellow-500 my-auto mx-auto">
        <img src="/img/alebrije.png" alt="alebrije" />
        <h2 class="text-2xl mt-4">¿Sabes que es un alebrije?</h2>
      </div>
    </div>
    <div v-show="step === 1" class="bg-indigo-800 rounded-lg shadow-md w-full md:w-7/12 flex content-center" style="height: 580px">
      <div class="text-center text-yellow-500 my-auto mx-auto">
        <img src="/img/day-of-death.png" alt="day-of-death" style="max-height: 350px" />
        <h2 class="text-2xl mt-4">¿Sabes que es el día de muertos?</h2>
      </div>
    </div> -->
    <div class="w-full md:w-7/12 my-auto">
      <img v-show="step === 0" class="mx-auto absolute right-0 mr-6" src="/img/alebrije.png" alt="alebrije" style="max-height: 220px" />
      <img v-show="step === 1" class="mx-auto absolute right-0 mr-10" src="/img/day-of-death.png" alt="day-of-death" style="max-height: 220px" />
      <div v-show="step <= 2 || step === 4 || step === 6 || step === 7 || step === 8" ref="map" style="height: 580px"></div>
      <memory-game v-show="step === 3" :lang="lang" @finished="memoryGameFinished" :allow-play-again="false" :height-size="130" :width-size="90" />
      <hangman-game v-if="step === 5" :words="hangmanWords" :lang="lang" @finished="hangmanGameFinished" :allow-play-again="false" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MemoryGame from "@/components/MemoryGame.vue";
import HangmanGame from "@/components/HangmanGame.vue";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { SPEECH_SDK_KEY, SPEECH_SDK_REGION } from "@/constants/config";
import { SPEECH_ES, SPEECH_EN } from "@/data/speech.data";

import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_mexicoLow from "@amcharts/amcharts4-geodata/mexicoLow";
import MapData from "@/models/MapData";

am4core.useTheme(am4themes_animated);

@Options({
  components: {
    MemoryGame,
    HangmanGame
  }
})
export default class Home extends Vue {
  map!: am4maps.MapChart;
  polygonSeries!: am4maps.MapPolygonSeries;
  selectedPolygon: am4maps.MapPolygon | undefined = undefined;

  speechConfig!: sdk.SpeechConfig;
  synthesizer!: sdk.SpeechSynthesizer;
  player!: sdk.SpeakerAudioDestination;

  lang = "ES";

  step = -1; // -1
  speechSpanish = SPEECH_ES;
  speechEnglish = SPEECH_EN;
  speechTitle = "";
  speechContent = "";
  noMore = false;

  beginTalkText = "";
  beginTalkEnabled = false;
  talking = false;
  talkAnimation: number | undefined = undefined;

  hangmanWords = ["Alebrije", "Catrina", "Ofrenda", "Calavera", "Coco", "Dulces"];

  // This is freeaking ugly but got no time! Well, the whole code needs a massive refactor...
  textUISpanish = [
    "Comenzar",
    "Hoy vas a estar acompañado de Sijtli, ella te acompañará a dar un recorrido por algunos de los estados de la república, podrás encontrar juegos y leyendas. ¡Comienza tu recorrido!",
    "Alebrijes... ¡coloridos y fantásticos! ¿Sabías que soy un alebrije?",
    "Día de muertos, una de las tradiciones más representativas de nuestra cultura mexicana.",
    "¡Oaxaca! El inicio de este maravilloso recorrido en nuestro bello país.",
    "Hagamos algo divertido, pon a prueba tu memoria jugando el memorama. ¡Comencemos!",
    "Michoacán y sus pueblos mágicos como Pátzcuaro, Janitzio, Tzintzuntzan.",
    "¡Vaya! Hemos aprendido mucho en este recorrido. Alebrijes, catrinas, ofrendas...",
    "¡Guanajuato! Es uno de los estados del país donde se celebra a lo grande.",
    "Y para concluir con esta aventura, les platicare de la flor de cempasúchil.",
    "¡Gracias y hasta pronto!",
    "Continuar...",
    "Sigamos el recorrido",
    "Cempasúchil"
  ];

  textUIEnglish = [
    "Let's Begin",
    "Today you will be with Sijtli, she will give you a tour around some of the states of Mexico, you should find games and leyends. Let's begin your journey!",
    "Alebrijes... Colorful and fantastic! Did you know I am an alebrije?",
    "Day of the death, one of the most representative traditions of our mexican culture.",
    "Oaxaca! THe beginning of this wonderful journey in our beautiful country.",
    "Let's have some fun, test your memory playing a memory game. Let's begin!",
    "Michoacán and its magic towns like Pátzcuaro, Janitzio, Tzintzuntzan.",
    "Wow! We have learned a lot on this journey. Alebrijes, catrinas, offerings...",
    "Guanajuato! One of the states of the country where they celebrate in a big way.",
    "And to conclude the aventure, I'm going to talk about the cempasuchil flower.",
    "Thank you and see you soon!",
    "Continue...",
    "Let's continue the tour",
    "Cempasuchil"
  ];

  switchLanguage(lang: string): void {
    this.lang = lang;

    if (this.step == -1) {
      this.beginTalkText = this.textLanguage(0);
    }
  }

  textLanguage(idx: number): string {
    switch (this.lang) {
      case "EN":
        return this.textUIEnglish[idx];
      default:
        return this.textUISpanish[idx];
    }
  }

  textToPitch(text: string, lang: string, voice: string): string {
    return `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="${lang}">
              <voice name="${lang}-${voice}">
                ${text}
              </voice>
            </speak>`;
  }

  play(text: string, lang = "en-US", voice = "JessaRUS"): void {
    this.synthesizer.synthesisStarted = (s, e) => {
      this.talking = true;
      this.beginTalkEnabled = false;
    };
    this.synthesizer.speakSsmlAsync(
      this.textToPitch(text, lang, voice),
      (result) => {
        if (result.reason === sdk.ResultReason.Canceled) {
          console.warn("Synthesis failed. Error detail: " + result.errorDetails);
        }
        // this.talking = false;
        this.synthesizer.close();
      },
      (error) => {
        console.error(error);
        this.talking = false;
        this.synthesizer.close();
      }
    );
  }

  memoryGameFinished(elapsed: string, turns: number): void {
    // console.log("Memory game finished!!!", elapsed, turns);
    // TODO: Use Vuex in case we want to reset the game and play again later.
    this.initSpeechEngine(false);
    if (this.lang == "ES") {
      this.play(`Felicidades, resolviste el memorama en tan solo ${turns} turnos!`, "es-MX", "DaliaNeural");
    } else {
      this.play(`Congratulations, you solved the puzzle in just ${turns} turns!`, "en-US", "AriaNeural");
    }

    window.setTimeout(() => {
      this.endStep();
    }, 1500);
  }

  hangmanGameFinished(word: string, lose: boolean): void {
    // console.log("Hangman game finished!!!");
    // console.log("User was guessing word:", word);
    // console.log("User lose?", lose);
    // TODO: Use Vuex in case we want to reset the game and play again later.
    this.initSpeechEngine(false);
    if (lose) {
      if (this.lang == "ES") {
        this.play("¡Vaya! No te pongas triste, ¡la proxima vez lo haras mejor!", "es-MX", "DaliaNeural");
      } else {
        this.play("Oops! Don't be sad, next time you will do better!", "en-US", "AriaNeural");
      }
    } else {
      if (this.lang == "ES") {
        this.play("¡Wow! ¡Me dejas sorprendida!", "es-MX", "DaliaNeural");
      } else {
        this.play("Wow! You leave me surprised!", "en-US", "AriaNeural");
      }
    }
    window.setTimeout(() => {
      this.endStep();
    }, 1500);
  }

  showSomeLove(show: boolean): void {
    if (this.selectedPolygon) {
      if (show) {
        let i = 0.0;
        var intr = window.setInterval(() => {
          i = parseFloat((i + 0.1).toFixed(1));
          if (this.selectedPolygon) {
            this.selectedPolygon.polygon.morpher.morphProgress = i;
          }
          if (i == 1) clearInterval(intr);
        }, 100);
      } else {
        this.selectedPolygon.polygon.morpher.morphProgress = 0;
      }
    }
  }

  resetZoomLevel(): void {
    if (this.selectedPolygon) {
      this.selectedPolygon.isActive = false;
    }

    this.map.goHome();
  }

  zoomToSelectedPolygon(id: string): void {
    if (this.selectedPolygon) {
      this.selectedPolygon.isActive = false;
    }

    this.selectedPolygon = this.polygonSeries.getPolygonById(id);
    this.selectedPolygon.opacity = 0;
    this.selectedPolygon.defaultState.properties.opacity = 1;
    this.selectedPolygon.toFront();

    let showAnimation = this.selectedPolygon.show(1000);
    if (!showAnimation) return;

    showAnimation.events.on("animationended", () => {
      if (!this.selectedPolygon) return;

      this.selectedPolygon.polygon.validate();
      let w = this.selectedPolygon.polygon.bbox.width;
      let h = this.selectedPolygon.polygon.bbox.height;

      let x = this.selectedPolygon.polygon.bbox.x + w / 2;
      let y = this.selectedPolygon.polygon.bbox.y + h / 2;

      w = Math.max(w, h);

      let path = am4core.path.moveTo({ x: x, y: y + w / 3 });
      path += am4core.path.cubicCurveTo({ x: x, y: y - w / 4 }, { x: x - w / 2 - w / 4, y: y - w / 3 }, { x: x - w / 8, y: y - w / 2 });
      path += am4core.path.cubicCurveTo({ x: x, y: y + w / 3 }, { x: x + w / 8, y: y - w / 2 }, { x: x + w / 2 + w / 4, y: y - w / 3 });

      let points = am4core.path.pathToPoints(path, 300);

      let middleLatitude = this.map.zoomGeoPoint.latitude + (this.selectedPolygon.latitude - this.map.zoomGeoPoint.latitude) / 2;
      let middleLongitude = this.map.zoomGeoPoint.longitude + (this.selectedPolygon.longitude - this.map.zoomGeoPoint.longitude) / 2;

      this.map.zoomEasing = am4core.ease.sinOut;
      let zoomOutAnimation = this.map.zoomToGeoPoint({ latitude: middleLatitude, longitude: middleLongitude }, 2, true);

      zoomOutAnimation.events.on("animationended", () => {
        if (!this.selectedPolygon) return;

        this.map.zoomEasing = am4core.ease.cubicInOut;
        this.map.zoomToMapObject(this.selectedPolygon, (400 / Math.max(w, h)) * this.map.scaleRatio, true, 1500);
        this.selectedPolygon.polygon.points;
        this.selectedPolygon.polygon.morpher.morphToSingle = true;

        let animation;
        if (points) {
          animation = this.selectedPolygon.polygon.morpher.morphToPolygon([[points]]);
        } else {
          animation = this.selectedPolygon.polygon.morpher.morphToCircle();
        }

        animation.stop();
      });

      this.selectedPolygon.isActive = true;
    });
  }

  initMap(): void {
    // Create map instance
    const map = am4core.create(this.$refs.map as HTMLDivElement, am4maps.MapChart);

    // Set map definition
    map.geodata = am4geodata_mexicoLow;

    // Set projection
    map.projection = new am4maps.projections.Mercator();

    map.seriesContainer.draggable = false;
    map.seriesContainer.resizable = false;
    map.mouseWheelBehavior = "none";

    // Create map polygon series
    const polygonSeries = map.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#E1AE05"); // 74B266

    polygonTemplate.events.on("hit", (ev) => {
      ev.target.series.chart.zoomToMapObject(ev.target);

      // get object info
      const data = ev.target.dataItem.dataContext as MapData;
      // console.log(data.id, data.name);
    });

    // Create hover state and set alternative fill color
    const hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#F28800"); // 367B25

    // Create active state
    const activeState = polygonTemplate.states.create("active");
    activeState.properties.fill = am4core.color("#F28800"); // map.colors.getIndex(4);

    map.zoomControl = new am4maps.ZoomControl();

    this.map = map;
    this.polygonSeries = polygonSeries;
  }

  removeMap(): void {
    if (this.map) {
      this.selectedPolygon?.dispose();
      this.polygonSeries?.dispose();
      this.map.dispose();
    }
  }

  initSpeechEngine(jumpStep: boolean): void {
    this.speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_SDK_KEY, SPEECH_SDK_REGION);
    this.player = new sdk.SpeakerAudioDestination();
    this.player.onAudioEnd = () => {
      if (jumpStep) {
        this.endStep();
      } else {
        this.talking = false;
      }
    };

    const audioConfig = sdk.AudioConfig.fromSpeakerOutput(this.player);
    this.synthesizer = new sdk.SpeechSynthesizer(this.speechConfig, audioConfig);
  }

  alebrijeTalkAnimation(): void {
    const step = 135;
    let position = step;
    let interval = 150; //100 ms of interval for the setInterval()

    this.talkAnimation = window.setInterval(() => {
      const alebrijeTalking = this.$refs.alebrijeTalking as HTMLDivElement;
      if (this.talking && alebrijeTalking) {
        alebrijeTalking.style.backgroundPosition = `-${position}px 0px`;
        if (position < 810) {
          position = position + step;
        } else {
          position = step;
        }
      }
    }, interval);
  }

  alebrijeStopTalk(): void {
    if (this.talkAnimation) {
      clearInterval(this.talkAnimation);
    }
  }

  endStep(): void {
    this.talking = false;
    this.beginTalkEnabled = true;

    switch (this.step) {
      case 0:
        this.beginTalkText = this.textLanguage(11);
        this.step = 1;
        break;
      case 1:
        this.beginTalkText = "Ohhh, Oaxaca";
        this.step = 2;
        break;
      case 2:
        this.beginTalkText = this.textLanguage(12);
        this.showSomeLove(true);
        window.setTimeout(() => {
          this.showSomeLove(false);
          this.resetZoomLevel();
          this.step = 3;
          this.initSpeechEngine(false);
          if (this.lang == "ES") {
            this.play(this.speechSpanish[this.step], "es-MX", "DaliaNeural");
          } else {
            this.play(this.speechEnglish[this.step], "en-US", "AriaNeural");
          }
        }, 2500);
        break;
      case 3:
        this.beginTalkText = "Michoacán";
        window.setTimeout(() => {
          this.step = 4;
        }, 2500);
        break;
      case 4:
        this.beginTalkText = this.textLanguage(12);
        this.showSomeLove(true);
        window.setTimeout(() => {
          this.showSomeLove(false);
          this.resetZoomLevel();
          this.step = 5;
          this.initSpeechEngine(false);
          if (this.lang == "ES") {
            this.play(this.speechSpanish[this.step], "es-MX", "DaliaNeural");
          } else {
            this.play(this.speechEnglish[this.step], "en-US", "AriaNeural");
          }
        }, 2500);
        break;
      case 5:
        this.beginTalkText = "Guanajuato";
        window.setTimeout(() => {
          this.step = 6;
        }, 2500);
        break;
      case 6:
        this.beginTalkText = this.textLanguage(13);
        window.setTimeout(() => {
          this.resetZoomLevel();
          this.step = 7;
        }, 2500);
        break;
      case 7:
        this.noMore = true;
        window.setTimeout(() => {
          this.resetZoomLevel();
          this.step = 8;
        }, 2500);
        break;
      default:
        break;
    }
  }

  startJourney(): void {
    if (this.talking) return;

    if (this.step == -1) {
      this.step = 0;
    }

    switch (this.step) {
      case 0:
        // Alebrije
        this.speechTitle = "¿Sabes que es un alebrije?";
        break;
      case 1:
        // Day of Death
        this.speechTitle = "¿Sabes que es el día de muertos?";
        break;
      case 2:
        // Oaxaca
        this.zoomToSelectedPolygon("MX-OAX");
        this.speechTitle = "Lo representativo del estado de Oaxaca";
        break;
      case 4:
        // Michoacan
        this.zoomToSelectedPolygon("MX-MIC");
        this.speechTitle = "Lo representativo del estado de Michoacán";
        break;
      case 6:
        // Guanajuato
        this.zoomToSelectedPolygon("MX-GUA");
        this.speechTitle = "Lo representativo del estado de Guanajuato";
        break;
      case 7:
        this.speechTitle = "La leyenda de la flor de Cempasúchil";
        this.noMore = true;
        break;
      default:
        break;
    }

    window.setTimeout(() => {
      this.initSpeechEngine(true);
      if (this.lang == "ES") {
        this.play(this.speechSpanish[this.step], "es-MX", "DaliaNeural");
      } else {
        this.play(this.speechEnglish[this.step], "en-US", "AriaNeural");
      }
    }, 2500);
  }

  mounted(): void {
    this.initMap();
    this.alebrijeTalkAnimation();

    this.beginTalkText = this.textLanguage(0);
  }

  beforeDestroy(): void {
    this.removeMap();
  }
}
</script>

<style lang="scss" scoped>
#intro-bg {
  background-color: "#a09fd0";
}
</style>
