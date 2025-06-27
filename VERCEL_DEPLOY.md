# Deploy no Vercel - Las Tortilhas

## Instruções para Deploy

### 1. Preparação do Projeto
O projeto já está configurado para deploy no Vercel com:
- ✅ `vercel.json` configurado para API routes e frontend
- ✅ `api/index.ts` adaptado para o padrão Vercel
- ✅ `.env.example` com variáveis necessárias
- ✅ Build otimizado para produção

### 2. Configurar Database
Você precisará de um banco PostgreSQL. Recomendações:
- **Supabase** (gratuito): https://supabase.com
- **Neon** (gratuito): https://neon.tech
- **PlanetScale** (MySQL): https://planetscale.com

### 3. Variáveis de Ambiente no Vercel
Configure no dashboard do Vercel as seguintes variáveis:

```
DATABASE_URL=sua_url_do_banco_postgresql
SESSION_SECRET=sua_chave_secreta_super_forte
NODE_ENV=production
```

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
1. Execute as migrações do banco:
   ```bash
   vercel env pull .env.local
   npm run db:push
   ```

2. Acesse sua aplicação na URL fornecida pelo Vercel

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