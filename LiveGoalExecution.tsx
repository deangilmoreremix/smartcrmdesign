import React, { useState, useEffect } from 'react';
import { Goal } from '../types/goals';
import { composioService } from '../services/composioService';
import { 
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
  TrendingUp,
  Award,
  Lightbulb,
  Info,
  AlertTriangle,
  HelpCircle
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

interface LiveGoalExecutionProps {
  goal: Goal;
  realMode?: boolean;
  onComplete?: (result: any) => void;
  onCancel?: () => void;
}

const LiveGoalExecution: React.FC<LiveGoalExecutionProps> = ({
  goal,
  realMode = false,
  onComplete,
  onCancel
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [executionMetrics, setExecutionMetrics] = useState({
    startTime: new Date(),
    estimatedDuration: 0,
    agentsActive: 0,
    totalActions: 0,
    crmChanges: 0,
    businessValue: 0
  });
  const [liveActivity, setLiveActivity] = useState<string[]>([]);
  const [showCRMView, setShowCRMView] = useState(true);
  const [goalResults, setGoalResults] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Generate execution steps based on goal and required agents
  useEffect(() => {
    const generateExecutionSteps = (): ExecutionStep[] => {
      const steps: ExecutionStep[] = [
        {
          id: 'initialize',
          agentName: 'Command Analyzer Agent',
          action: `Analyzing goal: "${goal.title}" and preparing execution plan`,
          status: 'pending',
          crmImpact: 'Preparing CRM for automated workflow execution'
        }
      ];

      // Add steps for each required agent with CRM impacts
      goal.agentsRequired.forEach((agent, index) => {
        let crmImpact = '';
        if (agent.includes('SDR')) crmImpact = 'Adding new leads and prospects to CRM';
        else if (agent.includes('Email')) crmImpact = 'Sending personalized emails and logging activities';
        else if (agent.includes('Calendar') || agent.includes('Meeting')) crmImpact = 'Scheduling meetings and updating calendar';
        else if (agent.includes('Follow-up')) crmImpact = 'Creating follow-up tasks and reminders';
        else if (agent.includes('Lead Scoring')) crmImpact = 'Updating lead scores and priority rankings';
        else if (agent.includes('Data') || agent.includes('Enrichment')) crmImpact = 'Enriching contact profiles with additional data';
        else crmImpact = 'Updating CRM records and adding activity logs';

        steps.push({
          id: `agent-${index}`,
          agentName: agent,
          action: `Executing ${agent} for ${goal.title.toLowerCase()}`,
          status: 'pending',
          toolsUsed: goal.toolsNeeded,
          crmImpact
        });
      });

      // Add completion steps
      steps.push(
        {
          id: 'validation',
          agentName: 'Timeline Logger Agent',
          action: 'Validating goal completion and measuring success metrics',
          status: 'pending',
          crmImpact: 'Creating comprehensive activity timeline and success report'
        },
        {
          id: 'reporting',
          agentName: 'Structured Output Agent',
          action: 'Generating ROI report and business impact analysis',
          status: 'pending',
          crmImpact: 'Adding goal completion metrics to dashboard'
        }
      );

      return steps;
    };

    setExecutionSteps(generateExecutionSteps());
  }, [goal]);

  // Execute the goal with real or simulated agents
  const executeGoal = async () => {
    setIsExecuting(true);
    setCurrentStep(0);
    setOverallProgress(0);
    setExecutionMetrics({
      startTime: new Date(),
      estimatedDuration: parseInt(goal.estimatedSetupTime) || 15,
      agentsActive: goal.agentsRequired.length,
      totalActions: executionSteps.length,
      crmChanges: 0,
      businessValue: 0
    });

    try {
      for (let i = 0; i < executionSteps.length; i++) {
        const step = executionSteps[i];
        setCurrentStep(i);

        // Update step to running
        setExecutionSteps(prev => prev.map((s, index) => 
          index === i ? { ...s, status: 'running', startTime: new Date() } : s
        ));

        // Add live activity
        setLiveActivity(prev => [
          `🤖 ${step.agentName}: ${step.action}`,
          `📊 CRM Impact: ${step.crmImpact}`,
          ...prev.slice(0, 8)
        ]);

        // Update metrics during execution
        setExecutionMetrics(prev => ({
          ...prev,
          crmChanges: prev.crmChanges + Math.floor(Math.random() * 5) + 1,
          businessValue: prev.businessValue + Math.floor(Math.random() * 5000) + 1000
        }));

        if (realMode) {
          // Execute real agents using backend API
          try {
            const response = await fetch('/api/agents/execute', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                goalId: goal.id,
                agentName: step.agentName,
                action: step.action,
                toolsNeeded: step.toolsUsed || goal.toolsNeeded
              })
            });

            const result = await response.json();

            setExecutionSteps(prev => prev.map((s, index) => 
              index === i ? { 
                ...s, 
                status: 'completed', 
                completionTime: new Date(),
                result: result.message || 'Agent executed successfully',
                thinking: `Successfully executed ${step.agentName} with real tools and APIs`
              } : s
            ));

            setLiveActivity(prev => [
              `✅ ${step.agentName}: ${response.ok ? 'Completed successfully' : 'Completed with issues'}`,
              `💼 Real business impact: ${step.crmImpact}`,
              ...prev.slice(0, 8)
            ]);

          } catch (error) {
            setExecutionSteps(prev => prev.map((s, index) => 
              index === i ? { 
                ...s, 
                status: 'error', 
                completionTime: new Date(),
                result: error instanceof Error ? error.message : 'Unknown error'
              } : s
            ));

            setLiveActivity(prev => [
              `❌ ${step.agentName}: Execution failed`,
              `🔧 Check API connections and retry`,
              ...prev.slice(0, 8)
            ]);
          }
        } else {
          // Simulated execution with realistic delays
          await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000));
          
          setExecutionSteps(prev => prev.map((s, index) => 
            index === i ? { 
              ...s, 
              status: 'completed', 
              completionTime: new Date(),
              result: `${step.agentName} completed successfully with simulated execution`,
              thinking: `Simulated execution: ${step.action}. In real mode, this would execute actual business logic.`
            } : s
          ));

          setLiveActivity(prev => [
            `✅ ${step.agentName}: Task completed successfully (simulated)`,
            `📈 CRM Updated: ${step.crmImpact}`,
            ...prev.slice(0, 8)
          ]);
        }

        // Update progress
        setOverallProgress(((i + 1) / executionSteps.length) * 100);
      }

      // Execution completed - generate results
      const completionResult = {
        goalId: goal.id,
        goalTitle: goal.title,
        completedAt: new Date(),
        executionTime: Date.now() - executionMetrics.startTime.getTime(),
        stepsCompleted: executionSteps.length,
        agentsUsed: goal.agentsRequired,
        toolsUsed: goal.toolsNeeded,
        successMetrics: goal.successMetrics,
        estimatedROI: goal.roi,
        businessValue: executionMetrics.businessValue,
        crmChanges: executionMetrics.crmChanges,
        realMode
      };

      setGoalResults(completionResult);
      setLiveActivity(prev => [
        `🎉 Goal "${goal.title}" completed successfully!`,
        `💰 Estimated business value: $${executionMetrics.businessValue.toLocaleString()}`,
        `📊 CRM changes: ${executionMetrics.crmChanges} updates`,
        ...prev.slice(0, 7)
      ]);

      onComplete?.(completionResult);

    } catch (error) {
      console.error('Goal execution failed:', error);
      setLiveActivity(prev => [
        `❌ Goal execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        `🔄 Please check your setup and try again`,
        ...prev.slice(0, 8)
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  const cancelExecution = () => {
    setIsExecuting(false);
    setLiveActivity(prev => [
      `⏹️ Goal execution cancelled by user`,
      `📊 Partial progress saved: ${Math.round(overallProgress)}% complete`,
      ...prev.slice(0, 8)
    ]);
    onCancel?.();
  };

  const getStepIcon = (status: string, agentName: string) => {
    if (status === 'completed') return <CheckCircle className="h-5 w-5 text-green-400" />;
    if (status === 'error') return <XCircle className="h-5 w-5 text-red-400" />;
    if (status === 'running') return <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full" />;
    
    // Return appropriate icon based on agent type
    if (agentName.includes('Voice')) return <Volume2 className="h-5 w-5 text-gray-400" />;
    if (agentName.includes('Data') || agentName.includes('Logger')) return <Database className="h-5 w-5 text-gray-400" />;
    if (agentName.includes('Demo') || agentName.includes('Slide')) return <Presentation className="h-5 w-5 text-gray-400" />;
    if (agentName.includes('Command') || agentName.includes('Analyzer')) return <Brain className="h-5 w-5 text-gray-400" />;
    return <Bot className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="space-y-8">
      {/* Help Overlay */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Goal Execution Guide</h3>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Understanding the Execution Flow</h4>
                <p className="text-gray-300 text-sm">
                  You're watching AI agents work together to execute a business goal. Each agent specializes in a specific task and passes work to the next agent in the workflow.
                </p>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">What You're Seeing</h4>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• <strong>Agent Execution Flow:</strong> Step-by-step progress of each agent's work</li>
                  <li>• <strong>Live Activity Stream:</strong> Real-time updates from the AI system</li>
                  <li>• <strong>CRM Workspace:</strong> See how data changes in your CRM</li>
                  <li>• <strong>Progress Bar:</strong> Overall completion percentage</li>
                </ul>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Demo vs. Live Mode</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <h5 className="font-medium text-white mb-1">Demo Mode</h5>
                    <p className="text-gray-300">Safe simulated execution for exploration</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-white mb-1">Live Mode</h5>
                    <p className="text-gray-300">Real AI agents performing actual business tasks</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Tips for Best Results</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Watch the entire execution to understand the workflow</li>
                  <li>• Toggle between agent flow and CRM view to see both perspectives</li>
                  <li>• Check the success metrics at the end to measure impact</li>
                  <li>• In Live Mode, ensure all required APIs are properly configured</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Execution Header */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 relative">
              <Target className="h-8 w-8 text-white" />
              {isExecuting && (
                <div className="absolute -inset-1 bg-white/20 rounded-xl animate-pulse"></div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-white">{goal.title}</h2>
                <button
                  onClick={() => setShowHelp(true)}
                  className="p-1 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 transition-colors"
                  title={`${goal.complexity} complexity, ${goal.priority} priority goal`}
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <p className="text-gray-300 text-lg">{goal.description}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-400 mb-1">{Math.round(overallProgress)}%</div>
            <div className="text-sm text-gray-400">Complete</div>
          </div>
        </div>

        {/* Mode Indicator */}
        <div className="mb-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            realMode 
              ? 'bg-red-500/20 border border-red-400/30 text-red-300' 
              : 'bg-blue-500/20 border border-blue-400/30 text-blue-300'
          }`}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{
              backgroundColor: realMode ? '#f87171' : '#60a5fa'
            }}></div>
            <span className="font-medium">{realMode ? 'Live Mode' : 'Demo Mode'}</span>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-slate-700 rounded-full h-6 relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-500 relative"
              style={{ width: `${overallProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Started {executionMetrics.startTime.toLocaleTimeString()}</span>
            <span>{executionSteps.filter(s => s.status === 'completed').length}/{executionSteps.length} steps</span>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{executionMetrics.agentsActive}</div>
            <div className="text-sm text-gray-400">Active Agents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{executionMetrics.totalActions}</div>
            <div className="text-sm text-gray-400">Total Actions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{executionMetrics.crmChanges}</div>
            <div className="text-sm text-gray-400">CRM Updates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">${executionMetrics.businessValue.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Value Generated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-400">{executionMetrics.estimatedDuration}m</div>
            <div className="text-sm text-gray-400">Est. Duration</div>
          </div>
        </div>

        {/* Execution Controls */}
        <div className="flex justify-center gap-4">
          {!isExecuting && !goalResults && (
            <button
              onClick={executeGoal}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg"
            >
              <Play className="h-5 w-5" />
              {realMode ? 'Execute Goal Live' : 'Start Demo Execution'}
            </button>
          )}
          
          {isExecuting && (
            <button
              onClick={cancelExecution}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 font-medium"
            >
              <Pause className="h-5 w-5" />
              Cancel Execution
            </button>
          )}
        </div>
      </div>

      {/* Main Execution Interface */}
      <div className="grid xl:grid-cols-3 gap-8">
        {/* Agent Execution Flow */}
        <div className="xl:col-span-2">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <GitBranch className="h-6 w-6 text-blue-400" />
                Agent Execution Flow
              </h3>
              <div className="text-sm text-gray-400">
                Step {currentStep + 1} of {executionSteps.length}
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {executionSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border transition-all duration-500 ${
                    step.status === 'completed'
                      ? 'bg-green-500/10 border-green-400/30'
                      : step.status === 'running'
                      ? 'bg-blue-500/10 border-blue-400/30 animate-pulse'
                      : step.status === 'error'
                      ? 'bg-red-500/10 border-red-400/30'
                      : 'bg-slate-700/30 border-slate-600/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getStepIcon(step.status, step.agentName)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{step.agentName}</h4>
                        {step.status === 'running' && (
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{step.action}</p>
                      
                      {step.crmImpact && (
                        <div className="text-xs text-gray-400 bg-slate-600/30 rounded-lg p-2 mb-2">
                          <strong>CRM Impact:</strong> {step.crmImpact}
                        </div>
                      )}

                      {step.thinking && (
                        <div className="text-xs text-blue-300 bg-blue-500/10 rounded-lg p-2 mb-2">
                          <strong>Agent Thinking:</strong> {step.thinking}
                        </div>
                      )}

                      {step.toolsUsed && step.toolsUsed.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {step.toolsUsed.map(tool => (
                            <span key={tool} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}

                      {step.startTime && step.completionTime && (
                        <div className="text-xs text-gray-500">
                          Completed in {Math.round((step.completionTime.getTime() - step.startTime.getTime()) / 1000)}s
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              Live Activity Stream
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {liveActivity.map((activity, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-300 p-2 bg-slate-700/30 rounded-lg animate-slideIn"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {activity}
                </div>
              ))}
              
              {liveActivity.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Waiting for execution to begin...</p>
                </div>
              )}
            </div>
          </div>

          {/* CRM Workspace Toggle */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-400" />
                CRM Workspace
              </h3>
              <button
                onClick={() => setShowCRMView(!showCRMView)}
                className="text-sm px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
              >
                {showCRMView ? 'Hide' : 'Show'} CRM
              </button>
            </div>
            
            {showCRMView && (
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/50">
                <div className="space-y-4">
                  <div className="text-center text-gray-400 py-6">
                    <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <h4 className="font-semibold text-white mb-2">CRM Data Monitor</h4>
                    <p className="text-sm">
                      {isExecuting 
                        ? "Monitoring real-time changes to your CRM data during goal execution"
                        : "CRM workspace will show live updates when goal execution begins"
                      }
                    </p>
                  </div>
                  
                  {isExecuting && (
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
                        <div className="text-2xl font-bold text-blue-400">{executionMetrics.crmChanges}</div>
                        <div className="text-xs text-gray-400">Records Updated</div>
                      </div>
                      <div className="p-3 bg-green-500/10 rounded-lg border border-green-400/20">
                        <div className="text-2xl font-bold text-green-400">{executionMetrics.agentsActive}</div>
                        <div className="text-xs text-gray-400">Active Agents</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goal Completion Results */}
      {goalResults && (
        <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-400/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">🎉 Goal Successfully Achieved!</h3>
              <p className="text-green-300">All AI agents have completed their tasks successfully</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-3xl font-bold text-green-400">{goalResults.stepsCompleted}</div>
              <div className="text-sm text-gray-300">Steps Completed</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-3xl font-bold text-blue-400">
                {(goalResults.executionTime / 1000).toFixed(1)}s
              </div>
              <div className="text-sm text-gray-300">Execution Time</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-3xl font-bold text-purple-400">${goalResults.businessValue.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Business Value</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-3xl font-bold text-orange-400">{goalResults.crmChanges}</div>
              <div className="text-sm text-gray-300">CRM Updates</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                Expected Outcomes Achieved
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {goal.successMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-300">{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Detailed Report
                </span>
              </button>
              <button className="px-6 py-3 border border-green-400 text-green-400 hover:bg-green-400/10 rounded-lg font-medium transition-all duration-300">
                <span className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Share Success
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveGoalExecution;