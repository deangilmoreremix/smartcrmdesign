# Smart CRM + White Label Platform Integration Guide

## Overview

This guide explains how to connect Smart CRM to the White Label Platform, enabling multi-tenant white label functionality.

## Architecture Components

### 1. Backend Integration Layer

#### White Label Client (`server/integrations/whiteLabelClient.ts`)
- Handles API communication with White Label Platform
- Manages tenant data, user provisioning, and feature toggles
- Reports usage data for billing

#### Tenant Middleware (`server/middleware/tenantMiddleware.ts`)
- Extracts tenant information from requests (subdomain, headers, etc.)
- Enforces tenant isolation and feature access controls
- Adds tenant context to all database operations

#### Webhook Handler (`server/integrations/webhookHandlers.ts`)
- Processes events from White Label Platform
- Handles tenant creation, updates, user provisioning, billing events
- Maintains CRM instance synchronization

### 2. Frontend Integration

#### Tenant Provider (`client/src/components/TenantProvider.tsx`)
- React context for tenant management
- Applies custom branding (colors, logos, company name)
- Manages feature access on the frontend

## Setup Instructions

### Step 1: Environment Configuration

Add these environment variables to your `.env` file:

```env
# White Label Platform Integration
WHITE_LABEL_API_URL=https://moonlit-tarsier-239e70.netlify.app/api
WHITE_LABEL_API_KEY=your_white_label_api_key_here
```

### Step 2: Database Schema Updates

Add tenant support to your database schema:

```sql
-- Add tenant_id column to existing tables
ALTER TABLE users ADD COLUMN tenant_id VARCHAR(255);
ALTER TABLE contacts ADD COLUMN tenant_id VARCHAR(255);
ALTER TABLE deals ADD COLUMN tenant_id VARCHAR(255);
ALTER TABLE tasks ADD COLUMN tenant_id VARCHAR(255);

-- Create tenant configuration table
CREATE TABLE tenant_configs (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(255) UNIQUE,
  custom_domain VARCHAR(255),
  branding JSONB,
  features JSONB,
  plan VARCHAR(50) DEFAULT 'basic',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_contacts_tenant_id ON contacts(tenant_id);
CREATE INDEX idx_deals_tenant_id ON deals(tenant_id);
CREATE INDEX idx_tasks_tenant_id ON tasks(tenant_id);
```

### Step 3: API Integration Points

#### Core Integration Endpoints

1. **Webhook Endpoint** - Receives events from White Label Platform
   ```
   POST /api/webhooks/white-label
   ```

2. **Tenant Management** - For platform administrators
   ```
   GET /api/white-label/tenants/:tenantId
   POST /api/white-label/tenants
   PUT /api/white-label/tenants/:tenantId
   ```

3. **Usage Reporting** - Send CRM usage data to platform
   ```
   POST /api/white-label/tenants/:tenantId/usage
   ```

4. **Tenant Info** - For CRM frontend
   ```
   GET /api/tenant/info
   ```

### Step 4: Tenant Detection Methods

The system supports multiple tenant identification methods:

1. **Subdomain**: `tenant-name.your-crm-domain.com`
2. **Custom Domain**: `crm.client-domain.com`
3. **Header**: `X-Tenant-ID: tenant-id`
4. **Query Parameter**: `?tenant=tenant-id`
5. **JWT Token**: Tenant ID embedded in authentication token

### Step 5: Feature Access Control

Protected routes automatically check tenant features:

```javascript
// Example: AI tools require 'aiTools' feature
app.post("/api/ai/generate-content", 
  requireAuth, 
  requireFeature('aiTools'), 
  async (req, res) => {
    // AI content generation logic
  }
);
```

### Step 6: Frontend Integration

Wrap your app with the TenantProvider:

```jsx
import { TenantProvider } from './components/TenantProvider';

function App() {
  return (
    <TenantProvider>
      <YourAppComponents />
    </TenantProvider>
  );
}
```

Use tenant context in components:

```jsx
import { useTenant } from './components/TenantProvider';

function SomeComponent() {
  const { tenant, hasFeature } = useTenant();
  
  return (
    <div>
      {hasFeature('aiTools') && (
        <AIToolsSection />
      )}
    </div>
  );
}
```

## White Label Platform Events

The webhook handler processes these event types:

- `tenant.created` - New tenant CRM instance setup
- `tenant.updated` - Tenant configuration changes
- `tenant.deleted` - Tenant CRM cleanup
- `user.provisioned` - New user added to tenant
- `feature.toggled` - Feature access changes
- `billing.event` - Billing status changes (suspend/reactivate)

## Testing the Integration

### Local Development Testing

1. **Set Tenant ID for Testing**:
   ```javascript
   localStorage.setItem('tenantId', 'test-tenant');
   ```

2. **Test with Query Parameter**:
   ```
   http://localhost:5000?tenant=test-tenant
   ```

3. **Test with Headers**:
   ```bash
   curl -H "X-Tenant-ID: test-tenant" http://localhost:5000/api/tenant/info
   ```

### Production Subdomain Setup

1. Configure DNS wildcard: `*.your-crm-domain.com`
2. Set up SSL certificates for subdomains
3. Configure reverse proxy (nginx/cloudflare) to route subdomains

## Custom Branding Implementation

The TenantProvider automatically applies:

- Custom CSS variables for colors
- Company name in page title
- Custom favicon from tenant logo
- Theme-specific styling

CSS variables available:
```css
:root {
  --primary-color: /* tenant primary color */;
  --secondary-color: /* tenant secondary color */;
}
```

## Security Considerations

1. **Tenant Isolation**: All data queries include tenant filtering
2. **Feature Access**: Features are validated on both frontend and backend
3. **Webhook Security**: Webhook signatures are validated
4. **API Authentication**: All endpoints require proper authentication

## Monitoring and Analytics

Usage data automatically reported to White Label Platform:

- API call counts
- Feature usage statistics
- Storage utilization
- User activity metrics

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema updated with tenant support
- [ ] DNS wildcard configured for subdomains
- [ ] SSL certificates set up
- [ ] White Label Platform webhook URL configured
- [ ] API keys exchanged and tested
- [ ] Tenant isolation tested
- [ ] Feature access controls tested
- [ ] Custom branding verified

## Troubleshooting

### Common Issues

1. **Tenant Not Detected**
   - Check subdomain configuration
   - Verify DNS setup
   - Test with manual tenant ID

2. **Features Not Working**
   - Verify tenant feature configuration
   - Check White Label Platform settings
   - Test feature toggle webhooks

3. **Branding Not Applied**
   - Check tenant branding data
   - Verify CSS variable injection
   - Clear browser cache

### Debug Endpoints

- `GET /api/tenant/info` - Check current tenant context
- Check browser console for tenant provider logs
- Monitor webhook delivery in White Label Platform

## Production Scaling

For high-volume deployments:

1. Implement tenant-specific database sharding
2. Use Redis for tenant configuration caching
3. Set up CDN for tenant-specific assets
4. Implement connection pooling per tenant
5. Add monitoring for tenant-specific metrics

This integration provides a complete white label solution where each tenant gets their own branded CRM instance with controlled feature access and usage tracking.