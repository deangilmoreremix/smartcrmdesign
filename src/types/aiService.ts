export interface AIServiceConfig {
  provider: string;
  modelId: string;
  apiKey: string;
  organization?: string;
  endpointUrl?: string;
}

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  stop?: string[];
}

export interface GenerateRequest {
  prompt: string;
  systemPrompt?: string;
  options?: GenerateOptions;
  tools?: any[];
  modelId?: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface GenerateResponse {
  content: string;
  usage: TokenUsage;
  model: string;
  provider: string;
  duration: number;
  finishReason?: string;
}

export interface FunctionCall {
  name: string;
  arguments: Record<string, any>;
}

export interface ToolCallResult {
  functionCall: FunctionCall;
  response: string;
}

export interface AIServiceResult {
  content: string;
  usage: TokenUsage;
  model: string;
  provider: string;
  duration: number;
  finishReason?: string;
  toolCalls?: ToolCallResult[];
  error?: string;
}

export interface AIModelProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  models: AIModel[];
  available: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  version: string;
  provider: string;
  capabilities: string[];
  contextWindow: number;
  pricing: {
    input: number;
    output: number;
  };
  recommended?: boolean;
}