// Complete Interactive Goal Card Code
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
  Rocket,
  Globe,
  Award,
  AlertCircle,
  Calendar,
  Timer
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
  const [liveMetrics, setLiveMetrics] = useState({
    estimatedValue: parseInt(goal.roi.replace(/[^0-9]/g, '')) * 1000 || 25000,
    timeToComplete: parseInt(goal.estimatedSetupTime.replace(/[^0-9]/g, '')) || 15,
    confidence: goal.priority === 'High' ? 95 : goal.priority === 'Medium' ? 85 : 75,
    agentsRequired: goal.agentsRequired.length || 3
  });

  // Update metrics based on execution progress (no simulation for real mode)
  useEffect(() => {
    if (isExecuting && realMode) {
      const baseValue = parseInt(goal.roi.replace(/[^0-9]/g, '')) * 1000 || 25000;
      const baseTime = parseInt(goal.estimatedSetupTime.replace(/[^0-9]/g, '')) || 15;
      const baseConfidence = goal.priority === 'High' ? 95 : goal.priority === 'Medium' ? 85 : 75;
      
      setLiveMetrics({
        estimatedValue: Math.floor(baseValue * (1 + executionProgress / 100)),
        timeToComplete: Math.max(1, Math.floor(baseTime * (1 - executionProgress / 100))),
        confidence: Math.min(99, Math.floor(baseConfidence + (executionProgress / 10))),
        agentsRequired: goal.agentsRequired.length || 3
      });
    }
  }, [isExecuting, executionProgress, goal, realMode]);

  // Color system based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'from-red-500 to-orange-500';
      case 'Medium': return 'from-yellow-500 to-orange-500';
      case 'Low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 dark:text-red-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Icon system based on complexity
  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return <Zap className="h-4 w-4" />;
      case 'Intermediate': return <Target className="h-4 w-4" />;
      case 'Advanced': return <Star className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  // Category-based color and icon system
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sales': return 'from-blue-500 to-cyan-500';
      case 'marketing': return 'from-purple-500 to-pink-500';
      case 'relationship': return 'from-green-500 to-teal-500';
      case 'automation': return 'from-orange-500 to-amber-500';
      case 'analytics': return 'from-teal-500 to-cyan-500';
      case 'content': return 'from-yellow-500 to-orange-500';
      case 'admin': return 'from-indigo-500 to-purple-500';
      case 'ai-native': return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sales': return <Target className="h-5 w-5" />;
      case 'marketing': return <Rocket className="h-5 w-5" />;
      case 'relationship': return <Users className="h-5 w-5" />;
      case 'automation': return <Bot className="h-5 w-5" />;
      case 'analytics': return <BarChart3 className="h-5 w-5" />;
      case 'content': return <Globe className="h-5 w-5" />;
      case 'admin': return <Settings className="h-5 w-5" />;
      case 'ai-native': return <Brain className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 transform ${
        isHovered ? 'scale-105 z-20' : ''
      } ${isExecuting ? 'ring-4 ring-blue-500/50 ring-offset-4 ring-offset-transparent' : ''} ${
        isCompleted ? 'ring-2 ring-green-500/50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* DESIGN ELEMENT 1: Glowing Background Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${getCategoryColor(goal.category)} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      {/* DESIGN ELEMENT 2: Main Card Container */}
      <div className={`relative bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all duration-500 overflow-hidden ${
        isExecuting ? 'border-blue-500 dark:border-blue-400' : 
        isCompleted ? 'border-green-500 dark:border-green-400' :
        'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
      } shadow-xl hover:shadow-2xl`}>
        
        {/* DESIGN ELEMENT 3: Execution Progress Bar */}
        {isExecuting && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
              style={{ width: `${executionProgress}%` }}
            />
          </div>
        )}

        {/* DESIGN ELEMENT 4: Category Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(goal.category)} text-white text-xs font-bold shadow-lg`}>
            {getCategoryIcon(goal.category)}
            <span>{goal.category}</span>
          </div>
        </div>

        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-4 left-4 z-10">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg">
              <CheckCircle className="h-3 w-3" />
              <span>Completed</span>
            </div>
          </div>
        )}

        {/* DESIGN ELEMENT 5: Card Content */}
        <div className="p-6 space-y-4">
          {/* Header Section */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight pr-20">
                {goal.title}
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
              {goal.description}
            </p>
          </div>

          {/* DESIGN ELEMENT 6: Live Metrics Row */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 dark:border-slate-700">
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                ${liveMetrics.estimatedValue.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Est. Value</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-1">
                <Timer className="h-3 w-3" />
                {liveMetrics.timeToComplete}m
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Time</div>
            </div>
          </div>

          {/* DESIGN ELEMENT 7: Goal Properties */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-lg bg-gradient-to-r ${getPriorityColor(goal.priority)}`}>
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                <span className={`text-xs font-semibold ${getPriorityTextColor(goal.priority)}`}>
                  {goal.priority} Priority
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {getComplexityIcon(goal.complexity)}
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {goal.complexity}
                </span>
              </div>
            </div>

            {/* DESIGN ELEMENT 8: Tools and Agents */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Bot className="h-3 w-3" />
                <span>{liveMetrics.agentsRequired} AI Agents Required</span>
              </div>
              
              {goal.toolsNeeded && goal.toolsNeeded.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {goal.toolsNeeded.slice(0, 3).map((tool, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded-md font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                  {goal.toolsNeeded.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                      +{goal.toolsNeeded.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DESIGN ELEMENT 9: Live Stats (when executing) */}
          {isExecuting && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
                  Executing Now
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-blue-600 dark:text-blue-400 font-bold">
                    {Math.round(executionProgress)}%
                  </div>
                  <div className="text-blue-500 dark:text-blue-500">Progress</div>
                </div>
                <div>
                  <div className="text-blue-600 dark:text-blue-400 font-bold">
                    {liveMetrics.confidence}%
                  </div>
                  <div className="text-blue-500 dark:text-blue-500">Confidence</div>
                </div>
              </div>
            </div>
          )}

          {/* DESIGN ELEMENT 10: Action Buttons */}
          <div className="pt-2 space-y-3">
            {!isExecuting && !isCompleted && (
              <button
                onClick={() => onExecute(goal)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  realMode 
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } flex items-center justify-center gap-2`}
              >
                <Play className="h-4 w-4" />
                {realMode ? 'Execute Live' : 'Execute Goal'}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {isExecuting && (
              <div className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-3">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="font-bold">Executing...</span>
                <span className="text-blue-200 text-sm">{Math.round(executionProgress)}%</span>
              </div>
            )}

            {isCompleted && (
              <button
                onClick={() => onExecute(goal)}
                className="w-full py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 transition-colors font-bold"
              >
                <CheckCircle className="h-4 w-4" />
                View Results
              </button>
            )}

            {/* DESIGN ELEMENT 11: Preview and Details Buttons */}
            <div className="flex gap-2">
              {onPreview && !isExecuting && (
                <button
                  onClick={() => onPreview(goal)}
                  className="flex-1 py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="h-3 w-3" />
                  Preview
                </button>
              )}
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1 py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="h-3 w-3" />
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
          </div>
        </div>

        {/* DESIGN ELEMENT 12: Execution Mode Indicator */}
        {realMode && (
          <div className="absolute top-2 left-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-600 text-xs font-medium">LIVE</span>
            </div>
          </div>
        )}

        {/* DESIGN ELEMENT 13: Detailed Information Panel */}
        {showDetails && (
          <div className="border-t border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-800/50">
            <div className="space-y-4">
              {/* Business Impact */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Business Impact
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {goal.businessImpact}
                </p>
              </div>

              {/* ROI and Setup Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Expected ROI</h5>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">{goal.roi}</p>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Setup Time</h5>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{goal.estimatedSetupTime}</p>
                </div>
              </div>

              {/* Prerequisites */}
              {goal.prerequisite && goal.prerequisite.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-600" />
                    Prerequisites
                  </h4>
                  <ul className="space-y-1">
                    {goal.prerequisite.map((req, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <div className="w-1 h-1 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success Metrics */}
              {goal.successMetrics && goal.successMetrics.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    Success Metrics
                  </h4>
                  <ul className="space-y-1">
                    {goal.successMetrics.map((metric, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Real World Example */}
              {goal.realWorldExample && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-600" />
                    Real World Example
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    {goal.realWorldExample}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveGoalCard;