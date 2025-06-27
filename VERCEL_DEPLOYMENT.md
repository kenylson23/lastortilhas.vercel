# Las Tortilhas - Deployment no Vercel

## 🚀 Configuração Completa para Vercel

### 1. Preparação dos Arquivos

✅ **Arquivos criados para Vercel:**
- `vercel.json` - Configuração principal do Vercel
- `api/` - Funções serverless para backend
- `client/src/lib/apiConfig.ts` - Configuração de comunicação frontend-backend

### 2. Estrutura da API Serverless

```
api/
├── index.ts              # API status
├── auth/
│   └── user.ts          # Autenticação
├── menu/
│   ├── categories.ts    # Categorias do menu
│   └── items.ts         # Itens do menu
├── reservations/
│   └── index.ts         # Sistema de reservas
├── gallery/
│   └── index.ts         # Galeria de imagens
└── _lib/
    └── db.ts           # Configuração de database otimizada
```

### 3. Database Configuration

**Vercel Postgres (Recomendado):**
1. No dashboard do Vercel, vá em Storage → Create Database
2. Escolha Postgres
3. A variável `POSTGRES_URL` será configurada automaticamente

**Supabase (Alternativa):**
1. Configure `SUPABASE_DATABASE_URL` nas environment variables
2. O sistema detectará automaticamente

### 4. Environment Variables no Vercel

Configure no dashboard do Vercel (Settings → Environment Variables):

```env
# Database (escolha uma opção)
POSTGRES_URL=postgresql://...     # Vercel Postgres
# ou
SUPABASE_DATABASE_URL=postgresql://...  # Supabase

# Opcionais
NODE_ENV=production
DB_POOL_SIZE=1
```

### 5. Deploy Commands

**Via CLI:**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Via GitHub:**
1. Conecte repositório GitHub ao Vercel
2. Deploy automático a cada push

### 6. Configuração de Build

O `vercel.json` está configurado para:
- ✅ Frontend: Vite build automático
- ✅ Backend: Funções serverless Node.js 20
- ✅ CORS habilitado
- ✅ Rewrites para SPA
- ✅ API routes otimizadas

### 7. Comunicação Frontend-Backend

O frontend detecta automaticamente o ambiente:
- **Desenvolvimento:** `http://localhost:5000/api`
- **Vercel:** `https://your-app.vercel.app/api`

### 8. Features Suportadas

✅ **Autenticação** - Endpoint `/api/auth/user`
✅ **Menu completo** - Endpoints `/api/menu/categories` e `/api/menu/items`
✅ **Reservas** - Endpoint `/api/reservations`
✅ **Galeria** - Endpoint `/api/gallery`
✅ **CORS configurado** - Headers automáticos
✅ **SSL/TLS** - Automático no Vercel

### 9. Testing Local com Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Simular ambiente Vercel localmente
vercel dev
```

### 10. Migração de Database

Após deploy inicial:
```bash
# Push schema para database
npm run db:push
```

### 11. Monitoring e Logs

- Dashboard do Vercel mostra logs das funções
- Métricas de performance automáticas
- Error tracking integrado

---

## 🔧 Troubleshooting

### Database Connection Issues
- Verificar `POSTGRES_URL` nas environment variables
- Testar conexão: settings → functions → logs

### API Response Issues
- Verificar CORS headers
- Testar endpoints diretamente: `https://your-app.vercel.app/api/`

### Build Issues
- Verificar Node.js version (20+)
- Conferir dependências no `package.json`

---

**Status:** ✅ Projeto totalmente preparado para deployment no Vercel com comunicação frontend-backend funcional.