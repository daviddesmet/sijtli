<template>
  <div class="home">
    <div id="max-w-xl mx-auto sm:px-6 lg:px-8">
      <router-link to="/">Inicio</router-link> | <router-link to="/game/memory">Memoria</router-link> | <router-link to="/game/puzzle">Rompecabezas</router-link> |
      <router-link to="/stories">Cuentos</router-link>
    </div>
    <img alt="logo" class="w-64 h-64" src="../assets/img/logo.png" />
  </div>
  <div ref="map" class="w-9/12" style="height: 657px"></div>
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
    polygonTemplate.fill = am4core.color("#74B266");

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#367B25");
  }

  beforeDestroy(): void {
    if (this.map) {
      this.map.dispose();
    }
  }
}
</script>
