import React, { useState, useEffect } from 'react';
import { useDealStore } from '../../store/dealStore';
import { useContactStore } from '../../store/contactStore';
import { useTheme } from '../../contexts/ThemeContext';
import { TrendingUp, AlertTriangle, Clock, DollarSign, RefreshCw, Info } from 'lucide-react';
import { useGemini } from '../../services/geminiService';
import Avatar from '../ui/Avatar';
import { getInitials } from '../../utils/avatars';

interface DealInsight {
  icon: React.ElementType;
  title: string;
  value: string | number;
  description: string;
  color: string;
  bgColor: string;
  relatedContacts?: Array<{ id: string; name: string; avatar?: string; }>;
}

const LiveDealAnalysis: React.FC = () => {
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const { isDark } = useTheme();
  const gemini = useGemini();
  
  const [insights, setInsights] = useState<DealInsight[]>([]);
  const [averageDealValue, setAverageDealValue] = useState<number>(0);
  const [activeDealCount, setActiveDealCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Analyze pipeline on initial load and when deals change
    analyzePipeline();
  }, [deals]);

  const analyzePipeline = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Process basic insights without requiring AI
      const activeDeals = Object.values(deals).filter(deal => 
        deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
      );
      
      setActiveDealCount(activeDeals.length);
      
      const avgValue = activeDeals.length > 0 
        ? activeDeals.reduce((sum, deal) => sum + deal.value, 0) / activeDeals.length 
        : 0;
      
      setAverageDealValue(avgValue);
      
      // Get basic insights without AI first
      const highValueDeals = activeDeals.filter(deal => deal.value > 50000);
      const stalledDeals = activeDeals.filter(deal => deal.daysInStage && deal.daysInStage > 10);
      const hotDeals = activeDeals.filter(deal => deal.probability > 70);
      
      // Get related contacts for each deal type
      const highValueContacts = highValueDeals.map(deal => {
        const contact = contacts[deal.contactId];
        return contact ? {
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar
        } : null;
      }).filter(Boolean) as Array<{ id: string; name: string; avatar?: string; }>;
      
      const stalledContacts = stalledDeals.map(deal => {
        const contact = contacts[deal.contactId];
        return contact ? {
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar
        } : null;
      }).filter(Boolean) as Array<{ id: string; name: string; avatar?: string; }>;
      
      const hotContacts = hotDeals.map(deal => {
        const contact = contacts[deal.contactId];
        return contact ? {
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar
        } : null;
      }).filter(Boolean) as Array<{ id: string; name: string; avatar?: string; }>;
      
      // Set initial insights
      const initialInsights: DealInsight[] = [
        {
          type: 'success',
          icon: TrendingUp,
          title: 'High-Value Opportunities',
          value: highValueDeals.length,
          description: 'Deals over $50K',
          color: 'text-green-600',
          bgColor: isDark ? 'bg-green-500/20' : 'bg-green-100',
          relatedContacts: highValueContacts
        },
        {
          type: 'warning',
          icon: AlertTriangle,
          title: 'Stalled Deals',
          value: stalledDeals.length,
          description: 'Over 10 days in stage',
          color: 'text-orange-600',
          bgColor: isDark ? 'bg-orange-500/20' : 'bg-orange-100',
          relatedContacts: stalledContacts
        },
        {
          type: 'insight',
          icon: Clock,
          title: 'Hot Prospects',
          value: hotDeals.length,
          description: 'High probability deals',
          color: 'text-blue-600',
          bgColor: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
          relatedContacts: hotContacts
        }
      ];
      
      setInsights(initialInsights);
      
      // Now enhance with AI insights if we have enough deals
      if (activeDeals.length >= 3) {
        try {
          // Prepare data for AI analysis
          const dealData = {
            deals: activeDeals.map(deal => ({
              id: deal.id,
              title: deal.title,
              value: deal.value,
              stage: deal.stage,
              probability: deal.probability,
              daysInStage: deal.daysInStage || 0,
              priority: deal.priority,
              contactId: deal.contactId
            })),
            summary: {
              totalCount: activeDeals.length,
              totalValue: activeDeals.reduce((sum, deal) => sum + deal.value, 0),
              avgValue,
              stageDistribution: {
                qualification: activeDeals.filter(d => d.stage === 'qualification').length,
                proposal: activeDeals.filter(d => d.stage === 'proposal').length,
                negotiation: activeDeals.filter(d => d.stage === 'negotiation').length
              }
            }
          };
          
          // Use AI orchestrator for smart model routing
          const analysisResult = await gemini.analyzeDeal(dealData, {
            priority: 'balanced', // Balance of speed and quality
            customerId: undefined // No customer ID for demo/testing
          });
          
          if (analysisResult.success && analysisResult.content) {
            // Update insights with AI recommendations
            const aiInsights: DealInsight[] = [
              {
                icon: TrendingUp,
                title: 'High-Value Opportunities',
                value: highValueDeals.length,
                description: analysisResult.content.keyInsights[0] || 'Deals over $50K',
                color: 'text-green-600',
                bgColor: isDark ? 'bg-green-500/20' : 'bg-green-100',
                relatedContacts: highValueContacts
              },
              {
                icon: AlertTriangle,
                title: analysisResult.content.riskLevel === 'high' ? 'High Risk Deals' : 'Deal Attention Required',
                value: analysisResult.content.potentialBlockers ? analysisResult.content.potentialBlockers.length : stalledDeals.length,
                description: analysisResult.content.potentialBlockers ? analysisResult.content.potentialBlockers[0] : 'Over 10 days in stage',
                color: 'text-orange-600',
                bgColor: isDark ? 'bg-orange-500/20' : 'bg-orange-100',
                relatedContacts: stalledContacts
              },
              {
                icon: Clock,
                title: 'Win Probability',
                value: `${Math.round(analysisResult.content.winProbability)}%`,
                description: analysisResult.content.recommendedActions ? analysisResult.content.recommendedActions[0] : 'High probability deals',
                color: 'text-blue-600',
                bgColor: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
                relatedContacts: hotContacts
              }
            ];
            
            setInsights(aiInsights);
            console.log(`Deal analysis generated with ${analysisResult.model} (${analysisResult.provider})`);
          }
        } catch (aiError) {
          console.error("AI deal analysis error:", aiError);
          // We keep the basic insights if AI fails
          setError(aiError instanceof Error ? aiError.message : "Failed to analyze deals with AI");
        }
      }
    } catch (e) {
      console.error("Error in deal analysis:", e);
      setError("Failed to analyze deals");
    } finally {
      setIsLoading(false);
    }
  };

  // Render avatar stack
  const renderAvatarStack = (contacts: Array<{ id: string; name: string; avatar?: string }>, maxVisible: number = 3) => {
    const visibleContacts = contacts.slice(0, maxVisible);
    const remainingCount = Math.max(0, contacts.length - maxVisible);
    
    return (
      <div className="flex items-center mt-2">
        <div className="flex -space-x-2">
          {visibleContacts.map((contact, index) => (
            <div key={contact.id} className="relative" style={{ zIndex: maxVisible - index }}>
              <Avatar
                src={contact.avatar}
                alt={contact.name}
                size="sm"
                fallback={getInitials(contact.name)}
                className="border-2 border-white dark:border-gray-900"
              />
            </div>
          ))}
          {remainingCount > 0 && (
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white dark:border-gray-900 ${
              isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              +{remainingCount}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="text-center py-2">
          <RefreshCw size={20} className={`animate-spin mx-auto mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Analyzing deals...</p>
        </div>
      )}
      
      {error && (
        <div className={`p-3 rounded-lg ${
          isDark ? 'bg-yellow-500/10 border-yellow-500/20 border' : 'bg-yellow-50 border-yellow-200 border'
        }`}>
          <div className="flex items-start">
            <Info className={`h-4 w-4 mt-0.5 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
            <div className="ml-2">
              <p className={`text-xs ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                {error.includes("API key") ? 
                  "AI analysis requires API keys. Using basic analysis instead." : 
                  "Using basic analysis mode. AI-powered insights unavailable."}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-3">
        {insights.map((insight, index) => (
          <div key={index} className={`p-3 border rounded-lg ${
            isDark 
              ? 'border-white/10 bg-white/5' 
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                <insight.icon size={16} className={insight.color} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium text-sm ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {insight.title}
                  </h3>
                  <span className={`text-lg font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {insight.value}
                  </span>
                </div>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {insight.description}
                </p>
                
                {/* Avatar stack for related contacts */}
                {insight.relatedContacts && insight.relatedContacts.length > 0 && 
                  renderAvatarStack(insight.relatedContacts)
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-3 rounded-lg border ${
        isDark 
          ? 'bg-blue-500/10 border-blue-500/20' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-center space-x-2 mb-2">
          <DollarSign size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          <h3 className={`font-medium text-sm ${
            isDark ? 'text-blue-300' : 'text-blue-900'
          }`}>
            Average Deal Value
          </h3>
        </div>
        <p className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-blue-900'
        }`}>
          ${Math.round(averageDealValue).toLocaleString()}
        </p>
        <p className={`text-xs ${
          isDark ? 'text-blue-400' : 'text-blue-700'
        }`}>
          Based on {activeDealCount} active deals
        </p>
      </div>
    </div>
  );
};

export default LiveDealAnalysis;