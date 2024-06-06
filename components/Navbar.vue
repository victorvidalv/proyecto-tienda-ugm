<template>
  <nav class=" border-gray-200 dark:bg-gray-900 col-span-12">
    <div class="flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <span class="self-center text-2xl font-semibold whitespace-nowrap text-orange-500">Nuestra Tienda</span>
      </a>
      <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
      </button>
      <div class="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
          <li>
            <NuxtLink to="/" class="block py-2 px-3 rounded md:bg-transparent md:p-0" aria-current="page">Inicio</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/carrito" class="block py-2 px-3 rounded md:bg-transparent md:p-0">Carrito</NuxtLink>
          </li>
          <li v-if="!isLoggedIn">
            <NuxtLink to="/login" class="block py-2 px-3 rounded md:bg-transparent md:p-0">Ingresar</NuxtLink>
          </li>
          <li v-if="isAdmin">
            <NuxtLink to="/admin" class="block py-2 px-3 rounded md:bg-transparent md:p-0">Administrar</NuxtLink>
          </li>
          <li v-if="isLoggedIn">   
            <button @click="logout" class="block py-2 px-3 rounded md:bg-transparent md:p-0">Cerrar Sesión</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false
    };
  },
  mounted() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const auth = localStorage.getItem('auth');
      const userType = localStorage.getItem('userType');
      this.isLoggedIn = auth === 'ok';
      this.isAdmin = userType === 'administrador';
    },
    logout() {
      localStorage.removeItem('userId');
      localStorage.removeItem('auth');
      localStorage.removeItem('userType');
      localStorage.removeItem('cartId');
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.$router.push('/');
    }
  },
  watch: {
    // Watch local storage changes to update the login status dynamically
    '$route'() {
      this.checkLoginStatus();
    }
  }
};
</script>

<style scoped>
/* tus estilos aquí */
</style>