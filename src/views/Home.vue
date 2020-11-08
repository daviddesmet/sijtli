<template>
  <!-- <div class="container mx-auto flex flex-wrap items-start self-start mt-24"> -->
  <div class="container mx-auto flex flex-wrap items-start">
    <div class="w-full md:w-5/12 text-center lg:text-left px-8 md:px-12">
      <div class="p-12 rounded-lg shadow-md" style="background-color: rgb(160, 159, 208)">
        <img alt="logo" class="mx-auto w-64 h-64" src="../assets/img/logo.png" />
        <div class="text-center text-yellow-500">
          <h2 class="text-lg">Algo....</h2>
          <div class="text-gray-800 mt-2">Contenido...</div>
          <div class="text-gray-800 mt-2">Contenido...</div>
          <div class="text-gray-800 mt-2">Contenido...</div>
          <div class="text-gray-800 mt-2">Contenido...</div>
          <div class="text-gray-800 mt-2">Contenido...</div>
          <div>
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
          </div>
        </div>
      </div>
    </div>
    <div class="w-full md:w-7/12 my-auto">
      <div ref="map" style="height: 580px"></div>
      <!-- <memory-game lang="ES" @finished="memoryGameFinished" :allow-play-again="false" :height-size="130" :width-size="90" /> -->
      <!-- <hangman-game :words="hangmanWords" lang="ES" @finished="hangmanGameFinished" :allow-play-again="false" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MemoryGame from "@/components/MemoryGame.vue";
import HangmanGame from "@/components/HangmanGame.vue";

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

  hangmanWords = ["Cultura", "Coco", "Altar", "Calavera"];

  memoryGameFinished(elapsed: string, turns: number): void {
    // console.log("Memory game finished!!!", elapsed, turns);
    // TODO: Use Vuex in case we want to reset the game and play again later.
  }

  hangmanGameFinished(word: string, lose: boolean): void {
    // console.log("Hangman game finished!!!");
    // console.log("User was guessing word:", word);
    // console.log("User lose?", lose);
    // TODO: Use Vuex in case we want to reset the game and play again later.
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

  mounted(): void {
    this.initMap();
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
