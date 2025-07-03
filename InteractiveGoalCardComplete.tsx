// COMPLETE InteractiveGoalCard.tsx - Your Original Comprehensive Design
import React, { useState, useEffect } from 'react';
import { Goal } from '../types/goals';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  Zap, 
  Play,
  Eye,
  CheckCircle,
  Loader,
  Star,
  Target,
  Shield,
  Brain,
  Activity,
  Bot,
  Settings,
  Sparkles,
  FileText,
  BarChart3,
  ArrowRight,
  Award,
  DollarSign,
  Lightbulb,
  Database,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  GitBranch,
  Gauge
} from 'lucide-react';

interface InteractiveGoalCardProps {
  goal: Goal;
  onExecute: (goal: Goal) => void;
  isExecuting?: boolean;
  executionProgress?: number;
  realMode?: boolean;
  onPreview?: (goal: Goal) => void;
  isCompleted?: boolean;
}

const InteractiveGoalCard: React.FC<InteractiveGoalCardProps> = ({
  goal,
  onExecute,
  isExecuting = false,
  executionProgress = 0,
  realMode = false,
  onPreview,
  isCompleted = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'preparing' | 'executing' | 'completing'>('idle');

  useEffect(() => {
    if (isExecuting) {
      if (executionProgress < 30) {
        setAnimationPhase('preparing');
      } else if (executionProgress < 90) {
        setAnimationPhase('executing');
      } else if (executionProgress < 100) {
        setAnimationPhase('completing');
      } else {
        setAnimationPhase('idle');
      }
    } else {
      setAnimationPhase('idle');
    }
  }, [isExecuting, executionProgress]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      case 'Medium': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'Low': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'High': return <Brain className="h-4 w-4 text-red-600" />;
      case 'Medium': return <Settings className="h-4 w-4 text-yellow-600" />;
      case 'Low': return <Zap className="h-4 w-4 text-green-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Sales': <TrendingUp className="h-5 w-5 text-blue-600" />,
      'Marketing': <Sparkles className="h-5 w-5 text-purple-600" />,
      'Relationship': <Users className="h-5 w-5 text-green-600" />,
      'Automation': <Bot className="h-5 w-5 text-orange-600" />,
      'Analytics': <BarChart3 className="h-5 w-5 text-indigo-600" />,
      'Content': <FileText className="h-5 w-5 text-pink-600" />,
      'Admin': <Shield className="h-5 w-5 text-gray-600" />,
      'AI-Native': <Brain className="h-5 w-5 text-cyan-600" />
    };
    return iconMap[category] || <Target className="h-5 w-5 text-gray-600" />;
  };

  const getToolIcons = (tools: string[]) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Email': <Mail className="h-3 w-3" />,
      'Phone': <Phone className="h-3 w-3" />,
      'Calendar': <Calendar className="h-3 w-3" />,
      'LinkedIn': <Users className="h-3 w-3" />,
      'CRM': <Database className="h-3 w-3" />,
      'SMS': <MessageSquare className="h-3 w-3" />,
      'Analytics': <BarChart3 className="h-3 w-3" />,
      'Automation': <Bot className="h-3 w-3" />
    };
    
    return tools.map(tool => (
      <div key={tool} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
        {iconMap[tool] || <Zap className="h-3 w-3" />}
        {tool}
      </div>
    ));
  };

  const priorityColors = getPriorityColor(goal.priority);

  return (
    <div 
      className={`relative group transition-all duration-300 transform ${
        isHovered ? 'scale-105 z-10' : 'scale-100'
      } ${isExecuting ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Execution Glow Effect */}
      {isExecuting && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20 animate-pulse" />
      )}

      <div className={`relative bg-white rounded-xl shadow-lg border transition-all duration-300 overflow-hidden ${
        isHovered ? 'shadow-xl border-blue-200' : 'shadow-md border-gray-200'
      } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
        
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              Completed
            </div>
          </div>
        )}

        {/* Execution Progress Bar */}
        {isExecuting && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${executionProgress}%` }}
            />
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                {getCategoryIcon(goal.category)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">{goal.title}</h3>
                <p className="text-sm text-gray-600">{goal.category}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border} border`}>
                {goal.priority}
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                {getComplexityIcon(goal.complexity)}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{goal.description}</p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{goal.estimatedTime}min</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">{goal.revenueImpact}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">ROI: {goal.expectedRoi}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">{goal.difficulty}/10</span>
            </div>
          </div>

          {/* Tools Needed */}
          {goal.toolsNeeded && goal.toolsNeeded.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Tools Required</p>
              <div className="flex flex-wrap gap-1">
                {getToolIcons(goal.toolsNeeded.slice(0, 3))}
                {goal.toolsNeeded.length > 3 && (
                  <div className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{goal.toolsNeeded.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {goal.prerequisites && goal.prerequisites.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Prerequisites</p>
              <div className="space-y-1">
                {goal.prerequisites.slice(0, 2).map((prereq, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    {prereq}
                  </div>
                ))}
                {goal.prerequisites.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{goal.prerequisites.length - 2} more prerequisites
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Metrics */}
          {goal.successMetrics && goal.successMetrics.length > 0 && showDetails && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-medium text-blue-800 mb-2">Success Metrics</p>
              <div className="space-y-1">
                {goal.successMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-blue-700">
                    <Target className="h-3 w-3" />
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Execution Status */}
          {isExecuting && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {animationPhase === 'preparing' && 'Preparing...'}
                  {animationPhase === 'executing' && 'Executing...'}
                  {animationPhase === 'completing' && 'Finalizing...'}
                </span>
                <span className="text-sm text-gray-500">{Math.round(executionProgress)}%</span>
              </div>
              
              {/* Animated Status Indicators */}
              <div className="flex items-center gap-2">
                {animationPhase === 'preparing' && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Initializing agents and tools...</span>
                  </div>
                )}
                {animationPhase === 'executing' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Activity className="h-4 w-4 animate-pulse" />
                    <span className="text-sm">AI agents working...</span>
                  </div>
                )}
                {animationPhase === 'completing' && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span className="text-sm">Generating results...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {!isExecuting && !isCompleted && (
              <button
                onClick={() => onExecute(goal)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium"
              >
                <Play className="h-4 w-4" />
                {realMode ? 'Execute Real' : 'Run Demo'}
              </button>
            )}
            
            {isExecuting && (
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg cursor-not-allowed"
              >
                <Loader className="h-4 w-4 animate-spin" />
                Executing...
              </button>
            )}
            
            {isCompleted && (
              <button
                onClick={() => onExecute(goal)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                View Results
              </button>
            )}

            {onPreview && (
              <button
                onClick={() => onPreview(goal)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Preview Details"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={showDetails ? "Hide Details" : "Show Details"}
            >
              <ArrowRight className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {/* Expanded Details */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              {/* Business Impact */}
              {goal.businessImpact && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Business Impact</p>
                  <p className="text-sm text-gray-700">{goal.businessImpact}</p>
                </div>
              )}

              {/* Implementation Notes */}
              {goal.implementationNotes && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Implementation Notes</p>
                  <p className="text-sm text-gray-700">{goal.implementationNotes}</p>
                </div>
              )}

              {/* Technical Requirements */}
              {goal.technicalRequirements && goal.technicalRequirements.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Technical Requirements</p>
                  <div className="space-y-1">
                    {goal.technicalRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        {req}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Models */}
              {goal.aiModels && goal.aiModels.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">AI Models</p>
                  <div className="flex flex-wrap gap-1">
                    {goal.aiModels.map(model => (
                      <span key={model} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        {isHovered && !isExecuting && (
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none rounded-xl" />
        )}

        {/* Execution Overlay */}
        {isExecuting && (
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent pointer-events-none rounded-xl" />
        )}
      </div>
    </div>
  );
};

export default InteractiveGoalCard;