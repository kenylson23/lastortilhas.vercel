#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync, cpSync, rmSync } from 'fs';
import { join } from 'path';

console.log('🚀 Building Las Tortilhas for Vercel deployment...');

// Clean previous builds
if (existsSync('dist')) {
  console.log('🧹 Cleaning previous build...');
  rmSync('dist', { recursive: true, force: true });
}

// Create dist directory
mkdirSync('dist', { recursive: true });
mkdirSync('dist/public', { recursive: true });

try {
  // Build the client (frontend)
  console.log('🎨 Building frontend with Vite...');
  execSync('vite build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Build the server for Vercel Functions
  console.log('⚙️ Building server for Vercel...');
  execSync('esbuild api/index.ts --platform=node --packages=external --bundle --format=esm --outdir=api --target=node18', {
    stdio: 'inherit'
  });

  // Copy static assets
  console.log('📁 Copying static assets...');
  if (existsSync('public')) {
    cpSync('public', 'dist/public', { recursive: true });
  }

  // Verify build output
  console.log('✅ Build verification:');
  console.log(`   - Frontend: ${existsSync('dist/public/index.html') ? '✓' : '✗'} index.html`);
  console.log(`   - API: ${existsSync('api/index.js') ? '✓' : '✗'} serverless function`);
  console.log(`   - Assets: ${existsSync('dist/public/assets') ? '✓' : '✗'} static assets`);

  console.log('🎉 Build completed successfully!');
  console.log('📦 Ready for Vercel deployment');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}