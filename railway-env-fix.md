# Como Corrigir Variáveis de Ambiente no Railway

## Problema Identificado:
O PostgreSQL está rodando, mas a aplicação não consegue acessar a `DATABASE_URL`.

## Solução:

### 1. Verificar e Configurar Variáveis Manualmente:

**No serviço da aplicação (rede):**
1. Clique no serviço **rede** (sua aplicação)
2. Vá na aba **"Variables"**
3. Adicione manualmente se não existir:

**No serviço PostgreSQL:**
1. Clique no serviço **Postgres**
2. Vá na aba **"Connect"**
3. Copie a **Database URL**

**Volte ao serviço da aplicação:**
1. Na aba "Variables", adicione:
   - Nome: `DATABASE_URL`
   - Valor: [a URL copiada do Postgres]

### 2. Formato da URL deve ser:
```
postgresql://username:password@host:port/database
```

### 3. Após adicionar a variável:
- Salve as configurações
- Faça novo deploy (Redeploy)

## Verificação:
A URL deve começar com `postgresql://` e conter todas as credenciais.