#!/usr/bin/env node

/**
 * Build simplificado para Railway - evita problemas de path
 */

const { spawn } = require('child_process');
const fs = require('fs');

console.log('Building for Railway...');

// Build frontend
console.log('1. Building frontend...');
const viteBuild = spawn('npx', ['vite', 'build'], { stdio: 'inherit' });

viteBuild.on('close', (code) => {
  if (code !== 0) {
    console.error('Frontend build failed');
    process.exit(1);
  }
  
  console.log('2. Building backend...');
  
  // Build backend com path absoluto
  const esbuild = spawn('npx', ['esbuild', './server/index.ts', '--platform=node', '--packages=external', '--bundle', '--format=esm', '--outfile=./dist/index.js'], { 
    stdio: 'inherit',
    shell: true
  });
  
  esbuild.on('close', (code) => {
    if (code !== 0) {
      console.error('Backend build failed');
      process.exit(1);
    }
    
    console.log('Build completed successfully!');
    
    // Verificar arquivos criados
    if (fs.existsSync('./dist/index.js')) {
      console.log('✓ Backend built');
    }
    if (fs.existsSync('./dist/index.html')) {
      console.log('✓ Frontend built');
    }
  });
});