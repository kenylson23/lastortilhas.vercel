# Deploy no Vercel - Las Tortilhas

## Instruções para Deploy

### 1. Preparação do Projeto
O projeto já está configurado para deploy no Vercel com:
- ✅ `vercel.json` configurado para API routes e frontend
- ✅ `api/index.ts` adaptado para o padrão Vercel
- ✅ `.env.example` com variáveis necessárias
- ✅ Build otimizado para produção
- ✅ Configuração específica para Supabase

### 2. Configurar Supabase (Banco PostgreSQL)

#### 2.1. Criar Projeto no Supabase
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub
4. Clique em "New Project"
5. Escolha organização e preencha:
   - **Name**: las-tortilhas
   - **Database Password**: (anote essa senha!)
   - **Region**: escolha o mais próximo (ex: South America)
6. Clique em "Create new project"

#### 2.2. Obter String de Conexão
1. No dashboard do Supabase, vá em **Settings** > **Database**
2. Role até **Connection string** > **Nodejs**
3. Copie a string que aparece assim:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
4. Substitua `[YOUR-PASSWORD]` pela senha que você criou

### 3. Variáveis de Ambiente no Vercel
Configure no dashboard do Vercel as seguintes variáveis:

```
DATABASE_URL=postgresql://postgres:[SUA-SENHA]@db.[PROJECT-REF].supabase.co:5432/postgres
SESSION_SECRET=minimo-32-caracteres-aleatorios-super-seguros
NODE_ENV=production
```

#### 3.1. Como Configurar no Vercel:
1. No dashboard do Vercel, vá no seu projeto
2. Clique em **Settings** > **Environment Variables**
3. Adicione uma por uma:
   - **DATABASE_URL**: Cole a string de conexão do Supabase
   - **SESSION_SECRET**: Gere uma chave aleatória de 32+ caracteres
   - **NODE_ENV**: Digite `production`
4. Para todas, selecione **Production**, **Preview**, e **Development**

### 4. Deploy no Vercel

#### Opção 1: Via GitHub (Recomendado)
1. Faça push do código para um repositório GitHub
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático será feito

#### Opção 2: Via CLI do Vercel
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 5. Após o Deploy

#### 5.1. Configurar Tabelas no Supabase
1. Clone o repositório localmente
2. Configure as variáveis de ambiente:
   ```bash
   # Crie arquivo .env.local
   echo "DATABASE_URL=sua_string_do_supabase" > .env.local
   ```
3. Execute as migrações e popule os dados:
   ```bash
   npm install
   npm run db:push
   psql "$DATABASE_URL" -f scripts/simple-populate.sql
   ```

#### Alternativa: Executar SQL no Supabase Dashboard
Se preferir, pode copiar e colar o conteúdo de `scripts/simple-populate.sql` 
no **SQL Editor** do dashboard do Supabase.

#### 5.1.1. Dados Iniciais Criados
O script `populate-supabase.ts` irá criar:
- **1 usuário admin**: admin@lastortilhas.com / admin123
- **7 categorias de menu**: Entradas, Tacos, Quesadillas, etc.  
- **18 itens de menu**: Pratos mexicanos autênticos com preços
- **8 imagens da galeria**: Fotos do restaurante e pratos

#### 5.2. Verificar no Supabase
1. No dashboard do Supabase, vá em **Table Editor**
2. Você deve ver as tabelas criadas:
   - `users` (usuários)
   - `sessions` (sessões)
   - `menu_categories` (categorias do menu)
   - `menu_items` (itens do menu)
   - `reservations` (reservas)
   - `contact_messages` (mensagens de contato)
   - `gallery_images` (imagens da galeria)

#### 5.3. Testar a Aplicação
1. Acesse sua aplicação na URL fornecida pelo Vercel
2. Teste o login/cadastro
3. Verifique se o menu carrega
4. Teste fazer uma reserva

### 6. Configurações Importantes
- O frontend é servido estaticamente
- APIs ficam em `/api/*`
- Sessões são persistidas no PostgreSQL
- SSL é automático no Vercel

### 7. Troubleshooting
- **Erro de conexão**: Verifique se DATABASE_URL está correta
- **Sessões não funcionam**: Configure SESSION_SECRET
- **404 nas APIs**: Verifique se as rotas estão em `/api/*`

### Estrutura do Deploy
```
Vercel
├── Frontend (estático) → dist/client/
└── API Routes → api/index.ts → server/routes.ts
```