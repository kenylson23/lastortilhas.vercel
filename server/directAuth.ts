import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcryptjs";
import { Pool } from 'pg';

// Create direct database connection for authentication with proper types
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
const authPool = new Pool({ 
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  // Ensure proper type handling for Supabase
  types: {
    getTypeParser: () => (val: string) => val
  }
});

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: databaseUrl,
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
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        console.log(`Tentativa de login para: ${email}`);

        // Validate password strength (minimum 6 characters)
        if (password.length < 6) {
          return done(null, false, { message: 'Senha deve ter pelo menos 6 caracteres' });
        }

        const client = await authPool.connect();
        try {
          // Check if user exists
          const userResult = await client.query(
            'SELECT id, email, username, first_name, last_name, role, password FROM users WHERE email = $1',
            [email]
          );

          let user = userResult.rows[0];
          
          if (!user) {
            // Create new user with intelligent defaults
            const hashedPassword = await bcrypt.hash(password, 12);
            const firstName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
            
            const insertResult = await client.query(`
              INSERT INTO users (id, email, username, password, first_name, last_name, role)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              RETURNING id, email, username, first_name, last_name, role
            `, [email, email, email, hashedPassword, firstName, 'Cliente', 'user']);

            user = insertResult.rows[0];
            console.log(`Nova conta criada para: ${email}`);
            return done(null, user);
          } else {
            // Verify password for existing user
            const isValid = await bcrypt.compare(password, user.password || '');
            if (!isValid) {
              return done(null, false, { message: 'Senha incorreta' });
            }

            // Remove password from user object
            delete user.password;
            console.log(`Login realizado para: ${email}`);
            return done(null, user);
          }
        } finally {
          client.release();
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
      const client = await authPool.connect();
      try {
        const result = await client.query(
          'SELECT id, email, username, first_name, last_name, role FROM users WHERE id = $1',
          [id]
        );
        done(null, result.rows[0] || null);
      } finally {
        client.release();
      }
    } catch (error) {
      done(error);
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};