import { db } from "../db";
import { tenants, users, userRoles, subscriptionPlans, tenantSubscriptions, featureUsage, type Tenant, type InsertTenant, type User, type InsertUser, type FeatureKey, type PermissionKey, FEATURES, USER_PERMISSIONS } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export class TenantService {
  // ============= TENANT MANAGEMENT =============
  
  async createTenant(data: InsertTenant): Promise<Tenant> {
    const [tenant] = await db.insert(tenants).values(data).returning();
    
    // Create default roles for the tenant
    await this.createDefaultRoles(tenant.id);
    
    return tenant;
  }
  
  async getTenant(id: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }
  
  async getTenantBySubdomain(subdomain: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain));
    return tenant;
  }
  
  async getTenantByDomain(domain: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.customDomain, domain));
    return tenant;
  }
  
  async updateTenant(id: string, data: Partial<InsertTenant>): Promise<Tenant> {
    const [tenant] = await db
      .update(tenants)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return tenant;
  }
  
  async suspendTenant(id: string): Promise<void> {
    await db
      .update(tenants)
      .set({ status: 'suspended', updatedAt: new Date() })
      .where(eq(tenants.id, id));
  }
  
  async activateTenant(id: string): Promise<void> {
    await db
      .update(tenants)
      .set({ status: 'active', updatedAt: new Date() })
      .where(eq(tenants.id, id));
  }
  
  // ============= FEATURE MANAGEMENT =============
  
  async hasFeatureAccess(tenantId: string, feature: FeatureKey): Promise<boolean> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant || tenant.status !== 'active') return false;
    
    const subscription = await this.getCurrentSubscription(tenantId);
    if (!subscription) return false;
    
    const plan = await this.getSubscriptionPlan(subscription.planId);
    if (!plan) return false;
    
    // Check if feature is enabled in tenant's feature flags
    const tenantFeatures = tenant.featureFlags as Record<string, boolean>;
    if (tenantFeatures[feature] === false) return false;
    
    // Check if feature is included in subscription plan
    const planFeatures = plan.features as Record<string, boolean>;
    return planFeatures[feature] === true;
  }
  
  async updateFeatureFlags(tenantId: string, features: Record<string, boolean>): Promise<void> {
    await db
      .update(tenants)
      .set({ 
        featureFlags: features,
        updatedAt: new Date()
      })
      .where(eq(tenants.id, tenantId));
  }
  
  async trackFeatureUsage(tenantId: string, feature: FeatureKey, data?: any): Promise<void> {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of current month
    
    await db
      .insert(featureUsage)
      .values({
        tenantId,
        featureName: feature,
        usageCount: 1,
        usageData: data || {},
        periodStart,
        periodEnd,
      })
      .onConflictDoUpdate({
        target: [featureUsage.tenantId, featureUsage.featureName, featureUsage.periodStart],
        set: {
          usageCount: sql`${featureUsage.usageCount} + 1`,
          usageData: data || {},
          updatedAt: now,
        },
      });
  }
  
  async getFeatureUsage(tenantId: string, feature: FeatureKey, periodStart?: Date, periodEnd?: Date): Promise<number> {
    const now = new Date();
    const start = periodStart || new Date(now.getFullYear(), now.getMonth(), 1);
    const end = periodEnd || new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const [usage] = await db
      .select({ count: featureUsage.usageCount })
      .from(featureUsage)
      .where(
        and(
          eq(featureUsage.tenantId, tenantId),
          eq(featureUsage.featureName, feature),
          eq(featureUsage.periodStart, start)
        )
      );
    
    return usage?.count || 0;
  }
  
  // ============= SUBSCRIPTION MANAGEMENT =============
  
  async getCurrentSubscription(tenantId: string) {
    const [subscription] = await db
      .select()
      .from(tenantSubscriptions)
      .where(
        and(
          eq(tenantSubscriptions.tenantId, tenantId),
          eq(tenantSubscriptions.status, 'active')
        )
      );
    return subscription;
  }
  
  async getSubscriptionPlan(planId: string) {
    const [plan] = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, planId));
    return plan;
  }
  
  // ============= ROLE MANAGEMENT =============
  
  async createDefaultRoles(tenantId: string): Promise<void> {
    const defaultRoles = [
      {
        name: 'Admin',
        description: 'Full access to tenant features',
        permissions: [
          USER_PERMISSIONS.CUSTOMER_ADMIN,
          USER_PERMISSIONS.MANAGE_USERS,
          USER_PERMISSIONS.MANAGE_BILLING,
          USER_PERMISSIONS.TENANT_SETTINGS,
          USER_PERMISSIONS.USER_READ,
          USER_PERMISSIONS.USER_WRITE,
          USER_PERMISSIONS.USER_DELETE,
        ],
        tenantId,
        isSystem: true,
      },
      {
        name: 'User',
        description: 'Standard user access',
        permissions: [
          USER_PERMISSIONS.USER_READ,
          USER_PERMISSIONS.USER_WRITE,
        ],
        tenantId,
        isSystem: true,
      },
      {
        name: 'Viewer',
        description: 'Read-only access',
        permissions: [
          USER_PERMISSIONS.USER_READ,
        ],
        tenantId,
        isSystem: true,
      },
    ];
    
    await db.insert(userRoles).values(defaultRoles);
  }
  
  async hasPermission(userId: string, permission: PermissionKey): Promise<boolean> {
    const [user] = await db
      .select({
        permissions: users.permissions,
        rolePermissions: userRoles.permissions,
        isAdmin: users.isAdmin,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.roleId, userRoles.id))
      .where(eq(users.id, userId));
    
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.isAdmin) return true;
    
    // Check user-specific permissions
    const userPermissions = user.permissions as PermissionKey[];
    if (userPermissions.includes(permission)) return true;
    
    // Check role permissions
    const rolePermissions = user.rolePermissions as PermissionKey[];
    return rolePermissions.includes(permission);
  }
  
  // ============= BRANDING MANAGEMENT =============
  
  async updateBranding(tenantId: string, branding: any): Promise<void> {
    await db
      .update(tenants)
      .set({ 
        brandingConfig: branding,
        updatedAt: new Date()
      })
      .where(eq(tenants.id, tenantId));
  }
  
  async getBranding(tenantId: string): Promise<any> {
    const tenant = await this.getTenant(tenantId);
    return tenant?.brandingConfig || {};
  }
  
  // ============= WHITE LABEL PARTNER MANAGEMENT =============
  
  async createPartner(data: InsertTenant & { adminUser: Partial<InsertUser> }): Promise<{ tenant: Tenant; user: User }> {
    const partnerData = {
      ...data,
      type: 'partner' as const,
    };
    
    const tenant = await this.createTenant(partnerData);
    
    // Create admin user for the partner
    const [user] = await db.insert(users).values({
      email: data.adminUser.email || '',
      fullName: data.adminUser.fullName || '',
      tenantId: tenant.id,
      isAdmin: true,
      ...data.adminUser,
    }).returning();
    
    return { tenant, user };
  }
  
  async getPartnerCustomers(partnerId: string): Promise<Tenant[]> {
    return await db
      .select()
      .from(tenants)
      .where(eq(tenants.parentTenantId, partnerId));
  }
  
  async createCustomerForPartner(partnerId: string, customerData: InsertTenant): Promise<Tenant> {
    return await this.createTenant({
      ...customerData,
      type: 'customer',
      parentTenantId: partnerId,
    });
  }
  
  // ============= ANALYTICS =============
  
  async getTenantAnalytics(tenantId: string) {
    // Get basic tenant stats
    const [userCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.tenantId, tenantId));
    
    // Get feature usage for current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const featureUsageStats = await db
      .select({
        featureName: featureUsage.featureName,
        usageCount: featureUsage.usageCount,
      })
      .from(featureUsage)
      .where(
        and(
          eq(featureUsage.tenantId, tenantId),
          eq(featureUsage.periodStart, monthStart)
        )
      );
    
    return {
      userCount: userCount.count,
      featureUsage: featureUsageStats,
    };
  }
}

export const tenantService = new TenantService();