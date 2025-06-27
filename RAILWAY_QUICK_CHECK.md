# ✅ Checklist Rápido - Banco Railway

## Passo 1: Verificar Serviços no Dashboard
```
No railway.app/seu-projeto:
- [ ] Existe serviço "postgres" ou "postgresql"?
- [ ] Existe serviço "web" ou sua aplicação?
- [ ] Status dos dois serviços é "Healthy" (verde)?
```

## Passo 2: Verificar Variáveis do Serviço Web
```
Clique no serviço web → aba "Variables":
- [ ] DATABASE_URL = postgresql://user:pass@host:5432/db
- [ ] PORT = (não precisa definir, Railway define automaticamente)
```

## Passo 3: Testar Banco PostgreSQL
```
Clique no serviço postgres → aba "Query":
Execute: SELECT version();
- [ ] Retorna versão do PostgreSQL?
```

## Passo 4: Verificar Logs de Deploy
```
Serviço web → aba "Deployments" → último deploy:
- [ ] Build foi bem-sucedido?
- [ ] Não há erros de "DATABASE_URL"?
- [ ] Não há erros de conexão?
```

## Passo 5: Aplicar Schema (Se necessário)
```
Se tabelas não existem, execute:
railway run npm run db:push
- [ ] Comando executou sem erro?
- [ ] Tabelas foram criadas?
```

---

## ❌ Problemas Comuns

**Erro: "Connection refused"**
→ Serviço postgres não está rodando

**Erro: "DATABASE_URL not defined"**
→ Variável não foi configurada no serviço web

**Erro: "Table doesn't exist"**
→ Executar `railway run npm run db:push`

**Deploy sempre falha**
→ Verificar logs detalhados na aba "Deployments"

---

## 🔧 Comandos Essenciais
```bash
# Instalar CLI
npm install -g @railway/cli

# Login e conectar
railway login
railway link

# Verificar status
railway status

# Ver logs
railway logs

# Aplicar schema
railway run npm run db:push
```