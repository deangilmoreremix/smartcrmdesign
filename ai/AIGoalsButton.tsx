import React, { useState } from 'react';
import { Target, Loader2 } from 'lucide-react';
import { useAITools } from '../AIToolsProvider';

interface AIGoalsButtonProps {
  entityType: 'contact' | 'deal' | 'company';
  entityId: string;
  entityData: any;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  className?: string;
}

const AIGoalsButton: React.FC<AIGoalsButtonProps> = ({
  entityType,
  entityId,
  entityData,
  size = 'md',
  variant = 'primary',
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { openTool } = useAITools();

  const handleAIGoalsClick = async () => {
    setIsLoading(true);
    
    try {
      // Navigate to AI Goals page with entity context stored in sessionStorage
      sessionStorage.setItem('aiGoalsContext', JSON.stringify({
        entityType,
        entityId,
        entityData,
        suggestedCategories: getSuggestedCategories(entityType)
      }));
      
      // Navigate to AI Goals page
      window.location.href = '/ai-goals';
    } catch (error) {
      console.error('Error opening AI Goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestedCategories = (type: string) => {
    switch (type) {
      case 'contact':
        return ['Sales', 'Marketing', 'Relationship'];
      case 'deal':
        return ['Sales', 'Analytics', 'Automation'];
      case 'company':
        return ['Analytics', 'Research', 'Business Intelligence'];
      default:
        return [];
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs h-8 min-w-[90px]',
    md: 'px-4 py-2.5 text-sm h-9 min-w-[110px]',
    lg: 'px-5 py-3 text-sm h-10 min-w-[130px]'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md border border-purple-300/20',
    secondary: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/60 shadow-sm'
  };

  return (
    <button
      onClick={handleAIGoalsClick}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} className="animate-spin mr-1" />
      ) : (
        <Target size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} className="mr-1" />
      )}
      AI Goals
      <span className="ml-1 text-xs opacity-75">(58)</span>
    </button>
  );
};

export default AIGoalsButton;