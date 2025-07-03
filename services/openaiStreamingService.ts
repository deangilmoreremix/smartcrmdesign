import OpenAI from 'openai';
import { useApiStore } from '../store/apiStore';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const useOpenAIStream = () => {
  const { apiKeys } = useApiStore();
  
  const getOpenAIClient = () => {
    if (!apiKeys.openai) {
      throw new Error('OpenAI API key is not set');
    }
    
    return new OpenAI({
      apiKey: apiKeys.openai,
      dangerouslyAllowBrowser: true // Note: In production, proxy requests through a backend
    });
  };
  
  const getGeminiClient = () => {
    if (!apiKeys.gemini) {
      throw new Error('Gemini API key is not set');
    }
    
    return new GoogleGenerativeAI(apiKeys.gemini);
  };
  
  // Stream a chat completion with either OpenAI or Gemini based on model name
  const streamChatCompletion = async (
    prompt: string,
    systemPrompt: string,
    onToken: (token: string) => void,
    model: string = 'o1-mini'  // Default to O1-mini for reasoning
  ) => {
    try {
      // Check if the model is from Gemini
      if (model.includes('gemini')) {
        const client = getGeminiClient();
        // Use Gemma 27B for complex agentic tasks requiring planning and tool use
        const actualModel = 'gemma-2-27b-it';
        const genModel = client.getGenerativeModel({ 
          model: actualModel,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        });
        
        // For Gemini, we need to combine the system prompt and user prompt
        const combinedPrompt = `${systemPrompt}\n\nUser query: ${prompt}`;
        
        // Gemini doesn't have a native streaming API like OpenAI in the JavaScript SDK
        // So we'll use the generateContent method and simulate streaming
        const result = await genModel.generateContent(combinedPrompt);
        const response = await result.response;
        const text = response.text();
        
        // Simulate streaming by breaking up the response
        const chunks = text.split(' ');
        let fullResponse = '';
        
        for (const chunk of chunks) {
          await new Promise(resolve => setTimeout(resolve, 10)); // Small delay for streaming effect
          const token = chunk + ' ';
          fullResponse += token;
          onToken(token);
        }
        
        return fullResponse;
      } else {
        // Use OpenAI for non-Gemini models
        const client = getOpenAIClient();
        
        // O1 models don't support streaming or system messages
        if (model.includes('o1')) {
          const response = await client.chat.completions.create({
            model: model,
            messages: [
              { role: 'user', content: `${systemPrompt}\n\n${prompt}` }
            ],
            max_completion_tokens: 4096
          });
          
          const content = response.choices[0]?.message?.content || '';
          // Simulate streaming by sending tokens gradually
          const words = content.split(' ');
          for (let i = 0; i < words.length; i++) {
            onToken(words[i] + (i < words.length - 1 ? ' ' : ''));
            await new Promise(resolve => setTimeout(resolve, 50)); // Delay for streaming effect
          }
          return content;
        }
        
        // For other models, use regular streaming
        const stream = await client.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: prompt
            }
          ],
          stream: true
        });
        
        let fullResponse = '';
        
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          fullResponse += content;
          onToken(content);
        }
        
        return fullResponse;
      }
    } catch (error) {
      console.error('Error streaming chat completion:', error);
      throw error;
    }
  };
  
  // Stream a sales response with specialized prompt
  const streamSalesResponse = async (
    customerQuery: string,
    productInfo: string,
    onToken: (token: string) => void,
    dealStage: string = 'prospect',
    model: string = 'gpt-4o'
  ) => {
    const systemPrompt = `You are an AI sales assistant helping a sales representative respond to a customer query.
    Adapt your response to the ${dealStage} stage of the sales process.
    Be professional, courteous, and focus on addressing customer needs and highlighting relevant product benefits.
    Provide clear next steps whenever possible.`;
    
    const userPrompt = `Customer query: "${customerQuery}"
    
    Our product/service information:
    ${productInfo}
    
    Please provide a helpful response that addresses the customer's query.`;
    
    return streamChatCompletion(userPrompt, systemPrompt, onToken, model);
  };
  
  // Stream a real-time meeting summary
  const streamMeetingSummary = async (
    transcriptSoFar: string,
    onToken: (token: string) => void,
    model: string = 'gpt-4o'
  ) => {
    const systemPrompt = `You are an AI assistant that summarizes sales calls and meetings in real-time.
    As the transcript is being updated, provide an ongoing summary of:
    1. Key points discussed so far
    2. Any decisions made
    3. Action items identified
    4. Questions that need answers
    
    Keep your summary concise and focus on the most important information.`;
    
    return streamChatCompletion(transcriptSoFar, systemPrompt, onToken, model);
  };
  
  // Stream progressive document analysis
  const streamDocumentAnalysis = async (
    documentText: string,
    documentType: 'contract' | 'proposal' | 'email' | 'general',
    onToken: (token: string) => void,
    model: string = 'gemini-pro'  // Use proper model name
  ) => {
    let systemPrompt = 'You are an AI assistant that analyzes documents.';
    
    switch (documentType) {
      case 'contract':
        systemPrompt += ' Focus on key terms, obligations, risks, and recommendations for contract negotiation.';
        break;
      case 'proposal':
        systemPrompt += ' Focus on proposal strengths, weaknesses, pricing, timeline, and recommendations for response.';
        break;
      case 'email':
        systemPrompt += ' Focus on sentiment, action items, key requests, and recommended response approach.';
        break;
      default:
        systemPrompt += ' Provide a general analysis covering key points, insights, and recommended actions.';
    }
    
    return streamChatCompletion(documentText, systemPrompt, onToken, model);
  };
  
  // Stream live deal analysis
  const streamDealAnalysis = async (
    dealData: any,
    onToken: (token: string) => void,
    model: string = 'gemini-pro'  // Use proper model name
  ) => {
    const systemPrompt = `You are an AI sales strategist analyzing a deal opportunity.
    Provide real-time analysis of win probability, risk factors, key opportunities, and recommended next steps.
    Format your analysis with clear sections and actionable insights.`;
    
    const prompt = `Please analyze this sales opportunity data and provide strategic insights:
    ${JSON.stringify(dealData, null, 2)}`;
    
    return streamChatCompletion(prompt, systemPrompt, onToken, model);
  };
  
  // Stream real-time email feedback
  const streamEmailFeedback = async (
    emailContent: string,
    audience: string,
    purpose: string,
    onToken: (token: string) => void,
    model: string = 'gemini-pro'  // Use proper model name
  ) => {
    const systemPrompt = `You are an AI email writing assistant.
    Analyze this email draft in real-time and provide constructive feedback on:
    1. Tone and professionalism
    2. Clarity and conciseness
    3. Persuasiveness for the intended purpose
    4. Grammar and structure
    
    Provide specific, actionable suggestions.`;
    
    const prompt = `Please analyze this draft email:
    
    Audience: ${audience}
    Purpose: ${purpose}
    
    Email Content:
    ${emailContent}`;
    
    return streamChatCompletion(prompt, systemPrompt, onToken, model);
  };
  
  // Stream AI-powered form suggestions
  const streamFormSuggestions = async (
    formType: string,
    filledFields: Record<string, string>, 
    targetField: string,
    onToken: (token: string) => void,
    model: string = 'gemini-pro'  // Use proper model name
  ) => {
    const systemPrompt = `You are an AI form assistant helping to complete a ${formType} form.
    Based on the fields already filled, suggest a value for the target field.
    Provide only the suggested value, nothing else.`;
    
    const filledFieldsStr = Object.entries(filledFields)
      .map(([field, value]) => `${field}: ${value}`)
      .join('\n');
      
    const prompt = `
      Based on these filled form fields:
      ${filledFieldsStr}
      
      Suggest a value for the field: ${targetField}`;
    
    return streamChatCompletion(prompt, systemPrompt, onToken, model);
  };
  
  return {
    streamChatCompletion,
    streamSalesResponse,
    streamMeetingSummary,
    streamDocumentAnalysis,
    streamDealAnalysis,
    streamEmailFeedback,
    streamFormSuggestions
  };
};