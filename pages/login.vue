<template>
  <div class="col-span-4">
    <form @submit.prevent="login">
      <h3 class="mb-5">Acceder a tu cuenta</h3>
      <div class="mb-5">
        <label for="email" class="label">Email:</label>
        <input type="email" v-model="email" id="email" class="input" required>
      </div>
      <div class="mb-5">
        <label for="contrasena" class="label">Contraseña:</label>
        <input type="password" v-model="contrasena" id="contrasena" class="input" required>
      </div>
      <button type="submit" class="btn bg-blue-700 p-4">Iniciar Sesión</button>
      <NuxtLink to="/crearusuario" class="ml-5 btn bg-blue-700">Registrarse</NuxtLink>
      <Notification v-if="notification.message" :message="notification.message" :type="notification.type" />
    </form>
  </div>
  <div class="col-span-8">
    <img src="https://www.mozart.cl/wp-content/uploads/2023/03/00_MIF_3356_Bodegon.jpg" alt="Imagen de una persona con una computadora" class="w-full h-full object-cover">
  </div>
</template>

<script>
import Notification from '@/components/Notification.vue';

export default {
  components: {
    Notification
  },
  data() {
    return {
      email: '',
      contrasena: '',
      notification: {
        message: '',
        type: ''
      }
    };
  },
  layout: 'default',
  methods: {
    async login() {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
          this.setNotification('Login correcto', 'success');
          this.$router.push({ path: '/carrito' });
        } else {
          this.setNotification('Credenciales incorrectas', 'error');
        }
      } catch (error) {
        this.setNotification('Error al iniciar sesión', 'error');
      }
    },
    setNotification(message, type) {
      this.notification.message = message;
      this.notification.type = type;
      setTimeout(() => {
        this.notification.message = '';
      }, 3000);
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
</style>