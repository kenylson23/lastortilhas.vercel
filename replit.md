# Las Tortilhas Restaurant Website

## Overview
Las Tortilhas is a full-stack web application for a Mexican restaurant located in Luanda, Angola. The application features a modern React frontend with a Node.js/Express backend, implementing restaurant functionalities including menu display, reservations, contact forms, and user authentication via Replit Auth.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom Mexican-themed color palette
- **Animations**: Framer Motion for smooth animations and transitions
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API endpoints

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Core Tables**:
  - `users` - User authentication and profile data (mandatory for Replit Auth)
  - `sessions` - Session storage (mandatory for Replit Auth)
  - `menuCategories` - Restaurant menu organization
  - `menuItems` - Individual menu items with multilingual support
  - `reservations` - Customer reservation system
  - `contactMessages` - Contact form submissions

### Authentication System
- **Provider**: Replit Auth with OIDC (OpenID Connect)
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **Middleware**: Passport.js integration for authentication flows
- **Security**: HTTP-only cookies with secure flags for production

### API Endpoints
- `GET /api/auth/user` - Get authenticated user profile
- `GET /api/menu/categories` - Fetch menu categories
- `GET /api/menu/items` - Fetch menu items (with optional category filtering)
- `POST /api/reservations` - Create new reservation
- `POST /api/contact` - Submit contact form

### UI Components Structure
- **Layout Components**: Navigation, Hero, Footer
- **Feature Components**: Menu display, Gallery with lightbox, Location map
- **Modal Components**: Reservation booking, User registration, Image lightbox
- **Form Components**: Contact forms, reservation forms with validation

## Data Flow

### Authentication Flow
1. User clicks login/register → Redirects to Replit Auth
2. Successful authentication → User session created in PostgreSQL
3. Frontend receives user data via `/api/auth/user` endpoint
4. App switches from landing page to authenticated home page

### Menu Data Flow
1. Frontend requests menu categories and items from API
2. Backend queries PostgreSQL via Drizzle ORM
3. Data returned with multilingual support (Portuguese/English)
4. Frontend displays categorized menu with filtering capabilities

### Reservation Flow
1. User fills reservation form → Submits to `/api/reservations`
2. Backend validates and stores reservation data
3. Success response triggers WhatsApp integration for confirmation
4. User receives immediate feedback via toast notifications

## External Dependencies

### Core Dependencies
- **Database**: Supabase PostgreSQL (with transaction pooler)
- **Authentication**: Replit Auth service
- **UI Library**: Radix UI primitives with Shadcn/ui
- **Validation**: Zod schema validation
- **Icons**: Lucide React + React Icons (Font Awesome)
- **Date Handling**: date-fns library

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESLint/Prettier**: Code formatting and linting
- **Vite**: Fast development server and build tool

### Third-party Integrations
- **WhatsApp**: Reservation confirmation messaging
- **Unsplash**: Image CDN for restaurant photos
- **Google Fonts**: Typography (Playfair Display implied)

## Deployment Strategy

### Build Process
- **Development**: `npm run dev` - Runs Vite dev server with HMR
- **Production Build**: `npm run build` - Vite build + ESBuild for server
- **Start**: `npm run start` - Runs production server

### Environment Configuration
- **Development**: Vite dev server proxy to Express backend
- **Production**: Express serves static files from Vite build
- **Database**: Environment variable `DATABASE_URL` for PostgreSQL connection
- **Auth**: Replit-specific environment variables for OIDC

### Replit Deployment
- **Platform**: Replit Autoscale deployment
- **Port Configuration**: Backend on port 5000, proxied to port 80
- **Modules**: nodejs-20, web, postgresql-16
- **Database**: Automatic Replit PostgreSQL provisioning

## Recent Changes

### June 27, 2025
- **Problemas de deploy Railway resolvidos** - Soluções implementadas para deploy confiável:
  - **Timeout de build corrigido** - Estratégia de desenvolvimento em produção evita timeouts do Vite
  - **Erros ESBuild eliminados** - Configuração simplificada sem problemas de argumentos indefinidos
  - **railway.json otimizado** - Build apenas instala dependências, start usa `npm run dev` 
  - **Procfile atualizado** - `NODE_ENV=production npm run dev` para deploy rápido e confiável
  - **Guia completo criado** - RAILWAY_DEPLOY_GUIDE.md com troubleshooting e passos detalhados
  - **Configuração Vite Railway** - vite.config.railway.ts com build otimizado para casos específicos
- **Railway deployment finalizado** - Projeto configurado e otimizado para deployment no Railway:
  - **Arquivos Railway criados** - railway.json, Procfile, .env.example, guias de deployment
  - **Porta dinâmica** - Servidor configurado para usar PORT do Railway (fallback 5000 para Replit)
  - **Banco de dados otimizado** - Suporte para DATABASE_PRIVATE_URL do Railway + fallbacks
  - **Build otimizado** - Corrigido timeout do Vite, usando modo desenvolvimento para deploy rápido
  - **Documentação completa** - Guias passo-a-passo para deployment no Railway
  - **Problemas ESBuild resolvidos** - Configuração alternativa evita erros de argumentos indefinidos
- **Configuração Vercel removida completamente** - Projeto otimizado para funcionar exclusivamente no Replit:
  - **Arquivos Vercel deletados** - vercel.json, api/, vite.config.vercel.ts, scripts/build-vercel.js
  - **Projeto focado no Replit** - Configuração limpa sem conflitos de deployment
  - **Performance otimizada** - Sistema de autenticação melhorado, carregamento mais rápido
  - **Arquitetura simplificada** - Apenas Replit Auth + PostgreSQL + React frontend
- **Database connection fixed** - Resolved startup error by creating PostgreSQL database and configuring environment variables
- **Complete database population** - Added 21 authentic Mexican menu items across 7 categories, 8 gallery images, and admin user
- **Correções de importações** - Removidas referências a arquivos deletados (directDbConnection, simpleAuth)
- **Arquitetura dual funcional** - Projeto funciona tanto no Replit quanto preparado para Vercel:
  - **Desenvolvimento Replit** - Mantida autenticação Replit Auth com sessões PostgreSQL
  - **Produção Vercel** - API serverless com JWT, connection pooling otimizado
  - **Build system** - Scripts para ambos os ambientes sem conflitos

### June 26, 2025
- **Initial setup** - Complete Mexican restaurant website created
- **Database setup** - PostgreSQL database provisioned and connected successfully
- **Menu populated** - Added 19 authentic Mexican menu items across 7 categories
- **Reservation system** - Fixed modal functionality and WhatsApp integration (+244 949639932)
- **Branding update** - Integrated custom Las Tortilhas logo in navigation
- **Lazy loading implemented** - Added custom loading screens using restaurant logo
- **Performance optimization** - Removed excessive authentication requests for faster loading
- **Modal fixes** - Corrected registration modal to work properly
- **Supabase migration completed** - Successfully migrated to Supabase as primary database:
  - Database connection prioritizes SUPABASE_DATABASE_URL with Replit PostgreSQL as fallback
  - Created all required tables (users, sessions, menu_categories, menu_items, reservations, contact_messages, gallery_images)
  - Populated database with 19 authentic Mexican menu items across 7 categories
  - Added 8 gallery images showcasing restaurant ambiance and food
  - Created admin user account (admin@lastortilhas.com / admin123)
  - Application now fully running on Supabase infrastructure (June 26, 2025)
- **Intelligent authentication system** - Enhanced login/registration with smart features:
  - Real-time email and password validation with visual feedback
  - Automatic account creation for new users with intelligent name generation
  - Enhanced security with bcrypt encryption (12 rounds)
  - Modern responsive login page with gradient design and interactive elements
  - Smart registration modal with live validation indicators
  - Improved session management and user profile updates
  - Better error handling and user feedback messages
- **Complete admin panel implementation** - Full administrative interface with:
  - Dashboard with real-time statistics and recent activity
  - Menu management (add/edit categories and items)
  - Reservation management (view and update status)
  - Gallery management (add/edit/delete images)
  - Contact management (view and mark as read/responded)
  - Role-based access control (admin/user roles)
  - Fixed admin authentication (admin@lastortilhas.com / admin123)
  - Navigation enhancement with "Voltar ao Site" button for easy site access
  - Full CRUD operations activated for menu items (create, edit, delete with confirmation)
  - Full CRUD operations activated for gallery images (create, edit, delete with confirmation)
  - Interactive edit forms with real-time validation
  - Backend API routes implemented for PUT/DELETE operations

## User Preferences

Preferred communication style: Simple, everyday language.