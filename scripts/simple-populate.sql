-- Limpar dados existentes (opcional)
-- TRUNCATE users, menu_categories, menu_items, gallery_images RESTART IDENTITY CASCADE;

-- Inserir usuário admin
INSERT INTO users (id, email, username, first_name, last_name, role, password) 
VALUES ('admin-user-id', 'admin@lastortilhas.com', 'admin', 'Admin', 'Las Tortilhas', 'admin', '$2a$12$8Q3h1ZAm4mz8vJBjXOjhCuYAVpFJfcKF5MhKg7.OE.tXEn0kLmZ4O')
ON CONFLICT (email) DO NOTHING;

-- Inserir categorias do menu
INSERT INTO menu_categories (name, description) VALUES
  ('Entradas', 'Aperitivos e entradas mexicanas'),
  ('Tacos', 'Tacos tradicionais e especiais'),
  ('Quesadillas', 'Quesadillas variadas'),
  ('Burritos', 'Burritos e wraps mexicanos'),
  ('Pratos Principais', 'Pratos principais da casa'),
  ('Bebidas', 'Bebidas tradicionais e refrescos'),
  ('Sobremesas', 'Doces tradicionais mexicanos')
ON CONFLICT (name) DO NOTHING;

-- Inserir itens do menu
INSERT INTO menu_items (name, description, price, category_id, image) VALUES
  -- Entradas (categoria 1)
  ('Guacamole Tradicional', 'Abacate fresco com tomate, cebola e coentro, servido com nachos', '12.00', 1, 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400'),
  ('Nachos Supremos', 'Nachos crocantes com queijo derretido, jalapeños, molho e carne moída', '15.00', 1, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400'),
  
  -- Tacos (categoria 2)
  ('Taco de Carnitas', 'Porco desfiado temperado com especiarias, cebola e coentro', '8.00', 2, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'),
  ('Taco de Pollo', 'Frango grelhado com temperos mexicanos, alface e tomate', '7.50', 2, 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400'),
  ('Taco Vegetariano', 'Feijão preto, abacate, milho e pimentões coloridos', '7.00', 2, 'https://images.unsplash.com/photo-1599974982608-f57e7fd31036?w=400'),
  
  -- Quesadillas (categoria 3)
  ('Quesadilla de Queijo', 'Tortilha recheada com queijo mexicano derretido', '9.00', 3, 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400'),
  ('Quesadilla de Frango', 'Frango temperado com queijo e pimentões', '11.00', 3, 'https://images.unsplash.com/photo-1593759608136-45eb2ad9507d?w=400'),
  
  -- Burritos (categoria 4)
  ('Burrito Clássico', 'Carne bovina, arroz, feijão, queijo e molhos especiais', '14.00', 4, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400'),
  ('Burrito Vegetariano', 'Feijão preto, arroz, vegetais grelhados e guacamole', '12.00', 4, 'https://images.unsplash.com/photo-1574343635105-4cf2ea136b2b?w=400'),
  
  -- Pratos Principais (categoria 5)
  ('Fajitas Mistas', 'Carne bovina e frango com pimentões, servido com tortilhas', '22.00', 5, 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400'),
  ('Enchiladas Rojas', 'Tortilhas recheadas com frango em molho vermelho picante', '18.00', 5, 'https://images.unsplash.com/photo-1599343452508-57177f049d87?w=400'),
  ('Carne Asada', 'Carne bovina grelhada servida com arroz, feijão e guarnições', '25.00', 5, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'),
  
  -- Bebidas (categoria 6)
  ('Margarita Clássica', 'Tequila, limão e triple sec com sal na borda', '12.00', 6, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400'),
  ('Água de Horchata', 'Bebida tradicional mexicana com arroz, canela e leite', '6.00', 6, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'),
  ('Cerveja Corona', 'Cerveja mexicana tradicional servida gelada com limão', '5.00', 6, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400'),
  
  -- Sobremesas (categoria 7)
  ('Churros com Doce de Leite', 'Churros crocantes polvilhados com açúcar e canela', '8.00', 7, 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400'),
  ('Flan Mexicano', 'Pudim cremoso com calda de caramelo', '7.00', 7, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400'),
  ('Tres Leches', 'Bolo embebido em três tipos de leite com chantilly', '9.00', 7, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400')
ON CONFLICT (name) DO NOTHING;

-- Inserir imagens da galeria
INSERT INTO gallery_images (title, description, image_url) VALUES
  ('Ambiente Acolhedor', 'Interior do restaurante com decoração mexicana autêntica', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'),
  ('Tacos Especiais', 'Nossa seleção de tacos tradicionais mexicanos', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'),
  ('Guacamole Fresco', 'Guacamole preparado na hora com ingredientes frescos', 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=800'),
  ('Fajitas Sizzling', 'Fajitas servidas na chapa quente com acompanhamentos', 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800'),
  ('Margaritas Geladas', 'Coleção de margaritas com sabores tradicionais', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'),
  ('Churros Crocantes', 'Churros frescos polvilhados com açúcar e canela', 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800'),
  ('Mesa Festiva', 'Mesa preparada para uma celebração mexicana', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'),
  ('Terraço Exterior', 'Área externa do restaurante perfeita para o clima de Luanda', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800')
ON CONFLICT (title) DO NOTHING;