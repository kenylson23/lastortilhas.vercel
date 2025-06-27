# Railway PostgreSQL - Tabelas Criadas ✅

## Status: Configuração Completa

Todas as tabelas foram criadas com sucesso no Railway PostgreSQL:

### Tabelas do Sistema
- ✅ `users` - Usuários e autenticação
- ✅ `sessions` - Sessões de usuário  
- ✅ `menu_categories` - Categorias do menu (7 criadas)
- ✅ `menu_items` - Itens do menu (21 criados)
- ✅ `reservations` - Sistema de reservas
- ✅ `contact_messages` - Mensagens de contato
- ✅ `gallery_images` - Galeria de fotos

### Dados Populados
- **7 categorias:** Entradas, Tacos, Quesadillas, Burritos, Pratos Principais, Sobremesas, Bebidas
- **21 itens de menu:** Pratos mexicanos autênticos com preços em Kwanza
- **1 usuário admin:** admin@lastortilhas.com / admin123

### Índices Criados
- `idx_menu_items_category` - Performance nas consultas de menu
- `idx_reservations_date` - Busca rápida por data
- `idx_reservations_user` - Reservas por usuário
- `idx_sessions_expire` - Limpeza de sessões
- `idx_users_email` - Login por email

## Para Deploy no Railway

### 1. Configuração Atual
```json
{
  "build": { "buildCommand": "npm install" },
  "deploy": { "startCommand": "NODE_ENV=production npm run dev" }
}
```

### 2. Banco Configurado
- DATABASE_URL configurada automaticamente
- Tabelas criadas e populadas
- Índices otimizados

### 3. Próximos Passos
1. Fazer commit das alterações
2. Push para repositório GitHub
3. Railway fará deploy automático
4. Site estará disponível em: `https://[projeto].railway.app`

## URLs do Projeto

Após deploy no Railway:
- **Site Principal:** `https://[seu-projeto].railway.app`
- **Painel Admin:** `https://[seu-projeto].railway.app/admin`

## Login Administrativo
- **Email:** admin@lastortilhas.com
- **Senha:** admin123

## Comandos Úteis
```bash
# Ver status do Railway
railway status

# Logs em tempo real
railway logs

# Executar comandos no Railway
railway run [comando]
```

## Menu Completo Disponível

### Entradas
- Guacamole Fresco (15,00 Kz)
- Nachos Supreme (18,00 Kz)
- Quesito Frito (12,00 Kz)

### Tacos
- Taco de Carnitas (8,00 Kz)
- Taco de Pollo (7,50 Kz)
- Taco Vegetariano (6,50 Kz)

### Quesadillas
- Quesadilla de Queijo (14,00 Kz)
- Quesadilla de Frango (16,00 Kz)
- Quesadilla Vegetariana (15,00 Kz)

### Burritos
- Burrito Carnitas (22,00 Kz)
- Burrito Vegetariano (19,00 Kz)
- Burrito de Frango (21,00 Kz)

### Pratos Principais
- Fajitas de Carne (28,00 Kz)
- Enchiladas Verdes (24,00 Kz)
- Chiles Rellenos (26,00 Kz)

### Sobremesas
- Churros com Doce de Leite (12,00 Kz)
- Flan Mexicano (10,00 Kz)
- Tres Leches (13,00 Kz)

### Bebidas
- Margarita Clássica (18,00 Kz)
- Água de Horchata (8,00 Kz)
- Cerveja Corona (6,00 Kz)

O Las Tortilhas está completamente configurado e pronto para deploy no Railway!