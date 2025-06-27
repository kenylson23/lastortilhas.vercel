import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema.js';
import bcrypt from 'bcryptjs';

// Supabase connection
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL or SUPABASE_DATABASE_URL must be set');
}

const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool, { schema });

async function populateSupabase() {
  console.log('🌮 Populando banco Supabase do Las Tortilhas...');

  try {
    // 1. Criar usuário admin
    console.log('👤 Criando usuário admin...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await db.insert(schema.users).values({
      id: 'admin-user-id',
      email: 'admin@lastortilhas.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'Las Tortilhas',
      role: 'admin',
      password: hashedPassword,
    }).onConflictDoNothing();

    // 2. Criar categorias do menu
    console.log('📋 Criando categorias do menu...');
    const categorias = [
      { name: 'Entradas', description: 'Aperitivos e entradas mexicanas' },
      { name: 'Tacos', description: 'Tacos tradicionais e especiais' },
      { name: 'Quesadillas', description: 'Quesadillas variadas' },
      { name: 'Burritos', description: 'Burritos e wraps mexicanos' },
      { name: 'Pratos Principais', description: 'Pratos principais da casa' },
      { name: 'Bebidas', description: 'Bebidas tradicionais e refrescos' },
      { name: 'Sobremesas', description: 'Doces tradicionais mexicanos' },
    ];

    const insertedCategories = await Promise.all(
      categorias.map(async (cat) => {
        const [category] = await db.insert(schema.menuCategories)
          .values(cat)
          .returning()
          .onConflictDoNothing();
        return category;
      })
    );

    // 3. Criar itens do menu
    console.log('🌮 Criando itens do menu...');
    const menuItems = [
      // Entradas
      ['Guacamole Tradicional', 'Abacate fresco com tomate, cebola e coentro, servido com nachos', '12.00', insertedCategories[0]?.id, 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400'],
      ['Nachos Supremos', 'Nachos crocantes com queijo derretido, jalapeños, molho e carne moída', '15.00', insertedCategories[0]?.id, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400'],
      
      // Tacos
      ['Taco de Carnitas', 'Porco desfiado temperado com especiarias, cebola e coentro', '8.00', insertedCategories[1]?.id, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'],
      ['Taco de Pollo', 'Frango grelhado com temperos mexicanos, alface e tomate', '7.50', insertedCategories[1]?.id, 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400'],
      ['Taco Vegetariano', 'Feijão preto, abacate, milho e pimentões coloridos', '7.00', insertedCategories[1]?.id, 'https://images.unsplash.com/photo-1599974982608-f57e7fd31036?w=400'],
      
      // Quesadillas
      ['Quesadilla de Queijo', 'Tortilha recheada com queijo mexicano derretido', '9.00', insertedCategories[2]?.id, 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400'],
      ['Quesadilla de Frango', 'Frango temperado com queijo e pimentões', '11.00', insertedCategories[2]?.id, 'https://images.unsplash.com/photo-1593759608136-45eb2ad9507d?w=400'],
      
      // Burritos
      ['Burrito Clássico', 'Carne bovina, arroz, feijão, queijo e molhos especiais', '14.00', insertedCategories[3]?.id, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400'],
      ['Burrito Vegetariano', 'Feijão preto, arroz, vegetais grelhados e guacamole', '12.00', insertedCategories[3]?.id, 'https://images.unsplash.com/photo-1574343635105-4cf2ea136b2b?w=400'],
      
      // Pratos Principais
      ['Fajitas Mistas', 'Carne bovina e frango com pimentões, servido com tortilhas', '22.00', insertedCategories[4]?.id, 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400'],
      ['Enchiladas Rojas', 'Tortilhas recheadas com frango em molho vermelho picante', '18.00', insertedCategories[4]?.id, 'https://images.unsplash.com/photo-1599343452508-57177f049d87?w=400'],
      ['Carne Asada', 'Carne bovina grelhada servida com arroz, feijão e guarnições', '25.00', insertedCategories[4]?.id, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'],
      
      // Bebidas
      ['Margarita Clássica', 'Tequila, limão e triple sec com sal na borda', '12.00', insertedCategories[5]?.id, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400'],
      ['Água de Horchata', 'Bebida tradicional mexicana com arroz, canela e leite', '6.00', insertedCategories[5]?.id, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'],
      ['Cerveja Corona', 'Cerveja mexicana tradicional servida gelada com limão', '5.00', insertedCategories[5]?.id, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400'],
      
      // Sobremesas
      ['Churros com Doce de Leite', 'Churros crocantes polvilhados com açúcar e canela', '8.00', insertedCategories[6]?.id, 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400'],
      ['Flan Mexicano', 'Pudim cremoso com calda de caramelo', '7.00', insertedCategories[6]?.id, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400'],
      ['Tres Leches', 'Bolo embebido em três tipos de leite com chantilly', '9.00', insertedCategories[6]?.id, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'],
    ];

    for (const [name, description, price, categoryId, image] of menuItems) {
      if (categoryId) {
        await db.insert(schema.menuItems).values({
          name,
          description,
          price,
          categoryId,
          image,
        }).onConflictDoNothing();
      }
    }

    // 4. Criar imagens da galeria
    console.log('🖼️ Criando galeria de imagens...');
    const galleryData = [
      ['Ambiente Acolhedor', 'Interior do restaurante com decoração mexicana autêntica', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
      ['Tacos Especiais', 'Nossa seleção de tacos tradicionais mexicanos', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'],
      ['Guacamole Fresco', 'Guacamole preparado na hora com ingredientes frescos', 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=800'],
      ['Fajitas Sizzling', 'Fajitas servidas na chapa quente com acompanhamentos', 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800'],
      ['Margaritas Geladas', 'Coleção de margaritas com sabores tradicionais', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'],
      ['Churros Crocantes', 'Churros frescos polvilhados com açúcar e canela', 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800'],
      ['Mesa Festiva', 'Mesa preparada para uma celebração mexicana', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'],
      ['Terraço Exterior', 'Área externa do restaurante perfeita para o clima de Luanda', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'],
    ];

    for (const [title, description, imageUrl] of galleryData) {
      await db.insert(schema.galleryImages).values({
        title,
        description,
        imageUrl,
      }).onConflictDoNothing();
    }

    console.log('✅ Supabase populado com sucesso!');
    console.log('');
    console.log('🔑 Credenciais do Admin:');
    console.log('   Email: admin@lastortilhas.com');
    console.log('   Senha: admin123');
    console.log('');
    console.log('📊 Dados criados:');
    console.log(`   - 1 usuário admin`);
    console.log(`   - ${categorias.length} categorias de menu`);
    console.log(`   - ${menuItems.length} itens de menu`);
    console.log(`   - ${galleryImages.length} imagens da galeria`);

  } catch (error) {
    console.error('❌ Erro ao popular Supabase:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Execute o script
populateSupabase().catch(console.error);