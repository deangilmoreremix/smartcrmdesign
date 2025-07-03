import React from 'react';
import { Brain, Search, Mail, TrendingUp, FileText, Zap, Users, BarChart3 } from 'lucide-react';
import AIGoalsButton from './AIGoalsButton';
import QuickAIButton from './QuickAIButton';

interface AIActionToolbarProps {
  entityType: 'contact' | 'deal' | 'company';
  entityId: string;
  entityData: any;
  layout?: 'horizontal' | 'vertical' | 'grid';
  showGoalsButton?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const AIActionToolbar: React.FC<AIActionToolbarProps> = ({
  entityType,
  entityId,
  entityData,
  layout = 'horizontal',
  showGoalsButton = true,
  size = 'sm',
  className = ''
}) => {
  
  const getQuickActions = (type: string) => {
    switch (type) {
      case 'contact':
        return [
          { icon: TrendingUp, label: 'Lead Score', toolName: 'leadScoring', variant: 'analysis' as const },
          { icon: Mail, label: 'Personalize', toolName: 'emailPersonalization', variant: 'generation' as const },
          { icon: Search, label: 'Research', toolName: 'contactEnrichment', variant: 'research' as const }
        ];
      case 'deal':
        return [
          { icon: BarChart3, label: 'Risk Analysis', toolName: 'dealRiskAssessment', variant: 'analysis' as const },
          { icon: Zap, label: 'Next Action', toolName: 'nextBestAction', variant: 'automation' as const },
          { icon: FileText, label: 'Proposal', toolName: 'proposalGeneration', variant: 'generation' as const }
        ];
      case 'company':
        return [
          { icon: Search, label: 'Research', toolName: 'businessIntelligence', variant: 'research' as const },
          { icon: TrendingUp, label: 'Health Score', toolName: 'companyHealthScoring', variant: 'analysis' as const },
          { icon: Users, label: 'Opportunities', toolName: 'opportunityIdentification', variant: 'analysis' as const }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions(entityType);
  
  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex items-center space-x-1 flex-wrap';
      case 'vertical':
        return 'flex flex-col space-y-3';
      case 'grid':
        return 'space-y-2.5';
      default:
        return 'flex items-center space-x-1 flex-wrap';
    }
  };

  if (layout === 'grid') {
    // Grid layout: Organized sections with clear visual separation
    return (
      <div className={`${getLayoutClasses()} ${className}`}>
        {/* Primary AI Goals Section */}
        {showGoalsButton && (
          <div className="w-full mb-3">
            <AIGoalsButton
              entityType={entityType}
              entityId={entityId}
              entityData={entityData}
              size={size}
              variant="primary"
              className="w-full justify-center"
            />
          </div>
        )}
        
        {/* Quick Actions Section */}
        {quickActions.length > 0 && (
          <div className="w-full">
            <div className="grid grid-cols-2 gap-1.5">
              {quickActions.map((action, index) => (
                <QuickAIButton
                  key={index}
                  icon={action.icon}
                  label={action.label}
                  toolName={action.toolName}
                  entityType={entityType}
                  entityId={entityId}
                  entityData={entityData}
                  size={size}
                  variant={action.variant}
                  className="w-full justify-center text-center"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {showGoalsButton && (
        <AIGoalsButton
          entityType={entityType}
          entityId={entityId}
          entityData={entityData}
          size={size}
          variant="primary"
        />
      )}
      
      {quickActions.map((action, index) => (
        <QuickAIButton
          key={index}
          icon={action.icon}
          label={action.label}
          toolName={action.toolName}
          entityType={entityType}
          entityId={entityId}
          entityData={entityData}
          size={size}
          variant={action.variant}
        />
      ))}
    </div>
  );
};

export default AIActionToolbar;