#!/bin/bash
# Script de configuração unificado - Las Tortilhas
# Suporta tanto desenvolvimento quanto produção

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar help
show_help() {
    echo "Las Tortilhas - Script de Configuração"
    echo ""
    echo "Uso: ./scripts/setup.sh [COMANDO]"
    echo ""
    echo "Comandos:"
    echo "  dev        Configurar ambiente de desenvolvimento"
    echo "  prod       Configurar para produção"
    echo "  build      Fazer build de produção"
    echo "  install    Instalar dependências"
    echo "  clean      Limpar cache e builds"
    echo "  help       Mostrar esta ajuda"
    echo ""
}

# Função para instalação
install_deps() {
    local mode=$1
    echo -e "${BLUE}📦 Instalando dependências...${NC}"
    
    if [ "$mode" = "prod" ]; then
        npm ci --only=production --silent
    else
        npm install
    fi
    
    echo -e "${GREEN}✅ Dependências instaladas!${NC}"
}

# Função para build
build_project() {
    echo -e "${BLUE}🏗️ Iniciando build...${NC}"
    export NODE_ENV=production
    
    # Limpar diretório anterior
    rm -rf dist/
    mkdir -p dist
    
    # Build frontend
    echo -e "${YELLOW}⚛️ Building frontend...${NC}"
    npx vite build --mode production
    
    # Build backend
    echo -e "${YELLOW}⚙️ Building backend...${NC}"
    npx esbuild server/index.ts \
        --platform=node \
        --packages=external \
        --bundle \
        --format=esm \
        --outdir=dist \
        --minify \
        --sourcemap
    
    # Verificar build
    if [ -f "dist/index.js" ]; then
        echo -e "${GREEN}✅ Build concluído!${NC}"
        du -sh dist/*
    else
        echo -e "${RED}❌ Erro no build!${NC}"
        exit 1
    fi
}

# Função para limpeza
clean_project() {
    echo -e "${YELLOW}🧹 Limpando projeto...${NC}"
    rm -rf node_modules dist .next .vercel
    rm -f package-lock.json
    npm cache clean --force
    echo -e "${GREEN}✅ Projeto limpo!${NC}"
}

# Função principal
main() {
    case $1 in
        "dev"|"development")
            echo -e "${BLUE}🛠️ Configurando desenvolvimento...${NC}"
            install_deps "dev"
            npm run db:push
            echo -e "${GREEN}🚀 Pronto! Execute: npm run dev${NC}"
            ;;
        "prod"|"production")
            echo -e "${BLUE}🏭 Configurando produção...${NC}"
            install_deps "prod"
            build_project
            echo -e "${GREEN}🚀 Pronto! Execute: npm run start${NC}"
            ;;
        "build")
            build_project
            ;;
        "install")
            install_deps "dev"
            ;;
        "clean")
            clean_project
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            echo -e "${RED}❌ Comando inválido: $1${NC}"
            show_help
            exit 1
            ;;
    esac
}

# Executar função principal
main $1