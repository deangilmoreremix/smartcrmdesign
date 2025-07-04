import { enhancedGeminiService } from './enhancedGeminiService';
import { aiOrchestratorService } from './aiOrchestratorService';

// Export the enhanced service as the default Gemini service
export { enhancedGeminiService as geminiService };

// Export the hook that uses the database-backed service
export const useGemini = () => {
  return {
    generateContent: async (request: any) => {
      return enhancedGeminiService.generateContent(request);
    },
    generateInsights: async (data: any, customerId?: string, model?: string) => {
      return enhancedGeminiService.generateInsights(data, customerId, model);
    },
    generateEmail: async (context: any, customerId?: string, model?: string) => {
      return enhancedGeminiService.generateEmail(context, customerId, model);
    },
    getAvailableModels: async () => {
      return enhancedGeminiService.getAvailableModels();
    },
    getRecommendedModel: async (useCase: string) => {
      return enhancedGeminiService.getRecommendedModel(useCase);
    },
    // Add orchestrator methods for smart AI routing
    smartGenerateEmail: async (context: any, taskContext: any = {}) => {
      return aiOrchestratorService.generateEmail(context, taskContext);
    },
    analyzePipelineHealth: async (pipelineData: any, taskContext: any = {}) => {
      return aiOrchestratorService.analyzePipelineHealth(pipelineData, taskContext);
    },
    analyzeDeal: async (dealData: any, taskContext: any = {}) => {
      return aiOrchestratorService.analyzeDeal(dealData, taskContext);
    },
    generateMeetingAgenda: async (context: any, taskContext: any = {}) => {
      return aiOrchestratorService.generateMeetingAgenda(context, taskContext);
    },
    generateContactInsights: async (contacts: any[], taskContext: any = {}) => {
      return aiOrchestratorService.generateContactInsights(contacts, taskContext);
    }
  };
};

export default enhancedGeminiService;