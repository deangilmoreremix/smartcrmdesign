export interface WhiteLabelTenant {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    companyName: string;
  };
  features: {
    aiTools: boolean;
    advancedAnalytics: boolean;
    customIntegrations: boolean;
    userLimit: number;
    storageLimit: number; // in MB
  };
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
}

export interface WhiteLabelUser {
  id: string;
  email: string;
  tenantId: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: string[];
}

export class WhiteLabelClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.WHITE_LABEL_API_URL || 'https://moonlit-tarsier-239e70.netlify.app/api';
    this.apiKey = process.env.WHITE_LABEL_API_KEY || '';
  }

  private async makeRequest(endpoint: string, options: any = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`White Label API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Tenant Management
  async getTenant(tenantId: string): Promise<WhiteLabelTenant> {
    return this.makeRequest(`/tenants/${tenantId}`);
  }

  async createTenant(tenantData: Partial<WhiteLabelTenant>): Promise<WhiteLabelTenant> {
    return this.makeRequest('/tenants', {
      method: 'POST',
      body: JSON.stringify(tenantData),
    });
  }

  async updateTenant(tenantId: string, updates: Partial<WhiteLabelTenant>): Promise<WhiteLabelTenant> {
    return this.makeRequest(`/tenants/${tenantId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // User Management
  async getTenantUsers(tenantId: string): Promise<WhiteLabelUser[]> {
    return this.makeRequest(`/tenants/${tenantId}/users`);
  }

  async createTenantUser(tenantId: string, userData: Partial<WhiteLabelUser>): Promise<WhiteLabelUser> {
    return this.makeRequest(`/tenants/${tenantId}/users`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Feature Management
  async getTenantFeatures(tenantId: string): Promise<any> {
    return this.makeRequest(`/tenants/${tenantId}/features`);
  }

  async updateTenantFeatures(tenantId: string, features: any): Promise<any> {
    return this.makeRequest(`/tenants/${tenantId}/features`, {
      method: 'PUT',
      body: JSON.stringify(features),
    });
  }

  // Analytics & Usage
  async reportUsage(tenantId: string, usageData: any): Promise<void> {
    await this.makeRequest(`/tenants/${tenantId}/usage`, {
      method: 'POST',
      body: JSON.stringify(usageData),
    });
  }

  async getTenantAnalytics(tenantId: string, period: string = '30d'): Promise<any> {
    return this.makeRequest(`/tenants/${tenantId}/analytics?period=${period}`);
  }

  // Branding
  async updateTenantBranding(tenantId: string, branding: any): Promise<any> {
    return this.makeRequest(`/tenants/${tenantId}/branding`, {
      method: 'PUT',
      body: JSON.stringify(branding),
    });
  }

  // Webhook handling
  async validateWebhook(signature: string, payload: string): Promise<boolean> {
    // Implement webhook signature validation
    // This would depend on the White Label platform's webhook signing method
    return true;
  }
}

export const whiteLabelClient = new WhiteLabelClient();