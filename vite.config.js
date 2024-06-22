import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Ajusta la ruta base según sea necesario
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      input: './src/index.jsx', // Ruta al archivo JavaScript o TypeScript principal
    },
    outDir: 'dist', // Reemplaza con tu directorio de compilación si es diferente
  }
});