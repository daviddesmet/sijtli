<template>
  <nav class="bg-purple-900 shadow-lg">
    <div class="md:flex items-center justify-between py-2 px-8 md:px-12">
      <div class="flex justify-between items-center">
        <img alt="logo" class="w-12 h-12 mr-4" src="@/assets/img/logo-header.png" />
        <div class="text-2xl font-bold text-gray-800 md:text-3xl">
          <router-link class="text-white" to="/" style="font-family: 'Emilys Candy', cursive">Cuéntamelo Sijtli</router-link>
        </div>
        <div class="md:hidden">
          <button type="button" class="block text-gray-800 hover:text-gray-700 focus:text-gray-700 focus:outline-none">
            <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path
                class="hidden"
                d="M16.24 14.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 0 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12l2.83 2.83z"
              />
              <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
            </svg>
          </button>
        </div>
      </div>
      <div id="nav-items" class="flex flex-col md:flex-row md:block -mx-2">
        <router-link to="/" id="nav-item" class="text-white rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">Inicio</router-link>
        <router-link to="/about" id="nav-item" class="text-white rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">Acerca de...</router-link>
        <router-link v-if="isDevelopment" to="/game/hangman" class="text-white rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">Ahorcado</router-link>
        <router-link v-if="isDevelopment" to="/game/memory" class="text-white rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">Memoria</router-link>
        <router-link v-if="isDevelopment" to="/game/puzzle" class="text-white rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">Rompecabezas</router-link>
        <router-link v-if="isDevelopment" to="/stories" class="text-white rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2">Cuentos</router-link>
      </div>
    </div>
  </nav>
  <div class="gradient relative flex items-top justify-center min-h-screen bg-gray-200 dark:bg-gray-900 sm:items-center sm:pt-0 font-sans">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class App extends Vue {
  get isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  }
}
</script>

<style lang="scss">
@import "./assets/sass/main";

#nav-items a.router-link-active,
#nav-items a.router-link-exact-active {
  background-color: #cd5c5c;
  cursor: pointer;
}
</style>
