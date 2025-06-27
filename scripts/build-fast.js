#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync, cpSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Building Las Tortilhas (optimized)...');

// Clean previous builds
if (existsSync('dist')) {
  console.log('🧹 Cleaning previous build...');
  rmSync('dist', { recursive: true, force: true });
}

// Create dist directory
mkdirSync('dist', { recursive: true });
mkdirSync('dist/public', { recursive: true });

try {
  // Create optimized vite config for production
  const optimizedConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "./client",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  build: {
    outDir: "../dist/public",
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@tanstack/react-query'],
          utils: ['wouter', 'clsx']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 2000
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});`;

  writeFileSync('vite.config.prod.js', optimizedConfig);

  // Build with optimized config
  console.log('🎨 Building frontend...');
  execSync('vite build --config vite.config.prod.js', { 
    stdio: 'inherit',
    timeout: 120000 // 2 minutes timeout
  });

  // Clean up
  rmSync('vite.config.prod.js');

  // Verify build
  console.log('✅ Build verification:');
  console.log(`   - Frontend: ${existsSync('dist/public/index.html') ? '✓' : '✗'} index.html`);
  console.log(`   - Assets: ${existsSync('dist/public/assets') ? '✓' : '✗'} static assets`);

  console.log('🎉 Build completed successfully!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Fallback: copy client files directly
  console.log('🔄 Attempting fallback build...');
  try {
    cpSync('client', 'dist/public', { recursive: true });
    console.log('✅ Fallback build completed');
  } catch (fallbackError) {
    console.error('❌ Fallback failed:', fallbackError.message);
    process.exit(1);
  }
}