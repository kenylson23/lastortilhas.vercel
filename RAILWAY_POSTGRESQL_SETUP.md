# PostgreSQL no Railway - Guia Passo a Passo

## 1. Acessar o Dashboard do Railway

1. Vá para [railway.app](https://railway.app)
2. Faça login com sua conta GitHub
3. Selecione seu projeto Las Tortilhas (ou crie um novo)

## 2. Adicionar Serviço PostgreSQL

### Opção A: Projeto Novo
1. Clique em "New Project"
2. Selecione "Provision PostgreSQL"
3. Escolha "Deploy from GitHub repo"
4. Conecte seu repositório

### Opção B: Projeto Existente
1. No dashboard do seu projeto
2. Clique no botão "+ New Service" (canto superior direito)
3. Selecione "Database"
4. Escolha "PostgreSQL"

## 3. Configuração Automática

O Railway criará automaticamente:
- **DATABASE_URL** - URL de conexão pública
- **DATABASE_PRIVATE_URL** - URL de conexão privada (mais rápida)
- **POSTGRES_HOST** - Host do banco
- **POSTGRES_PORT** - Porta (padrão: 5432)
- **POSTGRES_USER** - Usuário
- **POSTGRES_PASSWORD** - Senha
- **POSTGRES_DB** - Nome do banco

## 4. Verificar Variáveis

No dashboard do Railway:
1. Clique no serviço PostgreSQL
2. Vá para aba "Variables"
3. Confirme que todas as variáveis estão presentes

## 5. Configurar Aplicação

Seu projeto Las Tortilhas já está preparado para usar:
```javascript
// server/db.ts - já configurado
const databaseUrl = 
  process.env.DATABASE_PRIVATE_URL || // Railway privado (mais rápido)
  process.env.DATABASE_URL; // Railway público ou outros
```

## 6. Deploy da Aplicação

1. No dashboard principal do projeto
2. Clique "+ New Service"
3. Selecione "GitHub Repo"
4. Conecte seu repositório
5. Railway detectará automaticamente:
   - `package.json`
   - `railway.json`
   - `Procfile`

## 7. Após Deploy - Criar Tabelas

Execute no Railway CLI ou interface web:
```bash
npm run db:push
```

Ou use a interface Query do Railway:
1. Clique no serviço PostgreSQL
2. Aba "Query"
3. Execute as queries de criação de tabelas

## 8. Popular Banco (Opcional)

Para adicionar dados iniciais:
1. Use a interface Query do Railway
2. Execute as queries de inserção de menu/galeria
3. Ou conecte via CLI e execute script de populate

## URLs Finais

Após setup completo:
- **Site:** `https://[seu-projeto].railway.app`
- **Admin:** `https://[seu-projeto].railway.app/admin`
- **Login Admin:** admin@lastortilhas.com / admin123

## Comandos Úteis

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login no Railway
railway login

# Conectar projeto local ao Railway
railway link

# Ver status dos serviços
railway status

# Ver logs em tempo real
railway logs

# Executar comandos no Railway
railway run [comando]

# Abrir shell no Railway
railway shell
```

## Troubleshooting PostgreSQL

### Erro: "Connection refused"
- Verificar se serviço PostgreSQL está "Active"
- Reiniciar serviço se necessário

### Erro: "Authentication failed"
- Verificar se DATABASE_URL está correta
- Copiar URL diretamente do dashboard

### Tabelas não existem
- Executar `railway run npm run db:push`
- Ou usar interface Query para criar manualmente

### Performance lenta
- Usar DATABASE_PRIVATE_URL em vez de DATABASE_URL
- Verificar região do banco (mesmo que aplicação)