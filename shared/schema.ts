import { pgTable, text, serial, integer, boolean, uuid, timestamp, numeric, jsonb, date, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============= MULTI-TENANT TABLES =============

// Tenants table for multi-tenancy
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull().default("customer"), // customer, partner, direct
  parentTenantId: uuid("parent_tenant_id"),
  subdomain: text("subdomain").unique(),
  customDomain: text("custom_domain").unique(),
  status: text("status").notNull().default("active"), // active, suspended, cancelled
  brandingConfig: jsonb("branding_config").default({}),
  featureFlags: jsonb("feature_flags").default({}),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_tenants_subdomain").on(table.subdomain),
  index("idx_tenants_custom_domain").on(table.customDomain),
  index("idx_tenants_parent").on(table.parentTenantId),
]);

// User roles and permissions
export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  permissions: jsonb("permissions").default([]),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  isSystem: boolean("is_system").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partners table for reseller management
export const partners = pgTable("partners", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkOrganizationId: text("clerk_organization_id").notNull().unique(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  companyName: text("company_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  commissionRate: numeric("commission_rate").notNull().default("0.20"), // 20% default
  status: text("status").notNull().default("pending"), // pending, active, suspended, cancelled
  onboardingCompleted: boolean("onboarding_completed").default(false),
  customDomainEnabled: boolean("custom_domain_enabled").default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_partners_clerk_org").on(table.clerkOrganizationId),
  index("idx_partners_tenant").on(table.tenantId),
]);

// Feature packages for tiered offerings
export const featurePackages = pgTable("feature_packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  tier: text("tier").notNull(), // basic, professional, enterprise
  price: numeric("price").notNull(),
  billingCycle: text("billing_cycle").notNull().default("monthly"),
  features: jsonb("features").default({}), // AI tools, analytics, etc.
  limits: jsonb("limits").default({}), // users, storage, API calls
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partner customers relationship
export const partnerCustomers = pgTable("partner_customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  clerkUserId: text("clerk_user_id").notNull(),
  clerkOrganizationId: text("clerk_organization_id"),
  packageId: uuid("package_id").references(() => featurePackages.id),
  billingStatus: text("billing_status").notNull().default("active"),
  subscriptionStart: timestamp("subscription_start").defaultNow(),
  subscriptionEnd: timestamp("subscription_end"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_partner_customers_partner").on(table.partnerId),
  index("idx_partner_customers_clerk_user").on(table.clerkUserId),
]);

// Revenue sharing records
export const revenueSharing = pgTable("revenue_sharing", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  customerId: uuid("customer_id").references(() => partnerCustomers.id).notNull(),
  billingPeriod: text("billing_period").notNull(), // 2024-01, 2024-02
  customerRevenue: numeric("customer_revenue").notNull(),
  partnerCommission: numeric("partner_commission").notNull(),
  platformFee: numeric("platform_fee").notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, disputed
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_revenue_sharing_partner").on(table.partnerId),
  index("idx_revenue_sharing_period").on(table.billingPeriod),
]);

// Partner billing history
export const partnerBilling = pgTable("partner_billing", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  billingPeriod: text("billing_period").notNull(),
  totalRevenue: numeric("total_revenue").notNull(),
  totalCommission: numeric("total_commission").notNull(),
  totalCustomers: integer("total_customers").notNull(),
  invoiceUrl: text("invoice_url"),
  status: text("status").notNull().default("draft"), // draft, sent, paid, overdue
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_partner_billing_partner").on(table.partnerId),
  index("idx_partner_billing_period").on(table.billingPeriod),
]);

// Usage tracking for limits enforcement
export const usageTracking = pgTable("usage_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  customerId: uuid("customer_id").references(() => partnerCustomers.id),
  usageType: text("usage_type").notNull(), // storage, api_calls, users, ai_requests
  usageValue: numeric("usage_value").notNull(),
  billingPeriod: text("billing_period").notNull(),
  resetDate: timestamp("reset_date"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_usage_tracking_tenant").on(table.tenantId),
  index("idx_usage_tracking_customer").on(table.customerId),
  index("idx_usage_tracking_period").on(table.billingPeriod),
]);

// Subscription plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  planType: text("plan_type").notNull(), // starter, professional, enterprise, white_label
  price: numeric("price").notNull(),
  billingCycle: text("billing_cycle").notNull().default("monthly"), // monthly, yearly
  features: jsonb("features").default({}),
  usageLimits: jsonb("usage_limits").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tenant subscriptions
export const tenantSubscriptions = pgTable("tenant_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  planId: uuid("plan_id").notNull().references(() => subscriptionPlans.id),
  status: text("status").notNull().default("active"), // active, cancelled, past_due, unpaid
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  stripeSubscriptionId: text("stripe_subscription_id"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_tenant_subscriptions_tenant").on(table.tenantId),
  index("idx_tenant_subscriptions_status").on(table.status),
]);

// Feature usage tracking
export const featureUsage = pgTable("feature_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  featureName: text("feature_name").notNull(),
  usageCount: integer("usage_count").default(0),
  usageData: jsonb("usage_data").default({}),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_feature_usage_tenant_feature").on(table.tenantId, table.featureName),
  index("idx_feature_usage_period").on(table.periodStart, table.periodEnd),
]);

// Session storage table for multi-tenant sessions
export const sessions = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
}, (table) => [
  index("IDX_session_expire").on(table.expire),
]);

// ============= CORE APPLICATION TABLES =============

// Users table for basic authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  jobTitle: text("job_title"),
  company: text("company"),
  phone: text("phone"),
  timezone: text("timezone"),
  preferences: jsonb("preferences").default({}),
  socialLinks: jsonb("social_links").default({}),
  accountStatus: text("account_status").default("active"),
  // Multi-tenant fields - nullable during migration
  tenantId: uuid("tenant_id").references(() => tenants.id),
  roleId: uuid("role_id").references(() => userRoles.id),
  permissions: jsonb("permissions").default([]),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_users_tenant").on(table.tenantId),
  index("idx_users_email_tenant").on(table.email, table.tenantId),
]);

// Contacts table
export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  position: text("position"),
  status: text("status").default("lead"), // lead, prospect, customer, churned
  score: integer("score"),
  lastContact: timestamp("last_contact"),
  notes: text("notes"),
  industry: text("industry"),
  location: text("location"),
  favorite: boolean("favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Nullable during migration
}, (table) => [
  index("idx_contacts_tenant").on(table.tenantId),
  index("idx_contacts_user_tenant").on(table.userId, table.tenantId),
]);

// Deals table
export const deals = pgTable("deals", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  value: numeric("value").default("0"),
  stage: text("stage").notNull(), // qualification, initial, negotiation, proposal, closed-won, closed-lost
  company: text("company").notNull(),
  contact: text("contact").notNull(),
  contactId: uuid("contact_id").references(() => contacts.id),
  probability: numeric("probability").default("0"),
  priority: text("priority"), // low, medium, high
  notes: text("notes"),
  dueDate: date("due_date"),
  expectedCloseDate: date("expected_close_date"),
  lostReason: text("lost_reason"),
  products: text("products").array(),
  competitors: text("competitors").array(),
  decisionMakers: text("decision_makers").array(),
  lastActivityDate: timestamp("last_activity_date"),
  assignedTo: uuid("assigned_to"),
  currency: text("currency").default("USD"),
  discountAmount: numeric("discount_amount").default("0"),
  discountPercentage: numeric("discount_percentage").default("0"),
  nextSteps: text("next_steps").array(),
  aiInsights: jsonb("ai_insights").default({}),
  daysInStage: integer("days_in_stage").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Nullable during migration
}, (table) => [
  index("idx_deals_tenant").on(table.tenantId),
  index("idx_deals_user_tenant").on(table.userId, table.tenantId),
]);

// Tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  dueDate: timestamp("due_date"),
  priority: text("priority").default("medium"), // low, medium, high
  category: text("category").default("other"), // call, email, meeting, follow-up, other
  relatedToType: text("related_to_type"), // contact, deal
  relatedToId: uuid("related_to_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Nullable during migration
}, (table) => [
  index("idx_tasks_tenant").on(table.tenantId),
  index("idx_tasks_user_tenant").on(table.userId, table.tenantId),
]);

// Business analysis table
export const businessAnalysis = pgTable("business_analysis", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessName: text("business_name").notNull(),
  industry: text("industry"),
  websiteUrl: text("website_url"),
  socialLinks: jsonb("social_links").default({}),
  analysisResults: jsonb("analysis_results").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Nullable during migration
}, (table) => [
  index("idx_business_analysis_tenant").on(table.tenantId),
]);

// Content items table
export const contentItems = pgTable("content_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  type: text("type").notNull(), // podcast, audiobook, video, voice_over
  url: text("url").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Nullable during migration
}, (table) => [
  index("idx_content_items_tenant").on(table.tenantId),
]);

// Voice profiles table
export const voiceProfiles = pgTable("voice_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  voiceId: text("voice_id").notNull(),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: uuid("user_id").notNull().references(() => users.id),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Nullable during migration
}, (table) => [
  index("idx_voice_profiles_tenant").on(table.tenantId),
]);

// ============= INSERT SCHEMAS =============

// Multi-tenant schemas
export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserRoleSchema = createInsertSchema(userRoles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTenantSubscriptionSchema = createInsertSchema(tenantSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeatureUsageSchema = createInsertSchema(featureUsage).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Core application schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessAnalysisSchema = createInsertSchema(businessAnalysis).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentItemSchema = createInsertSchema(contentItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVoiceProfileSchema = createInsertSchema(voiceProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// White-label reseller schemas
export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeaturePackageSchema = createInsertSchema(featurePackages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerCustomerSchema = createInsertSchema(partnerCustomers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRevenueSharingSchema = createInsertSchema(revenueSharing).omit({
  id: true,
  createdAt: true,
});

export const insertPartnerBillingSchema = createInsertSchema(partnerBilling).omit({
  id: true,
  createdAt: true,
});

export const insertUsageTrackingSchema = createInsertSchema(usageTracking).omit({
  id: true,
  createdAt: true,
});

// ============= EXPORT TYPES =============

// Multi-tenant types
export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;

export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;

export type TenantSubscription = typeof tenantSubscriptions.$inferSelect;
export type InsertTenantSubscription = z.infer<typeof insertTenantSubscriptionSchema>;

export type FeatureUsage = typeof featureUsage.$inferSelect;
export type InsertFeatureUsage = z.infer<typeof insertFeatureUsageSchema>;

// Core application types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type BusinessAnalysis = typeof businessAnalysis.$inferSelect;
export type InsertBusinessAnalysis = z.infer<typeof insertBusinessAnalysisSchema>;

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = z.infer<typeof insertContentItemSchema>;

export type VoiceProfile = typeof voiceProfiles.$inferSelect;
export type InsertVoiceProfile = z.infer<typeof insertVoiceProfileSchema>;

// White-label reseller types
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;

export type FeaturePackage = typeof featurePackages.$inferSelect;
export type InsertFeaturePackage = z.infer<typeof insertFeaturePackageSchema>;

export type PartnerCustomer = typeof partnerCustomers.$inferSelect;
export type InsertPartnerCustomer = z.infer<typeof insertPartnerCustomerSchema>;

export type RevenueSharing = typeof revenueSharing.$inferSelect;
export type InsertRevenueSharing = z.infer<typeof insertRevenueSharingSchema>;

export type PartnerBilling = typeof partnerBilling.$inferSelect;
export type InsertPartnerBilling = z.infer<typeof insertPartnerBillingSchema>;

export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertUsageTracking = z.infer<typeof insertUsageTrackingSchema>;

// ============= FEATURE DEFINITIONS =============

// Define available features and permissions
export const FEATURES = {
  // Core CRM Features
  CONTACTS_BASIC: 'contacts_basic',
  CONTACTS_ADVANCED: 'contacts_advanced',
  DEALS_BASIC: 'deals_basic',
  DEALS_ADVANCED: 'deals_advanced',
  TASKS_BASIC: 'tasks_basic',
  TASKS_AUTOMATION: 'tasks_automation',
  
  // AI Features
  AI_GOALS_BASIC: 'ai_goals_basic',
  AI_GOALS_CUSTOM: 'ai_goals_custom',
  AI_ANALYSIS: 'ai_analysis',
  AI_PREMIUM_MODELS: 'ai_premium_models',
  DOCUMENT_ANALYSIS: 'document_analysis',
  
  // Integrations
  EMAIL_INTEGRATION: 'email_integration',
  CALENDAR_INTEGRATION: 'calendar_integration',
  THIRD_PARTY_APIS: 'third_party_apis',
  
  // White Label
  CUSTOM_BRANDING: 'custom_branding',
  SUBDOMAIN: 'subdomain',
  CUSTOM_DOMAIN: 'custom_domain',
  WHITE_LABEL_RESELLING: 'white_label_reselling',
  
  // Analytics & Reporting
  ADVANCED_ANALYTICS: 'advanced_analytics',
  CUSTOM_REPORTS: 'custom_reports',
  DATA_EXPORT: 'data_export',
} as const;

export const USER_PERMISSIONS = {
  // Super Admin (Platform Owner)
  SUPER_ADMIN: 'super_admin',
  MANAGE_PLATFORM: 'manage_platform',
  MANAGE_ALL_TENANTS: 'manage_all_tenants',
  GLOBAL_ANALYTICS: 'global_analytics',
  
  // Partner Admin (White-Label Partners)
  PARTNER_ADMIN: 'partner_admin',
  MANAGE_CUSTOMERS: 'manage_customers',
  PARTNER_ANALYTICS: 'partner_analytics',
  PARTNER_BILLING: 'partner_billing',
  
  // Customer Admin (Business Owners)
  CUSTOMER_ADMIN: 'customer_admin',
  MANAGE_USERS: 'manage_users',
  MANAGE_BILLING: 'manage_billing',
  TENANT_SETTINGS: 'tenant_settings',
  
  // End Users
  USER_READ: 'user_read',
  USER_WRITE: 'user_write',
  USER_DELETE: 'user_delete',
} as const;

export type FeatureKey = typeof FEATURES[keyof typeof FEATURES];
export type PermissionKey = typeof USER_PERMISSIONS[keyof typeof USER_PERMISSIONS];
