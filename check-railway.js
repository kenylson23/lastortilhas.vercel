#!/usr/bin/env node

/**
 * Script para verificar configuração do Railway
 * Execute: node check-railway.js
 */

const { execSync } = require('child_process');

console.log('🚂 Verificando configuração do Railway...\n');

// Verificar se Railway CLI está instalado
try {
  execSync('railway --version', { stdio: 'ignore' });
  console.log('✅ Railway CLI instalado');
} catch (error) {
  console.log('❌ Railway CLI não instalado');
  console.log('📋 Para instalar: npm install -g @railway/cli\n');
  process.exit(1);
}

// Verificar se está logado
try {
  execSync('railway whoami', { stdio: 'ignore' });
  console.log('✅ Logado no Railway');
} catch (error) {
  console.log('❌ Não logado no Railway');
  console.log('📋 Para logar: railway login\n');
  process.exit(1);
}

// Verificar se projeto está linkado
try {
  const status = execSync('railway status', { encoding: 'utf8' });
  console.log('✅ Projeto linkado ao Railway');
  
  // Verificar serviços
  if (status.includes('postgres')) {
    console.log('✅ Serviço PostgreSQL encontrado');
  } else {
    console.log('❌ Serviço PostgreSQL não encontrado');
    console.log('📋 Adicione: railway add --database postgresql');
  }
  
  if (status.includes('web') || status.includes('app')) {
    console.log('✅ Serviço web encontrado');
  } else {
    console.log('❌ Serviço web não encontrado');
  }
  
} catch (error) {
  console.log('❌ Projeto não linkado');
  console.log('📋 Para linkar: railway link\n');
  process.exit(1);
}

// Verificar variáveis de ambiente
try {
  const variables = execSync('railway variables', { encoding: 'utf8' });
  
  if (variables.includes('DATABASE_URL')) {
    console.log('✅ DATABASE_URL configurada');
  } else {
    console.log('❌ DATABASE_URL não encontrada');
  }
  
  if (variables.includes('DATABASE_PRIVATE_URL')) {
    console.log('✅ DATABASE_PRIVATE_URL configurada');
  } else {
    console.log('⚠️  DATABASE_PRIVATE_URL não encontrada (opcional)');
  }
  
} catch (error) {
  console.log('❌ Erro ao verificar variáveis');
}

// Testar conexão com banco
console.log('\n🔍 Testando conexão com banco...');
try {
  execSync('railway run node -e "console.log(\'DATABASE_URL:\', process.env.DATABASE_URL ? \'✅ Definida\' : \'❌ Não definida\')"', { stdio: 'inherit' });
} catch (error) {
  console.log('❌ Erro ao testar conexão');
}

console.log('\n📊 Verificação completa!');
console.log('\n🔧 Comandos úteis:');
console.log('  railway logs          - Ver logs em tempo real');
console.log('  railway run npm run db:push - Aplicar schema do banco');
console.log('  railway open          - Abrir projeto no browser');
console.log('  railway status        - Ver status dos serviços');