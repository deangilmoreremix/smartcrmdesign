# Smart CRM Platform

An advanced AI-powered productivity and sales management platform that transforms business workflows through intelligent, multi-agent goal execution and dynamic tool integrations.

## Features

### 🚀 Core CRM Functionality
- **Contact Management**: Full CRUD operations with AI-enhanced insights
- **Deal Pipeline**: Kanban-style pipeline with stage-based progression
- **Task Management**: Automated follow-ups and priority organization
- **Calendar Integration**: Appointment scheduling and management

### 🤖 AI-Powered Tools
- **AI Pipeline Intelligence**: Advanced sales analytics and insights
- **Email Composer**: AI-generated personalized communications
- **Business Analyzer**: Comprehensive business intelligence
- **Content Generator**: Marketing content creation
- **Lead Scoring**: Intelligent prospect prioritization
- **Document Analysis**: Automated document processing

### 🏢 Multi-Tenant & White-Label
- **Three-Tier Role System**: Super Admin, Reseller, Regular Users
- **White-Label Customization**: Complete branding control
- **Multi-Tenant Architecture**: Isolated tenant environments
- **Partner Management**: Revenue sharing and feature packages

### 🔧 Advanced Features
- **Communication Hub**: SMS/WhatsApp messaging system
- **Document Center**: File management and sharing
- **Analytics Dashboard**: Revenue forecasting and performance metrics
- **Lead Capture**: Intelligent form with automated scoring

## Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk Authentication
- **State Management**: Zustand
- **Build Tool**: Vite
- **UI Components**: Radix UI + shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/deangilmoreremix/replitscrm.git
   cd replitscrm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Environment Variables**
   
   Edit `.env.local` with your values:
   ```env
   # Database
   DATABASE_URL=your_postgresql_connection_string
   PGHOST=your_db_host
   PGPORT=5432
   PGDATABASE=your_db_name
   PGUSER=your_db_user
   PGPASSWORD=your_db_password
   
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_key
   
   # AI Services (Optional - Platform provides fallback)
   OPENAI_API_KEY=your_openai_key
   GOOGLE_API_KEY=your_google_key
   ```

5. **Database Setup**
   ```bash
   npm run db:push
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/               # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application pages
│   │   ├── hooks/        # Custom React hooks
│   │   └── services/     # API service layers
├── server/               # Express backend application
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic services
│   ├── middleware/       # Express middleware
│   └── migrations/       # Database migrations
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema definitions
└── package.json          # Project dependencies
```

## Key Features Configuration

### Clerk Authentication Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Configure your domain in Clerk dashboard
3. Set up user metadata for role management:
   - `role`: "super_admin" | "reseller" | "user"
4. Add your publishable key to environment variables

### Database Schema

The application uses Drizzle ORM with PostgreSQL. Key tables:
- `users` - User authentication and profiles
- `tenants` - Multi-tenant organization data
- `contacts` - Customer relationship data
- `deals` - Sales pipeline management
- `tasks` - Task and activity tracking

### AI Integration

The platform includes built-in AI capabilities with optional API key configuration:
- OpenAI GPT-4 for content generation
- Google Gemini for business analysis
- Platform-provided APIs for immediate functionality

## Deployment

### Production Environment

1. **Database**: Deploy PostgreSQL (recommended: Neon, Supabase, or AWS RDS)
2. **Application**: Deploy to Vercel, Netlify, or any Node.js hosting
3. **Environment**: Configure production environment variables
4. **Domain**: Set up custom domain with Clerk authentication

### Build Commands

```bash
# Production build
npm run build

# Type checking
npm run type-check

# Database migration
npm run db:push
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

### Architecture Decisions

- **Single-page Application**: Client-side routing with React Router
- **API-first Design**: RESTful API with TypeScript interfaces
- **Type Safety**: End-to-end TypeScript for reliability
- **Component Library**: Consistent UI with shadcn/ui components
- **State Management**: Zustand for lightweight, efficient state

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions:
- Check the documentation in `replit.md`
- Review the codebase architecture
- Contact the development team

---

Built with ❤️ for modern sales teams