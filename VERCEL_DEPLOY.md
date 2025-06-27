# Las Tortilhas - Guia de Deploy Vercel

## Estrutura Moderna Preparada

### Arquivos Principais para Deploy:
- `vercel.json` - Configuração Vercel v2 com Node.js 20.x
- `api/index.mjs` - API serverless moderna com ES modules
- `api/package.json` - Dependências específicas da API
- `index.html` - Frontend com fallback completo do restaurante
- `.vercelignore` - Otimização de arquivos para deploy

### Configuração do Banco de Dados no Vercel:

1. **Variáveis de Ambiente Necessárias:**
   ```
   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
   NODE_ENV=production
   ```

2. **Configuração SSL:**
   - SSL configurado automaticamente para produção
   - Conexão otimizada para serverless (max: 1 conexão)

### Endpoints da API Disponíveis:

- `GET /api/health` - Status da API
- `GET /api/menu/categories` - Categorias do menu
- `GET /api/menu/items` - Itens do menu
- `GET /api/gallery` - Imagens da galeria
- `POST /api/reservations` - Criar reserva
- `POST /api/contact` - Enviar mensagem de contato

### Frontend Robusto:

O `index.html` inclui:
- Conteúdo visual completo do Las Tortilhas
- Sistema de fallback automático
- Design responsivo com tema mexicano
- SEO otimizado
- Meta tags para redes sociais

### Processo de Deploy:

1. **Build automático:** `vite build`
2. **Output:** `dist/` directory
3. **API:** Serverless functions em Node.js 20.x
4. **Routing:** Automático com rewrites configurados

### Garantias de Funcionamento:

- **Sem tela em branco:** Fallback HTML sempre exibe o restaurante
- **API moderna:** ES modules com Node.js 20.x
- **CORS configurado:** Headers de acesso configurados
- **SSL otimizado:** Conexões seguras para produção
- **Erro handling:** Respostas adequadas para todos os cenários

### Verificação Pós-Deploy:

1. Acesse `https://seu-dominio.vercel.app/api/health`
2. Verifique se retorna: `{"status":"OK","service":"Las Tortilhas API"}`
3. Teste a página principal para ver o conteúdo do restaurante
4. Confirme que o menu carrega em `/api/menu/categories`

O projeto está completamente preparado para deploy moderno no Vercel!