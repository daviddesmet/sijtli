<template>
  <div class="gradient text-white min-h-screen w-screen flex items-center">
    <div class="container mx-auto p-4 flex flex-wrap items-center">
      <div class="w-full md:w-5/12 text-center p-4">
        <img src="../assets/img/notfound-lady.png" alt="Not Found" />
      </div>
      <div class="w-full md:w-7/12 text-center md:text-left p-4">
        <div class="text-6xl font-medium">404</div>
        <div class="text-xl md:text-3xl font-medium mb-4"> Oops. Se perdió la calaca. </div>
        <div class="text-lg mb-8"> Puede ser que hayas escrito mal la dirección o la página se la llevó el coco. </div>
        <router-link class="border border-white rounded p-4 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700" to="/">Regresar a inicio</router-link>
      </div>
    </div>
  </div>
</template>
