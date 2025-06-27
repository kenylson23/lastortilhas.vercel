#!/usr/bin/env node

/**
 * Teste de conexão Railway - Las Tortilhas
 * Execute: railway run node test-railway-connection.js
 */

const { Pool } = require('pg');

async function testConnection() {
  console.log('🔍 Testando conexão com banco Railway...\n');
  
  // Verificar variáveis de ambiente
  const dbUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL;
  const port = process.env.PORT || 3000;
  
  console.log('📊 Variáveis de ambiente:');
  console.log(`- PORT: ${port}`);
  console.log(`- DATABASE_URL: ${dbUrl ? '✅ Definida' : '❌ Não definida'}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'não definido'}\n`);
  
  if (!dbUrl) {
    console.log('❌ DATABASE_URL não encontrada');
    process.exit(1);
  }
  
  // Testar conexão com banco
  const pool = new Pool({ 
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('🔌 Conectando ao banco...');
    const client = await pool.connect();
    
    // Testar query simples
    const result = await client.query('SELECT version()');
    console.log('✅ Conexão bem-sucedida!');
    console.log(`📊 PostgreSQL: ${result.rows[0].version.split(' ')[1]}\n`);
    
    // Verificar se tabelas existem
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tabelas no banco:');
    if (tables.rows.length === 0) {
      console.log('❌ Nenhuma tabela encontrada');
      console.log('💡 Execute: railway run npm run db:push');
    } else {
      tables.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
      
      // Verificar dados nas tabelas principais
      try {
        const menuCount = await client.query('SELECT COUNT(*) FROM menu_categories');
        const itemsCount = await client.query('SELECT COUNT(*) FROM menu_items');
        const galleryCount = await client.query('SELECT COUNT(*) FROM gallery_images');
        
        console.log('\n📊 Dados existentes:');
        console.log(`  - Categorias: ${menuCount.rows[0].count}`);
        console.log(`  - Itens do menu: ${itemsCount.rows[0].count}`);
        console.log(`  - Imagens da galeria: ${galleryCount.rows[0].count}`);
        
        if (itemsCount.rows[0].count == 0) {
          console.log('\n💡 Para popular banco: railway run psql < populate-railway-db.sql');
        }
      } catch (err) {
        console.log('⚠️  Algumas tabelas ainda não possuem dados');
      }
    }
    
    client.release();
    
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
  
  console.log('\n🎉 Teste concluído com sucesso!');
}

testConnection();