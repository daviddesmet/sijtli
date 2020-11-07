<template>
  <div>
    <div id="max-w-xl mx-auto sm:px-6 lg:px-8">
      <router-link to="/">Inicio</router-link> | <router-link to="/game/memory">Memoria</router-link> |
      <router-link to="/game/puzzle">Rompecabezas</router-link>
    </div>
    <div class="espacio">
      <img
        id="puzzle"
        onload="snapfit.add(this,{callback: function() {alert('prueba');}, aborder:false, aimage:true, polygon:true, space:50, mixed:true, simple:true, level:2});"
        src="/img/puzzles/puzzle1.png"
        width="800"
        height="600"
        border="0"
        alt="puzzle"
      />
    </div>
  </div>
  <button class="mr-2" type="button" onclick="snapfit.admix(document.getElementById('puzzle'));">Revolver</button>
  <button type="button" onclick="snapfit.solve(document.getElementById('puzzle'));">Resolver</button>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class JigsawPuzzleGame extends Vue {}
</script>
