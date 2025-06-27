/**
 * Configuração flexível para deployment em múltiplas plataformas
 * Las Tortilhas Restaurant - Universal Deployment Config
 */

interface DeploymentConfig {
  platform: string;
  database: {
    url: string;
    provider: string;
    ssl: boolean;
    poolSize: number;
  };
  server: {
    port: number;
    host: string;
    environment: string;
  };
  features: {
    staticFiles: boolean;
    viteDevServer: boolean;
    logging: boolean;
  };
}

export function getDeploymentConfig(): DeploymentConfig {
  // Detectar plataforma de deployment
  const platform = (() => {
    if (process.env.RAILWAY_ENVIRONMENT) return 'Railway';
    if (process.env.VERCEL) return 'Vercel';
    if (process.env.RENDER) return 'Render';
    if (process.env.HEROKU_APP_NAME) return 'Heroku';
    if (process.env.REPLIT_DEPLOYMENT_ID) return 'Replit';
    if (process.env.NETLIFY) return 'Netlify';
    if (process.env.FLY_APP_NAME) return 'Fly.io';
    return 'Development';
  })();

  // Database URL com fallbacks múltiplos
  const databaseUrl = 
    process.env.DATABASE_PRIVATE_URL ||
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.PLANETSCALE_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('Database URL não configurada. Configure DATABASE_URL.');
  }

  // Detectar provedor de database
  const databaseProvider = (() => {
    if (databaseUrl.includes('railway')) return 'Railway';
    if (databaseUrl.includes('supabase')) return 'Supabase';
    if (databaseUrl.includes('vercel')) return 'Vercel';
    if (databaseUrl.includes('neon')) return 'Neon';
    if (databaseUrl.includes('render')) return 'Render';
    if (databaseUrl.includes('heroku')) return 'Heroku';
    if (databaseUrl.includes('planetscale')) return 'PlanetScale';
    return 'Other';
  })();

  const environment = process.env.NODE_ENV || 'development';
  const isProduction = environment === 'production';
  const isDevelopment = environment === 'development';

  return {
    platform,
    database: {
      url: databaseUrl,
      provider: databaseProvider,
      ssl: !databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1'),
      poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
    },
    server: {
      port: parseInt(process.env.PORT || process.env.HTTP_PORT || '5000'),
      host: process.env.HOST || '0.0.0.0',
      environment,
    },
    features: {
      staticFiles: isProduction,
      viteDevServer: isDevelopment,
      logging: process.env.ENABLE_LOGGING !== 'false',
    },
  };
}

export function logDeploymentInfo(config: DeploymentConfig) {
  console.log(`🚀 Las Tortilhas - ${config.platform}`);
  console.log(`🗄️  Database: ${config.database.provider}`);
  console.log(`🌐 Server: http://${config.server.host}:${config.server.port}`);
  console.log(`📊 Environment: ${config.server.environment}`);
  
  if (config.features.viteDevServer) {
    console.log('⚡ Vite dev server habilitado');
  }
  
  if (config.features.staticFiles) {
    console.log('📁 Servindo arquivos estáticos');
  }
}