# Dockerfile otimizado para Railway - Las Tortilhas
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --include=dev

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 5000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=5000

# Comando de inicialização
CMD ["npx", "tsx", "server/index.ts"]