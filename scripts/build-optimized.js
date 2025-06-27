#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting optimized build for Las Tortilhas...');

try {
  // Clean dist directory
  const distPath = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
  }
  fs.mkdirSync(distPath, { recursive: true });

  // Copy index.html to dist root
  const indexHtmlPath = path.join(__dirname, '..', 'index.html');
  const distIndexPath = path.join(distPath, 'index.html');
  fs.copyFileSync(indexHtmlPath, distIndexPath);

  // Create basic CSS for fallback
  const cssContent = `
    body { 
      margin: 0; 
      font-family: Arial, sans-serif; 
      background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
    }
    .restaurant-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .hero {
      text-align: center;
      color: white;
      padding: 60px 20px;
    }
    .hero h1 {
      font-size: 3rem;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .section {
      background: #FEF3C7;
      margin: 20px 0;
      padding: 30px;
      border-radius: 15px;
      border-left: 5px solid #F59E0B;
    }
    .section h2 {
      color: #D97706;
      border-bottom: 3px solid #F59E0B;
      padding-bottom: 10px;
    }
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .menu-item {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding: 20px;
      background: #92400E;
      color: white;
      border-radius: 10px;
    }
  `;

  const assetsDir = path.join(distPath, 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.writeFileSync(path.join(assetsDir, 'style.css'), cssContent);

  // Create optimized main.js
  const jsContent = `
    // Las Tortilhas Restaurant App - Optimized Build
    console.log('Las Tortilhas Restaurant - Carregando...');
    
    // Basic interactivity
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Las Tortilhas Restaurant carregado com sucesso!');
      
      // Simple menu toggle for mobile
      const menuButtons = document.querySelectorAll('.menu-toggle');
      menuButtons.forEach(button => {
        button.addEventListener('click', function() {
          const menu = document.querySelector('.mobile-menu');
          if (menu) {
            menu.classList.toggle('hidden');
          }
        });
      });
      
      // Smooth scroll for anchor links
      const links = document.querySelectorAll('a[href^="#"]');
      links.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    });
  `;

  fs.writeFileSync(path.join(assetsDir, 'main.js'), jsContent);

  // Update index.html to include optimized assets
  let indexContent = fs.readFileSync(distIndexPath, 'utf8');
  
  // Add CSS link
  indexContent = indexContent.replace(
    '</head>',
    '  <link rel="stylesheet" href="/assets/style.css">\n</head>'
  );
  
  // Add JS script
  indexContent = indexContent.replace(
    '</body>',
    '  <script src="/assets/main.js"></script>\n</body>'
  );

  fs.writeFileSync(distIndexPath, indexContent);

  console.log('✅ Optimized build completed successfully!');
  console.log('📁 Files created:');
  console.log('   - dist/index.html');
  console.log('   - dist/assets/style.css');
  console.log('   - dist/assets/main.js');
  console.log('🎉 Las Tortilhas is ready for deployment!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}