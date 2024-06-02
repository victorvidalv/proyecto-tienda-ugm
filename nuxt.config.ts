// https://nuxt.com/docs/api/configuration/nuxt-config
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
  
]
 
})
