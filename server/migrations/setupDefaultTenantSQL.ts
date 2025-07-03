import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * Simple SQL-based migration to set up default tenant
 * This avoids TypeScript schema issues by using raw SQL
 */
export async function setupDefaultTenantSQL() {
  console.log("Starting SQL-based default tenant setup...");

  const migrationDate = new Date().toISOString();
  
  try {
    // Step 1: Create default subscription plan (only if it doesn't exist)
    const existingPlan = await db.execute(sql`
      SELECT id FROM subscription_plans WHERE name = 'Default Plan' LIMIT 1
    `);
    
    if (existingPlan.rows.length === 0) {
      await db.execute(sql`
        INSERT INTO subscription_plans (id, name, plan_type, description, price, billing_cycle, features, is_active)
        VALUES (
          gen_random_uuid(),
          'Default Plan',
          'basic',
          'Default subscription plan for existing users',
          '0.00',
          'monthly',
          '{"aiTools": true, "maxUsers": 1000, "maxContacts": 10000, "maxDeals": 5000, "customBranding": false, "apiAccess": true, "support": "standard"}',
          true
        )
      `);
    }
    console.log("✅ Created default subscription plan");

    // Step 2: Create default tenant (only if it doesn't exist)
    const existingTenant = await db.execute(sql`
      SELECT id FROM tenants WHERE subdomain = 'default' LIMIT 1
    `);
    
    if (existingTenant.rows.length === 0) {
      await db.execute(sql`
        INSERT INTO tenants (id, name, type, parent_tenant_id, subdomain, custom_domain, status, branding_config, feature_flags, metadata)
        VALUES (
          gen_random_uuid(),
          'Default Tenant',
          'customer',
          NULL,
          'default',
          NULL,
          'active',
          '{"logo": null, "primaryColor": "#3b82f6", "secondaryColor": "#1e40af", "companyName": "Smart CRM"}',
          '{"aiTools": true, "multiTenant": false, "whiteLabel": false, "customBranding": false, "apiAccess": true, "advancedAnalytics": true, "voiceAnalysis": true, "documentAnalysis": true}',
          '{"migration": true, "migrationDate": "2025-06-29", "originalApp": "Smart CRM"}'
        )
      `);
    }
    console.log("✅ Created/updated default tenant");

    // Step 3: Get tenant ID
    const tenantId = await db.execute(sql`
      SELECT id FROM tenants WHERE subdomain = 'default' LIMIT 1
    `);
    
    const defaultTenantId = tenantId.rows[0]?.id;
    if (!defaultTenantId) {
      throw new Error("Failed to get default tenant ID");
    }
    
    console.log("📋 Default tenant ID:", defaultTenantId);

    // Step 4: Create default admin role (only if it doesn't exist)
    const existingRole = await db.execute(sql`
      SELECT id FROM user_roles WHERE tenant_id = ${defaultTenantId} AND name = 'Admin' LIMIT 1
    `);
    
    if (existingRole.rows.length === 0) {
      await db.execute(sql`
        INSERT INTO user_roles (id, tenant_id, name, description, permissions, is_system)
        VALUES (
          gen_random_uuid(),
          ${defaultTenantId},
          'Admin',
          'Default administrator role',
          '["users.read", "users.write", "users.delete", "contacts.read", "contacts.write", "contacts.delete", "deals.read", "deals.write", "deals.delete", "tasks.read", "tasks.write", "tasks.delete", "analytics.read", "ai.use", "settings.write"]',
          false
        )
      `);
    }
    console.log("✅ Created admin role");

    // Step 5: Get admin role ID
    const roleResult = await db.execute(sql`
      SELECT id FROM user_roles WHERE tenant_id = ${defaultTenantId} AND name = 'Admin' LIMIT 1
    `);
    const adminRoleId = roleResult.rows[0]?.id;

    // Step 6: Update existing users to belong to default tenant
    const usersUpdate = await db.execute(sql`
      UPDATE users 
      SET tenant_id = ${defaultTenantId}, 
          role_id = ${adminRoleId}, 
          is_admin = true,
          updated_at = NOW()
      WHERE tenant_id IS NULL
    `);
    console.log(`✅ Updated ${usersUpdate.rowCount || 0} users with tenant ID`);

    // Step 7: Update existing contacts to belong to default tenant
    const contactsUpdate = await db.execute(sql`
      UPDATE contacts 
      SET tenant_id = ${defaultTenantId}, updated_at = NOW()
      WHERE tenant_id IS NULL
    `);
    console.log(`✅ Updated ${contactsUpdate.rowCount || 0} contacts with tenant ID`);

    // Step 8: Update existing deals to belong to default tenant
    const dealsUpdate = await db.execute(sql`
      UPDATE deals 
      SET tenant_id = ${defaultTenantId}, updated_at = NOW()
      WHERE tenant_id IS NULL
    `);
    console.log(`✅ Updated ${dealsUpdate.rowCount || 0} deals with tenant ID`);

    // Step 9: Update existing tasks to belong to default tenant
    const tasksUpdate = await db.execute(sql`
      UPDATE tasks 
      SET tenant_id = ${defaultTenantId}, updated_at = NOW()
      WHERE tenant_id IS NULL
    `);
    console.log(`✅ Updated ${tasksUpdate.rowCount || 0} tasks with tenant ID`);

    // Step 10: Update existing business analysis to belong to default tenant
    const businessAnalysisUpdate = await db.execute(sql`
      UPDATE business_analysis 
      SET tenant_id = ${defaultTenantId}, updated_at = NOW()
      WHERE tenant_id IS NULL
    `);
    console.log(`✅ Updated ${businessAnalysisUpdate.rowCount || 0} business analysis records with tenant ID`);

    // Step 11: Update existing content items to belong to default tenant
    const contentItemsUpdate = await db.execute(sql`
      UPDATE content_items 
      SET tenant_id = ${defaultTenantId}, updated_at = NOW()
      WHERE tenant_id IS NULL
    `);
    console.log(`✅ Updated ${contentItemsUpdate.rowCount || 0} content items with tenant ID`);

    // Step 12: Update existing voice profiles to belong to default tenant
    const voiceProfilesUpdate = await db.execute(sql`
      UPDATE voice_profiles 
      SET tenant_id = ${defaultTenantId}, updated_at = NOW()
      WHERE tenant_id IS NULL
    `);
    console.log(`✅ Updated ${voiceProfilesUpdate.rowCount || 0} voice profiles with tenant ID`);

    // Step 13: Create subscription for default tenant (only if it doesn't exist)
    const existingSubscription = await db.execute(sql`
      SELECT id FROM tenant_subscriptions WHERE tenant_id = ${defaultTenantId} LIMIT 1
    `);
    
    if (existingSubscription.rows.length === 0) {
      await db.execute(sql`
        INSERT INTO tenant_subscriptions (id, tenant_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end, metadata)
        SELECT 
          gen_random_uuid(),
          ${defaultTenantId},
          sp.id,
          'active',
          NOW(),
          NOW() + INTERVAL '1 year',
          false,
          '{"migration": true, "freeAccount": true}'
        FROM subscription_plans sp
        WHERE sp.name = 'Default Plan'
      `);
    }
    console.log("✅ Created tenant subscription");

    console.log("🎉 Default tenant setup completed successfully!");
    
    return {
      tenantId: defaultTenantId,
      status: "success"
    };

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration when script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDefaultTenantSQL()
    .then(result => {
      console.log("Migration completed successfully:", result);
      process.exit(0);
    })
    .catch(error => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}