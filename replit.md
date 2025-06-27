# Las Tortilhas - Mexican Restaurant Application

## Overview

Las Tortilhas is a full-stack Mexican restaurant web application built for the Angolan market, specifically targeting customers in Luanda. The application serves as both a customer-facing website and an administrative management system for a Mexican restaurant located on Ilha de Luanda.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state management
- **Animation**: Framer Motion for smooth animations and transitions
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with JWT addon support for flexible deployment
- **Session Management**: Express sessions with PostgreSQL session store

### Database Schema
- **Primary Database**: PostgreSQL with support for multiple providers (Supabase, Railway, Neon)
- **Key Tables**:
  - `users` - User authentication and profiles (mandatory for Replit Auth)
  - `sessions` - Session storage (mandatory for Replit Auth)
  - `menu_categories` - Restaurant menu organization
  - `menu_items` - Individual dishes and pricing
  - `reservations` - Table booking system
  - `contact_messages` - Customer inquiries
  - `gallery_images` - Restaurant photo gallery

## Key Components

### User Experience Flow
1. **Landing Page**: Unauthenticated users see the full restaurant website
2. **Registration**: Simple email/password registration with real-time validation
3. **Authenticated Experience**: Personalized homepage with reservation capabilities
4. **Admin Panel**: Administrative interface for restaurant management

### Restaurant Features
- **Menu Management**: Categorized menu with pricing in Angolan Kwanza
- **Reservation System**: Integrated WhatsApp booking workflow
- **Gallery**: Visual showcase of food and restaurant atmosphere
- **Contact System**: Multi-channel customer communication
- **Location Integration**: Ilha de Luanda location with business hours

### Administrative Features
- **Dashboard**: Real-time statistics and recent activity overview
- **Menu Management**: CRUD operations for categories and items
- **Reservation Management**: Status tracking and customer communication
- **Contact Management**: Customer inquiry handling
- **User Management**: Customer account oversight

## Data Flow

### Authentication Flow
1. User registration creates entry in `users` table
2. Sessions stored in `sessions` table for Replit Auth compatibility
3. JWT addon provides Bearer token support for alternative deployments
4. Role-based access control differentiates customers from administrators

### Reservation Workflow
1. Customer fills reservation form on frontend
2. Data validated and stored in `reservations` table
3. WhatsApp integration generates pre-filled message for confirmation
4. Admin can track and update reservation status
5. Customer notifications through preferred channels

### Menu Management
- Categories organize menu structure with ordering support
- Items linked to categories with rich metadata (price, description, images)
- Multi-language support (Portuguese/English) for international customers
- Availability and featured item controls for promotional management

## External Dependencies

### Database Providers
- **Primary**: Supabase PostgreSQL (configured in environment)
- **Fallback**: Railway PostgreSQL support
- **Development**: Local PostgreSQL or Neon serverless

### Third-Party Integrations
- **WhatsApp Business**: Reservation confirmation workflow
- **Unsplash**: High-quality food photography via API
- **Google Fonts**: Typography (Playfair Display, Inter)

### UI Libraries
- **Radix UI**: Accessible component primitives
- **React Icons**: Comprehensive icon library including social media
- **Framer Motion**: Production-ready animation library

## Deployment Strategy

### Multi-Platform Support
- **Primary**: Replit deployment with native auth integration
- **Alternative**: Vercel/Railway deployment with JWT authentication
- **Database**: Flexible PostgreSQL provider support

### Environment Configuration
- Development and production environment separation
- Secure environment variable management
- Database connection redundancy

### Build Process
- Vite frontend build with asset optimization
- ESBuild backend compilation for Node.js deployment
- Static asset serving with Express.js

## Changelog

### June 27, 2025
- **Server startup issues resolved** - Fixed critical startup problems:
  - **Database configuration unified** - Resolved POSTGRES_URL environment variable conflicts
  - **Authentication system stabilized** - Added better error handling for OIDC configuration
  - **API database connections fixed** - Updated Vercel API configuration to use proper fallbacks
  - **Server error handling improved** - Added comprehensive try-catch blocks for startup
  - **Application fully functional** - All endpoints tested and working correctly
- **Vercel deployment preparado** - Projeto otimizado para deployment no Vercel:
  - **APIs serverless** - Funções serverless para auth, menu, reservas e galeria criadas
  - **Configuração Vercel** - vercel.json com rewrites, CORS e environment variables
  - **Database otimizado** - Pool de conexões configurado para serverless functions
  - **Frontend adaptativo** - Detecção automática de ambiente e comunicação com APIs
  - **Documentação completa** - Guia de deployment e teste das APIs criado
- **Arquitetura flexível implementada** - Projeto otimizado para deployment universal:
  - **Configuração automática** - Detecção automática de plataforma (Replit, Railway, Vercel, Render, Heroku, etc.)
  - **Database flexível** - Suporte para múltiplos provedores (Supabase, Neon, Railway, Vercel Postgres)
  - **SSL adaptativo** - Configuração SSL/TLS automática baseada no ambiente
  - **Pool de conexões** - Configuração otimizada por plataforma
  - **Logging inteligente** - Sistema de logs configurável por ambiente
- **Erro de módulo corrigido** - Resolvido erro "Não é possível encontrar o módulo '/app/dist/index.js'":
  - **Causa identificada** - Arquivos de configuração do Railway conflitando com ambiente Replit
  - **Arquivos removidos** - railway.json, Procfile, Dockerfile, e outros arquivos Railway
  - **Aplicação otimizada** - Projeto limpo focado exclusivamente no Replit
  - **Deploy estável** - Aplicação rodando corretamente com tsx server/index.ts
- **Database connection fixed** - Database PostgreSQL criado e populado com sucesso
- **Complete database population** - 21 itens mexicanos autênticos, 8 imagens de galeria, usuário admin criado

## User Preferences

Preferred communication style: Simple, everyday language.