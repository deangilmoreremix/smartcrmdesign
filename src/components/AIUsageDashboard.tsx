import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Zap, 
  Clock, 
  TrendingUp,
  Brain,
  Activity,
  Target,
  Loader2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabaseAIService } from '../services/supabaseAIService';

interface AIUsageDashboardProps {
  customerId?: string;
  timeframe?: 'day' | 'week' | 'month';
  className?: string;
}

const AIUsageDashboard: React.FC<AIUsageDashboardProps> = ({
  customerId,
  timeframe = 'month',
  className = ''
}) => {
  const { isDark } = useTheme();
  const [usageStats, setUsageStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsageStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const stats = await supabaseAIService.getUsageStats(customerId, timeframe);
        setUsageStats(stats);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load usage statistics';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadUsageStats();
  }, [customerId, timeframe]);

  // Calculate totals
  const totals = usageStats.reduce(
    (acc, stat) => ({
      requests: acc.requests + stat.requests,
      tokens: acc.tokens + stat.tokensUsed,
      cost: acc.cost + stat.totalCost,
      avgResponseTime: acc.avgResponseTime + stat.avgResponseTime * stat.requests
    }),
    { requests: 0, tokens: 0, cost: 0, avgResponseTime: 0 }
  );

  if (totals.requests > 0) {
    totals.avgResponseTime = totals.avgResponseTime / totals.requests;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="animate-spin mr-2" size={20} />
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Loading AI usage statistics...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className={`p-4 rounded-lg border ${
          isDark 
            ? 'bg-red-500/10 border-red-500/20 text-red-300' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <p className="text-sm font-medium">Error loading usage statistics</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
            }`}>
              <DollarSign size={16} />
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Cost
              </p>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(totals.cost)}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
            }`}>
              <Zap size={16} />
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                API Requests
              </p>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(totals.requests)}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
            }`}>
              <Brain size={16} />
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Tokens Used
              </p>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(totals.tokens)}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
            }`}>
              <Clock size={16} />
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg Response
              </p>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {totals.avgResponseTime.toFixed(1)}s
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Usage Breakdown */}
      {usageStats.length > 0 ? (
        <div className={`rounded-xl border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        } overflow-hidden`}>
          <div className="p-4 border-b border-white/10">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Model Usage Breakdown
            </h3>
          </div>
          
          <div className="divide-y divide-white/10">
            {usageStats.map((stat, index) => {
              const usagePercent = totals.requests > 0 ? (stat.requests / totals.requests) * 100 : 0;
              const costPercent = totals.cost > 0 ? (stat.totalCost / totals.cost) * 100 : 0;

              return (
                <div key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        stat.provider === 'gemini' 
                          ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600')
                          : (isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600')
                      }`}>
                        <Brain size={16} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {stat.modelName}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stat.provider} • {stat.successRate.toFixed(1)}% success rate
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(stat.totalCost)}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {costPercent.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Requests
                      </p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatNumber(stat.requests)}
                      </p>
                    </div>
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Tokens
                      </p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatNumber(stat.tokensUsed)}
                      </p>
                    </div>
                    <div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Avg Speed
                      </p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {stat.avgResponseTime.toFixed(1)}s
                      </p>
                    </div>
                  </div>

                  {/* Features Used */}
                  {stat.features && stat.features.length > 0 && (
                    <div className="mb-3">
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Features Used:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {stat.features.map((feature: string, featureIndex: number) => (
                          <span
                            key={featureIndex}
                            className={`px-2 py-0.5 rounded text-xs ${
                              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Usage Progress Bar */}
                  <div>
                    <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {usagePercent.toFixed(1)}% of total requests
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Empty State
        <div className={`rounded-xl border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        } p-8 text-center`}>
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Activity className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            No AI Usage Data
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Start using AI features to see usage statistics and analytics here.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIUsageDashboard;