import { useGemini } from '../../services/geminiService';
import { sendGmailEmail } from '../../services/composioService';
import { supabase } from '../../services/supabaseClient';
import React, { useState } from 'react';
import { Deal } from '../../types';
import CustomizableAIToolbar from '../ai/CustomizableAIToolbar';
import { 
  DollarSign, 
  Calendar, 
  User, 
  Building, 
  PieChart, 
  RefreshCw, 
  Zap,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Milestone,
  Flag,
  MessageSquare,
  Tag,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface AIEnhancedDealCardProps {
  deal: Deal;
  onClick?: () => void;
  showAnalyzeButton?: boolean;
}

const AIEnhancedDealCard: React.FC<AIEnhancedDealCardProps> = ({
  deal,
  onClick,
  showAnalyzeButton = true
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<{
    winProbabilityAdjustment?: number;
    riskFactors?: string[];
    opportunities?: string[];
    recommendations?: string[];
    nextSteps?: string[];
  } | null>(null);
  
  // Analyze deal with AI
  const handleAnalyzeDeal = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsAnalyzing(true);
    
    try {
      // In a real implementation, this would call your AI service
      // For this demo, we'll simulate the analysis result
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAiInsights({
        winProbabilityAdjustment: Math.floor(Math.random() * 20) - 10, // -10 to +10
        riskFactors: [
          'Decision timeline may extend beyond forecast',
          'Budget approval pending from finance department',
          'Competitor offering aggressive pricing',
        ],
        opportunities: [
          'Decision maker is dissatisfied with current solution',
          'Expansion potential to additional departments',
          'Align with their Q3 digital transformation initiative',
        ],
        recommendations: [
          'Prepare ROI analysis with 12-month projection',
          'Schedule technical demo with IT stakeholders',
          'Identify and engage finance decision maker',
        ],
        nextSteps: [
          'Send implementation timeline document',
          'Follow up on technical requirements questions',
          'Schedule executive presentation',
        ]
      });
    } catch (error) {
      console.error('Error analyzing deal:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return 'No date set';
    
    const today = new Date();
    const dueDate = new Date(date);
    
    // Calculate days difference
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Return formatted string
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays < 7) {
      return `Due in ${diffDays} days`;
    }
    
    return date.toLocaleDateString();
  };
  
  // Get stage badge color
  const getStageBadgeColor = (stage: string) => {
    switch(stage) {
      case 'qualification': return 'bg-blue-100 text-blue-700';
      case 'proposal': return 'bg-indigo-100 text-indigo-700';
      case 'negotiation': return 'bg-purple-100 text-purple-700';
      case 'closed-won': return 'bg-green-100 text-green-700';
      case 'closed-lost': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  // Get priority badge color
  const getPriorityBadgeColor = (priority?: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get stage name
  const getStageName = (stage: string) => {
    const names: Record<string, string> = {
      'qualification': 'Qualification',
      'proposal': 'Proposal',
      'negotiation': 'Negotiation',
      'closed-won': 'Closed Won',
      'closed-lost': 'Closed Lost'
    };
    
    return names[stage] || stage;
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:border-blue-300 hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{deal.title}</h3>
          
          <div className="flex flex-wrap gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStageBadgeColor(deal.stage)}`}>
              {getStageName(deal.stage)}
            </span>
            
            {deal.priority && (
              <span className={`text-xs px-2 py-0.5 rounded-full flex items-center ${getPriorityBadgeColor(deal.priority)}`}>
                <Flag size={10} className="mr-1" />
                {deal.priority}
              </span>
            )}
          </div>
          
          <div className="mt-3 space-y-1">
            <div className="flex items-center text-sm">
              <Building size={16} className="text-gray-400 mr-2" />
              <span className="text-gray-600">{deal.company}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <User size={16} className="text-gray-400 mr-2" />
              <span className="text-gray-600">{deal.contact}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <DollarSign size={16} className="text-gray-400 mr-2" />
              <span className="text-gray-800 font-medium">{formatCurrency(deal.value)}</span>
            </div>
            
            {deal.dueDate && (
              <div className="flex items-center text-sm">
                <Calendar size={16} className="text-gray-400 mr-2" />
                <span className={`${deal.dueDate < new Date() ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                  {formatDate(deal.dueDate)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Probability Section */}
        <div className="flex flex-col items-end">
          <div className="flex items-center mb-1">
            <span className="text-sm text-gray-500 mr-2">Win probability</span>
            <span className="font-medium">
              {deal.probability}%
              {aiInsights?.winProbabilityAdjustment && (
                <span className={aiInsights.winProbabilityAdjustment > 0 ? 'text-green-500' : 'text-red-500'}>
                  {aiInsights.winProbabilityAdjustment > 0 ? ' +' : ' '}
                  {aiInsights.winProbabilityAdjustment}%
                </span>
              )}
            </span>
          </div>
          
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${deal.stage === 'closed-won' ? 'bg-green-500' : 'bg-blue-500'}`} 
              style={{ width: `${deal.probability}%` }}
            ></div>
          </div>
          
          {showAnalyzeButton && !aiInsights && (
            <button
              onClick={handleAnalyzeDeal}
              disabled={isAnalyzing}
              className="mt-3 flex items-center text-xs text-blue-600 hover:text-blue-800"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={14} className="mr-1 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap size={14} className="mr-1" />
                  AI Analysis
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* AI Insights */}
      {aiInsights && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium flex items-center">
              <BarChart3 size={16} className="mr-1.5 text-blue-500" />
              AI Deal Insights
            </h4>
          </div>
          
          <div className="text-xs space-y-3">
            {aiInsights.riskFactors && (
              <div className="bg-red-50 p-2 rounded-md border border-red-100">
                <p className="font-medium text-red-800 mb-1">Risk Factors:</p>
                <ul className="list-disc list-inside text-red-700 pl-1 space-y-0.5">
                  {aiInsights.riskFactors.slice(0, 2).map((risk, idx) => (
                    <li key={idx}>{risk}</li>
                  ))}
                  {aiInsights.riskFactors.length > 2 && <li>+ {aiInsights.riskFactors.length - 2} more</li>}
                </ul>
              </div>
            )}
            
            {aiInsights.opportunities && (
              <div className="bg-green-50 p-2 rounded-md border border-green-100">
                <p className="font-medium text-green-800 mb-1">Opportunities:</p>
                <ul className="list-disc list-inside text-green-700 pl-1 space-y-0.5">
                  {aiInsights.opportunities.slice(0, 2).map((opportunity, idx) => (
                    <li key={idx}>{opportunity}</li>
                  ))}
                  {aiInsights.opportunities.length > 2 && <li>+ {aiInsights.opportunities.length - 2} more</li>}
                </ul>
              </div>
            )}
            
            {aiInsights.nextSteps && (
              <div className="bg-blue-50 p-2 rounded-md border border-blue-100">
                <p className="font-medium text-blue-800 mb-1">Suggested Next Steps:</p>
                <ul className="list-disc list-inside text-blue-700 pl-1 space-y-0.5">
                  {aiInsights.nextSteps.slice(0, 2).map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                  {aiInsights.nextSteps.length > 2 && <li>+ {aiInsights.nextSteps.length - 2} more</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Action Buttons - Organized Footer Section */}
      <div className="mt-4 pt-4 -mx-4 px-4 pb-4 bg-gradient-to-b from-gray-50/40 to-gray-50/60 border-t border-gray-100/80 rounded-b-lg">
        {/* AI Tools Section */}
        <div className="mb-4">
          <CustomizableAIToolbar
            entityType="deal"
            entityId={deal.id}
            entityData={deal}
            location="dealCards"
            layout="grid"
            size="sm"
            showCustomizeButton={true}
            className="w-full"
          />
        </div>
        
        {/* Traditional Actions Section */}
        <div className="pt-2 border-t border-gray-100/60">
          <div className="grid grid-cols-2 gap-1.5">
            <button className="flex items-center justify-center py-1.5 px-2 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 rounded-full hover:from-orange-100 hover:to-orange-200 text-xs font-medium transition-all duration-200 border border-orange-200/50 shadow-sm">
              <PieChart size={11} className="mr-1" /> Analyze
            </button>
            <button className="flex items-center justify-center py-1.5 px-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full hover:from-gray-100 hover:to-gray-200 text-xs font-medium transition-all duration-200 border border-gray-200/50 shadow-sm">
              <MessageSquare size={11} className="mr-1" /> Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEnhancedDealCard;