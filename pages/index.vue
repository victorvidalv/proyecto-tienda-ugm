<template>
  <div v-for="producto in productos" :key="producto.id" class="col-span-3 max-w-sm bg-white border border-gray-200">
    <a href="#">
      <img class="w-full h-64 object-cover" :src="producto.imagen_url" alt="producto" />
    </a>
    <div class="p-5">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{{ producto.nombre }}</h5>
      <p class="mb-3 font-normal text-gray-700">{{ producto.descripcion }}</p>
      <p class="text-lg font-bold">${{ producto.precio }}</p>
      <a href="#" @click.prevent="agregarAlCarrito(producto.id)" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700">
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
  },
  methods: {
    async agregarAlCarrito(producto_id) {
      try {
        let cartId = localStorage.getItem('cartId');
        let userId = localStorage.getItem('userId') || 2; // Usar el userId del localStorage o 2 por defecto
       
        if (!cartId) {
          // Crear un nuevo carrito
          const response = await fetch('/api/carrito', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario_id: userId })
          });
          const nuevoCarrito = await response.json();
          cartId = nuevoCarrito.id;
          localStorage.setItem('cartId', cartId);
        }
        
        // Agregar producto al carrito
        const response = await fetch('/api/carritoproducto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            carrito_id: cartId,
            producto_id: producto_id,
            cantidad: 1
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Producto agregado al carrito:', result);
          alert('Producto agregado al carrito');
        } else {
          const errorData = await response.json();
          console.error('Error en el servidor:', errorData.error);
        }
      } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
      }
    }
  }
}
</script>

<style scoped>
.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
</style>