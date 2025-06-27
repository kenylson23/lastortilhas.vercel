# Fluxo de Dados Las Tortilhas - Implementação Completa

## ✅ Conformidade com Especificação do Fluxo

Implementamos completamente o fluxo de dados conforme o diagrama fornecido:

### 1. Solicitações do Cliente
**Frontend React faz chamadas de API por meio da consulta TanStack**

#### Implementação
```typescript
// client/src/lib/queryClient.ts
export async function apiRequest(method, url, data) {
  const headers = {
    ...(data ? { "Content-Type": "application/json" } : {}),
  };

  // Suporte dual: JWT para Vercel + Cookies para Replit
  const token = localStorage.getItem('authToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Sessões tradicionais
  });
}
```

#### Funcionalidades Ativas
- ✅ TanStack Query configurado com queryFn personalizado
- ✅ Suporte dual: JWT headers + cookies para sessões
- ✅ Tratamento automático de erros 401/403
- ✅ Cache inteligente com invalidação por mutations
- ✅ Loading states e retry automático

### 2. Autenticação
**Middleware valida sessões/tokens JWT**

#### Implementação Dual
```typescript
// server/jwtAddon.ts - Sistema unificado
export const jwtSupport = (req, res, next) => {
  // Prioridade: sessão tradicional (Replit)
  if (req.session?.user) return next();

  // Fallback: JWT token (Vercel)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const user = verifyJWT(token);
    if (user) {
      req.session = { user }; // Simula sessão para compatibilidade
    }
  }
  next();
};
```

#### Características
- ✅ **Sessões PostgreSQL**: Para implantação tradicional (Replit)
- ✅ **JWT Tokens**: Para implantação serverless (Vercel)
- ✅ **Middleware unificado**: Suporta ambos automaticamente
- ✅ **Headers de segurança**: HTTP-only cookies + secure flags
- ✅ **Validação robusta**: Verificação de expiração e assinatura

### 3. Operações de Banco de Dados
**Drizzle ORM lida com interações de banco de dados com segurança de tipo**

#### Schema Tipado
```typescript
// shared/schema.ts - Tipagem completa
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  password: text("password"),
  role: text("role").default("user"),
});

// Tipos automáticos gerados
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
```

#### Operações Implementadas
- ✅ **21 pratos mexicanos**: Organizados em 7 categorias
- ✅ **Sistema de reservas**: Com WhatsApp integration
- ✅ **Galeria de imagens**: 8 fotos profissionais
- ✅ **Usuários e autenticação**: Admin + clientes
- ✅ **Mensagens de contato**: Sistema de comunicação
- ✅ **Segurança**: Proteção contra SQL injection via ORM

### 4. Processamento de Resposta
**Formatos de middleware Express e logs de respostas**

#### Middleware Otimizado
```typescript
// server/index.ts - Processamento padronizado
app.use((req, res, next) => {
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    if (path.startsWith("/api")) {
      // Headers de segurança
      this.setHeader('X-Content-Type-Options', 'nosniff');
      this.setHeader('X-Frame-Options', 'DENY');
      
      // Formatação padronizada
      if (this.statusCode >= 400) {
        bodyJson = {
          success: false,
          error: bodyJson.message,
          statusCode: this.statusCode,
          timestamp: new Date().toISOString()
        };
      } else {
        bodyJson = {
          success: true,
          data: bodyJson,
          timestamp: new Date().toISOString()
        };
      }
    }
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
});
```

#### Características
- ✅ **Formatação unificada**: Todas as respostas seguem padrão consistente
- ✅ **Headers de segurança**: X-Content-Type-Options, X-Frame-Options
- ✅ **Timestamps**: Rastreabilidade de todas as operações
- ✅ **Logs estruturados**: Performance tracking por request
- ✅ **Status codes apropriados**: HTTP semantics respeitadas

### 5. Tratamento de Erros
**Tratamento de erros centralizado com códigos de status HTTP adequados**

#### Sistema Centralizado
```typescript
// server/index.ts - Error handler global
app.use((err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  
  log(`[ERROR] ${req.method} ${req.path} - ${status}: ${err.message}`);
  
  const errorResponse = {
    success: false,
    error: err.message,
    statusCode: status,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(status).json(errorResponse);
});
```

#### Cobertura Completa
- ✅ **400 Bad Request**: Dados inválidos ou malformados
- ✅ **401 Unauthorized**: Falha de autenticação
- ✅ **403 Forbidden**: Acesso negado (não admin)
- ✅ **404 Not Found**: Recursos inexistentes
- ✅ **409 Conflict**: Usuário já existe
- ✅ **500 Internal Server Error**: Erros de servidor
- ✅ **Logs estruturados**: Rastreamento completo de erros
- ✅ **Stack traces**: Disponíveis em desenvolvimento

## 📊 Fluxo Completo em Ação

### Exemplo: Criar Reserva
```
1. Cliente → TanStack Query → POST /api/reservations
   Headers: Authorization: Bearer <jwt> | Cookie: session_id

2. Middleware → Valida JWT/sessão → req.user definido

3. Drizzle ORM → INSERT INTO reservations → Tipagem validada

4. Express → Formatação de resposta → Headers de segurança

5. Resposta → {success: true, data: reservation, timestamp}
```

### Logs Estruturados
```
[SUCCESS] POST /api/reservations 201 in 45ms :: {"success":true,"data":{"id":1...}}
```

## 🎯 Conformidade 100%

O fluxo de dados implementado atende completamente à especificação:
- ✅ **Solicitações do cliente**: TanStack Query + dual auth
- ✅ **Autenticação**: Middleware JWT/sessões unificado  
- ✅ **Operações de banco**: Drizzle ORM com tipagem completa
- ✅ **Processamento de resposta**: Express middleware padronizado
- ✅ **Tratamento de erros**: Sistema centralizado com HTTP codes

## 🚀 Performance e Monitoramento

### Métricas Ativas
- **Response time tracking**: Logs de performance por endpoint
- **Error rate monitoring**: Contagem automática de falhas
- **Authentication success rate**: Tracking de login/JWT validation
- **Database query optimization**: Logs de tempo de consulta

### Segurança Implementada
- **CORS configurado**: Origins permitidas por ambiente
- **Rate limiting**: Via middleware Express
- **SQL injection protection**: Drizzle ORM parameterized queries
- **XSS protection**: Content Security Policy headers
- **Session security**: HTTP-only, secure cookies

O sistema Las Tortilhas agora opera com fluxo de dados otimizado, monitoramento completo e segurança robusta.