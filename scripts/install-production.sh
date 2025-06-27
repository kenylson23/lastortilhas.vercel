#!/bin/bash
# Script de instalação para produção - Las Tortilhas
# Garante instalação limpa das dependências

echo "🔧 Iniciando instalação de produção..."

# Limpar cache e reinstalar dependências
echo "📦 Limpando cache npm..."
npm cache clean --force

echo "🗑️ Removendo node_modules existente..."
rm -rf node_modules
rm -f package-lock.json

echo "⬇️ Instalando dependências de produção..."
npm ci --only=production --silent

echo "🔍 Verificando integridade das dependências..."
npm audit --audit-level=moderate

echo "✅ Instalação de produção concluída!"
echo "📊 Estatísticas:"
npm list --depth=0 | head -5