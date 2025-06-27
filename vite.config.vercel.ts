import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      input: path.resolve(__dirname, "client", "index.html"),
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-button'],
          icons: ['lucide-react'],
        },
      },
      external: (id) => {
        // Skip problematic lucide icons during build
        if (id.includes('lucide-react/dist/esm/icons') && 
            !['menu', 'x', 'phone', 'mail', 'map-pin', 'clock', 'star', 'user'].some(icon => id.includes(icon))) {
          return false;
        }
        return false;
      }
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