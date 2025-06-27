/**
 * Teste das APIs serverless do Vercel
 * Execute: node test-vercel-api.js
 */

// URLs para testar (ajuste conforme necessário)
const API_BASE = 'https://your-app.vercel.app/api'; // Substitua pela URL do Vercel
// Para teste local: const API_BASE = 'http://localhost:3000/api';

async function testAPI(endpoint, description) {
  try {
    console.log(`\n🧪 Testando: ${description}`);
    console.log(`📡 Endpoint: ${API_BASE}${endpoint}`);
    
    const response = await fetch(`${API_BASE}${endpoint}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Sucesso: ${response.status}`);
      console.log(`📋 Dados:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ Erro: ${response.status}`);
      console.log(`📋 Mensagem:`, data);
    }
  } catch (error) {
    console.log(`🚨 Erro de conexão:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Las Tortilhas - Teste das APIs Vercel\n');
  
  // Teste dos endpoints principais
  await testAPI('/', 'API Status');
  await testAPI('/auth/user', 'Autenticação');
  await testAPI('/menu/categories', 'Categorias do Menu');
  await testAPI('/menu/items', 'Itens do Menu');
  await testAPI('/gallery', 'Galeria');
  await testAPI('/reservations', 'Reservas');
  
  console.log('\n🏁 Testes concluídos!');
  console.log('\n📝 Próximos passos:');
  console.log('1. Configure POSTGRES_URL no dashboard do Vercel');
  console.log('2. Execute npm run db:push para criar as tabelas');
  console.log('3. Teste as APIs após o deployment');
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  runTests();
}

module.exports = { testAPI, runTests };