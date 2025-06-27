# Las Tortilhas - Guia Completo de Implantação 2025

## 🚀 Arquivos de Implantação Recriados

Todos os arquivos de implantação foram completamente recriados incluindo functions e build otimizado para máxima compatibilidade com Vercel.

### 📁 Estrutura de Arquivos de Implantação

```
Las Tortilhas/
├── vercel.json              # Configuração principal Vercel v2
├── api/
│   ├── index.mjs           # Serverless function ES modules
│   └── package.json        # Dependências da API
├── scripts/
│   └── build-vercel-complete.js  # Build completo otimizado
├── .vercelignore           # Arquivos excluídos do deploy
├── next.config.js          # Headers de segurança e CORS
└── DEPLOYMENT_COMPLETE_2025.md  # Esta documentação
```

## ⚙️ Configurações Principais

### 1. Vercel.json - Configuração Principal

```json
{
  "version": 2,
  "name": "las-tortilhas",
  "framework": null,
  "buildCommand": "node scripts/build-vercel-complete.js",
  "outputDirectory": "dist/client",
  "installCommand": "npm ci --production=false",
  
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs20.x",
      "memory": 1024,
      "maxDuration": 30,
      "environment": {
        "NODE_ENV": "production"
      }
    }
  },
  
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1",
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    },
    {
      "src": "/(.*\\.(css|js|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot))",
      "dest": "/$1",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. API Serverless Function (api/index.mjs)

**Características:**
- ✅ ES Modules (Node.js 20.x)
- ✅ Autenticação JWT completa
- ✅ Conexão PostgreSQL otimizada
- ✅ CORS configurado
- ✅ Bcrypt para senhas
- ✅ Endpoints completos da API

**Endpoints disponíveis:**
- `POST /api/auth/login` - Login com JWT
- `POST /api/auth/register` - Registro de usuários
- `GET /api/auth/user` - Verificação de usuário
- `GET /api/menu/categories` - Categorias do menu
- `GET /api/menu/items` - Itens do menu
- `GET /api/gallery` - Galeria de imagens
- `POST /api/reservations` - Criar reservas
- `POST /api/contact` - Mensagens de contato
- `GET /api/health` - Health check

### 3. Build Script Completo (scripts/build-vercel-complete.js)

**Processo de build:**
1. Limpa builds anteriores
2. Compila frontend com Vite
3. Copia arquivos estáticos
4. Cria .vercelignore otimizado
5. Configura variáveis de ambiente
6. Verifica integridade dos arquivos
7. Gera relatório de tamanhos

**Otimizações incluídas:**
- ✅ Frontend minificado
- ✅ Tree-shaking automático
- ✅ Compressão de assets
- ✅ Cache headers otimizados
- ✅ Exclusão de arquivos desnecessários

## 🔧 Configuração de Variáveis de Ambiente

### Variáveis Obrigatórias no Vercel:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your-secure-jwt-secret-key
SESSION_SECRET=your-secure-session-secret

# Optional: WhatsApp Integration
WHATSAPP_TOKEN=your-whatsapp-business-token
```

### Como Configurar no Vercel:

1. **Via Dashboard:**
   - Acesse projeto no Vercel
   - Settings → Environment Variables
   - Adicione cada variável

2. **Via CLI:**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add JWT_SECRET production
   vercel env add SESSION_SECRET production
   ```

## 🚀 Processo de Deploy

### 1. Deploy Automático (Recomendado)

```bash
# 1. Conectar repositório ao Vercel
vercel --prod

# 2. Configurar variáveis de ambiente no dashboard
# 3. Push para main branch ativa deploy automático
git push origin main
```

### 2. Deploy Manual

```bash
# 1. Build local
node scripts/build-vercel-complete.js

# 2. Deploy para Vercel
vercel --prod --prebuilt

# 3. Verificar funcionamento
curl https://las-tortilhas.vercel.app/api/health
```

### 3. Deploy com Preview

```bash
# Deploy de preview (não produção)
vercel

# Promover preview para produção
vercel --prod
```

## 🔍 Verificação de Deploy

### Health Check
```bash
curl https://las-tortilhas.vercel.app/api/health
```

**Resposta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-27T10:00:00.000Z",
  "service": "Las Tortilhas API",
  "version": "2.0.0"
}
```

### Teste de Endpoints

```bash
# Menu
curl https://las-tortilhas.vercel.app/api/menu/categories

# Galeria
curl https://las-tortilhas.vercel.app/api/gallery

# Login
curl -X POST https://las-tortilhas.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lastortilhas.com","password":"admin123"}'
```

## 🛡️ Segurança e Performance

### Headers de Segurança Configurados:
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Access-Control-Allow-Origin: *`
- ✅ `Cache-Control` otimizado para assets

### Otimizações de Performance:
- ✅ Conexão PostgreSQL com pooling
- ✅ Functions com 1GB RAM / 30s timeout
- ✅ Assets com cache de 1 ano
- ✅ Compressão automática
- ✅ Minificação de código

## 🐛 Troubleshooting

### Erro: "Function timeout"
```bash
# Verificar configuração de timeout
# vercel.json → functions → maxDuration: 30
```

### Erro: "Database connection failed"
```bash
# Verificar variável DATABASE_URL
vercel env ls
```

### Erro: "CORS blocked"
```bash
# Verificar headers CORS em vercel.json e next.config.js
```

### Build falhou
```bash
# Executar build local para debug
node scripts/build-vercel-complete.js
```

## 📊 Monitoramento

### Logs de Função
```bash
# Ver logs em tempo real
vercel logs

# Logs de função específica
vercel logs --function=api
```

### Métricas
- Dashboard Vercel mostra:
  - Tempo de resposta
  - Taxa de erro
  - Uso de memória
  - Invocações por minuto

## 🎯 Próximos Passos

1. **Configure domínio personalizado** (opcional):
   ```bash
   vercel domains add lastortilhas.com
   ```

2. **Configure SSL** (automático com Vercel)

3. **Configure CI/CD** com GitHub Actions (opcional)

4. **Monitore performance** via Vercel Analytics

5. **Configure backup** do banco de dados

## ✅ Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Build executado com sucesso
- [ ] Health check respondendo
- [ ] Endpoints da API funcionando
- [ ] Frontend carregando corretamente
- [ ] Autenticação JWT funcionando
- [ ] Banco de dados conectado
- [ ] CORS configurado corretamente
- [ ] Headers de segurança ativos
- [ ] Cache de assets funcionando

**Las Tortilhas está pronto para produção com implantação completa e otimizada!**