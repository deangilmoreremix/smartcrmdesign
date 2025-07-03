// Gemma Agent Optimizer - Implementing agentic best practices from the analysis
// Based on research: Gemma 7B for complex agentic tasks, 2B for simple operations

export interface AgenticConfig {
  modelVersion: 'gemma-7b' | 'gemma-2b';
  capabilities: AgenticCapability[];
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export type AgenticCapability = 
  | 'tool_use' 
  | 'planning' 
  | 'memory_management' 
  | 'observation_reflection' 
  | 'autonomous_iteration';

export class GemmaAgentOptimizer {
  // Get optimal configuration based on task complexity
  static getOptimalConfig(taskType: string, complexity: 'simple' | 'complex'): AgenticConfig {
    const configs: Record<string, AgenticConfig> = {
      // Complex agentic tasks - Use Gemma 7B
      lead_scoring_complex: {
        modelVersion: 'gemma-7b',
        capabilities: ['tool_use', 'planning', 'observation_reflection'],
        temperature: 0.3,
        maxTokens: 2000,
        systemPrompt: `You are an advanced lead scoring agent with agentic capabilities.

AGENTIC FRAMEWORK:
1. PLANNING: Break down lead analysis into systematic steps
2. TOOL USE: Leverage CRM data, enrichment APIs, and scoring algorithms
3. OBSERVATION: Monitor scoring accuracy and adjust criteria
4. REFLECTION: Analyze past scoring decisions for continuous improvement

Your task is to:
- Plan a comprehensive lead evaluation strategy
- Use available tools to gather enrichment data
- Observe patterns in successful conversions
- Reflect on scoring accuracy and optimize criteria

Think step-by-step and explain your reasoning process.`
      },

      // Complex proposal generation - Use Gemma 7B
      proposal_generation: {
        modelVersion: 'gemma-7b',
        capabilities: ['planning', 'tool_use', 'memory_management', 'autonomous_iteration'],
        temperature: 0.4,
        maxTokens: 3000,
        systemPrompt: `You are an autonomous proposal generation agent.

AGENTIC WORKFLOW:
1. PLANNING: Decompose proposal requirements into structured sections
2. MEMORY: Recall client preferences and past successful proposals
3. TOOL USE: Access templates, pricing data, and client information
4. ITERATION: Refine proposals based on feedback and optimization

Your approach:
- Plan the proposal structure based on client needs
- Remember past interactions and preferences
- Use tools to gather pricing and technical specifications
- Iterate on content quality until optimal

Execute autonomously with detailed step-by-step reasoning.`
      },

      // Complex reengagement campaigns - Use Gemma 7B
      reengagement_strategy: {
        modelVersion: 'gemma-7b',
        capabilities: ['planning', 'memory_management', 'observation_reflection', 'autonomous_iteration'],
        temperature: 0.5,
        maxTokens: 2500,
        systemPrompt: `You are an autonomous reengagement strategist with advanced agentic capabilities.

AGENTIC STRATEGY:
1. PLANNING: Create multi-step reengagement sequences
2. MEMORY: Analyze historical engagement patterns and preferences
3. OBSERVATION: Monitor campaign performance and engagement metrics
4. REFLECTION: Learn from successful reactivation strategies
5. ITERATION: Continuously optimize approach based on results

Your mission:
- Plan personalized reengagement campaigns
- Remember what worked for similar prospects
- Observe response patterns and engagement signals
- Reflect on campaign effectiveness
- Iterate strategies for maximum reactivation success

Think strategically and adapt your approach dynamically.`
      },

      // Simple tool use - Use Gemma 2B for efficiency
      simple_email_compose: {
        modelVersion: 'gemma-2b',
        capabilities: ['tool_use'],
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: `You are an email composition assistant.

Use available tools to:
- Access contact information
- Apply email templates
- Personalize content

Keep responses focused and concise.`
      },

      // Simple lead qualification - Use Gemma 2B
      basic_qualification: {
        modelVersion: 'gemma-2b',
        capabilities: ['tool_use', 'planning'],
        temperature: 0.3,
        maxTokens: 800,
        systemPrompt: `You are a basic lead qualification agent.

Your process:
1. Plan qualification questions
2. Use CRM tools to gather basic information
3. Provide simple qualified/unqualified assessment

Focus on efficiency and clear outcomes.`
      }
    };

    // Return appropriate config or default to complex
    const key = complexity === 'simple' ? `simple_${taskType}` : taskType;
    return configs[key] || configs.proposal_generation;
  }

  // Enhanced prompt engineering for agentic behaviors
  static enhancePromptForAgentic(basePrompt: string, capabilities: AgenticCapability[]): string {
    let enhancedPrompt = basePrompt;

    if (capabilities.includes('planning')) {
      enhancedPrompt += `\n\nPLANNING INSTRUCTION: Before executing any task, first outline your step-by-step plan. Think through the logical sequence of actions needed to achieve the goal.`;
    }

    if (capabilities.includes('tool_use')) {
      enhancedPrompt += `\n\nTOOL USE INSTRUCTION: Identify which tools you need for each step. Format tool requests clearly and interpret tool outputs to inform your next actions.`;
    }

    if (capabilities.includes('memory_management')) {
      enhancedPrompt += `\n\nMEMORY INSTRUCTION: Consider relevant historical context and past interactions. Use this information to personalize and improve your approach.`;
    }

    if (capabilities.includes('observation_reflection')) {
      enhancedPrompt += `\n\nREFLECTION INSTRUCTION: After completing tasks, analyze what worked well and what could be improved. Use this insight to enhance future performance.`;
    }

    if (capabilities.includes('autonomous_iteration')) {
      enhancedPrompt += `\n\nITERATION INSTRUCTION: If initial results are not optimal, automatically adjust your approach and try alternative strategies until you achieve the desired outcome.`;
    }

    return enhancedPrompt;
  }

  // Chain of Thought prompting for complex reasoning
  static addChainOfThought(prompt: string): string {
    return `${prompt}\n\nIMPORTANT: Use Chain of Thought reasoning. For each step:
1. State what you're thinking
2. Explain your reasoning
3. Show your decision process
4. Describe the expected outcome

Format your response with clear thinking steps before providing the final answer.`;
  }

  // Model-specific optimization parameters
  static getModelParams(modelVersion: 'gemma-7b' | 'gemma-2b', taskType: string) {
    const baseParams = {
      'gemma-7b': {
        temperature: 0.3,
        maxTokens: 2000,
        topP: 0.9,
        contextWindow: 8192
      },
      'gemma-2b': {
        temperature: 0.5,
        maxTokens: 1000,
        topP: 0.8,
        contextWindow: 2048
      }
    };

    // Task-specific adjustments
    const taskAdjustments = {
      creative: { temperature: 0.7 },
      analytical: { temperature: 0.2 },
      conversational: { temperature: 0.6 },
      structured: { temperature: 0.3 }
    };

    const params = { ...baseParams[modelVersion] };
    
    // Apply task-specific adjustments
    if (taskType.includes('creative') || taskType.includes('email')) {
      params.temperature = taskAdjustments.creative.temperature;
    } else if (taskType.includes('analysis') || taskType.includes('scoring')) {
      params.temperature = taskAdjustments.analytical.temperature;
    }

    return params;
  }

  // Autonomous iteration framework
  static createIterationFramework(maxIterations: number = 3): string {
    return `
AUTONOMOUS ITERATION FRAMEWORK:
You can iterate up to ${maxIterations} times to improve your results.

For each iteration:
1. Evaluate your current result against the goal
2. Identify specific areas for improvement
3. Adjust your strategy or approach
4. Execute the improved version
5. Check if the result meets quality standards

Continue iterating until you achieve optimal results or reach the maximum iterations.

Track your iterations:
- Iteration 1: [Initial approach and result]
- Iteration 2: [Improvement made and result]  
- Iteration 3: [Final optimization and result]
`;
  }

  // Safety and responsible AI guidelines
  static addSafetyGuidelines(): string {
    return `
SAFETY GUIDELINES:
- Always verify information before making decisions
- Respect user privacy and data protection
- Avoid biased or discriminatory recommendations
- Maintain professional and ethical standards
- Flag any concerning or inappropriate requests
- Ensure transparency in automated actions
`;
  }
}

// Export utility functions for easy integration
export const getOptimalGemmaConfig = GemmaAgentOptimizer.getOptimalConfig;
export const enhanceAgenticPrompt = GemmaAgentOptimizer.enhancePromptForAgentic;
export const addChainOfThought = GemmaAgentOptimizer.addChainOfThought;