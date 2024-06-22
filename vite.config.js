import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Directorio de salida para los archivos construidos
    emptyOutDir: true, // Limpiar directorio de salida antes de construir
  },
});