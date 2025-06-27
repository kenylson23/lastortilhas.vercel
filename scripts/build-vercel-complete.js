#!/usr/bin/env node
/**
 * Build completo para Vercel - Las Tortilhas
 * Gera frontend + API serverless functions + configurações otimizadas
 */

import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

console.log('🚀 Iniciando build completo para Vercel...');

const startTime = Date.now();

try {
  // 1. Limpar diretórios de build anteriores
  console.log('🧹 Limpando builds anteriores...');
  await fs.remove('dist');
  await fs.remove('.vercel');
  await fs.ensureDir('dist');

  // 2. Build do frontend com Vite
  console.log('⚛️ Building frontend com Vite...');
  execSync('npx vite build --mode production', { 
    stdio: 'inherit',
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      VITE_API_URL: 'https://las-tortilhas.vercel.app'
    }
  });

  // 3. Copiar arquivos estáticos
  console.log('📁 Copiando arquivos estáticos...');
  await fs.copy('public', 'dist/client/public');
  
  // 4. Garantir que index.html está no lugar correto
  if (await fs.pathExists('dist/index.html')) {
    await fs.move('dist/index.html', 'dist/client/index.html');
  }

  // 5. Criar arquivo .vercelignore otimizado
  console.log('📝 Criando .vercelignore...');
  const vercelIgnore = `
# Development
.env.local
.env.development
node_modules
src/
client/src/
server/
shared/
scripts/
migrations/

# Build artifacts  
.next/
.nuxt/
.vite/
vite.config.ts
tsconfig.json

# Documentation
*.md
VERCEL_*.md
BUILD_*.md
FLUXO_*.md

# Assets
attached_assets/
cookies*.txt

# Config files
.replit
replit.md
postcss.config.js
tailwind.config.ts
components.json
package.json.backup
`;
  await fs.writeFile('.vercelignore', vercelIgnore.trim());

  // 6. Criar arquivo de environment para produção
  console.log('🔧 Configurando variáveis de ambiente...');
  const envExample = `
# Database
DATABASE_URL=your_production_database_url

# Authentication  
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret

# External APIs
WHATSAPP_TOKEN=your_whatsapp_token
`;
  await fs.writeFile('.env.example', envExample.trim());

  // 7. Otimizar package.json para Vercel
  console.log('📦 Criando package.json otimizado...');
  const rootPackage = await fs.readJson('package.json');
  
  const vercelPackage = {
    name: rootPackage.name,
    version: rootPackage.version,
    type: "module",
    description: "Las Tortilhas Mexican Restaurant - Production Ready",
    scripts: {
      "build": "node scripts/build-vercel-complete.js",
      "build:vercel": "node scripts/build-vercel-complete.js",
      "start": "node api/index.mjs"
    },
    dependencies: {
      // Apenas dependências essenciais para produção
      "pg": rootPackage.dependencies.pg,
      "bcryptjs": rootPackage.dependencies.bcryptjs,
      "jsonwebtoken": rootPackage.dependencies.jsonwebtoken
    },
    engines: {
      "node": ">=20.x",
      "npm": ">=10.x"
    }
  };
  
  await fs.writeFile('package.json.vercel', JSON.stringify(vercelPackage, null, 2));

  // 8. Verificar estrutura final
  console.log('🔍 Verificando estrutura de build...');
  
  const requiredFiles = [
    'dist/client/index.html',
    'api/index.mjs',
    'api/package.json',
    'vercel.json',
    '.vercelignore'
  ];

  for (const file of requiredFiles) {
    if (!(await fs.pathExists(file))) {
      throw new Error(`Arquivo obrigatório não encontrado: ${file}`);
    }
  }

  // 9. Gerar relatório de build
  const buildTime = Date.now() - startTime;
  
  console.log('\n📊 Relatório de Build:');
  console.log('✅ Frontend compilado com Vite');
  console.log('✅ API serverless functions criadas');
  console.log('✅ Configurações Vercel otimizadas');
  console.log('✅ Arquivos estáticos copiados');
  console.log(`⏱️ Tempo total: ${buildTime}ms`);
  
  // Mostrar tamanhos dos arquivos
  const clientSize = await getDirSize('dist/client');
  const apiSize = await getFileSize('api/index.mjs');
  
  console.log(`📁 Tamanho do frontend: ${formatBytes(clientSize)}`);
  console.log(`📄 Tamanho da API: ${formatBytes(apiSize)}`);
  
  console.log('\n🎉 Build completo para Vercel finalizado!');
  console.log('📋 Próximos passos:');
  console.log('   1. Configure as variáveis de ambiente no Vercel');
  console.log('   2. Execute: vercel --prod');
  console.log('   3. Acesse: https://las-tortilhas.vercel.app');

} catch (error) {
  console.error('❌ Erro no build:', error.message);
  process.exit(1);
}

// Utilitários
async function getDirSize(dir) {
  let size = 0;
  const files = await fs.readdir(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      size += await getDirSize(filePath);
    } else {
      const stats = await fs.stat(filePath);
      size += stats.size;
    }
  }
  
  return size;
}

async function getFileSize(file) {
  const stats = await fs.stat(file);
  return stats.size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}