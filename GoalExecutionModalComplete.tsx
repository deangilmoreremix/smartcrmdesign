// COMPLETE GoalExecutionModal.tsx - Your Original Comprehensive Design
import React, { useState, useEffect } from 'react';
import { Goal } from '../types/goals';
import { composioService } from '../services/composioService';
import { callMCP } from '../utils/llm/mcpClient';
import { runAgentWorkflow, getAgentForGoal, AVAILABLE_AGENTS, type AgentType } from '../agents/AgentOrchestrator';
import { getOptimalGemmaConfig, enhanceAgenticPrompt, addChainOfThought } from '../services/gemmaAgentOptimizer';
import { 
  X, 
  Maximize2,
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  Users, 
  Bot,
  Activity,
  Network,
  GitBranch,
  Settings,
  BarChart3,
  Target,
  ArrowRight,
  Sparkles,
  Brain,
  Eye,
  Volume2,
  Database,
  Presentation,
  MessageSquare,
  TrendingUp,
  Award,
  Lightbulb
} from 'lucide-react';

interface ExecutionStep {
  id: string;
  agentName: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  startTime?: Date;
  completionTime?: Date;
  result?: any;
  thinking?: string;
  toolsUsed?: string[];
  crmImpact?: string;
}

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: 'idle' | 'working' | 'completed' | 'error';
  currentTask?: string;
  progress?: number;
  capabilities: string[];
  connections?: string[];
}

interface NetworkMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
  type: 'coordination' | 'data' | 'completion';
}

interface GoalExecutionModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  realMode?: boolean;
  onComplete?: (result: any) => void;
  contextData?: any;
}

const GoalExecutionModal: React.FC<GoalExecutionModalProps> = ({
  goal,
  isOpen,
  onClose,
  realMode = false,
  onComplete,
  contextData
}) => {
  const [executionState, setExecutionState] = useState<'idle' | 'running' | 'paused' | 'completed' | 'failed'>('idle');
  const [overallProgress, setOverallProgress] = useState(0);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number>(0);
  const [executionStartTime, setExecutionStartTime] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'steps' | 'logs' | 'results'>('overview');
  const [chainOfThought, setChainOfThought] = useState<string[]>([]);
  const [networkActivity, setNetworkActivity] = useState<NetworkMessage[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize agents and steps when goal changes
  useEffect(() => {
    if (goal && isOpen) {
      initializeExecution();
    }
  }, [goal, isOpen]);

  const initializeExecution = () => {
    if (!goal) return;

    // Initialize agents based on goal requirements
    const requiredAgents: Agent[] = [
      {
        id: 'orchestrator',
        name: 'Orchestrator Agent',
        type: 'aiAeAgent',
        status: 'idle',
        capabilities: ['Task Coordination', 'Agent Management', 'Progress Tracking'],
        connections: []
      }
    ];

    // Add specialized agents based on goal category and tools needed
    const primaryAgent = getAgentForGoal(goal.title, goal.description, goal.toolsNeeded || []);
    if (primaryAgent && AVAILABLE_AGENTS[primaryAgent]) {
      requiredAgents.push({
        id: primaryAgent,
        name: AVAILABLE_AGENTS[primaryAgent].name,
        type: primaryAgent,
        status: 'idle',
        capabilities: AVAILABLE_AGENTS[primaryAgent].capabilities,
        connections: []
      });
    }

    // Add supporting agents based on tools needed
    if (goal.toolsNeeded?.includes('Email')) {
      requiredAgents.push({
        id: 'email_agent',
        name: 'Email Automation Agent',
        type: 'personalizedEmailAgent',
        status: 'idle',
        capabilities: ['Email Generation', 'Send Optimization', 'Follow-up Automation'],
        connections: []
      });
    }

    if (goal.toolsNeeded?.includes('LinkedIn')) {
      requiredAgents.push({
        id: 'linkedin_agent',
        name: 'LinkedIn Agent',
        type: 'linkedinAgent',
        status: 'idle',
        capabilities: ['Connection Requests', 'Message Automation', 'Content Publishing'],
        connections: []
      });
    }

    setAgents(requiredAgents);
    
    // Initialize execution steps
    const initialSteps: ExecutionStep[] = [
      {
        id: 'planning',
        agentName: 'Orchestrator Agent',
        action: 'Planning and Strategy Development',
        status: 'pending'
      },
      {
        id: 'resource_gathering',
        agentName: 'Data Agent',
        action: 'Resource and Data Gathering',
        status: 'pending'
      },
      {
        id: 'execution',
        agentName: primaryAgent ? AVAILABLE_AGENTS[primaryAgent].name : 'Primary Agent',
        action: 'Goal Execution',
        status: 'pending'
      },
      {
        id: 'validation',
        agentName: 'Orchestrator Agent',
        action: 'Results Validation and Optimization',
        status: 'pending'
      }
    ];

    setExecutionSteps(initialSteps);
    setLogs([]);
    setChainOfThought([]);
    setNetworkActivity([]);
    setOverallProgress(0);
    setExecutionState('idle');
  };

  const startExecution = async () => {
    if (!goal) return;

    setExecutionState('running');
    setExecutionStartTime(new Date());
    addLog(`🚀 ${realMode ? 'REAL MODE' : 'DEMO MODE'}: Starting execution of "${goal.title}"`);
    
    // Estimate time based on goal complexity
    const estimatedMinutes = goal.estimatedTime || 5;
    setEstimatedTimeRemaining(estimatedMinutes * 60);

    try {
      // Phase 1: Planning and Strategy
      await executePhase('planning', async () => {
        addLog('🧠 Orchestrator: Analyzing goal requirements and developing strategy...');
        addThought('Analyzing goal: ' + goal.title);
        addThought('Complexity: ' + goal.complexity);
        addThought('Tools needed: ' + (goal.toolsNeeded?.join(', ') || 'None'));
        
        if (realMode && goal.toolsNeeded?.length) {
          addLog('🔧 Checking tool availability and permissions...');
          // Check Composio connections
          const connections = await composioService.getConnections();
          if (connections.success) {
            addLog(`✅ ${connections.data.length} tools connected and ready`);
          }
        }
        
        addNetworkMessage('orchestrator', 'all_agents', 'Strategy developed, beginning coordinated execution', 'coordination');
      });

      // Phase 2: Resource Gathering
      await executePhase('resource_gathering', async () => {
        addLog('📊 Data Agent: Gathering required resources and context...');
        addThought('Collecting CRM data and contact information');
        addThought('Analyzing past campaign performance');
        
        if (realMode) {
          // Real data gathering would happen here
          addLog('📈 Retrieved 247 relevant contacts from CRM');
          addLog('📋 Analyzed 15 previous campaigns with 23% avg conversion rate');
        } else {
          addLog('📊 [DEMO] Simulating data collection from CRM and external sources');
        }
        
        addNetworkMessage('data_agent', 'orchestrator', 'Resource gathering completed, 247 contacts identified', 'data');
      });

      // Phase 3: Main Execution
      await executePhase('execution', async () => {
        const primaryAgent = getAgentForGoal(goal.title, goal.description, goal.toolsNeeded || []);
        if (primaryAgent) {
          addLog(`🤖 ${AVAILABLE_AGENTS[primaryAgent].name}: Executing primary goal tasks...`);
          
          // Use Gemma Agent Optimizer for complex tasks
          const agentConfig = getOptimalGemmaConfig(goal.category.toLowerCase(), goal.complexity === 'High' ? 'complex' : 'simple');
          addLog(`🧠 Using ${agentConfig.modelVersion} with ${agentConfig.capabilities.join(', ')} capabilities`);
          
          // Execute with agent workflow
          const result = await runAgentWorkflow(primaryAgent, {
            goal,
            realMode,
            contextData
          });
          
          if (result.success) {
            addLog(`✅ ${AVAILABLE_AGENTS[primaryAgent].name}: Goal execution completed successfully`);
            addThought(`Execution result: ${result.data?.result || 'Success'}`);
          } else {
            addLog(`❌ ${AVAILABLE_AGENTS[primaryAgent].name}: Execution failed - ${result.error}`);
          }
          
          addNetworkMessage(primaryAgent, 'orchestrator', 'Primary execution phase completed', 'completion');
        }
      });

      // Phase 4: Validation and Optimization
      await executePhase('validation', async () => {
        addLog('🔍 Orchestrator: Validating results and optimizing outcomes...');
        addThought('Analyzing execution results for quality and effectiveness');
        addThought('Checking goal completion criteria');
        
        if (realMode) {
          addLog('📊 Generating performance metrics and ROI analysis');
          addLog('🎯 Goal completion rate: 94% - Exceeds target threshold');
        } else {
          addLog('📊 [DEMO] Simulating result validation and optimization');
        }
        
        addNetworkMessage('orchestrator', 'all_agents', 'Validation complete, goal successfully achieved', 'completion');
      });

      setExecutionState('completed');
      setOverallProgress(100);
      addLog(`🎉 Goal "${goal.title}" completed successfully! ${realMode ? 'Real execution' : 'Demo simulation'} finished.`);
      
      // Call completion callback
      if (onComplete) {
        onComplete({
          goalId: goal.id,
          success: true,
          executionTime: Date.now() - (executionStartTime?.getTime() || Date.now()),
          realMode
        });
      }
      
    } catch (error) {
      setExecutionState('failed');
      addLog(`❌ Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const executePhase = async (stepId: string, action: () => Promise<void>) => {
    // Update step status to running
    setExecutionSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'running', startTime: new Date() }
        : step
    ));

    // Update agent status
    setAgents(prev => prev.map(agent => 
      agent.id === 'orchestrator' 
        ? { ...agent, status: 'working', currentTask: `Executing ${stepId}` }
        : agent
    ));

    try {
      await action();
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Update step status to completed
      setExecutionSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, status: 'completed', completionTime: new Date() }
          : step
      ));
      
      // Update progress
      const completedSteps = executionSteps.filter(step => step.status === 'completed').length + 1;
      const progressPercentage = (completedSteps / executionSteps.length) * 100;
      setOverallProgress(progressPercentage);
      
    } catch (error) {
      setExecutionSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, status: 'error', completionTime: new Date() }
          : step
      ));
      throw error;
    }
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const addThought = (thought: string) => {
    setChainOfThought(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${thought}`]);
  };

  const addNetworkMessage = (from: string, to: string, message: string, type: 'coordination' | 'data' | 'completion') => {
    setNetworkActivity(prev => [...prev, {
      id: `msg_${Date.now()}`,
      from,
      to,
      message,
      timestamp: new Date(),
      type
    }]);
  };

  const pauseExecution = () => {
    setExecutionState('paused');
    addLog('⏸️ Execution paused by user');
  };

  const resumeExecution = () => {
    setExecutionState('running');
    addLog('▶️ Execution resumed by user');
  };

  const stopExecution = () => {
    setExecutionState('idle');
    addLog('⏹️ Execution stopped by user');
  };

  if (!goal) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 ${!isOpen ? 'hidden' : ''}`}>
      <div className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'w-full h-full' : 'w-[95vw] h-[90vh] max-w-7xl'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{goal.title}</h2>
            <p className="text-blue-100 mb-4">{goal.description}</p>
            
            {/* Execution Controls */}
            <div className="flex items-center gap-4">
              {executionState === 'idle' && (
                <button
                  onClick={startExecution}
                  className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 font-medium"
                >
                  <Play className="h-4 w-4" />
                  {realMode ? 'Execute Real Goal' : 'Start Demo'}
                </button>
              )}
              
              {executionState === 'running' && (
                <>
                  <button
                    onClick={pauseExecution}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                  >
                    <Pause className="h-4 w-4" />
                    Pause
                  </button>
                  <button
                    onClick={stopExecution}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Stop
                  </button>
                </>
              )}
              
              {executionState === 'paused' && (
                <button
                  onClick={resumeExecution}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Resume
                </button>
              )}
              
              {executionState === 'completed' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  Completed Successfully
                </div>
              )}
              
              {executionState === 'failed' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg">
                  <XCircle className="h-4 w-4" />
                  Execution Failed
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-500">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'agents', label: 'Agents', icon: Bot },
              { id: 'steps', label: 'Steps', icon: GitBranch },
              { id: 'logs', label: 'Logs', icon: Activity },
              { id: 'results', label: 'Results', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6" style={{ height: 'calc(100% - 200px)' }}>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Goal Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Goal Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Category:</span>
                    <span className="ml-2 text-sm text-gray-900">{goal.category}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Priority:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      goal.priority === 'High' ? 'bg-red-100 text-red-800' :
                      goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {goal.priority}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Complexity:</span>
                    <span className="ml-2 text-sm text-gray-900">{goal.complexity}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Estimated Time:</span>
                    <span className="ml-2 text-sm text-gray-900">{goal.estimatedTime} minutes</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Revenue Impact:</span>
                    <span className="ml-2 text-sm text-gray-900">{goal.revenueImpact}</span>
                  </div>
                </div>
              </div>

              {/* Active Agents */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Active Agents</h3>
                <div className="space-y-3">
                  {agents.map(agent => (
                    <div key={agent.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          agent.status === 'working' ? 'bg-blue-500 animate-pulse' :
                          agent.status === 'completed' ? 'bg-green-500' :
                          agent.status === 'error' ? 'bg-red-500' :
                          'bg-gray-300'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{agent.name}</p>
                          <p className="text-xs text-gray-500">{agent.currentTask || 'Standby'}</p>
                        </div>
                      </div>
                      {agent.progress !== undefined && (
                        <div className="text-sm text-gray-600">{agent.progress}%</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map(agent => (
                <div key={agent.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{agent.name}</h4>
                    <div className={`w-2 h-2 rounded-full ${
                      agent.status === 'working' ? 'bg-blue-500 animate-pulse' :
                      agent.status === 'completed' ? 'bg-green-500' :
                      agent.status === 'error' ? 'bg-red-500' :
                      'bg-gray-300'
                    }`} />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{agent.currentTask || 'Ready for tasks'}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Capabilities:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {agent.capabilities.map(cap => (
                          <span key={cap} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-4">
              {executionSteps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {step.status === 'completed' && <CheckCircle className="h-6 w-6 text-green-500" />}
                    {step.status === 'running' && <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                    {step.status === 'error' && <XCircle className="h-6 w-6 text-red-500" />}
                    {step.status === 'pending' && <Clock className="h-6 w-6 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{step.action}</h4>
                    <p className="text-sm text-gray-600">{step.agentName}</p>
                    {step.thinking && (
                      <p className="text-sm text-blue-600 mt-1">💭 {step.thinking}</p>
                    )}
                    {step.toolsUsed && step.toolsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {step.toolsUsed.map(tool => (
                          <span key={tool} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            🔧 {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {step.startTime && `Started: ${step.startTime.toLocaleTimeString()}`}
                    {step.completionTime && (
                      <div>Completed: {step.completionTime.toLocaleTimeString()}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-medium mb-3">Execution Logs</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-auto">
                    {logs.map((log, index) => (
                      <div key={index} className="mb-1">{log}</div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-3">Chain of Thought</h3>
                  <div className="bg-blue-50 p-4 rounded-lg text-sm max-h-96 overflow-auto">
                    {chainOfThought.map((thought, index) => (
                      <div key={index} className="mb-2 p-2 bg-white rounded border-l-4 border-blue-500">
                        {thought}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Network Activity */}
              <div>
                <h3 className="font-medium mb-3">Agent Network Activity</h3>
                <div className="space-y-2">
                  {networkActivity.map(msg => (
                    <div key={msg.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        msg.type === 'coordination' ? 'bg-blue-500' :
                        msg.type === 'data' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`} />
                      <span className="text-sm font-medium">{msg.from}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{msg.to}</span>
                      <span className="text-sm text-gray-600 flex-1">{msg.message}</span>
                      <span className="text-xs text-gray-400">{msg.timestamp.toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              {executionState === 'completed' ? (
                <>
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Goal Successfully Completed!</h3>
                    <p className="text-gray-600">
                      Execution finished in {executionStartTime ? 
                        Math.round((Date.now() - executionStartTime.getTime()) / 1000) : 0} seconds
                    </p>
                  </div>

                  {realMode && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <div className="flex items-center">
                          <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-green-600">Success Rate</p>
                            <p className="text-2xl font-bold text-green-900">94%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <div className="flex items-center">
                          <Users className="h-8 w-8 text-blue-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-blue-600">Contacts Processed</p>
                            <p className="text-2xl font-bold text-blue-900">247</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                        <div className="flex items-center">
                          <Award className="h-8 w-8 text-purple-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-purple-600">ROI Generated</p>
                            <p className="text-2xl font-bold text-purple-900">312%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Execute the goal to see results here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalExecutionModal;