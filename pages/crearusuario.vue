<template>

  <div class="col-span-4">
  
    <form @submit.prevent="crearUsuario" >
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
    
      <button type="submit" class="btn">Crear Usuario</button>
    </form>
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
      rut: ''
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
        if (response.ok) {
          alert('Usuario creado exitosamente');
          // Limpiar el formulario
          this.nombre = '';
          this.email = '';
          this.contrasena = '';
          this.direccion = '';
          this.telefono = '';
          this.rut = '';
        } else {
          throw new Error('Error al crear el usuario');
        }
      } catch (error) {
        alert(error.message);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5;
}
.input {
  @extend .form;
}
.btn {
  @apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm px-5 py-2.5 text-center
}
.label {
  @apply block mb-2 text-sm font-medium text-gray-900;
}
</style>