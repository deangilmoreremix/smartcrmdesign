import { enhancedGeminiService } from './enhancedGeminiService';

export type TaskType = 
  | 'email_generation' 
  | 'email_analysis'
  | 'contact_scoring'
  | 'categorization'
  | 'contact_enrichment'
  | 'lead_qualification'
  | 'sales_forecasting'
  | 'content_creation'
  | 'market_analysis'
  | 'meeting_summarization'
  | 'business_analysis';

export interface ModelRecommendation {
  modelId: string;
  modelName: string;
  provider: string;
  confidence: number;
  reason: string;
  costEfficiency: number; // 0-100
  speed: number; // 0-100
  quality: number; // 0-100
}

export interface TaskConfig {
  name: string;
  description: string;
  priority: 'speed' | 'quality' | 'cost' | 'balanced';
  complexity: 'low' | 'medium' | 'high';
  tokensRequired: {
    min: number;
    avg: number;
    max: number;
  };
}

// Task configuration for different AI tasks
const TASK_CONFIGS: Record<TaskType, TaskConfig> = {
  email_generation: {
    name: 'Email Generation',
    description: 'Generate personalized email content based on context',
    priority: 'balanced',
    complexity: 'medium',
    tokensRequired: {
      min: 200,
      avg: 500,
      max: 1500
    }
  },
  email_analysis: {
    name: 'Email Analysis',
    description: 'Analyze email content for sentiment, intent, and key points',
    priority: 'quality',
    complexity: 'medium',
    tokensRequired: {
      min: 100,
      avg: 300,
      max: 800
    }
  },
  contact_scoring: {
    name: 'Contact Scoring',
    description: 'Score contacts based on engagement potential',
    priority: 'speed',
    complexity: 'low',
    tokensRequired: {
      min: 50,
      avg: 150,
      max: 400
    }
  },
  categorization: {
    name: 'Categorization',
    description: 'Categorize contacts or leads into segments',
    priority: 'speed',
    complexity: 'low',
    tokensRequired: {
      min: 30,
      avg: 100,
      max: 300
    }
  },
  contact_enrichment: {
    name: 'Contact Enrichment',
    description: 'Enhance contact information with additional data',
    priority: 'quality',
    complexity: 'medium',
    tokensRequired: {
      min: 150,
      avg: 400,
      max: 1000
    }
  },
  lead_qualification: {
    name: 'Lead Qualification',
    description: 'Determine if leads meet qualification criteria',
    priority: 'balanced',
    complexity: 'medium',
    tokensRequired: {
      min: 100,
      avg: 300,
      max: 800
    }
  },
  sales_forecasting: {
    name: 'Sales Forecasting',
    description: 'Predict future sales based on historical data',
    priority: 'quality',
    complexity: 'high',
    tokensRequired: {
      min: 300,
      avg: 800,
      max: 2000
    }
  },
  content_creation: {
    name: 'Content Creation',
    description: 'Generate marketing or sales content',
    priority: 'quality',
    complexity: 'high',
    tokensRequired: {
      min: 200,
      avg: 700,
      max: 2500
    }
  },
  market_analysis: {
    name: 'Market Analysis',
    description: 'Analyze market trends and competitive landscape',
    priority: 'quality',
    complexity: 'high',
    tokensRequired: {
      min: 400,
      avg: 1200,
      max: 3000
    }
  },
  meeting_summarization: {
    name: 'Meeting Summarization',
    description: 'Generate concise summaries of meeting transcripts',
    priority: 'balanced',
    complexity: 'medium',
    tokensRequired: {
      min: 200,
      avg: 600,
      max: 1500
    }
  },
  business_analysis: {
    name: 'Business Analysis',
    description: 'Analyze business performance, pipeline data, and generate actionable insights',
    priority: 'quality',
    complexity: 'high',
    tokensRequired: {
      min: 300,
      avg: 900,
      max: 2500
    }
  }
};

// Model performance characteristics
const MODEL_PERFORMANCE = {
  'gemini-2.5-flash': {
    quality: 90,
    speed: 75,
    cost: 60, // higher number = more expensive
    complexityMatch: ['medium', 'high']
  },
  'gemini-2.5-flash-8b': {
    quality: 82,
    speed: 85,
    cost: 30,
    complexityMatch: ['low', 'medium']
  },
  'gemma-2-27b-it': {
    quality: 88,
    speed: 70,
    cost: 45,
    complexityMatch: ['medium', 'high']
  },
  'gemma-2-9b-it': {
    quality: 85,
    speed: 80,
    cost: 20,
    complexityMatch: ['low', 'medium', 'high']
  },
  'gemma-2-2b-it': {
    quality: 75,
    speed: 95,
    cost: 10,
    complexityMatch: ['low', 'medium']
  }
};

class AITaskRecommender {
  /**
   * Get model recommendation for a specific task
   */
  getModelRecommendation(taskType: TaskType, preferredProvider?: string): ModelRecommendation {
    const taskConfig = TASK_CONFIGS[taskType];
    
    if (!taskConfig) {
      throw new Error(`Unknown task type: ${taskType}`);
    }
    
    // Calculate scores for each model based on task requirements
    const scores = Object.entries(MODEL_PERFORMANCE).map(([modelId, performance]) => {
      // Skip if provider doesn't match (when specified)
      if (preferredProvider) {
        const modelProvider = modelId.startsWith('gemma') ? 'google' : 
                              modelId.startsWith('gemini') ? 'google' : 'other';
        if (preferredProvider !== modelProvider) {
          return { modelId, score: 0 };
        }
      }
      
      // Check if model matches complexity requirement
      const complexityMatch = performance.complexityMatch.includes(taskConfig.complexity);
      if (!complexityMatch) {
        return { modelId, score: 0 };
      }
      
      // Calculate weighted score based on task priority
      let score = 0;
      const weights = {
        speed: taskConfig.priority === 'speed' ? 0.6 : 0.2,
        quality: taskConfig.priority === 'quality' ? 0.6 : 0.2,
        cost: taskConfig.priority === 'cost' ? 0.6 : 0.2
      };
      
      // If balanced, adjust weights
      if (taskConfig.priority === 'balanced') {
        weights.speed = 0.3;
        weights.quality = 0.4;
        weights.cost = 0.3;
      }
      
      // Calculate final score (higher is better)
      score = (
        (performance.speed * weights.speed) +
        (performance.quality * weights.quality) +
        ((100 - performance.cost) * weights.cost) // Invert cost so lower cost = higher score
      ) / (weights.speed + weights.quality + weights.cost);
      
      return { modelId, score };
    });
    
    // Sort by score and get the best match
    scores.sort((a, b) => b.score - a.score);
    const bestMatch = scores[0];
    
    if (bestMatch.score === 0) {
      // Fallback to a default model if no good matches
      return {
        modelId: 'gemini-2.5-flash',
        modelName: 'Gemini 2.5 Flash',
        provider: 'Google',
        confidence: 0.6,
        reason: 'Default model selected as no optimal match was found for this task.',
        costEfficiency: 60,
        speed: 75,
        quality: 90
      };
    }
    
    const selectedModel = MODEL_PERFORMANCE[bestMatch.modelId as keyof typeof MODEL_PERFORMANCE];
    const providerName = bestMatch.modelId.includes('gemma') ? 'Google Gemma' : 
                          bestMatch.modelId.includes('gemini') ? 'Google Gemini' : 'OpenAI';
    
    const confidence = bestMatch.score / 100;
    
    // Generate reason based on model strengths and task requirements
    let reason = '';
    if (taskConfig.priority === 'speed') {
      reason = `Selected for its excellent processing speed (${selectedModel.speed}/100) while maintaining adequate quality for ${taskConfig.name.toLowerCase()}.`;
    } else if (taskConfig.priority === 'quality') {
      reason = `Selected for its high-quality outputs (${selectedModel.quality}/100) that meet the precision requirements for ${taskConfig.name.toLowerCase()}.`;
    } else if (taskConfig.priority === 'cost') {
      reason = `Selected for optimal cost efficiency while providing adequate performance for ${taskConfig.name.toLowerCase()}.`;
    } else {
      reason = `Provides a good balance of speed, quality, and cost for ${taskConfig.name.toLowerCase()}.`;
    }
    
    const displayName = bestMatch.modelId
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
      .replace('It', 'Instruction-tuned');
    
    return {
      modelId: bestMatch.modelId,
      modelName: displayName,
      provider: providerName,
      confidence,
      reason,
      costEfficiency: 100 - selectedModel.cost,
      speed: selectedModel.speed,
      quality: selectedModel.quality
    };
  }

  /**
   * Get recommendations for all configured tasks
   */
  getAllRecommendations(): Record<TaskType, ModelRecommendation> {
    const recommendations: Partial<Record<TaskType, ModelRecommendation>> = {};
    
    Object.keys(TASK_CONFIGS).forEach(taskType => {
      recommendations[taskType as TaskType] = this.getModelRecommendation(taskType as TaskType);
    });
    
    return recommendations as Record<TaskType, ModelRecommendation>;
  }

  /**
   * Check if a model is suitable for a task
   */
  isModelSuitableForTask(modelId: string, taskType: TaskType): {
    suitable: boolean;
    confidence: number;
    reason: string;
  } {
    const taskConfig = TASK_CONFIGS[taskType];
    const modelPerf = MODEL_PERFORMANCE[modelId as keyof typeof MODEL_PERFORMANCE];
    
    if (!taskConfig || !modelPerf) {
      return { suitable: false, confidence: 0, reason: 'Invalid task type or model ID.' };
    }
    
    // Check complexity match
    if (!modelPerf.complexityMatch.includes(taskConfig.complexity)) {
      return { 
        suitable: false, 
        confidence: 0.2,
        reason: `This model is not well-suited for ${taskConfig.complexity} complexity tasks.`
      };
    }
    
    // Check priority match
    let score = 0;
    let reason = '';
    
    switch (taskConfig.priority) {
      case 'speed':
        score = modelPerf.speed / 100;
        reason = modelPerf.speed > 80 
          ? 'This model is well-suited for speed-prioritized tasks.'
          : 'This model may not be fast enough for this speed-critical task.';
        break;
        
      case 'quality':
        score = modelPerf.quality / 100;
        reason = modelPerf.quality > 80
          ? 'This model is well-suited for quality-prioritized tasks.'
          : 'This model may not produce high enough quality for this task.';
        break;
        
      case 'cost':
        score = (100 - modelPerf.cost) / 100;
        reason = modelPerf.cost < 30
          ? 'This model is cost-effective for this task.'
          : 'There may be more cost-effective options for this task.';
        break;
        
      case 'balanced':
        score = ((modelPerf.speed + modelPerf.quality + (100 - modelPerf.cost)) / 3) / 100;
        reason = score > 0.7
          ? 'This model provides a good balance for this task.'
          : 'This model may not provide the best balance for this task.';
        break;
    }
    
    return {
      suitable: score > 0.6,
      confidence: score,
      reason
    };
  }
}

// Create singleton instance
export const aiTaskRecommender = new AITaskRecommender();
export default aiTaskRecommender;