import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  BarChart3, 
  Mail, 
  TrendingUp, 
  AlertTriangle, 
  Navigation, 
  FileText,
  Send,
  Calendar,
  DollarSign,
  Heart,
  UserPlus,
  Search,
  BarChart,
  Zap,
  Clock,
  GitBranch,
  PenTool,
  Video,
  FileSearch,
  Package,
  LucideIcon
} from 'lucide-react';
import { useCustomizationStore, CustomizationLocation } from '../../store/customizationStore';
import { getGoalById } from '../../data/aiGoals';
import AIGoalsButton from './AIGoalsButton';
import QuickAIButton from './QuickAIButton';
import CustomizeButtonsModal from './CustomizeButtonsModal';

interface CustomizableAIToolbarProps {
  entityType: 'contact' | 'deal' | 'company';
  entityId: string;
  entityData: any;
  location: CustomizationLocation;
  layout?: 'horizontal' | 'vertical' | 'grid';
  size?: 'sm' | 'md';
  className?: string;
  showGoalsButton?: boolean;
  showCustomizeButton?: boolean;
}

const CustomizableAIToolbar: React.FC<CustomizableAIToolbarProps> = ({
  entityType,
  entityId,
  entityData,
  location,
  layout = 'grid',
  size = 'sm',
  className = '',
  showGoalsButton = true,
  showCustomizeButton = true
}) => {
  const { getSelectedGoals } = useCustomizationStore();
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  
  // Get user's customized button configuration
  const customizedGoalIds = getSelectedGoals(location);
  
  // Convert goal IDs to quick actions
  const customQuickActions = customizedGoalIds.map(goalId => {
    const goal = getGoalById(goalId);
    if (!goal) return null;
    
    return {
      icon: getIconComponent(goal.icon),
      label: goal.title,
      toolName: goal.toolMapping || goalId,
      variant: getVariantForCategory(goal.category)
    };
  }).filter(Boolean) as Array<{
    icon: LucideIcon;
    label: string;
    toolName: string;
    variant: string;
  }>;

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
    return (
      <div className={`${getLayoutClasses()} ${className}`}>
        {/* Primary AI Goals Section */}
        {showGoalsButton && (
          <div className="w-full mb-3 flex items-center space-x-2">
            <AIGoalsButton
              entityType={entityType}
              entityId={entityId}
              entityData={entityData}
              size={size}
              variant="primary"
              className="flex-1 justify-center"
            />
            {showCustomizeButton && (
              <button
                onClick={() => setShowCustomizeModal(true)}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Customize buttons"
              >
                <Settings size={16} />
              </button>
            )}
          </div>
        )}
        
        {/* Customized Quick Actions Section */}
        {customQuickActions.length > 0 && (
          <div className="w-full">
            <div className="grid grid-cols-2 gap-1.5">
              {customQuickActions.map((action, index) => (
                <QuickAIButton
                  key={index}
                  icon={action.icon}
                  label={action.label}
                  toolName={action.toolName}
                  entityType={entityType}
                  entityId={entityId}
                  entityData={entityData}
                  size={size}
                  variant={action.variant as any}
                  className="w-full justify-center text-center"
                />
              ))}
              
              {/* Add More Button */}
              {customQuickActions.length < 6 && showCustomizeButton && (
                <button
                  onClick={() => setShowCustomizeModal(true)}
                  className="flex items-center justify-center py-1.5 px-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 rounded-full hover:from-gray-100 hover:to-gray-200 text-xs font-medium transition-all duration-200 border border-gray-200/50 shadow-sm border-dashed"
                >
                  <Plus size={12} className="mr-1" />
                  Add Goal
                </button>
              )}
            </div>
          </div>
        )}

        {/* Show customize button if no custom actions */}
        {customQuickActions.length === 0 && showCustomizeButton && (
          <div className="w-full">
            <button
              onClick={() => setShowCustomizeModal(true)}
              className="w-full flex items-center justify-center py-2 px-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full hover:from-indigo-100 hover:to-purple-100 text-sm font-medium transition-all duration-200 border border-indigo-200/50 shadow-sm border-dashed"
            >
              <Plus size={14} className="mr-2" />
              Add Custom AI Goals
            </button>
          </div>
        )}

        {/* Customization Modal */}
        <CustomizeButtonsModal
          isOpen={showCustomizeModal}
          onClose={() => setShowCustomizeModal(false)}
          initialLocation={location}
          entityType={entityType}
        />
      </div>
    );
  }

  // Vertical and horizontal layouts
  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {/* AI Goals Button */}
      {showGoalsButton && (
        <div className={layout === 'vertical' ? 'w-full flex items-center space-x-2' : ''}>
          <AIGoalsButton
            entityType={entityType}
            entityId={entityId}
            entityData={entityData}
            size={size}
            variant="primary"
            className={layout === 'vertical' ? 'flex-1' : ''}
          />
          {showCustomizeButton && layout === 'vertical' && (
            <button
              onClick={() => setShowCustomizeModal(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Customize buttons"
            >
              <Settings size={16} />
            </button>
          )}
        </div>
      )}
      
      {/* Customized Quick Actions */}
      {customQuickActions.map((action, index) => (
        <QuickAIButton
          key={index}
          icon={action.icon}
          label={action.label}
          toolName={action.toolName}
          entityType={entityType}
          entityId={entityId}
          entityData={entityData}
          size={size}
          variant={action.variant as any}
          className={layout === 'vertical' ? 'w-full' : ''}
        />
      ))}

      {/* Customize Button for horizontal layout */}
      {showCustomizeButton && layout === 'horizontal' && (
        <button
          onClick={() => setShowCustomizeModal(true)}
          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          title="Customize buttons"
        >
          <Settings size={14} />
        </button>
      )}

      {/* Customization Modal */}
      <CustomizeButtonsModal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        initialLocation={location}
        entityType={entityType}
      />
    </div>
  );
};

// Helper function to get icon component from string
function getIconComponent(iconName: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    BarChart3,
    Mail,
    TrendingUp,
    AlertTriangle,
    Navigation,
    FileText,
    Send,
    Calendar,
    DollarSign,
    Heart,
    UserPlus,
    Search,
    BarChart,
    Zap,
    Clock,
    GitBranch,
    PenTool,
    Video,
    FileSearch,
    Package,
    Settings,
    Plus
  };
  
  return iconMap[iconName] || BarChart3; // Default fallback
}

// Helper function to get variant based on category
function getVariantForCategory(category: string): string {
  switch (category) {
    case 'Sales':
      return 'analysis';
    case 'Marketing':
      return 'generation';
    case 'Relationship':
      return 'research';
    case 'Analytics':
      return 'analysis';
    case 'Automation':
      return 'default';
    case 'Content':
      return 'generation';
    case 'AI-Native':
      return 'research';
    default:
      return 'default';
  }
}

export default CustomizableAIToolbar;