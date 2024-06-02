<template>
    <div>
      <h1>Crear Usuario</h1>
      <form @submit.prevent="crearUsuario">
        <div>
          <label for="nombre">Nombre:</label>
          <input type="text" v-model="nombre" id="nombre" required>
        </div>
        <div>
          <label for="nombre">Rut:</label>
          <input type="text" v-model="rut" id="rut" required>
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" required>
        </div>
        <div>
          <label for="contrasena">Contraseña:</label>
          <input type="password" v-model="contrasena" id="contrasena" required>
        </div>
        <div>
          <label for="direccion">Dirección:</label>
          <input type="text" v-model="direccion" id="direccion">
        </div>
        <div>
          <label for="telefono">Teléfono:</label>
          <input type="text" v-model="telefono" id="telefono">
        </div>
        <button type="submit">Crear Usuario</button>
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
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: auto;
  }
  
  div {
    margin-bottom: 10px;
  }
  </style>