#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Las Tortilhas Restaurant for Vercel...');

try {
  // Ensure we're using the right Node version
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build the frontend with Vite
  console.log('🏗️ Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });

  // Copy the built files to the root for Vercel
  const distPath = path.join(__dirname, 'dist');
  const rootPath = __dirname;

  if (fs.existsSync(distPath)) {
    console.log('📁 Copying built files...');
    
    // Copy index.html to root
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      fs.copyFileSync(indexPath, path.join(rootPath, 'index.html'));
      console.log('✅ Copied index.html to root');
    }

    // Copy assets
    const assetsPath = path.join(distPath, 'assets');
    const rootAssetsPath = path.join(rootPath, 'assets');
    
    if (fs.existsSync(assetsPath)) {
      // Remove existing assets
      if (fs.existsSync(rootAssetsPath)) {
        fs.rmSync(rootAssetsPath, { recursive: true, force: true });
      }
      
      // Copy new assets
      fs.cpSync(assetsPath, rootAssetsPath, { recursive: true });
      console.log('✅ Copied assets to root');
    }
  }

  console.log('🎉 Build completed successfully!');
  console.log('📝 Las Tortilhas Restaurant is ready for deployment');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}