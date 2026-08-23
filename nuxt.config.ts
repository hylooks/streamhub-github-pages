export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/main.css'],
  runtimeConfig: { public: { appName: 'StreamHub' } }
})
