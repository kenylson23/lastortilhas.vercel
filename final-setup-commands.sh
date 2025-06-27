#!/bin/bash

# Comandos finais para setup do Las Tortilhas no Railway
# Execute após deploy bem-sucedido

echo "🚂 Configuração final Las Tortilhas no Railway"
echo "============================================="

echo ""
echo "1. Aplicando schema do banco de dados..."
railway run npm run db:push

echo ""
echo "2. Testando conexão com banco..."
railway run node test-railway-connection.js

echo ""
echo "3. Populando banco com dados iniciais..."
railway run psql < populate-railway-db.sql

echo ""
echo "4. Verificando dados populados..."
railway run node -e "
const { Pool } = require('pg');
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
(async () => {
  const client = await pool.connect();
  const categories = await client.query('SELECT COUNT(*) FROM menu_categories');
  const items = await client.query('SELECT COUNT(*) FROM menu_items');
  const gallery = await client.query('SELECT COUNT(*) FROM gallery_images');
  
  console.log('✅ Dados carregados:');
  console.log('  - Categorias:', categories.rows[0].count);
  console.log('  - Itens do menu:', items.rows[0].count);
  console.log('  - Imagens da galeria:', gallery.rows[0].count);
  
  client.release();
  await pool.end();
})();
"

echo ""
echo "🎉 Setup concluído!"
echo "Acesse sua aplicação em: https://seuapp.railway.app"
echo "Painel admin em: https://seuapp.railway.app/admin"