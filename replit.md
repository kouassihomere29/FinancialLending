# replit.md

## Overview

This is a loan application web platform built with a modern full-stack architecture. The application allows users to simulate and apply for personal loans ranging from €500 to €3,000 with flexible repayment terms up to 12 months. The platform features a French-language interface designed for the European market.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom financial-themed color palette
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas shared between client and server

### Database Design
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Tables**:
  - `users`: Basic user authentication
  - `loan_applications`: Comprehensive loan application data including personal info, financial details, and application status

## Key Components

### Loan Calculator
- Real-time loan calculation with adjustable amount and duration
- Interest rate calculation using standard loan formulas
- Monthly payment and total cost computation
- Interactive slider controls for user-friendly experience

### Multi-Step Application Form
- Step-by-step form progression (loan details → personal info → financial info → agreements)
- Real-time validation with user-friendly error messages
- Form persistence across steps
- Legal agreement checkboxes for compliance

### Trust and Marketing Components
- Trust indicators displaying key metrics
- FAQ section with collapsible answers
- Feature highlights emphasizing security and speed
- Professional landing page design

## Data Flow

1. **User Journey**: Landing page → Loan simulation → Application form → Submission
2. **Calculation Flow**: User inputs → Client-side calculation → Real-time display
3. **Application Flow**: Form data → Validation → API submission → Database storage
4. **Response Flow**: Database → API → Client feedback (success/error handling)

## External Dependencies

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- Class Variance Authority for component variants

### Database and Backend
- Neon Database for serverless PostgreSQL
- Drizzle ORM for database operations
- Connect-pg-simple for session management (configured but not actively used)

### Development Tools
- Vite plugins for development experience
- Replit-specific tooling for deployment
- TypeScript for type safety
- ESBuild for production bundling

## Deployment Strategy

### Development Environment
- Vite dev server on port 5000
- Hot module replacement for rapid development
- TypeScript compilation with strict mode
- Express server serving both API and static files

### Production Build
- Vite builds optimized frontend bundle to `dist/public`
- ESBuild bundles server code to `dist/index.js`
- Static file serving from built assets
- Environment variable configuration for database connection

### Replit Configuration
- Autoscale deployment target
- Port mapping (5000 internal → 80 external)
- Automatic build and start commands
- Node.js 20 runtime environment

## Changelog

```
Changelog:
- June 25, 2025: Created admin account (email: admin, password: Sydney220304!) with full administrative rights
- June 25, 2025: Implemented comprehensive admin dashboard for managing all loan applications
- June 25, 2025: Added user role system (user/admin) to the database schema
- June 25, 2025: Fixed authentication issues and simplified session management with memory store
- January 6, 2025: Added mandatory authentication for loan applications - users must sign up/login before proceeding
- January 6, 2025: Implemented mandatory user authentication for loan application process
- January 6, 2025: Updated hero section title and description to emphasize project financing and simplified messaging
- January 6, 2025: Implemented complete 7-step loan process with real-time tracking and admin panel
- January 6, 2025: Migration completed from Replit Agent to Replit environment
- December 26, 2024: Updated "Comment ça marche" section from 3 to 7 steps process
- June 25, 2025: Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```