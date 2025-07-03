import { Router } from 'express';
import { eq, and, desc, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { 
  partners, 
  partnerCustomers, 
  revenueSharing, 
  partnerBilling,
  featurePackages,
  tenants,
  insertPartnerSchema,
  insertPartnerCustomerSchema,
  insertRevenueSharingSchema,
  insertPartnerBillingSchema,
  type Partner,
  type PartnerCustomer,
  type RevenueSharing,
  type PartnerBilling
} from '@shared/schema';

const router = Router();

// Get all partners
router.get('/', async (req, res) => {
  try {
    const allPartners = await db
      .select()
      .from(partners)
      .orderBy(desc(partners.createdAt));

    res.json(allPartners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// Get partner by Clerk organization ID
router.get('/organization/:orgId', async (req, res) => {
  try {
    const { orgId } = req.params;
    
    const partner = await db
      .select()
      .from(partners)
      .where(eq(partners.clerkOrganizationId, orgId))
      .limit(1);

    if (partner.length === 0) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json(partner[0]);
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ error: 'Failed to fetch partner' });
  }
});

// Create new partner
router.post('/', async (req, res) => {
  try {
    const validatedData = insertPartnerSchema.parse(req.body);
    
    const [newPartner] = await db
      .insert(partners)
      .values(validatedData)
      .returning();

    res.status(201).json(newPartner);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ error: 'Failed to create partner' });
  }
});

// Get partner metrics
router.get('/:partnerId/metrics', async (req, res) => {
  try {
    const { partnerId } = req.params;

    // Get total customers
    const customerCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(partnerCustomers)
      .where(eq(partnerCustomers.partnerId, partnerId));

    // Get revenue metrics
    const revenueData = await db
      .select({
        totalRevenue: sql<number>`SUM(${revenueSharing.customerRevenue})`,
        totalCommission: sql<number>`SUM(${revenueSharing.partnerCommission})`,
        pendingAmount: sql<number>`SUM(CASE WHEN ${revenueSharing.status} = 'pending' THEN ${revenueSharing.partnerCommission} ELSE 0 END)`,
        paidAmount: sql<number>`SUM(CASE WHEN ${revenueSharing.status} = 'paid' THEN ${revenueSharing.partnerCommission} ELSE 0 END)`,
      })
      .from(revenueSharing)
      .where(eq(revenueSharing.partnerId, partnerId));

    // Get active subscriptions
    const activeSubscriptions = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(partnerCustomers)
      .where(and(
        eq(partnerCustomers.partnerId, partnerId),
        eq(partnerCustomers.billingStatus, 'active')
      ));

    // Get partner commission rate
    const partner = await db
      .select({ commissionRate: partners.commissionRate })
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1);

    const metrics = {
      totalCustomers: customerCount[0]?.count || 0,
      monthlyRevenue: revenueData[0]?.totalRevenue || 0,
      commissionEarned: revenueData[0]?.totalCommission || 0,
      pendingPayouts: revenueData[0]?.pendingAmount || 0,
      paidPayouts: revenueData[0]?.paidAmount || 0,
      activeSubscriptions: activeSubscriptions[0]?.count || 0,
      commissionRate: partner[0]?.commissionRate || 0.20,
      growthRate: 15, // Calculate based on historical data
      churnRate: 3, // Calculate based on cancellations
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching partner metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get partner customers
router.get('/:partnerId/customers', async (req, res) => {
  try {
    const { partnerId } = req.params;

    const customers = await db
      .select({
        id: partnerCustomers.id,
        clerkUserId: partnerCustomers.clerkUserId,
        packageId: partnerCustomers.packageId,
        billingStatus: partnerCustomers.billingStatus,
        subscriptionStart: partnerCustomers.subscriptionStart,
        subscriptionEnd: partnerCustomers.subscriptionEnd,
        packageName: featurePackages.name,
        packagePrice: featurePackages.price,
      })
      .from(partnerCustomers)
      .leftJoin(featurePackages, eq(partnerCustomers.packageId, featurePackages.id))
      .where(eq(partnerCustomers.partnerId, partnerId))
      .orderBy(desc(partnerCustomers.createdAt));

    // Transform to match expected interface
    const customerAnalytics = customers.map(customer => ({
      id: customer.id,
      name: `Customer ${customer.clerkUserId.slice(-8)}`, // In real app, fetch from Clerk
      email: `customer@${customer.clerkUserId}.example.com`, // In real app, fetch from Clerk
      package: customer.packageName || 'Basic',
      status: customer.billingStatus as 'active' | 'suspended' | 'cancelled',
      monthlyValue: parseFloat(customer.packagePrice || '0'),
      joinDate: customer.subscriptionStart?.toISOString() || new Date().toISOString(),
      lastActive: new Date().toISOString(), // In real app, track last activity
      usageScore: Math.floor(Math.random() * 100), // In real app, calculate from usage data
    }));

    res.json(customerAnalytics);
  } catch (error) {
    console.error('Error fetching partner customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get revenue summary
router.get('/:partnerId/revenue-summary', async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { period = 'last-6-months' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'last-3-months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'last-6-months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'last-12-months':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'ytd':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const revenueData = await db
      .select({
        totalRevenue: sql<number>`SUM(${revenueSharing.customerRevenue})`,
        totalCommission: sql<number>`SUM(${revenueSharing.partnerCommission})`,
        pendingAmount: sql<number>`SUM(CASE WHEN ${revenueSharing.status} = 'pending' THEN ${revenueSharing.partnerCommission} ELSE 0 END)`,
        paidAmount: sql<number>`SUM(CASE WHEN ${revenueSharing.status} = 'paid' THEN ${revenueSharing.partnerCommission} ELSE 0 END)`,
      })
      .from(revenueSharing)
      .where(and(
        eq(revenueSharing.partnerId, partnerId),
        sql`${revenueSharing.createdAt} >= ${startDate.toISOString()}`
      ));

    const partner = await db
      .select({ commissionRate: partners.commissionRate })
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1);

    const summary = {
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      totalCommission: revenueData[0]?.totalCommission || 0,
      pendingPayouts: revenueData[0]?.pendingAmount || 0,
      paidPayouts: revenueData[0]?.paidAmount || 0,
      commissionRate: partner[0]?.commissionRate || 0.20,
      growthRate: 12, // Calculate from historical data
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching revenue summary:', error);
    res.status(500).json({ error: 'Failed to fetch revenue summary' });
  }
});

// Get monthly revenue data
router.get('/:partnerId/monthly-revenue', async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { period = 'last-6-months' } = req.query;

    // Generate sample monthly data (in real app, aggregate from database)
    const months = [];
    const now = new Date();
    const periodMonths = period === 'last-3-months' ? 3 : 
                        period === 'last-6-months' ? 6 : 
                        period === 'last-12-months' ? 12 : 12;

    for (let i = periodMonths - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      months.push({
        month: monthName,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        commission: Math.floor(Math.random() * 10000) + 2000,
        customers: Math.floor(Math.random() * 20) + 5,
      });
    }

    res.json(months);
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    res.status(500).json({ error: 'Failed to fetch monthly revenue' });
  }
});

// Get revenue sharing records
router.get('/:partnerId/revenue-records', async (req, res) => {
  try {
    const { partnerId } = req.params;

    const records = await db
      .select()
      .from(revenueSharing)
      .where(eq(revenueSharing.partnerId, partnerId))
      .orderBy(desc(revenueSharing.createdAt))
      .limit(50);

    res.json(records);
  } catch (error) {
    console.error('Error fetching revenue records:', error);
    res.status(500).json({ error: 'Failed to fetch revenue records' });
  }
});

// Get billing history
router.get('/:partnerId/billing-history', async (req, res) => {
  try {
    const { partnerId } = req.params;

    const billingHistory = await db
      .select()
      .from(partnerBilling)
      .where(eq(partnerBilling.partnerId, partnerId))
      .orderBy(desc(partnerBilling.createdAt))
      .limit(50);

    res.json(billingHistory);
  } catch (error) {
    console.error('Error fetching billing history:', error);
    res.status(500).json({ error: 'Failed to fetch billing history' });
  }
});

// Create revenue sharing record
router.post('/:partnerId/revenue-records', async (req, res) => {
  try {
    const { partnerId } = req.params;
    const validatedData = insertRevenueSharingSchema.parse({
      ...req.body,
      partnerId,
    });

    const [record] = await db
      .insert(revenueSharing)
      .values(validatedData)
      .returning();

    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating revenue record:', error);
    res.status(500).json({ error: 'Failed to create revenue record' });
  }
});

// Add customer to partner
router.post('/:partnerId/customers', async (req, res) => {
  try {
    const { partnerId } = req.params;
    const validatedData = insertPartnerCustomerSchema.parse({
      ...req.body,
      partnerId,
    });

    const [customer] = await db
      .insert(partnerCustomers)
      .values(validatedData)
      .returning();

    res.status(201).json(customer);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// Update partner
router.patch('/:partnerId', async (req, res) => {
  try {
    const { partnerId } = req.params;
    const validatedData = insertPartnerSchema.partial().parse(req.body);

    const [updatedPartner] = await db
      .update(partners)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(partners.id, partnerId))
      .returning();

    if (!updatedPartner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json(updatedPartner);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ error: 'Failed to update partner' });
  }
});

// Export revenue report
router.get('/:partnerId/revenue-report', async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { period = 'last-6-months' } = req.query;

    // In real implementation, generate CSV/PDF report
    const reportData = {
      partner: await db.select().from(partners).where(eq(partners.id, partnerId)).limit(1),
      revenueRecords: await db.select().from(revenueSharing).where(eq(revenueSharing.partnerId, partnerId)),
      period,
      generatedAt: new Date().toISOString(),
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="revenue-report-${period}.json"`);
    res.json(reportData);
  } catch (error) {
    console.error('Error generating revenue report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;