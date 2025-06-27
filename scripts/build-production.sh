#!/bin/bash
# Script de construção para produção - Las Tortilhas
# Compilação otimizada para deployment

echo "🏗️ Iniciando build de produção..."

# Definir variáveis de ambiente
export NODE_ENV=production

# Limpar diretório de build anterior
echo "🗑️ Limpando builds anteriores..."
rm -rf dist/
mkdir -p dist

echo "⚛️ Buildando frontend com Vite..."
# Build do frontend com otimizações
npx vite build --mode production

echo "⚙️ Compilando backend com esbuild..."
# Build do backend com esbuild
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --minify \
  --sourcemap \
  --target=node18

echo "📋 Copiando arquivos necessários..."
# Copiar arquivos estáticos
cp -r public dist/ 2>/dev/null || true
cp package.json dist/ 2>/dev/null || true

echo "🔍 Verificando build..."
# Verificar se os arquivos foram criados
if [ -f "dist/index.js" ] && [ -d "dist/client" ]; then
    echo "✅ Build de produção concluído com sucesso!"
    echo "📊 Tamanhos dos arquivos:"
    du -sh dist/*
else
    echo "❌ Erro no build de produção!"
    exit 1
fi

echo "🚀 Pronto para deployment!"