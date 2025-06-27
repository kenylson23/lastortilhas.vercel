# Como Obter a DATABASE_URL do Supabase

## Passo a Passo

### 1. Acesse seu projeto no Supabase
- Vá para https://supabase.com/dashboard
- Clique no seu projeto Las Tortilhas

### 2. Obter a Connection String
1. No menu lateral, clique em **Settings** (⚙️)
2. Clique em **Database**
3. Role para baixo até **Connection string**
4. Clique na aba **Nodejs**
5. Copie a string que aparece no formato:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```

### 3. Substituir a senha
- Na string copiada, substitua `[YOUR-PASSWORD]` pela senha que você definiu ao criar o projeto
- **Exemplo:** Se sua senha é `minhasenha123`, a string ficará:
  ```
  postgresql://postgres:minhasenha123@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
  ```

### 4. Testar a conexão
Execute este comando para testar se a URL está correta:
```bash
psql "postgresql://postgres:suasenha@db.projeto.supabase.co:5432/postgres" -c "SELECT version();"
```

## ⚠️ Importante
- **Nunca compartilhe** a string de conexão completa publicamente
- A parte `db.xxxxxxxxxxxxx` é única do seu projeto
- Guarde a senha em local seguro

## Próximos Passos
1. ✅ Obter DATABASE_URL (você está aqui)
2. Configure as variáveis no Vercel
3. Execute as migrações do banco
4. Faça o deploy