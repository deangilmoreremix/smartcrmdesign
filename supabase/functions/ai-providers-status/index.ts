// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Get API keys
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    
    const providers = [];
    
    // Check OpenAI status
    if (openaiApiKey) {
      try {
        const openaiStatus = await checkOpenAIStatus(openaiApiKey);
        providers.push({
          name: 'openai',
          status: openaiStatus.status,
          remaining: openaiStatus.remaining
        });
      } catch (error) {
        console.error("Error checking OpenAI status:", error);
        providers.push({
          name: 'openai',
          status: 'error',
          error: error.message
        });
      }
    } else {
      providers.push({
        name: 'openai',
        status: 'not_configured'
      });
    }
    
    // Check Gemini status
    if (geminiApiKey) {
      try {
        const geminiStatus = await checkGeminiStatus(geminiApiKey);
        providers.push({
          name: 'gemini',
          status: geminiStatus.status,
          remaining: geminiStatus.remaining
        });
      } catch (error) {
        console.error("Error checking Gemini status:", error);
        providers.push({
          name: 'gemini',
          status: 'error',
          error: error.message
        });
      }
    } else {
      providers.push({
        name: 'gemini',
        status: 'not_configured'
      });
    }
    
    return new Response(JSON.stringify(providers), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json" 
      }
    });
  } catch (error) {
    console.error("Error checking provider status:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json" 
      }
    });
  }
});

// Function to check OpenAI API status
async function checkOpenAIStatus(apiKey: string): Promise<{ status: string; remaining: number }> {
  try {
    // Make a lightweight call to OpenAI API
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    
    // Check if rate limited
    if (response.status === 429) {
      return { status: 'rate_limited', remaining: 0 };
    }
    
    // Check other error states
    if (!response.ok) {
      return { status: 'error', remaining: 0 };
    }
    
    // Extract rate limit info from headers
    const rateLimit = response.headers.get('x-ratelimit-limit-requests');
    const rateRemaining = response.headers.get('x-ratelimit-remaining-requests');
    
    return { 
      status: 'available', 
      remaining: parseInt(rateRemaining || '50', 10)
    };
  } catch (error) {
    console.error("OpenAI status check error:", error);
    return { status: 'error', remaining: 0 };
  }
}

// Function to check Gemini API status
async function checkGeminiStatus(apiKey: string): Promise<{ status: string; remaining: number }> {
  try {
    // Make a lightweight call to Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
      method: "GET"
    });
    
    // Check if rate limited
    if (response.status === 429) {
      return { status: 'rate_limited', remaining: 0 };
    }
    
    // Check other error states
    if (!response.ok) {
      return { status: 'error', remaining: 0 };
    }
    
    // Gemini doesn't provide rate limit headers in the same way
    // Estimate based on typical limits
    return { status: 'available', remaining: 60 };
  } catch (error) {
    console.error("Gemini status check error:", error);
    return { status: 'error', remaining: 0 };
  }
}