// AI Contact Enrichment Service - OpenAI & Gemini Integration
import { httpClient } from './http-client.service';
import { logger } from './logger.service';
import apiConfig from '../config/api.config';

export interface ContactEnrichmentData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
  industry?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  avatar?: string;
  bio?: string;
  notes?: string;
  confidence?: number;
}

export interface AIProvider {
  name: 'openai' | 'gemini';
  enabled: boolean;
  apiKey?: string;
}

class AIEnrichmentService {
  private apiUrl = apiConfig.dataProcessing.enrichment.baseURL;
  private openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  private geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  private supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  private providers: AIProvider[] = [
    { name: 'openai', enabled: !!this.openaiApiKey, apiKey: this.openaiApiKey },
    { name: 'gemini', enabled: !!this.geminiApiKey, apiKey: this.geminiApiKey }
  ];

  async enrichContactByEmail(email: string): Promise<ContactEnrichmentData> {
    logger.info(`Enriching contact by email: ${email}`);
    
    try {
      // Call Supabase Edge Function
      const edgeFunctionUrl = `${this.supabaseUrl}/functions/v1/ai-enrich`;
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          enrichmentRequest: { email },
          provider: this.getAvailableProvider()
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      logger.info(`Contact enriched successfully by email`);
      return data;
    } catch (error) {
      logger.error('Contact enrichment by email failed', error as Error);
      throw error;
    }
  }

  async enrichContactByName(firstName: string, lastName: string, company?: string): Promise<ContactEnrichmentData> {
    logger.info(`Enriching contact by name: ${firstName} ${lastName} ${company ? `at ${company}` : ''}`);
    
    try {
      // Call Supabase Edge Function
      const edgeFunctionUrl = `${this.supabaseUrl}/functions/v1/ai-enrich`;
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          enrichmentRequest: { firstName, lastName, company },
          provider: this.getAvailableProvider()
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      logger.info(`Contact enriched successfully by name`);
      return data;
    } catch (error) {
      logger.error('Contact enrichment by name failed', error as Error);
      throw error;
    }
  }

  async enrichContactByLinkedIn(linkedinUrl: string): Promise<ContactEnrichmentData> {
    logger.info(`Enriching contact by LinkedIn URL: ${linkedinUrl}`);
    
    try {
      // Call Supabase Edge Function
      const edgeFunctionUrl = `${this.supabaseUrl}/functions/v1/ai-enrich`;
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          enrichmentRequest: { linkedinUrl },
          provider: this.getAvailableProvider()
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      logger.info(`Contact enriched successfully by LinkedIn`);
      return data;
    } catch (error) {
      logger.error('Contact enrichment by LinkedIn failed', error as Error);
      throw error;
    }
  }

  async findContactImage(name: string, company?: string): Promise<string> {
    logger.info(`Finding contact image for: ${name}${company ? ` at ${company}` : ''}`);
    
    try {
      // For now, return a placeholder image from Pexels
      // In a real implementation, this would call an image search API
      return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2';
    } catch (error) {
      logger.error('Finding contact image failed', error as Error);
      
      // Return a default avatar from Pexels if the API call fails
      return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2';
    }
  }

  async bulkEnrichContacts(contacts: Array<{email?: string, name?: string, company?: string}>): Promise<ContactEnrichmentData[]> {
    logger.info(`Bulk enriching ${contacts.length} contacts`);
    
    try {
      // Process in batches to avoid overwhelming the API
      const batchSize = 5;
      const results: ContactEnrichmentData[] = [];
      
      for (let i = 0; i < contacts.length; i += batchSize) {
        const batch = contacts.slice(i, i + batchSize);
        const batchPromises = batch.map(contact => {
          if (contact.email) {
            return this.enrichContactByEmail(contact.email);
          } else if (contact.name) {
            const nameParts = contact.name.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');
            return this.enrichContactByName(firstName, lastName, contact.company);
          } else {
            return Promise.resolve({
              company: contact.company,
              confidence: 0,
              notes: 'Insufficient data for enrichment'
            });
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Small delay between batches to prevent rate limiting
        if (i + batchSize < contacts.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      logger.info(`Successfully bulk enriched ${results.length} contacts`);
      return results;
    } catch (error) {
      logger.error('Bulk contact enrichment failed', error as Error);
      throw error;
    }
  }

  private getAvailableProvider(): string {
    const enabledProviders = this.providers.filter(p => p.enabled);
    
    if (enabledProviders.length === 0) {
      throw new Error('No AI providers are configured. Please set up API keys for OpenAI or Gemini.');
    }
    
    return enabledProviders[0].name;
  }

  // For backward compatibility during transition
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  private generateMockEmail(firstName?: string, lastName?: string, company?: string): string {
    const first = firstName || 'contact';
    const last = lastName || 'person';
    const domain = company ? `${company.toLowerCase().replace(/\s+/g, '')}.com` : 'company.com';
    return `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`;
  }
  
  private generateMockPhone(): string {
    return `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
  }
}

export const aiEnrichmentService = new AIEnrichmentService();