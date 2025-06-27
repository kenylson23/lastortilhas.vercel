# Deploy no Vercel - Las Tortilhas

## Instruções Completas para Deploy (2025)

### 1. Preparação do Projeto ✅
O projeto está completamente otimizado para deploy no Vercel com:
- ✅ **Zero Config Deployment**: Vercel detecta automaticamente o runtime adequado
- ✅ **API JavaScript nativa**: Sem dependências complexas que causam erros de runtime
- ✅ **CORS configurado**: Headers adequados para produção
- ✅ **Connection pooling otimizado**: Configuração para ambiente serverless
- ✅ **Error handling robusto**: Tratamento de erros completo
- ✅ **Documentação atualizada**: Instruções para deploy 2025

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

### 3. Configuração Otimizada no Dashboard Vercel

#### 3.1. Build Settings (Settings > General):
```bash
Framework Preset: Other
Build Command: npm run build
Output Directory: dist/public
Install Command: npm install --production=false
Node.js Version: 18.x
Root Directory: ./
```

#### 3.2. Environment Variables (Settings > Environment Variables):
```bash
# Database (Obrigatório)
DATABASE_URL=postgresql://postgres:[SUA-SENHA]@db.[PROJECT-REF].supabase.co:5432/postgres

# Segurança (Obrigatório)
SESSION_SECRET=sua-chave-secreta-com-32-caracteres-minimo

# Ambiente (Obrigatório)
NODE_ENV=production

# Performance (Opcional)
VERCEL_REGION=iad1
```

#### 3.3. Como Configurar:
1. **Build Settings**: Settings > General > Build & Development Settings
   - Framework Preset: **Other**
   - Build Command: **npm run build**  
   - Output Directory: **dist/public**
   - Install Command: **npm install**

2. **Environment Variables**: Settings > Environment Variables
   - Adicione as 3 variáveis acima
   - Marque: **Production**, **Preview**, **Development**
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

### 7. Troubleshooting Completo

#### 7.1. Problemas de Build
```bash
# Erro: "Cannot find module 'cors'"
Solução: Instalar dependências -> npm install cors @types/cors

# Erro: "Build failed with exit code 1"
Solução: Verificar logs de build e variáveis de ambiente

# Erro: "Output directory not found"
Solução: Confirmar Output Directory = dist/public
```

#### 7.2. Problemas de Database
```bash
# Erro: "Database URL must be set"
Solução: Configurar DATABASE_URL nas Environment Variables

# Erro: "Connection timeout"
Solução: Verificar credenciais Supabase e conexão SSL

# Erro: "Table doesn't exist"
Solução: Executar migrações -> npm run db:push
```

#### 7.3. Problemas de API
```bash
# Erro: "401 Unauthorized"
Solução: Verificar SESSION_SECRET configurado

# Erro: "CORS policy error"
Solução: Verificar domínio nas configurações CORS

# Erro: "500 Internal Server Error"
Solução: Verificar logs de função no Vercel Dashboard
```

#### 7.4. Performance Issues
```bash
# Problema: "Function timeout"
Solução: Otimizar queries database e connection pooling

# Problema: "Cold start latency"
Solução: Usar Vercel Pro para reduzir cold starts

# Problema: "Memory limit exceeded"
Solução: Otimizar imports e reduzir bundle size
```

### Estrutura do Deploy
```
Vercel
├── Frontend (estático) → dist/client/
└── API Routes → api/index.ts → server/routes.ts
```