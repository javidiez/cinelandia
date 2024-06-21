import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Ajusta la ruta base según sea necesario
  plugins: [
    react({
      fastRefresh: true, // Habilitar Fast Refresh
    }),
  ],
  build: {
    rollupOptions: {
      input: './src/main.jsx', // Ruta al archivo JavaScript o TypeScript principal
    }
  }
});