import { supabaseAIService, type AIModelConfig } from './supabaseAIService';

interface GenerateContentRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
  customerId?: string;
  featureUsed?: string;
}

interface GenerateContentResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: string;
  responseTime: number;
}

class EnhancedGeminiService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';
  private availableModels: AIModelConfig[] = [];

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_GOOGLE_AI_API_KEY || '';
    this.loadAvailableModels();
  }

  /**
   * Check if API key is valid (not a placeholder)
   */
  private isValidApiKey(): boolean {
    return this.apiKey && 
           this.apiKey.length > 10 && 
           !this.apiKey.includes('your_google_ai_api_key') &&
           !this.apiKey.includes('placeholder') &&
           !this.apiKey.startsWith('your_') &&
           this.apiKey !== 'your_google_ai_api_key';
  }

  /**
   * Strip markdown code blocks from AI response
   */
  private stripMarkdownCodeBlocks(content: string): string {
    // Remove markdown code blocks (```json...``` or ```...```)
    let cleaned = content.trim();
    
    // Remove opening code block markers
    cleaned = cleaned.replace(/^```(?:json|javascript|js)?\s*/i, '');
    
    // Remove closing code block markers
    cleaned = cleaned.replace(/\s*```\s*$/i, '');
    
    // Remove any remaining leading/trailing whitespace
    return cleaned.trim();
  }

  /**
   * Validate and clean customer ID for UUID compatibility
   */
  private validateCustomerId(customerId?: string): string | undefined {
    if (!customerId || customerId === 'demo-customer-id' || customerId.includes('demo') || customerId.includes('placeholder')) {
      return undefined;
    }
    return customerId;
  }

  /**
   * Load available models from Supabase or fallback
   */
  private async loadAvailableModels(): Promise<void> {
    try {
      // Get Google AI models (Gemini and Gemma)
      const geminiModels = await supabaseAIService.getModelsByProvider('gemini');
      this.availableModels = geminiModels;
    } catch (error) {
      console.warn('Error loading available models, using fallback configurations:', error);
      // Get fallback models for Google AI
      this.availableModels = supabaseAIService.getAllFallbackModels().filter(model => 
        model.provider === 'gemini'
      );
    }
  }

  /**
   * Get available models for Google AI
   */
  async getAvailableModels(): Promise<AIModelConfig[]> {
    if (this.availableModels.length === 0) {
      await this.loadAvailableModels();
    }
    return this.availableModels;
  }

  /**
   * Generate content using Supabase-configured models
   */
  async generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
    const startTime = Date.now();
    
    if (!this.isValidApiKey()) {
      throw new Error('Google AI API key is required and must be properly configured. Please check your environment variables.');
    }

    // Get model configuration from database or fallback
    const modelId = request.model || 'gemini-2.5-flash';
    let modelConfig: AIModelConfig | null = null;
    
    try {
      modelConfig = await supabaseAIService.getModelById(modelId);
    } catch (error) {
      console.warn(`Could not fetch model configuration for ${modelId} from database:`, error);
    }
    
    if (!modelConfig) {
      // Use fallback configuration
      modelConfig = supabaseAIService.getFallbackModel(modelId);
      if (!modelConfig) {
        // If still no model config, try with a default working model
        console.warn(`Model ${modelId} not found, trying with default gemini-2.5-flash`);
        modelConfig = supabaseAIService.getFallbackModel('gemini-2.5-flash');
        if (!modelConfig) {
          throw new Error(`Model ${modelId} not found in configuration and no fallback available`);
        }
      }
      console.info(`Using fallback configuration for model ${modelId}`);
    }

    const url = `${this.baseUrl}/models/${modelConfig.model_name}:generateContent`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: request.prompt
        }]
      }],
      generationConfig: {
        temperature: request.temperature || 0.7,
        maxOutputTokens: request.maxTokens || modelConfig.max_tokens || 4096,
        topP: 0.8,
        topK: 10
      }
    };

    // Add system instruction if provided and supported
    if (request.systemInstruction && modelConfig.capabilities && 
        modelConfig.capabilities.includes('system-instructions')) {
      requestBody.systemInstruction = {
        parts: [{
          text: request.systemInstruction
        }]
      };
    }

    try {
      const response = await fetch(`${url}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Google AI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No content generated');
      }

      const candidate = data.candidates[0];
      let content = candidate.content?.parts?.[0]?.text || '';
      const responseTime = Date.now() - startTime;
      
      // Always strip markdown code blocks from the content before returning
      content = this.stripMarkdownCodeBlocks(content);
      
      const result: GenerateContentResponse = {
        content,
        model: modelId,
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0
        },
        finishReason: candidate.finishReason || 'completed',
        responseTime
      };

      // Log usage to Supabase (gracefully handle failures)
      const validCustomerId = this.validateCustomerId(request.customerId);
      if (validCustomerId) {
        const cost = this.calculateCost(modelConfig, result.usage.totalTokens);
        
        try {
          await supabaseAIService.logUsage({
            customer_id: validCustomerId,
            model_id: modelId,
            feature_used: request.featureUsed || 'text-generation',
            tokens_used: result.usage.totalTokens,
            cost,
            response_time_ms: responseTime,
            success: true
          });
        } catch (logError) {
          console.warn('Failed to log AI usage (non-critical):', logError);
        }
      }

      return result;
    } catch (error) {
      // Log failed usage (gracefully handle failures)
      const validCustomerId = this.validateCustomerId(request.customerId);
      if (validCustomerId) {
        try {
          await supabaseAIService.logUsage({
            customer_id: validCustomerId,
            model_id: modelId,
            feature_used: request.featureUsed || 'text-generation',
            tokens_used: 0,
            cost: 0,
            response_time_ms: Date.now() - startTime,
            success: false,
            error_message: error instanceof Error ? error.message : 'Unknown error'
          });
        } catch (logError) {
          console.warn('Failed to log AI error usage (non-critical):', logError);
        }
      }

      console.error('Gemini API error:', error);
      throw error;
    }
  }

  /**
   * Calculate cost based on model pricing
   */
  private calculateCost(model: AIModelConfig, totalTokens: number): number {
    if (!model.pricing) return 0;
    
    // Estimate input/output split (typically 70/30)
    const inputTokens = Math.floor(totalTokens * 0.7);
    const outputTokens = totalTokens - inputTokens;
    
    const inputCost = (inputTokens / 1_000_000) * model.pricing.input_per_1m_tokens;
    const outputCost = (outputTokens / 1_000_000) * model.pricing.output_per_1m_tokens;
    
    return inputCost + outputCost;
  }

  /**
   * Generate insights for CRM data
   */
  async generateInsights(data: any, customerId?: string, model?: string): Promise<any> {
    const prompt = `
    Analyze the following CRM data and provide actionable insights:
    
    ${JSON.stringify(data, null, 2)}
    
    Please provide:
    1. Key insights about the sales pipeline
    2. Recommendations for improving conversion rates
    3. Identification of high-priority opportunities
    4. Potential risks or concerns
    
    Format your response as JSON with the following structure:
    {
      "healthScore": 75,
      "keyInsights": ["Pipeline shows strong growth", "Deal velocity increasing"],
      "bottlenecks": ["3 deals stalled in negotiation stage"],
      "opportunities": ["Focus on high-value Microsoft opportunity"],
      "forecastAccuracy": 85
    }
    `;

    if (!this.isValidApiKey()) {
      return {
        healthScore: 75,
        keyInsights: ["API key not configured - unable to generate AI insights"],
        bottlenecks: ["Please configure Google AI API key"],
        opportunities: ["Set up API keys to enable AI analysis"],
        forecastAccuracy: 0
      };
    }

    try {
      const response = await this.generateContent({
        prompt,
        model: model || 'gemini-2.5-flash',
        customerId,
        featureUsed: 'business_analysis',
        systemInstruction: "You are a CRM analytics expert. Provide concise, actionable insights in valid JSON format only. Do not wrap the JSON in markdown code blocks."
      });

      // Content is already stripped in generateContent, but parse safely
      try {
        return JSON.parse(response.content);
      } catch (parseError) {
        console.warn('Failed to parse JSON response, attempting additional cleanup:', parseError);
        // Additional cleanup attempt
        const cleanedContent = response.content
          .replace(/^[^{]*/, '') // Remove any text before the first {
          .replace(/[^}]*$/, ''); // Remove any text after the last }
        return JSON.parse(cleanedContent);
      }
    } catch (error) {
      console.warn('Error generating insights:', error);
      return {
        healthScore: 0,
        keyInsights: ["Unable to generate insights at this time."],
        bottlenecks: ["Analysis service unavailable"],
        opportunities: ["Manual review required"],
        forecastAccuracy: 0
      };
    }
  }

  /**
   * Generate email content
   */
  async generateEmail(context: {
    recipient: string;
    purpose: string;
    tone?: 'formal' | 'casual' | 'friendly';
    context?: string;
  }, customerId?: string, model?: string): Promise<{ subject: string; body: string }> {
    
    if (!this.isValidApiKey()) {
      return {
        subject: `Following up: ${context.purpose}`,
        body: `Dear ${context.recipient},\n\nI hope this email finds you well.\n\n[Please configure Google AI API key to enable AI-generated content]\n\nBest regards`
      };
    }

    const tone = context.tone || 'professional';
    const prompt = `
    Generate a ${tone} email for the following context:
    
    Recipient: ${context.recipient}
    Purpose: ${context.purpose}
    Additional Context: ${context.context || 'None'}
    
    Format as JSON:
    {
      "subject": "string",
      "body": "string"
    }
    `;

    try {
      const response = await this.generateContent({
        prompt,
        model: model || 'gemma-2-9b-it',
        customerId,
        featureUsed: 'email-generation',
        systemInstruction: "You are a professional email writing assistant. Write clear, engaging emails that drive action. Return only valid JSON without markdown formatting."
      });

      // Content is already stripped in generateContent, but parse safely
      try {
        return JSON.parse(response.content);
      } catch (parseError) {
        console.warn('Failed to parse JSON response, attempting additional cleanup:', parseError);
        // Additional cleanup attempt
        const cleanedContent = response.content
          .replace(/^[^{]*/, '') // Remove any text before the first {
          .replace(/[^}]*$/, ''); // Remove any text after the last }
        return JSON.parse(cleanedContent);
      }
    } catch (error) {
      console.warn('Error generating email:', error);
      return {
        subject: `Following up: ${context.purpose}`,
        body: `Dear ${context.recipient},\n\nI hope this email finds you well.\n\n[Generated content unavailable - please try again]\n\nBest regards`
      };
    }
  }

  /**
   * Get recommended model for a specific use case
   */
  async getRecommendedModel(useCase: string): Promise<AIModelConfig | null> {
    try {
      const models = await supabaseAIService.getRecommendedModels(useCase);
      return models.length > 0 ? models[0] : null;
    } catch (error) {
      console.warn('Error getting recommended model:', error);
      return null;
    }
  }
}

// Create singleton instance
export const enhancedGeminiService = new EnhancedGeminiService();

// Export the hook for React components
export const useEnhancedGemini = () => {
  return {
    generateInsights: (data: any, customerId?: string, model?: string) => 
      enhancedGeminiService.generateInsights(data, customerId, model),
    generateEmail: (context: any, customerId?: string, model?: string) => 
      enhancedGeminiService.generateEmail(context, customerId, model),
    generateContent: (request: GenerateContentRequest) => 
      enhancedGeminiService.generateContent(request),
    getAvailableModels: () => enhancedGeminiService.getAvailableModels(),
    getRecommendedModel: (useCase: string) => enhancedGeminiService.getRecommendedModel(useCase)
  };
};

export default enhancedGeminiService;