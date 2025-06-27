import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { getDeploymentConfig, logDeploymentInfo } from "./config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from public directory
app.use(express.static('public'));

// Middleware de processamento de resposta otimizado conforme fluxo de dados
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Interceptar resposta JSON para logging e processamento
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    
    // Processamento de resposta: Formatos de middleware Express
    if (path.startsWith("/api")) {
      // Adicionar headers de segurança para APIs
      this.setHeader('X-Content-Type-Options', 'nosniff');
      this.setHeader('X-Frame-Options', 'DENY');
      
      // Formatação padronizada para respostas de erro
      if (this.statusCode >= 400) {
        bodyJson = {
          success: false,
          error: bodyJson.message || bodyJson.error || 'Erro interno',
          statusCode: this.statusCode,
          timestamp: new Date().toISOString()
        };
      } else if (this.statusCode >= 200 && this.statusCode < 300) {
        // Formatação padronizada para respostas de sucesso
        if (typeof bodyJson === 'object' && !Array.isArray(bodyJson) && !bodyJson.success) {
          bodyJson = {
            success: true,
            data: bodyJson,
            timestamp: new Date().toISOString()
          };
        }
      }
    }
    
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Logs de resposta estruturados
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      // Tratamento de erros: códigos de status HTTP adequados
      const statusType = res.statusCode >= 400 ? "ERROR" : "SUCCESS";
      let logLine = `[${statusType}] ${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      if (capturedJsonResponse && Object.keys(capturedJsonResponse).length > 0) {
        const responsePreview = JSON.stringify(capturedJsonResponse).slice(0, 100);
        logLine += ` :: ${responsePreview}${responsePreview.length >= 100 ? "..." : ""}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Obter configuração de deployment flexível
  const config = getDeploymentConfig();
  
  const server = await registerRoutes(app);

  // Tratamento de erros centralizado
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    if (config.features.logging) {
      log(`[ERROR] ${req.method} ${req.path} - ${status}: ${message}`);
    }
    
    const errorResponse: any = {
      success: false,
      error: message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    };

    if (config.server.environment === 'development' && err.stack) {
      errorResponse.stack = err.stack;
    }

    res.status(status).json(errorResponse);
    
    if (status >= 500) {
      console.error('Critical error:', err);
    }
  });

  // Configurar ambiente baseado na configuração flexível
  if (config.features.viteDevServer) {
    await setupVite(app, server);
  } else if (config.features.staticFiles) {
    serveStatic(app);
  }

  // Iniciar servidor com configuração flexível
  server.listen({
    port: config.server.port,
    host: config.server.host,
    reusePort: true,
  }, () => {
    logDeploymentInfo(config);
  });
})();
