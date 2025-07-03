import React, { useState, useEffect } from 'react';
import { Goal } from '../types/goals';
import InteractiveGoalCard from './InteractiveGoalCard';
import { 
  Search, 
  Filter, 
  Zap, 
  Target, 
  Star, 
  TrendingUp, 
  Clock, 
  Users,
  Brain,
  Activity,
  Play,
  Sparkles,
  BarChart3,
  Settings,
  Bot,
  Rocket,
  Globe,
  FileText,
  Calendar,
  ArrowRight
} from 'lucide-react';

interface GoalCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  goals: Goal[];
}

interface InteractiveGoalExplorerProps {
  aiGoalsData: GoalCategory[];
  onGoalSelected: (goal: Goal) => void;
  contextData?: any;
  realMode?: boolean;
  onModeToggle?: (mode: boolean) => void;
  onGoalSelect?: (goal: Goal) => void;
}

const InteractiveGoalExplorer: React.FC<InteractiveGoalExplorerProps> = ({
  aiGoalsData,
  onGoalSelected,
  contextData,
  realMode = false,
  onModeToggle,
  onGoalSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [executingGoals, setExecutingGoals] = useState<Set<string>>(new Set());
  const [completedGoals, setCompletedGoals] = useState<Set<string>>(new Set());
  const [executionProgress, setExecutionProgress] = useState<Record<string, number>>({});
  const [executingGoal, setExecutingGoal] = useState<Goal | null>(null);
  const [liveStats, setLiveStats] = useState({
    totalGoals: 0,
    completedToday: 0,
    valueGenerated: 0,
    activeAgents: 17
  });

  // Calculate stats from all goals
  useEffect(() => {
    const allGoals = aiGoalsData.flatMap((category: GoalCategory) => category.goals);
    setLiveStats(prev => ({
      ...prev,
      totalGoals: allGoals.length,
      completedToday: Math.floor(Math.random() * 8) + 3,
      valueGenerated: Math.floor(Math.random() * 150000) + 50000
    }));
  }, [aiGoalsData]);

  // Handle goal execution
  const handleExecuteGoal = async (goal: Goal) => {
    if (executingGoals.has(goal.id)) return;

    setExecutingGoals(prev => new Set(Array.from(prev).concat(goal.id)));
    setExecutionProgress(prev => ({ ...prev, [goal.id]: 0 }));

    // Show the modal
    setExecutingGoal(goal);
    onGoalSelected(goal);

    // Simulate execution progress
    const progressInterval = setInterval(() => {
      setExecutionProgress(prev => {
        const currentProgress = prev[goal.id] || 0;
        const newProgress = Math.min(100, currentProgress + Math.random() * 12 + 3);
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setExecutingGoals(current => {
            const newSet = new Set(Array.from(current));
            newSet.delete(goal.id);
            return newSet;
          });
          setCompletedGoals(current => new Set(Array.from(current).concat(goal.id)));
        }
        
        return { ...prev, [goal.id]: newProgress };
      });
    }, 1000);
  };

  // Handle goal completion from modal
  const handleExecutionComplete = (result: any) => {
    console.log('Goal execution completed:', result);
    setCompletedGoals(prev => new Set(Array.from(prev).concat(result.goalId)));
  };

  // Handle modal close
  const handleCloseModal = () => {
    setExecutingGoal(null);
  };

  // Filter goals based on search and filters
  const filteredGoals = aiGoalsData.reduce((acc: GoalCategory[], category: GoalCategory) => {
    const filteredCategoryGoals = category.goals.filter((goal: Goal) => {
      const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           goal.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || category.id === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || goal.priority === selectedPriority;
      const matchesComplexity = selectedComplexity === 'all' || goal.complexity === selectedComplexity;
      
      return matchesSearch && matchesCategory && matchesPriority && matchesComplexity;
    });

    if (filteredCategoryGoals.length > 0) {
      acc.push({
        ...category,
        goals: filteredCategoryGoals
      });
    }
    return acc;
  }, [] as typeof aiGoalsData);

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
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

  const executeQuickAction = (actionType: string) => {
    const allGoals = aiGoalsData.flatMap(category => category.goals);
    let targetGoals: Goal[] = [];

    switch (actionType) {
      case 'high-priority':
        targetGoals = allGoals.filter(goal => goal.priority === 'High').slice(0, 3);
        break;
      case 'quick-wins':
        targetGoals = allGoals.filter(goal => goal.complexity === 'Simple').slice(0, 3);
        break;
      case 'sales-focus':
        targetGoals = allGoals.filter(goal => goal.category === 'Sales').slice(0, 3);
        break;
    }

    targetGoals.forEach((goal, index) => {
      setTimeout(() => handleExecuteGoal(goal), index * 500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Massive Header */}
        <div className="text-center py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm"></div>
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl">
                <Brain className="h-12 w-12 text-white animate-pulse" />
              </div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Goals Center
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Intelligent business automation powered by 17 specialized AI agents. Execute strategic goals with real-time insights and measurable outcomes.
            </p>

            {/* Live Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {liveStats.totalGoals}+
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Available Goals
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="h-8 w-8 text-green-600 animate-pulse" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {liveStats.completedToday}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Completed Today
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    ${Math.floor(liveStats.valueGenerated / 1000)}K
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Value Generated
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Bot className="h-8 w-8 text-orange-600" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {liveStats.activeAgents}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  AI Agents Ready
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-slate-700/50">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search goals by title, description, or outcome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 text-lg bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Buttons */}
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categories
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    All Categories ({aiGoalsData.reduce((acc, cat) => acc + cat.goals.length, 0)})
                  </button>
                  {aiGoalsData.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {getCategoryIcon(category.id)}
                      {category.name} ({category.goals.length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority and Complexity Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Priority</h3>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'High', 'Medium', 'Low'].map(priority => (
                      <button
                        key={priority}
                        onClick={() => setSelectedPriority(priority)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                          selectedPriority === priority
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {priority === 'all' ? 'All' : priority}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Complexity</h3>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'Simple', 'Intermediate', 'Advanced'].map(complexity => (
                      <button
                        key={complexity}
                        onClick={() => setSelectedComplexity(complexity)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                          selectedComplexity === complexity
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {complexity === 'all' ? 'All' : complexity}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => executeQuickAction('high-priority')}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-orange-600 transition-all shadow-lg flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Execute High Priority
                  </button>
                  <button
                    onClick={() => executeQuickAction('quick-wins')}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Quick Wins
                  </button>
                  <button
                    onClick={() => executeQuickAction('sales-focus')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Target className="h-4 w-4" />
                    Sales Focus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {filteredGoals.reduce((acc, cat) => acc + cat.goals.length, 0)} Goals Found
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  across {filteredGoals.length} categories
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Execution Mode:
                </div>
                <button
                  onClick={() => onModeToggle?.(!realMode)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    realMode
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {realMode ? 'LIVE MODE' : 'DEMO MODE'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          {filteredGoals.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                No goals match your current filters
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredGoals.map(category => (
                <div key={category.id} className="animate-fadeIn">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${category.color} shadow-lg`}>
                      {getCategoryIcon(category.id)}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {category.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.goals.map(goal => (
                      <InteractiveGoalCard
                        key={goal.id}
                        goal={goal}
                        onExecute={handleExecuteGoal}
                        isExecuting={executingGoals.has(goal.id)}
                        executionProgress={executionProgress[goal.id] || 0}
                        realMode={realMode}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveGoalExplorer;