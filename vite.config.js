import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Ajusta la ruta base si es necesario
  plugins: [
    react({
      fastRefresh: true, // Habilitar Fast Refresh
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: './index.html', // Asegúrate de que este es el archivo correcto
      }
    }
  }
});
