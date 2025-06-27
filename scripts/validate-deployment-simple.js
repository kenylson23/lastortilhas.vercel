#!/usr/bin/env node
/**
 * Validador Simples de Arquivos de Implantação - Las Tortilhas
 */

import fs from 'fs';

console.log('🔍 Validando arquivos de implantação...');

const checks = [];

// Verificar arquivos obrigatórios
const requiredFiles = [
  'vercel.json',
  'api/index.mjs',
  'api/package.json',
  '.vercelignore',
  'next.config.js',
  'scripts/build-vercel-complete.js'
];

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    checks.push({ file, status: '✅', message: 'Presente' });
  } else {
    checks.push({ file, status: '❌', message: 'Ausente' });
  }
}

// Verificar conteúdo do vercel.json
if (fs.existsSync('vercel.json')) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    
    if (vercelConfig.version === 2) {
      checks.push({ file: 'vercel.json', status: '✅', message: 'Versão 2 configurada' });
    } else {
      checks.push({ file: 'vercel.json', status: '⚠️', message: 'Versão incorreta' });
    }
    
    if (vercelConfig.functions) {
      checks.push({ file: 'vercel.json', status: '✅', message: 'Functions configuradas' });
    } else {
      checks.push({ file: 'vercel.json', status: '⚠️', message: 'Functions não configuradas' });
    }
    
  } catch (error) {
    checks.push({ file: 'vercel.json', status: '❌', message: 'JSON inválido' });
  }
}

// Verificar API package.json
if (fs.existsSync('api/package.json')) {
  try {
    const apiPackage = JSON.parse(fs.readFileSync('api/package.json', 'utf8'));
    
    if (apiPackage.type === 'module') {
      checks.push({ file: 'api/package.json', status: '✅', message: 'ES modules configurado' });
    } else {
      checks.push({ file: 'api/package.json', status: '⚠️', message: 'ES modules não configurado' });
    }
    
  } catch (error) {
    checks.push({ file: 'api/package.json', status: '❌', message: 'JSON inválido' });
  }
}

// Mostrar resultados
console.log('\n📋 Resultado da Validação:\n');

let hasErrors = false;
let hasWarnings = false;

for (const check of checks) {
  console.log(`${check.status} ${check.file} - ${check.message}`);
  
  if (check.status === '❌') {
    hasErrors = true;
  } else if (check.status === '⚠️') {
    hasWarnings = true;
  }
}

console.log('\n📊 Resumo:');

if (hasErrors) {
  console.log('❌ Erros encontrados - Corrija antes do deploy');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️ Avisos encontrados - Revise configurações');
} else {
  console.log('✅ Todos os arquivos de implantação estão corretos!');
}

console.log('\n🚀 Próximos passos para deploy:');
console.log('1. Configure variáveis de ambiente no Vercel');
console.log('2. Execute: vercel --prod');
console.log('3. Teste: curl https://suas-url.vercel.app/api/health');

console.log('\n📚 Documentação completa: DEPLOYMENT_COMPLETE_2025.md');