# Smart CRM Platform - Deployment Guide

## Quick Deployment Checklist

### 1. Database Setup
- [ ] PostgreSQL database provisioned
- [ ] Database URL configured in environment
- [ ] Schema deployed with `npm run db:push`

### 2. Authentication Setup
- [ ] Clerk application created
- [ ] Domain configured in Clerk dashboard
- [ ] Publishable key added to environment
- [ ] User roles configured in Clerk metadata

### 3. Environment Configuration
- [ ] `.env.local` created from `.env.example`
- [ ] All required environment variables set
- [ ] Production environment variables secured

### 4. Application Deployment
- [ ] Dependencies installed (`npm install`)
- [ ] Production build created (`npm run build`)
- [ ] Application deployed to hosting platform

## Detailed Setup Instructions

### Database Configuration

**Recommended Providers:**
- **Neon**: Serverless PostgreSQL (recommended)
- **Supabase**: Full-stack platform with PostgreSQL
- **AWS RDS**: Enterprise-grade PostgreSQL
- **Railway**: Simple PostgreSQL hosting

**Required Environment Variables:**
```env
DATABASE_URL=postgresql://user:password@host:port/database
PGHOST=your_host
PGPORT=5432
PGDATABASE=your_database
PGUSER=your_user
PGPASSWORD=your_password
```

### Clerk Authentication Setup

1. **Create Clerk Application**
   - Go to [dashboard.clerk.com](https://dashboard.clerk.com)
   - Create new application
   - Choose authentication methods

2. **Configure Domain**
   - Add your production domain
   - Set up redirect URLs
   - Configure session settings

3. **User Metadata Configuration**
   ```json
   {
     "role": "super_admin", // or "reseller" or "user"
     "tenant_id": "uuid-string"
   }
   ```

4. **Environment Variable**
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_key_here
   ```

### Hosting Platforms

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

#### Netlify Deployment
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables in Netlify dashboard
```

#### Railway Deployment
```bash
# Connect GitHub repository
# Set environment variables
# Deploy automatically on push
```

### Environment Variables Guide

**Required for Production:**
- `DATABASE_URL` - PostgreSQL connection string
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `SESSION_SECRET` - Session encryption key

**Optional (Platform provides fallbacks):**
- `OPENAI_API_KEY` - OpenAI API access
- `GOOGLE_API_KEY` - Google Gemini access

### Post-Deployment Verification

1. **Database Connection**
   - Verify tables are created
   - Test user authentication
   - Check data persistence

2. **Authentication Flow**
   - Test user login/logout
   - Verify role-based access
   - Check session management

3. **AI Features**
   - Test AI tool functionality
   - Verify API integrations
   - Check error handling

4. **Multi-Tenant Features**
   - Test tenant isolation
   - Verify white-label customization
   - Check partner management

### Production Optimization

#### Performance
- Enable HTTP/2 and compression
- Configure CDN for static assets
- Set up database connection pooling
- Implement caching strategies

#### Security
- Use HTTPS everywhere
- Configure CORS properly
- Set up rate limiting
- Enable security headers

#### Monitoring
- Set up error tracking (Sentry)
- Configure performance monitoring
- Set up uptime monitoring
- Enable logging and analytics

### Troubleshooting

**Common Issues:**

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure database exists

2. **Clerk Authentication Issues**
   - Verify publishable key
   - Check domain configuration
   - Ensure proper redirects

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Check TypeScript compilation

4. **AI Features Not Working**
   - Platform APIs should work without configuration
   - Check error logs for specific issues
   - Verify network connectivity

### Support

For deployment support:
- Check application logs for errors
- Verify environment variable configuration
- Test database connectivity
- Review Clerk dashboard for authentication issues

### Scaling Considerations

- **Database**: Use connection pooling for high traffic
- **Caching**: Implement Redis for session storage
- **CDN**: Use CloudFlare or AWS CloudFront
- **Load Balancing**: Multiple application instances
- **Monitoring**: Comprehensive logging and alerting