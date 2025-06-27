-- Script para popular banco Railway com dados do Las Tortilhas
-- Execute: railway run psql < populate-railway-db.sql

-- Inserir categorias do menu
INSERT INTO menu_categories (name, description) VALUES
('Entradas', 'Deliciosos aperitivos para começar sua experiência mexicana'),
('Tacos', 'Tacos autênticos mexicanos feitos com ingredientes frescos'),
('Quesadillas', 'Quesadillas douradas e crocantes com queijo derretido'),
('Pratos Principais', 'Pratos substanciosos e saborosos da culinária mexicana'),
('Fajitas', 'Fajitas sizzling servidas com vegetais frescos e tortillas'),
('Sobremesas', 'Doces tradicionais mexicanos para finalizar sua refeição'),
('Bebidas', 'Bebidas refrescantes e tradicionais mexicanas')
ON CONFLICT DO NOTHING;

-- Inserir itens do menu
INSERT INTO menu_items (category_id, name, description, price, spicy_level, vegetarian, featured, active) VALUES
-- Entradas (category_id = 1)
(1, 'Guacamole Tradicional', 'Guacamole fresco feito na hora com abacates maduros, cebola, tomate e coentro', 12.50, 1, true, true, true),
(1, 'Nachos Supremos', 'Nachos crocantes cobertos com queijo derretido, jalapeños, creme azedo e molho de tomate', 15.00, 2, true, false, true),
(1, 'Jalapeño Poppers', 'Jalapeños recheados com queijo cremoso, empanados e fritos até dourar', 13.50, 3, true, false, true),

-- Tacos (category_id = 2)
(2, 'Tacos de Carne Asada', 'Três tacos com carne grelhada, cebola, coentro e molho verde', 18.50, 2, false, true, true),
(2, 'Tacos de Pollo', 'Três tacos de frango temperado com especiarias mexicanas', 16.50, 1, false, false, true),
(2, 'Tacos de Pescado', 'Três tacos de peixe grelhado com molho de abacate e repolho roxo', 19.50, 1, false, true, true),
(2, 'Tacos Vegetarianos', 'Três tacos com feijão preto, milho, pimentos e queijo', 15.50, 1, true, false, true),

-- Quesadillas (category_id = 3)
(3, 'Quesadilla de Queijo', 'Quesadilla clássica com queijo monterrey jack derretido', 14.00, 0, true, false, true),
(3, 'Quesadilla de Frango', 'Quesadilla com frango grelhado, queijo e pimentos', 17.50, 1, false, true, true),
(3, 'Quesadilla de Espinafre', 'Quesadilla com espinafre fresco, queijo feta e tomate seco', 16.00, 0, true, false, true),

-- Pratos Principais (category_id = 4)
(4, 'Enchiladas Verdes', 'Enchiladas de frango cobertas com molho verde e queijo', 22.50, 2, false, true, true),
(4, 'Burrito Gigante', 'Burrito grande com carne, arroz, feijão, queijo e molhos', 24.00, 2, false, false, true),
(4, 'Chile Relleno', 'Pimentão poblano recheado com queijo, empanado e frito', 20.50, 3, true, false, true),

-- Fajitas (category_id = 5)
(5, 'Fajitas de Carne', 'Fajitas sizzling de carne com pimentos e cebolas', 26.50, 2, false, true, true),
(5, 'Fajitas de Frango', 'Fajitas de frango temperado com vegetais frescos', 24.50, 1, false, false, true),
(5, 'Fajitas Mistas', 'Combinação de carne e frango com vegetais', 28.50, 2, false, true, true),

-- Sobremesas (category_id = 6)
(6, 'Flan Mexicano', 'Pudim tradicional mexicano com calda de caramelo', 8.50, 0, true, true, true),
(6, 'Churros com Doce de Leite', 'Churros quentes polvilhados com açúcar e canela', 9.50, 0, true, false, true),

-- Bebidas (category_id = 7)
(7, 'Horchata', 'Bebida tradicional mexicana de arroz com canela', 6.50, 0, true, false, true),
(7, 'Agua Fresca de Limão', 'Água refrescante com limão fresco e hortelã', 5.50, 0, true, false, true),
(7, 'Margarita Clássica', 'Coquetel tradicional com tequila, triple sec e limão', 12.50, 0, true, true, true)
ON CONFLICT DO NOTHING;

-- Inserir imagens da galeria
INSERT INTO gallery_images (image_url, title, description, featured, active, category) VALUES
('https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'Tacos Mexicanos', 'Deliciosos tacos feitos com ingredientes frescos', true, true, 'food'),
('https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800', 'Interior do Restaurante', 'Ambiente acolhedor e autêntico mexicano', false, true, 'interior'),
('https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800', 'Guacamole Fresco', 'Guacamole preparado na hora com abacates maduros', true, true, 'food'),
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 'Fajitas Sizzling', 'Fajitas servidas na chapa quente com vegetais', false, true, 'food'),
('https://images.unsplash.com/photo-1599974579688-8dbdd335c777?w=800', 'Quesadillas Douradas', 'Quesadillas crocantes com queijo derretido', false, true, 'food'),
('https://images.unsplash.com/photo-1562059390-a761a084768e?w=800', 'Margaritas Refrescantes', 'Coquetéis tradicionais mexicanos', true, true, 'drinks'),
('https://images.unsplash.com/photo-1582169296194-866fb4b8847c?w=800', 'Churros com Doce', 'Sobremesa tradicional mexicana', false, true, 'food'),
('https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=800', 'Ambiente Festivo', 'Decoração colorida e alegre do Las Tortilhas', false, true, 'interior')
ON CONFLICT DO NOTHING;

-- Criar usuário admin
INSERT INTO users (id, email, first_name, last_name, role) VALUES
('admin-las-tortilhas', 'admin@lastortilhas.com', 'Admin', 'Las Tortilhas', 'admin')
ON CONFLICT DO NOTHING;