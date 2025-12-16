# BarcodePro - Inventory Management System

## Overview

BarcodePro is a barcode-based inventory management system that uses a simple toggle-scan workflow. Each item is identified by a unique barcode, and scanning alternates between check-in and check-out states. The system tracks all scan activity with timestamps and supports bulk import/export of inventory data.

Key features:
- Single-scan toggle for check-in/check-out operations
- Automatic item registration for unrecognized barcodes
- Dashboard with real-time statistics
- Full scan history with filtering
- CSV import/export functionality
- Light/dark theme support

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state caching and synchronization
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful JSON API under `/api` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Schema Validation**: Zod with drizzle-zod integration

### Data Model
Three core tables:
1. **users** - Basic authentication (id, username, password)
2. **inventory_items** - Item records (id, barcode, name, category, description, checkedIn)
3. **scan_logs** - Audit trail (id, barcode, itemName, action, timestamp)

### Key Design Decisions

**Toggle-based scanning**: Instead of separate check-in/check-out modes, the system reads current item state and performs the opposite action. This simplifies the user workflow.

**Shared schema**: Database schema lives in `/shared/schema.ts` and is used by both frontend (for type safety) and backend (for database operations).

**Storage abstraction**: The `IStorage` interface in `server/storage.ts` abstracts database operations, making it easier to swap implementations if needed.

**Component-first UI**: Reusable components in `client/src/components/` with example implementations in `components/examples/` for reference.

## External Dependencies

### Database
- **PostgreSQL** - Primary data store via `DATABASE_URL` environment variable
- **Drizzle ORM** - Schema management and query building
- **drizzle-kit** - Database migrations (`npm run db:push`)

### Frontend Libraries
- **@tanstack/react-query** - API data fetching and caching
- **@radix-ui/*** - Accessible UI primitives (dialog, dropdown, toast, etc.)
- **lucide-react** - Icon library
- **date-fns** - Date formatting

### Build & Development
- **Vite** - Development server with HMR
- **tsx** - TypeScript execution for server
- **esbuild** - Production bundling

### Replit-specific
- **@replit/vite-plugin-runtime-error-modal** - Error overlay during development
- **@replit/vite-plugin-cartographer** - Dev tooling integration