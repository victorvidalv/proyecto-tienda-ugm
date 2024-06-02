<template>
    <div class="col-span-4">
      <form @submit.prevent="login">
        <div class="mb-5">
          <label for="email" class="label">Email:</label>
          <input type="email" v-model="email" id="email" class="input" required>
        </div>
        <div class="mb-5">
          <label for="contrasena" class="label">Contraseña:</label>
          <input type="password" v-model="contrasena" id="contrasena" class="input" required>
        </div>
        <button type="submit" class="btn">Iniciar Sesión</button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        contrasena: '',
        error: ''
      };
    },
    layout: 'default',
    methods: {
      async login() {
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: this.email,
              contrasena: this.contrasena
            })
          });
  
          const data = await response.json();
  
          if (data.auth === 'ok') {
            localStorage.setItem('userId', data.id);
            localStorage.setItem('auth', data.auth);
            localStorage.setItem('userType', data.type);
            alert('Login correcto');
            this.$router.push({ path: '/' });
          } else {
            this.error = 'Credenciales incorrectas';
          }
        } catch (error) {
          this.error = 'Error al iniciar sesión';
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
    @apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm px-5 py-2.5 text-center;
  }
  .label {
    @apply block mb-2 text-sm font-medium text-gray-900;
  }
  .error {
    @apply text-red-500 mt-2;
  }
  </style>