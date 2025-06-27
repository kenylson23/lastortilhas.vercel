#!/usr/bin/env node

/**
 * Script de build customizado para Railway
 * Evita problemas com argumentos indefinidos do esbuild
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building Las Tortilhas for Railway...');

try {
  // 1. Build frontend com Vite
  console.log('📦 Building frontend...');
  execSync('vite build', { stdio: 'inherit' });
  
  // 2. Build backend com esbuild - comando explícito
  console.log('🔧 Building backend...');
  
  // Verificar se arquivo existe
  const serverPath = path.join(process.cwd(), 'server', 'index.ts');
  if (!fs.existsSync(serverPath)) {
    throw new Error('Server file not found: ' + serverPath);
  }
  
  // Build do servidor com argumentos explícitos
  execSync(`npx esbuild ${serverPath} --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js`, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Build completed successfully!');
  
  // Verificar se arquivo de saída foi criado
  const outputPath = path.join(process.cwd(), 'dist', 'index.js');
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    console.log(`📊 Output: ${outputPath} (${Math.round(stats.size / 1024)}KB)`);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}