# Deploy Las Tortilhas no Railway 🚂

## Arquivos Criados para Railway

✅ `railway.json` - Configuração do Railway
✅ `Procfile` - Comando de inicialização  
✅ `.env.example` - Exemplo de variáveis
✅ Porta dinâmica configurada no código
✅ Conexão de banco otimizada

## Como Fazer o Deploy

### 1. Conectar Repositório
1. Vá para [railway.app](https://railway.app)
2. Faça login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Conecte este repositório

### 2. Adicionar Banco de Dados
1. No projeto Railway: "New Service"
2. Selecione "Database" → "PostgreSQL"
3. Railway criará automaticamente `DATABASE_URL`

### 3. Deploy Automático
- Railway detectará automaticamente:
  - `package.json` (instala dependências)
  - `railway.json` (configurações)
  - `Procfile` (comando start)

### 4. Após Deploy
Execute no terminal Railway ou localmente:
```bash
npm run db:push
```

## Variáveis Automáticas do Railway

O Railway configurará automaticamente:
- `PORT` - Porta do servidor
- `DATABASE_URL` - URL do PostgreSQL
- `DATABASE_PRIVATE_URL` - Conexão privada (mais rápida)

## URLs do Projeto

Depois do deploy você terá:
- **App**: `https://seuapp.railway.app`
- **Admin**: `https://seuapp.railway.app/admin`

## Comandos Úteis

```bash
# Ver logs
railway logs

# Abrir shell
railway shell

# Fazer deploy manual
railway up
```

Pronto! Seu restaurante mexicano estará online no Railway! 🌮