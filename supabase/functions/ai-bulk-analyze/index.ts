import { createClient } from 'npm:@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface Contact {
  id: string;
  // Contact properties
  [key: string]: any;
}

interface BulkAnalysisRequest {
  contactIds: string[];
  analysisTypes: string[];
  options?: {
    forceRefresh?: boolean;
    provider?: 'openai' | 'gemini';
    model?: string;
    includeConfidence?: boolean;
  };
}

interface BulkAnalysisResponse {
  results: any[];
  failed: Array<{ contactId: string; error: string }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
    averageScore: number;
    processingTime: number;
  };
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
    const startTime = Date.now();
    
    // Get API keys from environment variables
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!openaiApiKey && !geminiApiKey) {
      throw new Error("No AI provider API keys configured");
    }

    // Parse request
    const request: BulkAnalysisRequest = await req.json();
    const { contactIds, analysisTypes, options = {} } = request;
    
    // Validate request
    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      throw new Error("Contact IDs are required");
    }
    
    if (!analysisTypes || !Array.isArray(analysisTypes) || analysisTypes.length === 0) {
      throw new Error("Analysis types are required");
    }
    
    if (contactIds.length > 50) {
      throw new Error("Bulk analysis is limited to 50 contacts at a time");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch contacts if they're not provided directly
    const contacts: Record<string, any> = {};
    
    // Process contacts in batches
    const batchSize = 10;
    const results: any[] = [];
    const failed: Array<{ contactId: string; error: string }> = [];
    
    for (let i = 0; i < contactIds.length; i += batchSize) {
      const batch = contactIds.slice(i, i + batchSize);
      
      // Process each contact in parallel within the batch
      const batchPromises = batch.map(async (contactId) => {
        try {
          // Determine which provider to use
          const provider = options.provider || 
                          (options.model?.includes('gpt') ? 'openai' : 
                          options.model?.includes('gemini') || options.model?.includes('gemma') ? 'gemini' :
                          geminiApiKey ? 'gemini' : 'openai');
          
          const model = options.model || 
                        (provider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash');
          
          const apiKey = provider === 'openai' ? openaiApiKey : geminiApiKey;
          
          if (!apiKey) {
            throw new Error(`Selected provider ${provider} has no API key configured`);
          }
          
          // Call AI provider
          let analysisResult;
          if (provider === 'openai') {
            analysisResult = await analyzeSingleContactWithOpenAI(
              contactId,
              contacts[contactId] || { id: contactId },
              analysisTypes,
              apiKey as string,
              model
            );
          } else {
            analysisResult = await analyzeSingleContactWithGemini(
              contactId,
              contacts[contactId] || { id: contactId },
              analysisTypes,
              apiKey as string,
              model
            );
          }
          
          return {
            contactId,
            ...analysisResult,
            provider,
            model,
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          console.error(`Error analyzing contact ${contactId}:`, error);
          return { contactId, error: error.message || 'Analysis failed', failed: true };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      
      // Sort results into successful and failed
      for (const result of batchResults) {
        if (result.failed) {
          failed.push({ contactId: result.contactId, error: result.error });
        } else {
          results.push(result);
        }
      }
    }
    
    // Calculate average score
    const totalScore = results.reduce((sum, result) => sum + (result.score || 0), 0);
    const averageScore = results.length > 0 ? totalScore / results.length : 0;
    
    const response: BulkAnalysisResponse = {
      results,
      failed,
      summary: {
        total: contactIds.length,
        successful: results.length,
        failed: failed.length,
        averageScore,
        processingTime: Date.now() - startTime
      }
    };
    
    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error in bulk analysis:", error);
    
    return new Response(JSON.stringify({
      error: error.message || "Failed to analyze contacts"
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});

// Function to analyze a single contact with OpenAI
async function analyzeSingleContactWithOpenAI(
  contactId: string,
  contact: any,
  analysisTypes: string[],
  apiKey: string,
  model: string = 'gpt-4o-mini'
): Promise<any> {
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

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('Invalid response from OpenAI');
  }
  
  try {
    const parsedData = JSON.parse(content);
    return {
      ...parsedData,
      confidence: parsedData.confidence || 80
    };
  } catch (parseError) {
    throw new Error('Failed to parse OpenAI response');
  }
}

// Function to analyze a single contact with Gemini
async function analyzeSingleContactWithGemini(
  contactId: string,
  contact: any,
  analysisTypes: string[],
  apiKey: string,
  model: string = 'gemini-1.5-flash'
): Promise<any> {
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

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!content) {
    throw new Error('Invalid response from Gemini');
  }
  
  // Extract JSON from the response text
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }
  
  try {
    const parsedData = JSON.parse(jsonMatch[0]);
    return {
      ...parsedData,
      confidence: parsedData.confidence || 70
    };
  } catch (parseError) {
    throw new Error('Failed to parse Gemini response');
  }
}