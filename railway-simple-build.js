#!/usr/bin/env node

/**
 * Build simplificado para Railway - evita problemas de path
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚂 Iniciando build otimizado para Railway...');

try {
  // 1. Verificar se node_modules existe
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Instalando dependências...');
    execSync('npm ci --production=false', { stdio: 'inherit' });
  }

  // 2. Build do frontend com configuração Railway
  console.log('⚛️ Building frontend...');
  execSync('npx vite build --config vite.config.railway.ts', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // 3. Build do backend (mais simples - apenas TypeScript)
  console.log('🔧 Building backend...');
  
  // Criar diretório dist se não existir
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Copiar arquivos essenciais
  const filesToCopy = [
    'package.json',
    'package-lock.json'
  ];

  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join('dist', file));
    }
  });

  console.log('✅ Build concluído com sucesso!');
  console.log('📁 Arquivos prontos em ./dist/');

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}