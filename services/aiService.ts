// AI Service for Express API endpoints (replacing Supabase Edge Functions)
import { Contact, Deal } from '../types';

const API_BASE = '';

// Generic API request helper
const apiRequest = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`${API_BASE}/api/ai/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.result;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    throw error;
  }
};

// Email generation
export const generateEmailContent = async (contactName: string, purpose: string): Promise<string> => {
  return apiRequest('generate-content', {
    contentType: 'email',
    purpose,
    data: { contactName }
  });
};

// Text message generation
export const generateTextMessage = async (contactName: string, purpose: string): Promise<string> => {
  return apiRequest('generate-content', {
    contentType: 'text',
    purpose,
    data: { contactName }
  });
};

// Call script generation
export const generateCallScript = async (
  contact: Partial<Contact>, 
  callPurpose: string, 
  previousInteractions: string[]
): Promise<string> => {
  return apiRequest('generate-content', {
    contentType: 'call',
    purpose: callPurpose,
    data: { 
      contact,
      previousInteractions
    }
  });
};

// Proposal generation
export const generateProposal = async (
  contact: Partial<Contact>, 
  dealDetails: string, 
  previousInteractions: string[]
): Promise<string> => {
  return apiRequest('generate-content', {
    contentType: 'proposal',
    purpose: 'Sales Proposal',
    data: { 
      contact,
      dealDetails,
      previousInteractions
    }
  });
};

// Market trend analysis
export const analyzeMarketTrends = async (
  industry: string, 
  targetMarket: string, 
  timeframe: string,
  options?: { apiKey?: string }
): Promise<string> => {
  return apiRequest('generate-content', {
    contentType: 'marketTrend',
    purpose: 'Market Analysis',
    data: { 
      industry,
      targetMarket,
      timeframe
    },
    apiKey: options?.apiKey
  });
};

// Competitor analysis
export const analyzeCompetitor = async (
  competitorName: string, 
  industry: string, 
  strengths: string[]
): Promise<string> => {
  return apiRequest('generate-content', {
    contentType: 'competitor',
    purpose: 'Competitive Analysis',
    data: { 
      competitorName,
      industry,
      strengths
    }
  });
};

// Sales forecast
export const generateSalesForecast = async (
  deals: Partial<Deal>[], 
  timeframe: string
): Promise<string> => {
  return apiRequest('generate-content', {
    contentType: 'salesForecast',
    purpose: 'Sales Forecast',
    data: { 
      deals,
      timeframe
    }
  });
};

// Email analysis
export const analyzeCustomerEmail = async (emailContent: string): Promise<string> => {
  return apiRequest('email-analyzer', { emailContent });
};

// Meeting summarization
export const generateMeetingSummary = async (transcript: string): Promise<string> => {
  return apiRequest('meeting-summarizer', { transcript });
};

// Business analysis
export const analyzeBusinessData = async (
  businessData: any, 
  userId?: string
): Promise<string> => {
  return apiRequest('business-analyzer', { businessData, userId });
};

// Sales insights generation
export const generateSalesInsights = async (
  contacts: Partial<Contact>[], 
  deals: Partial<Deal>[]
): Promise<string> => {
  return apiRequest('sales-insights', { contacts, deals });
};

// Real-time analysis functions
export const analyzeSentimentRealTime = async (text: string): Promise<any> => {
  return apiRequest('realtime-analysis', {
    analysisType: 'sentiment',
    content: text
  });
};

export const provideEmailFeedback = async (emailContent: string): Promise<string> => {
  return apiRequest('realtime-analysis', {
    analysisType: 'email-feedback',
    content: emailContent
  });
};

export const validateFormField = async (
  fieldName: string, 
  fieldValue: string, 
  formContext: string = 'general'
): Promise<any> => {
  return apiRequest('realtime-analysis', {
    analysisType: 'form-validation',
    content: {
      fieldName,
      fieldValue,
      formContext
    }
  });
};

export const analyzeCallRealTime = async (transcript: string): Promise<any> => {
  return apiRequest('realtime-analysis', {
    analysisType: 'call-insights',
    content: transcript
  });
};

export const summarizeMeetingRealTime = async (partialTranscript: string): Promise<string> => {
  return apiRequest('realtime-analysis', {
    analysisType: 'meeting-summary-realtime',
    content: partialTranscript
  });
};

// Contact personalization
export const suggestPersonalization = async (contact: any): Promise<any> => {
  return apiRequest('generate-content', {
    contentType: 'personalization',
    purpose: 'Contact Personalization',
    data: { contact }
  });
};

// Business insights
export const analyzeBusinessInsights = async (company: string, industry?: string): Promise<any> => {
  return apiRequest('business-analyzer', {
    businessData: { company, industry }
  });
};

// Deal scoring
export const scoreDeal = async (deal: any): Promise<any> => {
  return apiRequest('generate-content', {
    contentType: 'dealScore',
    purpose: 'Deal Scoring',
    data: { deal }
  });
};

// Lead qualification
export const qualifyLead = async (lead: any): Promise<any> => {
  return apiRequest('generate-content', {
    contentType: 'leadQualification',
    purpose: 'Lead Qualification',
    data: { lead }
  });
};

// Content optimization
export const optimizeContent = async (content: string, purpose: string): Promise<string> => {
  return apiRequest('generate-content', {
    contentType: 'optimization',
    purpose: `Content Optimization: ${purpose}`,
    data: { content }
  });
};

// Generate reasoning
export const generateReasoning = async (prompt: string): Promise<string> => {
  return apiRequest('generate-content', {
    contentType: 'reasoning',
    purpose: 'Reasoning Generation',
    data: { prompt }
  });
};