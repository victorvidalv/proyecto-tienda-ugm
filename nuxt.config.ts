// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: [
     { src: '~/plugins/prisma.server.js', mode: 'server' }
  ],
  server: {
    host: 'localhost',
    port: 3000
  },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  buildModules: [
    "@nuxtjs/axios"
  ],
  axios: {
    baseURL: '/',
  },
})