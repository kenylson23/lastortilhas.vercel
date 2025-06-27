# Las Tortilhas - Deploy no Railway

## Passos para Deploy no Railway

### 1. Preparar o Projeto
✓ Projeto já está configurado com:
- `railway.json` - Configuração do Railway
- `Procfile` - Comando de inicialização
- Porta dinâmica configurada (`process.env.PORT`)
- Conexão de banco de dados otimizada para Railway

### 2. Conectar ao Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Conecte seu repositório do GitHub

### 3. Configurar Banco de Dados

1. No dashboard do projeto Railway:
   - Clique em "New Service"
   - Selecione "Database" → "PostgreSQL"
   - Railway criará automaticamente as variáveis:
     - `DATABASE_URL`
     - `DATABASE_PRIVATE_URL`

### 4. Configurar Variáveis de Ambiente

No Railway, adicione estas variáveis se necessário:
```
NODE_ENV=production
```

### 5. Executar Migração do Banco

Após o deploy, execute a migração:
1. No Railway dashboard, vá para seu serviço
2. Clique na aba "Data"
3. Use o Query Editor ou conecte via CLI:

```bash
npm run db:push
```

### 6. Popular o Banco (Opcional)

Se quiser popular com dados de exemplo, execute as queries SQL do arquivo de setup.

## Comandos Úteis

```bash
# Build local
npm run build

# Testar produção localmente
npm run start

# Push schema para banco
npm run db:push
```

## Características do Deploy

- ✅ Auto-scaling
- ✅ HTTPS automático
- ✅ Logs em tempo real
- ✅ Rollback automático
- ✅ Banco PostgreSQL integrado
- ✅ Domínio personalizado disponível

## Estrutura de Arquivos

```
/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Schemas compartilhados
├── railway.json     # Config Railway
├── Procfile        # Comando start
└── dist/           # Build de produção
```

## Troubleshooting

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está ativo no Railway
- Confirme se `DATABASE_URL` está configurada
- Use `DATABASE_PRIVATE_URL` para melhor performance

### Erro de Build
- Verifique se todas as dependências estão no `package.json`
- Execute `npm run build` localmente primeiro

### Erro de Port
- Railway define a porta automaticamente via `process.env.PORT`
- Não hardcode a porta no código