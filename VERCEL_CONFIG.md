# Configuração Final do Vercel

## Variáveis de Ambiente para Configurar no Vercel

### DATABASE_URL
```
postgresql://postgres:Kenylson%4023@db.nuoblhgwtxyrafbyxjkw.supabase.co:5432/postgres
```

### SESSION_SECRET
```
ed154239e730ff0cad9b3072f9d3f8e74d5db5686dbe4966832e34b6392a62f7
```

### NODE_ENV
```
production
```

## Como Configurar no Vercel

1. Acesse seu projeto no Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione as 3 variáveis acima
4. Para cada uma, marque: **Production**, **Preview**, e **Development**

## Testar a Conexão

Para testar se a string funciona:
```bash
psql "postgresql://postgres:Kenylson%4023@db.nuoblhgwtxyrafbyxjkw.supabase.co:5432/postgres" -c "SELECT current_database();"
```

## Próximos Passos

1. ✅ DATABASE_URL obtida
2. Configure as 3 variáveis no Vercel  
3. Execute `npm run db:push` para criar tabelas
4. Execute o script SQL para popular dados
5. Deploy no Vercel