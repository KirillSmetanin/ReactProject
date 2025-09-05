// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000, // Порт для React приложения
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  css: {
    modules: {
      scopeBehaviour: 'local', // Использовать локальные стили по умолчанию
      generateScopedName: '[name]__[local]___[hash:base64:5]', // Настраиваем формат имен классов
    },
  },
});
