<template>



  <div v-for="producto in productos" :key="producto.id"
    class=" col-span-3 max-w-sm bg-white border border-gray-200 ">
    <a href="#">
      <img class=" w-full h-64 object-cover" :src="producto.imagen_url" alt="producto" />
    </a>
    <div class="p-5">

      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{{ producto.nombre }}</h5>

      <p class="mb-3 font-normal text-gray-700 ">{{ producto.descripcion }}</p>
      <p class="text-lg font-bold">${{ producto.precio }}</p>
      <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700  ">
        Comprar

      </a>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      productos: []
    };
  },
  layout: 'default',
  async mounted() {
    try {
      const response = await fetch('/api/producto');
      this.productos = await response.json();
    } catch (error) {
      console.error(error);
    }
  }
}
</script>

<style scoped>
.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
</style>