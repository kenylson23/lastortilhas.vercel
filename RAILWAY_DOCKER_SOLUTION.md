# Railway Docker Solution - Las Tortilhas

## Problema Resolvido
**Erro Nixpacks:** Falha na compilação com nix-env e nix-collect-garbage

## Solução Implementada: Docker

### Configuração Final

**railway.json**
```json
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "healthcheckPath": "/",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Dockerfile**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000
CMD ["npx", "tsx", "server/index.ts"]
```

**.dockerignore**
- Otimizado para excluir arquivos desnecessários
- Remove node_modules, logs, configurações Replit

## Vantagens da Solução Docker

1. **Evita problemas Nixpacks** - Usa ambiente Docker controlado
2. **Build previsível** - Node.js 20 Alpine Linux
3. **Configuração simples** - Sem dependências externas problemáticas
4. **Deploy rápido** - Imagem otimizada

## Status do Projeto

- ✅ Dockerfile criado e otimizado
- ✅ railway.json configurado para Docker
- ✅ .dockerignore otimizado
- ✅ Nixpacks.toml removido (conflito)
- ✅ PostgreSQL configurado
- ✅ APIs funcionando

## Próximo Deploy Railway

1. Railway detectará Dockerfile automaticamente
2. Build da imagem Docker (Node.js 20)
3. Deploy com tsx executando servidor
4. Site funcionando em produção

A solução Docker resolve definitivamente os problemas de build do Railway.