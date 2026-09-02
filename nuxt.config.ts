export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
    css: ['~/assets/main.css'],
  ssr: false,
  app: {
    baseURL: '/streamhub-github-pages/'
  },
  runtimeConfig: {
    public: {
      appName: 'StreamHub',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''
    }
  }
})