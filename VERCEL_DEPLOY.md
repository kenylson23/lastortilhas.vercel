# Deploy Las Tortilhas no Vercel

## Pré-requisitos
- Conta no Vercel
- Repositório GitHub com o código do Las Tortilhas
- Base de dados PostgreSQL (recomendado: Neon, Supabase, ou similar)

## Configuração das Variáveis de Ambiente

No painel do Vercel, configure as seguintes variáveis:

```
DATABASE_URL=postgresql://usuario:senha@host:porta/database?sslmode=require
JWT_SECRET=sua-chave-secreta-jwt-super-segura
NODE_ENV=production
```

## Passos para Deploy

### 1. Conectar Repositório
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Conecte seu repositório GitHub
4. Selecione o projeto Las Tortilhas

### 2. Configurar Build
O projeto já está configurado com:
- **Build Command**: `npm run build:vercel`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Configurar Variáveis de Ambiente
1. Na aba "Environment Variables"
2. Adicione todas as variáveis listadas acima
3. Certifique-se de marcar "Production", "Preview" e "Development"

### 4. Deploy
1. Clique em "Deploy"
2. Aguarde o build completar (normalmente < 2 minutos)
3. Acesse o link gerado pelo Vercel

## Estrutura de Deploy

### Frontend
- Aplicação React otimizada servida como SPA
- Build otimizado que evita timeouts do Vite
- Fallback para conteúdo estático em caso de erro

### API Serverless
- Functions Node.js com Express
- Autenticação JWT
- Conexão PostgreSQL otimizada
- CORS configurado para produção

## Verificação Pós-Deploy

Após o deploy, teste:

1. **Página inicial**: Carregamento do restaurante
2. **Menu**: Exibição de categorias e itens
3. **API Health**: `https://seu-dominio.vercel.app/api/health`
4. **Autenticação**: Login/registro funcionando
5. **Reservas**: Sistema de reservas operacional

## Troubleshooting

### Build Falha
- Verifique se todas as dependências estão no package.json
- Confirme que o script build-vercel.js está executável

### API não responde
- Verifique a variável DATABASE_URL
- Confirme que a base de dados está acessível
- Teste a conexão com a base de dados

### Frontend em branco
- O build inclui fallback estático
- Verifique os logs do browser para erros JavaScript

### Problemas de CORS
- A API já está configurada com CORS
- Verifique se o domínio está correto

## Monitoramento

O Vercel fornece:
- Logs de function em tempo real
- Métricas de performance
- Alertas de erro automáticos

## Otimizações Implementadas

- Build otimizado que evita timeout do Vite
- API serverless com connection pooling
- Static assets otimizados
- Configuração de cache adequada
- Error handling robusto

## Domínio Personalizado

Para usar domínio próprio:
1. Vá em "Settings" > "Domains"
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. SSL é configurado automaticamente

---

**Las Tortilhas está pronto para produção no Vercel!**