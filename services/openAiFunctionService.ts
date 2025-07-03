import OpenAI from 'openai';
import { useApiStore } from '../store/apiStore';
import { Deal, Contact } from '../types';

interface CrmFunctions {
  searchDeals: (params: {query: string, status?: string, minValue?: number, maxValue?: number}) => Promise<Deal[]>;
  searchContacts: (params: {query: string, status?: string, industry?: string}) => Promise<Contact[]>;
  createTask: (params: {title: string, description?: string, dueDate?: string, priority?: string, relatedToType?: string, relatedToId?: string}) => Promise<{id: string, success: boolean}>;
  scheduleFollowUp: (params: {contactId: string, date: string, meetingType?: string, notes?: string}) => Promise<{id: string, success: boolean}>;
  getContactInfo: (params: {contactId: string}) => Promise<Contact | null>;
  getDealInfo: (params: {dealId: string}) => Promise<Deal | null>;
}

// Real CRM functions using API integration
const crmFunctions: CrmFunctions = {
  searchDeals: async (params) => {
    console.log('Searching deals with params:', params);
    
    try {
      const response = await fetch(`/api/deals?query=${encodeURIComponent(params.query)}&status=${params.status || ''}&minValue=${params.minValue || ''}&maxValue=${params.maxValue || ''}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Deal search failed: ${response.status}`);
      }
      
      const deals = await response.json();
      return deals.map((deal: any) => ({
        ...deal,
        dueDate: deal.dueDate ? new Date(deal.dueDate) : null,
        createdAt: new Date(deal.createdAt),
        updatedAt: new Date(deal.updatedAt)
      }));
    } catch (error) {
      console.error('Deal search error:', error);
      return [];
    }
  },

  searchContacts: async (params) => {
    console.log('Searching contacts with params:', params);
    
    try {
      const response = await fetch(`/api/contacts?query=${encodeURIComponent(params.query)}&status=${params.status || ''}&industry=${params.industry || ''}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Contact search failed: ${response.status}`);
      }
      
      const contacts = await response.json();
      return contacts.map((contact: any) => ({
        ...contact,
        lastContact: contact.lastContact ? new Date(contact.lastContact) : null,
        createdAt: contact.createdAt ? new Date(contact.createdAt) : new Date(),
        updatedAt: contact.updatedAt ? new Date(contact.updatedAt) : new Date()
      }));
    } catch (error) {
      console.error('Contact search error:', error);
      return [];
    }
  },
  
  createTask: async (params) => {
    console.log('Creating task with params:', params);
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`Task creation failed: ${response.status}`);
      }
      
      const task = await response.json();
      return {
        id: task.id,
        success: true
      };
    } catch (error) {
      console.error('Task creation error:', error);
      return {
        id: '',
        success: false
      };
    }
  },
  
  scheduleFollowUp: async (params) => {
    console.log('Scheduling follow-up with params:', params);
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Follow-up with contact`,
          description: `Follow-up meeting: ${params.meetingType || 'General'}\nNotes: ${params.notes || ''}`,
          dueDate: params.date,
          relatedToType: 'Contact',
          relatedToId: params.contactId,
          priority: 'medium'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Follow-up scheduling failed: ${response.status}`);
      }
      
      const followUp = await response.json();
      return {
        id: followUp.id,
        success: true
      };
    } catch (error) {
      console.error('Follow-up scheduling error:', error);
      return {
        id: '',
        success: false
      };
    }
  },
  
  getContactInfo: async (params) => {
    console.log('Getting contact info for:', params.contactId);
    
    try {
      const response = await fetch(`/api/contacts/${params.contactId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Contact retrieval failed: ${response.status}`);
      }
      
      const contact = await response.json();
      return {
        ...contact,
        lastContact: contact.lastContact ? new Date(contact.lastContact) : null,
        createdAt: contact.createdAt ? new Date(contact.createdAt) : new Date(),
        updatedAt: contact.updatedAt ? new Date(contact.updatedAt) : new Date()
      };
    } catch (error) {
      console.error('Contact retrieval error:', error);
      return null;
    }
  },
  
  getDealInfo: async (params) => {
    console.log('Getting deal info for:', params.dealId);
    
    try {
      const response = await fetch(`/api/deals/${params.dealId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Deal retrieval failed: ${response.status}`);
      }
      
      const deal = await response.json();
      return {
        ...deal,
        dueDate: deal.dueDate ? new Date(deal.dueDate) : null,
        createdAt: new Date(deal.createdAt),
        updatedAt: new Date(deal.updatedAt)
      };
    } catch (error) {
      console.error('Deal retrieval error:', error);
      return null;
    }
  }
};

// Function definitions for OpenAI Function Calling
const functionDefinitions = [
  {
    name: 'searchDeals',
    description: 'Search for deals in the CRM system',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        status: { type: 'string', description: 'Deal status filter' },
        minValue: { type: 'number', description: 'Minimum deal value' },
        maxValue: { type: 'number', description: 'Maximum deal value' }
      },
      required: ['query']
    }
  },
  {
    name: 'searchContacts',
    description: 'Search for contacts in the CRM system',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        status: { type: 'string', description: 'Contact status filter' },
        industry: { type: 'string', description: 'Industry filter' }
      },
      required: ['query']
    }
  },
  {
    name: 'createTask',
    description: 'Create a new task in the CRM system',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Task title' },
        description: { type: 'string', description: 'Task description' },
        dueDate: { type: 'string', description: 'Due date in ISO format' },
        priority: { type: 'string', description: 'Task priority' },
        relatedToType: { type: 'string', description: 'Type of related entity' },
        relatedToId: { type: 'string', description: 'ID of related entity' }
      },
      required: ['title']
    }
  },
  {
    name: 'scheduleFollowUp',
    description: 'Schedule a follow-up with a contact',
    parameters: {
      type: 'object',
      properties: {
        contactId: { type: 'string', description: 'Contact ID' },
        date: { type: 'string', description: 'Follow-up date' },
        meetingType: { type: 'string', description: 'Type of meeting' },
        notes: { type: 'string', description: 'Additional notes' }
      },
      required: ['contactId', 'date']
    }
  },
  {
    name: 'getContactInfo',
    description: 'Get detailed information about a specific contact',
    parameters: {
      type: 'object',
      properties: {
        contactId: { type: 'string', description: 'Contact ID' }
      },
      required: ['contactId']
    }
  },
  {
    name: 'getDealInfo',
    description: 'Get detailed information about a specific deal',
    parameters: {
      type: 'object',
      properties: {
        dealId: { type: 'string', description: 'Deal ID' }
      },
      required: ['dealId']
    }
  }
];

// Service class for handling OpenAI Function Calling with CRM functions
export class OpenAIFunctionService {
  private openai: OpenAI | null = null;
  private conversation: Array<{ role: string; content: string; name?: string }> = [];

  constructor() {
    const apiStore = useApiStore.getState();
    if (apiStore.apiKeys.openai) {
      this.openai = new OpenAI({
        apiKey: apiStore.apiKeys.openai,
        dangerouslyAllowBrowser: true
      });
    }
  }

  isInitialized(): boolean {
    return this.openai !== null;
  }

  async processMessage(message: string): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized. Please set your API key.');
    }

    // Add user message to conversation
    this.conversation.push({ role: 'user', content: message });

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful CRM assistant. You can search for deals and contacts, create tasks, schedule follow-ups, and get detailed information about contacts and deals. Use the available functions to help users with their CRM needs.'
          },
          ...this.conversation.map(msg => ({
            role: msg.role as any,
            content: msg.content,
            ...(msg.name && { name: msg.name })
          }))
        ],
        functions: functionDefinitions,
        function_call: 'auto'
      });

      const responseMessage = response.choices[0]?.message;
      
      if (responseMessage?.function_call) {
        // Handle function call
        const functionName = responseMessage.function_call.name;
        const functionArgs = JSON.parse(responseMessage.function_call.arguments);
        
        // Execute the function
        let functionResult;
        try {
          functionResult = await (crmFunctions as any)[functionName](functionArgs);
        } catch (error) {
          functionResult = { error: 'Function execution failed' };
        }

        // Add function call and result to conversation
        this.conversation.push({
          role: 'assistant',
          content: responseMessage.content || '',
          ...(responseMessage.function_call && { function_call: responseMessage.function_call })
        });
        
        this.conversation.push({
          role: 'function',
          name: functionName,
          content: JSON.stringify(functionResult)
        });

        // Get AI response based on function result
        const followUpResponse = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful CRM assistant. Provide clear, helpful responses based on the function results.'
            },
            ...this.conversation.map(msg => ({
              role: msg.role as any,
              content: msg.content,
              ...(msg.name && { name: msg.name })
            }))
          ]
        });

        const finalResponse = followUpResponse.choices[0]?.message?.content || 'Function executed successfully.';
        this.conversation.push({ role: 'assistant', content: finalResponse });
        return finalResponse;
      } else {
        // Regular response without function call
        const content = responseMessage?.content || 'I apologize, but I was unable to process your request.';
        this.conversation.push({ role: 'assistant', content });
        return content;
      }
    } catch (error) {
      console.error('Error processing message:', error);
      throw new Error('Failed to process message with OpenAI');
    }
  }

  clearConversation(): void {
    this.conversation = [];
  }

  getConversation(): Array<{ role: string; content: string; name?: string }> {
    return [...this.conversation];
  }
}

// Export default instance
export const openAIFunctionService = new OpenAIFunctionService();

// Hook for using OpenAI Functions in React components
export function useOpenAIFunctions() {
  return openAIFunctionService;
}