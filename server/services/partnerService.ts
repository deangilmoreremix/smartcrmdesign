import { db } from '../db';
import { tenants, subscriptionPlans, userRoles, tenantSubscriptions, type Tenant, type SubscriptionPlan } from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export interface PartnerOnboardingData {
  companyName: string;
  contactEmail: string;
  contactName: string;
  phone?: string;
  website?: string;
  expectedCustomers: number;
  businessType: string;
  subdomain: string;
  customDomain?: string;
  brandingConfig: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
  };
}

export interface PartnerStats {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  customerGrowthRate: number;
}

export class PartnerService {
  /**
   * Create a new white-label partner tenant
   */
  async createPartner(data: PartnerOnboardingData): Promise<Tenant> {
    const partnerId = nanoid();
    
    const partnerTenant = await db.insert(tenants).values({
      id: partnerId,
      name: data.companyName,
      type: 'partner',
      parentTenantId: null,
      subdomain: data.subdomain,
      customDomain: data.customDomain,
      status: 'pending_approval',
      brandingConfig: {
        logo: data.brandingConfig.logo,
        companyName: data.companyName,
        primaryColor: data.brandingConfig.primaryColor,
        secondaryColor: data.brandingConfig.secondaryColor,
      },
      featureFlags: {
        aiTools: true,
        apiAccess: true,
        whiteLabel: true,
        multiTenant: true,
        voiceAnalysis: true,
        customBranding: true,
        documentAnalysis: true,
        advancedAnalytics: true,
      },
      metadata: {
        contactEmail: data.contactEmail,
        contactName: data.contactName,
        phone: data.phone,
        website: data.website,
        expectedCustomers: data.expectedCustomers,
        businessType: data.businessType,
        onboardingDate: new Date().toISOString(),
      },
    }).returning();

    // Create default subscription plan for the partner
    await db.insert(subscriptionPlans).values({
      name: 'Partner Plan',
      planType: 'partner',
      price: '0',
      billingCycle: 'monthly',
      features: {
        maxCustomers: data.expectedCustomers,
        maxUsers: 1000,
        aiCredits: 10000,
        customBranding: true,
        apiAccess: true,
        priority: 'high',
      },
      usageLimits: {
        maxCustomers: data.expectedCustomers,
        maxUsers: 1000,
        maxApiCalls: 100000,
        maxStorageGB: 100,
      },
      isActive: true,
    });

    // Create partner admin role
    await db.insert(userRoles).values({
      name: 'Partner Admin',
      tenantId: partnerId,
      permissions: [
        'customer_create',
        'customer_read',
        'customer_update',
        'customer_delete',
        'billing_read',
        'billing_write',
        'branding_read',
        'branding_write',
        'analytics_read',
        'support_read',
        'support_write',
      ],
      isSystem: false,
    });

    return partnerTenant[0];
  }

  /**
   * Get partner dashboard statistics
   */
  async getPartnerStats(partnerId: string): Promise<PartnerStats> {
    // Get customer count
    const customerCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(tenants)
      .where(and(
        eq(tenants.parentTenantId, partnerId),
        eq(tenants.type, 'customer')
      ));

    // Get active customer count
    const activeCustomerCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(tenants)
      .where(and(
        eq(tenants.parentTenantId, partnerId),
        eq(tenants.type, 'customer'),
        eq(tenants.status, 'active')
      ));

    // Calculate revenue metrics (simplified - would integrate with billing system)
    const subscriptions = await db
      .select()
      .from(subscriptionPlans)
      .innerJoin(tenants, eq(subscriptionPlans.tenantId, tenants.id))
      .where(and(
        eq(tenants.parentTenantId, partnerId),
        eq(subscriptionPlans.isActive, true)
      ));

    const totalRevenue = subscriptions.reduce((sum, sub) => {
      return sum + parseFloat(sub.subscription_plans.price);
    }, 0);

    const monthlyRevenue = subscriptions
      .filter(sub => sub.subscription_plans.billingCycle === 'monthly')
      .reduce((sum, sub) => sum + parseFloat(sub.subscription_plans.price), 0);

    // Calculate growth rate (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCustomers = await db
      .select({ count: sql<number>`count(*)` })
      .from(tenants)
      .where(and(
        eq(tenants.parentTenantId, partnerId),
        eq(tenants.type, 'customer'),
        sql`${tenants.createdAt} >= ${thirtyDaysAgo}`
      ));

    const growthRate = customerCount[0].count > 0 
      ? (recentCustomers[0].count / customerCount[0].count) * 100 
      : 0;

    return {
      totalCustomers: customerCount[0].count,
      activeCustomers: activeCustomerCount[0].count,
      totalRevenue,
      monthlyRevenue,
      customerGrowthRate: growthRate,
    };
  }

  /**
   * Create a customer tenant for a partner
   */
  async createCustomerForPartner(
    partnerId: string, 
    customerData: {
      name: string;
      subdomain: string;
      customDomain?: string;
      contactEmail: string;
      planType: 'basic' | 'professional' | 'enterprise';
      brandingConfig?: any;
    }
  ): Promise<Tenant> {
    const customerId = nanoid();

    // Get partner's branding for inheritance
    const partner = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, partnerId))
      .limit(1);

    if (!partner[0]) {
      throw new Error('Partner not found');
    }

    const customerTenant = await db.insert(tenants).values({
      id: customerId,
      name: customerData.name,
      type: 'customer',
      parentTenantId: partnerId,
      subdomain: customerData.subdomain,
      customDomain: customerData.customDomain,
      status: 'active',
      brandingConfig: customerData.brandingConfig || {
        ...partner[0].brandingConfig,
        companyName: customerData.name,
      },
      featureFlags: {
        aiTools: true,
        apiAccess: true,
        whiteLabel: false,
        multiTenant: false,
        voiceAnalysis: true,
        customBranding: false,
        documentAnalysis: true,
        advancedAnalytics: true,
      },
      metadata: {
        contactEmail: customerData.contactEmail,
        partnerId: partnerId,
        planType: customerData.planType,
        createdBy: 'partner',
        createdDate: new Date().toISOString(),
      },
    }).returning();

    // Create customer subscription plan
    const planPrices = {
      basic: '49',
      professional: '99',
      enterprise: '199',
    };

    await db.insert(subscriptionPlans).values({
      id: nanoid(),
      tenantId: customerId,
      planName: `${customerData.planType.charAt(0).toUpperCase() + customerData.planType.slice(1)} Plan`,
      planType: customerData.planType,
      price: planPrices[customerData.planType],
      billingCycle: 'monthly',
      features: {
        maxUsers: customerData.planType === 'basic' ? 10 : customerData.planType === 'professional' ? 50 : 200,
        aiCredits: customerData.planType === 'basic' ? 1000 : customerData.planType === 'professional' ? 5000 : 20000,
        customBranding: customerData.planType !== 'basic',
        apiAccess: true,
        priority: customerData.planType === 'enterprise' ? 'high' : 'normal',
      },
      limits: {
        maxUsers: customerData.planType === 'basic' ? 10 : customerData.planType === 'professional' ? 50 : 200,
        maxApiCalls: customerData.planType === 'basic' ? 10000 : customerData.planType === 'professional' ? 50000 : 200000,
        maxStorageGB: customerData.planType === 'basic' ? 10 : customerData.planType === 'professional' ? 50 : 200,
      },
      isActive: true,
    });

    // Create default customer admin role
    await db.insert(tenantRoles).values({
      id: nanoid(),
      tenantId: customerId,
      name: 'Customer Admin',
      permissions: [
        'user_create',
        'user_read',
        'user_update',
        'user_delete',
        'contact_create',
        'contact_read',
        'contact_update',
        'contact_delete',
        'deal_create',
        'deal_read',
        'deal_update',
        'deal_delete',
        'analytics_read',
      ],
      isSystem: false,
    });

    return customerTenant[0];
  }

  /**
   * Get all customers for a partner
   */
  async getPartnerCustomers(partnerId: string): Promise<Tenant[]> {
    return await db
      .select()
      .from(tenants)
      .where(and(
        eq(tenants.parentTenantId, partnerId),
        eq(tenants.type, 'customer')
      ));
  }

  /**
   * Approve a pending partner
   */
  async approvePartner(partnerId: string): Promise<Tenant> {
    const [updatedTenant] = await db
      .update(tenants)
      .set({ 
        status: 'active',
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, partnerId))
      .returning();

    return updatedTenant;
  }

  /**
   * Get all pending partners (for super admin)
   */
  async getPendingPartners(): Promise<Tenant[]> {
    return await db
      .select()
      .from(tenants)
      .where(and(
        eq(tenants.type, 'partner'),
        eq(tenants.status, 'pending_approval')
      ));
  }

  /**
   * Get all active partners
   */
  async getActivePartners(): Promise<Tenant[]> {
    return await db
      .select()
      .from(tenants)
      .where(and(
        eq(tenants.type, 'partner'),
        eq(tenants.status, 'active')
      ));
  }
}

export const partnerService = new PartnerService();