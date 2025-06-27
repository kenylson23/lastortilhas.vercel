import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "./client/src",
      "@shared": "./shared",
      "@assets": "./attached_assets",
    },
  },
  root: "./client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      input: "./client/index.html",
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-button'],
          icons: ['lucide-react'],
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: ['@replit/vite-plugin-cartographer', '@replit/vite-plugin-runtime-error-modal']
  },
});