-- Las Tortilhas Restaurant - Database Population Script for Supabase
-- Run this after creating tables with Drizzle migrations

-- Insert menu categories
INSERT INTO menu_categories (name, description, "order") VALUES
('Entradas', 'Aperitivos deliciosos para começar a refeição', 1),
('Tacos', 'Tacos autênticos mexicanos', 2),
('Quesadillas', 'Tortillas recheadas com queijo derretido', 3),
('Burritos', 'Wraps mexicanos generosos', 4),
('Pratos Principais', 'Pratos principais tradicionais mexicanos', 5),
('Sobremesas', 'Doces tradicionais mexicanos', 6),
('Bebidas', 'Bebidas refrescantes e coquetéis', 7)
ON CONFLICT (name) DO NOTHING;

-- Insert menu items
INSERT INTO menu_items (name, description, price, category_id, spicy_level, vegetarian, featured, "order", active) VALUES
-- Entradas
('Nachos Supremos', 'Tortilla chips com queijo derretido, jalapeños, guacamole e sour cream', 1500.00, 1, 2, true, true, 1, true),
('Guacamole Fresco', 'Abacate fresco com limão, coentros e especiarias mexicanas', 800.00, 1, 0, true, false, 2, true),
('Jalapeño Poppers', 'Jalapeños recheados com queijo cream e panados', 1200.00, 1, 3, true, false, 3, true),

-- Tacos
('Taco de Carnitas', 'Porco desfiado com cebola, coentros e molho picante', 600.00, 2, 2, false, true, 1, true),
('Taco de Pollo', 'Frango grelhado com abacate e molho de lima', 550.00, 2, 1, false, false, 2, true),
('Taco Vegetariano', 'Feijão preto, queijo, alface e tomate', 500.00, 2, 0, true, false, 3, true),
('Taco de Peixe', 'Peixe grelhado com repolho e molho chipotle', 700.00, 2, 2, false, false, 4, true),

-- Quesadillas
('Quesadilla de Queijo', 'Tortilla com queijo derretido', 900.00, 3, 0, true, false, 1, true),
('Quesadilla de Frango', 'Frango desfiado com queijo e pimentos', 1200.00, 3, 1, false, true, 2, true),
('Quesadilla Vegetal', 'Legumes grelhados com queijo', 1100.00, 3, 0, true, false, 3, true),

-- Burritos
('Burrito Clásico', 'Carne, arroz, feijão, queijo e molhos', 1800.00, 4, 2, false, true, 1, true),
('Burrito de Frango', 'Frango, arroz, feijão preto e guacamole', 1700.00, 4, 1, false, false, 2, true),
('Burrito Vegetariano', 'Feijão, arroz, queijo, alface e tomate', 1500.00, 4, 0, true, false, 3, true),

-- Pratos Principais
('Fajitas de Carne', 'Tiras de carne com pimentos e cebolas, servidas com tortillas', 2500.00, 5, 2, false, true, 1, true),
('Enchiladas Verdes', 'Tortillas recheadas com frango e molho verde', 2200.00, 5, 2, false, false, 2, true),
('Chiles Rellenos', 'Pimentos recheados com queijo e carne', 2000.00, 5, 3, false, false, 3, true),

-- Sobremesas
('Churros', 'Massa frita polvilhada com açúcar e canela', 800.00, 6, 0, true, true, 1, true),
('Flan Mexicano', 'Pudim de caramelo tradicional mexicano', 700.00, 6, 0, true, false, 2, true),

-- Bebidas
('Margarita Clássica', 'Tequila, triple sec e sumo de lima', 1200.00, 7, 0, false, true, 1, true),
('Água Fresca', 'Bebida refrescante de frutas naturais', 400.00, 7, 0, true, false, 2, true),
('Cerveja Corona', 'Cerveja mexicana com lima', 500.00, 7, 0, false, false, 3, true)
ON CONFLICT (name) DO NOTHING;

-- Insert gallery images
INSERT INTO gallery_images (title, description, image_url, category, "order", featured, active) VALUES
('Tacos Variados', 'Uma seleção dos nossos tacos mais populares', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'food', 1, true, true),
('Interior do Restaurante', 'O ambiente acolhedor do Las Tortilhas', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'ambiance', 2, true, true),
('Guacamole Fresco', 'Guacamole preparado na hora com ingredientes frescos', 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=800', 'food', 3, false, true),
('Burrito Especial', 'Nosso burrito clássico com todos os acompanhamentos', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800', 'food', 4, true, true),
('Cocktails Mexicanos', 'Margaritas e outras bebidas tradicionais', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800', 'drinks', 5, false, true),
('Mesa Preparada', 'Mesa preparada para uma experiência gastronómica única', 'https://images.unsplash.com/photo-1559329007-40df8ece5674?w=800', 'ambiance', 6, false, true),
('Quesadillas Douradas', 'Quesadillas perfeitamente douradas e crocantes', 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800', 'food', 7, true, true),
('Chef Preparando', 'Nosso chef preparando pratos frescos', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800', 'kitchen', 8, false, true)
ON CONFLICT (title) DO NOTHING;

-- Create admin user (password: admin123)
INSERT INTO users (id, email, username, first_name, last_name, password, role) VALUES
('admin-las-tortilhas', 'admin@lastortilhas.com', 'admin', 'Admin', 'Las Tortilhas', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewXhN2r8HHqQM1Wi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create sample regular user (password: user123)
INSERT INTO users (id, email, username, first_name, last_name, password, role) VALUES
('user-sample', 'user@example.com', 'sampleuser', 'Sample', 'User', '$2b$12$VQiuuT4YV5YJVRzLKZdQ5.qU9oL3VlJnj5VcG4KYRjdFZGRVYoVjW', 'user')
ON CONFLICT (email) DO NOTHING;