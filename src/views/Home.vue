<template>
  <div class="min-h-screen w-screen flex items-center">
    <div class="container mx-auto flex flex-wrap items-center">
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
          </div>
        </div>
      </div>
      <div ref="map" class="w-full md:w-7/12 h-full lg:h-screen"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_mexicoLow from "@amcharts/amcharts4-geodata/mexicoLow";

am4core.useTheme(am4themes_animated);

export default class Home extends Vue {
  map: am4maps.MapChart | undefined = undefined;

  mounted(): void {
    // Create map instance
    let map = am4core.create(this.$refs.map as HTMLDivElement, am4maps.MapChart);

    // Set map definition
    map.geodata = am4geodata_mexicoLow;
    map.projection = new am4maps.projections.Mercator();

    // Set projection
    // Create map polygon series
    let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#E1AE05"); // 74B266

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#F28800"); // 367B25
  }

  beforeDestroy(): void {
    if (this.map) {
      this.map.dispose();
    }
  }
}
</script>

<style lang="scss" scoped>
#intro-bg {
  background-color: "#a09fd0";
}
</style>
