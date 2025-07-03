import React, { useState, useEffect } from 'react';
import { AIGoal } from '../../data/aiGoals';
import { Check } from 'lucide-react';

interface SelectableGoalCardProps {
  goal: AIGoal;
  isSelected: boolean;
  canSelect: boolean;
  onToggle: (goalId: string) => void;
}

const SelectableGoalCard: React.FC<SelectableGoalCardProps> = ({
  goal,
  isSelected,
  canSelect,
  onToggle
}) => {
  const getPriorityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'green';
      case 'Intermediate': return 'yellow';
      case 'Advanced': return 'red';
      default: return 'gray';
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return <Zap className="h-4 w-4" />;
      case 'Intermediate': return <Target className="h-4 w-4" />;
      case 'Advanced': return <Star className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sales': return 'text-blue-400 bg-blue-500/20';
      case 'marketing': return 'text-purple-400 bg-purple-500/20';
      case 'relationship': return 'text-green-400 bg-green-500/20';
      case 'automation': return 'text-orange-400 bg-orange-500/20';
      case 'analytics': return 'text-teal-400 bg-teal-500/20';
      case 'content': return 'text-yellow-400 bg-yellow-500/20';
      case 'admin': return 'text-indigo-400 bg-indigo-500/20';
      case 'ai-native': return 'text-pink-400 bg-pink-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const [isHovered, setIsHovered] = useState(false);
  
  const liveMetrics = {
    estimatedValue: parseInt((goal.roi || '25000').replace(/[^0-9]/g, '')) || 25000,
    confidence: goal.priority === 'High' ? 95 : goal.priority === 'Medium' ? 85 : 75
  };

  return (
    <div 
      className={`relative cursor-pointer transition-all duration-300 ${
        isHovered ? 'transform translate-y-[-2px]' : ''
      } ${!canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => (canSelect || isSelected) && onToggle(goal.id)}
    >
      {/* Main Goal Card */}
      <div className={`relative p-6 rounded-xl border transition-all duration-300 ${
        isSelected 
          ? 'bg-blue-50 border-blue-500 shadow-md'
          : isHovered
          ? 'bg-white border-gray-200 shadow-lg'
          : 'bg-white border-gray-100 shadow-sm'
      }`}>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(goal.category || 'General')}`}>
                  {goal.category || 'General'}
                </span>
                <span className="text-xs text-gray-500">
                  {goal.estimatedTime || '15 min'}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                {goal.title || 'Untitled Goal'}
              </h3>
              
              <p className="text-sm text-gray-600 line-clamp-3">
                {goal.description || 'No description available'}
              </p>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
              <div className="ml-4 flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">${liveMetrics.estimatedValue.toLocaleString()}</span> potential value
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{liveMetrics.confidence}%</span> confidence
          </div>
        </div>


      </div>
    </div>
  );
};

export default SelectableGoalCard;