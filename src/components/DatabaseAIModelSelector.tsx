import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  DollarSign, 
  Clock, 
  Info, 
  ChevronDown,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabaseAIService, type AIModelConfig } from '../services/supabaseAIService';

interface DatabaseAIModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  provider?: 'anthropic' | 'gemini' | 'mistral' | 'openai' | 'other';
  useCase?: string;
  showPricing?: boolean;
  showCapabilities?: boolean;
  className?: string;
}

const DatabaseAIModelSelector: React.FC<DatabaseAIModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  provider,
  useCase,
  showPricing = true,
  showCapabilities = true,
  className = ''
}) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<AIModelConfig[]>([]);
  const [recommendedModels, setRecommendedModels] = useState<AIModelConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string>(provider || 'all');

  // Get currently selected model details
  const currentModel = models.find(model => model.id === selectedModel);

  // Load models from database
  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      try {
        let allModels: AIModelConfig[] = [];
        
        if (provider) {
          allModels = await supabaseAIService.getModelsByProvider(provider);
        } else {
          allModels = await supabaseAIService.getAvailableModels();
        }

        setModels(allModels);

        // Get recommended models for use case
        if (useCase) {
          const recommended = await supabaseAIService.getRecommendedModels(useCase);
          setRecommendedModels(recommended);
        }
      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, [provider, useCase]);

  // Filter models by selected provider
  const filteredModels = selectedProvider === 'all' 
    ? models 
    : models.filter(model => model.provider === selectedProvider);

  // Get unique providers
  const providers = Array.from(new Set(models.map(model => model.provider)));

  const formatPrice = (price: number) => {
    return price < 1 ? `$${price}` : `$${price.toFixed(2)}`;
  };

  const getModelBadge = (model: AIModelConfig) => {
    if (recommendedModels.some(rec => rec.id === model.id)) {
      return { text: 'Recommended', color: 'bg-green-500/20 text-green-400' };
    }
    if (model.is_recommended) {
      return { text: 'Popular', color: 'bg-blue-500/20 text-blue-400' };
    }
    if (model.provider === 'gemini' && model.model_name.includes('gemma')) {
      return { text: 'Lightweight', color: 'bg-orange-500/20 text-orange-400' };
    }
    return null;
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'gemini': return '🤖';
      case 'anthropic': return '🧠';
      case 'openai': return '⚡';
      case 'mistral': return '🌪️';
      default: return '🔧';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Loader2 className="animate-spin mr-2" size={16} />
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Loading AI models...
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Current Selection */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
          isDark 
            ? 'bg-white/5 border-white/10 hover:border-white/20 text-white' 
            : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            currentModel?.provider === 'gemini' 
              ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600')
              : currentModel?.provider === 'anthropic'
              ? (isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600')
              : (isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600')
          }`}>
            <Brain size={16} />
          </div>
          <div className="text-left">
            <p className="font-medium">
              {currentModel?.display_name || 'Select AI Model'}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentModel ? `${getProviderIcon(currentModel.provider)} ${currentModel.provider}` : 'No model selected'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {showPricing && currentModel?.pricing && (
            <div className="text-right">
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatPrice(currentModel.pricing.input_per_1m_tokens)}/1M tokens
              </p>
            </div>
          )}
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 ${
          isDark ? 'bg-gray-900/95' : 'bg-white/95'
        } backdrop-blur-xl border ${
          isDark ? 'border-white/20' : 'border-gray-200'
        } rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden`}>
          
          {/* Provider Filter */}
          {!provider && providers.length > 1 && (
            <div className={`p-3 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedProvider('all')}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    selectedProvider === 'all'
                      ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700')
                      : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                  }`}
                >
                  All
                </button>
                {providers.map((prov) => (
                  <button
                    key={prov}
                    onClick={() => setSelectedProvider(prov)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors capitalize ${
                      selectedProvider === prov
                        ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700')
                        : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                    }`}
                  >
                    {getProviderIcon(prov)} {prov}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Models List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredModels.length === 0 ? (
              <div className="p-4 text-center">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No models available for the selected criteria.
                </p>
              </div>
            ) : (
              filteredModels.map((model) => {
                const badge = getModelBadge(model);
                const isSelected = model.id === selectedModel;
                
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-3 text-left transition-colors border-b last:border-b-0 ${
                      isDark ? 'border-white/5' : 'border-gray-100'
                    } ${
                      isSelected 
                        ? (isDark ? 'bg-blue-500/10' : 'bg-blue-50')
                        : (isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50')
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm">{getProviderIcon(model.provider)}</span>
                          <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {model.display_name}
                          </h4>
                          {isSelected && (
                            <CheckCircle size={14} className="text-green-400" />
                          )}
                          {badge && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                              {badge.text}
                            </span>
                          )}
                        </div>
                        
                        {model.description && (
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                            {model.description}
                          </p>
                        )}
                        
                        {showCapabilities && model.capabilities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {model.capabilities.slice(0, 3).map((capability) => (
                              <span
                                key={capability}
                                className={`px-2 py-0.5 rounded text-xs ${
                                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {capability}
                              </span>
                            ))}
                            {model.capabilities.length > 3 && (
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                +{model.capabilities.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs">
                          {model.pricing && (
                            <div className="flex items-center space-x-1">
                              <DollarSign size={12} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                {formatPrice(model.pricing.input_per_1m_tokens)}/1M
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock size={12} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                              {model.context_window.toLocaleString()} tokens
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {useCase && recommendedModels.length > 0 && (
            <div className={`p-3 border-t ${isDark ? 'border-white/10 bg-blue-500/5' : 'border-gray-200 bg-blue-50'}`}>
              <div className="flex items-start space-x-2">
                <Info size={14} className={`mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <p className={`text-xs font-medium ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                    Optimized for {useCase.replace(/_/g, ' ').toLowerCase()}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                    {recommendedModels.length} recommended model(s) available
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseAIModelSelector;