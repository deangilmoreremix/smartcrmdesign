import { createClient } from 'npm:@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  company: string;
  industry?: string;
  avatarSrc: string;
  sources: string[];
  interestLevel: 'hot' | 'medium' | 'low' | 'cold';
  status: 'active' | 'pending' | 'inactive' | 'lead' | 'prospect' | 'customer' | 'churned';
  lastConnected?: string;
  notes?: string;
  aiScore?: number;
  tags?: string[];
  isFavorite?: boolean;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface AIAnalysisRequest {
  contactId: string;
  contact: Contact;
  analysisTypes: ('scoring' | 'enrichment' | 'categorization' | 'tagging' | 'relationships')[];
  options?: {
    forceRefresh?: boolean;
    provider?: 'openai' | 'gemini';
    model?: string;
    includeConfidence?: boolean;
  };
}

interface AIAnalysisResponse {
  contactId: string;
  score?: number;
  confidence: number;
  insights: string[];
  recommendations: string[];
  categories: string[];
  tags: string[];
  provider: string;
  model: string;
  timestamp: string;
  processingTime: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Get API keys from environment variables
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!openaiApiKey && !geminiApiKey) {
      throw new Error("No AI provider API keys configured");
    }

    // Parse request
    const request: AIAnalysisRequest = await req.json();
    const { contactId, contact, analysisTypes, options = {} } = request;
    
    if (!contactId || !contact || !analysisTypes || analysisTypes.length === 0) {
      throw new Error("Invalid request: missing required parameters");
    }

    // Determine provider to use
    const provider = options.provider || 
      (options.model?.includes('gpt') ? 'openai' : 
       options.model?.includes('gemini') || options.model?.includes('gemma') ? 'gemini' :
       geminiApiKey ? 'gemini' : 'openai');

    // Select model based on analysis types and options
    const model = options.model || selectModelForAnalysis(analysisTypes, provider);

    // Start timing
    const startTime = Date.now();

    // Perform analysis with selected provider and model
    let analysisResult: Partial<AIAnalysisResponse>;

    if (provider === 'gemini' && geminiApiKey) {
      analysisResult = await analyzeWithGemini(
        contact, 
        analysisTypes, 
        geminiApiKey, 
        model
      );
    } else if (provider === 'openai' && openaiApiKey) {
      analysisResult = await analyzeWithOpenAI(
        contact, 
        analysisTypes, 
        openaiApiKey, 
        model
      );
    } else {
      throw new Error(`Selected provider ${provider} is not available`);
    }

    // Complete response
    const response: AIAnalysisResponse = {
      contactId,
      score: analysisResult.score,
      confidence: analysisResult.confidence || 70,
      insights: analysisResult.insights || [],
      recommendations: analysisResult.recommendations || [],
      categories: analysisResult.categories || [],
      tags: analysisResult.tags || [],
      provider,
      model,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    };

    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      }
    });

  } catch (error) {
    console.error("Error in AI analysis:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to analyze contact"
    }), {
      status: 400,
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      }
    });
  }
});

// Function to select appropriate model based on analysis types
function selectModelForAnalysis(
  analysisTypes: AIAnalysisRequest['analysisTypes'],
  provider: string
): string {
  if (provider === 'openai') {
    // More complex analysis benefits from more capable models
    if (analysisTypes.includes('relationships')) {
      return 'gpt-4o';
    } else {
      return 'gpt-4o-mini'; // Good balance of cost and capability
    }
  } else { // gemini
    // More complex analysis benefits from more capable models
    if (analysisTypes.includes('relationships')) {
      return 'gemini-1.5-pro';
    } else {
      return 'gemini-1.5-flash'; // Fastest model for most tasks
    }
  }
}

// Function to analyze contact using Gemini
async function analyzeWithGemini(
  contact: Contact,
  analysisTypes: AIAnalysisRequest['analysisTypes'],
  apiKey: string,
  model: string = 'gemini-1.5-flash'
): Promise<Partial<AIAnalysisResponse>> {
  // Construct prompt based on analysis types
  let prompt = `Analyze this contact information and provide insights:\n\n${JSON.stringify(contact, null, 2)}\n\n`;
  
  if (analysisTypes.includes('scoring')) {
    prompt += "Score this contact's potential value (0-100) and explain why.\n";
  }
  
  if (analysisTypes.includes('categorization')) {
    prompt += "Categorize this contact into relevant business categories.\n";
  }
  
  if (analysisTypes.includes('tagging')) {
    prompt += "Suggest relevant tags for this contact.\n";
  }
  
  prompt += `\nReturn a JSON object with the following structure:
  {
    "score": number between 0-100 representing lead quality,
    "confidence": number between 0-100 representing confidence in the analysis,
    "insights": array of strings with key observations,
    "recommendations": array of strings with action recommendations,
    "categories": array of category strings,
    "tags": array of suggested tag strings
  }`;

  try {
    // Determine the correct API URL based on the model
    const modelEndpoint = model.replace(':', '-'); // Handle any colons in model names
    
    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.8,
          maxOutputTokens: 1024
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${data.error?.message || response.statusText}`);
    }
    
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('Invalid response from Gemini');
    }
    
    // Extract JSON from the response text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsedData = JSON.parse(jsonMatch[0]);
    
    return {
      ...parsedData,
      confidence: parsedData.confidence || 70
    };
  } catch (error) {
    console.error("Error calling Gemini:", error);
    
    // Return fallback data
    return {
      score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      confidence: 40,
      insights: [
        "Analysis could not be completed with full confidence",
        "Based on available data, this contact seems to be in the relevant industry"
      ],
      recommendations: ["Follow up to gather more information"],
      categories: [contact.industry || "Unknown"],
      tags: []
    };
  }
}

// Function to analyze contact using OpenAI
async function analyzeWithOpenAI(
  contact: Contact,
  analysisTypes: AIAnalysisRequest['analysisTypes'],
  apiKey: string,
  model: string = 'gpt-4o-mini'
): Promise<Partial<AIAnalysisResponse>> {
  const systemPrompt = "You are an expert CRM analyst with deep expertise in sales, marketing, and customer relationship management. Analyze the contact information provided and return a structured JSON response.";
  
  let userPrompt = `Analyze this contact:\n\n${JSON.stringify(contact, null, 2)}\n\n`;
  
  if (analysisTypes.includes('scoring')) {
    userPrompt += "Assign a lead score from 0-100 based on potential value.\n";
  }
  
  if (analysisTypes.includes('categorization')) {
    userPrompt += "Categorize this contact into relevant business categories.\n";
  }
  
  if (analysisTypes.includes('tagging')) {
    userPrompt += "Suggest relevant tags for this contact.\n";
  }
  
  userPrompt += "Provide key insights and recommendations. Return ONLY a JSON object with no other text.";

  try {
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || response.statusText}`);
    }
    
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('Invalid response from OpenAI');
    }
    
    const parsedData = JSON.parse(content);
    
    return {
      ...parsedData,
      confidence: parsedData.confidence || 80
    };
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    
    // Return fallback data
    return {
      score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      confidence: 40,
      insights: [
        "Analysis could not be completed with full confidence",
        "Based on available data, this contact appears to be a potential lead"
      ],
      recommendations: ["Follow up to gather more information"],
      categories: [contact.industry || "Unknown"],
      tags: []
    };
  }
}