<template>
  <div v-if="carrito" class="col-span-12">
    <h2 class="text-2xl font-bold mb-4">Tu Carrito</h2>

    <table class="table-auto w-full border-collapse border border-gray-300 mb-4 text-justify">
      <thead>
        <tr class="bg-d">
          <th class="border border-gray-300 px-4 py-2">Nombre</th>
          <th class="border border-gray-300 px-4 py-2">Cantidad</th>
          <th class="border border-gray-300 px-4 py-2">Precio Unitario</th>
          <th class="border border-gray-300 px-4 py-2">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto.id" class="border border-gray-300">
          <td class="border border-gray-300 px-4 py-2">{{ producto.nombre }}</td>
          <td class="border border-gray-300 px-4 py-2">
          <p class="border border-gray-300 px-4 py-2">
         {{producto.cantidad}}</p>

          </td>
          <td class="border border-gray-300 px-4 py-2">${{ formatCurrency(producto.precio_unitario) }}</td>
          <td class="border border-gray-300 px-4 py-2">${{ formatCurrency(producto.cantidad * producto.precio_unitario) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="mt-4">
      <h3 class="text-xl font-bold">Total: ${{ formatCurrency(total) }}</h3>
    </div>

    <div class="mt-4">
      <button v-if="isLoggedIn" @click="pagar" class="px-4 py-2 bg-blue-700 text-white">Pagar</button>
      <button v-else @click="irALogin" class="px-4 py-2 bg-blue-700 text-white">Inicia sesión para continuar</button>
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
      total: 0,
      isLoggedIn: false,
    };
  },
  async mounted() {
    try {
      const cartId = localStorage.getItem('cartId');
      const userId = localStorage.getItem('userId');
      this.isLoggedIn = !!userId;
      if (cartId) {
        const response = await fetch(`/api/compra?usuario_id=2&carrito_id=${cartId}`);
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
  },
  methods: {
    irALogin() {
      this.$router.push({ path: '/login' });
    },
  

    
    async pagar() {
      try {
        const cartId = localStorage.getItem('cartId');
        const userId = parseInt(localStorage.getItem('userId'), 10);
        if (cartId && userId) {
          const updateCarritoResponse = await fetch('/api/carrito', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: parseInt(cartId, 10), usuario_id: userId, estado: 'pagado' }),
          });

          if (updateCarritoResponse.ok) {
            const pagoResponse = await fetch('/api/pago', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ carrito_id: parseInt(cartId, 10) }),
            });

            if (pagoResponse.ok) {
              alert('Pago realizado con éxito');
              localStorage.removeItem('cartId');
              this.$router.push({ path: '/' });
            } else {
              const pagoErrorData = await pagoResponse.json();
              console.error('Error al realizar el pago:', pagoErrorData.error);
              throw new Error(`Error al realizar el pago: ${pagoErrorData.error}`);
            }
          } else {
            const updateErrorData = await updateCarritoResponse.json();
            console.error('Error al actualizar el carrito:', updateErrorData.error);
            throw new Error(`Error al actualizar el carrito: ${updateErrorData.error}`);
          }
        }
      } catch (error) {
        console.error('Error al pagar:', error);
        alert('Error al pagar: ' + error.message);
      }
    },
    actualizarTotal() {
      this.total = this.productos.reduce((acc, producto) => acc + producto.cantidad * producto.precio_unitario, 0);
    },
    formatCurrency(value) {
      return value.toLocaleString('es-CL');
    },
  },
};
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

.bg-blue-600 {
  background-color: #2563eb;
}

.text-white {
  color: #fff;
}

.w-20 {
  width: 5rem;
}

.h-20 {
  height: 5rem;
}

.mr-4 {
  margin-right: 1rem;
}

.bg-d {
  background-color: #DBB5B5;
}
</style>