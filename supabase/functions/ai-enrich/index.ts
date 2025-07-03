import { createClient } from 'npm:@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Interface for contact enrichment
interface ContactEnrichmentData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
  industry?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  avatar?: string;
  bio?: string;
  notes?: string;
  confidence?: number;
}

interface EnrichmentRequest {
  enrichmentRequest: {
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    linkedinUrl?: string;
  };
  provider?: string;
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
    const requestData: EnrichmentRequest = await req.json();
    
    // Basic validation
    if (!requestData.enrichmentRequest) {
      throw new Error("Missing enrichment request data");
    }
    
    const { email, firstName, lastName, company, linkedinUrl } = requestData.enrichmentRequest;
    
    if (!email && !linkedinUrl && !(firstName || lastName)) {
      throw new Error("At least one identifier (email, name, or LinkedIn URL) is required");
    }

    // Determine which provider to use
    const provider = requestData.provider || 
      (geminiApiKey ? "gemini" : "openai");

    // Perform enrichment with the selected provider
    let enrichmentResult: ContactEnrichmentData;
    
    if (provider === "gemini" && geminiApiKey) {
      enrichmentResult = await enrichWithGemini(
        requestData.enrichmentRequest,
        geminiApiKey
      );
    } else if (provider === "openai" && openaiApiKey) {
      enrichmentResult = await enrichWithOpenAI(
        requestData.enrichmentRequest,
        openaiApiKey
      );
    } else {
      throw new Error(`Selected provider ${provider} is not available`);
    }

    // Return the enrichment results
    return new Response(JSON.stringify(enrichmentResult), {
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      }
    });

  } catch (error) {
    console.error("Error in AI enrichment:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to enrich contact data"
    }), {
      status: 400,
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      }
    });
  }
});

// Function to enrich contact data using Gemini
async function enrichWithGemini(
  enrichmentRequest: EnrichmentRequest['enrichmentRequest'], 
  apiKey: string
): Promise<ContactEnrichmentData> {
  const { email, firstName, lastName, company, linkedinUrl } = enrichmentRequest;
  let prompt = "";

  if (linkedinUrl) {
    prompt = `Research a professional from this LinkedIn URL: ${linkedinUrl}.`;
  } else if (email) {
    prompt = `Research information about a professional with email: ${email}.`;
  } else {
    prompt = `Research information about a professional named ${firstName} ${lastName}${company ? ` who works at ${company}` : ''}.`;
  }

  prompt += `\n\nReturn a JSON object with the following structure:
  {
    "firstName": "first name",
    "lastName": "last name",
    "name": "full name",
    "email": "likely email based on name and company",
    "phone": "likely phone if available",
    "title": "job title",
    "company": "company name",
    "industry": "industry",
    "location": {
      "city": "city",
      "state": "state",
      "country": "country"
    },
    "socialProfiles": {
      "linkedin": "LinkedIn URL",
      "twitter": "Twitter URL if available",
      "website": "company or personal website"
    },
    "bio": "brief professional bio",
    "confidence": number between 40 and 90 indicating confidence level
  }`;

  try {
    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
    
    // Ensure response has required fields
    return {
      ...parsedData,
      confidence: parsedData.confidence || 60
    };
  } catch (error) {
    console.error("Error calling Gemini:", error);
    
    // Return minimal data to prevent UI breakage
    return {
      firstName: firstName || "",
      lastName: lastName || "",
      name: firstName && lastName ? `${firstName} ${lastName}` : "",
      email: email || "",
      company: company || "",
      confidence: 30,
      notes: 'API research failed, showing basic information'
    };
  }
}

// Function to enrich contact data using OpenAI
async function enrichWithOpenAI(
  enrichmentRequest: EnrichmentRequest['enrichmentRequest'], 
  apiKey: string
): Promise<ContactEnrichmentData> {
  const { email, firstName, lastName, company, linkedinUrl } = enrichmentRequest;
  let systemPrompt = "You are an AI assistant that helps with contact research. Given information about a person, infer likely details and return structured data.";
  let userPrompt = "";

  if (linkedinUrl) {
    userPrompt = `Research a professional from this LinkedIn URL: ${linkedinUrl}.`;
  } else if (email) {
    userPrompt = `Research information for this contact email: ${email}.`;
  } else {
    userPrompt = `Research information about a professional named ${firstName} ${lastName}${company ? ` who works at ${company}` : ''}.`;
  }

  userPrompt += " Return ONLY a JSON object with no other text.";

  try {
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
    
    try {
      const parsedData = JSON.parse(content);
      
      return {
        ...parsedData,
        confidence: parsedData.confidence || 75
      };
    } catch (parseError) {
      throw new Error('Failed to parse OpenAI response');
    }
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    
    // Return minimal data to prevent UI breakage
    return {
      firstName: firstName || "",
      lastName: lastName || "",
      name: firstName && lastName ? `${firstName} ${lastName}` : "",
      email: email || "",
      company: company || "",
      confidence: 30,
      notes: 'API research failed, showing basic information'
    };
  }
}