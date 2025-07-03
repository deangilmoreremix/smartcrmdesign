import React, { useState, useEffect } from 'react';
import { Goal } from '../types/goals';
import { aiGoalsData, goalCategories, allGoals } from '../data/goalsData';
import InteractiveGoalCard from './InteractiveGoalCard';
import GoalExecutionModal from './GoalExecutionModal';
import { 
  Target, 
  Filter, 
  Search, 
  Zap, 
  Star, 
  TrendingUp,
  ArrowRight,
  Play,
  Eye,
  Sparkles,
  Brain,
  Users,
  Activity,
  BarChart3,
  Network,
  Bot,
  Award,
  Lightbulb,
  HelpCircle,
  Settings,
  Info,
  Timer,
  Gauge,
  Cpu,
  Rocket,
  FileText
} from 'lucide-react';

interface InteractiveGoalExplorerProps {
  realMode?: boolean;
  onModeToggle?: (mode: boolean) => void;
  onOpenApiSetup?: () => void;
  onGoalSelected?: (goal: Goal) => void;
  contextData?: any;
}

const InteractiveGoalExplorer: React.FC<InteractiveGoalExplorerProps> = ({
  realMode = false,
  onModeToggle,
  onOpenApiSetup,
  onGoalSelected,
  contextData
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [executingGoals, setExecutingGoals] = useState<Set<string>>(new Set());
  const [executionProgress, setExecutionProgress] = useState<Record<string, number>>({});
  const [completedGoals, setCompletedGoals] = useState<Set<string>>(new Set());
  const [executingGoal, setExecutingGoal] = useState<Goal | null>(null);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  
  // Live dashboard stats
  const [liveStats, setLiveStats] = useState({
    totalGoals: allGoals.length,
    completedToday: 0,
    valueGenerated: 0,
    activeAgents: 0,
    executingNow: 0,
    systemHealth: 98
  });

  // Update live stats based on execution state
  useEffect(() => {
    setLiveStats(prev => ({
      ...prev,
      executingNow: executingGoals.size,
      completedToday: completedGoals.size,
      valueGenerated: completedGoals.size * 15000 + executingGoals.size * 7500,
      activeAgents: executingGoals.size * 3,
      systemHealth: 98 + Math.random() * 2
    }));
  }, [executingGoals.size, completedGoals.size]);

  // Smart filtering combining multiple criteria
  const filteredGoals = allGoals.filter(goal => {
    const matchesSearch = searchTerm === '' || 
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.businessImpact.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      goal.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesPriority = selectedPriority === 'all' || goal.priority === selectedPriority;
    
    const matchesComplexity = selectedComplexity === 'all' || goal.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesComplexity;
  });

  // Handle goal execution
  const handleExecuteGoal = async (goal: Goal) => {
    if (executingGoals.has(goal.id)) return;

    setExecutingGoals(prev => new Set([...Array.from(prev), goal.id]));
    setExecutionProgress(prev => ({ ...prev, [goal.id]: 0 }));
    setExecutingGoal(goal);
    setShowExecutionModal(true);
    onGoalSelected?.(goal);

    // Simulate realistic execution with progress tracking
    const progressInterval = setInterval(() => {
      setExecutionProgress(prev => {
        const currentProgress = prev[goal.id] || 0;
        const newProgress = Math.min(100, currentProgress + Math.random() * 12 + 3);
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setExecutingGoals(current => {
            const newSet = new Set(current);
            newSet.delete(goal.id);
            return newSet;
          });
          setCompletedGoals(current => new Set([...Array.from(current), goal.id]));
          return { ...prev, [goal.id]: 100 };
        }
        
        return { ...prev, [goal.id]: newProgress };
      });
    }, 1000);
  };

  // Batch execution for quick actions
  const executeQuickAction = async (actionType: string) => {
    let targetGoals: Goal[] = [];
    
    switch (actionType) {
      case 'high-priority':
        targetGoals = allGoals.filter(goal => goal.priority === 'High').slice(0, 3);
        break;
      case 'quick-wins':
        targetGoals = allGoals.filter(goal => goal.complexity === 'Simple').slice(0, 5);
        break;
      case 'sales-focus':
        targetGoals = allGoals.filter(goal => goal.category.toLowerCase() === 'sales').slice(0, 4);
        break;
    }

    // Execute goals with staggered delays
    targetGoals.forEach((goal, index) => {
      setTimeout(() => {
        handleExecuteGoal(goal);
      }, index * 2000);
    });
  };

  const handleCloseModal = () => {
    setShowExecutionModal(false);
    setExecutingGoal(null);
  };

  const handleExecutionComplete = (result: any) => {
    console.log('Goal execution completed:', result);
    setCompletedGoals(prev => new Set([...Array.from(prev), result.goalId]));
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return allGoals.length;
    return allGoals.filter(g => g.category.toLowerCase() === categoryId.toLowerCase()).length;
  };

  const getIconComponent = (icon: any) => {
    // If it's already a React component, return it directly
    if (typeof icon === 'function') {
      return icon;
    }
    
    // Fallback mapping for string icons
    const iconMap: Record<string, any> = {
      '🎯': Target,
      'Target': Target,
      '📈': TrendingUp,
      '👥': Users,
      'Users': Users,
      '⚡': Zap,
      'Zap': Zap,
      '📊': BarChart3,
      'BarChart3': BarChart3,
      '📝': FileText,
      'FileText': FileText,
      '🚀': Rocket,
      'Rocket': Rocket,
      '🤖': Bot,
      'Bot': Bot,
      '🧠': Brain,
      'Brain': Brain,
      '💼': Settings,
      'Settings': Settings,
      '🔍': Search,
      '⭐': Star,
      '👁️': Eye,
      '🎨': Sparkles,
      '📱': Activity,
      '🌐': Network,
      '🏆': Award,
      '💡': Lightbulb,
      '❓': HelpCircle,
      'ℹ️': Info,
      '⏱️': Timer,
      '📏': Gauge,
      '💻': Cpu
    };
    
    const IconComponent = iconMap[icon] || Target;
    return IconComponent;
  };

  const getPriorityCount = (priority: string) => {
    if (priority === 'all') return allGoals.length;
    return allGoals.filter(g => g.priority === priority).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Background Circles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: `linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
        
        {/* Moving Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 animate-pulse"></div>
      </div>

      <div className="relative z-10 space-y-12 pb-16">
        {/* Massive Animated Header Section */}
        <div className="text-center py-16 px-4 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #3b82f6 2px, transparent 2px)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          <div className="relative z-10">
            {/* Main Title */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Brain className="h-12 w-12 text-white animate-pulse" />
              <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Goals Center
              </h1>
              <Sparkles className="h-10 w-10 text-blue-400 animate-float" />
            </div>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Transform your business with AI-powered automation. Execute strategic goals with intelligent agents 
              and watch real-time progress across your entire operation.
            </p>

            {/* Live System Dashboard */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 max-w-6xl mx-auto relative overflow-hidden">
              {/* Glass Morphism Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/1 backdrop-blur-xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <Network className="h-8 w-8 text-blue-400" />
                  <h2 className="text-3xl font-bold text-white">Live System Dashboard</h2>
                  <Activity className="h-6 w-6 text-green-400 animate-pulse" />
                </div>

                {/* 4 Main Metric Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  {/* Total Goals */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-blue-400/30 p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 animate-pulse"></div>
                    <div className="relative z-10">
                      <Target className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                      <div className="text-4xl font-bold text-white mb-2">{liveStats.totalGoals}</div>
                      <div className="text-blue-300 font-medium">Available Goals</div>
                      <div className="text-sm text-blue-400/70 mt-1">Ready for execution</div>
                    </div>
                  </div>

                  {/* Completed Today */}
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl border border-green-400/30 p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 animate-pulse"></div>
                    <div className="relative z-10">
                      <Award className="h-8 w-8 text-green-400 mx-auto mb-3" />
                      <div className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                        {liveStats.completedToday}
                        {liveStats.completedToday > 0 && <Sparkles className="h-6 w-6 text-green-400" />}
                      </div>
                      <div className="text-green-300 font-medium">Completed Today</div>
                      <div className="text-sm text-green-400/70 mt-1">Successfully achieved</div>
                    </div>
                  </div>

                  {/* Value Generated */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-purple-400/30 p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 animate-pulse"></div>
                    <div className="relative z-10">
                      <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                      <div className="text-4xl font-bold text-white mb-2">${(liveStats.valueGenerated).toLocaleString()}</div>
                      <div className="text-purple-300 font-medium">Value Generated</div>
                      <div className="text-sm text-purple-400/70 mt-1">Business impact today</div>
                    </div>
                  </div>

                  {/* Active Agents */}
                  <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-2xl border border-orange-400/30 p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-amber-600/10 animate-pulse"></div>
                    <div className="relative z-10">
                      <Bot className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                      <div className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                        {liveStats.activeAgents}
                        {liveStats.activeAgents > 0 && <Activity className="h-6 w-6 text-orange-400 animate-pulse" />}
                      </div>
                      <div className="text-orange-300 font-medium">Active Agents</div>
                      <div className="text-sm text-orange-400/70 mt-1">Currently working</div>
                    </div>
                  </div>
                </div>

                {/* System Health Bar */}
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Cpu className="h-6 w-6 text-green-400" />
                  <div className="flex-1 max-w-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">System Health</span>
                      <span className="text-sm text-green-400">{liveStats.systemHealth.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${liveStats.systemHealth}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search & Filter System */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-3xl mx-auto">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search goals by title, description, or expected outcomes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <button
                onClick={() => executeQuickAction('high-priority')}
                className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-xl p-4 text-center hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300 group"
              >
                <Star className="h-6 w-6 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-white font-medium">High Priority</div>
                <div className="text-sm text-red-400">Execute top 3 goals</div>
              </button>

              <button
                onClick={() => executeQuickAction('quick-wins')}
                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 text-center hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 group"
              >
                <Zap className="h-6 w-6 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-white font-medium">Quick Wins</div>
                <div className="text-sm text-green-400">Simple goals first</div>
              </button>

              <button
                onClick={() => executeQuickAction('sales-focus')}
                className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl p-4 text-center hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 group"
              >
                <TrendingUp className="h-6 w-6 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-white font-medium">Sales Focus</div>
                <div className="text-sm text-blue-400">Revenue goals</div>
              </button>

              <button
                onClick={() => onModeToggle?.(!realMode)}
                className={`border rounded-xl p-4 text-center transition-all duration-300 group ${
                  realMode 
                    ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400/30 hover:from-red-500/30 hover:to-orange-500/30' 
                    : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30'
                }`}
              >
                <Settings className={`h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform ${
                  realMode ? 'text-red-400' : 'text-blue-400'
                }`} />
                <div className="text-white font-medium">{realMode ? 'Live Mode' : 'Demo Mode'}</div>
                <div className={`text-sm ${realMode ? 'text-red-400' : 'text-blue-400'}`}>
                  {realMode ? 'Real execution' : 'Safe testing'}
                </div>
              </button>
            </div>

            {/* Category Filters */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                Categories
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    selectedCategory === 'all'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 scale-105'
                      : 'bg-slate-700/30 text-gray-400 border-gray-600/30 hover:border-blue-500/30 hover:scale-105'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium">All</div>
                    <div className="text-xs text-gray-500">{getCategoryCount('all')}</div>
                  </div>
                </button>
                {aiGoalsData.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-3 rounded-xl border transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 scale-105'
                        : 'bg-slate-700/30 text-gray-400 border-gray-600/30 hover:border-blue-500/30 hover:scale-105'
                    }`}
                  >
                    <div className="text-center">
                      {React.createElement(getIconComponent(category.icon), { className: "h-5 w-5 mx-auto mb-1 text-blue-400" })}
                      <div className="text-sm font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">{getCategoryCount(category.id)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority and Complexity Filters */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Priority Level
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {['all', 'High', 'Medium', 'Low'].map(priority => (
                    <button
                      key={priority}
                      onClick={() => setSelectedPriority(priority)}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        selectedPriority === priority
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 scale-105'
                          : 'bg-slate-700/30 text-gray-400 border-gray-600/30 hover:border-blue-500/30 hover:scale-105'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium">{priority === 'all' ? 'All' : priority}</div>
                        <div className="text-xs text-gray-500">{getPriorityCount(priority)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-purple-400" />
                  Complexity Level
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {['all', 'Simple', 'Intermediate', 'Advanced'].map(complexity => (
                    <button
                      key={complexity}
                      onClick={() => setSelectedComplexity(complexity)}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        selectedComplexity === complexity
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 scale-105'
                          : 'bg-slate-700/30 text-gray-400 border-gray-600/30 hover:border-blue-500/30 hover:scale-105'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium">{complexity === 'all' ? 'All' : complexity}</div>
                        <div className="text-xs text-gray-500">
                          {complexity === 'all' ? allGoals.length : allGoals.filter(g => g.complexity === complexity).length}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-green-400" />
                <h3 className="text-xl font-semibold text-white">
                  Showing {filteredGoals.length} of {allGoals.length} goals
                </h3>
                {searchTerm && (
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                    "{searchTerm}"
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>{completedGoals.size} completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span>{executingGoals.size} executing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGoals.map((goal) => (
              <InteractiveGoalCard
                key={goal.id}
                goal={goal}
                onExecute={handleExecuteGoal}
                onPreview={(goal) => console.log('Preview goal:', goal)}
                isExecuting={executingGoals.has(goal.id)}
                executionProgress={executionProgress[goal.id] || 0}
                realMode={realMode}
                isCompleted={Array.from(completedGoals).includes(goal.id)}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredGoals.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No goals found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters or search terms to find goals that match your needs.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPriority('all');
                  setSelectedComplexity('all');
                  setSearchTerm('');
                }}
                className="bg-blue-500/20 text-blue-400 px-6 py-3 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Goal Execution Modal */}
      {showExecutionModal && executingGoal && (
        <GoalExecutionModal
          goal={executingGoal}
          isOpen={showExecutionModal}
          onClose={handleCloseModal}
          realMode={realMode}
          onComplete={handleExecutionComplete}
        />
      )}
    </div>
  );
};

export default InteractiveGoalExplorer;