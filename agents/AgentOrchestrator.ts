// Agent Orchestrator - Routes and executes specialized AI agents

export interface AgentExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime?: number;
}

export type AgentType = 
  | 'aiAeAgent'
  | 'aiDialerAgent' 
  | 'aiSdrAgent'
  | 'leadEnrichmentAgent'
  | 'leadScoringAgent'
  | 'personalizedEmailAgent'
  | 'socialMediaAgent'
  | 'linkedinAgent'
  | 'communicationAgent'
  | 'followUpAgent'
  | 'objectionHandlerAgent'
  | 'meetingsAgent'
  | 'reengagementAgent'
  | 'coldOutreachCloserAgent'
  | 'proposalGeneratorAgent'
  | 'smartDemoBotAgent'
  | 'voiceAgent';

export const AVAILABLE_AGENTS: Record<AgentType, {
  name: string;
  description: string;
  capabilities: string[];
  aiModel: 'OpenAI' | 'Gemini' | 'Both';
  composioIntegration: boolean;
}> = {
  aiAeAgent: {
    name: 'AI Account Executive Agent',
    description: 'Generates personalized demo scripts and manages sales presentations',
    capabilities: ['Demo Script Generation', 'Presentation Planning', 'Value Proposition Creation'],
    aiModel: 'OpenAI',
    composioIntegration: true
  },
  aiDialerAgent: {
    name: 'AI Dialer Agent', 
    description: 'Creates call scripts and manages phone outreach campaigns',
    capabilities: ['Call Script Generation', 'Auto-dialing', 'Calendar Integration'],
    aiModel: 'Gemini',
    composioIntegration: true
  },
  aiSdrAgent: {
    name: 'AI SDR Agent',
    description: 'Handles lead research and email sequence automation',
    capabilities: ['Lead Research', 'Email Sequences', 'LinkedIn Outreach'],
    aiModel: 'Both',
    composioIntegration: true
  },
  leadEnrichmentAgent: {
    name: 'Lead Enrichment Agent',
    description: 'Enriches prospect data with comprehensive intelligence',
    capabilities: ['Data Enrichment', 'Contact Verification', 'Company Analysis'],
    aiModel: 'Gemini',
    composioIntegration: true
  },
  leadScoringAgent: {
    name: 'Lead Scoring Agent',
    description: 'AI-powered lead qualification and scoring',
    capabilities: ['Lead Scoring', 'BANT Qualification', 'Priority Alerts'],
    aiModel: 'Gemini',
    composioIntegration: true
  },
  personalizedEmailAgent: {
    name: 'Personalized Email Agent',
    description: 'Creates highly personalized email campaigns',
    capabilities: ['Email Generation', 'Send Optimization', 'Follow-up Automation'],
    aiModel: 'OpenAI',
    composioIntegration: true
  },
  socialMediaAgent: {
    name: 'Social Media Agent',
    description: 'Manages multi-platform social media campaigns and engagement',
    capabilities: ['Content Creation', 'Platform Posting', 'Engagement Tracking'],
    aiModel: 'OpenAI',
    composioIntegration: true
  },
  linkedinAgent: {
    name: 'LinkedIn Agent',
    description: 'Professional networking automation and LinkedIn campaigns',
    capabilities: ['Connection Requests', 'Message Automation', 'Content Publishing'],
    aiModel: 'Gemini',
    composioIntegration: true
  },
  communicationAgent: {
    name: 'Communication Agent',
    description: 'Multi-channel messaging via WhatsApp, SMS, and other channels',
    capabilities: ['WhatsApp Automation', 'SMS Campaigns', 'Multi-channel Coordination'],
    aiModel: 'OpenAI',
    composioIntegration: true
  },
  followUpAgent: {
    name: 'Follow-up Agent',
    description: 'Automated follow-up sequences and nurture campaigns',
    capabilities: ['Multi-touch Sequences', 'Response Tracking', 'Follow-up Optimization'],
    aiModel: 'Gemini',
    composioIntegration: true
  },
  objectionHandlerAgent: {
    name: 'Objection Handler Agent',
    description: 'Real-time objection handling and response strategies',
    capabilities: ['Objection Analysis', 'Response Scripts', 'Counterargument Generation'],
    aiModel: 'Gemini',
    composioIntegration: true
  },
  meetingsAgent: {
    name: 'Meetings Agent',
    description: 'Meeting automation and optimization',
    capabilities: ['Meeting Scheduling', 'Agenda Creation', 'Follow-up Automation'],
    aiModel: 'OpenAI',
    composioIntegration: true
  },
  reengagementAgent: {
    name: 'Re-engagement Agent',
    description: 'Dormant prospect reactivation campaigns',
    capabilities: ['Dormant Contact Analysis', 'Reactivation Sequences', 'Win-back Campaigns'],
    aiModel: 'Gemini',
    composioIntegration: true
  },
  coldOutreachCloserAgent: {
    name: 'Cold Outreach Closer Agent',
    description: 'Converting cold prospects through strategic closing',
    capabilities: ['Cold Prospect Qualification', 'Closing Sequences', 'Conversion Optimization'],
    aiModel: 'OpenAI',
    composioIntegration: true
  },
  proposalGeneratorAgent: {
    name: 'Proposal Generator Agent',
    description: 'AI-powered proposal creation and delivery',
    capabilities: ['Proposal Generation', 'Document Creation', 'Delivery Automation'],
    aiModel: 'Gemini',
    composioIntegration: true
  },
  smartDemoBotAgent: {
    name: 'Smart Demo Bot Agent',
    description: 'Interactive demo automation and engagement',
    capabilities: ['Demo Scripts', 'Interactive Elements', 'Engagement Tracking'],
    aiModel: 'OpenAI',
    composioIntegration: true
  },
  voiceAgent: {
    name: 'Voice Agent',
    description: 'Voice-powered sales automation and call coaching',
    capabilities: ['Voice Automation', 'Call Coaching', 'Conversation Analytics'],
    aiModel: 'Gemini',
    composioIntegration: true
  }
};

// Execute agent workflow using real AI integration
export async function runAgentWorkflow(
  agentType: AgentType,
  input: any,
  setSteps?: (steps: any) => void
): Promise<AgentExecutionResult> {
  const startTime = Date.now();
  
  try {
    // Real agent execution steps
    if (setSteps) {
      setSteps([
        { id: 1, title: 'Initializing Agent', status: 'completed', timestamp: new Date() },
        { id: 2, title: 'Processing Input', status: 'in-progress', timestamp: new Date() }
      ]);
    }
    
    // Call real agent execution API
    const response = await fetch('/api/agents/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentType,
        input,
        agentConfig: AVAILABLE_AGENTS[agentType]
      }),
    });

    if (setSteps) {
      setSteps([
        { id: 1, title: 'Initializing Agent', status: 'completed', timestamp: new Date() },
        { id: 2, title: 'Processing Input', status: 'completed', timestamp: new Date() },
        { id: 3, title: 'Executing Strategy', status: 'in-progress', timestamp: new Date() }
      ]);
    }

    if (!response.ok) {
      throw new Error(`Agent execution failed: ${response.status}`);
    }

    const result = await response.json();
    
    if (setSteps) {
      setSteps([
        { id: 1, title: 'Initializing Agent', status: 'completed', timestamp: new Date() },
        { id: 2, title: 'Processing Input', status: 'completed', timestamp: new Date() },
        { id: 3, title: 'Executing Strategy', status: 'completed', timestamp: new Date() }
      ]);
    }
    
    const executionTime = Date.now() - startTime;
    
    return {
      success: true,
      data: {
        agentType,
        result: result.result || result.data,
        metrics: {
          executionTime,
          stepsCompleted: 3,
          confidence: result.confidence || 0.85
        }
      },
      executionTime
    };
    
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Agent execution failed',
      executionTime
    };
  }
}

export function getAgentForGoal(goalTitle: string, goalDescription: string, toolsNeeded: string[]): AgentType | null {
  const content = `${goalTitle} ${goalDescription} ${toolsNeeded.join(' ')}`.toLowerCase();
  
  // Demo and presentation related
  if (content.includes('demo') || content.includes('presentation') || content.includes('pitch')) {
    return 'aiAeAgent';
  }
  
  // Calling and phone outreach
  if (content.includes('call') || content.includes('phone') || content.includes('dial')) {
    return 'aiDialerAgent';
  }
  
  // Lead research and SDR activities
  if (content.includes('research') || content.includes('prospect') || content.includes('sequence')) {
    return 'aiSdrAgent';
  }
  
  // Data enrichment and enhancement
  if (content.includes('enrich') || content.includes('data') || content.includes('intelligence')) {
    return 'leadEnrichmentAgent';
  }
  
  // Lead qualification and scoring
  if (content.includes('score') || content.includes('qualify') || content.includes('priority')) {
    return 'leadScoringAgent';
  }
  
  // Email generation and campaigns
  if (content.includes('email') || content.includes('message') || content.includes('outreach')) {
    return 'personalizedEmailAgent';
  }
  
  // Social media and content marketing
  if (content.includes('social') || content.includes('twitter') || content.includes('facebook') || content.includes('content')) {
    return 'socialMediaAgent';
  }
  
  // LinkedIn professional networking
  if (content.includes('linkedin') || content.includes('professional network') || content.includes('connection')) {
    return 'linkedinAgent';
  }
  
  // Multi-channel communication
  if (content.includes('whatsapp') || content.includes('sms') || content.includes('text') || content.includes('communication')) {
    return 'communicationAgent';
  }
  
  return null;
}

export function getRequiredComposioFeatures(agentType: AgentType): string[] {
  switch (agentType) {
    case 'aiAeAgent':
      return ['Email Automation'];
      
    case 'aiDialerAgent':
      return ['Phone Integration', 'Calendar Sync'];
      
    case 'aiSdrAgent':
      return ['Email Automation', 'LinkedIn Integration', 'Social Media'];
      
    case 'leadEnrichmentAgent':
      return ['Data Verification', 'Contact Discovery'];
      
    case 'leadScoringAgent':
      return ['CRM Integration', 'Slack Notifications'];
      
    case 'personalizedEmailAgent':
      return ['Email Automation', 'Calendar Sync'];
      
    case 'socialMediaAgent':
      return ['Social Media', 'Content Management', 'Analytics'];
      
    case 'linkedinAgent':
      return ['LinkedIn Integration', 'Professional Networking'];
      
    case 'communicationAgent':
      return ['WhatsApp Integration', 'SMS Integration', 'Multi-channel Messaging'];
      
    default:
      return [];
  }
}