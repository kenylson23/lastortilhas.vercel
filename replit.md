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

### June 26, 2025
- **Initial setup** - Complete Mexican restaurant website created
- **Database setup** - PostgreSQL database provisioned and connected successfully
- **Menu populated** - Added 19 authentic Mexican menu items across 7 categories
- **Reservation system** - Fixed modal functionality and WhatsApp integration (+244 949639932)
- **Branding update** - Integrated custom Las Tortilhas logo in navigation
- **Lazy loading implemented** - Added custom loading screens using restaurant logo
- **Performance optimization** - Removed excessive authentication requests for faster loading
- **Modal fixes** - Corrected registration modal to work properly
- **Supabase migration prep** - Updated database configuration for Supabase pooler connection
- **Migration script** - Created automated data migration tool for smooth transition

## User Preferences

Preferred communication style: Simple, everyday language.