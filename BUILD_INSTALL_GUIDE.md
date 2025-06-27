# Guia de Comandos de Construção e Instalação - Las Tortilhas

## 🚀 Comandos Configurados Corretamente

O Las Tortilhas agora possui comandos de construção e instalação devidamente configurados para diferentes ambientes.

### 📦 Scripts de Instalação

#### 1. Desenvolvimento
```bash
# Configuração completa para desenvolvimento
./scripts/setup.sh dev
# ou
bash scripts/install-development.sh
```
**O que faz:**
- Instala todas as dependências (produção + desenvolvimento)
- Configura o banco de dados (executa migrations)
- Verifica ferramentas de desenvolvimento (tsx, vite, drizzle-kit)
- Valida arquivos de configuração

#### 2. Produção
```bash
# Configuração otimizada para produção
./scripts/setup.sh prod
# ou
bash scripts/install-production.sh
```
**O que faz:**
- Limpa cache npm completamente
- Instala apenas dependências de produção
- Executa auditoria de segurança
- Otimiza para menor tamanho

### 🏗️ Scripts de Construção

#### 1. Build de Desenvolvimento
```bash
npm run dev
```
**Características:**
- Execução direta do TypeScript (tsx)
- Hot reload com Vite
- Source maps para debugging
- Sem etapa de compilação

#### 2. Build de Produção
```bash
# Build completo otimizado
./scripts/setup.sh build
# ou
bash scripts/build-production.sh
```
**O que faz:**
- Limpa builds anteriores
- Build do frontend com Vite (minificado)
- Compilação do backend com esbuild (minificado)
- Copia arquivos estáticos
- Verifica integridade do build
- Gera relatório de tamanhos

#### 3. Build Rápido
```bash
npm run build
```
**Processo atual:**
1. `vite build` - Compila frontend React
2. `esbuild server/index.ts` - Compila backend Node.js
3. Output final em `dist/`

### 🛠️ Script Unificado

#### Comando Principal
```bash
./scripts/setup.sh [COMANDO]
```

**Comandos disponíveis:**
- `dev` - Configurar ambiente de desenvolvimento
- `prod` - Configurar para produção
- `build` - Fazer build de produção
- `install` - Instalar dependências
- `clean` - Limpar cache e builds
- `help` - Mostrar ajuda

### 📊 Estrutura de Arquivos

```
Las Tortilhas/
├── scripts/
│   ├── setup.sh                 # Script unificado principal
│   ├── install-development.sh   # Instalação para dev
│   ├── install-production.sh    # Instalação para prod
│   └── build-production.sh      # Build otimizado
├── dist/                        # Output de produção
│   ├── index.js                 # Backend compilado
│   ├── client/                  # Frontend compilado
│   └── public/                  # Arquivos estáticos
└── package.json                 # Scripts npm configurados
```

### ⚙️ Configuração Replit

#### Arquivo .replit (não editável diretamente)
```toml
[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]    # ✅ Configurado
run = ["npm", "run", "start"]      # ✅ Configurado
```

#### Workflow Configurado
```toml
[[workflows.workflow]]
name = "Start application"
[[workflows.workflow.tasks]]
task = "shell.exec"
args = "npm run dev"               # ✅ Configurado
waitForPort = 5000
```

### 🔧 Comandos de Manutenção

#### Limpeza Completa
```bash
./scripts/setup.sh clean
```
Remove:
- `node_modules/`
- `dist/`
- `package-lock.json`
- Cache npm

#### Reinstalação Limpa
```bash
./scripts/setup.sh clean
./scripts/setup.sh dev
```

#### Verificação de Build
```bash
# Após build de produção
ls -la dist/
du -sh dist/*
node dist/index.js --version
```

## 🎯 Status Atual

### ✅ Comandos Configurados Corretamente:
- **Instalação de desenvolvimento**: `./scripts/setup.sh dev`
- **Instalação de produção**: `./scripts/setup.sh prod`  
- **Build de produção**: `./scripts/setup.sh build`
- **Limpeza completa**: `./scripts/setup.sh clean`
- **Build rápido**: `npm run build`
- **Execução dev**: `npm run dev`
- **Execução prod**: `npm run start`

### 🔄 Fluxo Recomendado

#### Para Desenvolvimento:
```bash
./scripts/setup.sh dev
npm run dev
```

#### Para Produção/Deploy:
```bash
./scripts/setup.sh prod
npm run start
```

#### Para Deploy Replit:
- O sistema automaticamente usa `npm run build` e `npm run start`
- Scripts otimizados garantem build eficiente

Os comandos de construção e instalação agora estão **devidamente configurados** e otimizados para o Las Tortilhas!