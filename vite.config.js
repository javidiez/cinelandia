import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Ajusta la ruta base según sea necesario
  plugins: [
    react({
      fastRefresh: true, // Habilitar Fast Refresh
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: './src/main.jsx'
      }
    }
  }
});
