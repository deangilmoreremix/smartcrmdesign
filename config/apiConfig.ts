// API Configuration System
// Determines if system can operate in Live Mode vs Demo Mode based on available API keys

interface ApiConfiguration {
  openai: {
    available: boolean;
    key?: string;
  };
  gemini: {
    available: boolean;
    key?: string;
  };
  elevenlabs: {
    available: boolean;
    key?: string;
  };
  composio: {
    available: boolean;
    key?: string;
  };
  liveMode: boolean;
}

// Check if environment variables are available
const getApiConfiguration = (): ApiConfiguration => {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const elevenlabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const composioKey = import.meta.env.VITE_COMPOSIO_API_KEY;

  const openaiAvailable = Boolean(openaiKey);
  const geminiAvailable = Boolean(geminiKey);
  const elevenlabsAvailable = Boolean(elevenlabsKey);
  const composioAvailable = Boolean(composioKey);

  // Live Mode requires at least one LLM provider and Composio for tool integrations
  const liveMode = (openaiAvailable || geminiAvailable) && composioAvailable;

  return {
    openai: {
      available: openaiAvailable,
      key: openaiKey
    },
    gemini: {
      available: geminiAvailable,
      key: geminiKey
    },
    elevenlabs: {
      available: elevenlabsAvailable,
      key: elevenlabsKey
    },
    composio: {
      available: composioAvailable,
      key: composioKey
    },
    liveMode
  };
};

export const apiConfig = getApiConfiguration();

export default apiConfig;