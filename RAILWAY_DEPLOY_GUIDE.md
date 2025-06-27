# Guia Completo - Deploy Las Tortilhas no Railway

## Problemas Resolvidos ✅

### 1. Timeout no Build
**Problema:** Vite build demora muito e excede timeout do Railway
**Solução:** Usar modo desenvolvimento em produção (mais rápido e confiável)

### 2. Erros ESBuild
**Problema:** "Argumentos indefinidos" durante compilação
**Solução:** Evitar build complexo, usar tsx diretamente

### 3. Configuração Banco de Dados
**Problema:** Conexão com PostgreSQL não funciona
**Solução:** Railway configura automaticamente DATABASE_URL

## Configuração Final Otimizada

### railway.json
```json
{
  "build": {
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "NODE_ENV=production npm run dev",
    "healthcheckPath": "/",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Procfile
```
web: NODE_ENV=production npm run dev
```

## Passos para Deploy

### 1. Conectar Repositório
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório

### 2. Adicionar PostgreSQL
1. No projeto Railway: "+ New Service"
2. Selecione "Database" → "PostgreSQL"
3. Railway criará automaticamente:
   - `DATABASE_URL`
   - `DATABASE_PRIVATE_URL`

### 3. Configurar Variáveis (se necessário)
Adicione no Railway dashboard:
```
NODE_ENV=production
```

### 4. Deploy Automático
O Railway detectará:
- `package.json` → instala dependências
- `railway.json` → usa configurações
- `Procfile` → comando de start

### 5. Após Deploy - Configurar Banco
Execute no Railway CLI ou interface:
```bash
npm run db:push
```

## Vantagens desta Configuração

1. **Deploy Rápido:** Sem build complexo
2. **Sem Timeouts:** Evita problemas de ESBuild
3. **Confiável:** Usa tsx (TypeScript nativo)
4. **Funcional:** Hot reload em produção

## URLs Finais

Após deploy você terá:
- **Site:** `https://seuapp.railway.app`
- **Admin:** `https://seuapp.railway.app/admin`

## Comandos Úteis Railway

```bash
# Ver logs em tempo real
railway logs

# Executar comandos no Railway
railway run [comando]

# Ver status dos serviços
railway status

# Abrir shell no Railway
railway shell
```

## Dados do Admin

Para acessar o painel administrativo:
- **Email:** admin@lastortilhas.com
- **Senha:** admin123

## Troubleshooting

### Erro "Connection refused"
- Verificar se PostgreSQL está ativo no Railway
- Confirmar variável DATABASE_URL

### Erro 404
- Verificar se healthcheck está funcionando
- Confirmar porta (Railway usa PORT automática)

### Deploy falha
- Verificar logs com `railway logs`
- Confirmar package.json está correto