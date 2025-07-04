import React, { useState, useEffect } from 'react';
import { Brain, Zap, Settings, Check, X, Info, RefreshCw, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import AIModelSelector from '../AIModelSelector';
import { AI_MODEL_RECOMMENDATIONS } from '../../services/aiModels';

export const SmartAIControls: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedModelIds, setSelectedModelIds] = useState<Record<string, string>>({
    email_generation: 'gemini-2.5-flash',
    business_analysis: 'gemma-2-9b-it',
    content_creation: 'gemini-2.5-flash',
    quick_responses: 'gemma-2-2b-it'
  });
  const [usageProfiles, setUsageProfiles] = useState({
    performance: {
      enabled: true,
      threshold: 0.8
    },
    cost: {
      enabled: true,
      threshold: 0.6
    },
    routing: {
      enabled: true,
      auto: true
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleModelChange = (useCase: string, modelId: string) => {
    setSelectedModelIds(prev => ({
      ...prev,
      [useCase]: modelId
    }));
  };

  const toggleProfileSetting = (profile: string, setting: string) => {
    setUsageProfiles(prev => ({
      ...prev,
      [profile]: {
        ...prev[profile as keyof typeof prev],
        [setting]: !prev[profile as keyof typeof prev][setting as keyof typeof prev[typeof profile]]
      }
    }));
  };

  const updateThreshold = (profile: string, value: number) => {
    setUsageProfiles(prev => ({
      ...prev,
      [profile]: {
        ...prev[profile as keyof typeof prev],
        threshold: value
      }
    }));
  };

  const saveSettings = () => {
    setIsSaving(true);
    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      // Show success notification
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Smart Routing Controls */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="flex items-start space-x-3">
          <Zap className={`w-5 h-5 mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <div>
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>Smart Routing</h3>
            <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              Automatically route requests to the optimal model based on task complexity, performance requirements, and cost considerations.
            </p>
            
            <div className="flex items-center space-x-4 mt-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={usageProfiles.routing.enabled}
                  onChange={() => toggleProfileSetting('routing', 'enabled')}
                  className="form-checkbox rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className={`ml-2 text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Enable Smart Routing</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={usageProfiles.routing.auto}
                  onChange={() => toggleProfileSetting('routing', 'auto')}
                  disabled={!usageProfiles.routing.enabled}
                  className="form-checkbox rounded text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className={`ml-2 text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'} ${!usageProfiles.routing.enabled ? 'opacity-50' : ''}`}>
                  Auto-optimize based on usage patterns
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Model Selection for Different Use Cases */}
      <div className="space-y-4">
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Default Model Selection</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Email Generation</h4>
            <AIModelSelector
              selectedModel={selectedModelIds.email_generation}
              onModelChange={(modelId) => handleModelChange('email_generation', modelId)}
              useCase="EMAIL_GENERATION"
            />
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Business Analysis</h4>
            <AIModelSelector
              selectedModel={selectedModelIds.business_analysis}
              onModelChange={(modelId) => handleModelChange('business_analysis', modelId)}
              useCase="BUSINESS_ANALYSIS"
            />
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Content Creation</h4>
            <AIModelSelector
              selectedModel={selectedModelIds.content_creation}
              onModelChange={(modelId) => handleModelChange('content_creation', modelId)}
              useCase="CONTENT_CREATION"
            />
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Quick Responses</h4>
            <AIModelSelector
              selectedModel={selectedModelIds.quick_responses}
              onModelChange={(modelId) => handleModelChange('quick_responses', modelId)}
              useCase="QUICK_RESPONSES"
            />
          </div>
        </div>
      </div>

      {/* Optimization Profiles */}
      <div className="space-y-4">
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Optimization Profiles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Performance Profile */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <Zap className={`w-5 h-5 mt-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                <div>
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Performance Focus</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Prioritize response quality and speed
                  </p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={usageProfiles.performance.enabled}
                  onChange={() => toggleProfileSetting('performance', 'enabled')}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 ${
                  isDark 
                    ? 'bg-gray-700 peer-checked:bg-purple-600' 
                    : 'bg-gray-200 peer-checked:bg-purple-600'
                } rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
              </label>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Quality threshold</span>
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {usageProfiles.performance.threshold * 100}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={usageProfiles.performance.threshold}
                onChange={(e) => updateThreshold('performance', parseFloat(e.target.value))}
                disabled={!usageProfiles.performance.enabled}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>
          
          {/* Cost Profile */}
          <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <DollarSign className={`w-5 h-5 mt-1 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <div>
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Cost Efficiency</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Optimize for lower token consumption
                  </p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={usageProfiles.cost.enabled}
                  onChange={() => toggleProfileSetting('cost', 'enabled')}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 ${
                  isDark 
                    ? 'bg-gray-700 peer-checked:bg-green-600' 
                    : 'bg-gray-200 peer-checked:bg-green-600'
                } rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
              </label>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Efficiency threshold</span>
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {usageProfiles.cost.threshold * 100}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={usageProfiles.cost.threshold}
                onChange={(e) => updateThreshold('cost', parseFloat(e.target.value))}
                disabled={!usageProfiles.cost.enabled}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className={`p-4 rounded-lg ${
        isDark ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-start space-x-3">
          <Info className={`w-5 h-5 mt-0.5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
          <div>
            <h4 className={`font-medium ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
              Optimization Tips
            </h4>
            <ul className={`text-sm space-y-1 mt-1 ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
              <li>• Enable Smart Routing to automatically select the best model for each task</li>
              <li>• Gemma models are ideal for cost-sensitive, high-volume operations</li>
              <li>• Gemini Flash models balance performance and cost effectively</li>
              <li>• Fine-tune thresholds to match your specific quality and budget needs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
          } transition-all duration-200 disabled:opacity-50`}
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

import { DollarSign } from 'lucide-react';