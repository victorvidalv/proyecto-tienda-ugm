<template>
  <div class="col-span-4">
    <form @submit.prevent="crearUsuario">
      <h3 class="mb-5">Crear una cuenta</h3>
      <div class="mb-5">
        <label for="nombre" class="label">Nombre:</label>
        <input type="text" v-model="nombre" id="nombre" class="shadow-sm input" required>
      </div>
      <div class="mb-5">
        <label for="rut" class="label">Rut:</label>
        <input type="text" v-model="rut" id="rut" class="input" required>
      </div>
      <div class="mb-5">
        <label for="email" class="label">Email:</label>
        <input type="email" v-model="email" id="email" class="input" required>
      </div>
      <div class="mb-5">
        <label for="contrasena" class="label">Contraseña:</label>
        <input type="password" v-model="contrasena" id="contrasena" class="input" required>
      </div>
      <div class="mb-5">
        <label for="direccion" class="label">Dirección:</label>
        <input type="text" v-model="direccion" id="direccion" class="input">
      </div>
      <div class="mb-5">
        <label for="telefono" class="label">Teléfono:</label>
        <input type="text" v-model="telefono" id="telefono" class="input">
      </div>
      <button type="submit" class="btn bg-blue-700
      
      ">Crear Usuario</button>
      <NuxtLink to="/login" class="ml-5 btn bg-blue-700 ">Ingresar</NuxtLink>
      <div v-if="error" class="error">{{ error }}</div>

    </form>
  </div>

<div class="col-span-8">
  <img src="https://www.mozart.cl/wp-content/uploads/2023/03/00_MIF_3356_Bodegon.jpg" alt="Imagen de una persona con una computadora" class="w-full h-full object-cover">
</div>



</template>

<script>
export default {
  data() {
    return {
      nombre: '',
      email: '',
      contrasena: '',
      direccion: '',
      telefono: '',
      rut: '',
      error: ''
    };
  },
  layout: 'default',
  methods: {
    async crearUsuario() {
      try {
        const response = await fetch('/api/usuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre: this.nombre,
            email: this.email,
            contrasena: this.contrasena,
            direccion: this.direccion,
            telefono: this.telefono,
            rut: this.rut
          })
        });
        const data = await response.json();
        if (response.ok) {
          alert('Usuario creado exitosamente');
          this.nombre = '';
          this.email = '';
          this.contrasena = '';
          this.direccion = '';
          this.telefono = '';
          this.rut = '';
          this.error = '';
        } else {
          if (data.error.includes('Correo')) {
            this.error = 'El email ya está registrado';
          } else {
            this.error = 'Otro error';
          }
        }
      } catch (error) {
        this.error = 'Otro error';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5;
}

.input {
  @extend .form;
}

.btn {
  @apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center;
}

.label {
  @apply block mb-2 text-sm font-medium text-gray-900;
}

.error {
  @apply text-red-500 mt-2;
}
</style>