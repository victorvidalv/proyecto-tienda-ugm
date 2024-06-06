<template>


  <div class="col-span-12">
    <section
      class="bg-center bg-no-repeat bg-[url('https://www.mozart.cl/wp-content/uploads/2023/03/MIF_2582.jpg')] bg-gray-700 bg-blend-multiply">
      <div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-32">
        <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
          Pastelería de Modelamiento
          Santiago de Chile
          Desde siempre.</h1>
        <p class="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
          Descubre la mejor pastelería de modelamiento en Santiago de Chile. ¡Haz tu pedido ahora!

        </p>
        <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">

        </div>
      </div>
    </section>


  </div>


  <div v-for="producto in productos" :key="producto.id" class="col-span-3 max-w-sm  border border-gray-200">
    <a href="#">
      <img class="w-full h-64 object-cover" :src="producto.imagen_url" alt="producto" />
    </a>
    <div class="p-5">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{{ producto.nombre }}</h5>
      <p class="mb-3 font-normal text-gray-700">{{ producto.descripcion }}</p>
      <p class="text-lg font-bold">${{ producto.precio }}</p>
      <p class=" ">Stock: {{ producto.stock }}</p>
      <a href="#" @click.prevent="agregarAlCarrito(producto.id)"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700">
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
        let userId = 2; // Usar el userId del localStorage o 2 por defecto

        if (!cartId) {
          // Crear un nuevo carrito
          const response = await fetch('/api/carrito', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario_id: Number(userId) })
          });
          if (response.ok) {
            const nuevoCarrito = await response.json();
            cartId = nuevoCarrito.id;
            localStorage.setItem('cartId', cartId);
          } else {
            const errorData = await response.json();
            throw new Error(`Error al crear el carrito: ${errorData.error}`);
          }
        }

        // Asegúrate de que cartId es un número
        cartId = Number(cartId);

        // Verificar si el producto ya está en el carrito
        const response = await fetch(`/api/carritoproducto?carrito_id=${cartId}&producto_id=${producto_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const carritoProducto = await response.json();
          if (carritoProducto) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            const updateResponse = await fetch('/api/carritoproducto', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: Number(carritoProducto.id),
                cantidad: carritoProducto.cantidad + 1
              })
            });

            if (updateResponse.ok) {
              console.log('Cantidad del producto actualizada en el carrito');
              alert('Cantidad del producto actualizada en el carrito');
            } else {
              const errorData = await updateResponse.json();
              throw new Error(`Error al actualizar la cantidad: ${errorData.error}`);
            }
          } else {
            // Si el producto no está en el carrito, agregarlo
            const addResponse = await fetch('/api/carritoproducto', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                carrito_id: cartId,
                producto_id: Number(producto_id),
                cantidad: 1
              })
            });

            if (addResponse.ok) {
              console.log('Producto agregado al carrito');
              alert('Producto agregado al carrito');
            } else {
              const errorData = await addResponse.json();
              throw new Error(`Error al agregar el producto: ${errorData.error}`);
            }
          }
        } else if (response.status === 404) {
          // Producto no encontrado en el carrito, agregarlo
          const addResponse = await fetch('/api/carritoproducto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              carrito_id: cartId,
              producto_id: Number(producto_id),
              cantidad: 1
            })
          });

          if (addResponse.ok) {
            console.log('Producto agregado al carrito');
            alert('Producto agregado al carrito');
          } else {
            const errorData = await addResponse.json();
            throw new Error(`Error al agregar el producto: ${errorData.error}`);
          }
        } else {
          const errorData = await response.json();
          throw new Error(`Error al verificar el producto en el carrito: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        alert(`Error al agregar el producto al carrito: ${error.message}`);
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