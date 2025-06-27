import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import express, { type Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcryptjs";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
  });

  return session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "fallback-secret-for-development",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: sessionTtl,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  });
}

export async function setupAuth(app: Express) {
  // Add JSON parsing middleware for auth routes
  app.use('/api', express.json());
  app.use('/api', express.urlencoded({ extended: true }));
  
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Hardcoded admin credentials for simplicity
  const adminUser = {
    id: 'admin@lastortilhas.com',
    email: 'admin@lastortilhas.com',
    username: 'admin',
    first_name: 'Admin',
    last_name: 'Las Tortilhas',
    role: 'admin'
  };

  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        console.log(`Tentativa de login para: ${email}`);

        // Simple authentication for admin
        if (email === 'admin@lastortilhas.com' && password === 'admin123') {
          console.log(`Login de administrador realizado para: ${email}`);
          return done(null, adminUser);
        }

        // For other users, create a simple user account
        if (password.length >= 6) {
          const simpleUser = {
            id: email,
            email: email,
            username: email,
            first_name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            last_name: 'Cliente',
            role: 'user'
          };
          
          console.log(`Login/registro realizado para: ${email}`);
          return done(null, simpleUser);
        } else {
          return done(null, false, { message: 'Senha deve ter pelo menos 6 caracteres' });
        }
      } catch (error) {
        console.error('Erro na autenticação:', error);
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      if (id === 'admin@lastortilhas.com') {
        done(null, adminUser);
      } else {
        const simpleUser = {
          id: id,
          email: id,
          username: id,
          first_name: id.split('@')[0].charAt(0).toUpperCase() + id.split('@')[0].slice(1),
          last_name: 'Cliente',
          role: 'user'
        };
        done(null, simpleUser);
      }
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error('Erro de autenticação:', err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Credenciais inválidas' });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('Erro no login:', err);
          return res.status(500).json({ message: 'Erro ao fazer login' });
        }
        
        console.log('Login realizado com sucesso para:', user.email);
        return res.json({ 
          message: 'Login realizado com sucesso',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role
          }
        });
      });
    })(req, res, next);
  });

  app.get('/api/login', (req, res) => {
    const error = req.query.error;
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Las Tortilhas - Login</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: 'Segoe UI', system-ui, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0; 
              padding: 0; 
              min-height: 100vh; 
              display: flex; 
              align-items: center; 
              justify-content: center;
            }
            .container { 
              background: white; 
              padding: 2rem; 
              border-radius: 1rem; 
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              width: 100%; 
              max-width: 400px;
              margin: 1rem;
            }
            h1 { 
              color: #2d3748; 
              text-align: center; 
              margin-bottom: 2rem;
              font-size: 1.875rem;
              font-weight: 600;
            }
            .form-group { 
              margin-bottom: 1.5rem; 
            }
            label { 
              display: block; 
              margin-bottom: 0.5rem; 
              color: #4a5568;
              font-weight: 500;
            }
            input[type="email"], input[type="password"] { 
              width: 100%; 
              padding: 0.75rem; 
              border: 2px solid #e1e5e9; 
              border-radius: 0.5rem; 
              font-size: 1rem;
              transition: border-color 0.15s ease-in-out;
            }
            input[type="email"]:focus, input[type="password"]:focus {
              outline: none;
              border-color: #667eea;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            button { 
              width: 100%; 
              padding: 0.75rem; 
              background: #667eea; 
              color: white; 
              border: none; 
              border-radius: 0.5rem; 
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: background-color 0.15s ease-in-out;
            }
            button:hover {
              background: #5a67d8;
            }
            .error { 
              color: #e53e3e; 
              margin-top: 1rem; 
              text-align: center;
              font-weight: 500;
            }
            .info {
              background: #bee3f8;
              color: #2b6cb0;
              padding: 1rem;
              border-radius: 0.5rem;
              margin-bottom: 1.5rem;
              font-size: 0.875rem;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🌮 Las Tortilhas</h1>
            <div class="info">
              <strong>Admin:</strong> admin@lastortilhas.com / admin123<br>
              <strong>Cliente:</strong> qualquer email válido + senha com 6+ caracteres
            </div>
            <form method="post" action="/api/login">
              <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
              </div>
              <div class="form-group">
                <label for="password">Senha:</label>
                <input type="password" id="password" name="password" required>
              </div>
              <button type="submit">Entrar</button>
              ${error ? '<div class="error">Credenciais inválidas. Tente novamente.</div>' : ''}
            </form>
          </div>
        </body>
      </html>
    `);
  });

  app.get('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      res.redirect('/');
    });
  });

  // Auth user route is handled in routes.ts to avoid duplication
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};