import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Ajusta la ruta base según sea necesario
  plugins: [
    react({
      fastRefresh: process.env.NODE_ENV !== 'production', // Habilitar Fast Refresh solo en desarrollo
    }),
  ],
  build: {
    rollupOptions: {
      input: './public/index.html' // Asegúrate de que el punto de entrada es correcto
    }
  }
});
