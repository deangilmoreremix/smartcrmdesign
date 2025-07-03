// Central hub for making actual API calls to configured services
import apiConfig from '../config/apiConfig';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class RealApiService {
  // OpenAI API calls
  async callOpenAI(prompt: string, model: string = 'o1-mini'): Promise<ApiResponse> {
    if (!apiConfig.openai.available) {
      return { success: false, error: 'OpenAI API key not configured' };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiConfig.openai.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_completion_tokens: 4096
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error?.message || 'OpenAI API error' };
      }

      return {
        success: true,
        data: data.choices[0]?.message?.content || 'No response generated'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'OpenAI API request failed' 
      };
    }
  }

  // Gemini API calls
  async callGemini(prompt: string, model: string = 'gemma-2-27b-it'): Promise<ApiResponse> {
    if (!apiConfig.gemini.available) {
      return { success: false, error: 'Gemini API key not configured' };
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiConfig.gemini.key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3 }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error?.message || 'Gemini API error' };
      }

      return {
        success: true,
        data: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Gemini API request failed' 
      };
    }
  }

  // ElevenLabs API calls for voice generation
  async generateVoice(text: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL'): Promise<ApiResponse> {
    if (!apiConfig.elevenlabs.available) {
      return { success: false, error: 'ElevenLabs API key not configured' };
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiConfig.elevenlabs.key!
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.detail?.message || 'ElevenLabs API error' };
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        success: true,
        data: { audioUrl, audioBlob }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'ElevenLabs API request failed' 
      };
    }
  }

  // Composio API calls for tool integrations
  async executeComposioAction(action: string, entityId: string, params: any): Promise<ApiResponse> {
    if (!apiConfig.composio.available) {
      return { success: false, error: 'Composio API key not configured' };
    }

    try {
      const response = await fetch('https://backend.composio.dev/api/v1/actions/execute', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiConfig.composio.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entityId,
          action,
          params
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error?.message || 'Composio API error' };
      }

      return {
        success: true,
        data: data.response || data
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Composio API request failed' 
      };
    }
  }

  // Get integrated tools list from Composio
  async getIntegratedTools(entityId: string): Promise<ApiResponse> {
    if (!apiConfig.composio.available) {
      return { success: false, error: 'Composio API key not configured' };
    }

    try {
      const response = await fetch(`https://backend.composio.dev/api/v1/connectedAccounts?entityId=${entityId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiConfig.composio.key}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error?.message || 'Composio API error' };
      }

      return {
        success: true,
        data: data.connectedAccounts || []
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Composio API request failed' 
      };
    }
  }

  // Check service availability
  getServiceStatus() {
    return {
      openai: apiConfig.openai.available,
      gemini: apiConfig.gemini.available,
      elevenlabs: apiConfig.elevenlabs.available,
      composio: apiConfig.composio.available,
      liveMode: apiConfig.liveMode
    };
  }
}

export const realApiService = new RealApiService();
export default realApiService;