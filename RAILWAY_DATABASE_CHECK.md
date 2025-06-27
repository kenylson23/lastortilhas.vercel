# Como Verificar Configuração do Banco no Railway

## 1. Verificar se o PostgreSQL Existe

### No Dashboard do Railway:
1. Acesse seu projeto no [railway.app](https://railway.app)
2. Você deve ver **dois serviços**:
   - 📦 **web** (sua aplicação)
   - 🗄️ **postgres** (banco de dados)

### Se não há serviço PostgreSQL:
1. Clique em **"New Service"**
2. Selecione **"Database"**
3. Escolha **"PostgreSQL"**
4. Railway criará o banco automaticamente

## 2. Verificar Variáveis de Ambiente

### No serviço da sua aplicação (web):
1. Clique no serviço **web**
2. Vá na aba **"Variables"**
3. Verifique se existem estas variáveis:
   - ✅ `DATABASE_URL`
   - ✅ `DATABASE_PRIVATE_URL` (opcional, mas recomendado)

### Se as variáveis não existem:
1. Vá no serviço **postgres**
2. Na aba **"Connect"**, copie a **Database URL**
3. Vá no serviço **web** → **"Variables"**
4. Adicione: `DATABASE_URL` = [URL copiada]

## 3. Testar Conexão com Banco

### Via Railway CLI (recomendado):
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar ao projeto
railway link

# Testar conexão
railway run npm run db:push
```

### Via Interface Web:
1. No serviço **postgres**
2. Clique em **"Query"**
3. Execute: `SELECT version();`
4. Se funcionar, o banco está OK

## 4. Verificar Logs de Deploy

### Para ver erros de deploy:
1. Vá no serviço **web**
2. Aba **"Logs"** ou **"Deployments"**
3. Procure por erros relacionados a:
   - `DATABASE_URL`
   - `Connection refused`
   - `Authentication failed`

## 5. Configurações Típicas de Problema

### Problema 1: Banco não está rodando
**Sintoma:** "Connection refused"
**Solução:** Reiniciar serviço postgres no Railway

### Problema 2: URL de conexão errada
**Sintoma:** "Authentication failed"
**Solução:** Copiar URL correta do serviço postgres

### Problema 3: Tabelas não existem
**Sintoma:** "Table doesn't exist"
**Solução:** Executar `railway run npm run db:push`

## 6. Checklist de Verificação

- [ ] Serviço PostgreSQL existe e está rodando
- [ ] Variável `DATABASE_URL` está configurada
- [ ] Conexão funciona via Query interface
- [ ] Schema foi aplicado (`db:push`)
- [ ] Logs não mostram erros de banco

## 7. Comandos Úteis

```bash
# Ver todos os serviços
railway status

# Ver variáveis
railway variables

# Ver logs em tempo real
railway logs

# Executar comando no Railway
railway run [comando]
```

## Próximos Passos

Depois de verificar o banco:
1. Se tudo estiver OK → Popular banco com dados iniciais
2. Se houver problemas → Usar este guia para resolver
3. Fazer novo deploy após correções