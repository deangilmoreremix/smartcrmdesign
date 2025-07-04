import { useState, useCallback } from 'react';
import { enhancedGeminiService } from '../services/enhancedGeminiService';
import { supabaseAIService } from '../services/supabaseAIService';
import { aiOrchestratorService } from '../services/aiOrchestratorService';
import { openAIService } from '../services/openAIService';

// Define types for task optimization
export type TaskType = 'contact_scoring' | 'categorization' | 'contact_enrichment' | 'lead_qualification';

interface TaskRecommendation {
  recommendedModel: string;
  recommendedProvider: string;
  reasoning: string;
  alternativeModels?: string[];
  estimatedCost?: number;
}

interface TaskOptimizationMetrics {
  totalTasks: number;
  overallSuccessRate: number;
  avgResponseTime: number;
  modelPerformance: {
    model: string;
    successRate: number;
    avgTime: number;
    avgCost: number;
    taskTypes: string[];
  }[];
}

// Hook for task-optimized AI model selection
export const useTaskOptimization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get recommendations for AI task assignments
  const getRecommendations = useCallback((taskType: TaskType): TaskRecommendation | null => {
    const recommendations: Record<TaskType, TaskRecommendation> = {
      contact_scoring: {
        recommendedModel: 'gemma-2-9b-it',
        recommendedProvider: 'Google Gemma',
        reasoning: 'Great balance of accuracy and cost for contact scoring tasks. 94% accuracy at 60% the cost of larger models.',
        alternativeModels: ['gemini-2.5-flash', 'gemma-2-27b-it'],
        estimatedCost: 0.025
      },
      categorization: {
        recommendedModel: 'gemma-2-2b-it',
        recommendedProvider: 'Google Gemma',
        reasoning: 'Efficiently categorizes contacts with minimal processing time. Perfect for high-volume tasks with 87% accuracy.',
        alternativeModels: ['gemini-2.5-flash-8b'],
        estimatedCost: 0.015
      },
      contact_enrichment: {
        recommendedModel: 'gemini-2.5-flash',
        recommendedProvider: 'Google Gemini',
        reasoning: 'Higher accuracy when analyzing and enriching contact data with external information. 96% accuracy with best response quality.',
        alternativeModels: ['gemma-2-27b-it'],
        estimatedCost: 0.045
      },
      lead_qualification: {
        recommendedModel: 'gpt-4o-mini',
        recommendedProvider: 'OpenAI',
        reasoning: 'Superior reasoning capabilities for complex lead qualification judgments. Strong accuracy on nuanced decision-making tasks.',
        alternativeModels: ['gemini-2.5-flash'],
        estimatedCost: 0.048
      }
    };

    return recommendations[taskType] || null;
  }, []);

  // Performance metrics from AI service
  const performance: TaskOptimizationMetrics = {
    totalTasks: aiOrchestratorService.getUsageStatistics().totalCalls || 0,
    overallSuccessRate: aiOrchestratorService.getUsageStatistics().totalSuccesses / 
      (aiOrchestratorService.getUsageStatistics().totalCalls || 1),
    avgResponseTime: aiOrchestratorService.getUsageStatistics().avgResponseTime || 0,
    modelPerformance: [
      {
        model: 'gemini-2.5-flash',
        successRate: 0.97,
        avgTime: 1240,
        avgCost: 0.0045,
        taskTypes: ['complex_reasoning', 'content_generation', 'contact_enrichment']
      },
      {
        model: 'gemma-2-9b-it',
        successRate: 0.94,
        avgTime: 750,
        avgCost: 0.0022,
        taskTypes: ['contact_scoring', 'categorization']
      },
      {
        model: 'gemma-2-2b-it',
        successRate: 0.89,
        avgTime: 450,
        avgCost: 0.0012,
        taskTypes: ['categorization', 'basic_classification']
      },
      {
        model: 'gpt-4o-mini',
        successRate: 0.96,
        avgTime: 820,
        avgCost: 0.0090,
        taskTypes: ['lead_qualification', 'complex_analysis']
      }
    ]
  };

  // Generate insights based on data and model usage
  const getInsights = useCallback(async (data: any, customerId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the AI orchestrator to pick the optimal model for this task
      const result = await aiOrchestratorService.analyzePipelineHealth(data, {
        customerId,
        priority: 'quality' // Prioritize quality for insights
      });
      
      if (!result.success) {
        throw new Error("Failed to generate insights");
      }
      
      return result.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate insights';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getRecommendations, getInsights, performance, isLoading, error };
};

// Hook for using Smart AI services
export const useSmartAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get AI models from Supabase
  const getAIModels = useCallback(async (provider?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let models;
      if (provider) {
        models = await supabaseAIService.getModelsByProvider(provider);
      } else {
        models = await supabaseAIService.getAvailableModels();
      }
      return models;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load AI models';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get usage stats
  const getUsageStats = useCallback(async (customerId?: string, timeframe?: 'day' | 'week' | 'month') => {
    setIsLoading(true);
    setError(null);

    try {
      const stats = await supabaseAIService.getUsageStats(customerId, timeframe);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load usage statistics';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get email templates using AI
  const generateEmailTemplate = useCallback(async (
    context: {
      recipient: string;
      purpose: string;
      tone?: string;
      additionalContext?: string;
    },
    customerId?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await aiOrchestratorService.generateEmail(
        {
          recipient: context.recipient,
          purpose: context.purpose,
          tone: context.tone as any,
          context: context.additionalContext
        },
        { customerId }
      );
      
      return result.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate email template';
      setError(errorMessage);
      return {
        subject: `${context.purpose}`,
        body: `Email generation failed. Please try again later.`
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get deal insights using AI
  const analyzeDeal = useCallback(async (dealData: any, customerId?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await aiOrchestratorService.analyzeDeal(
        dealData,
        { customerId }
      );
      
      return result.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze deal';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get meeting agenda using AI
  const generateMeetingAgenda = useCallback(async (
    context: {
      meetingTitle: string;
      attendees: string[];
      purpose: string;
      duration: number;
      previousNotes?: string;
    },
    customerId?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await aiOrchestratorService.generateMeetingAgenda(
        context,
        { customerId }
      );
      
      return result.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate meeting agenda';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    getAIModels, 
    getUsageStats, 
    generateEmailTemplate,
    analyzeDeal,
    generateMeetingAgenda,
    isLoading, 
    error 
  };
};