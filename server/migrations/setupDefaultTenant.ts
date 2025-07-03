import { db } from "../db";
import { tenants, users, contacts, deals, tasks, businessAnalysis, contentItems, voiceProfiles, subscriptionPlans, tenantSubscriptions, userRoles, type Tenant } from "@shared/schema";
import { eq, isNull } from "drizzle-orm";

/**
 * Migration script to set up default tenant and update existing data
 * This ensures backward compatibility during the multi-tenant migration
 */
export async function setupDefaultTenant(): Promise<Tenant> {
  console.log("Starting default tenant setup...");

  // Step 1: Create default subscription plan
  const [defaultPlan] = await db.insert(subscriptionPlans).values({
    name: "Default Plan",
    description: "Default subscription plan for existing users",
    price: "0.00",
    billingPeriod: "monthly",
    features: {
      aiTools: true,
      maxUsers: 1000,
      maxContacts: 10000,
      maxDeals: 5000,
      customBranding: false,
      apiAccess: true,
      support: "standard"
    },
    isActive: true
  }).onConflictDoNothing().returning();

  console.log("Created default subscription plan:", defaultPlan?.id);

  // Step 2: Create default tenant
  const [defaultTenant] = await db.insert(tenants).values({
    name: "Default Tenant",
    type: "customer",
    parentTenantId: null,
    subdomain: "default",
    customDomain: null,
    status: "active",
    brandingConfig: {
      logo: null,
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
      companyName: "Smart CRM"
    },
    featureFlags: {
      aiTools: true,
      multiTenant: false,
      whiteLabel: false,
      customBranding: false,
      apiAccess: true,
      advancedAnalytics: true,
      voiceAnalysis: true,
      documentAnalysis: true
    },
    metadata: {
      migration: true,
      migrationDate: new Date().toISOString(),
      originalApp: "Smart CRM"
    }
  }).onConflictDoUpdate({
    target: tenants.subdomain,
    set: {
      status: "active",
      updatedAt: new Date()
    }
  }).returning();

  console.log("Created/updated default tenant:", defaultTenant.id);

  // Step 3: Create default subscription for tenant
  const [subscription] = await db.insert(tenantSubscriptions).values({
    tenantId: defaultTenant.id,
    planId: defaultPlan?.id || "default-plan-id",
    status: "active",
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    cancelAtPeriodEnd: false,
    metadata: {
      migration: true,
      freeAccount: true
    }
  }).onConflictDoNothing().returning();

  console.log("Created tenant subscription:", subscription?.id);

  // Step 4: Create default admin role
  const [adminRole] = await db.insert(userRoles).values({
    tenantId: defaultTenant.id,
    name: "Admin",
    description: "Default administrator role",
    permissions: [
      "users.read", "users.write", "users.delete",
      "contacts.read", "contacts.write", "contacts.delete",
      "deals.read", "deals.write", "deals.delete",
      "tasks.read", "tasks.write", "tasks.delete",
      "analytics.read", "ai.use", "settings.write"
    ],
    isDefault: true
  }).onConflictDoNothing().returning();

  console.log("Created admin role:", adminRole?.id);

  // Step 5: Update existing users to belong to default tenant
  const usersUpdateResult = await db.update(users)
    .set({ 
      tenantId: defaultTenant.id,
      roleId: adminRole?.id,
      isAdmin: true
    })
    .where(eq(users.tenantId, null));

  console.log("Updated users with tenant ID:", usersUpdateResult.changes);

  // Step 6: Update existing contacts to belong to default tenant
  const contactsUpdateResult = await db.update(contacts)
    .set({ tenantId: defaultTenant.id })
    .where(eq(contacts.tenantId, null));

  console.log("Updated contacts with tenant ID:", contactsUpdateResult.changes);

  // Step 7: Update existing deals to belong to default tenant
  const dealsUpdateResult = await db.update(deals)
    .set({ tenantId: defaultTenant.id })
    .where(eq(deals.tenantId, null));

  console.log("Updated deals with tenant ID:", dealsUpdateResult.changes);

  // Step 8: Update existing tasks to belong to default tenant
  const tasksUpdateResult = await db.update(tasks)
    .set({ tenantId: defaultTenant.id })
    .where(eq(tasks.tenantId, null));

  console.log("Updated tasks with tenant ID:", tasksUpdateResult.changes);

  // Step 9: Update existing business analysis to belong to default tenant
  const businessAnalysisUpdateResult = await db.update(businessAnalysis)
    .set({ tenantId: defaultTenant.id })
    .where(eq(businessAnalysis.tenantId, null));

  console.log("Updated business analysis with tenant ID:", businessAnalysisUpdateResult.changes);

  // Step 10: Update existing content items to belong to default tenant
  const contentItemsUpdateResult = await db.update(contentItems)
    .set({ tenantId: defaultTenant.id })
    .where(eq(contentItems.tenantId, null));

  console.log("Updated content items with tenant ID:", contentItemsUpdateResult.changes);

  // Step 11: Update existing voice profiles to belong to default tenant
  const voiceProfilesUpdateResult = await db.update(voiceProfiles)
    .set({ tenantId: defaultTenant.id })
    .where(eq(voiceProfiles.tenantId, null));

  console.log("Updated voice profiles with tenant ID:", voiceProfilesUpdateResult.changes);

  console.log("✅ Default tenant setup completed successfully!");
  
  return defaultTenant;
}

/**
 * Rollback function to undo the migration if needed
 */
export async function rollbackDefaultTenant() {
  console.log("Rolling back default tenant migration...");
  
  // This would set all tenant_id fields back to null
  // Only use in development/testing
  await db.update(users).set({ tenantId: null });
  await db.update(contacts).set({ tenantId: null });
  await db.update(deals).set({ tenantId: null });
  await db.update(tasks).set({ tenantId: null });
  await db.update(businessAnalysis).set({ tenantId: null });
  await db.update(contentItems).set({ tenantId: null });
  await db.update(voiceProfiles).set({ tenantId: null });
  
  console.log("✅ Rollback completed");
}

// Run migration directly when script is executed
async function runMigration() {
  try {
    const tenant = await setupDefaultTenant();
    console.log("Migration completed successfully for tenant:", tenant.id);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}