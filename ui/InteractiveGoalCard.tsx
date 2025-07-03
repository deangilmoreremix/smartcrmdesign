import React, { useState, useEffect } from 'react';
import { Goal } from '../../types/goals';
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
  BarChart3
} from 'lucide-react';

interface InteractiveGoalCardProps {
  goal: Goal;
  onExecute: (goal: Goal) => void;
  isExecuting?: boolean;
  executionProgress?: number;
  realMode?: boolean;
}

const InteractiveGoalCard: React.FC<InteractiveGoalCardProps> = ({
  goal,
  onExecute,
  isExecuting = false,
  executionProgress = 0,
  realMode = false
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
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
  const [showDetails, setShowDetails] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    estimatedValue: parseInt(goal.roi.replace(/[^0-9]/g, '')) || 25000,
    timeToComplete: parseInt(goal.estimatedSetupTime.replace(/[^0-9]/g, '')) || 15,
    confidence: goal.priority === 'High' ? 95 : goal.priority === 'Medium' ? 85 : 75
  });

  // Update metrics based on execution progress (no simulation)
  useEffect(() => {
    if (isExecuting && realMode) {
      const baseValue = parseInt(goal.roi.replace(/[^0-9]/g, '')) || 25000;
      const baseTime = parseInt(goal.estimatedSetupTime.replace(/[^0-9]/g, '')) || 15;
      const baseConfidence = goal.priority === 'High' ? 95 : goal.priority === 'Medium' ? 85 : 75;
      
      setLiveMetrics({
        estimatedValue: Math.floor(baseValue * (1 + executionProgress / 100)),
        timeToComplete: Math.max(1, Math.floor(baseTime * (1 - executionProgress / 100))),
        confidence: Math.min(99, Math.floor(baseConfidence + (executionProgress / 10)))
      });
    }
  }, [isExecuting, executionProgress, goal, realMode]);

  // No mock data needed - using real Goal interface fields

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 transform ${
        isHovered ? 'scale-105 z-10' : ''
      } ${isExecuting ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-slate-900' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Goal Card */}
      <div className={`relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500 overflow-hidden ${
        isExecuting 
          ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-400 shadow-lg'
          : isHovered
          ? 'bg-gradient-to-br from-white to-blue-50 border-blue-400 shadow-xl'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-sm'
      }`}>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute inset-0 transition-all duration-1000 ${
            isHovered ? 'scale-110 rotate-1' : 'scale-100'
          }`} style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Execution Progress Overlay */}
        {isExecuting && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse">
            <div 
              className="h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-all duration-300"
              style={{ width: `${executionProgress}%` }}
            />
          </div>
        )}

        {/* Header */}
        <div className="relative z-10 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                goal.priority === 'High' ? 'bg-red-100 text-red-700 border-red-300' :
                goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                goal.priority === 'Low' ? 'bg-green-100 text-green-700 border-green-300' :
                'bg-gray-100 text-gray-700 border-gray-300'
              }`}>
                {goal.priority} Priority
              </span>
              <div className="text-gray-600">{getComplexityIcon(goal.complexity)}</div>
            </div>
            
            {isExecuting && (
              <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
                <span className="text-xs text-blue-700">Executing</span>
              </div>
            )}
          </div>

          <h3 className={`text-lg font-bold transition-colors duration-300 ${
            isHovered ? 'text-gray-900' : 'text-gray-900'
          }`}>
            {goal.title}
          </h3>
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">{goal.description}</p>
        </div>

        {/* Business Impact */}
        <div className="relative z-10 mb-4 p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
          <div className="text-xs font-medium text-green-700 mb-1 flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            Business Impact
          </div>
          <div className="text-sm text-gray-800">{goal.businessImpact}</div>
        </div>

        {/* Live Metrics (when hovered or executing) */}
        {(isHovered || isExecuting) && (
          <div className="relative z-10 mb-4 space-y-3 animate-fadeIn">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-gray-100 rounded-lg border border-gray-200">
                <div className="text-lg font-bold text-green-600">${liveMetrics.estimatedValue.toLocaleString()}</div>
                <div className="text-xs text-gray-700">Est. Value</div>
              </div>
              <div className="text-center p-2 bg-gray-100 rounded-lg border border-gray-200">
                <div className="text-lg font-bold text-blue-600">{liveMetrics.timeToComplete}m</div>
                <div className="text-xs text-gray-700">Setup</div>
              </div>
              <div className="text-center p-2 bg-gray-100 rounded-lg border border-gray-200">
                <div className="text-lg font-bold text-purple-600">{liveMetrics.confidence}%</div>
                <div className="text-xs text-gray-700">Success</div>
              </div>
            </div>
          </div>
        )}

        {/* Agents Required */}
        <div className="relative z-10 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">AI Agents Required</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {goal.agentsRequired.slice(0, 3).map((agent, index) => (
              <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs border border-purple-200">
                <Bot className="h-3 w-3" />
                {agent}
              </div>
            ))}
            {goal.agentsRequired.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-200">
                +{goal.agentsRequired.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Tools & ROI */}
        <div className="relative z-10 mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-700 mb-1">Setup Time</div>
            <div className="flex items-center gap-1 text-blue-600">
              <Clock className="h-4 w-4" />
              {goal.estimatedSetupTime}
            </div>
          </div>
          <div>
            <div className="text-gray-700 mb-1">Expected ROI</div>
            <div className="text-green-600 font-medium">{goal.roi}</div>
          </div>
        </div>

        {/* Execution Progress Bar */}
        {isExecuting && (
          <div className="relative z-10 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-700">Execution Progress</span>
              <span className="text-sm text-blue-600">{Math.round(executionProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 relative"
                style={{ width: `${executionProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="relative z-10 space-y-3">
          <button
            onClick={() => onExecute(goal)}
            disabled={isExecuting}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform ${
              isExecuting
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : realMode
                ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isExecuting ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Executing Goal...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  {realMode ? 'Execute Real Goal' : 'Start Interactive Demo'}
                </>
              )}
            </span>
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <span className="flex items-center justify-center gap-2">
              <Settings className="h-4 w-4" />
              {showDetails ? 'Hide Details' : 'View Details'}
            </span>
          </button>
        </div>

        {/* Goal Details Expansion */}
        {showDetails && (
          <div className="relative z-10 mt-6 space-y-4 animate-fadeIn border-t border-gray-200 pt-4">
            {/* Detailed Description */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Goal Details
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">{goal.description}</p>
            </div>

            {/* Real World Example */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                Real World Example
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Implement this goal to automate {goal.category.toLowerCase()} workflows and improve team productivity with AI-powered insights.
              </p>
            </div>

            {/* Prerequisites */}
            {goal.prerequisite && goal.prerequisite.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-orange-600" />
                  Prerequisites
                </h4>
                <ul className="space-y-1">
                  {goal.prerequisite.map((req, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <div className="w-1 h-1 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* All AI Agents */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-600" />
                AI Agents Required ({goal.agentsRequired.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {goal.agentsRequired.map((agent, index) => (
                  <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs border border-purple-200">
                    <Bot className="h-3 w-3" />
                    {agent}
                  </div>
                ))}
              </div>
            </div>

            {/* Tools and Integrations */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Settings className="h-4 w-4 text-cyan-600" />
                Tools & Integrations
              </h4>
              <div className="flex flex-wrap gap-2">
                {goal.toolsNeeded.map((tool, index) => (
                  <span key={index} className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs border border-cyan-200">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-600" />
                Success Metrics
              </h4>
              <ul className="space-y-1">
                {goal.successMetrics.map((metric, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <div className="w-1 h-1 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    {metric}
                  </li>
                ))}
              </ul>
            </div>

            {/* Category and Complexity */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div>
                <h4 className="text-xs font-medium text-gray-600 mb-1">Category</h4>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getCategoryColor(goal.category)}`}>
                  {goal.category}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-600 mb-1">Complexity</h4>
                <div className="flex items-center gap-1 text-gray-700">
                  {getComplexityIcon(goal.complexity)}
                  <span className="text-xs">{goal.complexity}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Indicators */}
        {isHovered && !isExecuting && (
          <div className="absolute top-4 right-4 space-y-2 animate-fadeIn">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border border-blue-300">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        )}

        {/* Agent Network Indicator */}
        {isExecuting && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full" style={{animationDelay: '1s'}}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveGoalCard;