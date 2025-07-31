// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';

export default defineNuxtConfig({
  css: [
    resolve(__dirname, 'assets/css/tailwind.css'),
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
});
