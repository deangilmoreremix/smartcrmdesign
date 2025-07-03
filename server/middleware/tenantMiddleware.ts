import { Request, Response, NextFunction } from 'express';
import { whiteLabelClient } from '../integrations/whiteLabelClient';
import { tenantService } from '../services/tenantService';
import { type Tenant, type FeatureKey, type PermissionKey } from '@shared/schema';

export interface TenantRequest extends Request {
  tenantId?: string;
  tenant?: Tenant;
  tenantFeatures?: any;
  userId?: string;
}

export interface AuthenticatedRequest extends TenantRequest {
  userId: string;
  userPermissions?: PermissionKey[];
}

// Helper function to validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Enhanced middleware to extract tenant information from request
 * Supports multiple methods:
 * 1. Subdomain (tenant.crm-platform.com)
 * 2. Custom domain (client.com)
 * 3. Header (X-Tenant-ID)
 * 4. Query parameter (?tenant=abc)
 */
export const extractTenant = async (req: TenantRequest, res: Response, next: NextFunction) => {
  try {
    let tenant: Tenant | undefined = undefined;

    // Method 1: Extract from subdomain (skip for Replit development environments)
    const host = req.get('host') || '';
    const subdomain = host.split('.')[0];
    
    // Skip tenant extraction for Replit development domains
    const isReplitDev = host.includes('replit.dev') || host.includes('riker.replit.dev');
    
    if (subdomain && subdomain !== 'www' && subdomain !== 'api' && subdomain !== 'localhost' && !isReplitDev) {
      tenant = await tenantService.getTenantBySubdomain(subdomain);
    }

    // Method 2: Check for custom domain
    if (!tenant) {
      tenant = await tenantService.getTenantByDomain(host);
    }

    // Method 3: Check headers
    if (!tenant) {
      const tenantId = req.get('X-Tenant-ID');
      if (tenantId && isValidUUID(tenantId)) {
        tenant = await tenantService.getTenant(tenantId);
      }
    }

    // Method 4: Check query parameters
    if (!tenant) {
      const tenantId = req.query.tenant as string;
      if (tenantId && isValidUUID(tenantId)) {
        tenant = await tenantService.getTenant(tenantId);
      }
    }

    // Method 5: Extract from user context if authenticated
    if (!tenant && (req as any).user) {
      const userId = (req as any).user.id;
      if (userId) {
        // This would require a user lookup to get tenant - implement if needed
        // For now we'll continue with fallback logic
      }
    }

    // Method 6: Use default tenant for development/migration
    if (!tenant) {
      const defaultTenantId = '630ed3be-0533-43ff-a569-2051df9c4d20'; // Default tenant created during migration
      try {
        const defaultTenant = await tenantService.getTenant(defaultTenantId);
        if (defaultTenant) {
          tenant = defaultTenant;
        }
      } catch (error) {
        console.warn(`Failed to fetch default tenant:`, error);
      }
    }

    // Set tenant information in request
    if (tenant) {
      req.tenantId = tenant.id;
      req.tenant = tenant;
      req.tenantFeatures = tenant.featureFlags;
    }

    next();
  } catch (error) {
    console.error('Tenant extraction error:', error);
    next(); // Continue without tenant info
  }
};

/**
 * Middleware to require tenant identification
 */
export const requireTenant = (req: TenantRequest, res: Response, next: NextFunction) => {
  if (!req.tenantId) {
    return res.status(400).json({
      error: 'Tenant identification required',
      message: 'Please provide tenant information via subdomain, header, or query parameter'
    });
  }
  next();
};

/**
 * Middleware to check if tenant has access to specific features
 */
export const requireFeature = (featureName: FeatureKey) => {
  return async (req: TenantRequest, res: Response, next: NextFunction) => {
    if (!req.tenantId) {
      return res.status(400).json({
        error: 'Tenant identification required for feature access'
      });
    }

    try {
      const hasAccess = await tenantService.hasFeatureAccess(req.tenantId, featureName);
      if (!hasAccess) {
        return res.status(403).json({
          error: 'Feature not available',
          message: `This tenant does not have access to feature: ${featureName}`
        });
      }

      // Track feature usage
      await tenantService.trackFeatureUsage(req.tenantId, featureName);
      next();
    } catch (error) {
      console.error('Feature access check failed:', error);
      return res.status(500).json({
        error: 'Feature access check failed'
      });
    }
  };
};

/**
 * Middleware to check if user has specific permissions
 */
export const requirePermission = (permission: PermissionKey) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    try {
      const hasPermission = await tenantService.hasPermission(req.userId, permission);
      if (!hasPermission) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: `This user does not have permission: ${permission}`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check failed:', error);
      return res.status(500).json({
        error: 'Permission check failed'
      });
    }
  };
};

/**
 * Middleware to ensure tenant is active
 */
export const requireActiveTenant = (req: TenantRequest, res: Response, next: NextFunction) => {
  if (!req.tenant) {
    return res.status(400).json({
      error: 'Tenant not found'
    });
  }

  if (req.tenant.status !== 'active') {
    return res.status(403).json({
      error: 'Tenant not active',
      message: `Tenant status: ${req.tenant.status}`
    });
  }

  next();
};

/**
 * Helper function to find tenant by custom domain
 * This would typically query a database or cache
 */
async function findTenantByDomain(domain: string): Promise<string | null> {
  // In a real implementation, this would check a database
  // For now, return null to fallback to other methods
  return null;
}

/**
 * Middleware to add tenant context to database queries
 */
export const addTenantContext = (req: TenantRequest, res: Response, next: NextFunction) => {
  if (req.tenantId) {
    // Add tenant filter to all database operations
    req.query.tenantId = req.tenantId;
  }
  next();
};