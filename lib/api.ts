// API client for Smart CRM
import { 
  Contact, 
  Deal, 
  Task, 
  User, 
  BusinessAnalysis, 
  ContentItem, 
  VoiceProfile,
  InsertContact,
  InsertDeal,
  InsertTask,
  InsertUser,
  InsertBusinessAnalysis,
  InsertContentItem,
  InsertVoiceProfile
} from '@shared/schema';

class ApiClient {
  private baseUrl = '/api';
  private userId: string | null = null;

  setUserId(userId: string) {
    this.userId = userId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.userId) {
      headers['x-user-id'] = this.userId;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // User methods
  async createUser(user: InsertUser): Promise<User> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async getUser(id: string): Promise<User> {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Contact methods
  async getContacts(): Promise<Contact[]> {
    return this.request('/contacts');
  }

  async getContact(id: string): Promise<Contact> {
    return this.request(`/contacts/${id}`);
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    return this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  async updateContact(id: string, updates: Partial<InsertContact>): Promise<Contact> {
    return this.request(`/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteContact(id: string): Promise<void> {
    await this.request(`/contacts/${id}`, { method: 'DELETE' });
  }

  // Deal methods
  async getDeals(): Promise<Deal[]> {
    return this.request('/deals');
  }

  async getDeal(id: string): Promise<Deal> {
    return this.request(`/deals/${id}`);
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    return this.request('/deals', {
      method: 'POST',
      body: JSON.stringify(deal),
    });
  }

  async updateDeal(id: string, updates: Partial<InsertDeal>): Promise<Deal> {
    return this.request(`/deals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteDeal(id: string): Promise<void> {
    await this.request(`/deals/${id}`, { method: 'DELETE' });
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return this.request('/tasks');
  }

  async getTask(id: string): Promise<Task> {
    return this.request(`/tasks/${id}`);
  }

  async createTask(task: InsertTask): Promise<Task> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task> {
    return this.request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: string): Promise<void> {
    await this.request(`/tasks/${id}`, { method: 'DELETE' });
  }

  // Business Analysis methods
  async getBusinessAnalyses(): Promise<BusinessAnalysis[]> {
    return this.request('/business-analysis');
  }

  async createBusinessAnalysis(analysis: InsertBusinessAnalysis): Promise<BusinessAnalysis> {
    return this.request('/business-analysis', {
      method: 'POST',
      body: JSON.stringify(analysis),
    });
  }

  async deleteBusinessAnalysis(id: string): Promise<void> {
    await this.request(`/business-analysis/${id}`, { method: 'DELETE' });
  }

  // Content Item methods
  async getContentItems(): Promise<ContentItem[]> {
    return this.request('/content-items');
  }

  async createContentItem(item: InsertContentItem): Promise<ContentItem> {
    return this.request('/content-items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async deleteContentItem(id: string): Promise<void> {
    await this.request(`/content-items/${id}`, { method: 'DELETE' });
  }

  // Voice Profile methods
  async getVoiceProfiles(): Promise<VoiceProfile[]> {
    return this.request('/voice-profiles');
  }

  async createVoiceProfile(profile: InsertVoiceProfile): Promise<VoiceProfile> {
    return this.request('/voice-profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  async updateVoiceProfile(id: string, updates: Partial<InsertVoiceProfile>): Promise<VoiceProfile> {
    return this.request(`/voice-profiles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteVoiceProfile(id: string): Promise<void> {
    await this.request(`/voice-profiles/${id}`, { method: 'DELETE' });
  }

  // AI Content Generation
  async generateAIContent(params: {
    contentType: string;
    purpose: string;
    data?: any;
    apiKey?: string;
  }): Promise<{ result: string; success: boolean }> {
    return this.request('/ai/generate-content', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}

export const api = new ApiClient();