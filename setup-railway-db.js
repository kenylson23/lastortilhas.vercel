#!/usr/bin/env node

/**
 * Script automatizado para configurar PostgreSQL no Railway
 * Execute: node setup-railway-db.js
 */

const { execSync } = require('child_process');

console.log('🚂 Configurando PostgreSQL no Railway...\n');

// Verificar se Railway CLI está instalado
try {
  execSync('railway --version', { stdio: 'ignore' });
  console.log('✅ Railway CLI detectado');
} catch (error) {
  console.log('❌ Railway CLI não encontrado');
  console.log('📋 Instale com: npm install -g @railway/cli');
  console.log('📋 Depois execute: railway login\n');
  process.exit(1);
}

// Verificar se está logado
try {
  execSync('railway whoami', { stdio: 'ignore' });
  console.log('✅ Logado no Railway');
} catch (error) {
  console.log('❌ Não logado no Railway');
  console.log('📋 Execute: railway login\n');
  process.exit(1);
}

// Verificar se projeto está linkado
try {
  const status = execSync('railway status', { encoding: 'utf8' });
  console.log('✅ Projeto linkado ao Railway');
  
  // Verificar se PostgreSQL já existe
  if (status.includes('postgres') || status.includes('postgresql')) {
    console.log('✅ Serviço PostgreSQL já existe');
    
    // Verificar se precisa executar migração
    console.log('\n🔧 Configurando banco de dados...');
    try {
      execSync('railway run npm run db:push', { stdio: 'inherit' });
      console.log('✅ Schema do banco criado com sucesso');
    } catch (error) {
      console.log('⚠️  Erro ao criar schema. Execute manualmente:');
      console.log('   railway run npm run db:push');
    }
    
  } else {
    console.log('❌ Serviço PostgreSQL não encontrado');
    console.log('\n📋 Para adicionar PostgreSQL:');
    console.log('1. Acesse o dashboard do Railway');
    console.log('2. Clique em "+ New Service"');
    console.log('3. Selecione "Database" → "PostgreSQL"');
    console.log('4. Execute novamente este script após a criação');
    process.exit(1);
  }
  
} catch (error) {
  console.log('❌ Projeto não linkado');
  console.log('\n📋 Para linkar projeto:');
  console.log('1. railway link');
  console.log('2. Selecione seu projeto');
  console.log('3. Execute novamente este script');
  process.exit(1);
}

console.log('\n🎉 PostgreSQL configurado com sucesso!');
console.log('\n📊 Comandos úteis:');
console.log('• Ver logs: railway logs');
console.log('• Status: railway status');
console.log('• Shell: railway shell');
console.log('• Query interface: dashboard do Railway → PostgreSQL → Query');
console.log('\n🌐 Seu site estará em: https://[projeto].railway.app');