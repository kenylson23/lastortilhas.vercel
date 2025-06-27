#!/bin/bash
# Script de instalação para desenvolvimento - Las Tortilhas
# Configuração completa do ambiente de desenvolvimento

echo "🛠️ Configurando ambiente de desenvolvimento..."

# Instalar todas as dependências (produção + desenvolvimento)
echo "📦 Instalando dependências completas..."
npm install

echo "🔧 Verificando ferramentas de desenvolvimento..."
# Verificar se as ferramentas principais estão disponíveis
command -v tsx >/dev/null 2>&1 || echo "⚠️ tsx não encontrado"
command -v vite >/dev/null 2>&1 || echo "⚠️ vite não encontrado"
command -v drizzle-kit >/dev/null 2>&1 || echo "⚠️ drizzle-kit não encontrado"

echo "🗄️ Configurando banco de dados..."
# Executar migrations se necessário
npm run db:push

echo "🔍 Verificando configuração..."
# Verificar se arquivos de configuração existem
[ -f "tsconfig.json" ] && echo "✅ TypeScript configurado"
[ -f "tailwind.config.ts" ] && echo "✅ Tailwind configurado"
[ -f "vite.config.ts" ] && echo "✅ Vite configurado"

echo "✅ Ambiente de desenvolvimento pronto!"
echo "🚀 Execute 'npm run dev' para iniciar"