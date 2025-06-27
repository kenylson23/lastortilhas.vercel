# Guia Visual - PostgreSQL no Railway

## Passo 1: Acessar Railway Dashboard

1. Abra [railway.app](https://railway.app) no navegador
2. Faça login com GitHub
3. Você verá a tela principal com seus projetos

## Passo 2: Criar ou Acessar Projeto

### Se não tem projeto ainda:
```
[New Project] → [Deploy from GitHub repo] → [Selecionar repositório]
```

### Se já tem projeto:
```
[Clicar no projeto existente]
```

## Passo 3: Adicionar PostgreSQL

No dashboard do projeto, você verá:
```
┌─────────────────────────────────────┐
│  Las Tortilhas Project              │
├─────────────────────────────────────┤
│  [+ New Service]  [Settings]       │
│                                     │
│  Services:                          │
│  ┌─────────────┐                   │
│  │ web service │                   │
│  └─────────────┘                   │
└─────────────────────────────────────┘
```

1. Clique em **[+ New Service]**
2. Selecione **[Database]**
3. Escolha **[PostgreSQL]**

## Passo 4: Aguardar Criação

O Railway mostrará:
```
Creating PostgreSQL service...
Setting up database...
Generating credentials...
✓ PostgreSQL ready
```

## Passo 5: Verificar Variáveis

Após criação, clique no serviço PostgreSQL:
```
┌─────────────────────────────────────┐
│  PostgreSQL Service                 │
├─────────────────────────────────────┤
│  [Connect] [Variables] [Settings]   │
│                                     │
│  Variables:                         │
│  DATABASE_URL         = postgres... │
│  DATABASE_PRIVATE_URL = postgres... │
│  POSTGRES_HOST        = ...         │
│  POSTGRES_PORT        = 5432        │
│  POSTGRES_USER        = postgres    │
│  POSTGRES_PASSWORD    = ...         │
│  POSTGRES_DB          = railway     │
└─────────────────────────────────────┘
```

## Passo 6: Deploy da Aplicação

Se ainda não fez deploy da aplicação:
1. Volte ao dashboard principal
2. Clique **[+ New Service]**
3. Selecione **[GitHub Repo]**
4. Conecte seu repositório Las Tortilhas

O Railway detectará automaticamente:
- `package.json` (dependências)
- `railway.json` (configuração)
- `Procfile` (comando start)

## Passo 7: Configurar Schema do Banco

### Opção A: Via Interface Query
1. Clique no serviço PostgreSQL
2. Vá para aba **[Query]**
3. Execute: `npm run db:push` (se disponível)
4. Ou execute as queries SQL manualmente

### Opção B: Via Railway CLI
```bash
# Instalar CLI (se não tiver)
npm install -g @railway/cli

# Login
railway login

# Linkar projeto
railway link

# Executar migração
railway run npm run db:push
```

## Passo 8: Verificar Deploy

Após deploy, você verá:
```
┌─────────────────────────────────────┐
│  Project Dashboard                  │
├─────────────────────────────────────┤
│  Services:                          │
│  ┌─────────────┐ ┌─────────────┐   │
│  │ PostgreSQL  │ │ web service │   │
│  │ ● Running   │ │ ● Running   │   │
│  └─────────────┘ └─────────────┘   │
│                                     │
│  🌐 https://[projeto].railway.app   │
└─────────────────────────────────────┘
```

## URLs do Projeto

Após configuração completa:
- **Site Principal:** `https://[seu-projeto].railway.app`
- **Painel Admin:** `https://[seu-projeto].railway.app/admin`

## Login Administrativo

Para acessar recursos de administração:
- **Email:** admin@lastortilhas.com
- **Senha:** admin123

## Comandos Úteis Pós-Deploy

```bash
# Ver logs em tempo real
railway logs

# Status dos serviços
railway status

# Abrir shell no Railway
railway shell

# Executar comandos específicos
railway run [comando]
```

## Solução de Problemas Comuns

### ❌ Build falha
**Sintomas:** Deploy trava ou falha
**Solução:** Verificar logs com `railway logs`

### ❌ Banco não conecta
**Sintomas:** "Connection refused"
**Solução:** 
1. Verificar se PostgreSQL está "Running"
2. Confirmar DATABASE_URL nas variáveis

### ❌ Site não carrega
**Sintomas:** 404 ou timeout
**Solução:**
1. Verificar healthcheck path
2. Confirmar porta está correta (Railway usa PORT automático)