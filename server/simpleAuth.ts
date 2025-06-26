import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import bcrypt from "bcryptjs";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Local strategy for username/password authentication
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // For simplicity, create a test user if it doesn't exist
        let user = await storage.getUserByEmail(email);
        
        if (!user) {
          // Create a test user
          const hashedPassword = await bcrypt.hash(password, 10);
          user = await storage.createUser({
            email,
            username: email,
            password: hashedPassword,
            firstName: 'Usuário',
            lastName: 'Teste'
          });
        } else {
          // Verify password
          const isValid = await bcrypt.compare(password, user.password || '');
          if (!isValid) {
            return done(null, false, { message: 'Senha incorreta' });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.post('/api/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/api/login?error=1'
  }));

  app.get('/api/login', (req, res) => {
    const error = req.query.error;
    res.send(`
      <html>
        <head>
          <title>Las Tortilhas - Login</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            button { width: 100%; padding: 12px; background: #d32f2f; color: white; border: none; border-radius: 5px; cursor: pointer; }
            button:hover { background: #b71c1c; }
            .error { color: red; margin-bottom: 10px; }
            .logo { text-align: center; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="logo">
            <h1 style="color: #d32f2f;">🌮 Las Tortilhas</h1>
            <p>Faça login para continuar</p>
          </div>
          ${error ? '<div class="error">Email ou senha incorretos</div>' : ''}
          <form method="POST" action="/api/login">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required placeholder="seu@email.com">
            </div>
            <div class="form-group">
              <label for="password">Senha:</label>
              <input type="password" id="password" name="password" required placeholder="Digite qualquer senha">
            </div>
            <button type="submit">Entrar / Registar</button>
          </form>
          <p style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            Use qualquer email e senha - uma conta será criada automaticamente
          </p>
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
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};