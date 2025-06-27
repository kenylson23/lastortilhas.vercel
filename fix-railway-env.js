#!/usr/bin/env node

/**
 * Script para verificar e corrigir variáveis de ambiente no Railway
 * Execute localmente: node fix-railway-env.js
 */

const { execSync } = require('child_process');

console.log('🔧 Verificando configuração de variáveis Railway...\n');

try {
  // Verificar se Railway CLI está disponível
  execSync('railway --version', { stdio: 'ignore' });
} catch (error) {
  console.log('❌ Railway CLI não instalado');
  console.log('Instale com: npm install -g @railway/cli\n');
  process.exit(1);
}

try {
  // Verificar variáveis atuais
  console.log('📋 Variáveis atuais:');
  const variables = execSync('railway variables', { encoding: 'utf8' });
  console.log(variables);
  
  // Verificar se DATABASE_URL existe
  if (!variables.includes('DATABASE_URL')) {
    console.log('\n❌ DATABASE_URL não encontrada');
    console.log('🔧 Tentando obter URL do PostgreSQL...\n');
    
    try {
      // Tentar obter informações do PostgreSQL
      const status = execSync('railway status', { encoding: 'utf8' });
      console.log('Status dos serviços:');
      console.log(status);
      
      console.log('\n📝 AÇÃO NECESSÁRIA:');
      console.log('1. Vá ao dashboard Railway');
      console.log('2. Clique no serviço PostgreSQL');
      console.log('3. Na aba "Connect", copie a Database URL');
      console.log('4. Clique no serviço da aplicação');
      console.log('5. Na aba "Variables", adicione:');
      console.log('   Nome: DATABASE_URL');
      console.log('   Valor: [URL copiada]');
      console.log('6. Salve e faça redeploy');
      
    } catch (error) {
      console.log('Erro ao obter status:', error.message);
    }
  } else {
    console.log('\n✅ DATABASE_URL encontrada');
    
    // Testar conexão
    console.log('🔍 Testando conexão...');
    try {
      execSync('railway run node -e "console.log(\'DATABASE_URL:\', process.env.DATABASE_URL ? \'OK\' : \'MISSING\')"', { stdio: 'inherit' });
    } catch (error) {
      console.log('❌ Erro ao testar conexão');
    }
  }
  
} catch (error) {
  console.log('❌ Erro ao verificar variáveis:', error.message);
  console.log('\n💡 Possíveis soluções:');
  console.log('1. Faça login: railway login');
  console.log('2. Conecte o projeto: railway link');
  console.log('3. Tente novamente');
}

console.log('\n🎯 Próximos passos após correção:');
console.log('1. railway run npm run db:push');
console.log('2. railway run node test-railway-connection.js');
console.log('3. railway run psql < populate-railway-db.sql');