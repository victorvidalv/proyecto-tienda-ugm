<template>
  <div class="col-span-12" v-if="isAdmin">
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-1">
        <h1 class="text-2xl font-bold mb-4">Lista de Productos</h1>
        <div v-for="producto in productos" :key="producto.id" class="border p-4 mb-2">
          <h3 class="text-xl">{{ producto.nombre }}</h3>
          <p>{{ producto.descripcion }}</p>
          <p>Precio: ${{ producto.precio }}</p>
          <p>Stock: {{ producto.stock }}</p>
          <button @click="seleccionarProducto(producto)" class="text-blue-600">Editar</button>
        </div>
      </div>
      <div class="col-span-1 mt-4">
        <h2 class="text-xl font-bold mb-4">{{ productoSeleccionado ? 'Editar Producto' : 'Agregar Producto' }}</h2>
        <form @submit.prevent="productoSeleccionado ? actualizarProducto() : agregarProducto()">
          <div class="mb-4">
            <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" v-model="formProducto.nombre" id="nombre" class="mt-1 block w-full"/>
          </div>
          <div class="mb-4">
            <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea v-model="formProducto.descripcion" id="descripcion" class="mt-1 block w-full"></textarea>
          </div>
          <div class="mb-4">
            <label for="precio" class="block text-sm font-medium text-gray-700">Precio</label>
            <input type="number" v-model="formProducto.precio" id="precio" class="mt-1 block w-full"/>
          </div>
          <div class="mb-4">
            <label for="stock" class="block text-sm font-medium text-gray-700">Stock</label>
            <input type="number" v-model="formProducto.stock" id="stock" class="mt-1 block w-full"/>
          </div>
          <div class="mb-4">
            <label for="categoria_id" class="block text-sm font-medium text-gray-700">Categoría</label>
            <select v-model="formProducto.categoria_id" id="categoria_id" class="mt-1 block w-full">
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">{{ categoria.nombre }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="imagen_url" class="block text-sm font-medium text-gray-700">Imagen URL</label>
            <input type="text" v-model="formProducto.imagen_url" id="imagen_url" class="mt-1 block w-full"/>
          </div>
          <button type="submit" class="px-4 py-2 bg-blue-700 text-white">{{ productoSeleccionado ? 'Actualizar' : 'Agregar' }}</button>
          <button type="button" v-if="productoSeleccionado" @click="cancelarEdicion" class="px-4 py-2 ml-2 bg-gray-600 text-white">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
  <div v-else class="col-span-12">
    <h1 class="text-2xl font-bold">No tienes permisos para ver esta página</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productos: [],
      categorias: [], // Nueva propiedad para almacenar las categorías
      productoSeleccionado: null,
      formProducto: {
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria_id: '', // Actualiza la propiedad del modelo
        imagen_url: '',
        isAdmin: false,
      }
    };
  },
  async mounted() {
    this.checkUserType();
    this.cargarCategorias(); // Cargar las categorías al montar el componente
    try {
      const response = await fetch('/api/producto');
      this.productos = await response.json();
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  },
  methods: {
    seleccionarProducto(producto) {
      this.productoSeleccionado = { ...producto };
      this.formProducto = { ...producto };
    },
    checkUserType() {
      const userType = localStorage.getItem('userType');
      if (userType === 'administrador') {
        this.isAdmin = true;
      }
    },
    cancelarEdicion() {
      this.productoSeleccionado = null;
      this.formProducto = {
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria_id: '',
        imagen_url: ''
      };
    },
    async actualizarProducto() {
      try {
        const response = await fetch(`/api/producto`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formProducto)
        });
        if (response.ok) {
          alert('Producto actualizado con éxito');
          const productoActualizado = await response.json();
          const index = this.productos.findIndex(p => p.id === productoActualizado.id);
          if (index !== -1) {
            this.productos.splice(index, 1, productoActualizado);
          }
          this.cancelarEdicion();
        } else {
          throw new Error('Error al actualizar el producto');
        }
      } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert('Error al actualizar el producto');
      }
    },
    async agregarProducto() {
      try {
        const response = await fetch(`/api/producto`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formProducto)
        });
        if (response.ok) {
          alert('Producto agregado con éxito');
          const nuevoProducto = await response.json();
          this.productos.push(nuevoProducto);
          this.cancelarEdicion();
        } else {
          throw new Error('Error al agregar el producto');
        }
      } catch (error) {
        console.error('Error al agregar el producto:', error);
        alert('Error al agregar el producto');
      }
    },
    async cargarCategorias() {
      try {
        const response = await fetch('/api/categoria');
        this.categorias = await response.json();
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
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
.mt-4 {
  margin-top: 1rem;
}
.text-xl {
  font-size: 1.25rem;
}
.text-blue-600 {
  color: #2563eb;
}
.bg-blue-600 {
  background-color: #2563eb;
}
.bg-gray-600 {
  background-color: #4a5568;
}
</style>