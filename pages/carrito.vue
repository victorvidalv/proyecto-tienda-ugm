<template>
    <div v-if="carrito" class="col-span-12">
      <h2 class="text-2xl font-bold mb-4">Tu Carrito</h2>
      <div v-for="producto in productos" :key="producto.id" class="border p-4 mb-2">
        <div class="flex justify-between">
          <div>
            <h3 class="text-xl">{{ producto.nombre }}</h3>
            <p>Cantidad: {{ producto.cantidad }}</p>
            <p>Precio unitario: ${{ producto.precio_unitario }}</p>
            <p>Total: ${{ producto.valor }}</p>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <h3 class="text-xl font-bold">Total: ${{ total }}</h3>
      </div>
    </div>
    <div v-else>
      <p>Tu carrito está vacío.</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        carrito: null,
        productos: [],
        total: 0
      };
    },
    async mounted() {
      try {
        const cartId = localStorage.getItem('cartId');
        let userId = localStorage.getItem('userId') || 2;
        if (cartId) {
          const response = await fetch(`/api/compra?usuario_id=${userId}&carrito_id=${cartId}`);
          if (response.ok) {
            const data = await response.json();
            this.carrito = data.carrito;
            this.productos = data.productos;
            this.total = data.total;
          } else {
            console.error('Error al obtener el carrito');
          }
        }
      } catch (error) {
        console.error('Error al obtener el carrito:', error);
      }
    }
  }
  </script>
  
  <style scoped>
  .border {
    border: 1px solid #e2e8f0;
  }
  .p-4 {
    padding: 1rem;
  }
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  .mb-4 {
    margin-bottom: 1rem;
  }
  .flex {
    display: flex;
  }
  .justify-between {
    justify-content: space-between;
  }
  .mt-4 {
    margin-top: 1rem;
  }
  </style>