# Las Tortilhas - Guia de Deployment Universal

## 🚀 Plataformas Suportadas

O projeto Las Tortilhas agora possui **arquitetura flexível** que se adapta automaticamente a diferentes plataformas de deployment:

- ✅ **Replit** (configuração atual)
- ✅ **Railway**
- ✅ **Vercel**
- ✅ **Render**
- ✅ **Heroku**
- ✅ **Netlify**
- ✅ **Fly.io**

## 🔧 Configuração Automática

### Detecção Automática
O sistema detecta automaticamente:
- **Plataforma de deployment** (baseado em variáveis de ambiente)
- **Provedor de database** (Railway, Supabase, Vercel, Neon, etc.)
- **Configurações SSL/TLS** apropriadas
- **Pool de conexões** otimizado por plataforma

### Variables de Ambiente Flexíveis
O sistema busca databases na seguinte ordem de prioridade:
1. `DATABASE_PRIVATE_URL` (Railway privado)
2. `DATABASE_URL` (padrão universal)
3. `SUPABASE_DATABASE_URL` (Supabase)
4. `POSTGRES_URL` (Vercel)
5. `NEON_DATABASE_URL` (Neon)

## 📋 Como Deployar em Cada Plataforma

### 1. Railway
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login e deploy
railway login
railway init
railway add postgresql
railway deploy
```

**Variáveis necessárias:**
- `DATABASE_URL` (automático)
- `NODE_ENV=production`

### 2. Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Configuração no dashboard:**
- Adicionar Postgres database
- Configurar `POSTGRES_URL`

### 3. Render
```bash
# No dashboard do Render:
# 1. Connect GitHub repository
# 2. Add PostgreSQL database
# 3. Configure environment variables
```

**Variáveis necessárias:**
- `DATABASE_URL` (do Postgres addon)
- `NODE_ENV=production`

### 4. Heroku
```bash
# Instalar Heroku CLI
npm install -g heroku

# Deploy
heroku create las-tortilhas
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### 5. Fly.io
```bash
# Instalar Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch
fly deploy
```

## 🗄️ Configuração de Database

### Opções Suportadas:
- **Railway PostgreSQL** (recomendado para Railway)
- **Supabase** (global, boa performance)
- **Vercel Postgres** (integração perfeita com Vercel)
- **Neon** (serverless, escalável)
- **Render PostgreSQL** (simples, confiável)

### Migração de Database
```bash
# Push schema para qualquer database
npm run db:push

# Ou usando Drizzle diretamente
npx drizzle-kit push
```

## ⚙️ Configuração Avançada

### Variables Opcionais:
```env
# Server
PORT=5000
HOST=0.0.0.0
NODE_ENV=production

# Database Pool
DB_POOL_SIZE=10
DB_POOL_MIN=1
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=5000

# Features
ENABLE_LOGGING=true
```

### Build Scripts:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

## 🛠️ Troubleshooting

### Database Connection Issues
1. Verificar se `DATABASE_URL` está configurada
2. Testar conexão SSL/TLS
3. Verificar firewall/rede da plataforma

### Build Issues
1. Verificar Node.js version (20+)
2. Limpar cache: `rm -rf node_modules package-lock.json && npm install`
3. Testar build local: `npm run build`

### Performance Issues
1. Ajustar `DB_POOL_SIZE` conforme tráfego
2. Habilitar caching se disponível
3. Usar CDN para assets estáticos

## 📊 Monitoramento

O sistema inclui logs estruturados que mostram:
- Plataforma detectada
- Provedor de database
- Performance de queries
- Erros e warnings

## 🔐 Segurança

### Features Automáticas:
- SSL/TLS automático em produção
- Headers de segurança (CORS, CSP)
- Validação de input com Zod
- Rate limiting (configurável)

---

**Nota:** Este guia cobre deployment universal. Para deployment específico no Replit (atual), nenhuma configuração adicional é necessária.