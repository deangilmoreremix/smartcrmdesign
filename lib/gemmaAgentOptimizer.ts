// Gemma Agent Optimizer for AI Goals System
// Optimizes Gemma model configurations for different agentic tasks

export interface GemmaConfig {
  modelVersion: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  capabilities: string[];
  specializations: string[];
  promptOptimizations: string[];
}

export type TaskType = 
  | 'proposal_generation'
  | 'lead_scoring' 
  | 'email_outreach'
  | 'content_creation'
  | 'data_analysis'
  | 'automation_planning'
  | 'research_synthesis'
  | 'decision_making';

export type ComplexityLevel = 'simple' | 'intermediate' | 'complex';

// Optimal Gemma configurations for different tasks
const GEMMA_CONFIGURATIONS: Record<TaskType, Record<ComplexityLevel, GemmaConfig>> = {
  proposal_generation: {
    simple: {
      modelVersion: 'gemma-2-9b-it',
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      topK: 40,
      capabilities: ['text-generation', 'structured-output', 'template-following'],
      specializations: ['business-writing', 'persuasive-content'],
      promptOptimizations: ['clear-structure', 'benefit-focused', 'action-oriented']
    },
    intermediate: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.6,
      maxTokens: 4096,
      topP: 0.85,
      topK: 35,
      capabilities: ['text-generation', 'research-integration', 'personalization', 'multi-step-reasoning'],
      specializations: ['business-strategy', 'market-analysis', 'competitive-positioning'],
      promptOptimizations: ['data-driven', 'stakeholder-analysis', 'roi-focused']
    },
    complex: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.5,
      maxTokens: 8192,
      topP: 0.8,
      topK: 30,
      capabilities: ['advanced-reasoning', 'multi-agent-coordination', 'tool-integration', 'strategic-planning'],
      specializations: ['enterprise-sales', 'complex-negotiations', 'multi-stakeholder-alignment'],
      promptOptimizations: ['systematic-analysis', 'risk-assessment', 'scenario-planning']
    }
  },
  
  lead_scoring: {
    simple: {
      modelVersion: 'gemma-2-9b-it',
      temperature: 0.3,
      maxTokens: 1024,
      topP: 0.8,
      topK: 25,
      capabilities: ['classification', 'scoring', 'pattern-recognition'],
      specializations: ['basic-lead-qualification', 'simple-scoring-models'],
      promptOptimizations: ['criteria-based', 'consistent-scoring', 'clear-categories']
    },
    intermediate: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.2,
      maxTokens: 2048,
      topP: 0.75,
      topK: 20,
      capabilities: ['advanced-classification', 'multi-factor-analysis', 'predictive-scoring'],
      specializations: ['behavioral-analysis', 'intent-detection', 'conversion-prediction'],
      promptOptimizations: ['data-weighted', 'historical-context', 'predictive-modeling']
    },
    complex: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.1,
      maxTokens: 4096,
      topP: 0.7,
      topK: 15,
      capabilities: ['machine-learning-integration', 'real-time-analysis', 'dynamic-scoring'],
      specializations: ['enterprise-lead-models', 'multi-channel-analysis', 'lifetime-value-prediction'],
      promptOptimizations: ['algorithmic-approach', 'continuous-learning', 'market-adaptation']
    }
  },

  email_outreach: {
    simple: {
      modelVersion: 'gemma-2-9b-it',
      temperature: 0.8,
      maxTokens: 1024,
      topP: 0.9,
      topK: 40,
      capabilities: ['personalization', 'tone-adaptation', 'template-generation'],
      specializations: ['cold-outreach', 'follow-up-sequences'],
      promptOptimizations: ['conversational-tone', 'value-proposition', 'clear-cta']
    },
    intermediate: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.85,
      topK: 35,
      capabilities: ['advanced-personalization', 'context-awareness', 'multi-touch-campaigns'],
      specializations: ['industry-specific', 'role-based-messaging', 'timing-optimization'],
      promptOptimizations: ['research-integration', 'pain-point-focused', 'relationship-building']
    },
    complex: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.6,
      maxTokens: 4096,
      topP: 0.8,
      topK: 30,
      capabilities: ['strategic-messaging', 'stakeholder-mapping', 'campaign-orchestration'],
      specializations: ['enterprise-outreach', 'multi-stakeholder-campaigns', 'account-based-marketing'],
      promptOptimizations: ['strategic-narrative', 'stakeholder-alignment', 'ecosystem-awareness']
    }
  },

  content_creation: {
    simple: {
      modelVersion: 'gemma-2-9b-it',
      temperature: 0.8,
      maxTokens: 2048,
      topP: 0.9,
      topK: 40,
      capabilities: ['creative-writing', 'format-adaptation', 'audience-targeting'],
      specializations: ['blog-posts', 'social-media', 'basic-marketing-copy'],
      promptOptimizations: ['engaging-headlines', 'clear-structure', 'audience-appropriate']
    },
    intermediate: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.7,
      maxTokens: 4096,
      topP: 0.85,
      topK: 35,
      capabilities: ['advanced-storytelling', 'brand-voice-adaptation', 'multi-format-content'],
      specializations: ['thought-leadership', 'technical-content', 'conversion-optimization'],
      promptOptimizations: ['brand-consistency', 'seo-optimization', 'engagement-focused']
    },
    complex: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.6,
      maxTokens: 8192,
      topP: 0.8,
      topK: 30,
      capabilities: ['strategic-content-planning', 'cross-channel-coordination', 'content-ecosystem-design'],
      specializations: ['content-strategy', 'multi-stakeholder-content', 'complex-narrative-development'],
      promptOptimizations: ['strategic-alignment', 'ecosystem-integration', 'long-term-impact']
    }
  },

  data_analysis: {
    simple: {
      modelVersion: 'gemma-2-9b-it',
      temperature: 0.2,
      maxTokens: 2048,
      topP: 0.8,
      topK: 25,
      capabilities: ['pattern-recognition', 'basic-statistics', 'trend-identification'],
      specializations: ['descriptive-analytics', 'simple-reporting'],
      promptOptimizations: ['data-accuracy', 'clear-insights', 'actionable-recommendations']
    },
    intermediate: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.1,
      maxTokens: 4096,
      topP: 0.75,
      topK: 20,
      capabilities: ['advanced-analytics', 'correlation-analysis', 'predictive-insights'],
      specializations: ['business-intelligence', 'performance-analysis', 'market-research'],
      promptOptimizations: ['statistical-rigor', 'business-context', 'strategic-implications']
    },
    complex: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.05,
      maxTokens: 8192,
      topP: 0.7,
      topK: 15,
      capabilities: ['machine-learning-integration', 'complex-modeling', 'multi-dimensional-analysis'],
      specializations: ['enterprise-analytics', 'predictive-modeling', 'optimization-strategies'],
      promptOptimizations: ['model-validation', 'uncertainty-quantification', 'decision-support']
    }
  },

  automation_planning: {
    simple: {
      modelVersion: 'gemma-2-9b-it',
      temperature: 0.4,
      maxTokens: 2048,
      topP: 0.8,
      topK: 30,
      capabilities: ['process-mapping', 'workflow-design', 'basic-automation'],
      specializations: ['simple-workflows', 'task-automation'],
      promptOptimizations: ['step-by-step', 'clear-dependencies', 'error-handling']
    },
    intermediate: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.3,
      maxTokens: 4096,
      topP: 0.75,
      topK: 25,
      capabilities: ['complex-workflows', 'integration-planning', 'optimization-strategies'],
      specializations: ['business-process-automation', 'system-integration'],
      promptOptimizations: ['efficiency-optimization', 'scalability-planning', 'maintenance-considerations']
    },
    complex: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.2,
      maxTokens: 8192,
      topP: 0.7,
      topK: 20,
      capabilities: ['enterprise-automation', 'multi-system-orchestration', 'ai-agent-coordination'],
      specializations: ['complex-automation-ecosystems', 'intelligent-process-automation'],
      promptOptimizations: ['architectural-thinking', 'resilience-planning', 'continuous-improvement']
    }
  },

  research_synthesis: {
    simple: {
      modelVersion: 'gemma-2-9b-it',
      temperature: 0.3,
      maxTokens: 2048,
      topP: 0.8,
      topK: 25,
      capabilities: ['information-synthesis', 'source-evaluation', 'summary-generation'],
      specializations: ['basic-research', 'fact-compilation'],
      promptOptimizations: ['source-citation', 'clear-synthesis', 'relevant-filtering']
    },
    intermediate: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.2,
      maxTokens: 4096,
      topP: 0.75,
      topK: 20,
      capabilities: ['advanced-synthesis', 'cross-source-analysis', 'insight-generation'],
      specializations: ['market-research', 'competitive-intelligence', 'trend-analysis'],
      promptOptimizations: ['analytical-depth', 'pattern-identification', 'strategic-insights']
    },
    complex: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.1,
      maxTokens: 8192,
      topP: 0.7,
      topK: 15,
      capabilities: ['meta-analysis', 'knowledge-integration', 'hypothesis-generation'],
      specializations: ['strategic-research', 'multi-domain-synthesis', 'innovation-research'],
      promptOptimizations: ['systematic-approach', 'bias-mitigation', 'knowledge-gaps-identification']
    }
  },

  decision_making: {
    simple: {
      modelVersion: 'gemma-2-9b-it',
      temperature: 0.3,
      maxTokens: 1024,
      topP: 0.8,
      topK: 25,
      capabilities: ['option-evaluation', 'criteria-based-assessment', 'basic-recommendation'],
      specializations: ['simple-decisions', 'clear-trade-offs'],
      promptOptimizations: ['pros-cons-analysis', 'clear-criteria', 'actionable-recommendations']
    },
    intermediate: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.2,
      maxTokens: 2048,
      topP: 0.75,
      topK: 20,
      capabilities: ['multi-criteria-analysis', 'risk-assessment', 'scenario-planning'],
      specializations: ['business-decisions', 'strategic-choices', 'optimization'],
      promptOptimizations: ['weighted-analysis', 'risk-consideration', 'implementation-planning']
    },
    complex: {
      modelVersion: 'gemma-2-27b-it',
      temperature: 0.1,
      maxTokens: 4096,
      topP: 0.7,
      topK: 15,
      capabilities: ['strategic-decision-making', 'stakeholder-analysis', 'long-term-planning'],
      specializations: ['enterprise-decisions', 'complex-trade-offs', 'system-thinking'],
      promptOptimizations: ['holistic-analysis', 'stakeholder-impact', 'long-term-consequences']
    }
  }
};

export function getOptimalGemmaConfig(taskType: TaskType, complexity: ComplexityLevel): GemmaConfig {
  return GEMMA_CONFIGURATIONS[taskType][complexity];
}

export function enhanceAgenticPrompt(basePrompt: string, taskType: TaskType, complexity: ComplexityLevel): string {
  const config = getOptimalGemmaConfig(taskType, complexity);
  
  let enhancedPrompt = basePrompt;
  
  // Add task-specific instructions
  enhancedPrompt += `\n\n## Task Configuration:`;
  enhancedPrompt += `\nTask Type: ${taskType}`;
  enhancedPrompt += `\nComplexity Level: ${complexity}`;
  enhancedPrompt += `\nOptimized for: ${config.specializations.join(', ')}`;
  
  // Add optimization instructions
  enhancedPrompt += `\n\n## Optimization Guidelines:`;
  config.promptOptimizations.forEach(optimization => {
    enhancedPrompt += `\n- ${optimization.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
  });
  
  // Add capability context
  enhancedPrompt += `\n\n## Available Capabilities:`;
  config.capabilities.forEach(capability => {
    enhancedPrompt += `\n- ${capability.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
  });
  
  return enhancedPrompt;
}

export function addChainOfThought(prompt: string, taskType: TaskType): string {
  const chainOfThoughtTemplates: Record<TaskType, string> = {
    proposal_generation: `
## Chain of Thought Process:
1. **Analyze Requirements**: What are the key objectives and constraints?
2. **Research Context**: What market conditions and competitive factors matter?
3. **Identify Value Propositions**: What unique benefits can we offer?
4. **Structure Proposal**: How should we organize the proposal for maximum impact?
5. **Optimize Content**: How can we make each section more compelling?
6. **Review and Refine**: What improvements would strengthen the proposal?`,

    lead_scoring: `
## Chain of Thought Process:
1. **Evaluate Data Quality**: What information is available and reliable?
2. **Apply Scoring Criteria**: Which factors indicate higher conversion probability?
3. **Assess Behavioral Signals**: What actions suggest genuine interest?
4. **Consider Context Factors**: How do timing and market conditions affect scoring?
5. **Calculate Composite Score**: How should different factors be weighted?
6. **Provide Reasoning**: Why did this lead receive this score?`,

    email_outreach: `
## Chain of Thought Process:
1. **Analyze Recipient Profile**: What do we know about this person and their role?
2. **Identify Pain Points**: What challenges might they be facing?
3. **Craft Value Proposition**: How can we help solve their specific problems?
4. **Choose Tone and Style**: What communication style will resonate best?
5. **Structure Message**: How should we organize for maximum engagement?
6. **Include Call-to-Action**: What specific next step do we want them to take?`,

    content_creation: `
## Chain of Thought Process:
1. **Define Audience**: Who exactly are we writing for?
2. **Clarify Objectives**: What do we want readers to think, feel, or do?
3. **Research Topic**: What insights and information should we include?
4. **Plan Structure**: How should we organize the content for best flow?
5. **Write with Purpose**: How does each section serve our objectives?
6. **Optimize for Engagement**: What will keep readers interested throughout?`,

    data_analysis: `
## Chain of Thought Process:
1. **Understand Data Context**: What does this data represent and how was it collected?
2. **Identify Patterns**: What trends, correlations, or anomalies are visible?
3. **Consider Statistical Significance**: Which findings are meaningful vs. noise?
4. **Analyze Business Impact**: What do these patterns mean for business outcomes?
5. **Generate Insights**: What actionable conclusions can we draw?
6. **Recommend Actions**: What specific steps should be taken based on this analysis?`,

    automation_planning: `
## Chain of Thought Process:
1. **Map Current Process**: What are all the steps in the existing workflow?
2. **Identify Automation Opportunities**: Which steps can be automated effectively?
3. **Assess Dependencies**: What systems, data, or approvals are required?
4. **Design Workflow**: How should the automated process flow?
5. **Plan Error Handling**: What could go wrong and how should we handle it?
6. **Consider Maintenance**: How will this automation be monitored and updated?`,

    research_synthesis: `
## Chain of Thought Process:
1. **Evaluate Sources**: Which sources are most credible and relevant?
2. **Identify Key Themes**: What common patterns emerge across sources?
3. **Note Contradictions**: Where do sources disagree and why might that be?
4. **Synthesize Insights**: What new understanding emerges from combining sources?
5. **Assess Gaps**: What important questions remain unanswered?
6. **Draw Conclusions**: What are the most important takeaways for our purpose?`,

    decision_making: `
## Chain of Thought Process:
1. **Frame the Decision**: What exactly needs to be decided and by when?
2. **Identify Options**: What are all the viable alternatives?
3. **Define Criteria**: What factors should influence this decision?
4. **Evaluate Trade-offs**: What are the pros and cons of each option?
5. **Assess Risks**: What could go wrong with each choice?
6. **Make Recommendation**: Which option best serves our objectives and why?`
  };

  return prompt + '\n' + (chainOfThoughtTemplates[taskType] || '');
}

export function optimizeForAgenticBehavior(prompt: string): string {
  const agenticEnhancements = `
## Agentic Behavior Guidelines:
- **Think Step-by-Step**: Break complex tasks into logical steps
- **Reason Explicitly**: Show your thinking process clearly
- **Iterate and Improve**: Refine your approach based on results
- **Consider Multiple Perspectives**: Evaluate from different angles
- **Plan Before Acting**: Outline your approach before executing
- **Monitor Progress**: Check if you're on track toward the goal
- **Adapt Strategy**: Adjust your approach if needed
- **Provide Clear Rationale**: Explain why you made specific choices
`;

  return prompt + '\n' + agenticEnhancements;
}