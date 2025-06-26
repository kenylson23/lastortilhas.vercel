import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { createUserDirect, getUserByEmailDirect, verifyPassword, hashPassword } from './authFix';

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
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return done(null, false, { message: 'Email inválido' });
        }

        // Validate password strength (minimum 6 characters)
        if (password.length < 6) {
          return done(null, false, { message: 'Senha deve ter pelo menos 6 caracteres' });
        }

        let user = await getUserByEmailDirect(email);
        
        if (!user) {
          // Create new user with intelligent defaults
          const hashedPassword = await hashPassword(password);
          const firstName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
          
          user = await createUserDirect({
            email,
            username: email,
            password: hashedPassword,
            firstName,
            lastName: 'Cliente'
          });

          console.log(`Nova conta criada para: ${email}`);
          return done(null, user);
        } else {
          // Verify password for existing user
          const isValid = await verifyPassword(password, user.password || '');
          if (!isValid) {
            return done(null, false, { message: 'Senha incorreta' });
          }

          console.log(`Login realizado para: ${email}`);
          return done(null, user);
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
          <title>Las Tortilhas - Entrar</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', sans-serif; 
              background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              padding: 40px;
              max-width: 420px;
              width: 100%;
              position: relative;
              overflow: hidden;
            }
            .container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 5px;
              background: linear-gradient(90deg, #22C55E, #DC2626, #F59E0B);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h1 {
              color: #8B4513;
              font-size: 2.5rem;
              margin-bottom: 5px;
              font-weight: bold;
            }
            .logo p {
              color: #666;
              font-size: 1.1rem;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #22C55E;
              font-weight: 600;
              font-size: 0.9rem;
            }
            .form-group {
              margin-bottom: 25px;
              position: relative;
            }
            label {
              display: block;
              margin-bottom: 8px;
              font-weight: 600;
              color: #333;
              font-size: 0.95rem;
            }
            input {
              width: 100%;
              padding: 15px;
              border: 2px solid #e1e5e9;
              border-radius: 12px;
              font-size: 1rem;
              transition: all 0.3s ease;
              background: #f8f9fa;
            }
            input:focus {
              outline: none;
              border-color: #DC2626;
              background: white;
              box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
            }
            input::placeholder {
              color: #aaa;
            }
            button {
              width: 100%;
              padding: 16px;
              background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
              color: white;
              border: none;
              border-radius: 12px;
              font-size: 1.1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            button:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 25px rgba(220, 38, 38, 0.3);
            }
            button:active {
              transform: translateY(0);
            }
            .error {
              background: #FEE2E2;
              color: #DC2626;
              padding: 12px 16px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 4px solid #DC2626;
              font-weight: 500;
            }
            .help-text {
              text-align: center;
              margin-top: 25px;
              padding: 15px;
              background: #F0FDF4;
              border-radius: 10px;
              border: 1px solid #BBF7D0;
            }
            .help-text h4 {
              color: #15803D;
              margin-bottom: 8px;
              font-size: 0.9rem;
            }
            .help-text p {
              color: #166534;
              font-size: 0.85rem;
              line-height: 1.4;
            }
            .security-badge {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 20px;
              color: #666;
              font-size: 0.8rem;
            }
            .security-badge::before {
              content: '🔒';
              margin-right: 5px;
            }
            @media (max-width: 480px) {
              .container { padding: 30px 20px; }
              .logo h1 { font-size: 2rem; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>🌮 Las Tortilhas</h1>
              <p>Autentica Comida Mexicana</p>
              <span class="subtitle">Sistema Inteligente de Acesso</span>
            </div>
            
            ${error ? '<div class="error">❌ Credenciais inválidas. Verifique seu email e senha.</div>' : ''}
            
            <form method="POST" action="/api/login" id="loginForm">
              <div class="form-group">
                <label for="email">📧 Email:</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="exemplo@email.com"
                  autocomplete="email"
                >
              </div>
              <div class="form-group">
                <label for="password">🔑 Senha:</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  required 
                  placeholder="Mínimo 6 caracteres"
                  autocomplete="current-password"
                  minlength="6"
                >
              </div>
              <button type="submit" id="submitBtn">
                <span id="btnText">Entrar / Criar Conta</span>
              </button>
            </form>
            
            <div class="help-text">
              <h4>✨ Como funciona:</h4>
              <p>
                <strong>Já tem conta?</strong> Digite seu email e senha para entrar.<br>
                <strong>Novo aqui?</strong> Digite qualquer email válido e uma senha (mín. 6 caracteres) - sua conta será criada automaticamente!
              </p>
            </div>
            
            <div class="security-badge">
              Conexão segura e criptografada
            </div>
          </div>

          <script>
            const form = document.getElementById('loginForm');
            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            
            form.addEventListener('submit', function() {
              submitBtn.disabled = true;
              btnText.textContent = 'Processando...';
              submitBtn.style.background = '#9CA3AF';
            });

            // Email validation feedback
            const emailInput = document.getElementById('email');
            emailInput.addEventListener('input', function() {
              const email = this.value;
              const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
              
              if (email && !emailRegex.test(email)) {
                this.style.borderColor = '#EF4444';
              } else if (email) {
                this.style.borderColor = '#10B981';
              } else {
                this.style.borderColor = '#e1e5e9';
              }
            });

            // Password strength indicator
            const passwordInput = document.getElementById('password');
            passwordInput.addEventListener('input', function() {
              const password = this.value;
              
              if (password.length < 6 && password.length > 0) {
                this.style.borderColor = '#EF4444';
              } else if (password.length >= 6) {
                this.style.borderColor = '#10B981';
              } else {
                this.style.borderColor = '#e1e5e9';
              }
            });
          </script>
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