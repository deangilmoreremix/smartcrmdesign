import React, { useState } from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';
import { useAITools } from '../AIToolsProvider';

interface QuickAIButtonProps {
  icon: LucideIcon;
  label: string;
  toolName: string;
  entityType: 'contact' | 'deal' | 'company';
  entityId: string;
  entityData: any;
  size?: 'sm' | 'md';
  variant?: 'default' | 'analysis' | 'generation' | 'research' | 'automation';
  className?: string;
  onResult?: (result: any) => void;
}

const QuickAIButton: React.FC<QuickAIButtonProps> = ({
  icon: Icon,
  label,
  toolName,
  entityType,
  entityId,
  entityData,
  size = 'sm',
  variant = 'default',
  className = '',
  onResult
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { openTool } = useAITools();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsLoading(true);
    
    try {
      // Store entity context in sessionStorage for AI tools to use
      sessionStorage.setItem('currentEntityContext', JSON.stringify({
        entityType,
        entityId,
        entityData
      }));
      
      // Map tool names to existing AI tools
      const toolMapping: Record<string, string> = {
        'leadScoring': 'business-analyzer',
        'emailPersonalization': 'email-composer',
        'contactEnrichment': 'smart-search',
        'dealRiskAssessment': 'business-analyzer',
        'nextBestAction': 'business-analyzer',
        'proposalGeneration': 'proposal-generator',
        'businessIntelligence': 'smart-search',
        'companyHealthScoring': 'business-analyzer',
        'opportunityIdentification': 'business-analyzer'
      };
      
      const mappedTool = toolMapping[toolName] || toolName;
      openTool(mappedTool as any);
      
      if (onResult) {
        onResult({ status: 'opened', tool: mappedTool });
      }
    } catch (error) {
      console.error(`Error executing ${toolName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1.5 text-xs h-7 min-w-[55px]',
    md: 'px-3 py-2 text-sm h-8 min-w-[65px]'
  };

  const variantClasses = {
    default: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 border border-gray-200/60 shadow-sm',
    analysis: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 border border-blue-200/60 shadow-sm',
    generation: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200 border border-green-200/60 shadow-sm',
    research: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 hover:from-purple-100 hover:to-purple-200 border border-purple-200/60 shadow-sm',
    automation: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 hover:from-orange-100 hover:to-orange-200 border border-orange-200/60 shadow-sm'
  };

  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${className}
      `}
      title={`${label} for ${entityType}`}
    >
      {isLoading ? (
        <Loader2 size={iconSize} className="animate-spin mr-1" />
      ) : (
        <Icon size={iconSize} className="mr-1" />
      )}
      {label}
    </button>
  );
};

export default QuickAIButton;